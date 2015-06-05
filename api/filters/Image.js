var _ = require('underscore'),
   gm = require('gm');

function Image(maxHeight, maxWidth, translator) {
  if (!_.isNumber(maxHeight)) {
    throw new Error('Image:: maxHeight must be numeric!');
  }

  if (!_.isNumber(maxWidth)) {
    throw new Error('Image:: maxWidth must be numeric!');
  }

  this.maxHeight = maxHeight;
  this.maxWidth = maxWidth;
  this.translator = translator;
}

/**
 * Calculate the dimension of the resized image. They take care of the configured maximum dimensions.
 *
 * @param givenHeight
 * @param givenWidth
 * @returns {{resizedHeight: number, resizedWidth: number}}
 */
Image.prototype.calculateMaxDimensions = function(givenHeight, givenWidth)
{
  if (!_.isNumber(givenHeight)) {
    throw new Error('Image:: givenHeight must be numeric!');
  }

  if (!_.isNumber(givenWidth)) {
    throw new Error('Image:: givenWidth must be numeric!');
  }

  /* #############################################################################
   * #
   * # STEP 1: determine scaling ratio (if a maximum width or height is exceeded)
   * #
   * #############################################################################
   */
  var heightScaleFactor = 1;
  if (givenHeight > this.maxHeight) {
    heightScaleFactor = (givenHeight / this.maxHeight);
  }

  var widthScaleFactor = 1;
  if (givenWidth > this.maxWidth) {
    widthScaleFactor = (givenWidth / this.maxWidth);
  }

/* ################################################################################################################
 * #
 * # STEP 2: determine the final scaling ratio which will be the minimum / dominant scaling ratio from step 1.
 * #         Following this idea, the aspect ratio of the image will be kept, but will fit our maximum
 * #         boundaries.
 * #
 * ###############################################################################################################
 */
  var finalResizeFactor = 1;

  if (heightScaleFactor < widthScaleFactor) {
    finalResizeFactor = heightScaleFactor;
  } else {
    // widthScaleFactor <= heightScaleFactor
    finalResizeFactor = widthScaleFactor;
  }

  var resizedHeight = finalResizeFactor * givenHeight;
  var resizedWidth = finalResizeFactor * givenWidth;

  return {
    resizedHeight : resizedHeight,
    resizedWidth : resizedWidth
  }
};

/**
 * Process the rescaling filter. Take an uploaded image file, determine the largest ratio, rescale the image and overwrite the old one.
 * @param imageFile
 * @param onSuccessCallback
 * @param onErrorCallback
 */
Image.prototype.processFilter = function(imageFile, onSuccessCallback, onErrorCallback)
{
  if (!_.isObject(imageFile)) {
    throw new Error('Image:: image must be object!');
  }

  var filePath = imageFile.fd;

  var _this = this;
  gm(filePath).size(function(err, size) {
    if (err) {
      sails.log.error('Image::processFilter: could not determine ratio of image ' + filePath + '; error: ' + err);
      onErrorCallback(_this.translator('Could not determine ratio of image %s. Please contact Neeedo customer care.', imageFile.filename));
    } else {
      var reculatedDimensions = _this.calculateMaxDimensions(size.height, size.width);

      // set recalculated dimensions
      gm(filePath)
        .resize(reculatedDimensions['resizedWidth'], reculatedDimensions['resizedHeight'])
        .write(filePath, function (err) {
          if (err) {
            sails.log.error('Image::processFilter: could not resize ratio of image ' + filePath + '; error: ' + err);
            onErrorCallback(_this.translator('Could not resize image %s. Please contact Neeedo customer care.', imageFile.filename));
          } else {
            onSuccessCallback(imageFile);
          }
        });
    }
  });

};

module.exports = Image;
