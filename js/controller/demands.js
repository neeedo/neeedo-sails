/*!
 * Demands REST service connector class.
 *
 * Copyright (c) 2015 neeedo 
 */


// namespaces
this.de.neeedo.webapp = this.de.neeedo.webapp || {};
this.de.neeedo.webapp.rest = this.de.neeedo.webapp.rest || {};
this.de.neeedo.webapp.rest.demands = this.de.neeedo.webapp.rest.demands || {};

if (typeof jQuery === 'undefined') {
    throw new Error('Missing dependency: jQuery. Make sure to include it.')
}

$(document).ready(function() {
     var connectionOptions = de.neeedo.webapp.rest.options;
     var restUtil = de.neeedo.webapp.rest.util;
     var formFields = {
         formName : '',
         inputMustTags : '#mustTagsDemand',
         inputShouldTags : '#shouldTagsDemand',
         minPrice : '#minPriceDemand',
         maxPrice : '#maxPriceDemand',
         // TODO
         distance : 10,
         // TODO
         locationLat : 13.534212,
         // TODO
         locationLon : 52.468562
     };
    var btnCreateDemand = $('#btnCreateDemand');
    
    var demandsConnector = new de.neeedo.webapp.rest.demands.DemandsConnector(
         connectionOptions, 
         formFields,
         restUtil);
    
    
    // bind button click on demandsConnector
    btnCreateDemand.click(function() {
        demandsConnector.createDemand();
    });
});