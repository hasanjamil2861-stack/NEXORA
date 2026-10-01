const LeaveRequest = require("../models/LeaveRequest")
const Employee = require("../models/Employee")

// Get leave requests
const getLeaveRequests = async (
  req,
  res
) => {
  try {
    // Admin can see all leave requests
    if (req.user.role === "Admin") {
      const leaveRequests =
        await LeaveRequest.find()
          .populate(
            "employeeId",
            "firstName lastName email position"
          )
          .sort({ createdAt: -1 })

      return res.json(
        leaveRequests
      )
    }

    // Employee can see only their own requests
    const employee =
      await Employee.findOne({
        email: req.user.email,
      })

    if (!employee) {
      return res.status(404).json({
        message:
          "Employee profile not found.",
      })
    }

    const leaveRequests =
      await LeaveRequest.find({
        employeeId: employee._id,
      })
        .populate(
          "employeeId",
          "firstName lastName email position"
        )
        .sort({ createdAt: -1 })

    res.json(leaveRequests)
  } catch (error) {
    console.error(
      "Get leave requests error:",
      error
    )

    res.status(500).json({
      message:
        "Failed to get leave requests.",
      error: error.message,
    })
  }
}

// Create a leave request
const postLeaveRequest = async (
  req,
  res
) => {
  try {
    const {
      leaveType,
      startDate,
      endDate,
      reason,
    } = req.body

    if (
      !leaveType ||
      !startDate ||
      !endDate ||
      !reason?.trim()
    ) {
      return res.status(400).json({
        message:
          "Leave type, start date, end date, and reason are required.",
      })
    }

    if (
      new Date(endDate).getTime() <
      new Date(startDate).getTime()
    ) {
      return res.status(400).json({
        message:
          "End date cannot be before start date.",
      })
    }

    // Employee creates a request
    if (
      req.user.role === "Employee"
    ) {
      const employee =
        await Employee.findOne({
          email: req.user.email,
        })

      if (!employee) {
        return res.status(404).json({
          message:
            "Employee profile not found.",
        })
      }

      const newLeaveRequest =
        new LeaveRequest({
          employeeId:
            employee._id,
          leaveType,
          startDate,
          endDate,
          reason:
            reason.trim(),
          status: "Pending",
        })

      await newLeaveRequest.save()

      const populatedLeaveRequest =
        await newLeaveRequest.populate(
          "employeeId",
          "firstName lastName email position"
        )

      return res.status(201).json(
        populatedLeaveRequest
      )
    }

    // Admin creation is not required
    return res.status(403).json({
      message:
        "Admins review leave requests instead of creating employee requests.",
    })
  } catch (error) {
    console.error(
      "Save leave request error:",
      error
    )

    res.status(500).json({
      message:
        "Failed to save leave request.",
      error: error.message,
    })
  }
}

// Update leave request
// Admin only
const updateLeaveRequest = async (
  req,
  res
) => {
  try {
    if (
      req.user.role !== "Admin"
    ) {
      return res.status(403).json({
        message:
          "Only Admin can update leave requests.",
      })
    }

    const { status } = req.body

    if (
      ![
        "Pending",
        "Approved",
        "Rejected",
      ].includes(status)
    ) {
      return res.status(400).json({
        message:
          "Invalid leave request status.",
      })
    }

    const updatedLeaveRequest =
      await LeaveRequest.findByIdAndUpdate(
        req.params.id,
        {
          status,
        },
        {
          new: true,
          runValidators: true,
        }
      ).populate(
        "employeeId",
        "firstName lastName email position"
      )

    if (!updatedLeaveRequest) {
      return res.status(404).json({
        message:
          "Leave request not found.",
      })
    }

    res.json(
      updatedLeaveRequest
    )
  } catch (error) {
    console.error(
      "Update leave request error:",
      error
    )

    res.status(500).json({
      message:
        "Failed to update leave request.",
      error: error.message,
    })
  }
}

// Delete leave request
// Admin only
const deleteLeaveRequest = async (
  req,
  res
) => {
  try {
    if (
      req.user.role !== "Admin"
    ) {
      return res.status(403).json({
        message:
          "Only Admin can delete leave requests.",
      })
    }

    const deletedLeaveRequest =
      await LeaveRequest.findByIdAndDelete(
        req.params.id
      )

    if (!deletedLeaveRequest) {
      return res.status(404).json({
        message:
          "Leave request not found.",
      })
    }

    res.json({
      message:
        "Leave request deleted successfully.",
      leaveRequest:
        deletedLeaveRequest,
    })
  } catch (error) {
    console.error(
      "Delete leave request error:",
      error
    )

    res.status(500).json({
      message:
        "Failed to delete leave request.",
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