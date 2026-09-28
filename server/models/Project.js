const mongoose = require("mongoose")

const projectSchema = new mongoose.Schema({
  name: String,
  description: String,
  client: String,
  manager: String,
  startDate: String,
  endDate: String,
  budget: Number,
  status: {
    type: String,
    enum: [
      "Planned",
      "In Progress",
      "Completed",
      "Cancelled",
    ],
  },
})

const Project = mongoose.model(
  "Project",
  projectSchema
)

module.exports = Project