const Attendance = require("../models/Attendances")

// Get all attendance records
const getAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find()

    res.json(attendance)
  } catch (error) {
    console.error("Get attendance error:", error)

    res.status(500).json({
      message: "Failed to get attendance",
      error: error.message,
    })
  }
}

// Create an attendance record
const postAttendance = async (req, res) => {
  try {
    const newAttendance = new Attendance(req.body)

    await newAttendance.save()

    res.status(201).json(newAttendance)
  } catch (error) {
    console.error("Save attendance error:", error)

    res.status(500).json({
      message: "Failed to save attendance",
      error: error.message,
    })
  }
}

// Update an attendance record
const updateAttendance = async (req, res) => {
  try {
    const updatedAttendance =
      await Attendance.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      )

    res.json(updatedAttendance)
  } catch (error) {
    console.error("Update attendance error:", error)

    res.status(500).json({
      message: "Failed to update attendance",
      error: error.message,
    })
  }
}

// Delete an attendance record
const deleteAttendance = async (req, res) => {
  try {
    const deletedAttendance =
      await Attendance.findByIdAndDelete(
        req.params.id
      )

    res.json(deletedAttendance)
  } catch (error) {
    console.error("Delete attendance error:", error)

    res.status(500).json({
      message: "Failed to delete attendance",
      error: error.message,
    })
  }
}

module.exports = {
  getAttendance,
  postAttendance,
  updateAttendance,
  deleteAttendance,
}