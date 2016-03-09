/**
 * sessionAuth
 *
 * @module      :: Policy
 * @description :: Simple policy to allow any authenticated user
 *                 Assumes that your login action in one of your controllers sets `req.session.authenticated = true;`
 * @docs        :: http://sailsjs.org/#!/documentation/concepts/Policies
 *
 */
module.exports = function(req, res, next) {

  // Check if req.cookies('token') is in the global <token,userID> object
  if (sails.globals.cookieStore[req.cookies['cookie']]) {
    req.userId = sails.globals.cookieStore[req.cookies['cookie']];
    return next();
  }

  // User is not allowed
  // (default res.forbidden() behavior can be overridden in `config/403.js`)
  return res.json({success: false, content: 'Please login first!'});
};