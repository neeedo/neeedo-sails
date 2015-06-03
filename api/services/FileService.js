var apiClient = require('neeedo-api-nodejs-client')
    util = require('util');

var ImageService = apiClient.services.Image;

var imageService = new ImageService();

module.exports = {
  uploadFiles : function(req, res) {
    var files = req.file("files", undefined);

    sails.log.info('uploadFiles()...' + util.inspect(files));

    if (undefined === files) {
      this.sendErrorResponse(res, res.i18n("Problem during upload - no file given."));
    } else {
      this.executeUpload(req, res, files);
    }
  },

  executeUpload : function (req, res, files) {
    var _this = this;

    files.upload(function onUploadComplete(err, uploadedFiles) {
        //	Files are located in .tmp/uploads

        if (err) {
          res.serverError(err);
        } else {
          sails.log.info('Uploaded files:' + util.inspect(uploadedFiles));

          _this.storeInSession(req, uploadedFiles);
          _this.sendSuccessResponse(res, res.i18n('Your files were uploaded successfully'), uploadedFiles);
        }
      });
   /* }*/
  },

  storeInSession : function(req, uploadedFiles) {
     req.session.uploadedFiles = uploadedFiles;
  },

  getLeastUploadedFiles : function(req) {
    return req.session.uploadedFiles;
  },

  resetLeastUploadedFiles : function(req) {
    if ("uploadedFiles" in req.session) {
      delete req.session.uploadedFiles;
    }
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
  }
};
