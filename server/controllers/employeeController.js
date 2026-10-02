const Employee = require("../models/Employee")
const User = require("../models/User")

// Get all employees
const getEmployees = async (req, res) => {
  try {
    const employees =
      await Employee.find().populate(
        "userId",
        "name email role"
      )

    res.json(employees)
  } catch (error) {
    console.error(
      "Get employees error:",
      error
    )

    res.status(500).json({
      message:
        "Failed to get employees",
      error: error.message,
    })
  }
}

// Create a new employee
const postEmployee = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      position,
      departmentId,
      salary,
      hireDate,
      status,
    } = req.body

    const cleanEmail =
      email?.trim().toLowerCase()

    if (
      !firstName?.trim() ||
      !lastName?.trim() ||
      !cleanEmail
    ) {
      return res.status(400).json({
        message:
          "First name, last name and email are required.",
      })
    }

    const existingEmployee =
      await Employee.findOne({
        email: cleanEmail,
      })

    if (existingEmployee) {
      return res.status(409).json({
        message:
          "An employee with this email already exists.",
      })
    }

    // Find the User account using the employee email
    const user =
      await User.findOne({
        email: cleanEmail,
      })

    let linkedUserId = undefined

    if (user) {
      const employeeWithUser =
        await Employee.findOne({
          userId: user._id,
        })

      if (employeeWithUser) {
        return res.status(409).json({
          message:
            "This user account is already linked to an employee.",
        })
      }

      linkedUserId = user._id
    }

    const newEmployee =
      new Employee({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: cleanEmail,
        phone: phone?.trim() || "",
        position: position?.trim() || "",
        departmentId,
        salary,
        hireDate,
        status,
        userId: linkedUserId,
      })

    await newEmployee.save()

    const populatedEmployee =
      await Employee.findById(
        newEmployee._id
      ).populate(
        "userId",
        "name email role"
      )

    res.status(201).json(
      populatedEmployee
    )
  } catch (error) {
    console.error(
      "Save employee error:",
      error
    )

    res.status(500).json({
      message:
        "Failed to save employee",
      error: error.message,
    })
  }
}

// Update an existing employee
const updateEmployee = async (
  req,
  res
) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      position,
      departmentId,
      salary,
      hireDate,
      status,
    } = req.body

    const cleanEmail =
      email?.trim().toLowerCase()

    if (
      !firstName?.trim() ||
      !lastName?.trim() ||
      !cleanEmail
    ) {
      return res.status(400).json({
        message:
          "First name, last name and email are required.",
      })
    }

    const existingEmployee =
      await Employee.findOne({
        email: cleanEmail,
        _id: {
          $ne: req.params.id,
        },
      })

    if (existingEmployee) {
      return res.status(409).json({
        message:
          "An employee with this email already exists.",
      })
    }

    // Find User account using the employee email
    const user =
      await User.findOne({
        email: cleanEmail,
      })

    let linkedUserId = undefined

    if (user) {
      const employeeWithUser =
        await Employee.findOne({
          userId: user._id,
          _id: {
            $ne: req.params.id,
          },
        })

      if (employeeWithUser) {
        return res.status(409).json({
          message:
            "This user account is already linked to another employee.",
        })
      }

      linkedUserId = user._id
    }

    const updatedEmployee =
      await Employee.findByIdAndUpdate(
        req.params.id,
        {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: cleanEmail,
          phone: phone?.trim() || "",
          position: position?.trim() || "",
          departmentId,
          salary,
          hireDate,
          status,
          userId: linkedUserId,
        },
        {
          new: true,
          runValidators: true,
        }
      ).populate(
        "userId",
        "name email role"
      )

    if (!updatedEmployee) {
      return res.status(404).json({
        message:
          "Employee not found.",
      })
    }

    res.json(updatedEmployee)
  } catch (error) {
    console.error(
      "Update employee error:",
      error
    )

    res.status(500).json({
      message:
        "Failed to update employee",
      error: error.message,
    })
  }
}

// Delete an employee
const deleteEmployee = async (
  req,
  res
) => {
  try {
    const deletedEmployee =
      await Employee.findByIdAndDelete(
        req.params.id
      )

    if (!deletedEmployee) {
      return res.status(404).json({
        message:
          "Employee not found.",
      })
    }

    res.json({
      message:
        "Employee deleted successfully.",
      employee: deletedEmployee,
    })
  } catch (error) {
    console.error(
      "Delete employee error:",
      error
    )

    res.status(500).json({
      message:
        "Failed to delete employee",
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