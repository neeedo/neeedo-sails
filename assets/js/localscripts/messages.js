$(document).ready(function () {
  var setUnreadMsgCount = function () {
    $.get("/messages/count")
      .done(function (count) {
        var nMC = $(".newMsgCount");
        if (count == 0) {
          nMC.hide();
        } else {
          nMC.text(count);
          nMC.show();
        }
      }
    )
  };

  setUnreadMsgCount();
});
