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
    userIcon;

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
  loadAndShowNearestOffers(userPosition, map, mapTypeOptions.offersEndpointUrl);
};

var loadAndShowNearestOffers = function(userPosition, map, ajaxEndpointUrl)
{
   var onLoadSuccess = function(returnedData) {
      if ('offerList' in returnedData) {
        if ('offers' in returnedData['offerList']) {
          for (var i=0; i < returnedData['offerList']['offers'].length; i++) {
            var offer = returnedData['offerList']['offers'][i];
            var offerFeature = showOfferInMap(map, offer);
            offersOverlay.addFeature(offerFeature);
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


var renderInTemplate = function(offer) {
  var source = $("#offerMarker").html();
  var template = Handlebars.compile(source);

  var image = '/images/Offer_Dummy.png';
  var imageTitle = 'Dummy';
  
  if (offer.imageList.images.length > 0) {
    var firstImage = offer.imageList.images[0];
    image = offer.imageList.baseUrl + '/' + firstImage.fileName;
    imageTitle = firstImage.fileName;
  }

  var context = {tags: offer.tags, price: offer.price, image: image, imageTitle: imageTitle};
  return template(context);
};

var showOfferInMap = function(map, offer) {
  var html = renderInTemplate(offer);
  var offerMarker = L.marker([offer.location.latitude, offer.location.longitude]).addTo(map);

  var tags = offer.tags.join(', ');
  offerMarker.bindPopup(html);

  return offerFeature;
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
  userIcon = new  L.icon({iconUrl: '/images/icons/user.gif'});

  if (mapElement.length) {
    // default data coming from backend config file
    var initialZoom = mapElement.data('initialzoomstep');
    var demandsEndpointUrl = mapElement.data('demandsourceurl');
    var offersEndpointUrl = mapElement.data('offersourceurl');
    var mapType = mapElement.data('maptype');

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
        offersEndpointUrl: offersEndpointUrl
      });
    });
  }
});
