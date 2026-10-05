const express = require("express")

const {
    getProfile,
    updateProfile,
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

module.exports = router