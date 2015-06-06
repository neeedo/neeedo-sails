var menuLeft = document.getElementById( 'cbp-spmenu-s1' ),
				body = document.body;

showLeft.onclick = function() {
  classie.toggle( this, 'active' );
  classie.toggle( menuLeft, 'cbp-spmenu-open' );
};

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
    spinningWheel,
    offerForm,
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
    , color: '#000' // #rgb or #rrggbb or array of colors
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
  var spinner = new Spinner(opts).spin(targetElement);
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
  errorMessageTarget = $('#fileupload-messages');

  var deleteFileButtons = $('.fileupload-deleteImage');
  offerForm = $('#createOffer');

  uploadTargetUrl = fileuploadForm.attr('action');

  inputFiles.on('change', prepareImages);
  fileuploadForm.on('submit', uploadImages);
  deleteFileButtons.on('click', deleteImage);
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
      item:4,
      loop:true,
      slideMove:2,
      easing: 'cubic-bezier(0.25, 0, 0.25, 1)',
      speed:600,
      responsive : [
        {
          breakpoint:800,
          settings: {
            item:3,
            slideMove:1,
            slideMargin:6
          }
        },
        {
          breakpoint:480,
          settings: {
            item:2,
            slideMove:1
          }
        }
      ],
      onSliderLoad: function() {
        $('#lightSliderOffer').removeClass('cS-hidden');
      }
    });
    $("#lightSliderDemand").lightSlider({
      item:4,
      loop:true,
      slideMove:2,
      easing: 'cubic-bezier(0.25, 0, 0.25, 1)',
      speed:600,
      responsive : [
        {
          breakpoint:800,
          settings: {
            item:3,
            slideMove:1,
            slideMargin:6
          }
        },
        {
          breakpoint:480,
          settings: {
            item:2,
            slideMove:1
          }
        }
      ],
      onSliderLoad: function() {
        $('#lightSliderDemand').removeClass('cS-hidden');
      }
    });

  });});

