const Employee = require("../models/Employee")
const User = require("../models/User")
const Department = require("../models/Department")
const bcrypt = require("bcryptjs")

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

        let manager = ""
        let department = null

        // Get manager from the employee's department
        if (
            employee.departmentId !== undefined &&
            employee.departmentId !== null
        ) {
            department = await Department.findOne({
                id: employee.departmentId,
            })

            manager = department?.manager || ""
        }

        res.status(200).json({
            ...employee.toObject(),
            manager,
        })
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

        const cleanFirstName =
            firstName?.trim()

        const cleanLastName =
            lastName?.trim()

        const cleanEmail =
            email?.trim().toLowerCase()

        if (
            !cleanFirstName ||
            !cleanLastName ||
            !cleanEmail
        ) {
            return res.status(400).json({
                message:
                    "First name, last name and email are required.",
            })
        }

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

        // Check if another employee already uses this email
        const existingEmployee =
            await Employee.findOne({
                email: cleanEmail,
                _id: {
                    $ne: employee._id,
                },
            })

        if (existingEmployee) {
            return res.status(409).json({
                message:
                    "An employee with this email already exists.",
            })
        }

        // Validate selected department
        let department = null

        if (
            departmentId !== undefined &&
            departmentId !== null &&
            departmentId !== ""
        ) {
            department =
                await Department.findOne({
                    id: Number(departmentId),
                })

            if (!department) {
                return res.status(400).json({
                    message:
                        "Selected department was not found.",
                })
            }
        }

        // ==========================================
        // FIELDS BOTH ADMIN AND EMPLOYEE CAN EDIT
        // ==========================================

        employee.firstName =
            cleanFirstName

        employee.lastName =
            cleanLastName

        employee.email =
            cleanEmail

        employee.phone =
            phone?.trim() || ""

        employee.departmentId =
            department?.id

        // ==========================================
        // ADMIN ONLY FIELDS
        // ==========================================

        if (req.user.role === "Admin") {
            employee.position =
                position?.trim() ||
                "Administrator"

            employee.salary =
                salary ?? employee.salary

            employee.hireDate =
                hireDate ?? employee.hireDate

            employee.status =
                status || employee.status
        } else {
            // ======================================
            // EMPLOYEE PROTECTION
            // ======================================

            // Employee is always an Employee.
            // The frontend cannot change this,
            // and neither can Postman/API requests.
            employee.position = "Employee"

            // Salary is NOT changed here.
            // Existing salary remains untouched.

            // Hire date is NOT changed here.
            // Existing hire date remains untouched.

            // Status is NOT changed here.
            // Existing status remains untouched.
        }

        const updatedEmployee =
            await employee.save()

        // ==========================================
        // UPDATE USER ACCOUNT
        // ==========================================

        const user = await User.findById(userId)

        if (user) {
            user.email = cleanEmail

            user.name =
                `${cleanFirstName} ${cleanLastName}`.trim()

            await user.save()
        }

        // ==========================================
        // GET MANAGER FROM DEPARTMENT
        // ==========================================

        let manager = ""

        if (
            updatedEmployee.departmentId !==
                undefined &&
            updatedEmployee.departmentId !== null
        ) {
            const updatedDepartment =
                await Department.findOne({
                    id:
                        updatedEmployee.departmentId,
                })

            manager =
                updatedDepartment?.manager ||
                ""
        }

        res.status(200).json({
            ...updatedEmployee.toObject(),
            manager,
        })
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

// =====================================================
// UPDATE ACCOUNT EMAIL / PASSWORD
// =====================================================

const updateAccountCredentials = async (
    req,
    res
) => {
    try {
        const userId = req.user.userId

        const {
            currentPassword,
            newEmail,
            newPassword,
        } = req.body

        if (!currentPassword) {
            return res.status(400).json({
                message:
                    "Current password is required.",
            })
        }

        if (!newEmail && !newPassword) {
            return res.status(400).json({
                message:
                    "Provide a new email or a new password.",
            })
        }

        const user =
            await User.findById(userId)

        if (!user) {
            return res.status(404).json({
                message: "User not found.",
            })
        }

        // ==========================================
        // VERIFY CURRENT PASSWORD
        // ==========================================

        const passwordCorrect =
            await bcrypt.compare(
                currentPassword,
                user.password
            )

        if (!passwordCorrect) {
            return res.status(401).json({
                message:
                    "Current password is incorrect.",
            })
        }

        // ==========================================
        // UPDATE EMAIL
        // ==========================================

        if (newEmail) {
            const cleanEmail =
                newEmail.trim().toLowerCase()

            if (!cleanEmail) {
                return res.status(400).json({
                    message:
                        "New email cannot be empty.",
                })
            }

            const existingUser =
                await User.findOne({
                    email: cleanEmail,
                    _id: {
                        $ne: userId,
                    },
                })

            if (existingUser) {
                return res.status(409).json({
                    message:
                        "An account with this email already exists.",
                })
            }

            const existingEmployee =
                await Employee.findOne({
                    email: cleanEmail,
                    userId: {
                        $ne: userId,
                    },
                })

            if (existingEmployee) {
                return res.status(409).json({
                    message:
                        "An employee with this email already exists.",
                })
            }

            user.email = cleanEmail

            await Employee.findOneAndUpdate(
                {
                    userId,
                },
                {
                    email: cleanEmail,
                }
            )
        }

        // ==========================================
        // UPDATE PASSWORD
        // ==========================================

        if (newPassword) {
            if (newPassword.length < 6) {
                return res.status(400).json({
                    message:
                        "New password must be at least 6 characters.",
                })
            }

            user.password = newPassword
        }

        await user.save()

        res.status(200).json({
            message:
                "Account credentials updated successfully.",
        })
    } catch (error) {
        console.error(
            "Update account credentials error:",
            error
        )

        res.status(500).json({
            message:
                "Failed to update account credentials.",
            error: error.message,
        })
    }
}

module.exports = {
    getProfile,
    updateProfile,
    updateAccountCredentials,
}