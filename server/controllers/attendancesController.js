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
        email:
          req.user.email
            .trim()
            .toLowerCase(),
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

    return res.status(500).json({
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
      date,
      checkIn,
      checkOut,
      status,
    } = req.body

    let finalEmployee = null

    if (req.user.role === "Employee") {
      finalEmployee =
        await Employee.findOne({
          email:
            req.user.email
              .trim()
              .toLowerCase(),
        })

      if (!finalEmployee) {
        return res.status(404).json({
          message:
            "Employee profile not found.",
        })
      }
    } else {
      if (!employeeId) {
        return res.status(400).json({
          message:
            "Employee ID is required.",
        })
      }

      finalEmployee =
        await Employee.findById(
          employeeId
        )

      if (!finalEmployee) {
        return res.status(404).json({
          message:
            "Employee not found.",
        })
      }
    }

    if (!date) {
      return res.status(400).json({
        message:
          "Date is required.",
      })
    }

    if (!status) {
      return res.status(400).json({
        message:
          "Status is required.",
      })
    }

    const newAttendance =
      new Attendance({
        employeeId:
          finalEmployee._id,

        employeeName:
          `${finalEmployee.firstName} ${finalEmployee.lastName}`,

        date,

        checkIn:
          checkIn || "",

        checkOut:
          checkOut || "",

        status,
      })

    await newAttendance.save()

    return res.status(201).json(
      newAttendance
    )
  } catch (error) {
    console.error(
      "Save attendance error:",
      error
    )

    return res.status(500).json({
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
    const attendance =
      await Attendance.findById(
        req.params.id
      )

    if (!attendance) {
      return res.status(404).json({
        message:
          "Attendance record not found.",
      })
    }

    if (req.user.role === "Employee") {
      const employee =
        await Employee.findOne({
          email:
            req.user.email
              .trim()
              .toLowerCase(),
        })

      if (!employee) {
        return res.status(404).json({
          message:
            "Employee profile not found.",
        })
      }

      if (
        attendance.employeeId.toString() !==
        employee._id.toString()
      ) {
        return res.status(403).json({
          message:
            "You can only edit your own attendance records.",
        })
      }
    }

    const {
      date,
      checkIn,
      checkOut,
      status,
    } = req.body

    attendance.date =
      date ?? attendance.date

    attendance.checkIn =
      checkIn ?? attendance.checkIn

    attendance.checkOut =
      checkOut ?? attendance.checkOut

    attendance.status =
      status ?? attendance.status

    await attendance.save()

    return res.json(
      attendance
    )
  } catch (error) {
    console.error(
      "Update attendance error:",
      error
    )

    return res.status(500).json({
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

    return res.json({
      message:
        "Attendance record deleted successfully.",

      attendance:
        deletedAttendance,
    })
  } catch (error) {
    console.error(
      "Delete attendance error:",
      error
    )

    return res.status(500).json({
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