/*!
 * Demands REST service util class.
 *
 * Copyright (c) 2015 neeedo 
 */

// namespaces
this.de = this.de || {};
this.de.neeedo = this.de.neeedo || {};
this.de.neeedo.webapp = this.de.neeedo.webapp || {};
this.de.neeedo.webapp.rest = this.de.neeedo.webapp.rest || {};
this.de.neeedo.webapp.rest.demands = this.de.neeedo.webapp.rest.demands || {};

(function() {
    var successAlertDiv = '#success_alert_placeholder';
    var errorAlertDiv = '#error_alert_placeholder';

    de.neeedo.webapp.rest.Util = function() {
              
    }

    /**
     * Create a tag list from a single string.
     * @param inputStr string with comma-separated tags (without whitespaces), e.g. "tag1,tag2".
     * @returns {Array}
     */
    de.neeedo.webapp.rest.Util.prototype.createTagList = function(inputStr) {
        if ("string" !== typeof inputStr) {
            throw 'Type of inputStr must be string. Given value: ' + inputStr;
        }
        
        var tagList = inputStr.replace(' ', '').split(',');
        
        if (0 == tagList.length) {
            throw 'Bitte geben Sie Tags in der Form tag1,tag2 ... ein.';
        }
        
        return tagList;
    }

    /**
     * Show a bootstrap success message.
     * @param message
     */
    de.neeedo.webapp.rest.Util.prototype.showSuccess = function(message) {
        $(successAlertDiv).html('<div class="alert alert-success"><a href="#" class="close" data-dismiss="alert">&times;</a><p id="successMessage"><strong>Erfolg!</strong> ' + message + '</p></div>');
    }
    /**
     * Show a bootstrap error message.
     * @param message
     */
    de.neeedo.webapp.rest.Util.prototype.showError = function(message) {
        $(errorAlertDiv).html('<div class="alert alert-error"><a href="#" class="close" data-dismiss="alert">&times;</a><p id="successMessage"><strong>Fehler!</strong> ' + message + '</p></div>');
    }


    // singleton
    de.neeedo.webapp.rest.util = new de.neeedo.webapp.rest.Util();
}());