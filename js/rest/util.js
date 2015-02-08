/*!
 * Demands REST service connector class.
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
            throw 'Please hand in a list of comma-separated tags.';
        }
        
        return tagList;
    }

    // singleton
    de.neeedo.webapp.rest.util = new de.neeedo.webapp.rest.Util();
}());