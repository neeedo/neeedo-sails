/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
  * etc. depending on your default view engine) your home page.              *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  '/': 'IndexController.index',

  '/register': 'RegistrationController.register',

  '/login': 'LoginController.login',
  '/logout': 'LoginController.logout',

  /*************************************************************************
   *
   *                        Offers
   *
   *************************************************************************/
  'get /offers/ajax-get' : 'OfferController.ajaxGet',
  '/offers/create' : 'OfferController.create',
  '/offers/view/offerId/:offerId' : 'OfferController.view',
  '/offers/edit/offerId/:offerId' : 'OfferController.edit',
  '/offers/delete/offerId/:offerId' : 'OfferController.delete',

  /*************************************************************************
   *
   *                        Demands
   *
   *************************************************************************/
  'get /demands/ajax-get' : 'DemandController.ajaxGet',
  '/demands/create' : 'DemandController.create',
  '/demands/view/demandId/:demandId' : 'DemandController.view',
  '/demands/edit/demandId/:demandId' : 'DemandController.edit',
  '/demands/delete/demandId/:demandId' : 'DemandController.delete',

  /*************************************************************************
   *
   *                        Matching
   *
   *************************************************************************/
  '/matching/demandId/:demandId': 'DemandController.matching',
  'get /ajax-matching/demandId/:demandId': 'DemandController.ajaxMatching',

  /*************************************************************************
   *
   *                        User
   *
   *************************************************************************/
  '/dashboard': 'UserController.dashboard',
  '/user/setLocale/locale/:locale' : 'UserController.setLocale',
  '/user/ajax-get-demands' : 'UserController.ajaxGetDemands',
  '/user/ajax-get-offers' : 'UserController.ajaxGetOffers',

  /*************************************************************************
   *
   *                        Messages
   *
   *************************************************************************/
  '/messages/create': 'MessageController.create',

  /*************************************************************************
   *
   *                        Files
   *
   *************************************************************************/
  'post /files/upload-ajax' : 'FileController.uploadAjax',
  '/files/upload' : 'FileController.upload'


    /***************************************************************************
  *                                                                          *
  * Custom routes here...                                                    *
  *                                                                          *
  *  If a request to a URL doesn't match any of the custom routes above, it  *
  * is matched against Sails route blueprints. See `config/blueprints.js`    *
  * for configuration options and examples.                                  *
  *                                                                          *
  ***************************************************************************/

};
