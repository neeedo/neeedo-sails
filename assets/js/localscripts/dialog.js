$(document).ready(function () {
  var yesNoDialogTrigger = $(".showYesNoDialog");
  var yesNoDialogTemplateEl = $('#yesNoDialogHandlebars');
  var yesNoDialogModalSelector = '#yesNoDialog';
  var dialogTarget = $('#modalDialogs');

  yesNoDialogTrigger.click(function() {
    var _this = $(this);

    showYesNoDialog(_this);
  });

  var showYesNoDialog = function(triggerElement) {
    // get HTML from handlebars template
    var dialogHtml = renderTemplate(yesNoDialogTemplateEl, {
      title: triggerElement.data('title'),
      body: triggerElement.data('body'),
      yesActionLabel: triggerElement.data('yesactionlabel'),
      noActionLabel: triggerElement.data('noactionlabel'),
      yesActionUrl: triggerElement.data('yesactionurl')
    });

    // show the rendered bootstrap dialog modal
    showToUser(dialogHtml, yesNoDialogModalSelector);
  };

  var renderTemplate = function(templateElement, context) {
    var source = templateElement.html();
    var template = Handlebars.compile(source);

    return template(context);
  };

  var showToUser = function(dialogHtml, modalSelector) {
    dialogTarget.empty();
    dialogTarget.append(dialogHtml);

    var modal = dialogTarget.find(modalSelector);
    modal.modal("show");

    $('.dialogConfirmBtn').click(function() {
      // navigate to action URL if the user confirmed
      var _this = $(this);
      var actionUrl = _this.data('actionurl');

      // navigate to new page
      window.location.href = actionUrl;
    });
  };
}
);
