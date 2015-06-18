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
    userIcon,
    demandIcon,
    offerIcon
  ;

var transformToSphereCoordinates = function(longitude, latitude) {
  var coord = ol.proj.transform([longitude, latitude], 'EPSG:4326', 'EPSG:3857'); // sphere coordinates
  return coord;
};

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

var triggerSpecificMapTypeOperations = function (userPosition, mapTypeOptions) {
  switch (mapTypeOptions.mapType) {
    case 'all': // nearest demands + offers
      loadAndShowNearestDemandsAndOffers(userPosition, map, mapTypeOptions);
      break;
    default:
      console.log('Unknown map type ' + mapTypeOptions.mapType);
  }
};

var loadAndShowNearestDemandsAndOffers = function(userPosition, map, mapTypeOptions) {
  loadAndShowNearestOffers(userPosition, map, mapTypeOptions);
  loadAndShowNearestDemands(userPosition, map, mapTypeOptions);
};

var loadAndShowNearestOffers = function(userPosition, map, mapTypeOptions)
{
   var ajaxEndpointUrl = mapTypeOptions.offersEndpointUrl;

   var onLoadSuccess = function(returnedData) {
      if ('offerList' in returnedData) {
        if ('offers' in returnedData['offerList']) {
          for (var i=0; i < returnedData['offerList']['offers'].length; i++) {
            var offer = returnedData['offerList']['offers'][i];
            showOfferInMap(map, offer, mapTypeOptions);
          }
        }
      }
   };

  var offerService = new Offers(ajaxEndpointUrl);
  offerService.getOffersByCriteria({
        lat : userPosition.latitude,
        lng : userPosition.longitude
    }, onLoadSuccess
  );
};

var loadAndShowNearestDemands = function(userPosition, map, mapTypeOptions)
{
   var ajaxEndpointUrl = mapTypeOptions.demandsEndpointUrl;

   var onLoadSuccess = function(returnedData) {
      if ('demandList' in returnedData) {
        if ('demands' in returnedData['demandList']) {
          for (var i=0; i < returnedData['demandList']['demands'].length; i++) {
            var demand = returnedData['demandList']['demands'][i];
            showDemandInMap(map, demand, mapTypeOptions);
          }
        }
      }
   };

  var demandService = new Demands(ajaxEndpointUrl);
  demandService.getDemandsByCriteria({
        lat : userPosition.latitude,
        lng : userPosition.longitude
    }, onLoadSuccess
  );
};

var showOfferInMap = function(map, offer, mapTypeOptions) {
  var html = renderOfferInTemplate(offer, mapTypeOptions);
  var offerMarker = L.marker([offer.location.latitude, offer.location.longitude], {icon: offerIcon}).addTo(map);

  offerMarker.bindPopup(html);
};

var showDemandInMap = function(map, demand, mapTypeOptions) {
  var html = renderDemandInTemplate(demand, mapTypeOptions);
  var demandMarker = L.marker([demand.location.latitude, demand.location.longitude], {icon: demandIcon}).addTo(map);

  demandMarker.bindPopup(html);
};

var filterImageUrl = function(originalUrl) {
  return originalUrl.replace(neeedo.getApiHttpsUrl(), neeedo.getApiHttpUrl());
};

var renderOfferInTemplate = function(offer, mapTypeOptions) {
  var source = $("#offerMarker").html();
  var template = Handlebars.compile(source);

  var image = '/images/Offer_Dummy.png';
  var imageTitle = 'Dummy';

  var viewOfferUrl = mapTypeOptions.viewOfferUrl;
  var viewUrl = viewOfferUrl.replace('%%offerId%%', offer.id);

  if (offer.imageList.images.length > 0) {
    var firstImage = offer.imageList.images[0];
    image = filterImageUrl(offer.imageList.baseUrl) + '/' + firstImage.fileName;
    imageTitle = firstImage.fileName;
  }

  var context = {
          viewUrl: viewUrl,
          tags: offer.tags,
          price: offer.price,
          image: image,
          imageTitle: imageTitle,
          translations: mapTypeOptions.translations
  };

  return template(context);
};

var renderDemandInTemplate = function(demand, mapTypeOptions) {
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
          translations: mapTypeOptions.translations
  };

  return template(context);
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
  demandIcon = new L.icon({iconUrl: '/images/icons/demand.png'});
  offerIcon = new L.icon({iconUrl: '/images/icons/offer.png'});

  if (mapElement.length) {
    // default data coming from backend config file
    var initialZoom = mapElement.data('initialzoomstep');
    var demandsEndpointUrl = mapElement.data('demandsourceurl');
    var offersEndpointUrl = mapElement.data('offersourceurl');
    var mapType = mapElement.data('maptype');
    var viewOfferUrl = mapElement.data('offerviewurl');
    var viewDemandUrl = mapElement.data('demandviewurl');

    var mapLocationCenter = getGeolocation(function (position) {
      console.log('got position: ' + position);

      // default position as returned by backend
      var userPosition = {
        longitude : mapElement.data('defaultlongitude'),
        latitude : mapElement.data('defaultlatitude')
      };

      if (position) {
        // geolocation given
        userPosition.longitude = position.coords.longitude;
        userPosition.latitude = position.coords.latitude;
      }

      var map = initializeMap(mapElementId, {
        longitude: userPosition.longitude,
        latitude: userPosition.latitude,
        initialZoom: initialZoom
      });

      console.log('initialized map :)');

      showUsersPosition(userPosition);
      triggerSpecificMapTypeOperations(userPosition,  {
        mapType: mapType,
        demandsEndpointUrl: demandsEndpointUrl,
        offersEndpointUrl: offersEndpointUrl,
        viewOfferUrl: viewOfferUrl,
        viewDemandUrl: viewDemandUrl,
        translations: {
          price: mapElement.data('translationprice'),
          offering: mapElement.data('translationoffering'),
          lookingFor: mapElement.data('translationsearching'),
          details: mapElement.data('translationdetails')
        }
      });
    });
  }
});
