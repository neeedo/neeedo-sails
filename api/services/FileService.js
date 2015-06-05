var apiClient = require('neeedo-api-nodejs-client')
    util = require('util'),
    ImageValidator = require('../validators/Image'),
    _ = require('underscore'),
    fs = require('fs')
    ;

var ImageService = apiClient.services.Image;

var imageService = new ImageService();

module.exports = {
  uploadFiles : function(req, res, onSuccessCallback, onErrorCallback) {
    var files = req.file("files", undefined);

    if (undefined === files) {
      onErrorCallback(res, res.i18n("Problem during upload - no file given."));
    } else {
      this.executeUpload(req, res, files, onSuccessCallback, onErrorCallback);
    }
  },

  validateFilesAndDeleteInvalid: function(res, err, uploadedFiles) {
    var validFiles = [];
    var messages = [];

    if (err) {
      sails.log.error(err);
      messages.push(res.i18n('Your file upload failed. Please check the restrictions.'));
    } else {
      var validator = this.getImageValidator(res.i18n);

      _.each(uploadedFiles, function(uploadedFile) {
          if (!validator.isValid(uploadedFile)) {
            messages.push(validator.getErrorMessages());

            // remove file from .tmp folder synchronously
            fs.unlinkSync(uploadedFile.fd);
          } else {
            // file is valid and can be uploaded to API
            validFiles.push(uploadedFile);
          }
      });
    }

    return {
      'validFiles' : validFiles,
      'messages' : messages
    };
  },

  executeUpload : function (req, res, files, onSuccessCallback, onErrorCallback) {
    var _this = this;

    files.upload(function onUploadComplete(err, uploadedFiles) {
        //	Files are located in .tmp/uploads
        var validationResult = _this.validateFilesAndDeleteInvalid(res, err, uploadedFiles);
        var validationErrorMessage = validationResult['messages'].join(", ");
        sails.log.info('Uploaded files:' + util.inspect(uploadedFiles));

        if (validationResult['validFiles'].length > 0) {
          // only push valid files to API and handle validation error messages for invalid files
          _this.uploadToApi(req, res, validationResult['validFiles'], validationErrorMessage, onSuccessCallback, onErrorCallback);
        } else {
          // only invalid files given
          onErrorCallback(res, validationErrorMessage);
        }
      });
   /* }*/
  },
  uploadToApi : function(req, res, uploadedFiles, message, onOuterSuccessCallback, onOuterErrorCallback) {
    var numberOfUploaded = 0;
    var imageList = imageService.newImageList();
    var _this = this;

    var onSuccessCallback = function(imageModel) {
      sails.log.info('FileService::uploadToApi(): getting image... '
         + util.inspect(imageModel));

      numberOfUploaded++;
      imageList.addImage(imageModel);

      if (numberOfUploaded == uploadedFiles.length) {
        _.each(uploadedFiles, function(uploadedFile) {
          // remove file from .tmp folder synchronously
          fs.unlinkSync(uploadedFile.fd);
        });

        // store serialized image list in session
        _this.storeInSession(req, imageList.serializeForApi());
        onOuterSuccessCallback(res, res.i18n('Your files were uploaded successfully') + ' ' + message, uploadedFiles);
      }
    };

    var onErrorCallback = function(errorModel) {
      sails.log.info('onErrorCallback ' + util.inspect(errorModel));
      ApiClientService.logMessages(errorModel);

      onOuterErrorCallback(res, errorModel.getErrorMessages()[0]);
    };

    for (var i=0; i < uploadedFiles.length; i++) {
      var file = uploadedFiles[i];

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

  sendErrorResponse : function(res, message) {
    res.status(400);

    res.json({
        success : false,
        message : message
    });
  },

  sendSuccessResponse : function(res, message, uploadedFiles) {
    res.status(200);

    res.json({
        success : true,
        message : message,
        uploadedFiles : uploadedFiles
    });
  },

  getImageUploadUrl : function() {
    return '/files/upload?type=image';
  },

  filterGetImageUrl : function(neeedoApiClientUrl) {
    return neeedoApiClientUrl.replace(
      sails.config.neeedo.apiClient.apiUrls.https,
      sails.config.neeedo.apiClient.apiUrls.http);
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
  }
};
