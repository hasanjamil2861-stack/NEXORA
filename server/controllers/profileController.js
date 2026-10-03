const Employee = require("../models/Employee")

const getProfile = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id)

        if (!employee) {
            return res.status(404).json({
                message: "Profile not found",
            })
        }

        res.status(200).json(employee)
    } catch (error) {
        res.status(500).json({
            message: "Failed to get profile",
            error: error.message,
        })
    }
}

const updateProfile = async (req, res) => {
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

        const employee = await Employee.findById(
            req.params.id
        )

        if (!employee) {
            return res.status(404).json({
                message: "Profile not found",
            })
        }

        employee.firstName = firstName
        employee.lastName = lastName
        employee.email = email
        employee.phone = phone
        employee.position = position
        employee.departmentId = departmentId
        employee.salary = salary
        employee.hireDate = hireDate
        employee.status = status

        const updatedEmployee =
            await employee.save()

        res.status(200).json(updatedEmployee)
    } catch (error) {
        res.status(500).json({
            message: "Failed to update profile",
            error: error.message,
        })
    }
}

module.exports = {
    getProfile,
    updateProfile,
}