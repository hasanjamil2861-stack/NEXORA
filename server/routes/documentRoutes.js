const express = require("express")

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware")

const upload =
  require("../middleware/uploadMiddleware")

const {
  getDocuments,
  postDocument,
  updateDocument,
  deleteDocument,
} = require("../controllers/documentController")

const {
  uploadDocument,
} = require("../controllers/documentUploadController")

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

router.post(
  "/documents/upload",
  protect,
  upload.single("file"),
  uploadDocument
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