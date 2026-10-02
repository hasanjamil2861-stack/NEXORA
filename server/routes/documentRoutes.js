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

router.get(
  "/documents",
  protect,
  getDocuments
)

router.post(
  "/documents",
  protect,
  postDocument
)

router.put(
  "/documents/:id",
  protect,
  adminOnly,
  updateDocument
)

router.delete(
  "/documents/:id",
  protect,
  adminOnly,
  deleteDocument
)

module.exports = router