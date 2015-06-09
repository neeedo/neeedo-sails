/* ##############################################
 *
 *              MAP
 *
 *  Open Layers Map Functionality is contained here.
 *
 * #############################################
 */

/*
 * #############################
 * #
 * # FUNCTIONS
 * #
 * #############################
 */

var initializeMap = function(target, data) {
  return new ol.Map({
    target: target,
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM()
      })
    ],
    view: new ol.View({
      center: ol.proj.transform([data.longitude, data.latitude], 'EPSG:4326', 'EPSG:3857'), // sphere coordinates
      zoom: data.initialZoom
    }),
    controls: ol.control.defaults({})
  });
};

var centerMapByGeolocation = function(geolocation, map) {
  if (geolocation.getPosition()) {
    map.getView().setCenter(geolocation.getPosition());
  }
};

var initializeGeolocation = function(map, positionFeature) {
  var geolocation = new ol.Geolocation({
    projection: map.getView().getProjection()
  });

  geolocation.setTracking(true);

  centerMapByGeolocation(geolocation, map);
  showUsersPosition(geolocation, positionFeature);

  geolocation.on('change', function(evt) {
    centerMapByGeolocation(geolocation, map);
    showUsersPosition(geolocation, positionFeature);
  });

  return geolocation;
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
    map: map,
    features: [positionFeature]
  });

  return positionFeature;
};

var showUsersPosition = function(geolocation, positionFeature) {
  var position = geolocation.getPosition();

  if (position) {
    positionFeature.setGeometry(new ol.geom.Point(position));
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

  if (mapElement.length) {
    // default data coming from backend config file
    var longitude = mapElement.data('defaultlongitude');
    var latitude = mapElement.data('defaultlatitude');
    var initialZoom = mapElement.data('initialzoomstep');

    var map = initializeMap(mapElementId, {
      longitude: longitude,
      latitude: latitude,
      initialZoom: initialZoom
    });

    console.log('initialized map :)');

    var positionFeature = addUsersPositionFeature(map);
    var geolocation = initializeGeolocation(map, positionFeature);
  }

});
