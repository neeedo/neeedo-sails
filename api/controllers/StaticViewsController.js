module.exports = {
  agb: function(req, res) {
      res.view('static/agb');
  },

  faq: function(req, res) {
    res.view('static/faq');
  },

  impressum: function(req, res) {
    res.view('static/impressum');
  }
};
