/**
 * resetUploadedFiles
 *
 * @module      :: Policy
 * @description :: Reset the least uploaded files.
 *
 */
module.exports = function(req, res, next) {
  FileService.resetLeastUploadedFiles(req);

  return next();
};
