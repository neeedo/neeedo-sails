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
var files, uploadTargetUrl, errorMessageTarget;

var validate = function() {
  // TODO
  return true;
};

var prepareImages = function(event) {
  // store in files array
  files = event.target.files;
};

var uploadImages = function(event) {
  console.log('uploading images...' + util.inspect(files));

  event.stopPropagation();
  event.preventDefault();

  if (validate()) {
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
        errorMessageTarget.html('<p>Error - unable to upload file. Please contact Neeedo customer care.</p>');
      }
    });
  } else {
    errorMessageTarget.html('<p>Error - unable to upload file.</p>');
  }
};



$(function () {
  var inputFiles = $('#fileupload-input');
  var fileuploadForm = $('#fileupload');
  errorMessageTarget = $('#fileupload-messages');

  uploadTargetUrl = fileuploadForm.attr('action');

  inputFiles.on('change', prepareImages);
  fileuploadForm.on('submit', uploadImages);
});


/* ##############################################
 *
 *              CONTENT ELEMENTS
 *
 * #############################################
 */

$(document).ready(function() {
  $(document).ready(function() {
    $("#lightSliderOffer").lightSlider();
    $("#lightSliderDemand").lightSlider();

  });});

