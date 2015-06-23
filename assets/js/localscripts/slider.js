/* ##############################################
 *
 *              CONTENT ELEMENTS
 *       Dynamic Demand + Offer Reloading
 *
 * #############################################
 */

$(document).ready(function() {
  /**
   * Object of URL -> page number to keep info if the page number was already AJAX-requested.
   * @type {{}}
   */
  var alreadyLoaded = {};
  var viewOfferUrl, viewDemandUrl, offerTranslations, demandTranslations,
    lightSliderOffer, lightSliderDemand;

  var lightSliderOfferEl = $("#lightSliderOffer");

  // pagination info for AJAX reload of demands and offers
  var offerFirstPageNumber = lightSliderOfferEl.data('currentpage');
  var offerLimit = lightSliderOfferEl.data('itemlimit');
  var offerSourceUrl = lightSliderOfferEl.data('sourceurl');
  viewOfferUrl = lightSliderOfferEl.data('viewurl');
  offerTranslations = {
    'price' : lightSliderOfferEl.data('translationprice')
  };

  lightSliderOffer = $("#lightSliderOffer").lightSlider({
    loop:true,
    autoWidth: false,
    adaptiveHeight: false,
    easing: 'cubic-bezier(0.25, 0, 0.25, 1)',
    responsive : [
      {
        breakpoint:1024,
        settings: {
          item:2,
          slideMove:1
        }
      }
    ],
    onBeforeSlide: function (el) {
      var nextPageNumber = calculateNextPageNumber(el.getCurrentSlideCount(), offerFirstPageNumber, offerLimit);

      // current slide count starts at 1
      if (el.getCurrentSlideCount() % offerLimit <= 2
        && !wasAlreadyLoaded(offerSourceUrl, nextPageNumber)) {
        // reload on second-last item
        loadMoreOffers(nextPageNumber, offerLimit, offerSourceUrl, function(returnedData) {
          if (! (offerSourceUrl in alreadyLoaded)) {
            alreadyLoaded[offerSourceUrl] = [];
          }

          // store that page number was already requested
          alreadyLoaded[offerSourceUrl].push(nextPageNumber);

          addOffersToSlider(returnedData);
        });
      }

      console.log('current slide count: ' + el.getCurrentSlideCount());
    }
  });

  var lightSliderDemandEl = $("#lightSliderDemand");

  // pagination info for AJAX reload of demands and offers
  var demandFirstPageNumber = lightSliderDemandEl.data('currentpage');
  var demandLimit = lightSliderDemandEl.data('itemlimit');
  var demandSourceUrl = lightSliderDemandEl.data('sourceurl');

  demandTranslations ={
    'price' : lightSliderDemandEl.data('translationprice'),
    'distance' : lightSliderDemandEl.data('translationdistance')
  };

  viewDemandUrl = lightSliderDemandEl.data('viewurl');

  lightSliderDemand = $("#lightSliderDemand").lightSlider({
    loop:true,
    autoWidth: false,
    adaptiveHeight: false,
    easing: 'cubic-bezier(0.25, 0, 0.25, 1)',
    responsive : [
      {
        breakpoint:1024,
        settings: {
          item:2,
          slideMove:1
        }
      }
    ],
    onBeforeSlide: function (el) {
      var nextPageNumber = calculateNextPageNumber(el.getCurrentSlideCount(), demandFirstPageNumber, demandLimit);

      // current slide count starts at 1
      if (el.getCurrentSlideCount() % demandLimit <= 2
        && !wasAlreadyLoaded(demandSourceUrl, nextPageNumber)) {
        // reload on second-last item
        loadMoreDemands(nextPageNumber, demandLimit, demandSourceUrl, function(returnedData) {
          if (! (demandSourceUrl in alreadyLoaded)) {
            alreadyLoaded[demandSourceUrl] = [];
          }

          // store that page number was already requested
          alreadyLoaded[demandSourceUrl].push(nextPageNumber);

          addDemandsToSlider(returnedData);
        });
      }

      console.log('current slide count: ' + el.getCurrentSlideCount());
    }
  });
  new CBPFWTabs( document.getElementById( 'tabs' ) );


  var wasAlreadyLoaded = function(dataSourceUrl, nextPageNumber) {
    return dataSourceUrl in alreadyLoaded &&  -1 !== alreadyLoaded[dataSourceUrl].indexOf(nextPageNumber);
  };

  var calculateNextPageNumber = function(currentItemNumber, firstPageNumber, limit) {
    return Math.floor(currentItemNumber / limit) + firstPageNumber + 1;
  };

  var loadMoreOffers = function(nextPageNumber, limit, dataSourceUrl, onLoadedCallback) {
    var offerService = new Offers(dataSourceUrl);
    offerService.getOffersByCriteria({
        page : nextPageNumber,
        limit : limit
      }, onLoadedCallback
    );
  };

  var loadMoreDemands = function(nextPageNumber, limit, dataSourceUrl, onLoadedCallback) {
    var demandService = new Demands(dataSourceUrl);
    demandService.getDemandsByCriteria({
        page : nextPageNumber,
        limit : limit
      }, onLoadedCallback
    );
  };

  var addDemandsToSlider = function(returnedData) {
    console.log('adding demands to slider: ' + returnedData);

    if ('demandList' in returnedData) {
      if ('demands' in returnedData['demandList']) {
        for (var i=0; i < returnedData['demandList']['demands'].length; i++) {
          var demand = returnedData['demandList']['demands'][i];
          addDemandToSlider(demand);
        }
      }
    }
  };

  var addOffersToSlider = function(returnedData) {
    console.log('adding offers to slider: ' + returnedData);

    if ('offerList' in returnedData) {
      if ('offers' in returnedData['offerList']) {
        for (var i=0; i < returnedData['offerList']['offers'].length; i++) {
          var offer = returnedData['offerList']['offers'][i];
          addOfferToSlider(offer);
        }
      }
    }
  };

  var addOfferToSlider = function(offer) {
    var html = renderOfferInAjaxTemplate(offer);

    lightSliderOffer.prepend(html);
    lightSliderOffer.refresh();
  };

  var addDemandToSlider = function(demand) {
    var html = renderDemandInAjaxTemplate(demand);

    lightSliderDemand.prepend(html);
    lightSliderDemand.refresh();
  };

  var renderOfferInAjaxTemplate = function(offer) {
    var source = $("#offerHandlebarsListItem").html();
    var template = Handlebars.compile(source);

    var image = '/images/Offer_Dummy.png';
    var imageTitle = 'Dummy';

    var viewUrl = viewOfferUrl.replace('%%offerId%%', offer.id);

    var firstImage = undefined;
    if (offer.imageList.images.length > 0) {
      var image = offer.imageList.images[0];

      firstImage = {
        url: neeedo.filterImageUrl(offer.imageList.baseUrl) + '/' + image.fileName,
        alt: image.fileName
      };
    }

    var offerContext = offer;
    offerContext['viewUrl'] = viewUrl;
    offerContext['firstImage'] = firstImage;

    var context = {
      offer: offerContext,
      translations: offerTranslations
    };

    return template(context);
  };

  var renderDemandInAjaxTemplate = function(demand) {
    var source = $("#demandHandlebarsListItem").html();
    var template = Handlebars.compile(source);
    var viewUrl = viewDemandUrl.replace('%%demandId%%', demand.id);

    var demandContext = demand;
    demandContext['viewUrl'] = viewUrl;

    var context = {
      demand: demandContext,
      translations: demandTranslations
    };

    return template(context);
  };
});
