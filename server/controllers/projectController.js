const Project = require("../models/Project")
const Employee = require("../models/Employee")

// Get projects
const getProjects = async (req, res) => {
  try {
    // Admin can see all projects
    if (req.user.role === "Admin") {
      const projects =
        await Project.find().populate(
          "assignedEmployees",
          "firstName lastName email position"
        )

      return res.json(projects)
    }

    // Find the Employee profile using the logged-in user's email
    const employee =
      await Employee.findOne({
        email: req.user.email,
      })

    if (!employee) {
      return res.status(404).json({
        message:
          "Employee profile not found for this account.",
      })
    }

    // Employee sees only projects assigned to him
    const projects =
      await Project.find({
        assignedEmployees: employee._id,
      }).populate(
        "assignedEmployees",
        "firstName lastName email position"
      )

    return res.json(projects)
  } catch (error) {
    console.error(
      "Get projects error:",
      error
    )

    res.status(500).json({
      message:
        "Failed to get projects",
      error: error.message,
    })
  }
}

// Create project - Admin only through route
const postProject = async (req, res) => {
  try {
    const {
      name,
      description,
      client,
      manager,
      startDate,
      endDate,
      budget,
      status,
      assignedEmployees,
    } = req.body

    if (
      !name ||
      !description ||
      !client ||
      !manager ||
      !startDate ||
      !endDate ||
      budget === undefined
    ) {
      return res.status(400).json({
        message:
          "Please provide all required project fields.",
      })
    }

    if (
      !Array.isArray(
        assignedEmployees
      )
    ) {
      return res.status(400).json({
        message:
          "assignedEmployees must be an array.",
      })
    }

    const employees =
      await Employee.find({
        _id: {
          $in: assignedEmployees,
        },
      })

    if (
      employees.length !==
      assignedEmployees.length
    ) {
      return res.status(400).json({
        message:
          "One or more assigned employees were not found.",
      })
    }

    const newProject =
      new Project({
        name,
        description,
        client,
        manager,
        startDate,
        endDate,
        budget,
        status,
        assignedEmployees,
      })

    await newProject.save()

    const populatedProject =
      await Project.findById(
        newProject._id
      ).populate(
        "assignedEmployees",
        "firstName lastName email position"
      )

    res.status(201).json(
      populatedProject
    )
  } catch (error) {
    console.error(
      "Save project error:",
      error
    )

    res.status(500).json({
      message:
        "Failed to save project",
      error: error.message,
    })
  }
}

// Update project - Admin only through route
const updateProject = async (
  req,
  res
) => {
  try {
    const {
      name,
      description,
      client,
      manager,
      startDate,
      endDate,
      budget,
      status,
      assignedEmployees,
    } = req.body

    if (
      assignedEmployees !==
        undefined &&
      !Array.isArray(
        assignedEmployees
      )
    ) {
      return res.status(400).json({
        message:
          "assignedEmployees must be an array.",
      })
    }

    if (
      Array.isArray(
        assignedEmployees
      )
    ) {
      const employees =
        await Employee.find({
          _id: {
            $in: assignedEmployees,
          },
        })

      if (
        employees.length !==
        assignedEmployees.length
      ) {
        return res.status(400).json({
          message:
            "One or more assigned employees were not found.",
        })
      }
    }

    const updatedProject =
      await Project.findByIdAndUpdate(
        req.params.id,
        {
          name,
          description,
          client,
          manager,
          startDate,
          endDate,
          budget,
          status,
          assignedEmployees,
        },
        {
          new: true,
          runValidators: true,
        }
      ).populate(
        "assignedEmployees",
        "firstName lastName email position"
      )

    if (!updatedProject) {
      return res.status(404).json({
        message:
          "Project not found.",
      })
    }

    res.json(updatedProject)
  } catch (error) {
    console.error(
      "Update project error:",
      error
    )

    res.status(500).json({
      message:
        "Failed to update project",
      error: error.message,
    })
  }
}

// Delete project - Admin only through route
const deleteProject = async (
  req,
  res
) => {
  try {
    const deletedProject =
      await Project.findByIdAndDelete(
        req.params.id
      )

    if (!deletedProject) {
      return res.status(404).json({
        message:
          "Project not found.",
      })
    }

    res.json({
      message:
        "Project deleted successfully.",
      project: deletedProject,
    })
  } catch (error) {
    console.error(
      "Delete project error:",
      error
    )

    res.status(500).json({
      message:
        "Failed to delete project",
      error: error.message,
    })
  }
}

module.exports = {
  getProjects,
  postProject,
  updateProject,
  deleteProject,
}