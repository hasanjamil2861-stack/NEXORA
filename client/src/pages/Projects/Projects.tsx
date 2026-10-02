import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react"

import {
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  DollarSign,
  FolderKanban,
  Plus,
  Search,
  TrendingUp,
  UserRound,
} from "lucide-react"

import ProjectCard from "../../components/ProjectCard/ProjectCard"
import Modal from "../../components/Modal/Modal"

import type { Project } from "../../types/Project"

import { useToast } from "../../context/ToastContext"
import { useTrash } from "../../context/TrashContext"
import { useAuth } from "../../context/AuthContext"

import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} from "../../services/api/projectApi"

import { getEmployees } from "../../services/api/employeeApi"

type ProjectAssignedEmployee = {
  _id: string
  firstName?: string
  lastName?: string
  email?: string
  position?: string
}

type ProjectApiRecord = {
  _id: string
  name?: string
  description?: string
  client?: string
  manager?: string
  startDate?: string
  endDate?: string
  budget?: number
  status?: Project["status"]
  assignedEmployees?:
    | ProjectAssignedEmployee
    | ProjectAssignedEmployee[]
}

type EmployeeOption = {
  _id: string
  firstName: string
  lastName: string
  email: string
  position: string
  status?: "Active" | "Inactive"
}

type ProjectSortOption =
  | "None"
  | "Name"
  | "Budget"
  | "Start Date"

const initialForm = {
  name: "",
  description: "",
  client: "",
  manager: "",
  startDate: "",
  endDate: "",
  budget: "",
  status: "Planned" as Project["status"],
}

export default function Projects() {
  const { user } = useAuth()

  const isAdmin =
    user?.role === "Admin"

  const [projectList, setProjectList] =
    useState<Project[]>([])

  const [employeeList, setEmployeeList] =
    useState<EmployeeOption[]>([])

  const [
    selectedEmployees,
    setSelectedEmployees,
  ] = useState<string[]>([])

  const [showForm, setShowForm] =
    useState(false)

  const [name, setName] =
    useState("")

  const [description, setDescription] =
    useState("")

  const [client, setClient] =
    useState("")

  const [manager, setManager] =
    useState("")

  const [startDate, setStartDate] =
    useState("")

  const [endDate, setEndDate] =
    useState("")

  const [budget, setBudget] =
    useState("")

  const [status, setStatus] =
    useState<Project["status"]>("Planned")

  const [editingProject, setEditingProject] =
    useState<string | null>(null)

  const [search, setSearch] =
    useState("")

  const [statusFilter, setStatusFilter] =
    useState<
      "All" | Project["status"]
    >("All")

  const [sortBy, setSortBy] =
    useState<ProjectSortOption>("None")

  const [projectToDelete, setProjectToDelete] =
    useState<string | null>(null)

  const [formError, setFormError] =
    useState("")

  const [newProjectId, setNewProjectId] =
    useState<string | null>(null)

  const projectFormRef =
    useRef<HTMLFormElement | null>(null)

  const { showToast } = useToast()
  const { moveToTrash } = useTrash()

  /*
   * Scroll to the newly created project.
   */
  useEffect(() => {
    if (!newProjectId) {
      return
    }

    const frame = requestAnimationFrame(() => {
      const newProject =
        document.getElementById(
          `project-${newProjectId}`
        )

      if (newProject) {
        newProject.scrollIntoView({
          behavior: "smooth",
          block: "center",
        })
      }

      setNewProjectId(null)
    })

    return () => {
      cancelAnimationFrame(frame)
    }
  }, [newProjectId])

  /*
   * Load projects from MongoDB.
   *
   * Admin:
   * receives all projects.
   *
   * Employee:
   * receives only assigned projects.
   *
   * IMPORTANT:
   * assignedEmployees is preserved inside
   * projectList so Edit can restore the
   * correct employees.
   */
  useEffect(() => {
    async function fetchProjects() {
      try {
        const data =
          (await getProjects()) as ProjectApiRecord[]

        const formattedProjects: Project[] =
          data.map((project) => {
            const assigned =
              Array.isArray(
                project.assignedEmployees
              )
                ? project.assignedEmployees
                : project.assignedEmployees
                  ? [
                      project.assignedEmployees,
                    ]
                  : []

            return {
              id: project._id,

              name:
                project.name ?? "",

              description:
                project.description ?? "",

              client:
                project.client ?? "",

              manager:
                project.manager ?? "",

              startDate:
                project.startDate ?? "",

              endDate:
                project.endDate ?? "",

              budget:
                project.budget ?? 0,

              status:
                project.status ??
                "Planned",

              assignedEmployees:
                assigned.map(
                  (employee) =>
                    employee._id
                ),
            }
          })

        setProjectList(
          formattedProjects
        )
      } catch (error) {
        console.error(
          "Fetch projects error:",
          error
        )

        setProjectList([])

        showToast(
          "Failed to load projects",
          "error"
        )
      }
    }

    if (user?.email) {
      fetchProjects()
    } else {
      setProjectList([])
    }
  }, [
    showToast,
    isAdmin,
    user?.email,
  ])

  /*
   * Load employees for Admin only.
   */
  useEffect(() => {
    if (!isAdmin) {
      setEmployeeList([])
      return
    }

    async function fetchEmployees() {
      try {
        const data =
          (await getEmployees()) as EmployeeOption[]

        setEmployeeList(data)
      } catch (error) {
        console.error(
          "Fetch employees error:",
          error
        )

        showToast(
          "Failed to load employees",
          "error"
        )
      }
    }

    fetchEmployees()
  }, [isAdmin, showToast])

  /*
   * Reset the project form.
   */
  function resetForm() {
    setName(initialForm.name)

    setDescription(
      initialForm.description
    )

    setClient(initialForm.client)

    setManager(initialForm.manager)

    setStartDate(
      initialForm.startDate
    )

    setEndDate(
      initialForm.endDate
    )

    setBudget(initialForm.budget)

    setStatus(initialForm.status)

    setSelectedEmployees([])

    setEditingProject(null)

    setFormError("")

    setShowForm(false)
  }

  function openProjectForm() {
    if (!isAdmin) {
      return
    }

    setShowForm(true)

    setFormError("")

    setSelectedEmployees([])

    requestAnimationFrame(() => {
      projectFormRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    })
  }

  function validateForm() {
    if (!name.trim()) {
      return "Project name is required."
    }

    if (!description.trim()) {
      return "Project description is required."
    }

    if (!client.trim()) {
      return "Client is required."
    }

    if (!manager.trim()) {
      return "Manager is required."
    }

    if (!startDate) {
      return "Start date is required."
    }

    if (!endDate) {
      return "End date is required."
    }

    if (
      new Date(endDate).getTime() <
      new Date(startDate).getTime()
    ) {
      return "End date cannot be before start date."
    }

    if (budget === "") {
      return "Budget is required."
    }

    if (Number(budget) < 0) {
      return "Budget cannot be negative."
    }

    if (!status) {
      return "Project status is required."
    }

    if (
      selectedEmployees.length === 0
    ) {
      return "Please assign at least one employee to this project."
    }

    return ""
  }

  function handleEmployeeToggle(
    employeeId: string
  ) {
    if (!isAdmin) {
      return
    }

    setSelectedEmployees(
      (currentEmployees) => {
        if (
          currentEmployees.includes(
            employeeId
          )
        ) {
          return currentEmployees.filter(
            (id) =>
              id !== employeeId
          )
        }

        return [
          ...currentEmployees,
          employeeId,
        ]
      }
    )

    setFormError("")
  }

  function handleDeleteProject(
    id: string
  ) {
    if (!isAdmin) {
      return
    }

    setProjectToDelete(id)
  }

  /*
   * Delete from MongoDB, then move the project
   * to Trash.
   */
  async function confirmDeleteProject() {
    if (!isAdmin) {
      return
    }

    if (
      projectToDelete === null
    ) {
      return
    }

    const project =
      projectList.find(
        (item) =>
          item.id ===
          projectToDelete
      )

    if (!project) {
      setProjectToDelete(null)
      return
    }

    try {
      await deleteProject(project.id)

      moveToTrash(
        "Project",
        project.id,
        project.name,
        `${project.client} • ${project.manager}`,
        project as unknown as Record<
          string,
          unknown
        >
      )

      setProjectList(
        (currentProjects) =>
          currentProjects.filter(
            (currentProject) =>
              currentProject.id !==
              project.id
          )
      )

      setProjectToDelete(null)

      showToast(
        "Project moved to Trash",
        "success"
      )
    } catch (error) {
      console.error(
        "Delete project error:",
        error
      )

      showToast(
        "Failed to delete project",
        "error"
      )
    }
  }

  /*
   * Open project in Edit mode.
   *
   * IMPORTANT:
   * assignedEmployees now comes directly
   * from projectList.
   */
  function handleEditProject(
    id: string
  ) {
    if (!isAdmin) {
      return
    }

    const project =
      projectList.find(
        (item) =>
          item.id === id
      )

    if (!project) {
      return
    }

    setName(
      project.name ?? ""
    )

    setDescription(
      project.description ?? ""
    )

    setClient(
      project.client ?? ""
    )

    setManager(
      project.manager ?? ""
    )

    setStartDate(
      project.startDate ?? ""
    )

    setEndDate(
      project.endDate ?? ""
    )

    setBudget(
      String(
        project.budget ?? 0
      )
    )

    setStatus(project.status)

    /*
     * Restore the employees already
     * assigned to this project.
     */
    setSelectedEmployees(
      project.assignedEmployees ?? []
    )

    setEditingProject(id)

    setFormError("")

    setShowForm(true)

    requestAnimationFrame(() => {
      projectFormRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    })
  }

  /*
   * Create or update the project in MongoDB.
   */
  async function handleCreateProject(
    event: FormEvent
  ) {
    event.preventDefault()

    if (!isAdmin) {
      return
    }

    const error =
      validateForm()

    if (error) {
      setFormError(error)
      return
    }

    const projectData = {
      name: name.trim(),

      description:
        description.trim(),

      client: client.trim(),

      manager: manager.trim(),

      startDate,

      endDate,

      budget: Number(budget),

      status,

      assignedEmployees: [
        ...selectedEmployees,
      ],
    }

    try {
      /*
       * UPDATE
       */
      if (
        editingProject !== null
      ) {
        const updatedProject =
          (await updateProject(
            editingProject,
            projectData
          )) as ProjectApiRecord

        if (!updatedProject._id) {
          throw new Error(
            "MongoDB did not return the updated project."
          )
        }

        const assigned =
          Array.isArray(
            updatedProject.assignedEmployees
          )
            ? updatedProject.assignedEmployees
            : updatedProject.assignedEmployees
              ? [
                  updatedProject.assignedEmployees,
                ]
              : []

        const formattedProject: Project =
          {
            id:
              updatedProject._id,

            name:
              updatedProject.name ??
              "",

            description:
              updatedProject.description ??
              "",

            client:
              updatedProject.client ??
              "",

            manager:
              updatedProject.manager ??
              "",

            startDate:
              updatedProject.startDate ??
              "",

            endDate:
              updatedProject.endDate ??
              "",

            budget:
              updatedProject.budget ??
              0,

            status:
              updatedProject.status ??
              "Planned",

            assignedEmployees:
              assigned.map(
                (employee) =>
                  employee._id
              ),
          }

        setProjectList(
          (currentProjects) =>
            currentProjects.map(
              (project) =>
                project.id ===
                editingProject
                  ? formattedProject
                  : project
            )
        )

        showToast(
          "Project updated successfully",
          "success"
        )

        resetForm()

        return
      }

      /*
       * CREATE
       */
      const newProject =
        (await createProject(
          projectData
        )) as ProjectApiRecord

      if (!newProject._id) {
        throw new Error(
          "MongoDB did not return the created project."
        )
      }

      const assigned =
        Array.isArray(
          newProject.assignedEmployees
        )
          ? newProject.assignedEmployees
          : newProject.assignedEmployees
            ? [
                newProject.assignedEmployees,
              ]
            : []

      const formattedProject: Project =
        {
          id:
            newProject._id,

          name:
            newProject.name ?? "",

          description:
            newProject.description ??
            "",

          client:
            newProject.client ?? "",

          manager:
            newProject.manager ?? "",

          startDate:
            newProject.startDate ?? "",

          endDate:
            newProject.endDate ?? "",

          budget:
            newProject.budget ?? 0,

          status:
            newProject.status ??
            "Planned",

          assignedEmployees:
            assigned.map(
              (employee) =>
                employee._id
            ),
        }

      setProjectList(
        (currentProjects) => [
          ...currentProjects,
          formattedProject,
        ]
      )

      setNewProjectId(
        formattedProject.id
      )

      showToast(
        "Project added successfully",
        "success"
      )

      resetForm()
    } catch (error) {
      console.error(
        "Save project error:",
        error
      )

      showToast(
        error instanceof Error
          ? error.message
          : "Failed to save project",
        "error"
      )
    }
  }

  /*
   * Search and filter projects.
   */
  const filteredProjects =
    projectList.filter(
      (project) => {
        const searchValue =
          search
            .toLowerCase()
            .trim()

        const projectName =
          project.name.toLowerCase()

        const projectDescription =
          project.description.toLowerCase()

        const projectClient =
          project.client.toLowerCase()

        const projectManager =
          project.manager.toLowerCase()

        const matchesSearch =
          isAdmin
            ? projectName.includes(
                searchValue
              ) ||
              projectDescription.includes(
                searchValue
              ) ||
              projectClient.includes(
                searchValue
              ) ||
              projectManager.includes(
                searchValue
              )
            : projectName.includes(
                searchValue
              ) ||
              projectDescription.includes(
                searchValue
              )

        const matchesStatus =
          statusFilter ===
            "All" ||
          project.status ===
            statusFilter

        return (
          matchesSearch &&
          matchesStatus
        )
      }
    )

  /*
   * Sort projects.
   */
  const sortedProjects = [
    ...filteredProjects,
  ].sort((a, b) => {
    switch (sortBy) {
      case "Name":
        return a.name.localeCompare(
          b.name
        )

      case "Budget":
        if (!isAdmin) {
          return 0
        }

        return (
          b.budget - a.budget
        )

      case "Start Date":
        return (
          new Date(
            b.startDate
          ).getTime() -
          new Date(
            a.startDate
          ).getTime()
        )

      default:
        return 0
    }
  })

  /*
   * Project statistics.
   */
  const totalProjects =
    projectList.length

  const inProgressProjects =
    projectList.filter(
      (project) =>
        project.status ===
        "In Progress"
    ).length

  const completedProjects =
    projectList.filter(
      (project) =>
        project.status ===
        "Completed"
    ).length

  const totalBudget =
    projectList.reduce(
      (total, project) =>
        total + project.budget,
      0
    )

  return (
    <main className="projects-page">
      {/* Project hero header */}
      <section className="projects-hero">
        <div className="projects-hero-main">
          <div className="projects-hero-icon">
            <FolderKanban size={27} />
          </div>

          <div className="projects-hero-content">
            <div className="projects-hero-label">
              <span className="hero-dot" />
              PROJECT MANAGEMENT
            </div>

            <h1>
              Project{" "}
              <span>Workspace</span>
            </h1>

            <p>
              {isAdmin
                ? "Plan, monitor and manage your projects, budgets and timelines in one place."
                : "View your assigned projects, timelines and current progress."}
            </p>
          </div>
        </div>

        <div className="projects-hero-right">
          <div className="hero-mini-stats">
            <div className="hero-mini-stat">
              <div className="hero-mini-icon">
                <BriefcaseBusiness
                  size={16}
                />
              </div>

              <div>
                <strong>
                  {totalProjects}
                </strong>

                <span>
                  Total Projects
                </span>
              </div>
            </div>

            <div className="hero-mini-divider" />

            <div className="hero-mini-stat">
              <div className="hero-mini-icon active">
                <Clock3 size={16} />
              </div>

              <div>
                <strong>
                  {inProgressProjects}
                </strong>

                <span>
                  Active
                </span>
              </div>
            </div>
          </div>

          {isAdmin && (
            <button
              type="button"
              className="add-project-btn"
              onClick={() => {
                if (showForm) {
                  resetForm()
                } else {
                  openProjectForm()
                }
              }}
            >
              <Plus size={18} />

              <span>
                {showForm
                  ? "Close Form"
                  : "Add Project"}
              </span>
            </button>
          )}
        </div>
      </section>

      {/* Project statistics */}
      <section className="project-stats">
        <div className="project-stat-card">
          <div className="project-stat-icon total">
            <BriefcaseBusiness
              size={21}
            />
          </div>

          <div>
            <span>
              Total Projects
            </span>

            <strong>
              {totalProjects}
            </strong>
          </div>

          <div className="stat-trend">
            <TrendingUp size={14} />

            <span>
              {isAdmin
                ? "All projects"
                : "Assigned"}
            </span>
          </div>
        </div>

        <div className="project-stat-card">
          <div className="project-stat-icon progress">
            <Clock3 size={21} />
          </div>

          <div>
            <span>
              In Progress
            </span>

            <strong>
              {inProgressProjects}
            </strong>
          </div>

          <div className="stat-trend">
            <span>
              {totalProjects > 0
                ? Math.round(
                    (inProgressProjects /
                      totalProjects) *
                      100
                  )
                : 0}
              %
            </span>
          </div>
        </div>

        <div className="project-stat-card">
          <div className="project-stat-icon completed">
            <CheckCircle2
              size={21}
            />
          </div>

          <div>
            <span>
              Completed
            </span>

            <strong>
              {completedProjects}
            </strong>
          </div>

          <div className="stat-trend">
            <span>
              {totalProjects > 0
                ? Math.round(
                    (completedProjects /
                      totalProjects) *
                      100
                  )
                : 0}
              %
            </span>
          </div>
        </div>

        {isAdmin && (
          <div className="project-stat-card">
            <div className="project-stat-icon budget">
              <DollarSign size={21} />
            </div>

            <div>
              <span>
                Total Budget
              </span>

              <strong>
                $
                {totalBudget.toLocaleString()}
              </strong>
            </div>

            <div className="stat-trend">
              <span>
                Portfolio
              </span>
            </div>
          </div>
        )}
      </section>

      {/* Search and filters */}
      <section className="projects-toolbar">
        <div className="project-search">
          <Search size={18} />

          <input
            type="text"
            placeholder={
              isAdmin
                ? "Search projects, clients or managers..."
                : "Search your projects..."
            }
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
          />
        </div>

        <div className="project-filter">
          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(
                event.target
                  .value as
                  | "All"
                  | Project["status"]
              )
            }
          >
            <option value="All">
              All Status
            </option>

            <option value="Planned">
              Planned
            </option>

            <option value="In Progress">
              In Progress
            </option>

            <option value="Completed">
              Completed
            </option>

            <option value="Cancelled">
              Cancelled
            </option>
          </select>

          <select
            value={sortBy}
            onChange={(event) =>
              setSortBy(
                event.target
                  .value as ProjectSortOption
              )
            }
          >
            <option value="None">
              No Sort
            </option>

            <option value="Name">
              Name
            </option>

            {isAdmin && (
              <option value="Budget">
                Budget
              </option>
            )}

            <option value="Start Date">
              Start Date
            </option>
          </select>
        </div>
      </section>

      {/* Add / edit project form */}
      {isAdmin && showForm && (
        <form
          ref={projectFormRef}
          className="project-form"
          onSubmit={
            handleCreateProject
          }
        >
          <div className="project-form-header">
            <div>
              <span className="form-eyebrow">
                PROJECT DETAILS
              </span>

              <h2>
                {editingProject !== null
                  ? "Edit Project"
                  : "Add New Project"}
              </h2>
            </div>

            <div className="project-form-icon">
              <FolderKanban size={22} />
            </div>
          </div>

          <div className="project-form-grid">
            <div className="project-field">
              <label>
                Project Name
              </label>

              <input
                type="text"
                placeholder="Enter project name"
                value={name}
                required
                onChange={(event) => {
                  setName(
                    event.target.value
                  )
                  setFormError("")
                }}
              />
            </div>

            <div className="project-field">
              <label>
                Client
              </label>

              <input
                type="text"
                placeholder="Enter client name"
                value={client}
                required
                onChange={(event) => {
                  setClient(
                    event.target.value
                  )
                  setFormError("")
                }}
              />
            </div>

            <div className="project-field">
              <label>
                Manager
              </label>

              <input
                type="text"
                placeholder="Enter project manager"
                value={manager}
                required
                onChange={(event) => {
                  setManager(
                    event.target.value
                  )
                  setFormError("")
                }}
              />
            </div>

            <div className="project-field">
              <label>
                Budget
              </label>

              <input
                type="number"
                placeholder="Enter project budget"
                value={budget}
                min="0"
                required
                onChange={(event) => {
                  setBudget(
                    event.target.value
                  )
                  setFormError("")
                }}
              />
            </div>

            <div className="project-field">
              <label>
                Start Date
              </label>

              <input
                type="date"
                value={startDate}
                required
                onChange={(event) => {
                  setStartDate(
                    event.target.value
                  )
                  setFormError("")
                }}
              />
            </div>

            <div className="project-field">
              <label>
                End Date
              </label>

              <input
                type="date"
                value={endDate}
                min={
                  startDate ||
                  undefined
                }
                required
                onChange={(event) => {
                  setEndDate(
                    event.target.value
                  )
                  setFormError("")
                }}
              />
            </div>

            <div className="project-field project-field-full">
              <label>
                Project Description
              </label>

              <textarea
                placeholder="Describe the project..."
                value={description}
                required
                onChange={(event) => {
                  setDescription(
                    event.target.value
                  )
                  setFormError("")
                }}
              />
            </div>

            <div className="project-field">
              <label>
                Status
              </label>

              <select
                value={status}
                required
                onChange={(event) => {
                  setStatus(
                    event.target
                      .value as
                      Project["status"]
                  )

                  setFormError("")
                }}
              >
                <option value="Planned">
                  Planned
                </option>

                <option value="In Progress">
                  In Progress
                </option>

                <option value="Completed">
                  Completed
                </option>

                <option value="Cancelled">
                  Cancelled
                </option>
              </select>
            </div>

            {/* Assign employees */}
            <div className="project-field project-field-full">
              <label>
                Assign Employees
              </label>

              <div className="project-employee-selector">
                {employeeList.length ===
                0 ? (
                  <p>
                    No employees available.
                  </p>
                ) : (
                  employeeList.map(
                    (employee) => {
                      const isSelected =
                        selectedEmployees.includes(
                          employee._id
                        )

                      return (
                        <label
                          key={
                            employee._id
                          }
                          className={`project-employee-option ${
                            isSelected
                              ? "selected"
                              : ""
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={
                              isSelected
                            }
                            onChange={() =>
                              handleEmployeeToggle(
                                employee._id
                              )
                            }
                          />

                          <div className="project-employee-icon">
                            <UserRound
                              size={16}
                            />
                          </div>

                          <div className="project-employee-info">
                            <strong>
                              {
                                employee.firstName
                              }{" "}
                              {
                                employee.lastName
                              }
                            </strong>

                            <span>
                              {
                                employee.position
                              }
                            </span>
                          </div>
                        </label>
                      )
                    }
                  )
                )}
              </div>

              {selectedEmployees.length >
                0 && (
                <small>
                  {
                    selectedEmployees.length
                  }{" "}
                  employee
                  {selectedEmployees.length !==
                  1
                    ? "s"
                    : ""}{" "}
                  assigned
                </small>
              )}
            </div>
          </div>

          {formError && (
            <p className="form-error">
              {formError}
            </p>
          )}

          <div className="project-form-actions">
            <button
              type="submit"
              className="create-project-btn"
            >
              {editingProject !== null
                ? "Update Project"
                : "Create Project"}
            </button>

            <button
              type="button"
              className="project-form-cancel-btn"
              onClick={resetForm}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Project overview */}
      <section className="projects-section">
        <div className="projects-section-header">
          <div>
            <h2>
              Project Overview
            </h2>

            <p>
              {sortedProjects.length}{" "}
              project
              {sortedProjects.length !==
              1
                ? "s"
                : ""}{" "}
              displayed
            </p>
          </div>
        </div>

        <div className="projects-grid">
          {sortedProjects.length >
          0 ? (
            sortedProjects.map(
              (project) => (
                <div
                  key={project.id}
                  id={`project-${project.id}`}
                >
                  <ProjectCard
                    project={project}
                    onDelete={
                      isAdmin
                        ? handleDeleteProject
                        : () => {}
                    }
                    onEdit={
                      isAdmin
                        ? handleEditProject
                        : () => {}
                    }
                    isAdmin={isAdmin}
                  />
                </div>
              )
            )
          ) : (
            <div className="project-empty-state">
              <div className="empty-icon">
                <FolderKanban
                  size={28}
                />
              </div>

              <h2>
                No Projects Found
              </h2>

              <p>
                {isAdmin
                  ? "No projects match your current search or filters."
                  : "You do not have any assigned projects yet."}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Delete confirmation */}
      {isAdmin &&
        projectToDelete !==
          null && (
          <Modal
            title="Delete Project"
            message="Are you sure you want to move this project to Trash? You can recover it later from the Trash page."
            onCancel={() =>
              setProjectToDelete(
                null
              )
            }
            onConfirm={
              confirmDeleteProject
            }
          />
        )}
    </main>
  )
}