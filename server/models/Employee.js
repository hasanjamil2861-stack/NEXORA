/* Employee schema */

const mongoose = require("mongoose")

const employeeSchema = new mongoose.Schema({
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