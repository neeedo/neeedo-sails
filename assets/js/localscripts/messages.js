$(document).ready(function () {
  var setUnreadMsgCount = function () {
    $.get("/messages/count")
      .done(function (count) {
  if(count==0){
          $(".newMsgCount").hide();
        }else{
          $(".newMsgCount").text(count);
          $(".newMsgCount").show();
        }      }
    )
  };

  setUnreadMsgCount();
});
