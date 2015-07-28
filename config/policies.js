/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your controllers.
 * You can apply one or more policies to a given controller, or protect
 * its actions individually.
 *
 * Any policy file (e.g. `api/policies/authenticated.js`) can be accessed
 * below by its filename, minus the extension, (e.g. "authenticated")
 *
 * For more information on how policies work, see:
 * http://sailsjs.org/#/documentation/concepts/Policies
 *
 * For more information on configuring policies, check out:
 * http://sailsjs.org/#/documentation/reference/sails.config/sails.config.policies.html
 */


module.exports.policies = {

  /***************************************************************************
  *                                                                          *
  * Neeedo WebApp policies                                                   *
  *                                                                          *
  *                                                                          *
  ***************************************************************************/

  IndexController: {
    'index': ['resetUploadedFiles', 'setLocale', 'setRedirectUrl']
  },
  MessageController: {
    '*'     : false,
    'create': ['setLocale', 'isLoggedIn'],
    'mailbox': ['setLocale', 'setRedirectUrl', 'isLoggedIn'],
    'viewMessage': ['setLocale', 'setRedirectUrl', 'isLoggedIn'],
    'ajaxGetUnreadMessagesCount':['isLoggedIn'],
    'ajaxLoadMessagesByConversation':['isLoggedIn']
  },
  FavoritesController: {
    '*'     : false,
    'favoritesList': ['setLocale', 'setRedirectUrl', 'isLoggedIn'],
    'ajaxToggleFavorite':['isLoggedIn']
  },
  OfferController: {
    '*'     : false,
    'view': ['setLocale', 'setRedirectUrl'],
    'ajaxGet': ['setLocale'],
    'ajaxGetSingle': ['setLocale'],
    'create': ['setLocale', 'setRedirectUrl', 'isLoggedIn'],
    'edit': ['setLocale', 'setRedirectUrl', 'isLoggedIn'],
    'delete': ['resetUploadedFiles', 'setLocale', 'setRedirectUrl', 'isLoggedIn']
  },
  DemandController: {
    '*'     : false,
    'view'  : ['setLocale', 'setRedirectUrl'],
    'ajaxGet': ['setLocale'],
    'create': ['setLocale', 'setRedirectUrl', 'isLoggedIn'],
    'edit': ['setLocale', 'setRedirectUrl', 'isLoggedIn'],
    'delete': ['resetUploadedFiles', 'setLocale', 'setRedirectUrl', 'isLoggedIn'],
    'matching': ['resetUploadedFiles', 'setLocale', 'setRedirectUrl', 'isLoggedIn'],
    'ajaxMatching': ['resetUploadedFiles', 'setLocale', 'isLoggedIn']
  },
  UserController: {
    '*': ['resetUploadedFiles', 'setLocale', 'isLoggedIn'],
    'ajaxGetOffers' : ['resetUploadedFiles', 'setLocale', 'isLoggedIn'],
    'ajaxGetDemands' : ['resetUploadedFiles', 'setLocale', 'isLoggedIn'],
    // setLocale can be accessed public and logged-in
    'setLocale': ['resetUploadedFiles', 'setLocale'],
    'dashboard': ['resetUploadedFiles', 'setLocale', 'isLoggedIn', 'setRedirectUrl']
  },
  LoginController: {
    '*': ['resetUploadedFiles', 'setLocale', false], // default policy for login controller actions

    'login' : ['resetUploadedFiles', 'setLocale', 'isNotLoggedIn'],
    'logout' : ['resetUploadedFiles', 'setLocale', 'isLoggedIn']
  },
  RegistrationController: {
    '*': ['resetUploadedFiles', 'setLocale', false], // default policy for registration controller actions

    'register' : ['resetUploadedFiles', 'setLocale', 'isNotLoggedIn', 'setRedirectUrl']
  },
  StaticViewsController: {
    '*' : ['setLocale', 'setRedirectUrl'],
    'help' : ['setLocale', 'isLoggedIn']
  },
  FileController: {
    '*' : false,

    'upload' : ['hasValidFileType', 'setLocale', 'isLoggedIn'],
    'uploadAjax' : ['hasValidFileType', 'setLocale', 'isLoggedIn']
  }
};
