$(document).ready(function () {
  var setUnreadMsgCount = function () {
    $.get("/messages/count")
      .done(function (count) {
          $(".newMsgCount").text(count);
      }
    )
  };

  setUnreadMsgCount();
});
