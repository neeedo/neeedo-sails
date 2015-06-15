/**
 * isLoggedIn
 *
 * @module      :: Policy
 * @description :: Policy to check whether the user is logged in (was authenticated via neeedo-api during the login action)
 *
 */
module.exports = function(req, res, next) {

  if (LoginService.userIsLoggedIn(req)) {
    return next();
  }

  // User is not logged in where he / she is not supposed to be, so redirect to login
  return res.view('registration/register');
};
