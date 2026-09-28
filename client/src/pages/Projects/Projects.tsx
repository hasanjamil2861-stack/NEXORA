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
} from "lucide-react"

import ProjectCard from "../../components/ProjectCard/ProjectCard"
import Modal from "../../components/Modal/Modal"

import type { Project } from "../../types/Project"

import { useToast } from "../../context/ToastContext"
import { useTrash } from "../../context/TrashContext"

import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} from "../../services/api/projectApi"

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
  const [projectList, setProjectList] =
    useState<Project[]>([])

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
    useState<"All" | Project["status"]>("All")

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

  // Scroll to the newly created project.
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

  // Load projects from MongoDB.
  useEffect(() => {
    async function fetchProjects() {
      try {
        const data =
          (await getProjects()) as ProjectApiRecord[]

        const formattedProjects: Project[] =
          data.map((project) => ({
            id: project._id,
            name: project.name ?? "",
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
              project.status ?? "Planned",
          }))

        setProjectList(formattedProjects)
      } catch (error) {
        console.error(
          "Fetch projects error:",
          error
        )

        showToast(
          "Failed to load projects",
          "error"
        )
      }
    }

    fetchProjects()
  }, [showToast])

  // Reset the project form.
  function resetForm() {
    setName(initialForm.name)
    setDescription(initialForm.description)
    setClient(initialForm.client)
    setManager(initialForm.manager)
    setStartDate(initialForm.startDate)
    setEndDate(initialForm.endDate)
    setBudget(initialForm.budget)
    setStatus(initialForm.status)
    setEditingProject(null)
    setFormError("")
    setShowForm(false)
  }

  function openProjectForm() {
    setShowForm(true)
    setFormError("")

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

    return ""
  }

  function handleDeleteProject(id: string) {
    setProjectToDelete(id)
  }

  // Delete from MongoDB, then move the project to Trash.
  async function confirmDeleteProject() {
    if (projectToDelete === null) {
      return
    }

    const project =
      projectList.find(
        (item) =>
          item.id === projectToDelete
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

  function handleEditProject(id: string) {
    const project =
      projectList.find(
        (item) => item.id === id
      )

    if (!project) {
      return
    }

    setName(project.name ?? "")
    setDescription(
      project.description ?? ""
    )
    setClient(project.client ?? "")
    setManager(project.manager ?? "")
    setStartDate(
      project.startDate ?? ""
    )
    setEndDate(
      project.endDate ?? ""
    )
    setBudget(
      String(project.budget ?? 0)
    )
    setStatus(project.status)
    setEditingProject(project.id)
    setFormError("")
    setShowForm(true)

    requestAnimationFrame(() => {
      projectFormRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    })
  }

  // Create or update the project in MongoDB.
  async function handleCreateProject(
    event: FormEvent
  ) {
    event.preventDefault()

    const error = validateForm()

    if (error) {
      setFormError(error)
      return
    }

    const projectData = {
      name: name.trim(),
      description: description.trim(),
      client: client.trim(),
      manager: manager.trim(),
      startDate,
      endDate,
      budget: Number(budget),
      status,
    }

    try {
      if (editingProject !== null) {
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

        const formattedProject: Project = {
          id: updatedProject._id,
          name:
            updatedProject.name ?? "",
          description:
            updatedProject.description ?? "",
          client:
            updatedProject.client ?? "",
          manager:
            updatedProject.manager ?? "",
          startDate:
            updatedProject.startDate ?? "",
          endDate:
            updatedProject.endDate ?? "",
          budget:
            updatedProject.budget ?? 0,
          status:
            updatedProject.status ?? "Planned",
        }

        setProjectList(
          (currentProjects) =>
            currentProjects.map(
              (project) =>
                project.id === editingProject
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

      const newProject =
        (await createProject(
          projectData
        )) as ProjectApiRecord

      if (!newProject._id) {
        throw new Error(
          "MongoDB did not return the created project."
        )
      }

      const formattedProject: Project = {
        id: newProject._id,
        name:
          newProject.name ?? "",
        description:
          newProject.description ?? "",
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
          newProject.status ?? "Planned",
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

  // Search and filter projects.
  const filteredProjects =
    projectList.filter((project) => {
      const searchValue =
        search.toLowerCase().trim()

      const projectName =
        project.name.toLowerCase()

      const projectDescription =
        project.description.toLowerCase()

      const projectClient =
        project.client.toLowerCase()

      const projectManager =
        project.manager.toLowerCase()

      const matchesSearch =
        projectName.includes(searchValue) ||
        projectDescription.includes(searchValue) ||
        projectClient.includes(searchValue) ||
        projectManager.includes(searchValue)

      const matchesStatus =
        statusFilter === "All" ||
        project.status === statusFilter

      return (
        matchesSearch &&
        matchesStatus
      )
    })

  // Sort projects by the selected option.
  const sortedProjects = [
    ...filteredProjects,
  ].sort((a, b) => {
    switch (sortBy) {
      case "Name":
        return a.name.localeCompare(
          b.name
        )

      case "Budget":
        return b.budget - a.budget

      case "Start Date":
        return (
          new Date(b.startDate).getTime() -
          new Date(a.startDate).getTime()
        )

      default:
        return 0
    }
  })

  // Project statistics.
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
              Project <span>Workspace</span>
            </h1>

            <p>
              Plan, monitor and manage your projects,
              budgets and timelines in one place.
            </p>
          </div>
        </div>

        <div className="projects-hero-right">
          <div className="hero-mini-stats">
            <div className="hero-mini-stat">
              <div className="hero-mini-icon">
                <BriefcaseBusiness size={16} />
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

                <span>Active</span>
              </div>
            </div>
          </div>

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
        </div>
      </section>

      {/* Project statistics */}
      <section className="project-stats">
        <div className="project-stat-card">
          <div className="project-stat-icon total">
            <BriefcaseBusiness size={21} />
          </div>

          <div>
            <span>Total Projects</span>

            <strong>
              {totalProjects}
            </strong>
          </div>

          <div className="stat-trend">
            <TrendingUp size={14} />

            <span>All projects</span>
          </div>
        </div>

        <div className="project-stat-card">
          <div className="project-stat-icon progress">
            <Clock3 size={21} />
          </div>

          <div>
            <span>In Progress</span>

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
            <CheckCircle2 size={21} />
          </div>

          <div>
            <span>Completed</span>

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

        <div className="project-stat-card">
          <div className="project-stat-icon budget">
            <DollarSign size={21} />
          </div>

          <div>
            <span>Total Budget</span>

            <strong>
              $
              {totalBudget.toLocaleString()}
            </strong>
          </div>

          <div className="stat-trend">
            <span>Portfolio</span>
          </div>
        </div>
      </section>

      {/* Search and filters */}
      <section className="projects-toolbar">
        <div className="project-search">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search projects, clients or managers..."
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
                event.target.value as
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
                event.target.value as ProjectSortOption
              )
            }
          >
            <option value="None">
              No Sort
            </option>

            <option value="Name">
              Name
            </option>

            <option value="Budget">
              Budget
            </option>

            <option value="Start Date">
              Start Date
            </option>
          </select>
        </div>
      </section>

      {/* Add / edit project form */}
      {showForm && (
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
              <label>Project Name</label>

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
              <label>Client</label>

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
              <label>Manager</label>

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
              <label>Budget</label>

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
              <label>Start Date</label>

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
              <label>End Date</label>

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
              <label>Status</label>

              <select
                value={status}
                required
                onChange={(event) => {
                  setStatus(
                    event.target.value as
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
            <h2>Project Overview</h2>

            <p>
              {sortedProjects.length} project
              {sortedProjects.length !== 1
                ? "s"
                : ""}{" "}
              displayed
            </p>
          </div>
        </div>

        <div className="projects-grid">
          {sortedProjects.length > 0 ? (
            sortedProjects.map(
              (project) => (
                <div
                  key={project.id}
                  id={`project-${project.id}`}
                >
                  <ProjectCard
                    project={project}
                    onDelete={
                      handleDeleteProject
                    }
                    onEdit={
                      handleEditProject
                    }
                  />
                </div>
              )
            )
          ) : (
            <div className="project-empty-state">
              <div className="empty-icon">
                <FolderKanban size={28} />
              </div>

              <h2>No Projects Found</h2>

              <p>
                No projects match your current
                search or filters.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Delete confirmation */}
      {projectToDelete !== null && (
        <Modal
          title="Delete Project"
          message="Are you sure you want to move this project to Trash? You can recover it later from the Trash page."
          onCancel={() =>
            setProjectToDelete(null)
          }
          onConfirm={
            confirmDeleteProject
          }
        />
      )}
    </main>
  )
}