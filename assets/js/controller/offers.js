/*!
 * Offers REST service controller class.
 *
 * Copyright (c) 2015 neeedo 
 */


// namespaces
this.de = this.de || {};
this.de.neeedo = this.de.neeedo || {};
this.de.neeedo.webapp = this.de.neeedo.webapp || {};
this.de.neeedo.webapp.rest = this.de.neeedo.webapp.rest || {};
this.de.neeedo.webapp.rest.offers = this.de.neeedo.webapp.rest.offers || {};

if (typeof jQuery === 'undefined') {
    throw new Error('Missing dependency: jQuery. Make sure to include it.')
}

$(document).ready(function() {
     var connectionOptions = de.neeedo.webapp.rest.options;
     var restUtil = de.neeedo.webapp.rest.util;
     var formFields = {
         formName : '',
         tags : '#tagsOffer',
         price : '#priceOffer',
         // TODO
         locationLat : '#latOffer',
         // TODO
         locationLon : '#lonOffer',
         errorRenderer : '#offersError',
         successRenderer : '#offersSuccess'
     };
    var viewElements = {
        errorRenderer : '#offersError',
        successRenderer : '#offersSuccess',
        modal : '#addModal'
    };
    var btnCreateOffer = $('#btnCreateOffer');
    
    var offersConnector = new de.neeedo.webapp.rest.offers.OffersConnector(
         connectionOptions, 
         formFields,
         viewElements,
         restUtil);
    
    // bind button click on offersConnector
    btnCreateOffer.click(function() {
        offersConnector.createOffer();
    });
});