const Document =
  require("../models/Document")

const Employee =
  require("../models/Employee")

const getDocuments = async (
  req,
  res
) => {
  try {
    if (req.user.role === "Admin") {
      const documents =
        await Document.find()
          .populate(
            "employeeId",
            "firstName lastName email position"
          )
          .populate(
            "projectId",
            "name status"
          )
          .populate(
            "taskId",
            "title status"
          )
          .populate(
            "uploadedBy",
            "name email role"
          )

      return res.json(documents)
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

    const documents =
      await Document.find({
        employeeId:
          employee._id,
      })
        .populate(
          "employeeId",
          "firstName lastName email position"
        )
        .populate(
          "projectId",
          "name status"
        )
        .populate(
          "taskId",
          "title status"
        )
        .populate(
          "uploadedBy",
          "name email role"
        )

    return res.json(documents)
  } catch (error) {
    console.error(
      "Get documents error:",
      error
    )

    res.status(500).json({
      message:
        "Failed to get documents",
      error: error.message,
    })
  }
}

const postDocument = async (
  req,
  res
) => {
  try {
    const {
      name,
      type,
      category,
      employeeId,
      projectId,
      taskId,
      fileUrl,
      uploadDate,
      status,
    } = req.body

    if (!name || !type || !category) {
      return res.status(400).json({
        message:
          "Name, type and category are required.",
      })
    }

    if (!fileUrl) {
      return res.status(400).json({
        message:
          "File URL is required.",
      })
    }

    let finalEmployeeId =
      employeeId || null

    /*
      Employee uploads:
      automatically use their own employee profile.
    */
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

      finalEmployeeId =
        employee._id
    }

    /*
      Admin can upload for
      any employee or leave it null.
    */
    if (
      finalEmployeeId
    ) {
      const employee =
        await Employee.findById(
          finalEmployeeId
        )

      if (!employee) {
        return res.status(404).json({
          message:
            "Employee not found.",
        })
      }
    }

    const newDocument =
      new Document({
        name,
        type,
        category,
        employeeId:
          finalEmployeeId,
        projectId:
          projectId || null,
        taskId:
          taskId || null,
        uploadedBy:
          req.user.userId,
        fileUrl,
        uploadDate:
          uploadDate ||
          new Date().toISOString(),
        status:
          status || "Active",
      })

    await newDocument.save()

    const populatedDocument =
      await Document.findById(
        newDocument._id
      )
        .populate(
          "employeeId",
          "firstName lastName email position"
        )
        .populate(
          "projectId",
          "name status"
        )
        .populate(
          "taskId",
          "title status"
        )
        .populate(
          "uploadedBy",
          "name email role"
        )

    res.status(201).json(
      populatedDocument
    )
  } catch (error) {
    console.error(
      "Save document error:",
      error
    )

    res.status(500).json({
      message:
        "Failed to save document",
      error: error.message,
    })
  }
}

const updateDocument = async (
  req,
  res
) => {
  try {
    const updatedDocument =
      await Document.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      )
        .populate(
          "employeeId",
          "firstName lastName email position"
        )
        .populate(
          "projectId",
          "name status"
        )
        .populate(
          "taskId",
          "title status"
        )
        .populate(
          "uploadedBy",
          "name email role"
        )

    if (!updatedDocument) {
      return res.status(404).json({
        message:
          "Document not found.",
      })
    }

    res.json(updatedDocument)
  } catch (error) {
    console.error(
      "Update document error:",
      error
    )

    res.status(500).json({
      message:
        "Failed to update document",
      error: error.message,
    })
  }
}

const deleteDocument = async (
  req,
  res
) => {
  try {
    const deletedDocument =
      await Document.findByIdAndDelete(
        req.params.id
      )

    if (!deletedDocument) {
      return res.status(404).json({
        message:
          "Document not found.",
      })
    }

    res.json({
      message:
        "Document deleted successfully.",
      document:
        deletedDocument,
    })
  } catch (error) {
    console.error(
      "Delete document error:",
      error
    )

    res.status(500).json({
      message:
        "Failed to delete document",
      error: error.message,
    })
  }
}

module.exports = {
  getDocuments,
  postDocument,
  updateDocument,
  deleteDocument,
}