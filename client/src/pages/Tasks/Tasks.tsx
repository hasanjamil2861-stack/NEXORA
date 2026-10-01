import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react"

import {
  Search,
  ClipboardList,
  CircleCheck,
  Clock3,
  Activity,
  Flag,
  Plus,
  ArrowUpDown,
  Pencil,
  
  Users,
  FileText,
  FolderKanban,
} from "lucide-react"

import { useAuth } from "../../context/AuthContext"
import { useToast } from "../../context/ToastContext"
import { useTrash } from "../../context/TrashContext"

import type { Task } from "../../types/Task"

import TaskCard from "../../components/TaskCard/TaskCard"
import Modal from "../../components/Modal/Modal"

import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../../services/api/taskApi"

import { getEmployees } from "../../services/api/employeeApi"

type EmployeeRecord = {
  _id: string
  firstName?: string
  lastName?: string
  email?: string
}

type TaskApiRecord = {
  _id: string
  title?: string
  description?: string
  status?: Task["status"]
  priority?: Task["priority"]
  assignedTo?:
    | string
    | {
        _id: string
      }
  projectId?:
    | string
    | {
        _id: string
      }
  dueDate?: string
}

type TaskFormData = {
  title: string
  description: string
  status: Task["status"]
  priority: Task["priority"]
  assignedTo: string
  projectId: string
  dueDate: string
}

const emptyTaskForm: TaskFormData = {
  title: "",
  description: "",
  status: "Pending",
  priority: "Medium",
  assignedTo: "",
  projectId: "",
  dueDate: "",
}

export default function Tasks() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const { moveToTrash } = useTrash()

  const isAdmin = user?.role === "Admin"

  const [taskList, setTaskList] =
    useState<Task[]>([])

  const [employees, setEmployees] =
    useState<EmployeeRecord[]>([])

  const [showForm, setShowForm] =
    useState(false)

  const [formData, setFormData] =
    useState<TaskFormData>(
      emptyTaskForm
    )

  const [editingTask, setEditingTask] =
    useState<string | null>(null)

  const [taskToDelete, setTaskToDelete] =
    useState<string | null>(null)

  const [newTaskId, setNewTaskId] =
    useState<string | null>(null)

  const [search, setSearch] =
    useState("")

  const [statusFilter, setStatusFilter] =
    useState("All")

  const [priorityFilter, setPriorityFilter] =
    useState("All")

  const [sortOption, setSortOption] =
    useState("title-asc")

  const [formError, setFormError] =
    useState("")

  const taskFormRef =
    useRef<HTMLFormElement | null>(null)

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data =
          (await getTasks()) as TaskApiRecord[]

        const formattedTasks: Task[] =
          data.map((task) => ({
            id: task._id,
            title: task.title ?? "",
            description:
              task.description ?? "",
            status:
              task.status ?? "Pending",
            priority:
              task.priority ?? "Medium",
            assignedTo:
              typeof task.assignedTo ===
              "object"
                ? task.assignedTo._id
                : task.assignedTo ?? "",
            projectId:
              typeof task.projectId ===
              "object"
                ? task.projectId._id
                : task.projectId ?? "",
            dueDate:
              task.dueDate ?? "",
          })) as Task[]

        setTaskList(formattedTasks)
      } catch (error) {
        console.error(
          "Fetch tasks error:",
          error
        )

        showToast(
          "Failed to load tasks",
          "error"
        )
      }
    }

    fetchTasks()
  }, [showToast])

  useEffect(() => {
    if (!isAdmin) {
      return
    }

    const fetchEmployees = async () => {
      try {
        const data =
          (await getEmployees()) as EmployeeRecord[]

        setEmployees(data)
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

  useEffect(() => {
    if (!newTaskId) {
      return
    }

    const frame =
      requestAnimationFrame(() => {
        const newTask =
          document.getElementById(
            `task-${newTaskId}`
          )

        if (newTask) {
          newTask.scrollIntoView({
            behavior: "smooth",
            block: "center",
          })
        }

        setNewTaskId(null)
      })

    return () =>
      cancelAnimationFrame(frame)
  }, [newTaskId])

  const resetForm = () => {
    setFormData({
      ...emptyTaskForm,
    })

    setEditingTask(null)
    setFormError("")
  }

  const openTaskForm = () => {
    resetForm()
    setShowForm(true)

    requestAnimationFrame(() => {
      taskFormRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    })
  }

  const updateFormField = <
    K extends keyof TaskFormData
  >(
    field: K,
    value: TaskFormData[K]
  ) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }))

    setFormError("")
  }

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault()

    if (!formData.title.trim()) {
      setFormError(
        "Task title is required."
      )
      return
    }

    if (!formData.description.trim()) {
      setFormError(
        "Task description is required."
      )
      return
    }

    if (!formData.status) {
      setFormError(
        "Task status is required."
      )
      return
    }

    if (!formData.priority) {
      setFormError(
        "Task priority is required."
      )
      return
    }

    if (!formData.dueDate) {
      setFormError(
        "Due date is required."
      )
      return
    }

    if (
      isAdmin &&
      !formData.assignedTo
    ) {
      setFormError(
        "Please assign the task to an employee."
      )
      return
    }

    if (
      isAdmin &&
      !formData.projectId
    ) {
      setFormError(
        "Project ID is required."
      )
      return
    }

    if (
      !isAdmin &&
      editingTask !== null
    ) {
      const currentTask =
        taskList.find(
          (task) =>
            task.id === editingTask
        )

      if (!currentTask) {
        return
      }

      try {
        const updateData = {
          status: formData.status,
        }

        const updatedTask =
          (await updateTask(
            editingTask,
            updateData as Parameters<
              typeof updateTask
            >[1]
          )) as TaskApiRecord

        const formattedTask =
          {
            id:
              updatedTask._id,
            title:
              updatedTask.title ??
              currentTask.title,
            description:
              updatedTask.description ??
              currentTask.description,
            status:
              updatedTask.status ??
              formData.status,
            priority:
              updatedTask.priority ??
              currentTask.priority,
            assignedTo:
              typeof updatedTask.assignedTo ===
              "object"
                ? updatedTask.assignedTo._id
                : updatedTask.assignedTo ??
                  currentTask.assignedTo,
            projectId:
              typeof updatedTask.projectId ===
              "object"
                ? updatedTask.projectId._id
                : updatedTask.projectId ??
                  currentTask.projectId,
            dueDate:
              updatedTask.dueDate ??
              currentTask.dueDate,
          } as Task

        setTaskList(
          (currentTasks) =>
            currentTasks.map(
              (task) =>
                task.id ===
                editingTask
                  ? formattedTask
                  : task
            )
        )

        showToast(
          "Task status updated successfully",
          "success"
        )

        resetForm()
        setShowForm(false)
      } catch (error) {
        console.error(
          "Update task error:",
          error
        )

        showToast(
          "Failed to update task",
          "error"
        )
      }

      return
    }

    if (!isAdmin) {
      return
    }

    const taskData = {
      title:
        formData.title.trim(),
      description:
        formData.description.trim(),
      status:
        formData.status,
      priority:
        formData.priority,
      assignedTo:
        formData.assignedTo,
      projectId:
        formData.projectId,
      dueDate:
        formData.dueDate,
    }

    if (editingTask !== null) {
      try {
        const updatedTask =
          (await updateTask(
            editingTask,
            taskData as Parameters<
              typeof updateTask
            >[1]
          )) as TaskApiRecord

        if (!updatedTask._id) {
          throw new Error(
            "MongoDB did not return the updated task."
          )
        }

        const formattedTask =
          {
            id:
              updatedTask._id,
            title:
              updatedTask.title ?? "",
            description:
              updatedTask.description ??
              "",
            status:
              updatedTask.status ??
              "Pending",
            priority:
              updatedTask.priority ??
              "Medium",
            assignedTo:
              typeof updatedTask.assignedTo ===
              "object"
                ? updatedTask.assignedTo._id
                : updatedTask.assignedTo ??
                  "",
            projectId:
              typeof updatedTask.projectId ===
              "object"
                ? updatedTask.projectId._id
                : updatedTask.projectId ??
                  "",
            dueDate:
              updatedTask.dueDate ??
              "",
          } as Task

        setTaskList(
          (currentTasks) =>
            currentTasks.map(
              (task) =>
                task.id ===
                editingTask
                  ? formattedTask
                  : task
            )
        )

        showToast(
          "Task updated successfully",
          "success"
        )

        resetForm()
        setShowForm(false)
      } catch (error) {
        console.error(
          "Update task error:",
          error
        )

        showToast(
          "Failed to update task",
          "error"
        )
      }

      return
    }

    try {
      const newTask =
        (await createTask(
          taskData as Parameters<
            typeof createTask
          >[0]
        )) as TaskApiRecord

      if (!newTask._id) {
        throw new Error(
          "MongoDB did not return the created task."
        )
      }

      const formattedTask =
        {
          id: newTask._id,
          title:
            newTask.title ?? "",
          description:
            newTask.description ??
            "",
          status:
            newTask.status ??
            "Pending",
          priority:
            newTask.priority ??
            "Medium",
          assignedTo:
            typeof newTask.assignedTo ===
            "object"
              ? newTask.assignedTo._id
              : newTask.assignedTo ??
                "",
          projectId:
            typeof newTask.projectId ===
            "object"
              ? newTask.projectId._id
              : newTask.projectId ??
                "",
          dueDate:
            newTask.dueDate ?? "",
        } as Task

      setTaskList(
        (currentTasks) => [
          ...currentTasks,
          formattedTask,
        ]
      )

      setNewTaskId(
        formattedTask.id
      )

      showToast(
        "Task added successfully",
        "success"
      )

      resetForm()
      setShowForm(false)
    } catch (error) {
      console.error(
        "Create task error:",
        error
      )

      showToast(
        "Failed to add task",
        "error"
      )
    }
  }

  const handleEdit = (
    id: string
  ) => {
    const taskToEdit =
      taskList.find(
        (task) =>
          task.id === id
      )

    if (!taskToEdit) {
      return
    }

    setEditingTask(id)

    setFormData({
      title:
        String(
          taskToEdit.title ?? ""
        ),
      description:
        String(
          taskToEdit.description ??
            ""
        ),
      status:
        taskToEdit.status ??
        "Pending",
      priority:
        taskToEdit.priority ??
        "Medium",
      assignedTo:
        String(
          taskToEdit.assignedTo ??
            ""
        ),
      projectId:
        String(
          taskToEdit.projectId ??
            ""
        ),
      dueDate:
        taskToEdit.dueDate ?? "",
    })

    setFormError("")
    setShowForm(true)

    requestAnimationFrame(() => {
      taskFormRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    })
  }

  const handleDelete = (
    id: string
  ) => {
    if (!isAdmin) {
      return
    }

    setTaskToDelete(id)
  }

  const confirmDelete = async () => {
    if (
      !isAdmin ||
      taskToDelete === null
    ) {
      return
    }

    const task =
      taskList.find(
        (item) =>
          item.id ===
          taskToDelete
      )

    if (!task) {
      setTaskToDelete(null)
      return
    }

    try {
      await deleteTask(
        taskToDelete
      )

      moveToTrash(
        "Task",
        task.id,
        task.title,
        `${task.priority} Priority`,
        task as unknown as Record<
          string,
          unknown
        >
      )

      setTaskList(
        (currentTasks) =>
          currentTasks.filter(
            (item) =>
              item.id !==
              taskToDelete
          )
      )

      setTaskToDelete(null)

      showToast(
        "Task moved to Trash",
        "success"
      )
    } catch (error) {
      console.error(
        "Delete task error:",
        error
      )

      showToast(
        "Failed to delete task",
        "error"
      )
    }
  }

  const handleCancelForm = () => {
    resetForm()
    setShowForm(false)
  }

  const filteredTasks =
    [...taskList]
      .filter((task) => {
        const searchValue =
          search
            .toLowerCase()
            .trim()

        const title =
          String(
            task.title ?? ""
          ).toLowerCase()

        const description =
          String(
            task.description ??
              ""
          ).toLowerCase()

        const matchesSearch =
          title.includes(
            searchValue
          ) ||
          description.includes(
            searchValue
          )

        const matchesStatus =
          statusFilter ===
            "All" ||
          task.status ===
            statusFilter

        const matchesPriority =
          priorityFilter ===
            "All" ||
          task.priority ===
            priorityFilter

        return (
          matchesSearch &&
          matchesStatus &&
          matchesPriority
        )
      })
      .sort((a, b) => {
        switch (sortOption) {
          case "title-asc":
            return a.title.localeCompare(
              b.title
            )

          case "title-desc":
            return b.title.localeCompare(
              a.title
            )

          case "date-newest":
            return (
              new Date(
                b.dueDate
              ).getTime() -
              new Date(
                a.dueDate
              ).getTime()
            )

          case "date-oldest":
            return (
              new Date(
                a.dueDate
              ).getTime() -
              new Date(
                b.dueDate
              ).getTime()
            )

          case "priority-high": {
            const priorityOrder = {
              High: 1,
              Medium: 2,
              Low: 3,
            }

            return (
              priorityOrder[
                a.priority
              ] -
              priorityOrder[
                b.priority
              ]
            )
          }

          default:
            return 0
        }
      })

  const totalTasks =
    taskList.length

  const completedTasks =
    taskList.filter(
      (task) =>
        task.status ===
        "Completed"
    ).length

  const inProgressTasks =
    taskList.filter(
      (task) =>
        task.status ===
        "In Progress"
    ).length

 

  const highPriorityTasks =
    taskList.filter(
      (task) =>
        task.priority ===
        "High"
    ).length

  const completedPercentage =
    totalTasks > 0
      ? Math.round(
          (completedTasks /
            totalTasks) *
            100
        )
      : 0

  return (
    <main className="tasks-page">
      <section className="tasks-hero">
        <div className="tasks-hero-content">
          <div className="tasks-eyebrow">
            <span className="tasks-live-dot" />
            NEXORA TASK CENTER
          </div>

          <div className="tasks-title-row">
            <div className="tasks-title-icon">
              <ClipboardList
                size={31}
                strokeWidth={2.2}
              />
            </div>

            <div className="tasks-title-content">
              <h1>Tasks</h1>

              <p>
                {isAdmin
                  ? "Create, assign and manage company tasks."
                  : "View and manage the tasks assigned to you."}
              </p>
            </div>
          </div>
        </div>

        {isAdmin && (
          <div className="tasks-hero-right">
            <button
              type="button"
              className="tasks-add-btn"
              onClick={() => {
                if (showForm) {
                  handleCancelForm()
                } else {
                  openTaskForm()
                }
              }}
            >
              <Plus size={19} />

              {showForm
                ? "Close Form"
                : "Add Task"}
            </button>
          </div>
        )}
      </section>

      <section className="tasks-stats">
        <article className="task-stat-card">
          <div className="task-stat-icon">
            <ClipboardList size={21} />
          </div>

          <div className="task-stat-content">
            <span>Total Tasks</span>

            <strong>
              {totalTasks}
            </strong>

            <small>
              <Activity size={12} />
              Complete task inventory
            </small>
          </div>
        </article>

        <article className="task-stat-card">
          <div className="task-stat-icon">
            <CircleCheck size={21} />
          </div>

          <div className="task-stat-content">
            <span>Completed</span>

            <strong>
              {completedTasks}
            </strong>

            <small>
              <CircleCheck size={12} />
              {completedPercentage}%
              completed
            </small>
          </div>
        </article>

        <article className="task-stat-card">
          <div className="task-stat-icon">
            <Activity size={21} />
          </div>

          <div className="task-stat-content">
            <span>In Progress</span>

            <strong>
              {inProgressTasks}
            </strong>

            <small>
              <Activity size={12} />
              Currently active
            </small>
          </div>
        </article>

        <article className="task-stat-card">
          <div className="task-stat-icon">
            <Flag size={21} />
          </div>

          <div className="task-stat-content">
            <span>High Priority</span>

            <strong>
              {highPriorityTasks}
            </strong>

            <small>
              <Clock3 size={12} />
              Requires attention
            </small>
          </div>
        </article>
      </section>

      {isAdmin && showForm && (
        <section className="tasks-form-card">
          <div className="tasks-form-header">
            <div className="tasks-form-heading">
              <div className="tasks-form-icon">
                {editingTask !==
                null ? (
                  <Pencil size={20} />
                ) : (
                  <Plus size={20} />
                )}
              </div>

              <div>
                <span>
                  {editingTask !==
                  null
                    ? "TASK EDITOR"
                    : "TASK CREATOR"}
                </span>

                <h2>
                  {editingTask !==
                  null
                    ? "Edit Task"
                    : "Add New Task"}
                </h2>
              </div>
            </div>
          </div>

          <form
            ref={taskFormRef}
            onSubmit={handleSubmit}
          >
            <div className="tasks-field">
              <label>
                Task Title
              </label>

              <div className="tasks-input-wrapper">
                <ClipboardList size={17} />

                <input
                  type="text"
                  placeholder="Enter task title"
                  value={formData.title}
                  required
                  onChange={(event) =>
                    updateFormField(
                      "title",
                      event.target.value
                    )
                  }
                />
              </div>
            </div>

            <div className="tasks-field">
              <label>
                Description
              </label>

              <div className="tasks-input-wrapper">
                <FileText size={17} />

                <textarea
                  placeholder="Enter task description"
                  value={
                    formData.description
                  }
                  required
                  onChange={(event) =>
                    updateFormField(
                      "description",
                      event.target.value
                    )
                  }
                />
              </div>
            </div>

            <div className="tasks-field">
              <label>
                Assigned Employee
              </label>

              <div className="tasks-input-wrapper">
                <Users size={17} />

                <select
                  value={
                    formData.assignedTo
                  }
                  required
                  onChange={(event) =>
                    updateFormField(
                      "assignedTo",
                      event.target.value
                    )
                  }
                >
                  <option value="">
                    Select employee
                  </option>

                  {employees.map(
                    (employee) => (
                      <option
                        key={
                          employee._id
                        }
                        value={
                          employee._id
                        }
                      >
                        {employee.firstName ??
                          ""}{" "}
                        {employee.lastName ??
                          ""}
                      </option>
                    )
                  )}
                </select>
              </div>
            </div>

            <div className="tasks-field">
              <label>
                Project ID
              </label>

              <div className="tasks-input-wrapper">
                <FolderKanban size={17} />

                <input
                  type="text"
                  placeholder="Enter project ID"
                  value={
                    formData.projectId
                  }
                  required
                  onChange={(event) =>
                    updateFormField(
                      "projectId",
                      event.target.value
                    )
                  }
                />
              </div>
            </div>

            <div className="tasks-field">
              <label>Status</label>

              <div className="tasks-input-wrapper">
                <Activity size={17} />

                <select
                  value={
                    formData.status
                  }
                  required
                  onChange={(event) =>
                    updateFormField(
                      "status",
                      event.target.value as Task["status"]
                    )
                  }
                >
                  <option value="Pending">
                    Pending
                  </option>

                  <option value="In Progress">
                    In Progress
                  </option>

                  <option value="Completed">
                    Completed
                  </option>
                </select>
              </div>
            </div>

            <div className="tasks-field">
              <label>Priority</label>

              <div className="tasks-input-wrapper">
                <Flag size={17} />

                <select
                  value={
                    formData.priority
                  }
                  required
                  onChange={(event) =>
                    updateFormField(
                      "priority",
                      event.target.value as Task["priority"]
                    )
                  }
                >
                  <option value="Low">
                    Low
                  </option>

                  <option value="Medium">
                    Medium
                  </option>

                  <option value="High">
                    High
                  </option>
                </select>
              </div>
            </div>

            <div className="tasks-field">
              <label>Due Date</label>

              <div className="tasks-input-wrapper">
                <Clock3 size={17} />

                <input
                  type="date"
                  value={
                    formData.dueDate
                  }
                  required
                  onChange={(event) =>
                    updateFormField(
                      "dueDate",
                      event.target.value
                    )
                  }
                />
              </div>
            </div>

            {formError && (
              <div className="tasks-form-error">
                <Clock3 size={16} />

                <span>
                  {formError}
                </span>
              </div>
            )}

            <div className="tasks-form-actions">
              <button
                type="submit"
                className="tasks-submit-btn"
              >
                {editingTask !==
                null ? (
                  <>
                    <Pencil size={17} />
                    Update Task
                  </>
                ) : (
                  <>
                    <Plus size={17} />
                    Add Task
                  </>
                )}
              </button>

              <button
                type="button"
                className="tasks-cancel-btn"
                onClick={
                  handleCancelForm
                }
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      )}

      {!isAdmin && showForm && (
        <section className="tasks-form-card">
          <div className="tasks-form-header">
            <div className="tasks-form-heading">
              <div className="tasks-form-icon">
                <Pencil size={20} />
              </div>

              <div>
                <span>
                  TASK UPDATE
                </span>

                <h2>
                  Update Task Status
                </h2>
              </div>
            </div>
          </div>

          <form
            ref={taskFormRef}
            onSubmit={handleSubmit}
          >
            <div className="tasks-field">
              <label>Task</label>

              <div className="tasks-input-wrapper">
                <ClipboardList size={17} />

                <input
                  type="text"
                  value={
                    formData.title
                  }
                  disabled
                />
              </div>
            </div>

            <div className="tasks-field">
              <label>Status</label>

              <div className="tasks-input-wrapper">
                <Activity size={17} />

                <select
                  value={
                    formData.status
                  }
                  required
                  onChange={(event) =>
                    updateFormField(
                      "status",
                      event.target.value as Task["status"]
                    )
                  }
                >
                  <option value="Pending">
                    Pending
                  </option>

                  <option value="In Progress">
                    In Progress
                  </option>

                  <option value="Completed">
                    Completed
                  </option>
                </select>
              </div>
            </div>

            {formError && (
              <div className="tasks-form-error">
                <Clock3 size={16} />

                <span>
                  {formError}
                </span>
              </div>
            )}

            <div className="tasks-form-actions">
              <button
                type="submit"
                className="tasks-submit-btn"
              >
                <Pencil size={17} />
                Update Status
              </button>

              <button
                type="button"
                className="tasks-cancel-btn"
                onClick={
                  handleCancelForm
                }
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      )}

      <section className="tasks-controls">
        <div className="tasks-controls-header">
          <div>
            <span className="tasks-controls-eyebrow">
              TASK EXPLORER
            </span>

            <h2>
              {isAdmin
                ? "Browse All Tasks"
                : "Your Assigned Tasks"}
            </h2>
          </div>

          <div className="tasks-result-count">
            <ClipboardList size={15} />

            {filteredTasks.length}{" "}
            result
            {filteredTasks.length !==
            1
              ? "s"
              : ""}
          </div>
        </div>

        <div className="tasks-controls-row">
          <div className="tasks-search">
            <Search size={18} />

            <input
              type="text"
              placeholder="Search by task title or description..."
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
            />
          </div>

          <div className="tasks-filter">
            <Activity size={16} />

            <select
              value={
                statusFilter
              }
              onChange={(event) =>
                setStatusFilter(
                  event.target.value
                )
              }
            >
              <option value="All">
                All Statuses
              </option>

              <option value="Pending">
                Pending
              </option>

              <option value="In Progress">
                In Progress
              </option>

              <option value="Completed">
                Completed
              </option>
            </select>
          </div>

          <div className="tasks-filter">
            <Flag size={16} />

            <select
              value={
                priorityFilter
              }
              onChange={(event) =>
                setPriorityFilter(
                  event.target.value
                )
              }
            >
              <option value="All">
                All Priorities
              </option>

              <option value="Low">
                Low
              </option>

              <option value="Medium">
                Medium
              </option>

              <option value="High">
                High
              </option>
            </select>
          </div>

          <div className="tasks-filter">
            <ArrowUpDown size={16} />

            <select
              value={
                sortOption
              }
              onChange={(event) =>
                setSortOption(
                  event.target.value
                )
              }
            >
              <option value="title-asc">
                Title: A → Z
              </option>

              <option value="title-desc">
                Title: Z → A
              </option>

              <option value="date-newest">
                Due Date: Newest
              </option>

              <option value="date-oldest">
                Due Date: Oldest
              </option>

              <option value="priority-high">
                Priority: High → Low
              </option>
            </select>
          </div>
        </div>
      </section>

      <section className="tasks-grid">
        {filteredTasks.length > 0 ? (
          filteredTasks.map(
            (task) => (
              <div
                key={task.id}
                id={`task-${task.id}`}
              >
                <TaskCard
                  task={task}
                  onDelete={
                    isAdmin
                      ? handleDelete
                      : () => {}
                  }
                  onEdit={
                    handleEdit
                  }
                />
              </div>
            )
          )
        ) : (
          <div className="tasks-empty">
            <div className="tasks-empty-icon">
              <ClipboardList size={32} />
            </div>

            <h2>No Tasks Found</h2>

            <p>
              No tasks match your
              current search or
              filters.
            </p>

            <button
              type="button"
              onClick={() => {
                setSearch("")
                setStatusFilter(
                  "All"
                )
                setPriorityFilter(
                  "All"
                )
              }}
            >
              <Search size={16} />
              Clear Filters
            </button>
          </div>
        )}
      </section>

      {isAdmin &&
        taskToDelete !== null && (
          <Modal
            title="Delete Task"
            message="Are you sure you want to move this task to Trash? You can recover it later from the Trash page."
            onCancel={() =>
              setTaskToDelete(null)
            }
            onConfirm={
              confirmDelete
            }
          />
        )}
    </main>
  )
}