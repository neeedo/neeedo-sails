$(document).ready(function () {
  var messagePreviewTemplateEl = $('#messagePreviewTemplate');
  var toggleMessagesEl = $('.messages-collapse');
  var messagesPreviewEl = toggleMessagesEl.find('.messages-preview');

  var renderMessage = function(message) {
    var source = messagePreviewTemplateEl.html();
    var template = Handlebars.compile(source);

    var context = {
      message: {
        viewUrl: "",
        time: message.timestamp,
        shortBody: message.body
      }
    };

    return template(context);
  };

  var displayMessage = function(message) {
    var html = renderMessage(message);

    messagesPreviewEl.append(html);
  };

  var removeMessages = function() {
    messagesPreviewEl.empty();

  };

  $(toggleMessagesEl).on('shown.bs.collapse', function () {
    var _this = $(this);
    var senderId = _this.data('senderid');

    removeMessages();

    var onMessagesCallback = function(returnedData) {
      if ("messageList" in returnedData) {
        var messageList = returnedData.messageList;
        if ("messages" in messageList) {
          for (var i = 0; i < messageList.messages.length; i++) {
            displayMessage(messageList.messages[i]);
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
  })
});
