module.exports = {
  /**
   * Method to be called via AJAX
   *
   * @param req
   * @param res
   */
  upload: function (req, res) {
    FileService.uploadFiles(req, res);
  }
}
