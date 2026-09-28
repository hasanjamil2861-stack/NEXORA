/* Document schema */

const mongoose = require("mongoose")

const documentSchema = new mongoose.Schema({
  name: String,

  type: {
    type: String,
    enum: ["PDF", "Word", "Excel", "Image"],
  },

  category: {
    type: String,
    enum: [
      "Employee",
      "Contract",
      "Invoice",
      "Project",
      "Company",
    ],
  },

  uploadedBy: String,
  uploadDate: String,

  status: {
    type: String,
    enum: ["Active", "Archived"],
  },
})

const Document = mongoose.model(
  "Document",
  documentSchema
)

module.exports = Document