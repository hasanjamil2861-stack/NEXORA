const Employee = require("../models/Employee")

// Get all employees
const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find()

    res.json(employees)
  } catch (error) {
    console.error("Get employees error:", error)

    res.status(500).json({
      message: "Failed to get employees",
      error: error.message,
    })
  }
}

// Create a new employee
const postEmployee = async (req, res) => {
  try {
    const newEmployee = new Employee(req.body)

    await newEmployee.save()

    res.status(201).json(newEmployee)
  } catch (error) {
    console.error("Save employee error:", error)

    res.status(500).json({
      message: "Failed to save employee",
      error: error.message,
    })
  }
}

// Update an existing employee
const updateEmployee = async (req, res) => {
  try {
    const updatedEmployee = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )

    res.json(updatedEmployee)
  } catch (error) {
    console.error("Update employee error:", error)

    res.status(500).json({
      message: "Failed to update employee",
      error: error.message,
    })
  }
}

// Delete an employee
const deleteEmployee = async (req, res) => {
  try {
    const deletedEmployee = await Employee.findByIdAndDelete(
      req.params.id
    )

    res.json(deletedEmployee)
  } catch (error) {
    console.error("Delete employee error:", error)

    res.status(500).json({
      message: "Failed to delete employee",
      error: error.message,
    })
  }
}

module.exports = {
  getEmployees,
  postEmployee,
  updateEmployee,
  deleteEmployee,
}