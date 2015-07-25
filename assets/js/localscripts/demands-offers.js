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
        fadeOutForm();
        form.submit();
      }
    };
    neeedo.getLocation(onLocationCallback);
  } else {
    // make sure that location was set via address
    if (!locationIsValid(latInput, lngInput)) {
      alert(geolocationCheckbox.data('translationnoaddress'));
    } else {
      fadeOutForm();
      form.submit();
    }
  }
};

var fadeOutForm = function(){
  if(null != document.getElementById('createOffer')) {
    classie.addClass(document.getElementById('createOffer'), 'fadeOutForm' );
  } else{
    classie.addClass(document.getElementById('createDemand'), 'fadeOutForm' );
  }
  classie.addClass(document.getElementById('formHeading'), 'fadeOutForm' );
  classie.addClass(document.getElementById('loading'), 'fadeInLoadingMsg' );
}

var setLatitudeAndLongitudeInHiddenField = function (location) {
  var latInput = $("input[name='lat']");
  var lngInput = $("input[name='lng']");

  latInput.val(location.latitude);
  lngInput.val(location.longitude);
};

var toggleGeolocationAndAdressFields = function (useGeolocation) {
  if (useGeolocation) {
    document.getElementById("address").disabled = true;
    $('#address').addClass('hide');
    $('#addressLabel').addClass('hide');
    classie.removeClass(document.getElementById('errorLoc'), 'showError' );
  } else {
    document.getElementById("address").disabled = false;
    $('#address').removeClass('hide');
    $('#address').attr("placeholder", "Landsberger Allee, Berlin");
    $('#addressLabel').removeClass('hide');
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
  var regex = /^[0-9]+([\,|\.][0-9]{1,2})?$/;
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
  classie.removeClass(document.getElementById('errorMaxMin'), 'showError' );
  classie.removeClass(document.getElementById('errorDistance'), 'showError' );
  classie.removeClass(document.getElementById('errorLoc'), 'showError' );
  var bool = true;

  var mustTagsContainer = document.getElementById('mustTagsContainer');
  var tagitList = mustTagsContainer.getElementsByClassName('tagit');
  if(typeof(tagitList) == 'undefined' || tagitList == null || tagitList[0].getElementsByTagName('li').length <= 1){
    classie.addClass(document.getElementById('errorTag'), 'showError' );
    bool = false;
  }

  var minPrice = document.getElementById('minPriceDemand').value.toString();
  var maxPrice = document.getElementById('maxPriceDemand').value.toString();
  var distance = document.getElementById('maxDistanceDemand').value.toString();

  var regex = /^[0-9]+([\,|\.][0-9]{1,2})?$/;

  if(minPrice == "" || !minPrice.match(regex)){
    classie.addClass(document.getElementById('errorMinPrice'), 'showError' );
    bool = false;
  }
  if(maxPrice == "" || !maxPrice.match(regex)){
    classie.addClass(document.getElementById('errorMaxPrice'), 'showError' );
    bool = false;
  }
  if(!isNaN(parseFloat(minPrice))
    && !isNaN(parseFloat(maxPrice))
    && parseFloat(minPrice) > parseFloat(maxPrice)){
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

  $( "#slider-range" ).slider({
    range: true,
    min: 0,
    max: 500,
    values: [ 25, 300 ],
    slide: function( event, ui ) {
      $( "#minPriceDemand").val(ui.values[ 0 ] + ".00");
      $( "#maxPriceDemand").val(ui.values[ 1 ] + ".00");
    }
  });
  $( "#minPriceDemand" ).val($( "#slider-range" ).slider( "values", 0 ) + ".00");
  $( "#maxPriceDemand" ).val($( "#slider-range" ).slider( "values", 1 ) + ".00");


  $( "#minPriceDemand" ).keyup(function() {
    var minPrice = document.getElementById('minPriceDemand').value.toString();
    if(!isNaN(parseFloat(minPrice))){
      $("#slider-range").slider('values',0,minPrice);
      console.log(minPrice);
    }
  });

  $( "#maxPriceDemand" ).keyup(function() {
    var maxPrice = document.getElementById('maxPriceDemand').value.toString();
    if(!isNaN(parseFloat(maxPrice))){
      $("#slider-range").slider('values',1,maxPrice);
      console.log(maxPrice);
    }
  });

  offerForm.on('submit', setLocationIfChecked);
  demandForm.on('submit', setLocationIfChecked);

  /* ##################
   * #
   * # Location feature
   * #
   * ##################
   */
  if (!geolocationCheckbox.checked) {
    $('#address').addClass('hide');
    $('#addressLabel').addClass('hide');
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
  var tagInputsClassName = '.providesTagCompletion';
  var tagInputs = $(tagInputsClassName);

  // set placeholder texts
  tagInputs.each(function (index) {
    var _this = $(this);
    _this.tagit({
      placeholderText: _this.data('placeholder')
    });
  });

  tagInputs.tagit({
    autocomplete: {
      source: function (request, response) {
        currentInput = $(this);
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
      getSuggests($(this));
    },
    afterTagRemoved: function (event, ui) {
      var tagEl = $(this);
      var tags = tagEl.tagit("assignedTags");

      if (tags.length > 0) {
        getSuggests(tagEl);
      } else {
        clearSuggests(tagEl);
      }
    }
  });


  /* ##################
   * #
   * # Tag suggestion
   * #
   * ##################*/
  var suggestedTagsClass = ".suggestedTags";
  var suggestedTagsEl = $(suggestedTagsClass);

  var suggestedTagClass = ".suggestedTag";

  function getSuggests(tagInputElement) {
    var currentTags = [];

    if (tagInputElement.attr('id') != 'mustTagsDemand') {
      // find all tag input elements and concat all the input fields
      var tagInputElements = $(tagInputsClassName);

      tagInputElements.each(function (index) {
        currentTags.push($(this).val());
      });
    } else {
      currentTags = [tagInputElement.val()]; // only take values from must-tag field
    }

    var tagSuggestionElements = tagInputElement.parent().find(suggestedTagsClass);
    var queryParams = [];
    var limit = undefined;

    if (tagSuggestionElements.attr("data-limit")) {
      limit = tagSuggestionElements.data("limit");
      /*TODO uncomment the following line if limit is supported by API
      queryParams.push("limit=" + limit);*/
    }

    $.ajax({
      url: neeedo.getApiHttpUrl() + "/completion/suggest/"
        + currentTags.join(',').trim()
        + (currentTags.length > 0 && queryParams.length > 0 ? "&" : "?")
        + queryParams.join('&')
      ,
      success: function (data) {
        var html = "";

        // limit number of suggested tags
        if (undefined !== limit) {
          data.suggestedTags = data.suggestedTags.splice(0, limit);
        }

        for (var i=0; i < data.suggestedTags.length; i++) {
          html += '<span class="tagit-label suggestedTag">' + data.suggestedTags[i] + '</span><span>&nbsp;</span>'
        }
        classie.removeClass(document.getElementById('suggestedTagsHeader'), 'hide' );
        tagSuggestionElements.html(html);
      }
    });
  };

  function clearSuggests(tagInputElement) {
    var tagSuggestionElements = tagInputElement.parent().find(suggestedTagsClass);
    tagSuggestionElements.empty();
    classie.addClass(document.getElementById('suggestedTagsHeader'), 'hide' );
  };

  suggestedTagsEl.on('click', suggestedTagClass, function(event) {
    var _this = $(this);
    var tagInputElement = _this.parent().parent().find(tagInputsClassName);

    // add as new tagit tag
    tagInputElement.tagit("createTag", _this.text());
  });
});
