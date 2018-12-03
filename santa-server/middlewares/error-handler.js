const BAD_HTTP_REQUEST = 400;
const SERVER_ERROR = 500;
const AUTHORIZATION_REQUIRED = 401;

function errorHandler(err, req, res, next) {

  if (typeof err === 'string') {

    // custom application error
    return res.status(BAD_HTTP_REQUEST).json({ message: err });
    
  }

  if (err.name === 'ValidationError') {

    // mongoose validation error
    return res.status(BAD_HTTP_REQUEST).json({ message: err.message });
    
  }

  if (err.name === 'UnauthorizedError') {

    // jwt authentication error
    return res.
      status(AUTHORIZATION_REQUIRED).
      json({ message: 'Invalid Token' });
    
  }

  // default to 500 server error
  return res.status(SERVER_ERROR).json({ message: err.message });
  
}


module.exports = errorHandler;
