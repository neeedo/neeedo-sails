/**
 * hasValidFileType
 *
 * @module      :: Policy
 * @description :: Policy to ensure that the request contains a type parameter that is supported by the FileService.
 *
 */
module.exports = function(req, res, next) {
  var type = req.param('type', undefined);

  if (undefined === type
    || ! (type in FileService.getFileTypeAdapter())) {
    FlashMessagesService.setErrorMessage('This operation is not allowed.', req, res);
    UrlService.redirectToLastRedirectUrl(req, res);
  }

  return next();
};
