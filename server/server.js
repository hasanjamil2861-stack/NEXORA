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
const profileRoutes = require("./routes/profileRoutes")

const ensureAdmin = require("./utils/ensureAdmin")

const app = express()

const PORT =
    process.env.PORT || 5000

const MONGO_URI =
    process.env.MONGO_URI ||
    "mongodb://localhost:27017/Projectnode"

app.use(cors())

app.use(
    express.json({
        limit: "10mb",
    })
)

mongoose
    .connect(MONGO_URI)
    .then(async () => {
        console.log("MongoDB connected")

        await ensureAdmin()
    })
    .catch((error) => {
        console.error(
            "MongoDB connection error:",
            error
        )
    })

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
app.use(profileRoutes)

app.use("/auth", authRoutes)

app.get("/", (req, res) => {
    res.send("Server is running!")
})

app.get("/test-invoice", (req, res) => {
    res.json({
        message: "Invoice test route works",
    })
})

app.listen(PORT, () => {
    console.log(
        `Server is running on http://localhost:${PORT}`
    )
})