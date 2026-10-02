const Project = require("../models/Project")
const Employee = require("../models/Employee")

// Get projects
const getProjects = async (req, res) => {
  try {
    console.log("================================")
    console.log("GET PROJECTS REQUEST")
    console.log("USER:", req.user)
    console.log("ROLE:", req.user?.role)
    console.log("EMAIL:", req.user?.email)
    console.log("USER ID:", req.user?.userId)
    console.log("================================")

    // Admin can see all projects
    if (req.user.role === "Admin") {
      const projects =
        await Project.find().populate(
          "assignedEmployees",
          "firstName lastName email position"
        )

      console.log(
        "ADMIN PROJECTS:",
        projects
      )

      return res.json(projects)
    }

    /*
     * Find the Employee profile that belongs
     * to the currently logged-in User.
     *
     * First try userId.
     *
     * If an older Employee does not have userId,
     * fallback to email.
     */
    let employee = null

    if (req.user.userId) {
      employee =
        await Employee.findOne({
          userId: req.user.userId,
        })

      console.log(
        "EMPLOYEE FOUND BY USER ID:",
        employee
      )
    }

    if (!employee && req.user.email) {
      employee =
        await Employee.findOne({
          email:
            req.user.email
              .trim()
              .toLowerCase(),
        })

      console.log(
        "EMPLOYEE FOUND BY EMAIL:",
        employee
      )
    }

    console.log(
      "FINAL EMPLOYEE:",
      employee
    )

    console.log(
      "EMPLOYEE ID:",
      employee?._id
    )

    if (!employee) {
      return res.status(404).json({
        message:
          "Employee profile not found for this account.",
      })
    }

    /*
     * Employee can only see projects where
     * their Employee _id exists in assignedEmployees.
     */
    const projects =
      await Project.find({
        assignedEmployees: employee._id,
      }).populate(
        "assignedEmployees",
        "firstName lastName email position"
      )

    console.log(
      "EMPLOYEE PROJECTS:",
      projects
    )

    console.log(
      "EMPLOYEE PROJECT COUNT:",
      projects.length
    )

    return res.json(projects)
  } catch (error) {
    console.error(
      "Get projects error:",
      error
    )

    res.status(500).json({
      message:
        "Failed to get projects",
      error: error.message,
    })
  }
}

// Create project - Admin only
const postProject = async (req, res) => {
  try {
    console.log("================================")
    console.log("CREATE PROJECT REQUEST")
    console.log("BODY:", req.body)
    console.log(
      "ASSIGNED EMPLOYEES:",
      req.body.assignedEmployees
    )
    console.log(
      "IS ARRAY:",
      Array.isArray(
        req.body.assignedEmployees
      )
    )
    console.log("================================")

    const {
      name,
      description,
      client,
      manager,
      startDate,
      endDate,
      budget,
      status,
      assignedEmployees,
    } = req.body

    if (
      !name ||
      !description ||
      !client ||
      !manager ||
      !startDate ||
      !endDate ||
      budget === undefined
    ) {
      return res.status(400).json({
        message:
          "Please provide all required project fields.",
      })
    }

    if (!Array.isArray(assignedEmployees)) {
      return res.status(400).json({
        message:
          "assignedEmployees must be an array.",
      })
    }

    if (assignedEmployees.length === 0) {
      return res.status(400).json({
        message:
          "At least one employee must be assigned.",
      })
    }

    const employees =
      await Employee.find({
        _id: {
          $in: assignedEmployees,
        },
      })

    console.log(
      "FOUND EMPLOYEES:",
      employees.map(
        (employee) => employee._id
      )
    )

    if (
      employees.length !==
      assignedEmployees.length
    ) {
      return res.status(400).json({
        message:
          "One or more assigned employees were not found.",
      })
    }

    const newProject =
      new Project({
        name,
        description,
        client,
        manager,
        startDate,
        endDate,
        budget,
        status,
        assignedEmployees,
      })

    console.log(
      "PROJECT BEFORE SAVE:",
      newProject
    )

    await newProject.save()

    console.log(
      "PROJECT AFTER SAVE:",
      newProject
    )

    const populatedProject =
      await Project.findById(
        newProject._id
      ).populate(
        "assignedEmployees",
        "firstName lastName email position"
      )

    console.log(
      "PROJECT FROM DATABASE:",
      populatedProject
    )

    res.status(201).json(
      populatedProject
    )
  } catch (error) {
    console.error(
      "Save project error:",
      error
    )

    res.status(500).json({
      message:
        "Failed to save project",
      error: error.message,
    })
  }
}

// Update project - Admin only
const updateProject = async (
  req,
  res
) => {
  try {
    const {
      name,
      description,
      client,
      manager,
      startDate,
      endDate,
      budget,
      status,
      assignedEmployees,
    } = req.body

    if (
      assignedEmployees !== undefined &&
      !Array.isArray(assignedEmployees)
    ) {
      return res.status(400).json({
        message:
          "assignedEmployees must be an array.",
      })
    }

    if (
      Array.isArray(assignedEmployees)
    ) {
      if (assignedEmployees.length === 0) {
        return res.status(400).json({
          message:
            "At least one employee must be assigned.",
        })
      }

      const employees =
        await Employee.find({
          _id: {
            $in: assignedEmployees,
          },
        })

      if (
        employees.length !==
        assignedEmployees.length
      ) {
        return res.status(400).json({
          message:
            "One or more assigned employees were not found.",
        })
      }
    }

    const updatedProject =
      await Project.findByIdAndUpdate(
        req.params.id,
        {
          name,
          description,
          client,
          manager,
          startDate,
          endDate,
          budget,
          status,
          assignedEmployees,
        },
        {
          new: true,
          runValidators: true,
        }
      ).populate(
        "assignedEmployees",
        "firstName lastName email position"
      )

    if (!updatedProject) {
      return res.status(404).json({
        message:
          "Project not found.",
      })
    }

    console.log(
      "UPDATED PROJECT:",
      updatedProject
    )

    res.json(updatedProject)
  } catch (error) {
    console.error(
      "Update project error:",
      error
    )

    res.status(500).json({
      message:
        "Failed to update project",
      error: error.message,
    })
  }
}

// Delete project - Admin only
const deleteProject = async (
  req,
  res
) => {
  try {
    const deletedProject =
      await Project.findByIdAndDelete(
        req.params.id
      )

    if (!deletedProject) {
      return res.status(404).json({
        message:
          "Project not found.",
      })
    }

    res.json({
      message:
        "Project deleted successfully.",
      project: deletedProject,
    })
  } catch (error) {
    console.error(
      "Delete project error:",
      error
    )

    res.status(500).json({
      message:
        "Failed to delete project",
      error: error.message,
    })
  }
}

module.exports = {
  getProjects,
  postProject,
  updateProject,
  deleteProject,
}