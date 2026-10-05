const Employee = require("../models/Employee")
const User = require("../models/User")
const Department = require("../models/Department")

// Get all employees
const getEmployees = async (req, res) => {
    try {
        const employees =
            await Employee.find().populate(
                "userId",
                "name email role"
            )

        const employeesWithManager =
            await Promise.all(
                employees.map(async (employee) => {
                    const employeeObject =
                        employee.toObject()

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

                    return {
                        ...employeeObject,
                        manager,
                    }
                })
            )

        res.status(200).json(
            employeesWithManager
        )
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

        // Check department
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

        // Find the User account using employee email
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
                firstName: cleanFirstName,
                lastName: cleanLastName,
                email: cleanEmail,

                phone:
                    typeof phone === "string"
                        ? phone.trim()
                        : "",

                position:
                    typeof position === "string" &&
                    position.trim()
                        ? position.trim()
                        : "Employee",

                departmentId:
                    department?.id,

                salary:
                    salary !== undefined &&
                    salary !== ""
                        ? Number(salary)
                        : 0,

                hireDate:
                    typeof hireDate === "string"
                        ? hireDate
                        : "",

                status:
                    status === "Inactive"
                        ? "Inactive"
                        : "Active",

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

        const employeeObject =
            populatedEmployee.toObject()

        res.status(201).json({
            ...employeeObject,
            manager:
                department?.manager || "",
        })
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

        // Normalize text fields safely
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

        // Validate required fields
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

        // Check duplicate employee email
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

        // Check department
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

        // Find User account using employee email
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

        // Prepare salary safely
        const cleanSalary =
            salary !== undefined &&
            salary !== ""
                ? Number(salary)
                : 0

        if (Number.isNaN(cleanSalary)) {
            return res.status(400).json({
                message:
                    "Salary must be a valid number.",
            })
        }

        // Update employee
        const updatedEmployee =
            await Employee.findByIdAndUpdate(
                req.params.id,
                {
                    firstName:
                        cleanFirstName,

                    lastName:
                        cleanLastName,

                    email:
                        cleanEmail,

                    phone:
                        typeof phone === "string"
                            ? phone.trim()
                            : "",

                    position:
                        typeof position ===
                            "string" &&
                        position.trim()
                            ? position.trim()
                            : "Employee",

                    departmentId:
                        department?.id,

                    salary:
                        cleanSalary,

                    hireDate:
                        typeof hireDate ===
                        "string"
                            ? hireDate
                            : "",

                    status:
                        status === "Inactive"
                            ? "Inactive"
                            : "Active",

                    userId:
                        linkedUserId,
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

        const employeeObject =
            updatedEmployee.toObject()

        res.status(200).json({
            ...employeeObject,
            manager:
                department?.manager || "",
        })
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

        res.status(200).json({
            message:
                "Employee deleted successfully.",
            employee:
                deletedEmployee,
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