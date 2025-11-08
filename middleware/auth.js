const jwt = require('jsonwebtoken'); // Import the jsonwebtoken library

/**
 * Middleware to authenticate requests using a JWT.
 * 
 * Checks for a Bearer token in the Authorization header.
 * If valid, attaches the user info (id and role) to req.user.
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void|Object} Returns 401 if unauthorized or invalid token
 */
const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'change_this_to_a_strong_secret');
    req.user = { id: payload.sub, role: payload.role };
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

/**
 * Middleware factory to enforce role-based access control.
 * 
 * Returns a middleware that checks if the authenticated user
 * has the required role. Responds with 403 Forbidden if not.
 * 
 * @param {string} role - The role required to access the route
 * @returns {Function} Express middleware function
 */
const requireRole = (role) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.user.role !== role) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  next();
};

module.exports = { auth, requireRole };
