/* Attendance schema */

const mongoose = require("mongoose")

const attendanceSchema = new mongoose.Schema({
  employeeName: String,
  date: String,
  checkIn: String,
  checkOut: String,

  status: {
    type: String,
    enum: ["Present", "Absent", "Late"],
  },
})

const Attendance = mongoose.model(
  "Attendance",
  attendanceSchema
)

module.exports = Attendance