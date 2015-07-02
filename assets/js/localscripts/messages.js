$(document).ready(function () {
  var setUnreadMsgCount = function () {
    $.get("/messages/count")
      .done(function (count) {
          $(".icon-envelop").text(count);
      }
    )
  };

  setUnreadMsgCount();
});
