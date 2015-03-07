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

if (typeof jQuery === 'undefined') {
    throw new Error('Missing dependency: jQuery. Make sure to include it.')
}

(function() {

    var __this;
    de.neeedo.webapp.rest.demands.DemandsConnector = function(connectionOptions, formFields, viewElements, restUtil) {
        this.connectionOptions = connectionOptions;
        this.formFields = formFields;
        this.viewElements = viewElements;
        this.restUtil = restUtil;
        
        __this = this;
    }


    de.neeedo.webapp.rest.demands.DemandsConnector.prototype.readFromForm = function() {
        var formName = $(this.formFields.formName);
        var inputMustTags = $(this.formFields.mustTags).val();
        var inputShouldTags = $(this.formFields.shouldTags).val();
        var inputMinPrice = parseFloat($(this.formFields.minPrice).val());

        // validate min price
        if (isNaN(inputMinPrice)) {
            this.showErrorMsgToUser('Bitte geben Sie einen minimalen Preis an');
            return false;
        }
        
        // validate max price
        var inputMaxPrice = parseFloat($(this.formFields.maxPrice).val());
        if (isNaN(inputMaxPrice)) {
            this.showErrorMsgToUser('Bitte geben Sie einen maximalen Preis an');
            return false;
        }
        
        // validate distance
        var inputDistance = parseInt($(this.formFields.distance).val());
        if (isNaN(inputDistance)) {
            this.showErrorMsgToUser('Bitte geben Sie eine Distanz an');
            return false;
        }
        
        var inputLocationLat = parseFloat($(this.formFields.locationLat).val());
        var inputLocationLon = parseFloat($(this.formFields.locationLon).val());

        // validate tags
        var mustTagsList = [];
        var shouldTagsList = [];
        try {
            mustTagsList = this.restUtil.createTagList(inputMustTags);
            shouldTagsList = this.restUtil.createTagList(inputShouldTags);
        } catch (e) {
            throw e;
            this.showErrorMsgToUser(e);
            return false;
        }

        // build object to be marshalled
        return {
            // TODO adjust userId
            "userId" : "1",
            "mustTags": mustTagsList,
            "shouldTags": shouldTagsList,
            "location" : {
                "lat" : inputLocationLat,
                "lon" : inputLocationLon
            },
            "distance" : inputDistance,
            "price" : {
                "min" : inputMinPrice,
                "max" : inputMaxPrice
            }
        };
    }

    de.neeedo.webapp.rest.demands.DemandsConnector.prototype.readFromServerResponse = function(jsonResponse) {
        var demand = jsonResponse.demand;

        this.showSuccessMsgToUser('Eine Suche-Karte mit ID ' + demand.id + ' wurde erfolgreich angelegt.');
        
        // TODO do something with returned demand
        
        // refresh view of all demands
        this.getMatchingOffers(demand)
    }

    de.neeedo.webapp.rest.demands.DemandsConnector.prototype.createDemand = function() {
        var demandObj = this.readFromForm();
        
        if (false === demandObj) {
            return;
        }
        
        var demandJson = JSON.stringify(demandObj);
        
        console.log('createDemand: will send JSON:');
        console.log(demandJson);
        console.log('');
        
        var url = this.connectionOptions.urls.createDemand;
        
        var _this = this;
        $.ajax({
            type : "POST",
            url : url,
            data : demandJson,
            contentType : "application/json",
            success : _this.onCreateDemandSuccess,
            error : _this.onCreateDemandError
        });
    }
    
    de.neeedo.webapp.rest.demands.DemandsConnector.prototype.onCreateDemandSuccess = function(responseData, textStatus, xhr) {
        if (201 == xhr.status) {
            __this.readFromServerResponse(responseData);
        } else {
            __this.restUtil.showError('Fehler beim Anlegen der Suche-karte');
            
            console.log('onCreateDemandSuccess:');
            console.log(xhr);
            console.log(responseData);
            console.log('');
        }

        $(__this.viewElements.modal).modal('hide');
    }    

    de.neeedo.webapp.rest.demands.DemandsConnector.prototype.onCreateDemandError = function(xhr, ajaxOptions,
                                                                                              thrownError) {
        alert('Could not create your demand.');
        console.log('onCreateDemandError:');
        console.log(xhr);
        console.log(thrownError);
        console.log('');
    }

    de.neeedo.webapp.rest.demands.DemandsConnector.prototype.getAllDemands = function() {
        var url = this.connectionOptions.urls.listAllDemands;

        var _this = this;
        $.ajax({
            type : "GET",
            url : url,
            accept : "application/json",
            success : _this.onGetAllDemmandsSuccess,
            error : _this.onGetAllDemandsError
        });
    }

    de.neeedo.webapp.rest.demands.DemandsConnector.prototype.getMatchingOffers = function(demand) {
        var url = this.connectionOptions.urls.listMatchingOffers;

        var _this = this;

        var demandJson = JSON.stringify(demand);

        $.ajax({
            type : "POST",
            url : url,
            data : demandJson,
            contentType : "application/json",
            success : _this.onMatchOfferSuccess,
            error : _this.onMatchOfferError
        });
    }

    de.neeedo.webapp.rest.demands.DemandsConnector.prototype.onMatchOfferSuccess = function(responseData, textStatus, xhr) {
        if (200 == xhr.status) {
            __this.showOffers(responseData.matches.matching);
        } else {
            __this.restUtil.showError('Could not get matching offers');

            console.log('onMatchOfferSuccess:');
            console.log(xhr);
            console.log(responseData);
            console.log('');
        }
    }

    de.neeedo.webapp.rest.demands.DemandsConnector.prototype.onMatchOfferError = function(xhr, ajaxOptions,
                                                                                          thrownError) {
        alert('Could not get matching offers.');
        console.log('onMatchOfferError:');
        console.log(xhr);
        console.log(thrownError);
        console.log('');
    }


    de.neeedo.webapp.rest.demands.DemandsConnector.prototype.onGetAllDemmandsSuccess = function(responseData, textStatus, xhr) {
        if (200 == xhr.status) {
            __this.showDemands(responseData);
        } else {
            __this.restUtil.showError('Could not get all demands');

            console.log('onGetAllOfferSuccess:');
            console.log(xhr);
            console.log(responseData);
            console.log('');
        }
    }

    de.neeedo.webapp.rest.demands.DemandsConnector.prototype.showDemands = function(responseData)
    {
        var demands = responseData.demands;
        // render
        __this.restUtil.renderDemands(demands);
        
        for (pos in demands) {
            __this.showSingleDemand(responseData.demands[pos]);
        }
    }

    de.neeedo.webapp.rest.demands.DemandsConnector.prototype.showOffers = function(offers)
    {
        // render
        __this.restUtil.renderOffers(offers);

        for (pos in offers) {
            __this.showSingleOffer(offers[pos]);
        }
    }

    de.neeedo.webapp.rest.demands.DemandsConnector.prototype.showSingleDemand = function(demand)
    {
        // TODO render as container and display in view
        
        console.log('demand... ');
        console.log(demand);      
        console.log('');
    }

    de.neeedo.webapp.rest.demands.DemandsConnector.prototype.showSingleOffer = function(offer)
    {
        // TODO render as container and display in view

        console.log('offer... ');
        console.log(offer);
        console.log('');
    }

    de.neeedo.webapp.rest.demands.DemandsConnector.prototype.onGetAllDemandsError = function(xhr, ajaxOptions,
                                                                                          thrownError) {
        alert('Could not get all demands.');
        console.log('onGetAllDemandsError:');
        console.log(xhr);
        console.log(thrownError);
        console.log('');
    }

    de.neeedo.webapp.rest.demands.DemandsConnector.prototype.showErrorMsgToUser = function(msg) {
        var errorRenderer = $(this.viewElements.errorRenderer);
        
        errorRenderer.text(msg);
    }
    
    de.neeedo.webapp.rest.demands.DemandsConnector.prototype.showSuccessMsgToUser = function(msg) {
        __this.restUtil.showSuccess(msg);
    }
}());


