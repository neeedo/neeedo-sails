var util = require('util');

module.exports = {
  create: function (req, res) {
    /*
     * ---------- callbacks ----------
     */
    var onSuccessCallback = function(createdOffer) {
       sails.log.info("Offer " + util.inspect(createdOffer, {
          showHidden: false,
          depth: null
        }) + " was created successfully.");


      // delegate to LoginService to persist User (with his/her access token)
      LoginService.storeUserInSession(createdOffer, req);

      res.view('Users/login-success', {
        locals: {
          username: createdOffer.getUsername(),
          email: createdOffer.getEMail()
        }
      });
    };

    var onErrorCallback = function(errorModel) {

    };

    /*
     * ---------- functionality ----------
     */

    if ("POST" == req.method) {
      var email = req.param("email");
      var password = req.param("password");

      LoginService.queryUser(email, password, onSuccessCallback, onErrorCallback);
    } else {
      res.view('Users/login');
    }
  },
  update: function (req, res) {

  },
  delete: function (req, res) {

  },
  uploadImage: function (req, res) {

  }
}
