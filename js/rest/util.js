/*!
 * Demands REST service connector class.
 *
 * Copyright (c) 2015 neeedo 
 */

// namespaces
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
            throw new Exception('Type of inputStr must be string.');
        }
        
        var tagList = inputStr.split(',');
        
        return tagList;
    }

    // singleton
    de.neeedo.webapp.rest.util = new Util();
}());