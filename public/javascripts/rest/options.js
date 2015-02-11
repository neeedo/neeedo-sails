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
    //var baseUrl = 'http://localhost:9000';
    var baseUrl = 'http://178.62.252.23:9000';

    de.neeedo.webapp.rest.options = {      
        urls : {
            base : baseUrl,
            createDemand : baseUrl + '/demands',
            createOffer : baseUrl + '/offers',
            listAllDemands : baseUrl + '/matching/demands'
        }
    };
    
}());