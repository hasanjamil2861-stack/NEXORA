const Task = require("../models/Task")

// Get all tasks
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find()

    res.json(tasks)
  } catch (error) {
    console.error("Get tasks error:", error)

    res.status(500).json({
      message: "Failed to get tasks",
      error: error.message,
    })
  }
}

// Create a task
const postTask = async (req, res) => {
  try {
    const newTask = new Task(req.body)

    await newTask.save()

    res.status(201).json(newTask)
  } catch (error) {
    console.error("Save task error:", error)

    res.status(500).json({
      message: "Failed to save task",
      error: error.message,
    })
  }
}

// Update a task
const updateTask = async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )

    res.json(updatedTask)
  } catch (error) {
    console.error("Update task error:", error)

    res.status(500).json({
      message: "Failed to update task",
      error: error.message,
    })
  }
}

// Delete a task
const deleteTask = async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(
      req.params.id
    )

    res.json(deletedTask)
  } catch (error) {
    console.error("Delete task error:", error)

    res.status(500).json({
      message: "Failed to delete task",
      error: error.message,
    })
  }
}

module.exports = {
  getTasks,
  postTask,
  updateTask,
  deleteTask,
}