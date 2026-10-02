const mongoose = require("mongoose")

const documentSchema =
  new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
        trim: true,
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

      projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        default: null,
      },

      taskId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task",
        default: null,
      },

      uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      fileUrl: {
        type: String,
        required: true,
      },

      fileData: {
        type: Buffer,
        required: true,
      },

      fileContentType: {
        type: String,
        required: true,
      },

      originalFileName: {
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
        default: "Active",
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