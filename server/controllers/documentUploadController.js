const Document =
  require("../models/Document")

const Employee =
  require("../models/Employee")

const Project =
  require("../models/Project")

const Task =
  require("../models/Task")

const cloudinary =
  require("../config/cloudinary")

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
    mimeType.startsWith("image/")
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

      let employee = null

      if (
        req.user.role ===
        "Employee"
      ) {
        employee =
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

      const uploadResult =
        await new Promise(
          (
            resolve,
            reject
          ) => {
            const stream =
              cloudinary.uploader.upload_stream(
                {
                  folder:
                    "nexora/documents",
                  resource_type:
                    "auto",
                  public_id:
                    `${Date.now()}-${req.file.originalname
                      .replace(
                        /\.[^/.]+$/,
                        ""
                      )
                      .replace(
                        /[^a-zA-Z0-9-_]/g,
                        "-"
                      )}`,
                },
                (
                  error,
                  result
                ) => {
                  if (error) {
                    reject(error)
                  } else {
                    resolve(result)
                  }
                }
              )

            stream.end(
              req.file.buffer
            )
          }
        )

      const newDocument =
        new Document({
          name: name.trim(),

          type: documentType,

          category,

          employeeId:
            req.user.role ===
            "Employee"
              ? employee._id
              : null,

          projectId:
            projectId || null,

          taskId:
            taskId || null,

          uploadedBy:
            req.user.userId,

          fileUrl:
            uploadResult.secure_url,

          uploadDate:
            new Date().toISOString(),

          status: "Active",
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

module.exports = {
  uploadDocument,
}