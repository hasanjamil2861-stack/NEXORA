const mongoose = require("mongoose")

const taskSchema = new mongoose.Schema({
  title: String,
  description: String,

  status: {
    type: String,
    enum: [
      "Pending",
      "In Progress",
      "Completed",
    ],
  },

  priority: {
    type: String,
    enum: [
      "Low",
      "Medium",
      "High",
    ],
  },

  assignedTo: Number,
  projectId: Number,
  dueDate: String,
})

const Task = mongoose.model(
  "Task",
  taskSchema
)

module.exports = Task