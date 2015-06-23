/* ##############################################
 *
 *              FLASH MESSAGES
 *
 * #############################################
 */

$(".errorMsg").fadeIn('slow',function() {
  $(this).delay(5000).fadeOut('slow');
});

/* ##############################################
 *
 *              MENU TOGGLE
 *
 * #############################################
 */
var menuLeft = document.getElementById( 'cbp-spmenu-s1' ),
				body = document.body;

showLeft.onclick = function() {
  classie.toggle( this, 'active' );
  classie.toggle( menuLeft, 'cbp-spmenu-open' );
};

/*
$( "#loginBtn" ).click(function() {
  $( "#login" ).slideToggle( "slow" );
});
*/

function toggle_visibility(id) {
  var e = document.getElementById(id);
  if(e.style.display == 'none'){
    e.style.display = 'block';
    $('#email').focus();
  }
  else
    e.style.display = 'none';
}

/* ##############################################
 *
 *              IMAGE UPLOAD
 *
 * #############################################
 */
var files = [],
    uploadTargetUrl,
    errors = [],
    fileuploadForm,
    fileuploadFiles,
    offerForm,
    spinnerObject,
    deleteFileButtons,
    errorMessageTarget;

/* #############
 * # functions
 * #
 * #############
 */
var getMaxNumberOfFiles = function() {
  return fileuploadForm.data('maxnumberoffiles');
};

var getOfferHiddenImagesInput = function() {
  return $("input[name='images[]']");
};

var selectedFilesExceedOfferImages = function() {
  var countFiles = files.length;
  var offerFormHiddenImages = getOfferHiddenImagesInput();

  if (offerFormHiddenImages.length) {
    // add count of already uploaded images too the currently added ones
    countFiles += offerFormHiddenImages.length;
  }

  return countFiles > getMaxNumberOfFiles();
};

var validateNumberOfFiles = function() {
  if (0 == files.length) {
    errors.push(errorMessageTarget.data('messagenofiles'));
    return false;
  }

  if (files.length > getMaxNumberOfFiles() || selectedFilesExceedOfferImages()) {
    errors.push(errorMessageTarget.data('messagetoomanyfiles'));
    return false;
  }

  return true;
};

var validateFileTypes = function() {
  var allowedTypes = fileuploadForm.data('allowedtypes');

  for (var fileI=0; fileI < files.length; fileI++) {
    var file = files[fileI];
    var mimeType = file.type;

    // length can be 0 for .ini files for example
    if (0 == mimeType.length || -1 == allowedTypes.indexOf(mimeType)) {
      errors.push(errorMessageTarget.data('messageinvalidtype').replace('%%FILE%%', file.name));
      return false;
    }
  }

  return true;
};

var validateFileSizes = function() {
  var maxAllowedSizeInBytes = fileuploadForm.data('maxallowedsize');

  for (var fileI=0; fileI < files.length; fileI++) {
    var file = files[fileI];
    var fileSize = file.size;

    if (fileSize > maxAllowedSizeInBytes) {
      errors.push(errorMessageTarget.data('messagefiletoolarge').replace('%%FILE%%', file.name));
      return false;
    }
  }

  return true;
};

var validate = function() {
  errors = []; // reset error messages
  errorMessageTarget.html(''); // reset HTML

  if (!validateNumberOfFiles()) {
    return false;
  }

  if (!validateFileTypes()) {
    return false;
  }

  if (!validateFileSizes()) {
    return false;
  }

  return true;
};

var prepareImages = function(event) {
  // store in files array
  files = event.target.files;
};

var uploadImages = function(event) {
  event.stopPropagation();
  event.preventDefault();

  if (validate()) {
    showProgress();
    deactivateOfferSubmit();

    // append images to form data object
    var data = new FormData();

    for (var i=0; i < files.length; i++) {
      var file = files[i];
      data.append('files', file, file.name);
    }

    $.ajax({
      url: uploadTargetUrl,
      type: 'POST',
      data: data,
      cache: false,
      processData: false,
      contentType: false,
      success: function (data, textStatus, jqXHR) {
        hideProgress();
        activateOfferSubmit();
        errorMessageTarget.html('<p>' + data.message + '</p>');
        showUploadedFiles(data.uploadedFiles);
      },
      error: function (jqXHR, textStatus, errorThrown) {
        hideProgress();
        activateOfferSubmit();
        console.log('Upload error: ' + errorThrown);
        errorMessageTarget.html('<p>' + errorMessageTarget.data('messageuploaderror') + '</p>');
      }
    });
  } else {
    errorMessageTarget.html('<p>' + errors.join(' ') + '</p>');
  }
};

var showProgress = function() {
  var opts = {
    lines: 13 // The number of lines to draw
    , length: 28 // The length of each line
    , width: 14 // The line thickness
    , radius: 42 // The radius of the inner circle
    , scale: 1 // Scales overall size of the spinner
    , corners: 1 // Corner roundness (0..1)
    , color: '#000' // #rgb or #rrggbb or array of colors.less
    , opacity: 0.25 // Opacity of the lines
    , rotate: 0 // The rotation offset
    , direction: 1 // 1: clockwise, -1: counterclockwise
    , speed: 1 // Rounds per second
    , trail: 60 // Afterglow percentage
    , fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
    , zIndex: 2e9 // The z-index (defaults to 2000000000)
    , className: 'spinner' // The CSS class to assign to the spinner
    , top: '50%' // Top position relative to parent
    , left: '50%' // Left position relative to parent
    , shadow: false // Whether to render a shadow
    , hwaccel: false // Whether to use hardware acceleration
    , position: 'absolute' // Element positioning
  };

  var targetElement = document.body;
  var spinner = new SpinnerObject(opts).spin(targetElement);
};

var hideProgress = function(){
  $('.spinner').remove();
};

var showUploadedFiles = function(allUploadedFiles) {
  resetImagesInPreviewList();
  resetImagesInOfferHiddenField();

  for (var i = 0; i < allUploadedFiles.images.length; i++ ) {
    var file = allUploadedFiles.images[i];
    addToPreviewList(file);
    addToHiddenFields(file);
  }

  // bind events
  $('.fileupload-deleteImage').on('click', deleteImage);
};

var resetImagesInOfferHiddenField = function() {
  var hiddenFields = $('input[name="images[]"]');

  hiddenFields.remove();
};

var resetImagesInPreviewList = function() {
  $('.previewImages').remove();
};

var renderImageInPreviewList = function(image) {
  var source = $("#offerPreviewImage").html();
  var template = Handlebars.compile(source);

  var context = {
    imageUrl: neeedo.filterImageUrl(image.baseUrl + '/' + image.fileName),
    imageFileName: image.fileName,
    translations: {
      delete: errorMessageTarget.data('messagedelete')
    },
    cssClass : 'previewImages'
  };

  return template(context);
};

var addToPreviewList = function (file) {
  var html = renderImageInPreviewList(file);
  fileuploadFiles.append(html);
};

var addToHiddenFields = function (file) {
  offerForm.append('<input type="hidden" name="images[]" value="' + file.fileName + '">');
};

var deactivateOfferSubmit = function() {
  var submitBtn = offerForm.find("button[type='submit']");
  submitBtn.attr('disabled','disabled');
};

var activateOfferSubmit = function() {
  var submitBtn = offerForm.find("button[type='submit']");
  submitBtn.removeAttr('disabled');
};

var deleteImage = function(event) {
  var _this = $(this);

  var imageName = _this.attr('data-imageName');

  // remove from hidden input fields
  $("input[value='" + imageName + "']").remove();

  // remove from display list
  _this.parent().remove();
};

/* #############
 * # processing
 * #
 * #############
 */
$(document).ready(function () {
  var inputFiles = $('#fileupload-input');
  fileuploadForm = $('#fileupload');
  fileuploadFiles = $('#fileupload-files');
  errorMessageTarget = $('#fileupload-messages');
  SpinnerObject = Spinner;

  var deleteFileButtons = $('.fileupload-deleteImage');
  offerForm = $('#createOffer');

  uploadTargetUrl = fileuploadForm.data('ajaxuploadurl');

  inputFiles.on('change', prepareImages);
  $('#fileupload-submit').on('click', uploadImages);
  deleteFileButtons.on('click', deleteImage);
});

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

var getGeolocation = function(callback) {
  var failureCallback = function(error) {
      // user didn't allow geoloc, request timed out or other error
      callback(false);
  };

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(callback, failureCallback);
  } else {
    // feature is not available
    callback(false);
  }
};

var getLocation = function(onLocationCallback) {
  var geoCallback = function(position) {
    if (false === position) {
      // TODO fallback to other solution
      onLocationCallback(false);
    } else {
      onLocationCallback({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      });
    }
  }

  getGeolocation(geoCallback);
};

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

  getLocation(onLocationCallback);
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


/* ##############################################
 *
 *              CONTENT ELEMENTS
 *       Dynamic Demand + Offer Reloading
 *
 * #############################################
 */

$(document).ready(function() {
  /**
   * Object of URL -> page number to keep info if the page number was already AJAX-requested.
   * @type {{}}
   */
  var alreadyLoaded = {};
  var viewOfferUrl, viewDemandUrl, offerTranslations, demandTranslations,
    lightSliderOffer, lightSliderDemand;

  var lightSliderOfferEl = $("#lightSliderOffer");

  // pagination info for AJAX reload of demands and offers
  var offerFirstPageNumber = lightSliderOfferEl.data('currentpage');
  var offerLimit = lightSliderOfferEl.data('itemlimit');
  var offerSourceUrl = lightSliderOfferEl.data('sourceurl');
  viewOfferUrl = lightSliderOfferEl.data('viewurl');
  offerTranslations = {
    'price' : lightSliderOfferEl.data('translationprice')
  };

  lightSliderOffer = $("#lightSliderOffer").lightSlider({
    loop:true,
    autoWidth: false,
    adaptiveHeight: false,
    easing: 'cubic-bezier(0.25, 0, 0.25, 1)',
    responsive : [
      {
        breakpoint:1024,
        settings: {
          item:2,
          slideMove:1
          }
        }
      ],
    onBeforeSlide: function (el) {
      var nextPageNumber = calculateNextPageNumber(el.getCurrentSlideCount(), offerFirstPageNumber, offerLimit);

      // current slide count starts at 1
      if (el.getCurrentSlideCount() % offerLimit <= 2
        && !wasAlreadyLoaded(offerSourceUrl, nextPageNumber)) {
        // reload on second-last item
        loadMoreOffers(nextPageNumber, offerLimit, offerSourceUrl, function(returnedData) {
          if (! (offerSourceUrl in alreadyLoaded)) {
            alreadyLoaded[offerSourceUrl] = [];
          }

          // store that page number was already requested
          alreadyLoaded[offerSourceUrl].push(nextPageNumber);

          addOffersToSlider(returnedData);
        });
      }

      console.log('current slide count: ' + el.getCurrentSlideCount());
    }
  });

  var lightSliderDemandEl = $("#lightSliderDemand");

  // pagination info for AJAX reload of demands and offers
  var demandFirstPageNumber = lightSliderDemandEl.data('currentpage');
  var demandLimit = lightSliderDemandEl.data('itemlimit');
  var demandSourceUrl = lightSliderDemandEl.data('sourceurl');

  demandTranslations ={
    'price' : lightSliderDemandEl.data('translationprice'),
    'distance' : lightSliderDemandEl.data('translationdistance')
  };

  viewDemandUrl = lightSliderDemandEl.data('viewurl');

  lightSliderDemand = $("#lightSliderDemand").lightSlider({
    loop:true,
    autoWidth: false,
    adaptiveHeight: false,
    easing: 'cubic-bezier(0.25, 0, 0.25, 1)',
    responsive : [
      {
        breakpoint:1024,
        settings: {
          item:2,
          slideMove:1
        }
      }
    ],
    onBeforeSlide: function (el) {
      var nextPageNumber = calculateNextPageNumber(el.getCurrentSlideCount(), demandFirstPageNumber, demandLimit);

      // current slide count starts at 1
      if (el.getCurrentSlideCount() % demandLimit <= 2
        && !wasAlreadyLoaded(demandSourceUrl, nextPageNumber)) {
        // reload on second-last item
        loadMoreDemands(nextPageNumber, demandLimit, demandSourceUrl, function(returnedData) {
          if (! (demandSourceUrl in alreadyLoaded)) {
            alreadyLoaded[demandSourceUrl] = [];
          }

          // store that page number was already requested
          alreadyLoaded[demandSourceUrl].push(nextPageNumber);

          addDemandsToSlider(returnedData);
        });
      }

      console.log('current slide count: ' + el.getCurrentSlideCount());
    }
  });
    new CBPFWTabs( document.getElementById( 'tabs' ) );


  var wasAlreadyLoaded = function(dataSourceUrl, nextPageNumber) {
    return dataSourceUrl in alreadyLoaded &&  -1 !== alreadyLoaded[dataSourceUrl].indexOf(nextPageNumber);
  };

  var calculateNextPageNumber = function(currentItemNumber, firstPageNumber, limit) {
    return Math.floor(currentItemNumber / limit) + firstPageNumber + 1;
  };

  var loadMoreOffers = function(nextPageNumber, limit, dataSourceUrl, onLoadedCallback) {
    var offerService = new Offers(dataSourceUrl);
    offerService.getOffersByCriteria({
        page : nextPageNumber,
        limit : limit
      }, onLoadedCallback
    );
  };

  var loadMoreDemands = function(nextPageNumber, limit, dataSourceUrl, onLoadedCallback) {
    var demandService = new Demands(dataSourceUrl);
    demandService.getDemandsByCriteria({
        page : nextPageNumber,
        limit : limit
      }, onLoadedCallback
    );
  };

  var addDemandsToSlider = function(returnedData) {
    console.log('adding demands to slider: ' + returnedData);

    if ('demandList' in returnedData) {
      if ('demands' in returnedData['demandList']) {
        for (var i=0; i < returnedData['demandList']['demands'].length; i++) {
          var demand = returnedData['demandList']['demands'][i];
          addDemandToSlider(demand);
        }
      }
    }
  };

  var addOffersToSlider = function(returnedData) {
    console.log('adding offers to slider: ' + returnedData);

    if ('offerList' in returnedData) {
      if ('offers' in returnedData['offerList']) {
        for (var i=0; i < returnedData['offerList']['offers'].length; i++) {
          var offer = returnedData['offerList']['offers'][i];
          addOfferToSlider(offer);
        }
      }
    }
  };

  var addOfferToSlider = function(offer) {
    var html = renderOfferInAjaxTemplate(offer);

    lightSliderOffer.prepend(html);
    lightSliderOffer.refresh();
  };

  var addDemandToSlider = function(demand) {
    var html = renderDemandInAjaxTemplate(demand);

    lightSliderDemand.prepend(html);
    lightSliderDemand.refresh();
  };

  var renderOfferInAjaxTemplate = function(offer) {
    var source = $("#offerHandlebarsListItem").html();
    var template = Handlebars.compile(source);

    var image = '/images/Offer_Dummy.png';
    var imageTitle = 'Dummy';

    var viewUrl = viewOfferUrl.replace('%%offerId%%', offer.id);

    var firstImage = undefined;
    if (offer.imageList.images.length > 0) {
      var image = offer.imageList.images[0];

      firstImage = {
        url: neeedo.filterImageUrl(offer.imageList.baseUrl) + '/' + image.fileName,
        alt: image.fileName
      };
    }

    var offerContext = offer;
    offerContext['viewUrl'] = viewUrl;
    offerContext['firstImage'] = firstImage;

    var context = {
      offer: offerContext,
      translations: offerTranslations
    };

    return template(context);
  };

  var renderDemandInAjaxTemplate = function(demand) {
    var source = $("#demandHandlebarsListItem").html();
    var template = Handlebars.compile(source);
    var viewUrl = viewDemandUrl.replace('%%demandId%%', demand.id);

    var demandContext = demand;
    demandContext['viewUrl'] = viewUrl;

    var context = {
      demand: demandContext,
      translations: demandTranslations
    };

    return template(context);
  };
});

/* ##############################################
 *
 *              AJAX functions
 *
 * #############################################
 */


var Offers = function(ajaxEndpoint) {
  this.ajaxEndpoint = ajaxEndpoint;

  this.buildQueryString = function(criteria) {
      var queryParameters = [];

      if ("limit" in criteria) {
         queryParameters.push("limit=" + criteria["limit"]);
      }

      if ("page" in criteria) {
         queryParameters.push("page=" + criteria["page"]);
      }

      if ("lat" in criteria) {
         queryParameters.push("lat=" + criteria["lat"]);
      }

      if ("lng" in criteria) {
         queryParameters.push("lng=" + criteria["lng"]);
      }

      return "?" + queryParameters.join("&");
  };
};

Offers.prototype.getOffersByCriteria = function(criteria, onLoadSuccessCallback) {
  var requestUrl = this.ajaxEndpoint + this.buildQueryString(criteria);

  $.get(requestUrl)
    .done(function( data ) {
      onLoadSuccessCallback(data);
    })
};

var Demands = function(ajaxEndpoint) {
  this.ajaxEndpoint = ajaxEndpoint;

  this.buildQueryString = function(criteria) {
    var queryParameters = [];

    if ("limit" in criteria) {
      queryParameters.push("limit=" + criteria["limit"]);
    }

    if ("page" in criteria) {
      queryParameters.push("page=" + criteria["page"]);
    }

    if ("lat" in criteria) {
      queryParameters.push("lat=" + criteria["lat"]);
    }

    if ("lng" in criteria) {
      queryParameters.push("lng=" + criteria["lng"]);
    }

    return "?" + queryParameters.join("&");
  };
};

Demands.prototype.getDemandsByCriteria = function(criteria, onLoadSuccessCallback) {
  var requestUrl = this.ajaxEndpoint + this.buildQueryString(criteria);

  $.get(requestUrl)
    .done(function( data ) {
      onLoadSuccessCallback(data);
    })
};


var DemandsMatching = function(ajaxEndpoint) {
  this.ajaxEndpoint = ajaxEndpoint;

  this.buildQueryString = function(criteria) {
    var queryParameters = [];

    if ("limit" in criteria) {
      queryParameters.push("limit=" + criteria["limit"]);
    }

    if ("page" in criteria) {
      queryParameters.push("page=" + criteria["page"]);
    }

    return "?" + queryParameters.join("&");
  };
};

DemandsMatching.prototype.getMatchingOffers = function(criteria, onLoadSuccessCallback) {
  var requestUrl = this.ajaxEndpoint + this.buildQueryString(criteria);

  $.get(requestUrl)
    .done(function( data ) {
      onLoadSuccessCallback(data);
    })
};

var Neeedo = function()
{

};

Neeedo.prototype.getApiHttpUrl = function() {
  return $("body").data("apiurlhttp");
};

Neeedo.prototype.getApiHttpsUrl = function() {
  return $("body").data("apiurlhttps");
};

Neeedo.prototype.deg2rad = function deg2rad(deg) {
  return deg * (Math.PI/180)
};

/**
 * Implementation of haversine formula to get the great circle distances between two points.
 * @param position1
 * @param position2
 * @return distance in kilometers
 */
Neeedo.prototype.getDistanceBetweenTwoCoordinatesInKm = function (position1, position2) {
  var EQUATOR_RADIUS = 6378.137;

  var latitude1 = position1.latitude,
      longitude1 = position1.longitude,
      latitude2 = position2.latitude,
      longitude2 = position2.longitude;

  var latitude1Rad = this.deg2rad(latitude1),
      longitudeRad = this.deg2rad(longitude1),
      latitude2Rad = this.deg2rad(latitude2),
      longitude2Rad = this.deg2rad(longitude2)
    ;

  return EQUATOR_RADIUS * Math.acos(Math.sin(latitude1Rad) * Math.sin(latitude2Rad)
      + Math.cos(latitude1Rad) * Math.cos(latitude2Rad) * Math.cos(longitude2Rad - longitudeRad)
    );
};

Neeedo.prototype.filterImageUrl = function(originalUrl) {
  // make use of http instead of https to get the image
  return originalUrl.replace(neeedo.getApiHttpsUrl(), neeedo.getApiHttpUrl());
};

var neeedo = new Neeedo();
