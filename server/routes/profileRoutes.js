const express = require("express")

const {
    getProfile,
    updateProfile,
} = require("../controllers/profileController")

const {
    protect,
    adminOnly,
} = require("../middleware/authMiddleware")

const router = express.Router()

// Admin + Employee can view their own profile
router.get(
    "/profile",
    protect,
    getProfile
)

// Only Admin can update a profile
router.put(
    "/profile",
    protect,
    adminOnly,
    updateProfile
)

module.exports = router