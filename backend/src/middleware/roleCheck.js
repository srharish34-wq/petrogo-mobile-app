/**
 * Role-Based Access Control Middleware
 * Checks if user has required role(s)
 */

const { USER_ROLES, HTTP_STATUS, ERROR_MESSAGES } = require('../config/constants');

/**
 * Check if user has required role(s)
 * @param {Array|String} roles - Required role(s)
 */
const checkRole = (roles) => {
  return (req, res, next) => {
    // Check if user is authenticated
    if (!req.user) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        status: 'error',
        message: ERROR_MESSAGES.UNAUTHORIZED
      });
    }
    
    // Convert single role to array
    const allowedRoles = Array.isArray(roles) ? roles : [roles];
    
    // Check if user has required role
    if (!allowedRoles.includes(req.userRole)) {
      return res.status(HTTP_STATUS.FORBIDDEN).json({
        status: 'error',
        message: ERROR_MESSAGES.FORBIDDEN,
        details: `This action requires one of these roles: ${allowedRoles.join(', ')}`
      });
    }
    
    next();
  };
};

/**
 * Admin only access
 */
const adminOnly = checkRole([USER_ROLES.ADMIN]);

/**
 * Customer only access
 */
const customerOnly = checkRole(USER_ROLES.CUSTOMER);

/**
 * Partner only access
 */
const partnerOnly = checkRole(USER_ROLES.DELIVERY_PARTNER);

/**
 * Bunk only access
 */
const bunkOnly = checkRole(USER_ROLES.PETROL_BUNK);

/**
 * Customer or Partner access
 */
const customerOrPartner = checkRole([USER_ROLES.CUSTOMER, USER_ROLES.DELIVERY_PARTNER]);

/**
 * Any authenticated user
 */
const anyAuthenticated = (req, res, next) => {
  if (!req.user) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      status: 'error',
      message: ERROR_MESSAGES.UNAUTHORIZED
    });
  }
  next();
};

module.exports = {
  checkRole,
  adminOnly,
  customerOnly,
  partnerOnly,
  bunkOnly,
  customerOrPartner,
  anyAuthenticated
};