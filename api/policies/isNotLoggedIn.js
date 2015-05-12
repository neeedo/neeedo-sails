/**
 * isNotLoggedIn
 *
 * @module      :: Policy
 * @description :: Policy to check whether the user is NOT logged in (session is not initalized or user logged out)
 *
 */
module.exports = function(req, res, next) {

  if (!LoginService.userIsLoggedIn(req)) {
    return next();
  }

  // User is logged in where he / she is not supposed to be, so redirect to login-success
  return res.view('login/login-success');
};
