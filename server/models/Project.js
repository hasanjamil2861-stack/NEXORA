const mongoose = require("mongoose")

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    client: {
      type: String,
      required: true,
    },

    manager: {
      type: String,
      required: true,
    },

    startDate: {
      type: String,
      required: true,
    },

    endDate: {
      type: String,
      required: true,
    },

    budget: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "Planned",
        "In Progress",
        "Completed",
        "Cancelled",
      ],
      default: "Planned",
    },

    assignedEmployees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
      },
    ],
  },
  {
    timestamps: true,
  }
)

const Project = mongoose.model(
  "Project",
  projectSchema
)

module.exports = Project