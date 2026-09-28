const Document = require("../models/Document")

// Get all documents
const getDocuments = async (req, res) => {
  try {
    const documents = await Document.find()

    res.json(documents)
  } catch (error) {
    console.error("Get documents error:", error)

    res.status(500).json({
      message: "Failed to get documents",
      error: error.message,
    })
  }
}

// Create a document
const postDocument = async (req, res) => {
  try {
    const newDocument = new Document(req.body)

    await newDocument.save()

    res.status(201).json(newDocument)
  } catch (error) {
    console.error("Save document error:", error)

    res.status(500).json({
      message: "Failed to save document",
      error: error.message,
    })
  }
}

// Update a document
const updateDocument = async (req, res) => {
  try {
    const updatedDocument =
      await Document.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      )

    res.json(updatedDocument)
  } catch (error) {
    console.error("Update document error:", error)

    res.status(500).json({
      message: "Failed to update document",
      error: error.message,
    })
  }
}

// Delete a document
const deleteDocument = async (req, res) => {
  try {
    const deletedDocument =
      await Document.findByIdAndDelete(
        req.params.id
      )

    res.json(deletedDocument)
  } catch (error) {
    console.error("Delete document error:", error)

    res.status(500).json({
      message: "Failed to delete document",
      error: error.message,
    })
  }
}

module.exports = {
  getDocuments,
  postDocument,
  updateDocument,
  deleteDocument,
}