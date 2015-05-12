module.exports = {
  setSuccessMessage: function(successMessage, req, res) {
    req.flash('success', res.i18n(successMessage));
  },
  getSuccessMessage: function(req) {
    return req.flash('success');
  },
  setErrorMessage: function(errorMessage, req, res) {
    req.flash('error', res.i18n(errorMessage));
  },
  getErrorMessage: function(req) {
    return req.flash('error');
  }
};
