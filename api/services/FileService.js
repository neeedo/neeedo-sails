var apiClient = require('neeedo-api-nodejs-client')
    util = require('util');

var ImageService = apiClient.services.Image;

var imageService = new ImageService();

module.exports = {
  uploadFiles : function(req, res, onSuccessCallback, onErrorCallback) {
    var files = req.file("files", undefined);

    sails.log.info('uploadFiles()...' + util.inspect(files));

    if (undefined === files) {
      onErrorCallback(res, res.i18n("Problem during upload - no file given."));
    } else {
      this.executeUpload(req, res, files, onSuccessCallback, onErrorCallback);
    }
  },

  executeUpload : function (req, res, files, onSuccessCallback, onErrorCallback) {
    var _this = this;

    files.upload(function onUploadComplete(err, uploadedFiles) {
        //	Files are located in .tmp/uploads

        if (err) {
          res.serverError(err);
        } else {
          sails.log.info('Uploaded files:' + util.inspect(uploadedFiles));

          _this.uploadToApi(req, res, uploadedFiles, onSuccessCallback, onErrorCallback);
        }
      });
   /* }*/
  },
  uploadToApi : function(req, res, uploadedFiles, onOuterSuccessCallback, onOuterErrorCallback) {
    var numberOfUploaded = 0;
    var imageList = imageService.newImageList();
    var _this = this;

    var onSuccessCallback = function(imageModel) {
      sails.log.info('FileService::uploadToApi(): getting image... '
         + util.inspect(imageModel));

      numberOfUploaded++;
      imageList.addImage(imageModel);

      if (numberOfUploaded == uploadedFiles.length) {
        // store serialized image list in session
        _this.storeInSession(req, imageList.serializeForApi());
        onOuterSuccessCallback(res, res.i18n('Your files were uploaded successfully'), uploadedFiles);
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
    return '/files/upload';
  },

  filterGetImageUrl : function(neeedoApiClientUrl) {
    return neeedoApiClientUrl.replace(
      sails.config.neeedo.apiClient.apiUrls.https,
      sails.config.neeedo.apiClient.apiUrls.http);
  }
};
