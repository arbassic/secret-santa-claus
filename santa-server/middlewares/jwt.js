const expressJwt = require('express-jwt');
const userService = require('../users/users.service');


async function isRevoked(req, payload, done) {

  const user = await userService.getById(payload.sub);

  // Revoke token if user no longer exists
  if (!user) {

    return done(null, true);
    
  }

  return done();

}


function jwt () {

  const secret = process.env.SECRET;

  return expressJwt({
    isRevoked,
    secret
  }).unless({
    path: [
      // Public routes that don't require authentication
      '/users/authenticate',
      '/users/register',
      '/',
      /\/users\/member/iu
    ]
  });

}


module.exports = jwt;
