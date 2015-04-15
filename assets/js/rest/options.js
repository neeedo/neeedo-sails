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
    var baseUrl = $('body').data('apiurl');

    de.neeedo.webapp.rest.options = {
        urls : {
            base : baseUrl,
            createDemand : baseUrl + '/demands',
            createOffer : baseUrl + '/offers',
            listAllDemands : baseUrl + '/matching/demands',
            listMatchingOffers: baseUrl + '/matching/demand/0/0'
        }
    };

}());
