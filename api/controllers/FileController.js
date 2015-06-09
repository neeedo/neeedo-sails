module.exports = {
  /**
   * Method to be called via AJAX
   *
   * @param req
   * @param res
   */
  uploadAjax: function (req, res) {
    FileService.uploadFiles(req, res, FileService.sendJsonSuccessResponse, FileService.sendJsonErrorResponse);
  },

  upload: function (req, res) {
    var processError = function(res, message) {
      FlashMessagesService.setErrorMessage(message, req, res);

      if (!UrlService.redirectToLastRedirectUrl(req, res)) {
        res.redirect('/dashboard');
      }
    };

    var processSuccess = function(res, message, uploadedFiles) {
      FlashMessagesService.setSuccessMessage(message, req, res);

      if (!UrlService.redirectToLastRedirectUrl(req, res)) {
        res.redirect('/dashboard');
      }
    };

    FileService.uploadFiles(req, res, processSuccess, processError);
  }
}
