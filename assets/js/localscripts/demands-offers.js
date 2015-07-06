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

var locationIsValid = function (latInput, lngInput) {
  var coordinatePattern = /[0-9]+\.[0-9]+/;
  return latInput.val().match(coordinatePattern) && lngInput.val().match(coordinatePattern);
}

var setLocationIfChecked = function (event) {
  var form = event.target;

  event.preventDefault();
  event.stopPropagation();

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
      }
      form.submit();
    };
    neeedo.getLocation(onLocationCallback);
  } else {
    // make sure that location was set via address
    if (!locationIsValid(latInput, lngInput)) {
      alert(geolocationCheckbox.data('translationnoaddress'));
    } else {
      form.submit();
    }
  }

};

var setLatitudeAndLongitudeInHiddenField = function (location) {
  var latInput = $("input[name='lat']");
  var lngInput = $("input[name='lng']");

  latInput.val(location.latitude);
  lngInput.val(location.longitude);
};

var toggleGeolocationAndAdressFields = function (useGeolocation) {
  if (useGeolocation) {
    document.getElementById("address").disabled = true;
    $('#address').addClass('disabled');
    $('#address').attr("placeholder", "");
    classie.removeClass(document.getElementById('errorLoc'), 'showError' );
  } else {
    document.getElementById("address").disabled = false;
    $('#address').removeClass('disabled');
    $('#address').attr("placeholder", "Landsberger Allee, Berlin")
  }
};

var provideAddressAutoComplete = function () {
  address.autocomplete({
    source: function (request, response) {
      $.ajax({
        url: "http://nominatim.openstreetmap.org/search",
        dataType: "json",
        data: {
          q: request.term,
          format: 'json'
        },
        success: function (data) {
          // hand in the location names
          var fetchedAddresses = [];
          addressLatLngMap = {};

          for (var i = 0; i < data.length; i++) {
            var address = data[i];
            if ('display_name' in address
              && 'lat' in address && 'lon' in address) {
              fetchedAddresses.push({
                label: address.display_name,
                location: {
                  latitude: address.lat,
                  longitude: address.lon
                }
              });
            }
          }
          ;

          response(fetchedAddresses);
        }
      });
    },
    minLength: 3,
    select: function (event, ui) {
      if (ui.item) {
        // get complete address JSON from selection
        var location = ui.item.location;

        // now, set latitude & longitude in hidden field
        setLatitudeAndLongitudeInHiddenField(location);
      }
    },
    open: function () {
      $(this).removeClass("ui-corner-all").addClass("ui-corner-top");
    },
    close: function () {
      $(this).removeClass("ui-corner-top").addClass("ui-corner-all");
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

var validateOfferForm = function(){
  classie.removeClass(document.getElementById('errorTag'), 'showError' );
  classie.removeClass(document.getElementById('errorPrice'), 'showError' );
  classie.removeClass(document.getElementById('errorLoc'), 'showError' );
  var bool = true;
  var price = document.getElementById('priceOffer').value.toString();
  if(document.getElementById('tagsOffer').value == ""){
    classie.addClass(document.getElementById('errorTag'), 'showError' );
    bool = false;
  }
  var regex = /^[0-9]+(\.[0-9]{1,2})?$/;
  if(price == "" || !price.match(regex)){
    classie.addClass(document.getElementById('errorPrice'), 'showError' );
    bool = false;
  }
  if(!document.getElementById('useGeolocation').checked){
    if(document.getElementById('address').value == ""){
      classie.addClass(document.getElementById('errorLoc'), 'showError' );
      bool = false;
    }
  }
  return bool;
};

var validateDemandForm = function(){
  classie.removeClass(document.getElementById('errorTag'), 'showError' );
  classie.removeClass(document.getElementById('errorMinPrice'), 'showError' );
  classie.removeClass(document.getElementById('errorMaxPrice'), 'showError' );
  classie.removeClass(document.getElementById('errorDistance'), 'showError' );
  classie.removeClass(document.getElementById('errorLoc'), 'showError' );
  var bool = true;

  var tagitList = document.getElementsByClassName('tagit');
  console.log(tagitList);
  if(typeof(tagitList) == 'undefined' || tagitList == null || $(".tagit li").length <= 1){
    classie.addClass(document.getElementById('errorTag'), 'showError' );
    bool = false;
  }

  var minPrice = document.getElementById('minPriceDemand').value.toString();
  var maxPrice = document.getElementById('maxPriceDemand').value.toString();
  var distance = document.getElementById('maxDistanceDemand').value.toString();
  var regex = /^[0-9]+(\.[0-9]{1,2})?$/;
  if(minPrice == "" || !minPrice.match(regex)){
    classie.addClass(document.getElementById('errorMinPrice'), 'showError' );
    bool = false;
  }
  if(maxPrice == "" || !maxPrice.match(regex)){
    classie.addClass(document.getElementById('errorMaxPrice'), 'showError' );
    bool = false;
  }
  if(minPrice > maxPrice){
    classie.addClass(document.getElementById('errorMaxMin'), 'showError' );
    bool = false;
  }

  if(distance == "" || !distance.match(regex)){
    classie.addClass(document.getElementById('errorDistance'), 'showError' );
    bool = false;
  }
  if(!document.getElementById('useGeolocation').checked){
    if(document.getElementById('address').value == ""){
      classie.addClass(document.getElementById('errorLoc'), 'showError' );
      bool = false;
    }
  }
  return bool;
};

$(document).ready(function () {
  var offerForm = $('#createOffer');
  var demandForm = $('#createDemand');
  geolocationCheckbox = $('#useGeolocation');
  address = $('#address');
  addressContainer = $('#addressContainer');


  offerForm.on('submit', setLocationIfChecked);
  demandForm.on('submit', setLocationIfChecked);

  /* ##################
   * #
   * # Location feature
   * #
   * ##################
   */
  if (!geolocationCheckbox.checked) {
    document.getElementById("address").disabled = true;
    $('#address').addClass('disabled');
    $('#address').attr("placeholder", "");
  }

  geolocationCheckbox.change(function () {
    toggleGeolocationAndAdressFields(geolocationCheckbox.prop('checked'));
  });

  function split(val) {
    return val.split(/,\s*/);
  }

  var uploadBtn = document.getElementById("showUpload");
  if(typeof(uploadBtn) != 'undefined' && uploadBtn != null){
    uploadBtn.onclick = function() {
      var imageUploadContainer = document.getElementById('imgUploadStep');
      classie.toggle( imageUploadContainer, 'hideLi' );
    };
  }

  provideAddressAutoComplete();
  /* ##################
   * #
   * # Tag completion
   * #
   * ##################*/

  $("#mustTagsDemand").tagit({
    autocomplete: {
      source: function (request, response) {
        $.ajax({
          url: neeedo.getApiHttpUrl() + "/completion/tag/" + request.term,
          success: function (data) {
            response($.map(data.completedTags, function (item) {
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
    afterTagAdded: function (event, ui) {
      getSuggests();
    }
  });
  $("#mustTagsDemand")
    .bind("keydown", function (event) {
      if (event.keyCode == $.ui.keyCode.ENTER) {
        event.preventDefault();
        event.stopPropagation();
      } else if (event.keyCode === $.ui.keyCode.TAB &&
        $(this).autocomplete("instance").menu.active) {
        event.preventDefault();
      }
    })
    .autocomplete({
      minLength: 3,
      source: function (request, response) {
        $.ajax({
          url: neeedo.getApiHttpUrl() + "/completion/tag/" + request.term,
          success: function (data) {
            response($.map(data.completedTags, function (item) {
              return {
                label: item,
                value: item
              }
            }));
          }
        });
      },
      focus: function () {
        // prevent value inserted on focus
        return false;
      },
      select: function (event, ui) {
        var terms = split(this.value);
        // remove the current input
        terms.pop();
        // add the selected item
        terms.push(ui.item.value);
        // add placeholder to get the comma-and-space at the end
        terms.push("");
        this.value = terms.join(", ");
        return false;
      },
      change: function (event, ui) {
        getSuggests();
      }
    });

  function getSuggests() {
    $.ajax({
      url: neeedo.getApiHttpUrl() + "/completion/suggest/" + $("#mustTagsDemand").val().trim(),
      success: function (data) {
        console.log(data.suggestedTags.join(" "));
        $("#myTags").text(data.suggestedTags.join(" "));
      }
    });

  }
});
