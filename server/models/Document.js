const mongoose = require("mongoose")

const documentSchema =
  new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
      },

      type: {
        type: String,
        enum: [
          "PDF",
          "Word",
          "Excel",
          "Image",
        ],
        required: true,
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
        required: true,
      },

      employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
        default: null,
      },

      uploadedBy: {
        type: String,
        required: true,
      },

      uploadDate: {
        type: String,
        required: true,
      },

      status: {
        type: String,
        enum: [
          "Active",
          "Archived",
        ],
        required: true,
      },
    },
    {
      timestamps: true,
    }
  )

const Document =
  mongoose.model(
    "Document",
    documentSchema
  )

module.exports = Document