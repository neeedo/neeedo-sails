$(document).ready(function () {
  var messagePreviewTemplateEl = $('#messagePreviewTemplate');
  var toggleMessagesEl = $('.messages-collapse');
  var toggleClickEl = $('.onCollapseClick');
  var messagesPreviewEl = toggleMessagesEl.find('.messages-preview');

  $(toggleClickEl).on('click', function () {
    var _this = $(this);
    var messagesEl = _this.parent().parent().parent().find('.messages-collapse');
    var senderId = messagesEl.data('senderid');

    removeMessages(messagesEl);

    var onMessagesCallback = function (returnedData) {
      if ("messageList" in returnedData) {
        var messageList = returnedData.messageList;
        if ("messages" in messageList) {
          for (var i = 0; i < messageList.messages.length; i++) {
            displayMessage(messagesEl, messageList.messages[i], returnedData);
          }
        }
      }
      messagesEl.collapse('toggle');
    };

    // load messages for given conversation
    var messageService = new Messages();
    messageService.getMessagesFromSenderAndCurrentlyLoggedIn(
      {
        senderId: senderId,
        isRead: !(_this.data('isunread'))
      },
      onMessagesCallback
    );
  });

  var displayMessage = function (element, message, responseData) {
    var html = renderMessage(message, responseData);

    element.append(html);
  };

  var renderMessage = function (message, responseData) {
    var viewUrl = undefined;

    if ("viewUrl" in responseData) {
      viewUrl = responseData.viewUrl;
    }

    var maxCharacters = undefined;
    if ("maxCharacters" in responseData) {
      maxCharacters = responseData.maxCharacters;
    }

    var currentUser = undefined;
    if ("currentUser" in responseData) {
      currentUser = responseData.currentUser;
    }

    var source = messagePreviewTemplateEl.html();
    var template = Handlebars.compile(source);

    var context = {
      message: {
        viewUrl: getViewUrl(viewUrl, message, currentUser),
        time: formatTimestamp(message.timestamp),
        shortBody: shortenMessageBody(message.body, maxCharacters),
        sender: message.sender
      }
    };

    return template(context);
  };

  var removeMessages = function (element) {
    element.empty();
    element.collapse('toggle');
  };

  var getViewUrl = function (viewUrl, message, currentUser) {
    if (undefined != viewUrl) {
      // senderId should be the other message endpoint, so not the current user
      return viewUrl
        .replace('%%senderId%%', (undefined != currentUser && currentUser.id == message.sender.id
          ? message.recipient.id
          : message.sender.id))
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
