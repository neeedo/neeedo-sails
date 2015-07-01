$(document).ready(function () {
  var messagePreviewTemplateEl = $('#messagePreviewTemplate');
  var toggleMessagesEl = $('.messages-collapse');
  var messagesPreviewEl = toggleMessagesEl.find('.messages-preview');

  $(toggleMessagesEl).on('shown.bs.collapse', function () {
    var _this = $(this);
    var senderId = _this.data('senderid');

    removeMessages(_this);

    var onMessagesCallback = function (returnedData) {
      var viewUrl = undefined;

      if ("viewUrl" in returnedData) {
        viewUrl = returnedData.viewUrl;
      }

      var maxCharacters = undefined;
      if ("maxCharacters" in returnedData) {
        maxCharacters = returnedData.maxCharacters;
      }

      if ("messageList" in returnedData) {
        var messageList = returnedData.messageList;
        if ("messages" in messageList) {
          for (var i = 0; i < messageList.messages.length; i++) {
            displayMessage(_this, messageList.messages[i], viewUrl, maxCharacters);
          }
        }
      }
    };

    // load messages for given conversation
    var messageService = new Messages();
    messageService.getMessagesFromSenderAndCurrentlyLoggedIn(
      {
        senderId: senderId
      },
      onMessagesCallback
    );
  });

  var displayMessage = function (element, message, viewUrl, maxCharacters) {
    var html = renderMessage(message, viewUrl, maxCharacters);

    element.append(html);
  };

  var renderMessage = function (message, viewUrl, maxCharacters) {
    var source = messagePreviewTemplateEl.html();
    var template = Handlebars.compile(source);

    var context = {
      message: {
        viewUrl: getViewUrl(viewUrl, message),
        time: formatTimestamp(message.timestamp),
        shortBody: shortenMessageBody(message.body, maxCharacters),
        sender: message.sender.username
      }
    };

    return template(context);
  };

  var removeMessages = function (element) {
    element.empty();
  };

  var getViewUrl = function (viewUrl, message) {
    if (undefined != viewUrl) {
      return viewUrl.replace('%%senderId%%', message.sender.id)
          .replace('%%messageId%%', message.id);
    }

    return '';
  };

  var formatTimestamp = function (timestampInMilliSeconds) {
    var date = new Date(timestampInMilliSeconds);

    // TODO the date should be delivered by the backend depending on the current locale in the future. For now, it's hard-coded.
    return date.getDate() + "." + (date.getMonth() + 1)  + "." + date.getFullYear()
      + " - " + date.getHours() + ":" + date.getMinutes();
  };

  var shortenMessageBody = function (messageBody, maxNumberOfCharacters) {
    return messageBody.substring(0, maxNumberOfCharacters) + "...";
  };
});
