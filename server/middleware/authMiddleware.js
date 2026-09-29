const jwt = require("jsonwebtoken")

// Verify that the user is logged in
const protect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization

    if (
      !authHeader ||
      !authHeader.startsWith("Bearer ")
    ) {
      return res.status(401).json({
        message: "Authentication required.",
      })
    }

    const token = authHeader.split(" ")[1]

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    )

    req.user = decoded

    next()
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token.",
    })
  }
}

// Allow only Admin users
const adminOnly = (req, res, next) => {
  if (req.user?.role !== "Admin") {
    return res.status(403).json({
      message:
        "Access denied. Admin permission required.",
    })
  }

  next()
}

module.exports = {
  protect,
  adminOnly,
}