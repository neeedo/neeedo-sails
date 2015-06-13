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
var transformToSphereCoordinates = function(longitude, latitude) {
  var coord = ol.proj.transform([longitude, latitude], 'EPSG:4326', 'EPSG:3857'); // sphere coordinates
  return coord;
};

var initializeMap = function(target, data) {
  var map = new ol.Map({
    target: target,
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM()
      })
    ],
    view: new ol.View({
      center: transformToSphereCoordinates(data.longitude, data.latitude), // sphere coordinates
      zoom: data.initialZoom
    }),
        controls: ol.control.defaults({})
    });

  offersOverlay = new ol.FeatureOverlay({});
  map.addOverlay(offersOverlay);

  return map;
};

var centerMapByGeolocation = function(geolocation, map) {
  if (geolocation.getPosition()) {
    map.getView().setCenter(geolocation.getPosition());
  }
};

var addUsersPositionFeature = function(map) {
  var positionFeature = new ol.Feature();
  positionFeature.setStyle(new ol.style.Style({
    image: new ol.style.Circle({
      radius: 6,
      fill: new ol.style.Fill({
        color: '#3399CC'
      }),
      stroke: new ol.style.Stroke({
        color: '#fff',
        width: 2
      })
    })
  }));

  var featuresOverlay = new ol.FeatureOverlay({
    features: [positionFeature]
  });

  map.addOverlay(featuresOverlay);

  return positionFeature;
};

var showUsersPosition = function(geolocation, positionFeature) {
  var position = geolocation.getPosition();

  if (position) {
    positionFeature.setGeometry(new ol.geom.Point(position));
  }
};

var initializeGeolocation = function(map, positionFeature, mapTypeOptions) {
  var geolocation = new ol.Geolocation({
    projection: map.getView().getProjection()
  });

  geolocation.setTracking(true);

  geolocation.on('change', function(evt) {
    centerMapByGeolocation(geolocation, map);
    showUsersPosition(geolocation, positionFeature);

    triggerSpecificMapTypeOperations(geolocation.getPosition(), map, mapTypeOptions);
  });

  return geolocation;
};

var triggerSpecificMapTypeOperations = function (userPosition, map, mapTypeOptions) {
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
        lat : userPosition[0], // TODO transform from sphere
        lng : userPosition[1]
    }, onLoadSuccess
  );
};


var showOfferInMap = function(map, offer) {
  var offerFeature = new ol.Feature();

  offerFeature.setStyle(new ol.style.Style({
    image: new ol.style.Circle({
      radius: 6,
      fill: new ol.style.Fill({
        color: '#88BEB1'
      }),
      stroke: new ol.style.Stroke({
        color: '#fff',
        width: 2
      }),
      text: offer.tags.join(',')
    })
  }));

  offerFeature.on('click', function(evt) {
    console.log('You clicked the offer');
  });

  offerFeature.setGeometry(new ol.geom.Point(transformToSphereCoordinates(offer.location.latitude, offer.location.longitude)));

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

  if (mapElement.length) {
    // default data coming from backend config file
    var longitude = mapElement.data('defaultlongitude');
    var latitude = mapElement.data('defaultlatitude');
    var initialZoom = mapElement.data('initialzoomstep');
    var demandsEndpointUrl = mapElement.data('demandsourceurl');
    var offersEndpointUrl = mapElement.data('offersourceurl');
    var mapType = mapElement.data('maptype');

    var map = initializeMap(mapElementId, {
      longitude: longitude,
      latitude: latitude,
      initialZoom: initialZoom
    });

    console.log('initialized map :)');

    var positionFeature = addUsersPositionFeature(map);
    var geolocation = initializeGeolocation(map, positionFeature, {
      mapType: mapType,
      demandsEndpointUrl: demandsEndpointUrl,
      offersEndpointUrl: offersEndpointUrl
    });
  }

});
