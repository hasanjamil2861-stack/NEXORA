const mongoose = require("mongoose")

const leaveRequestSchema = new mongoose.Schema({
  employeeName: String,

  leaveType: {
    type: String,
    enum: ["Annual", "Sick", "Personal"],
  },

  startDate: String,
  endDate: String,
  reason: String,

  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
  },
})

const LeaveRequest = mongoose.model(
  "LeaveRequest",
  leaveRequestSchema
)

module.exports = LeaveRequest