const mongoose = require("mongoose")

const departmentSchema = new mongoose.Schema({
  name: String,
  description: String,
  manager: String,
  employeeCount: Number,
  status: {
    type: String,
    enum: ["Active", "Inactive"],
  },
})

const Department = mongoose.model(
  "Department",
  departmentSchema
)

module.exports = Department