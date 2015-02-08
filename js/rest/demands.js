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

    de.neeedo.webapp.rest.demands.DemandsConnector = function(connectionOptions, formFields, restUtil) {
        this.connectionOptions = connectionOptions;
        this.formFields = formFields;
        this.restUtil = restUtil;
    }


    de.neeedo.webapp.rest.demands.DemandsConnector.prototype.readFromForm = function() {
        var formName = $(this.formFields.formName);
        var inputMustTags = $(this.formFields.mustTags);
        var inputShouldTags = $(this.formFields.shouldTags);
        var inputMinPrice = $(this.formFields.minPrice);
        var inputMaxPrice = $(this.formFields.maxPrice);
        var inputDistance = $(this.formFields.distance);
        var inputLocationLat = $(this.formFields.locationLat);
        var inputLocationLon = $(this.formFields.locationLon);

        var mustTagsList = [];
        var shouldTagsList = [];
        try {
            mustTagsList = this.restUtil.createTagList(inputMustTags.val());
            shouldTagsList = this.restUtil.createTagList(inputShouldTags.val());
        } catch (e) {
            this.showErrorMsgToUser(e);
            return;
        }

        var _this = this;
        var demandObj = {
            // TODO adjust userId
            "userId" : "1",
            "mustTags": mustTagsList,
            "shouldTags": shouldTagsList,
            "location" : {
                "lat" : inputLocationLat.val(),
                "lon" : inputLocationLon.val()
            },
            "distance" : inputDistance.val(),
            "price" : {
                "min" : inputMinPrice.val(),
                "max" : inputMaxPrice.val()
            }
        };
        
        return demandObj;
    }

    de.neeedo.webapp.rest.demands.DemandsConnector.prototype.readFromServerResponse = function(jsonResponse) {
        var demand = jsonResponse.demand;

        this.showErrorMsgToUser('Created demand with ID ' + demand.id);
    }

    de.neeedo.webapp.rest.demands.DemandsConnector.prototype.createDemand = function() {
        var demandObj = this.readFromForm();
        
        var url = this.connectionOptions.urls.createDemand;
        
        var _this = this;
        $.ajax({
            url : url,
            data : JSON.stringify(demandObj),
            contentType : 'application/json',
            type : 'POST',
            success : _this.onCreateDemandSuccess,
            error : _this.onCreateDemandError
        });
    }
    
    de.neeedo.webapp.rest.demands.DemandsConnector.prototype.onCreateDemandSuccess = function(responseData, textStatus, xhr) {
        if (201 == xhr.status) {
            this.readFromServerResponse(responseData);
        } else {
            this.showErrorMsgToUser('Could not create your demand.');
            
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
}());


