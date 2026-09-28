const Department = require("../models/Department")

// Get all departments
const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find()

    res.json(departments)
  } catch (error) {
    console.error("Get departments error:", error)

    res.status(500).json({
      message: "Failed to get departments",
      error: error.message,
    })
  }
}

// Create a department
const postDepartment = async (req, res) => {
  try {
    const newDepartment = new Department(req.body)

    await newDepartment.save()

    res.status(201).json(newDepartment)
  } catch (error) {
    console.error("Save department error:", error)

    res.status(500).json({
      message: "Failed to save department",
      error: error.message,
    })
  }
}

// Update a department
const updateDepartment = async (req, res) => {
  try {
    const updatedDepartment = await Department.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )

    res.json(updatedDepartment)
  } catch (error) {
    console.error("Update department error:", error)

    res.status(500).json({
      message: "Failed to update department",
      error: error.message,
    })
  }
}

// Delete a department
const deleteDepartment = async (req, res) => {
  try {
    const deletedDepartment =
      await Department.findByIdAndDelete(req.params.id)

    res.json(deletedDepartment)
  } catch (error) {
    console.error("Delete department error:", error)

    res.status(500).json({
      message: "Failed to delete department",
      error: error.message,
    })
  }
}

module.exports = {
  getDepartments,
  postDepartment,
  updateDepartment,
  deleteDepartment,
}