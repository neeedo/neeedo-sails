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
  if(e.style.display == 'none')
    e.style.display = 'block';
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
    offerForm,
    spinnerObject,
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

    this.submit();

    // TODO get AJAX action working if desired
    /*
    var data = new FormData();

    $.each(files, function (key, value) {
      data.append(key, value);
    });

    $.ajax({
      url: uploadTargetUrl,
      type: 'POST',
      data: data,
      cache: false,
      dataType: 'json',
      processData: false,
      contentType: false,
      success: function (data, textStatus, jqXHR) {
        console.log(data);
        errorMessageTarget.html('<p>' + data.message + '</p>');
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log('Upload error: ' + errorThrown);
        errorMessageTarget.html('<p>' + errorMessageTarget.data('messageuploaderror') + '</p>');
      }
    });*/
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

var deactivateOfferSubmit = function() {
  var submitBtn = offerForm.find("button[type='submit']");
  submitBtn.attr('disabled','disabled');
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
  errorMessageTarget = $('#fileupload-messages'),
  SpinnerObject = Spinner;

  var deleteFileButtons = $('.fileupload-deleteImage');
  offerForm = $('#createOffer');

  uploadTargetUrl = fileuploadForm.attr('action');

  inputFiles.on('change', prepareImages);
  fileuploadForm.on('submit', uploadImages);
  deleteFileButtons.on('click', deleteImage);
});

/* ##############################################
 *
 *              CREATE OFFER & DEMAND
 *
 * #############################################
 */

var getGeolocation = function(callback) {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(callback);
  } else {
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

var setLocation = function(event) {
  event.stopPropagation();
  event.preventDefault();

  var latInput = $(this).find("input[name='lat']");
  var lngInput = $(this).find("input[name='lng']");

  var _this = this;
  var onLocationCallback = function(location) {
    if (false == location) {
      alert('No location given.');
    } else {
      latInput.val(location.latitude);
      lngInput.val(location.longitude);

      _this.submit();
    }
  };

  getLocation(onLocationCallback);
};


$(document).ready(function () {
  var offerForm = $('#createOffer');
  var demandForm = $('#createDemand');

  offerForm.on('submit', setLocation);
  demandForm.on('submit', setLocation);
});

/* ##############################################
 *
 *              CONTENT ELEMENTS
 *
 * #############################################
 */

$(document).ready(function() {
  $(document).ready(function() {
    $("#lightSliderOffer").lightSlider({
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
      ]
    });
    $("#lightSliderDemand").lightSlider({
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
      ]
    });
  });});

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
