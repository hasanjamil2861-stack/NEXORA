const Project = require("../models/Project")

// Get all projects
const getProjects = async (req, res) => {
  try {
    const projects = await Project.find()

    res.json(projects)
  } catch (error) {
    console.error("Get projects error:", error)

    res.status(500).json({
      message: "Failed to get projects",
      error: error.message,
    })
  }
}

// Create a project
const postProject = async (req, res) => {
  try {
    const newProject = new Project(req.body)

    await newProject.save()

    res.status(201).json(newProject)
  } catch (error) {
    console.error("Save project error:", error)

    res.status(500).json({
      message: "Failed to save project",
      error: error.message,
    })
  }
}

// Update a project
const updateProject = async (req, res) => {
  try {
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )

    res.json(updatedProject)
  } catch (error) {
    console.error("Update project error:", error)

    res.status(500).json({
      message: "Failed to update project",
      error: error.message,
    })
  }
}

// Delete a project
const deleteProject = async (req, res) => {
  try {
    const deletedProject = await Project.findByIdAndDelete(
      req.params.id
    )

    res.json(deletedProject)
  } catch (error) {
    console.error("Delete project error:", error)

    res.status(500).json({
      message: "Failed to delete project",
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