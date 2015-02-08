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
this.de.neeedo.webapp.rest.offers = this.de.neeedo.webapp.rest.offers || {};

if (typeof jQuery === 'undefined') {
    throw new Error('Missing dependency: jQuery. Make sure to include it.')
}

(function() {

    de.neeedo.webapp.rest.offers.OffersConnector = function(connectionOptions, formFields, restUtil) {
        this.connectionOptions = connectionOptions;
        this.formFields = formFields;
        this.restUtil = restUtil;
    }


    de.neeedo.webapp.rest.offers.OffersConnector.prototype.readFromForm = function() {
        var formName = $(this.formFields.formName);
        var inputTags = $(this.formFields.tags);
        var inputPrice = $(this.formFields.price);
        var inputLocationLat = $(this.formFields.locationLat);
        var inputLocationLon = $(this.formFields.locationLon);

        var tagsList = [];
        try {
            tagsList = this.restUtil.createTagList(inputTags.val());
        } catch (e) {
            this.showErrorMsgToUser(e);
            return false;
        }

        return {
            // TODO adjust userId
            "userId" : "1",
            "tags": tagsList,
            "location" : {
                "lat" : inputLocationLat.val(),
                "lon" : inputLocationLon.val()
            },
            "price" : inputPrice.val()
        };
    }

    de.neeedo.webapp.rest.offers.OffersConnector.prototype.readFromServerResponse = function(jsonResponse) {
        var offer = jsonResponse.offer;

        this.showSuccessMsgToUser('Created offer with ID ' + offer.id);
    }

    de.neeedo.webapp.rest.offers.OffersConnector.prototype.createOffer = function() {
        var offersObj = this.readFromForm();
        
        if (false === offersObj) {
            return;            
        }
        
        var offersJson = JSON.stringify(offersObj);
        
        console.log('createOffer: will send JSON:');
        console.log(offersJson);
        console.log('');
        
        var url = this.connectionOptions.urls.createOffer;
        
        var _this = this;
        $.ajax({
            type : "POST",
            url : url,
            data : offersJson,
            contentType : "application/json",
            success : _this.onCreateOfferSuccess,
            error : _this.onCreateOfferError
        });
    }
    
    de.neeedo.webapp.rest.offers.OffersConnector.prototype.onCreateOfferSuccess = function(responseData, textStatus, xhr) {
        if (201 == xhr.status) {
            this.readFromServerResponse(responseData);
        } else {
            this.showErrorMsgToUser('Could not create your offer.');
            
            console.log('onCreateOfferSuccess:');
            console.log(xhr);
            console.log(responseData);
            console.log('');
        }
    }    

    de.neeedo.webapp.rest.offers.OffersConnector.prototype.onCreateOfferError = function(xhr, ajaxOptions,
                                                                                              thrownError) {
        alert('Could not create your offer.');
        console.log('onCreateOfferError:');
        console.log(xhr);
        console.log(thrownError);
        console.log('');
    }

    de.neeedo.webapp.rest.offers.OffersConnector.prototype.showErrorMsgToUser = function(msg) {
        var errorRenderer = $(this.formFields.errorRenderer);
        
        errorRenderer.text(msg);
    }
    
    de.neeedo.webapp.rest.offers.OffersConnector.prototype.showSuccessMsgToUser = function(msg) {
        var successRenderer = $(this.formFields.successRenderer);

        successRenderer.text(msg);
    }
}());


