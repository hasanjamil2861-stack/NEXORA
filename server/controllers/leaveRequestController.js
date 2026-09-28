const LeaveRequest = require("../models/LeaveRequest")

// Get all leave requests
const getLeaveRequests = async (req, res) => {
  try {
    const leaveRequests = await LeaveRequest.find()

    res.json(leaveRequests)
  } catch (error) {
    console.error("Get leave requests error:", error)

    res.status(500).json({
      message: "Failed to get leave requests",
      error: error.message,
    })
  }
}

// Create a leave request
const postLeaveRequest = async (req, res) => {
  try {
    const newLeaveRequest = new LeaveRequest(req.body)

    await newLeaveRequest.save()

    res.status(201).json(newLeaveRequest)
  } catch (error) {
    console.error("Save leave request error:", error)

    res.status(500).json({
      message: "Failed to save leave request",
      error: error.message,
    })
  }
}

// Update a leave request
const updateLeaveRequest = async (req, res) => {
  try {
    const updatedLeaveRequest =
      await LeaveRequest.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      )

    res.json(updatedLeaveRequest)
  } catch (error) {
    console.error("Update leave request error:", error)

    res.status(500).json({
      message: "Failed to update leave request",
      error: error.message,
    })
  }
}

// Delete a leave request
const deleteLeaveRequest = async (req, res) => {
  try {
    const deletedLeaveRequest =
      await LeaveRequest.findByIdAndDelete(
        req.params.id
      )

    res.json(deletedLeaveRequest)
  } catch (error) {
    console.error("Delete leave request error:", error)

    res.status(500).json({
      message: "Failed to delete leave request",
      error: error.message,
    })
  }
}

module.exports = {
  getLeaveRequests,
  postLeaveRequest,
  updateLeaveRequest,
  deleteLeaveRequest,
}