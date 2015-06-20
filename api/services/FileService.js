var apiClient = require('neeedo-api-nodejs-client')
    util = require('util'),
    ImageValidator = require('../validators/Image'),
    ImageFilter = require('../filters/Image'),
    _ = require('underscore'),
    fs = require('fs')
    ;

var ImageService = apiClient.services.Image;

var imageService = new ImageService();

/**
 *  Object of key - value pairs.
 *  Keys: file type parameter submitted by upload form, e.g. image
 *  Values: constructor function of associated validator
 */
var fileTypeAdapter = {
  image: {
    validator: {
      isActivated : sails.config.webapp.images.processing.validators,
      constructor : ImageValidator
    },
    filter: {
      isActivated :sails.config.webapp.images.processing.filters,
      constructor: ImageFilter
    }
  }
};

module.exports = {
  getFileTypeAdapter : function() {
    return fileTypeAdapter;
  },

  /**
   * Start the uploadFiles Process:
   *
   * 0. Upload the files to tmp folder.
   * 1. Trigger file upload validations.
   * 2. Trigger filters on successfully validated uploads.
   * 3. Upload the successfully filtered / processed files to API.
   * 4. Call outer callback methods.
   *
   * @param req
   * @param res
   * @param onSuccessCallback
   * @param onErrorCallback
   */
  uploadFiles : function(req, res, onSuccessCallback, onErrorCallback) {
    var files = req.file("files", undefined);

    if (undefined === files) {
      onErrorCallback(res, res.i18n("Problem during upload - no file given."));
    } else {
      this.executeUpload(req, res, files, onSuccessCallback, onErrorCallback);
    }
  },

  /**
   * Step 0: Upload files to tmp folder.
   * @param req
   * @param res
   * @param files
   * @param onSuccessCallback
   * @param onErrorCallback
   */
  executeUpload : function (req, res, files, onSuccessCallback, onErrorCallback) {
    var _this = this;

    files.upload(function onUploadComplete(err, uploadedFiles) {
      //	Files are located in .tmp/uploads
      var validationResult = _this.validateFilesAndDeleteInvalid(req, res, err, uploadedFiles);
      var validationErrorMessage = validationResult['messages'].join(", ");
      sails.log.info('Uploaded files:' + util.inspect(uploadedFiles));

      if (validationResult['validFiles'].length > 0) {
        var onProcessSuccessCallback = function(processedFiles, processingErrorMessage) {
          if (processedFiles.length > 0) {
            // only push valid + processed files to API and handle validation error messages for invalid files
            _this.uploadToApi(req, res, processedFiles, validationErrorMessage + processingErrorMessage, onSuccessCallback, onErrorCallback);
          } else {
            // only invalid files given
            onErrorCallback(res, processingErrorMessage);
          }
        };
        var onProcessErrorCallback = function(processingErrorMessages) {
          onErrorCallback(res, processingErrorMessages.join(", "));
        };

        // only process valid files
        _this.processFiles(req, res, validationResult['validFiles'], onProcessSuccessCallback, onProcessErrorCallback);
      } else {
        sails.log.error('in else');

        // only invalid files given
        onErrorCallback(res, validationErrorMessage);
      }
    });
    /* }*/
  },

  isValidationActivated : function(req, res) {
    var type = req.param('type');

    return this.getFileTypeAdapter()[type]['validator'].isActivated;
  },

  isProcessingActivated : function(req, res) {
    var type = req.param('type');

    return this.getFileTypeAdapter()[type]['filter'].isActivated;
  },

  /**
   * Step 1: Validate files and delete invalid.
   */
  validateFilesAndDeleteInvalid: function(req, res, err, uploadedFiles) {
    var messages = [];
    if (!this.isValidationActivated(req, res)) {
      return {
        'validFiles' : uploadedFiles,
        'messages' : messages
      };
    }

    var validFiles = [];

    if (err) {
      sails.log.error(err);
      messages.push(res.i18n('Your file upload failed. Please check the restrictions.'));
    } else {
      var validator = this.getValidator(req, res);

      for (var i=0; i < uploadedFiles.length; i++) {
        var uploadedFile = uploadedFiles[i];

        if (!validator.isValid(uploadedFile)) {
          messages.push(validator.getErrorMessages());

          // remove file from .tmp folder synchronously
          fs.unlinkSync(uploadedFile.fd);
        } else {
          // file is valid and can be uploaded to API
          validFiles.push(uploadedFile);
        }
      }
    }

    return {
      'validFiles' : validFiles,
      'messages' : messages
    };
  },

  /**
   * Step 2: Process / apply filters on files and delete invalid.
   */
  processFiles : function(req, res, uploadedValidFiles, onProcessSuccessCallback, onProcessErrorCallback) {
    var filter = this.getFilter(req, res);
    var processedFiles = [];
    var processed = 0;
    var processErrorMessages = [];

    if (!this.isProcessingActivated(req, res)) {
      onProcessSuccessCallback(uploadedValidFiles, processErrorMessages.join(", "));
    } else {
      _.each(uploadedValidFiles, function (uploadedFile) {
        var onSingleProcessSuccessCallback = function (processedFile) {
          processed++;
          processedFiles.push(processedFile);

          if (processed == uploadedValidFiles.length) {
            onProcessSuccessCallback(processedFiles, processErrorMessages.join(", "));
          }
        };
        var onSingleProcessErrorCallback = function (errorMessage) {
          processed++;
          processErrorMessages.push(errorMessage);

          if (processed == uploadedValidFiles.length) {
            onProcessSuccessCallback(processedFiles, processErrorMessages.join(", "));
          }
        };

        filter.processFilter(uploadedFile, onSingleProcessSuccessCallback, onSingleProcessErrorCallback);
      });
    }
  },

  /**
   * Step 3: Finally upload validated + process files to API.
   */
  uploadToApi : function(req, res, validatedAndProcessFiles, message, onOuterSuccessCallback, onOuterErrorCallback) {
    var numberOfUploaded = 0;
    var imageList = imageService.newImageList();
    var _this = this;

    var onSuccessCallback = function(imageModel) {
      sails.log.info('FileService::uploadToApi(): getting image... '
         + util.inspect(imageModel));

      numberOfUploaded++;
      imageList.addImage(imageModel);

      if (numberOfUploaded == validatedAndProcessFiles.length) {
        _.each(validatedAndProcessFiles, function(uploadedFile) {
          // remove file from .tmp folder synchronously
          fs.unlinkSync(uploadedFile.fd);
        });

        // append existing files (from session) so that they will be stored, too
        // TODO appending newly uploaded files to the session doesn't make sense because the user could have deleted the old files in the browser (which we can't determine here)
        /*
        var existingImages = _this.getLeastUploadedFiles(req);

        for (var i = 0; i < existingImages.getImages().length; i++) {
          imageList.addImage(existingImages.getImages()[i]);
        }*/

        // store serialized image list in session
        _this.storeInSession(req, imageList.serializeForApi());
        onOuterSuccessCallback(res, res.i18n('Your files were uploaded successfully') + ' ' + message, imageList);
      }
    };

    var onErrorCallback = function(errorModel) {
      sails.log.info('onErrorCallback ' + util.inspect(errorModel));
      ApiClientService.logMessages(errorModel);

      onOuterErrorCallback(res, errorModel.getErrorMessages()[0]);
    };

    for (var i=0; i < validatedAndProcessFiles.length; i++) {
      var file = validatedAndProcessFiles[i];

      var imageName = file.filename;
      var imagePath = file.fd;
      var mimeType = file.type;
      var user = LoginService.getCurrentUser(req);

      imageService.uploadImage(imageName, imagePath, mimeType, user, onSuccessCallback, onErrorCallback);
    }
  },

  storeInSession : function(req, uploadedFiles) {
     req.session.uploadedFiles = uploadedFiles;
  },

  resetLeastUploadedFiles : function(req) {
    if ("uploadedFiles" in req.session) {
      delete req.session.uploadedFiles;
    }
  },

  getLeastUploadedFiles : function(req) {
    var imageList = imageService.newImageList();
    if ("uploadedFiles" in req.session) {
      imageList.loadFromSerialized(req.session.uploadedFiles);
    }

    return imageList;
  },

  getLeastUploadedFilesAndCurrentOnes : function(req, imageList) {
    var least = this.getLeastUploadedFiles(req);

    for (var i = 0; i < least.getImages().length; i++) {
      imageList.addImage(least.getImages()[i]);
    }

    return imageList;
  },

  sendJsonErrorResponse : function(res, message) {
    sails.log.error('send json error response...');

    res.status(400);

    res.json({
        success : false,
        message : message
    });
  },

  sendJsonSuccessResponse : function(res, message, allUploadedImageList) {
    res.status(200);

    res.json({
        success : true,
        message : message,
        uploadedFiles : allUploadedImageList
    });
  },

  getImageUploadUrl : function() {
    return '/files/upload?type=image';
  },

  getAjaxImageUploadUrl : function() {
    return '/files/upload-ajax?type=image'
  },

  filterGetImageUrl : function(neeedoApiClientUrl) {
    return neeedoApiClientUrl.replace(
      sails.config.neeedo.apiClient.apiUrls.https,
      sails.config.neeedo.apiClient.apiUrls.http);
  },

  getValidator : function(req, res) {
    switch(req.param('type')) {
      case 'image': return this.getImageValidator(res.i18n);
    }
  },

  getFilter : function(req, res) {
    switch(req.param('type')) {
      case 'image': return this.getImageFilter(res.i18n);
    }
  },

  getImageValidator : function(translator) {
   // initialize imageType validator from config
   var allowedImageTypes = [];
   var typeDescriptions = [];

   _.each(sails.config.webapp.images.allowedTypes, function(allowedType) {
      allowedImageTypes.push(allowedType['fileType']);
      typeDescriptions.push(allowedType['description']);
   });

   return new ImageValidator(
     allowedImageTypes,
     sails.config.webapp.images.maxSizeInBytes,
     sails.config.webapp.images.maxCountPerObject,
     typeDescriptions.join(', '),
     translator);
  },

  getImageFilter : function(translator) {
   // initialize imageType validator from config
   return new ImageFilter(
     sails.config.webapp.images.resolution.maxHeight,
     sails.config.webapp.images.resolution.maxWidth,
     translator);
  }
};
