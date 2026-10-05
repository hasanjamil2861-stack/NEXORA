const Document =
  require("../models/Document")

const Employee =
  require("../models/Employee")

const Project =
  require("../models/Project")

const Task =
  require("../models/Task")

const getDocumentType = (
  mimeType
) => {
  if (
    mimeType ===
    "application/pdf"
  ) {
    return "PDF"
  }

  if (
    mimeType ===
      "application/msword" ||
    mimeType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    return "Word"
  }

  if (
    mimeType ===
      "application/vnd.ms-excel" ||
    mimeType ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  ) {
    return "Excel"
  }

  if (
    mimeType.startsWith(
      "image/"
    )
  ) {
    return "Image"
  }

  return null
}

const uploadDocument =
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          message:
            "Please select a file.",
        })
      }

      const {
        name,
        category,
        employeeId,
        projectId,
        taskId,
      } = req.body

      if (!name?.trim()) {
        return res.status(400).json({
          message:
            "Document name is required.",
        })
      }

      if (!category) {
        return res.status(400).json({
          message:
            "Document category is required.",
        })
      }

      const documentType =
        getDocumentType(
          req.file.mimetype
        )

      if (!documentType) {
        return res.status(400).json({
          message:
            "Unsupported file type.",
        })
      }

      let finalEmployeeId = null

      // Employee uploads
      if (
        req.user.role ===
        "Employee"
      ) {
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

        if (taskId) {
          const task =
            await Task.findById(
              taskId
            )

          if (!task) {
            return res.status(404).json({
              message:
                "Task not found.",
            })
          }

          if (
            task.assignedTo.toString() !==
            employee._id.toString()
          ) {
            return res.status(403).json({
              message:
                "You can only upload documents for your assigned tasks.",
            })
          }
        }

        if (projectId) {
          const project =
            await Project.findById(
              projectId
            )

          if (!project) {
            return res.status(404).json({
              message:
                "Project not found.",
            })
          }

          const isAssigned =
            project.assignedEmployees.some(
              (id) =>
                id.toString() ===
                employee._id.toString()
            )

          if (!isAssigned) {
            return res.status(403).json({
              message:
                "You can only upload documents for your assigned projects.",
            })
          }
        }
      }

      // Admin uploads
      if (
        req.user.role ===
        "Admin"
      ) {
        if (employeeId) {
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

          finalEmployeeId =
            employee._id
        }

        if (taskId) {
          const task =
            await Task.findById(
              taskId
            )

          if (!task) {
            return res.status(404).json({
              message:
                "Task not found.",
            })
          }
        }

        if (projectId) {
          const project =
            await Project.findById(
              projectId
            )

          if (!project) {
            return res.status(404).json({
              message:
                "Project not found.",
            })
          }
        }
      }

      const newDocument =
        new Document({
          name:
            name.trim(),

          type:
            documentType,

          category,

          employeeId:
            finalEmployeeId,

          projectId:
            projectId || null,

          taskId:
            taskId || null,

          uploadedBy:
            req.user.userId,

          fileUrl: "",

          fileData:
            req.file.buffer,

          fileContentType:
            req.file.mimetype,

          originalFileName:
            req.file.originalname,

          uploadDate:
            new Date().toISOString(),

          status:
            "Active",
        })

      newDocument.fileUrl =
        `/documents/file/${newDocument._id}`

      await newDocument.save()

      const populatedDocument =
        await Document.findById(
          newDocument._id
        )
          .select(
            "-fileData"
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

      return res.status(201).json(
        populatedDocument
      )
    } catch (error) {
      console.error(
        "Upload document error:",
        error
      )

      return res.status(500).json({
        message:
          error.message ||
          "Failed to upload document.",
      })
    }
  }

const getDocumentFile =
  async (req, res) => {
    try {
      const document =
        await Document.findById(
          req.params.id
        ).select(
          "fileData fileContentType originalFileName employeeId projectId taskId"
        )

      if (
        !document ||
        !document.fileData
      ) {
        return res.status(404).json({
          message:
            "File not found.",
        })
      }

      // Employees can only view
      // documents they have access to
      if (
        req.user.role ===
        "Employee"
      ) {
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

        let hasAccess = false

        if (
          document.employeeId &&
          document.employeeId.toString() ===
            employee._id.toString()
        ) {
          hasAccess = true
        }

        if (
          document.taskId
        ) {
          const task =
            await Task.findById(
              document.taskId
            )

          if (
            task &&
            task.assignedTo.toString() ===
              employee._id.toString()
          ) {
            hasAccess = true
          }
        }

        if (
          document.projectId
        ) {
          const project =
            await Project.findById(
              document.projectId
            )

          if (
            project &&
            project.assignedEmployees.some(
              (id) =>
                id.toString() ===
                employee._id.toString()
            )
          ) {
            hasAccess = true
          }
        }

        if (!hasAccess) {
          return res.status(403).json({
            message:
              "You do not have permission to view this document.",
          })
        }
      }

      res.set(
        "Content-Type",
        document.fileContentType
      )

      res.set(
        "Content-Disposition",
        `inline; filename="${document.originalFileName}"`
      )

      return res.send(
        document.fileData
      )
    } catch (error) {
      console.error(
        "Get document file error:",
        error
      )

      return res.status(500).json({
        message:
          "Failed to retrieve document file.",
      })
    }
  }

module.exports = {
  uploadDocument,
  getDocumentFile,
}