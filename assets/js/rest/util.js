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
    var demandsTemplate = '#demand-template';
    var noDemandsTemplate = '#no-demands-template';
    var offersTemplate = '#offer-template';
    var noOffersTemplate = '#no-offers-template';
    var carouselInner = '#innerCarousel';

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

    de.neeedo.webapp.rest.Util.prototype.renderDemands = function(demands) {
        renderedHtml = this.prepareDemandTemplate(demands);
        
        console.log('demand template:');
        console.log(renderedHtml);
        this.renderTemplate(renderedHtml);
    }

    de.neeedo.webapp.rest.Util.prototype.renderOffers = function(offers) {
            renderedHtml = this.prepareOfferTemplate(offers);

            console.log('offer template:');
            console.log(renderedHtml);
            this.renderTemplate(renderedHtml);
    }

    de.neeedo.webapp.rest.Util.prototype.prepareDemandTemplate = function(demands) {
        if (0 == demands.length) {
            return this.showNoDemands();
        }
        
        var source   = $(demandsTemplate).html();
        var template = Handlebars.compile(source);

        // define placeholders that will be replaced
        
        var firstDemand = undefined;
        if ((demands.length > 0)) {
            firstDemand = demands[0];
        }
        
        var otherDemands = [];
        for (i = 1; i < demands.length; i++) {
             otherDemands[i-1] = demands[i];
        }
        
        var context = {firstDemand: firstDemand, demands : otherDemands};
        var html    = template(context);

        return html;
    }

    de.neeedo.webapp.rest.Util.prototype.prepareOfferTemplate = function(offers) {
        if (offers.length == 0) {
            return this.showNoOffers();
        }

        var source   = $(offersTemplate).html();
        var template = Handlebars.compile(source);

        // define placeholders that will be replaced

        var firstOffer = undefined;
        if ((offers.length > 0)) {
            firstOffer = offers[0];
        }

        var otherOffers = [];
        for (i = 1; i < offers.length; i++) {
             otherOffers[i-1] = offers[i];
        }

        var context = {firstOffer: firstOffer, offers : otherOffers};
        var html    = template(context);

        return html;
    }

    de.neeedo.webapp.rest.Util.prototype.showNoDemands =  function() {
        var source = $(noDemandsTemplate).html();
        var template = Handlebars.compile(source);

        var html = template({});

        return html;
    }

    de.neeedo.webapp.rest.Util.prototype.showNoOffers =  function() {
        var source = $(noOffersTemplate).html();
        var template = Handlebars.compile(source);

        var html = template({});

        return html;
    }
    
    de.neeedo.webapp.rest.Util.prototype.renderTemplate = function(renderedHtml) {
        $(carouselInner).html(renderedHtml);
    }

    // singleton
    de.neeedo.webapp.rest.util = new de.neeedo.webapp.rest.Util();
}());