/**
 * This localscript takes each .timestamp span element, formats and displays the given timestamp correctly.
 *
 * It should be used to ensure the correct client time.
 */

$(document).ready(function () {
    $('.timestamp').each(function (index) {
      var _this = $(this);
      _this.text(neeedo.formatTimestamp(_this.data('timestamp')));
    });
  }
);
