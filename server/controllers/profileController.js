const Employee = require("../models/Employee")
const User = require("../models/User")

const getProfile = async (req, res) => {
    try {
        const userId = req.user.userId

        let employee = await Employee.findOne({
            userId,
        })

        // If the user does not have an employee profile yet,
        // create one automatically from the User account.
        if (!employee) {
            const user = await User.findById(userId)

            if (!user) {
                return res.status(404).json({
                    message: "User not found",
                })
            }

            const nameParts = user.name
                ? user.name.trim().split(/\s+/)
                : []

            const firstName =
                nameParts[0] || ""

            const lastName =
                nameParts.slice(1).join(" ") || ""

            employee = await Employee.create({
                userId: user._id,
                firstName,
                lastName,
                email: user.email,
                phone: "",
                position:
                    user.role === "Admin"
                        ? "Administrator"
                        : "Employee",
                departmentId: undefined,
                salary: 0,
                hireDate: "",
                status: "Active",
            })
        }

        res.status(200).json(employee)
    } catch (error) {
        console.error(
            "Get profile error:",
            error
        )

        res.status(500).json({
            message: "Failed to get profile",
            error: error.message,
        })
    }
}

const updateProfile = async (req, res) => {
    try {
        const userId = req.user.userId

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

        let employee = await Employee.findOne({
            userId,
        })

        if (!employee) {
            const user = await User.findById(userId)

            if (!user) {
                return res.status(404).json({
                    message: "User not found",
                })
            }

            employee = new Employee({
                userId,
            })
        }

        employee.firstName = firstName
        employee.lastName = lastName
        employee.email = email
        employee.phone = phone
        employee.position = position
        employee.departmentId =
            departmentId || undefined
        employee.salary = salary
        employee.hireDate = hireDate
        employee.status = status

        const updatedEmployee =
            await employee.save()

        // Keep the login User account email/name
        // synchronized with the editable profile.
        const user = await User.findById(userId)

        if (user) {
            user.email = email

            user.name = `${firstName} ${lastName}`
                .trim()

            await user.save()
        }

        res.status(200).json(
            updatedEmployee
        )
    } catch (error) {
        console.error(
            "Update profile error:",
            error
        )

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