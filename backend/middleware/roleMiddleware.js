const roleMiddleware = (allowedRoles) => {
  return (req, res, next) => {
    // req.user should be populated by authMiddleware
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized: No user session found.' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden: Insufficient permissions.' });
    }

    next();
  };
};

module.exports = roleMiddleware;
