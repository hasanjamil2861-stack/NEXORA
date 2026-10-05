const Task = require("../models/Task")
const Employee = require("../models/Employee")

const getTasks = async (req, res) => {
  try {
    if (req.user.role === "Admin") {
      const tasks = await Task.find()
        .populate(
          "assignedTo",
          "firstName lastName email position"
        )

      return res.json(tasks)
    }

    const employee = await Employee.findOne({
      email: req.user.email,
    })

    if (!employee) {
      return res.status(404).json({
        message: "Employee profile not found.",
      })
    }

    const tasks = await Task.find({
      assignedTo: employee._id,
    }).populate(
      "assignedTo",
      "firstName lastName email position"
    )

    return res.json(tasks)
  } catch (error) {
    console.error(
      "Get tasks error:",
      error
    )

    res.status(500).json({
      message: "Failed to get tasks",
      error: error.message,
    })
  }
}

const postTask = async (req, res) => {
  try {
    const {
      title,
      description,
      status,
      priority,
      assignedTo,
      dueDate,
    } = req.body

    if (
      !title ||
      !description ||
      !assignedTo ||
      !dueDate
    ) {
      return res.status(400).json({
        message:
          "Please provide all required task fields.",
      })
    }

    const employee =
      await Employee.findById(assignedTo)

    if (!employee) {
      return res.status(404).json({
        message:
          "Assigned employee not found.",
      })
    }

    const newTask = new Task({
      title,
      description,
      status,
      priority,
      assignedTo,
      dueDate,
    })

    await newTask.save()

    const populatedTask =
      await Task.findById(
        newTask._id
      ).populate(
        "assignedTo",
        "firstName lastName email position"
      )

    res.status(201).json(
      populatedTask
    )
  } catch (error) {
    console.error(
      "Save task error:",
      error
    )

    res.status(500).json({
      message: "Failed to save task",
      error: error.message,
    })
  }
}

const updateTask = async (req, res) => {
  try {
    const task =
      await Task.findById(
        req.params.id
      )

    if (!task) {
      return res.status(404).json({
        message: "Task not found.",
      })
    }

    if (req.user.role === "Admin") {
      const updatedTask =
        await Task.findByIdAndUpdate(
          req.params.id,
          req.body,
          {
            new: true,
            runValidators: true,
          }
        ).populate(
          "assignedTo",
          "firstName lastName email position"
        )

      return res.json(
        updatedTask
      )
    }

    const employee =
      await Employee.findOne({
        email: req.user.email,
      })

    if (!employee) {
      return res.status(404).json({
        message:
          "Employee profile not found.",
      })
    }

    if (
      task.assignedTo.toString() !==
      employee._id.toString()
    ) {
      return res.status(403).json({
        message:
          "You can only update your own tasks.",
      })
    }

    const allowedStatuses = [
      "Pending",
      "In Progress",
      "Completed",
    ]

    const requestedFields =
      Object.keys(req.body)

    const onlyStatus =
      requestedFields.length === 1 &&
      requestedFields[0] === "status"

    if (!onlyStatus) {
      return res.status(403).json({
        message:
          "Employees can only update task status.",
      })
    }

    if (
      !allowedStatuses.includes(
        req.body.status
      )
    ) {
      return res.status(400).json({
        message:
          "Invalid task status.",
      })
    }

    task.status =
      req.body.status

    await task.save()

    const updatedTask =
      await Task.findById(
        task._id
      ).populate(
        "assignedTo",
        "firstName lastName email position"
      )

    return res.json(
      updatedTask
    )
  } catch (error) {
    console.error(
      "Update task error:",
      error
    )

    res.status(500).json({
      message: "Failed to update task",
      error: error.message,
    })
  }
}

const deleteTask = async (req, res) => {
  try {
    const task =
      await Task.findById(
        req.params.id
      )

    if (!task) {
      return res.status(404).json({
        message: "Task not found.",
      })
    }

    const deletedTask =
      await Task.findByIdAndDelete(
        req.params.id
      )

    res.json({
      message:
        "Task deleted successfully.",
      task: deletedTask,
    })
  } catch (error) {
    console.error(
      "Delete task error:",
      error
    )

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