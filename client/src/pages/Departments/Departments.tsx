import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react"

import {
  Building2,
  Users,
  UserCheck,
  UserX,
  Search,
  Plus,
  ArrowUpDown,
  BriefcaseBusiness,
  FileText,
  UserRound,
  Save,
  X,
} from "lucide-react"

import DepartmentCard from "../../components/DepartmentCard/DepartmentCard"
import type { Department } from "../../types/Department"
import Modal from "../../components/Modal/Modal"

import { useToast } from "../../context/ToastContext"
import { useTrash } from "../../context/TrashContext"

import {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from "../../services/api/departmentApi"


// MongoDB department returned by the API
type DepartmentApiRecord = {
  _id: string
  name?: string
  description?: string
  manager?: string
  employeeCount?: number
  status?: "Active" | "Inactive"
}

// Convert MongoDB data into the frontend Department type
function formatDepartment(
  department: DepartmentApiRecord
): Department {
  return {
    id: department._id,
    name: department.name ?? "",
    description: department.description ?? "",
    manager: department.manager ?? "",
    employeeCount: department.employeeCount ?? 0,
    status: department.status ?? "Active",
  }
}

export default function Departments() {
  const { showToast } = useToast()
  const { moveToTrash } = useTrash()

  const [departmentList, setDepartmentList] =
    useState<Department[]>([])

  const [showForm, setShowForm] = useState(false)

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [manager, setManager] = useState("")
  const [employeeCount, setEmployeeCount] = useState("")
  const [status, setStatus] =
    useState<Department["status"]>("Active")

  const [editingDepartment, setEditingDepartment] =
    useState<string | null>(null)

  const [departmentToDelete, setDepartmentToDelete] =
    useState<string | null>(null)

  const [search, setSearch] = useState("")

  const [statusFilter, setStatusFilter] =
    useState<"All" | Department["status"]>("All")

  const [sortBy, setSortBy] = useState("None")

  const [formError, setFormError] = useState("")

  const [newDepartmentId, setNewDepartmentId] =
    useState<string | null>(null)

  const departmentFormRef =
    useRef<HTMLElement | null>(null)

  // Scroll to the newly created department
  useEffect(() => {
    if (!newDepartmentId) {
      return
    }

    const frame = requestAnimationFrame(() => {
      const newDepartment = document.getElementById(
        `department-${newDepartmentId}`
      )

      if (newDepartment) {
        newDepartment.scrollIntoView({
          behavior: "smooth",
          block: "center",
        })
      }

      setNewDepartmentId(null)
    })

    return () => cancelAnimationFrame(frame)
  }, [newDepartmentId])

  // Fetch departments from MongoDB
  useEffect(() => {
    async function fetchDepartments() {
      try {
        const data =
          (await getDepartments()) as DepartmentApiRecord[]

        const formattedDepartments =
          data.map(formatDepartment)

        setDepartmentList(formattedDepartments)
      } catch {
        showToast(
          "Failed to load departments.",
          "error"
        )
      }
    }

    fetchDepartments()
  }, [showToast])

  // Calculate department statistics
  const totalDepartments = departmentList.length

  const activeDepartments = departmentList.filter(
    (department) => department.status === "Active"
  ).length

  const inactiveDepartments = departmentList.filter(
    (department) => department.status === "Inactive"
  ).length

  const totalEmployees = departmentList.reduce(
    (total, department) =>
      total + Number(department.employeeCount),
    0
  )

  const activePercentage =
    totalDepartments > 0
      ? Math.round(
          (activeDepartments / totalDepartments) * 100
        )
      : 0

  // Reset Add/Edit form
  const resetForm = () => {
    setName("")
    setDescription("")
    setManager("")
    setEmployeeCount("")
    setStatus("Active")
    setEditingDepartment(null)
    setFormError("")
  }

  // Open the department form
  const openDepartmentForm = () => {
    resetForm()
    setShowForm(true)

    requestAnimationFrame(() => {
      departmentFormRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    })
  }

  // Prepare a department for deletion
  const handleDeleteDepartment = (id: string) => {
    setDepartmentToDelete(id)
  }

  // Delete from MongoDB and move the item to Trash
  const confirmDeleteDepartment = async () => {
    if (departmentToDelete === null) {
      return
    }

    const department = departmentList.find(
      (item) => item.id === departmentToDelete
    )

    if (!department) {
      return
    }

    try {
      await deleteDepartment(departmentToDelete)

      moveToTrash(
        "Department",
        department.id,
        department.name,
        department.description,
        department as unknown as Record<string, unknown>
      )

      setDepartmentList((currentDepartments) =>
        currentDepartments.filter(
          (item) => item.id !== departmentToDelete
        )
      )

      setDepartmentToDelete(null)

      showToast(
        "Department deleted successfully and moved to Trash.",
        "success"
      )
    } catch {
      showToast(
        "Failed to delete department.",
        "error"
      )
    }
  }

  // Load the selected department into the Edit form
  const handleEditDepartment = (id: string) => {
    const department = departmentList.find(
      (item) => item.id === id
    )

    if (!department) {
      return
    }

    setEditingDepartment(id)
    setName(department.name ?? "")
    setDescription(department.description ?? "")
    setManager(department.manager ?? "")
    setEmployeeCount(
      String(department.employeeCount ?? 0)
    )
    setStatus(department.status)
    setFormError("")
    setShowForm(true)

    requestAnimationFrame(() => {
      departmentFormRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    })
  }

  // Validate Add/Edit form
  const validateForm = () => {
    if (!name.trim()) {
      setFormError("Department name is required.")
      return false
    }

    if (!description.trim()) {
      setFormError("Description is required.")
      return false
    }

    if (!manager.trim()) {
      setFormError("Manager is required.")
      return false
    }

    if (!employeeCount.trim()) {
      setFormError("Employee count is required.")
      return false
    }

    if (Number.isNaN(Number(employeeCount))) {
      setFormError(
        "Employee count must be a valid number."
      )
      return false
    }

    if (Number(employeeCount) < 0) {
      setFormError(
        "Employee count cannot be negative."
      )
      return false
    }

    if (!status) {
      setFormError("Status is required.")
      return false
    }

    setFormError("")
    return true
  }

  // Create or update a department
  const handleCreateDepartment = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault()

    if (!validateForm()) {
      return
    }

    const departmentData = {
      name: name.trim(),
      description: description.trim(),
      manager: manager.trim(),
      employeeCount: Number(employeeCount),
      status,
    }

    try {
      // Update existing department
      if (editingDepartment !== null) {
        const updatedDepartment =
          (await updateDepartment(
            editingDepartment,
            departmentData
          )) as DepartmentApiRecord

        const formattedDepartment =
          formatDepartment(updatedDepartment)

        setDepartmentList((currentDepartments) =>
          currentDepartments.map((department) =>
            department.id === editingDepartment
              ? formattedDepartment
              : department
          )
        )

        showToast(
          "Department updated successfully.",
          "success"
        )
      }

      // Create new department
      else {
        const createdDepartment =
          (await createDepartment(
            departmentData
          )) as DepartmentApiRecord

        const formattedDepartment =
          formatDepartment(createdDepartment)

        setDepartmentList((currentDepartments) => [
          ...currentDepartments,
          formattedDepartment,
        ])

        setNewDepartmentId(formattedDepartment.id)

        showToast(
          "Department created successfully.",
          "success"
        )
      }

      resetForm()
      setShowForm(false)
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      )
    }
  }

  // Close the Add/Edit form
  const handleCancelForm = () => {
    resetForm()
    setShowForm(false)
  }

  // Apply search and status filtering
  const filteredDepartments = departmentList.filter(
    (department) => {
      const searchValue = search
        .toLowerCase()
        .trim()

      const departmentName =
        department.name.toLowerCase()

      const departmentDescription =
        department.description.toLowerCase()

      const departmentManager =
        department.manager.toLowerCase()

      const matchesSearch =
        departmentName.includes(searchValue) ||
        departmentDescription.includes(searchValue) ||
        departmentManager.includes(searchValue)

      const matchesStatus =
        statusFilter === "All" ||
        department.status === statusFilter

      return matchesSearch && matchesStatus
    }
  )

  // Sort filtered departments
  const sortedDepartments = [
    ...filteredDepartments,
  ].sort((a, b) => {
    if (sortBy === "Name A-Z") {
      return a.name.localeCompare(b.name)
    }

    if (sortBy === "Name Z-A") {
      return b.name.localeCompare(a.name)
    }

    if (sortBy === "Employees High-Low") {
      return (
        Number(b.employeeCount) -
        Number(a.employeeCount)
      )
    }

    if (sortBy === "Employees Low-High") {
      return (
        Number(a.employeeCount) -
        Number(b.employeeCount)
      )
    }

    return 0
  })

  return (
    <main className="departments-page">
      {/* Page header */}
      <header className="departments-header">
        <div className="departments-header-main">
          <div className="departments-title-icon">
            <Building2 size={26} />
          </div>

          <div className="departments-title-content">
            <span className="departments-eyebrow">
              ORGANIZATION MANAGEMENT
            </span>

            <h1>Departments</h1>

            <p>
              Manage departments, managers, teams, and
              workforce distribution from one centralized
              workspace.
            </p>
          </div>
        </div>

        <div className="departments-header-right">
          <div className="departments-header-summary">
            <span>Active Departments</span>

            <strong>{activeDepartments}</strong>

            <small>
              of {totalDepartments} total
            </small>
          </div>

          <button
            type="button"
            className="add-department-btn"
            onClick={() => {
              if (showForm) {
                handleCancelForm()
              } else {
                openDepartmentForm()
              }
            }}
          >
            <Plus size={18} />

            <span>
              {showForm
                ? "Close Form"
                : "Add Department"}
            </span>
          </button>
        </div>
      </header>

      {/* Department statistics */}
      <section className="department-stats">
        <div className="department-stat-card">
          <div className="department-stat-icon blue">
            <Building2 size={20} />
          </div>

          <div className="department-stat-content">
            <span>Total Departments</span>
            <strong>{totalDepartments}</strong>
          </div>
        </div>

        <div className="department-stat-card">
          <div className="department-stat-icon green">
            <UserCheck size={20} />
          </div>

          <div className="department-stat-content">
            <span>Active</span>
            <strong>{activeDepartments}</strong>
          </div>
        </div>

        <div className="department-stat-card">
          <div className="department-stat-icon red">
            <UserX size={20} />
          </div>

          <div className="department-stat-content">
            <span>Inactive</span>
            <strong>{inactiveDepartments}</strong>
          </div>
        </div>

        <div className="department-stat-card">
          <div className="department-stat-icon purple">
            <Users size={20} />
          </div>

          <div className="department-stat-content">
            <span>Total Employees</span>
            <strong>{totalEmployees}</strong>
          </div>
        </div>
      </section>

      {/* Active department overview */}
      <section className="department-overview">
        <div className="department-overview-header">
          <div>
            <h2>
              <BriefcaseBusiness size={18} />
              Department Overview
            </h2>

            <p>
              Current active department percentage.
            </p>
          </div>

          <strong>{activePercentage}%</strong>
        </div>

        <div className="department-progress">
          <div
            className="department-progress-bar"
            style={{
              width: `${activePercentage}%`,
            }}
          />
        </div>
      </section>

      {/* Search, filters, and sorting */}
      <section className="department-toolbar">
        <div className="department-search">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search departments..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />
        </div>

        <select
          className="department-filter"
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(
              event.target.value as
                | "All"
                | Department["status"]
            )
          }
        >
          <option value="All">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>

        <div className="sort-control">
          <ArrowUpDown size={16} />

          <select
            value={sortBy}
            onChange={(event) =>
              setSortBy(event.target.value)
            }
          >
            <option value="None">Sort By</option>
            <option value="Name A-Z">Name A-Z</option>
            <option value="Name Z-A">Name Z-A</option>
            <option value="Employees High-Low">
              Employees High-Low
            </option>
            <option value="Employees Low-High">
              Employees Low-High
            </option>
          </select>
        </div>
      </section>

      {/* Search results count */}
      <div className="department-results-info">
        Showing{" "}
        <strong>{sortedDepartments.length}</strong>{" "}
        of{" "}
        <strong>{departmentList.length}</strong>{" "}
        departments
      </div>

      {/* Add / Edit department form */}
      {showForm && (
        <section
          ref={departmentFormRef}
          className="department-form"
        >
          <div className="department-form-header">
            <div>
              <span className="department-form-eyebrow">
                {editingDepartment !== null
                  ? "UPDATE DEPARTMENT"
                  : "NEW DEPARTMENT"}
              </span>

              <h2>
                {editingDepartment !== null
                  ? "Edit Department"
                  : "Add Department"}
              </h2>

              <p>
                Enter the department information below.
              </p>
            </div>

            <div className="department-form-icon">
              {editingDepartment !== null ? (
                <Save size={20} />
              ) : (
                <Plus size={20} />
              )}
            </div>
          </div>

          {formError && (
            <div className="department-form-error">
              {formError}
            </div>
          )}

          <form onSubmit={handleCreateDepartment}>
            <div className="department-form-grid">
              <div className="department-form-field">
                <label htmlFor="department-name">
                  <Building2 size={14} />
                  Department Name
                </label>

                <input
                  id="department-name"
                  type="text"
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                  required
                />
              </div>

              <div className="department-form-field">
                <label htmlFor="department-manager">
                  <UserRound size={14} />
                  Manager
                </label>

                <input
                  id="department-manager"
                  type="text"
                  value={manager}
                  onChange={(event) =>
                    setManager(event.target.value)
                  }
                  required
                />
              </div>

              <div className="department-form-field">
                <label htmlFor="department-employees">
                  <Users size={14} />
                  Employee Count
                </label>

                <input
                  id="department-employees"
                  type="number"
                  min="0"
                  value={employeeCount}
                  onChange={(event) =>
                    setEmployeeCount(
                      event.target.value
                    )
                  }
                  required
                />
              </div>

              <div className="department-form-field">
                <label htmlFor="department-status">
                  <UserCheck size={14} />
                  Status
                </label>

                <select
                  id="department-status"
                  value={status}
                  onChange={(event) =>
                    setStatus(
                      event.target.value as
                        Department["status"]
                    )
                  }
                  required
                >
                  <option value="Active">
                    Active
                  </option>

                  <option value="Inactive">
                    Inactive
                  </option>
                </select>
              </div>

              <div className="department-form-field department-description-field">
                <label htmlFor="department-description">
                  <FileText size={14} />
                  Description
                </label>

                <textarea
                  id="department-description"
                  value={description}
                  onChange={(event) =>
                    setDescription(
                      event.target.value
                    )
                  }
                  rows={4}
                  required
                />
              </div>
            </div>

            <div className="department-form-actions">
              <button
                type="button"
                className="department-cancel-btn"
                onClick={handleCancelForm}
              >
                <X size={16} />
                Cancel
              </button>

              <button
                type="submit"
                className="department-submit-btn"
              >
                <Save size={16} />

                {editingDepartment !== null
                  ? "Update Department"
                  : "Create Department"}
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Department cards */}
      {sortedDepartments.length > 0 ? (
        <section className="departments-grid">
          {sortedDepartments.map((department) => (
            <div
              key={department.id}
              id={`department-${department.id}`}
            >
              <DepartmentCard
                department={department}
                onDelete={handleDeleteDepartment}
                onEdit={handleEditDepartment}
              />
            </div>
          ))}
        </section>
      ) : (
        <div className="department-empty-state">
          <Building2 size={36} />

          <h3>No departments found</h3>

          <p>
            Try changing your search or filters.
          </p>
        </div>
      )}

      {/* Delete confirmation */}
      {departmentToDelete !== null && (
        <Modal
          title="Delete Department"
          message="This department will be permanently deleted from the database and moved to Trash for recovery."
          onCancel={() =>
            setDepartmentToDelete(null)
          }
          onConfirm={confirmDeleteDepartment}
        />
      )}
    </main>
  )
}