/* ##############################################
 *
 *              CREATE OFFER & DEMAND
 *
 * #############################################
 */
var geolocationCheckbox,
  address,
  addressContainer
  ;

var locationIsValid = function(latInput, lngInput) {
  var coordinatePattern = /[0-9]+\.[0-9]+/;
  return latInput.val().match(coordinatePattern) && lngInput.val().match(coordinatePattern);
}

var setLocationIfChecked = function(event) {
  event.stopPropagation();
  event.preventDefault();

  var _this = this;
  var latInput = $("input[name='lat']");
  var lngInput = $("input[name='lng']");

  if (geolocationCheckbox.prop('checked')) {
    // use geolocation feature
    var onLocationCallback = function (location) {
      if (false == location) {
        alert(geolocationCheckbox.data('translationnogeolocation'));
      } else {
        setLatitudeAndLongitudeInHiddenField(location);

        _this.submit();
      }
    }
  } else {
    // make sure that location was set via address
    if (!locationIsValid(latInput, lngInput)) {
      alert(geolocationCheckbox.data('translationnoaddress'));
    } else {
      _this.submit();
    }
  }

  neeedo.getLocation(onLocationCallback);
};

var setLatitudeAndLongitudeInHiddenField = function(location) {
  var latInput = $("input[name='lat']");
  var lngInput = $("input[name='lng']");

  latInput.val(location.latitude);
  lngInput.val(location.longitude);
};

var toggleGeolocationAndAdressFields = function(useGeolocation) {
  if (useGeolocation) {
    addressContainer.fadeOut();
  } else {
    addressContainer.fadeIn();
  }
};

var provideAddressAutoComplete = function() {
  address.autocomplete({
    source: function( request, response ) {
      $.ajax({
        url: "http://nominatim.openstreetmap.org/search",
        dataType: "json",
        data: {
          q: request.term,
          format: 'json'
        },
        success: function( data ) {
          // hand in the location names
          var fetchedAddresses = [];
          addressLatLngMap = {};

          for (var i = 0; i < data.length; i++) {
            var address = data[i];
            if ('display_name' in address
              && 'lat' in address && 'lon' in address) {
              fetchedAddresses.push({
                label : address.display_name ,
                location : {
                  latitude: address.lat,
                  longitude: address.lon
                }
              });
            }
          };

          response( fetchedAddresses );
        }
      });
    },
    minLength: 3,
    select: function( event, ui ) {
      if (ui.item) {
        // get complete address JSON from selection
        var location = ui.item.location;

        // now, set latitude & longitude in hidden field
        setLatitudeAndLongitudeInHiddenField(location);
      }
    },
    open: function() {
      $( this ).removeClass( "ui-corner-all" ).addClass( "ui-corner-top" );
    },
    close: function() {
      $( this ).removeClass( "ui-corner-top" ).addClass( "ui-corner-all" );
    }
  });

  /*
   $.get(requestUrl)
   .done(function( data ) {
   // show autocomplete values
   var fetchedAddresses = [];
   for (var i = 0; i < data.length; i++) {
   var address = data[i];
   if ('display_name' in address) {
   fetchedAddresses.push(address.display_name);
   }
   };

   $('#address').autocomplete({
   source: fetchedAddresses
   });
   });*/
};

$(document).ready(function () {
  var offerForm = $('#createOffer');
  var demandForm = $('#createDemand');
  geolocationCheckbox = $('#useGeolocation');
  address = $('#address');
  addressContainer = $('#addressContainer');

  /* ##################
   * #
   * # Location feature
   * #
   * ##################
   */
  if (!geolocationCheckbox.checked) {
    addressContainer.hide();
  }

  geolocationCheckbox.change(function() {
    toggleGeolocationAndAdressFields(geolocationCheckbox.prop('checked'));
  });


  provideAddressAutoComplete();

  offerForm.on('submit', setLocationIfChecked);
  demandForm.on('submit', setLocationIfChecked);

  /* ##################
   * #
   * # Tag completion
   * #
   * ##################
   */
  $("#mustTagsDemand").tagit({
    autocomplete: {
      source: function( request, response ) {
        $.ajax({
          url: neeedo.getApiHttpUrl() + "/completion/tag/" + request.term,
          success: function( data ) {
            response( $.map( data.completedTags, function( item ) {
              return {
                label: item,
                value: item
              }
            }));
          }
        });
      },
      minLength: 2
    },
    afterTagAdded: function(event, ui) {
      getSuggests();
    }
  });

  function getSuggests() {
    $.ajax({
      url: neeedo.getApiHttpUrl() + "/completion/suggest/" + $("#mustTagsDemand").tagit("assignedTags").join(" "),
      success: function( data ) {
        console.log(data.suggestedTags.join(" "));
        $("#myTags").text(data.suggestedTags.join(" "));
      }
    });

  }
});
