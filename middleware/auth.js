const jwt = require('jsonwebtoken');
const asynchandler = require('./async');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');
let token;
//Protect routes
exports.protect = asynchandler(async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  //  else if(req.cookies.token) {
  //      token = req.cookies.token;
  //  }
  if (!token)
    return next(new ErrorResponse('Not authorised to access this route', 401));
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(decoded);
    req.user = await User.findById(decoded.id);
    next();
  } catch (error) {
    return next(new ErrorResponse('Not authorised to access this route', 401));
  }
});

// Grant access to specific roles
exports.authorise = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `User role ${req.user.role} is not authorised to access this route`,
          403
        )
      );
    }
    next();
  };
};
