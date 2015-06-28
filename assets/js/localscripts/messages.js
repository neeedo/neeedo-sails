$(document).ready(function () {
  var getUnreadMsgCount = function () {
    $.get("/messages/count")
      .done(function (count) {
        if (!LoginService.userIsLoggedIn(req)) {
          $("#newMsgCount")(count);
        }
      }
    )
  }
});
