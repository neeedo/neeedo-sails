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
    'index': ['resetUploadedFiles', 'setLocale', 'isNotLoggedIn']
  },
  MessageController: {
    '*'     : false,
    'create': ['setLocale', 'isLoggedIn'],
    'mailbox': ['setLocale', 'setRedirectUrl', 'isLoggedIn'],
    'getUnreadMessagesCount':['isLoggedIn']
  },
  OfferController: {
    '*'     : false,
    'view': ['setLocale', 'setRedirectUrl'],
    'ajaxGet': ['setLocale', 'isNotLoggedIn'],
    'ajaxGetSingle': ['setLocale'],
    'create': ['setLocale', 'setRedirectUrl', 'isLoggedIn'],
    'edit': ['setLocale', 'setRedirectUrl', 'isLoggedIn'],
    'delete': ['resetUploadedFiles', 'setLocale', 'setRedirectUrl', 'isLoggedIn']
  },
  DemandController: {
    '*'     : false,
    'view'  : ['setLocale', 'setRedirectUrl'],
    'ajaxGet': ['setLocale', 'isNotLoggedIn'],
    'create': ['setLocale', 'setRedirectUrl', 'isLoggedIn'],
    'edit': ['setLocale', 'setRedirectUrl', 'isLoggedIn'],
    'delete': ['resetUploadedFiles', 'setLocale', 'setRedirectUrl', 'isLoggedIn'],
    'matching': ['resetUploadedFiles', 'setLocale', 'setRedirectUrl', 'isLoggedIn'],
    'ajaxMatching': ['resetUploadedFiles', 'setLocale', 'setRedirectUrl', 'isLoggedIn']
  },
  UserController: {
    '*': ['resetUploadedFiles', 'setLocale', 'isLoggedIn'],
    'ajaxGetOffers' : ['resetUploadedFiles', 'setLocale', 'setRedirectUrl', 'isLoggedIn'],
    'ajaxGetDemands' : ['resetUploadedFiles', 'setLocale', 'setRedirectUrl', 'isLoggedIn'],
    // setLocale can be accessed public and logged-in
    'setLocale': ['resetUploadedFiles', 'setLocale']
  },
  LoginController: {
    '*': ['resetUploadedFiles', 'setLocale', 'setRedirectUrl', false], // default policy for login controller actions

    'login' : ['resetUploadedFiles', 'setLocale', 'isNotLoggedIn'],
    'logout' : ['resetUploadedFiles', 'setLocale', 'isLoggedIn']
  },
  RegistrationController: {
    '*': ['resetUploadedFiles', 'setLocale', 'setRedirectUrl', false], // default policy for registration controller actions

    'register' : ['resetUploadedFiles', 'setLocale', 'isNotLoggedIn']
  },
  FileController: {
    '*' : false,

    'upload' : ['hasValidFileType', 'setLocale', 'isLoggedIn'],
    'uploadAjax' : ['hasValidFileType', 'setLocale', 'isLoggedIn']
  }
};
