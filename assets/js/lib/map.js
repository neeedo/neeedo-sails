/* ##############################################
 *
 *              MAP
 *
 *  Open Layers Map Functionality is contained here.
 *
 * #############################################
 */

var offersOverlay;

/*
 * #############################
 * #
 * # FUNCTIONS
 * #
 * #############################
 */
var map,
    userPosition,
    mapTypeOptions,
    userIcon,
    demandIcon,
    offerIcon,
    lastPositionOnTrigger,
    offerMarkers = [],
    demandMarkers = []
  ;

var initializeMap = function(target, data) {
  map = L.map('map').setView([data.latitude, data.longitude], data.initialZoom);

  // create the tile layer with correct attribution
  var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  var osmAttrib='Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
  var osm = new L.TileLayer(osmUrl, {attribution: osmAttrib});

  map.addLayer(osm);
};

var showUsersPosition = function(userPosition) {
  L.marker([userPosition.latitude, userPosition.longitude], {icon: userIcon}).addTo(map);
};

var distanceIsLargeEnoughForLoadingNewDemandsOffers = function(newPosition, oldPosition) {
  var deltaInKm = 50;

  var distanceBetweenTwoCoordinatesInKm = neeedo.getDistanceBetweenTwoCoordinatesInKm(newPosition, oldPosition);
    if (distanceBetweenTwoCoordinatesInKm > deltaInKm) {
    return true;
  }

  return false;
};

var resetDemandAndOfferMarkers = function() {
  for (var i=0; i < offerMarkers.length; i++ ) {
    var offerMarker = offerMarkers[i];
    map.removeLayer(offerMarker);
  }

  for (var i=0; i < demandMarkers.length; i++ ) {
    var demandMarker = demandMarkers[i];
    map.removeLayer(demandMarker);
  }

  offerMarkers = [];
  demandMarkers = [];
};

var triggerSpecificMapTypeOperations = function (currentPosition) {
  if (undefined === lastPositionOnTrigger || distanceIsLargeEnoughForLoadingNewDemandsOffers(currentPosition, lastPositionOnTrigger)) {
    console.log('resetting...');
    resetDemandAndOfferMarkers();

    switch (mapTypeOptions.mapType) {
      case 'all': // nearest demands + offers
        showUsersPosition(userPosition);
        loadAndShowNearestDemandsAndOffers(currentPosition, map);
        break;
      case 'demandMatching': // nearest demands + offers
        loadAndShowMatchingDemands(map);
        break;
      default:
        console.log('Unknown map type ' + mapTypeOptions.mapType);
    }

    // store position so that reload can be done if distance has changed
    lastPositionOnTrigger = currentPosition;
  }
};

var loadAndShowNearestDemandsAndOffers = function(userPosition, map) {
  loadAndShowNearestOffers(userPosition, map);
  loadAndShowNearestDemands(userPosition, map);
};


var onOffersLoadSuccess = function(returnedData) {
  if ('offerList' in returnedData) {
    if ('offers' in returnedData['offerList']) {
      for (var i=0; i < returnedData['offerList']['offers'].length; i++) {
        var offer = returnedData['offerList']['offers'][i];
        showOfferInMap(map, offer);
      }
    }
  }

  // demand was returned (matching action)
  if ('additionalJson' in returnedData && 'demand' in returnedData.additionalJson) {
    var demand = returnedData.additionalJson.demand;

    // center map on demand
    map.setView([demand.location.latitude, demand.location.longitude]);

    // show demand marker in map
    showDemandInMap(map, demand);
  }
};

var loadAndShowMatchingDemands = function(map) {
  var ajaxEndpointUrl = mapTypeOptions.demandMatchingEndpointUrl;

  var demandMatchingService = new DemandsMatching(ajaxEndpointUrl);
  demandMatchingService.getMatchingOffers({
      limit : mapTypeOptions.itemLimit
    }, onOffersLoadSuccess
  );
};


var loadAndShowNearestOffers = function(userPosition, map)
{
  var ajaxEndpointUrl = mapTypeOptions.offersEndpointUrl;

  var offerService = new Offers(ajaxEndpointUrl);
  offerService.getOffersByCriteria({
        lat : userPosition.latitude,
        lng : userPosition.longitude,
        limit : mapTypeOptions.itemLimit
    }, onOffersLoadSuccess
  );
};

var loadAndShowNearestDemands = function(userPosition, map)
{
   var ajaxEndpointUrl = mapTypeOptions.demandsEndpointUrl;

   var onLoadSuccess = function(returnedData) {
      if ('demandList' in returnedData) {
        if ('demands' in returnedData['demandList']) {
          for (var i=0; i < returnedData['demandList']['demands'].length; i++) {
            var demand = returnedData['demandList']['demands'][i];
            showDemandInMap(map, demand);
          }
        }
      }
   };

  var demandService = new Demands(ajaxEndpointUrl);
  demandService.getDemandsByCriteria({
        lat : userPosition.latitude,
        lng : userPosition.longitude,
        limit : mapTypeOptions.itemLimit
    }, onLoadSuccess
  );
};

var showOfferInMap = function(map, offer) {
  var html = renderOfferInTemplate(offer);
  var offerMarker = L.marker([offer.location.latitude, offer.location.longitude], {icon: offerIcon}).addTo(map);

  offerMarker.bindPopup(html);

  offerMarkers.push(offerMarker);
};

var showDemandInMap = function(map, demand) {
  var html = renderDemandInTemplate(demand);
  var demandMarker = L.marker([demand.location.latitude, demand.location.longitude], {icon: demandIcon}).addTo(map);

  demandMarker.bindPopup(html);
  demandMarkers.push(offerMarker);
};

var renderOfferInTemplate = function(offer) {
  var source = $("#offerMarker").html();
  var template = Handlebars.compile(source);

  var image = '/images/Offer_Dummy.png';
  var imageTitle = 'Dummy';

  var viewOfferUrl = mapTypeOptions.viewOfferUrl;
  var viewUrl = viewOfferUrl.replace('%%offerId%%', offer.id);

  if (offer.imageList.images.length > 0) {
    var firstImage = offer.imageList.images[0];
    image = neeedo.filterImageUrl(offer.imageList.baseUrl) + '/' + firstImage.fileName;
    imageTitle = firstImage.fileName;
  }

  var context = {
          viewUrl: viewUrl,
          tags: offer.tags,
          price: offer.price,
          image: image,
          imageTitle: imageTitle,
          translations: mapTypeOptions.translations,
          user: offer.user
  };

  return template(context);
};

var renderDemandInTemplate = function(demand) {
  var source = $("#demandMarker").html();
  var template = Handlebars.compile(source);
  var viewDemandUrl = mapTypeOptions.viewDemandUrl;
  var viewUrl = viewDemandUrl.replace('%%demandId%%', demand.id);

  var context = {
          viewUrl: viewUrl,
          mustTags: demand.mustTags,
          shouldTags: demand.shouldTags,
          priceFrom: demand.price.min,
          priceTo: demand.price.max,
          translations: mapTypeOptions.translations,
          user: demand.user
  };

  return template(context);
};

var getMapTypeOptions = function()
{
  var mapElement = $('#map');
  var demandsEndpointUrl = mapElement.data('demandsourceurl');
  var offersEndpointUrl = mapElement.data('offersourceurl');
  var mapType = mapElement.data('maptype');
  var viewOfferUrl = mapElement.data('offerviewurl');
  var viewDemandUrl = mapElement.data('demandviewurl');

  return {
    mapType: mapType,
    demandsEndpointUrl: demandsEndpointUrl,
    offersEndpointUrl: offersEndpointUrl,
    demandMatchingEndpointUrl: mapElement.data('demandmatchingsourceurl'),
    viewOfferUrl: viewOfferUrl,
    viewDemandUrl: viewDemandUrl,
    itemLimit: mapElement.data('itemlimit'),
    translations: {
      price: mapElement.data('translationprice'),
      offering: mapElement.data('translationoffering'),
      lookingFor: mapElement.data('translationsearching'),
      details: mapElement.data('translationdetails'),
    }
  }
};


/*
 * #############################
 * #
 * # Processing
 * #
 * #############################
 */
$(document).ready(function() {
  var mapElementId = 'map';
  var mapElement = $('#map');
  userIcon = new L.icon({iconUrl: '/images/icons/user.gif'});
  demandIcon = new L.icon({iconUrl: '/images/icons/demands_pin.png'});
  offerIcon = new L.icon({iconUrl: '/images/icons/offers_pin.png'});

  if (mapElement.length) {
    // default data coming from backend config file
    var initialZoom = mapElement.data('initialzoomstep');

    var mapLocationCenter = getGeolocation(function (position) {
      console.log('in callback');
      // default position as returned by backend
      userPosition = {
        longitude : mapElement.data('defaultlongitude'),
        latitude : mapElement.data('defaultlatitude')
      };

      if (position) {
        // geolocation given
        userPosition.longitude = position.coords.longitude;
        userPosition.latitude = position.coords.latitude;
      }

      initializeMap(mapElementId, {
        longitude: userPosition.longitude,
        latitude: userPosition.latitude,
        initialZoom: initialZoom
      });

      console.log('initialized map :)');
      mapTypeOptions = getMapTypeOptions();

      // initially load near offers + demands to users position
      triggerSpecificMapTypeOperations(userPosition);

      // load near demands + offers if the user refocused the map
      map.on('moveend', function(e) {
         var newPosition = {
           longitude: map.getCenter().lng,
           latitude: map.getCenter().lat
         };

        triggerSpecificMapTypeOperations(newPosition);
      });
    });
  }
});
