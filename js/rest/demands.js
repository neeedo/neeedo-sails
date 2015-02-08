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
    de.neeedo.webapp.rest.demands.DemandsConnector = function(connectionOptions, formFields, restUtil) {
        this.connectionOptions = connectionOptions;
        this.formFields = formFields;
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

        this.showSuccessMsgToUser('Created demand with ID ' + demand.id);
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
            __this.showErrorMsgToUser('Could not create your demand.');
            
            console.log('onCreateDemandSuccess:');
            console.log(xhr);
            console.log(responseData);
            console.log('');
        }
    }    

    de.neeedo.webapp.rest.demands.DemandsConnector.prototype.onCreateDemandError = function(xhr, ajaxOptions,
                                                                                              thrownError) {
        alert('Could not create your demand.');
        console.log('onCreateDemandError:');
        console.log(xhr);
        console.log(thrownError);
        console.log('');
    }

    de.neeedo.webapp.rest.demands.DemandsConnector.prototype.showErrorMsgToUser = function(msg) {
        var errorRenderer = $(this.formFields.errorRenderer);
        
        errorRenderer.text(msg);
    }
    
    de.neeedo.webapp.rest.demands.DemandsConnector.prototype.showSuccessMsgToUser = function(msg) {
        var successRenderer = $(this.formFields.successRenderer);

        successRenderer.text(msg);
    }
}());


