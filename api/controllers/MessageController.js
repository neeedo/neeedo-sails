var util = require('util');

module.exports = {
  create: function (req, res) {
    /*
     * ---------- callbacks ----------
     */
    var onSuccessCallback = function(createdMessage) {
       sails.log.info("message " + util.inspect(createdMessage, {
          showHidden: false,
          depth: null
        }) + " was created successfully.");

      FlashMessagesService.setSuccessMessage('Your message was sent successfully.', req, res);

      if (!UrlService.redirectToLastRedirectUrl(req, res)) {
        res.redirect('/dashboard');
      }
    };

    var onErrorCallback = function(errorModel) {
      ApiClientService.logMessages(errorModel);
      ApiClientService.addFlashMessages(req, res, errorModel);

      if (!UrlService.redirectToLastRedirectUrl(req, res)) {
        res.redirect('/dashboard');
      }
    };

    /*
     * ---------- functionality ----------
     */
    if ("POST" == req.method) {
      MessageService.create(req, onSuccessCallback, onErrorCallback);
    } else {
      onErrorCallback(ApiClientService.newError("Attempt to do GET on Message::create action", "Your message couldn't be sent."));
    }
  },

  getUnreadMessagesCount: function(req, res){

      var onSuccessCallback = function(numberOfUnreadMsg) {
       res.json(numberOfUnreadMsg);
      };
      var onErrorCallback = function(errorModel) {
        res.status(400);
      };

      MessageService.getNumberOfUnreadConversations(req, onSuccessCallback, onErrorCallback);
  },

  mailbox: function(req, res) {
    var onSuccessCallback = function(readConversationList, unreadConversationList) {
      res.view('message/mailbox', {
        locals: {
          readConversationList : readConversationList,
          unreadConversationList : unreadConversationList
        }
      });
    };
    var onErrorCallback = function(errorModel) {
      ApiClientService.logMessages(errorModel);
      ApiClientService.addFlashMessages(req, res, errorModel);

      if (!UrlService.redirectToLastRedirectUrl(req, res)) {
        res.redirect('/dashboard');
      }
    };

    MessageService.getAllConversations(req, onSuccessCallback, onErrorCallback);
  }
};
