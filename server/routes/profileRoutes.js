const express = require("express")

const {
    getProfile,
    updateProfile,
    updateAccountCredentials,
} = require("../controllers/profileController")

const {
    protect,
} = require("../middleware/authMiddleware")

const router = express.Router()

// Admin + Employee
router.get(
    "/profile",
    protect,
    getProfile
)

// Admin + Employee
router.put(
    "/profile",
    protect,
    updateProfile
)

// Admin + Employee
// Update login email and/or password
router.put(
    "/profile/account",
    protect,
    updateAccountCredentials
)

module.exports = router