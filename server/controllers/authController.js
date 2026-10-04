const User = require("../models/User")
const Employee = require("../models/Employee")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

// Register a new Employee
const registerUser = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
        } = req.body

        const normalizedEmail =
            email.trim().toLowerCase()

        const existingUser =
            await User.findOne({
                email: normalizedEmail,
            })

        if (existingUser) {
            return res.status(409).json({
                message:
                    "An account with this email already exists.",
            })
        }

        const newUser = new User({
            name: name.trim(),
            email: normalizedEmail,
            password,
            role: "Employee",
        })

        await newUser.save()

        const nameParts = name
            .trim()
            .split(/\s+/)

        const firstName =
            nameParts[0] || ""

        const lastName =
            nameParts.slice(1).join(" ") || ""

        await Employee.create({
            userId: newUser._id,
            firstName,
            lastName,
            email: normalizedEmail,
            phone: "",
            position: "Employee",
            salary: 0,
            hireDate: "",
            status: "Active",
        })

        res.status(201).json({
            message:
                "User registered successfully",

            user: {
                id: String(newUser._id),
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
            },
        })
    } catch (error) {
        console.error(
            "Register error:",
            error
        )

        res.status(500).json({
            message: "Failed to register user",
            error: error.message,
        })
    }
}

// Login user
const loginUser = async (req, res) => {
    try {
        const {
            email,
            password,
        } = req.body

        const user = await User.findOne({
            email: email.trim().toLowerCase(),
        })

        if (!user) {
            return res.status(401).json({
                message:
                    "Invalid email or password",
            })
        }

        const isPasswordCorrect =
            await bcrypt.compare(
                password,
                user.password
            )

        if (!isPasswordCorrect) {
            return res.status(401).json({
                message:
                    "Invalid email or password",
            })
        }

        const token = jwt.sign(
            {
                userId: String(user._id),
                email: user.email,
                role: user.role,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d",
            }
        )

        res.status(200).json({
            message: "Login successful",

            token,

            user: {
                id: String(user._id),
                name: user.name,
                email: user.email,
                role: user.role,
            },
        })
    } catch (error) {
        console.error(
            "Login error:",
            error
        )

        res.status(500).json({
            message: "Failed to login",
            error: error.message,
        })
    }
}

module.exports = {
    registerUser,
    loginUser,
}