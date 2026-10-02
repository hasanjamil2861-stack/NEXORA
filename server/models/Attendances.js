const mongoose = require("mongoose")

const attendanceSchema =
  new mongoose.Schema(
    {
      employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
        required: true,
      },

      employeeName: {
        type: String,
        required: true,
      },

      date: {
        type: String,
        required: true,
      },

      checkIn: {
        type: String,
        required: true,
      },

      checkOut: {
        type: String,
        required: true,
      },

      status: {
        type: String,
        enum: [
          "Present",
          "Absent",
          "Late",
        ],
        required: true,
      },
    },
    {
      timestamps: true,
    }
  )

const Attendance =
  mongoose.model(
    "Attendance",
    attendanceSchema
  )

module.exports = Attendance