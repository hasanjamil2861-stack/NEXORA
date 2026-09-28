require("dotenv").config()

const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")

const employeeRoutes = require("./routes/employeeRoutes")
const departmentRoutes = require("./routes/departmentRoutes")
const projectRoutes = require("./routes/projectRoutes")
const taskRoutes = require("./routes/taskRoutes")
const clientRoutes = require("./routes/clientRoutes")
const leaveRequestRoutes = require("./routes/leaveRequestRoutes")
const attendanceRoutes = require("./routes/attendanceRoutes")
const contractRoutes = require("./routes/contractRoutes")
const invoiceRoutes = require("./routes/invoiceRoutes")
const documentRoutes = require("./routes/documentRoutes")
const reportRoutes = require("./routes/reportRoutes")
const authRoutes = require("./routes/authRoutes")

const app = express()

const PORT = process.env.PORT || 5000
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/Projectnode"

// Middleware
app.use(cors())
app.use(express.json())

// MongoDB connection
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected")
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error)
  })

// API routes
app.use(employeeRoutes)
app.use(departmentRoutes)
app.use(projectRoutes)
app.use(taskRoutes)
app.use(clientRoutes)
app.use(leaveRequestRoutes)
app.use(attendanceRoutes)
app.use(contractRoutes)
app.use(invoiceRoutes)
app.use(documentRoutes)
app.use(reportRoutes)
app.use("/auth", authRoutes)

// Health check
app.get("/", (req, res) => {
  res.send("Server is running!")
})

// Test route
app.get("/test-invoice", (req, res) => {
  res.json({
    message: "Invoice test route works",
  })
})

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})