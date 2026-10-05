const Employee = require("../models/Employee")
const User = require("../models/User")
const Department = require("../models/Department")
const bcrypt = require("bcryptjs")

// =====================================================
// GET MY PROFILE
// =====================================================

const getProfile = async (req, res) => {
    try {
        const userId = req.user.userId

        if (!userId) {
            return res.status(401).json({
                message:
                    "User ID is missing from authentication token.",
            })
        }

        const user =
            await User.findById(userId)

        if (!user) {
            return res.status(404).json({
                message: "User account not found.",
            })
        }

        let employee =
            await Employee.findOne({
                userId: user._id,
            })

        // If this account does not have an Employee
        // document yet, create one automatically.
        if (!employee) {
            const nameParts = user.name
                ? user.name.trim().split(/\s+/)
                : []

            const firstName =
                nameParts[0] || ""

            const lastName =
                nameParts
                    .slice(1)
                    .join(" ") || ""

            employee = await Employee.create({
                userId: user._id,

                firstName,

                lastName,

                email:
                    user.email
                        ?.trim()
                        .toLowerCase() || "",

                phone: "",

                position:
                    user.role === "Admin"
                        ? "Administrator"
                        : "Employee",

                salary: 0,

                hireDate: "",

                status: "Active",

                profileImage: "",
            })
        }

        let manager = ""

        if (
            employee.departmentId !==
                undefined &&
            employee.departmentId !== null
        ) {
            const department =
                await Department.findOne({
                    id: employee.departmentId,
                })

            manager =
                department?.manager || ""
        }

        return res.status(200).json({
            ...employee.toObject(),
            manager,
        })
    } catch (error) {
        console.error(
            "Get profile error:",
            error
        )

        return res.status(500).json({
            message:
                "Failed to load profile.",
            error: error.message,
        })
    }
}

// =====================================================
// UPDATE MY PROFILE
// =====================================================

const updateProfile = async (req, res) => {
    try {
        const userId = req.user.userId

        if (!userId) {
            return res.status(401).json({
                message:
                    "User ID is missing from authentication token.",
            })
        }

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
            profileImage,
        } = req.body

        const cleanFirstName =
            typeof firstName === "string"
                ? firstName.trim()
                : ""

        const cleanLastName =
            typeof lastName === "string"
                ? lastName.trim()
                : ""

        const cleanEmail =
            typeof email === "string"
                ? email.trim().toLowerCase()
                : ""

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

        const user =
            await User.findById(userId)

        if (!user) {
            return res.status(404).json({
                message:
                    "User account not found.",
            })
        }

        // Find the employee profile belonging
        // to the currently logged-in user.
        let employee =
            await Employee.findOne({
                userId: user._id,
            })

        // If it does not exist, create it.
        if (!employee) {
            employee = new Employee({
                userId: user._id,
            })
        }

        // =================================================
        // CHECK EMAIL
        // =================================================

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

        // =================================================
        // DEPARTMENT
        // =================================================

        let department = null

        if (
            departmentId !== undefined &&
            departmentId !== null &&
            departmentId !== ""
        ) {
            const numericDepartmentId =
                Number(departmentId)

            if (
                Number.isNaN(
                    numericDepartmentId
                )
            ) {
                return res.status(400).json({
                    message:
                        "Invalid department.",
                })
            }

            department =
                await Department.findOne({
                    id: numericDepartmentId,
                })

            if (!department) {
                return res.status(400).json({
                    message:
                        "Selected department was not found.",
                })
            }
        }

        // =================================================
        // COMMON FIELDS
        // =================================================

        employee.firstName =
            cleanFirstName

        employee.lastName =
            cleanLastName

        employee.email =
            cleanEmail

        employee.phone =
            typeof phone === "string"
                ? phone.trim()
                : ""

        employee.departmentId =
            department?.id

        // =================================================
        // PROFILE IMAGE
        // =================================================

        if (
            typeof profileImage === "string"
        ) {
            employee.profileImage =
                profileImage
        }

        // =================================================
        // ADMIN FIELDS
        // =================================================

        if (req.user.role === "Admin") {
            employee.position =
                typeof position === "string" &&
                position.trim()
                    ? position.trim()
                    : "Administrator"

            if (
                salary !== undefined &&
                salary !== ""
            ) {
                const numericSalary =
                    Number(salary)

                if (
                    Number.isNaN(
                        numericSalary
                    ) ||
                    numericSalary < 0
                ) {
                    return res.status(400).json({
                        message:
                            "Salary must be a valid non-negative number.",
                    })
                }

                employee.salary =
                    numericSalary
            }

            if (
                typeof hireDate ===
                "string"
            ) {
                employee.hireDate =
                    hireDate
            }

            if (
                status === "Active" ||
                status === "Inactive"
            ) {
                employee.status =
                    status
            }
        } else {
            // =================================================
            // EMPLOYEE PROTECTION
            // =================================================

            employee.position = "Employee"

            // Employee cannot modify:
            // salary
            // hireDate
            // status
        }

        // =================================================
        // SAVE EMPLOYEE
        // =================================================

        const updatedEmployee =
            await employee.save()

        // =================================================
        // UPDATE USER ACCOUNT
        // =================================================

        user.email = cleanEmail

        user.name =
            `${cleanFirstName} ${cleanLastName}`.trim()

        await user.save()

        // =================================================
        // GET MANAGER
        // =================================================

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

        return res.status(200).json({
            ...updatedEmployee.toObject(),
            manager,
        })
    } catch (error) {
        console.error(
            "Update profile error:",
            error
        )

        // Mongo duplicate key
        if (error.code === 11000) {
            return res.status(409).json({
                message:
                    "This profile is already linked to another account.",
                error: error.message,
            })
        }

        return res.status(500).json({
            message:
                "Failed to setup profile.",
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
                message:
                    "User not found.",
            })
        }

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

        // =================================================
        // UPDATE EMAIL
        // =================================================

        if (newEmail) {
            const cleanEmail =
                newEmail
                    .trim()
                    .toLowerCase()

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

            user.email =
                cleanEmail

            await Employee.findOneAndUpdate(
                {
                    userId,
                },
                {
                    email: cleanEmail,
                }
            )
        }

        // =================================================
        // UPDATE PASSWORD
        // =================================================

        if (newPassword) {
            if (
                newPassword.length < 6
            ) {
                return res.status(400).json({
                    message:
                        "New password must be at least 6 characters.",
                })
            }

            user.password =
                newPassword
        }

        await user.save()

        return res.status(200).json({
            message:
                "Account credentials updated successfully.",
        })
    } catch (error) {
        console.error(
            "Update account credentials error:",
            error
        )

        return res.status(500).json({
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