const Task = require("../models/Task")
const Employee = require("../models/Employee")

// =========================================================
// GET ALL TASKS
// =========================================================

async function getTasks(req, res) {
  try {
    const user = req.user

    // -------------------------------------------------------
    // ADMIN
    // -------------------------------------------------------

    if (user?.role === "Admin") {
      const tasks = await Task.find()
        .populate(
          "assignedTo",
          "firstName lastName email position"
        )
        .sort({ createdAt: -1 })

      return res.status(200).json(tasks)
    }

    // -------------------------------------------------------
    // EMPLOYEE
    // -------------------------------------------------------

    const employee = await Employee.findOne({
      email: user?.email,
    })

    if (!employee) {
      return res.status(404).json({
        message: "Employee profile not found",
      })
    }

    const tasks = await Task.find({
      assignedTo: employee._id,
    })
      .populate(
        "assignedTo",
        "firstName lastName email position"
      )
      .sort({ createdAt: -1 })

    return res.status(200).json(tasks)
  } catch (error) {
    console.error(
      "Get tasks error:",
      error
    )

    return res.status(500).json({
      message: "Failed to load tasks",
      error: error.message,
    })
  }
}

// =========================================================
// CREATE TASK
// =========================================================

async function postTask(req, res) {
  try {
    const {
      title,
      description,
      status,
      priority,
      assignedTo,
      dueDate,
    } = req.body

    // -------------------------------------------------------
    // VALIDATION
    // -------------------------------------------------------

    if (
      !title ||
      !description ||
      !assignedTo ||
      !dueDate
    ) {
      return res.status(400).json({
        message:
          "Title, description, assigned employee, and due date are required.",
      })
    }

    // -------------------------------------------------------
    // CHECK EMPLOYEE
    // -------------------------------------------------------

    const employee =
      await Employee.findById(
        assignedTo
      )

    if (!employee) {
      return res.status(404).json({
        message:
          "Assigned employee not found.",
      })
    }

    // -------------------------------------------------------
    // CREATE TASK
    // -------------------------------------------------------

    const task =
      new Task({
        title: title.trim(),

        description:
          description.trim(),

        status:
          status || "Pending",

        priority:
          priority || "Medium",

        assignedTo,

        dueDate,
      })

    const savedTask =
      await task.save()

    // -------------------------------------------------------
    // POPULATE EMPLOYEE
    // -------------------------------------------------------

    await savedTask.populate(
      "assignedTo",
      "firstName lastName email position"
    )

    return res.status(201).json(
      savedTask
    )
  } catch (error) {
    console.error(
      "Create task error:",
      error
    )

    return res.status(500).json({
      message:
        "Failed to create task",
      error: error.message,
    })
  }
}

// =========================================================
// UPDATE TASK
// =========================================================

async function updateTask(req, res) {
  try {
    const { id } = req.params

    const {
      title,
      description,
      status,
      priority,
      assignedTo,
      dueDate,
    } = req.body

    const user = req.user

    const task =
      await Task.findById(id)

    if (!task) {
      return res.status(404).json({
        message:
          "Task not found",
      })
    }

    // -------------------------------------------------------
    // ADMIN
    // -------------------------------------------------------

    if (user?.role === "Admin") {
      task.title =
        title !== undefined
          ? title.trim()
          : task.title

      task.description =
        description !== undefined
          ? description.trim()
          : task.description

      task.status =
        status !== undefined
          ? status
          : task.status

      task.priority =
        priority !== undefined
          ? priority
          : task.priority

      task.assignedTo =
        assignedTo !== undefined
          ? assignedTo
          : task.assignedTo

      task.dueDate =
        dueDate !== undefined
          ? dueDate
          : task.dueDate

      const updatedTask =
        await task.save()

      await updatedTask.populate(
        "assignedTo",
        "firstName lastName email position"
      )

      return res.status(200).json(
        updatedTask
      )
    }

    // -------------------------------------------------------
    // EMPLOYEE
    // -------------------------------------------------------

    const employee =
      await Employee.findOne({
        email: user?.email,
      })

    if (!employee) {
      return res.status(404).json({
        message:
          "Employee profile not found",
      })
    }

    if (
      String(task.assignedTo) !==
      String(employee._id)
    ) {
      return res.status(403).json({
        message:
          "You are not allowed to update this task.",
      })
    }

    // Employee can only update status
    if (status !== undefined) {
      task.status = status
    }

    const updatedTask =
      await task.save()

    await updatedTask.populate(
      "assignedTo",
      "firstName lastName email position"
    )

    return res.status(200).json(
      updatedTask
    )
  } catch (error) {
    console.error(
      "Update task error:",
      error
    )

    return res.status(500).json({
      message:
        "Failed to update task",
      error: error.message,
    })
  }
}

// =========================================================
// DELETE TASK
// =========================================================

async function deleteTask(req, res) {
  try {
    const { id } = req.params

    const task =
      await Task.findById(id)

    if (!task) {
      return res.status(404).json({
        message:
          "Task not found",
      })
    }

    await Task.findByIdAndDelete(id)

    return res.status(200).json({
      message:
        "Task deleted successfully",
    })
  } catch (error) {
    console.error(
      "Delete task error:",
      error
    )

    return res.status(500).json({
      message:
        "Failed to delete task",
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