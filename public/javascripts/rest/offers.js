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
    var __this;
    
    de.neeedo.webapp.rest.offers.OffersConnector = function(connectionOptions, formFields, viewElements, restUtil) {
        this.connectionOptions = connectionOptions;
        this.formFields = formFields;
        this.viewElements = viewElements;
        this.restUtil = restUtil;
        
        __this = this;
    }


    de.neeedo.webapp.rest.offers.OffersConnector.prototype.readFromForm = function() {
        var formName = $(this.formFields.formName);
        var inputTags = $(this.formFields.tags).val();
        var inputPrice = parseFloat($(this.formFields.price).val());

        // validate price
        if (isNaN(inputPrice)) {
            this.showErrorMsgToUser('Bitte geben Sie einen Preis an');
            return false;
        }
        
        var inputLocationLat = parseFloat($(this.formFields.locationLat).val());
        var inputLocationLon = parseFloat($(this.formFields.locationLon).val());

        var tagsList = [];
        try {
            tagsList = this.restUtil.createTagList(inputTags);
        } catch (e) {
            this.showErrorMsgToUser(e);
            return false;
        }

        return {
            // TODO adjust userId
            "userId" : "1",
            "tags": tagsList,
            "location" : {
                "lat" : inputLocationLat,
                "lon" : inputLocationLon
            },
            "price" : inputPrice
        };
    }

    de.neeedo.webapp.rest.offers.OffersConnector.prototype.readFromServerResponse = function(jsonResponse) {
        var offer = jsonResponse.offer;

        this.showSuccessMsgToUser('Eine Biete-Karte mit der ID ' + offer.id + ' wurde angelegt.');
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
            __this.readFromServerResponse(responseData);
        } else {
            __this.restUtil.showError('Fehler beim Anlegen der Biete-Karte');
            
            console.log('onCreateOfferSuccess:');
            console.log(xhr);
            console.log(responseData);
            console.log('');
        }
        
        $(__this.viewElements.modal).modal('hide');
    }    

    de.neeedo.webapp.rest.offers.OffersConnector.prototype.onCreateOfferError = function(xhr, ajaxOptions,
                                                                                              thrownError) {
        __this.restUtil.showError('Could not create your offer.');
        console.log('onCreateOfferError:');
        console.log(xhr);
        console.log(thrownError);
        console.log('');
    }

    de.neeedo.webapp.rest.offers.OffersConnector.prototype.showErrorMsgToUser = function(msg) {
        var errorRenderer = $(this.viewElements.errorRenderer);
        
        errorRenderer.text(msg);
    }
    
    de.neeedo.webapp.rest.offers.OffersConnector.prototype.showSuccessMsgToUser = function(msg) {
        __this.restUtil.showSuccess(msg);
    }
}());


