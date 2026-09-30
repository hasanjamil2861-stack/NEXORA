const express = require("express")

const {
    protect,
    adminOnly,
} = require("../middleware/authMiddleware")

const {
    getDocuments,
    postDocument,
    updateDocument,
    deleteDocument,
} = require("../controllers/documentController")

const router = express.Router()

// Create a document - Admin only
router.post(
    "/documents",
    protect,
    adminOnly,
    postDocument
)

// Get all documents - Admin + Employee
router.get(
    "/documents",
    protect,
    getDocuments
)

// Update a document - Admin only
router.put(
    "/documents/:id",
    protect,
    adminOnly,
    updateDocument
)

// Delete a document - Admin only
router.delete(
    "/documents/:id",
    protect,
    adminOnly,
    deleteDocument
)

module.exports = router