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

    de.neeedo.webapp.rest.demands.DemandsConnector = function(connectionOptions, formFields, restUtil) {
        this.connectionOptions = connectionOptions;
        this.formFields = formFields;
        this.restUtil = restUtil;
    }


    de.neeedo.webapp.rest.demands.DemandsConnector.prototype.readFromForm = function() {
        var formName = $(formFields.formName);
        var inputMustTags = $(formFields.mustTags);
        var inputShouldTags = $(formFields.shouldTags);
        var inputMinPrice = $(formFields.minPrice);
        var inputMaxPrice = $(formFields.maxPrice);
        var inputDistance = $(formFields.distance);
        var inputLocationLat = $(formFields.locationLat);
        var inputLocationLon = $(formFields.locationLon);

        var _this = this;
        var demandObj = {
            // TODO adjust userId
            "userId" : "1",
            "mustTags": _this.restUtil.createTagList(inputMustTags),
            "shouldTags": _this.restUtil.createTagList(inputShouldTags),
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
        
        alert('Created demand with ID ' + demand.id);
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
            alert('Could not create your demand.');
            
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
});


