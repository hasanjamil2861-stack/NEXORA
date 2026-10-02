const Attendance =
  require("../models/Attendances")

const Employee =
  require("../models/Employee")

const getAttendance = async (
  req,
  res
) => {
  try {
    if (req.user.role === "Admin") {
      const attendance =
        await Attendance.find()
          .populate(
            "employeeId",
            "firstName lastName email position"
          )

      return res.json(attendance)
    }

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

    const attendance =
      await Attendance.find({
        employeeId:
          employee._id,
      }).populate(
        "employeeId",
        "firstName lastName email position"
      )

    return res.json(attendance)
  } catch (error) {
    console.error(
      "Get attendance error:",
      error
    )

    res.status(500).json({
      message:
        "Failed to get attendance",
      error: error.message,
    })
  }
}

const postAttendance = async (
  req,
  res
) => {
  try {
    const {
      employeeId,
      employeeName,
      date,
      checkIn,
      checkOut,
      status,
    } = req.body

    const employee =
      await Employee.findById(
        employeeId
      )

    if (!employee) {
      return res.status(404).json({
        message:
          "Employee not found.",
      })
    }

    const newAttendance =
      new Attendance({
        employeeId,
        employeeName:
          employeeName ||
          `${employee.firstName} ${employee.lastName}`,
        date,
        checkIn,
        checkOut,
        status,
      })

    await newAttendance.save()

    res.status(201).json(
      newAttendance
    )
  } catch (error) {
    console.error(
      "Save attendance error:",
      error
    )

    res.status(500).json({
      message:
        "Failed to save attendance",
      error: error.message,
    })
  }
}

const updateAttendance = async (
  req,
  res
) => {
  try {
    const updatedAttendance =
      await Attendance.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      )

    if (!updatedAttendance) {
      return res.status(404).json({
        message:
          "Attendance record not found.",
      })
    }

    res.json(updatedAttendance)
  } catch (error) {
    console.error(
      "Update attendance error:",
      error
    )

    res.status(500).json({
      message:
        "Failed to update attendance",
      error: error.message,
    })
  }
}

const deleteAttendance = async (
  req,
  res
) => {
  try {
    const deletedAttendance =
      await Attendance.findByIdAndDelete(
        req.params.id
      )

    if (!deletedAttendance) {
      return res.status(404).json({
        message:
          "Attendance record not found.",
      })
    }

    res.json(deletedAttendance)
  } catch (error) {
    console.error(
      "Delete attendance error:",
      error
    )

    res.status(500).json({
      message:
        "Failed to delete attendance",
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