/* Employee schema */

const mongoose = require("mongoose")

const employeeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    unique: true,
    sparse: true,
  },

  firstName: String,

  lastName: String,

  email: String,

  phone: String,

  position: String,

  departmentId: Number,

  salary: Number,

  hireDate: String,

  status: {
    type: String,
    enum: ["Active", "Inactive"],
  },
})

const Employee = mongoose.model(
  "Employee",
  employeeSchema
)

module.exports = Employee