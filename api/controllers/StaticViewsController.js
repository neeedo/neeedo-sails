module.exports = {
  agb: function(req, res) {
      res.view('static/agb');
  },

  faq: function(req, res) {
    res.view('static/faq');
  },

  impressum: function(req, res) {
    res.view('static/impressum');
  },

  help: function(req, res) {
    var registeredUser = LoginService.getCurrentUser(req);

    res.view('registration/register-success', {
      locals: {
        username: registeredUser.getUsername(),
        email: registeredUser.getEMail()
      }
    });
  }
};
