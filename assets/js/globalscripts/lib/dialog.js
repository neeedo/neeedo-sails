/*
 * Modal dialogs service
 * - dnymically renders bootstrap modal dialog by using a handlebars template and passing in variables from data-attributes.
 */
var Dialogs = function () {
  var _this = this;
  this.yesNoDialogTemplateEl = undefined;
  this.yesNoDialogModalSelector = undefined;
  this.dialogTarget = undefined;

  this.showYesNoDialog = function() {
    var triggerElement = $(this);
    // get HTML from handlebars template
    var dialogHtml = _this.renderTemplate(_this.yesNoDialogTemplateEl, {
      title: triggerElement.data('title'),
      body: triggerElement.data('body'),
      yesActionLabel: triggerElement.data('yesactionlabel'),
      noActionLabel: triggerElement.data('noactionlabel'),
      yesActionUrl: triggerElement.data('yesactionurl')
    });

    // show the rendered bootstrap dialog modal
    _this.showToUser(dialogHtml, _this.yesNoDialogModalSelector);
  };

  this.renderTemplate = function(templateElement, context) {
    var source = templateElement.html();
    var template = Handlebars.compile(source);

    return template(context);
  };

  this.showToUser = function(dialogHtml, modalSelector) {
    _this.dialogTarget.empty();
    _this.dialogTarget.append(dialogHtml);

    var modal = _this.dialogTarget.find(modalSelector);
    modal.modal("show");

    $('.dialogConfirmBtn').click(function() {
      // navigate to action URL if the user confirmed
      var __this = $(this);
      var actionUrl = __this.data('actionurl');

      // navigate to new page
      window.location.href = actionUrl;
    });
  };
};

Dialogs.prototype.activateEventHandler = function() {
  var yesNoDialogTrigger = $(".showYesNoDialog");
  this.yesNoDialogTemplateEl = $('#yesNoDialogHandlebars');
  this.yesNoDialogModalSelector = '#yesNoDialog';
  this.dialogTarget = $('#modalDialogs');

  yesNoDialogTrigger.click(this.showYesNoDialog);
};

/* ####################################
 * #
 * # Global scope
 * #
 * ####################################
 */
// store singleton in global scope
var dialogs = new Dialogs();

$(document).ready(function () {
    dialogs.activateEventHandler();

    //autofocus for email input field in login modal
    $('#loginModal').on('shown.bs.modal', function () {
      $('#email').focus();
    });
}
);
