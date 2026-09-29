const User = require("../models/User")
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

    // Check if email already exists
    const existingUser = await User.findOne({
      email,
    })

    if (existingUser) {
      return res.status(409).json({
        message: "An account with this email already exists.",
      })
    }

    // New registered accounts are always Employees
    const newUser = new User({
      name,
      email,
      password,
      role: "Employee",
    })

    await newUser.save()

    // Never return the hashed password
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    })
  } catch (error) {
    console.error("Register error:", error)

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

    const user = await User.findOne({ email })

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      })
    }

    const isPasswordCorrect =
      await bcrypt.compare(
        password,
        user.password
      )

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid email or password",
      })
    }

    // Create JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    )

    // Return authenticated user
    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Login error:", error)

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