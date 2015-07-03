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
    loop:false,
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
    loop:false,
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
        limit : limit,
        getHtml : true
      }, onLoadedCallback
    );
  };

  var loadMoreDemands = function(nextPageNumber, limit, dataSourceUrl, onLoadedCallback) {
    var demandService = new Demands(dataSourceUrl);
    demandService.getDemandsByCriteria({
        page : nextPageNumber,
        limit : limit,
        getHtml : true
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
    $("#lightSliderOffer").append(offer.html);
    lightSliderOffer.refresh();
  };

  var addDemandToSlider = function(demand) {
    $("#lightSliderDemand").append(demand.html);
    lightSliderDemand.refresh();
  };
 // $(".map").css("min-height",$(window).height()-50);
  $(".contentContainer").css("min-height",$(window).height()*0.8);

});
