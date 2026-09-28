const roleMiddleware = (allowedRole) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized"
      })
    }

    if (req.user.role !== allowedRole) {
      return res.status(403).json({
        message: "Access denied. Insufficient permissions."
      })
    }

    next()
  }
}

module.exports = roleMiddleware