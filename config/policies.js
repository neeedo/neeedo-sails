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
    'index': ['setLocale', 'isNotLoggedIn', 'setRedirectUrl']
  },
  OfferController: {
    '*': ['setLocale', 'setRedirectUrl', 'isLoggedIn']
  },
  DemandController: {
    '*': ['setLocale', 'setRedirectUrl', 'isLoggedIn']
  },
  UserController: {
    '*': ['setLocale', 'setRedirectUrl', 'isLoggedIn'],

    // setLocale can be accessed public and logged-in
    'setLocale': ['setLocale']
  },
  LoginController: {
    '*': ['setLocale', 'setRedirectUrl', false], // default policy for login controller actions

    'login' : ['setLocale', 'isNotLoggedIn'],
    'logout' : ['setLocale', 'setRedirectUrl', 'isLoggedIn']
  },
  RegistrationController: {
    '*': ['setLocale', 'setRedirectUrl', false], // default policy for registration controller actions

    'register' : ['setLocale', 'setRedirectUrl', 'isNotLoggedIn']
  }
};
