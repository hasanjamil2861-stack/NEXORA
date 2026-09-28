const express = require("express")

const authMiddleware = require("../middleware/authMiddleware")
const roleMiddleware = require("../middleware/roleMiddleware")

const {
  getDocuments,
  postDocument,
  updateDocument,
  deleteDocument,
} = require("../controllers/documentController")

const router = express.Router()

// Create a document
router.post(
  "/documents",
  authMiddleware,
  postDocument
)

// Get all documents
router.get(
  "/documents",
  authMiddleware,
  getDocuments
)

// Update a document
router.put(
  "/documents/:id",
  authMiddleware,
  updateDocument
)

// Delete a document
router.delete(
  "/documents/:id",
  authMiddleware,
  roleMiddleware("Admin"),
  deleteDocument
)

module.exports = router