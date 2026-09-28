import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react"

import {
  Search,
  ClipboardList,
  Clock3,
  CircleCheck,
  Activity,
  CircleAlert,
  ListTodo,
  Plus,
  CalendarDays,
  FileText,
  Save,
  X,
  Flag,
} from "lucide-react"

import TaskCard from "../../components/TaskCard/TaskCard"
import Modal from "../../components/Modal/Modal"
import { useToast } from "../../context/ToastContext"
import { useTrash } from "../../context/TrashContext"
import type { Task } from "../../types/Task"

import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../../services/api/taskApi"

export default function Tasks() {
  const { showToast } = useToast()
  const { moveToTrash } = useTrash()

  // =========================================================
  // FORM CONTROLS
  // =========================================================

  const [showForm, setShowForm] = useState(false)

  const taskFormRef =
    useRef<HTMLFormElement | null>(null)

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [status, setStatus] =
    useState<Task["status"]>("Pending")
  const [priority, setPriority] =
    useState<Task["priority"]>("Medium")
  const [dueDate, setDueDate] = useState("")

  // =========================================================
  // TASK DATA
  // =========================================================

  const [taskList, setTaskList] =
    useState<Task[]>([])

  const [editingTask, setEditingTask] =
    useState<string | null>(null)

  const [newTaskId, setNewTaskId] =
    useState<string | null>(null)

  const [formError, setFormError] = useState("")

  // =========================================================
  // SEARCH / FILTERS
  // =========================================================

  const [search, setSearch] = useState("")

  const [statusFilter, setStatusFilter] =
    useState("All")

  const [priorityFilter, setPriorityFilter] =
    useState("All")

  const [sortBy, setSortBy] =
    useState("None")

  // =========================================================
  // DELETE
  // =========================================================

  const [taskToDelete, setTaskToDelete] =
    useState<string | null>(null)

  // =========================================================
  // AUTO SCROLL TO FORM
  // =========================================================

  useEffect(() => {
    if (!showForm) {
      return
    }

    requestAnimationFrame(() => {
      taskFormRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    })
  }, [showForm])

  // =========================================================
  // AUTO SCROLL TO NEW TASK
  // =========================================================

  useEffect(() => {
    if (!newTaskId) {
      return
    }

    const frame = requestAnimationFrame(() => {
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

  // =========================================================
  // FETCH TASKS
  // =========================================================

  useEffect(() => {
    async function fetchTasks() {
      try {
        console.log("FETCH TASKS STARTED")

        const data = await getTasks()

        const formattedTasks: Task[] =
          data.map((task: any) => ({
            id: task._id,
            title: task.title ?? "",
            description: task.description ?? "",
            status: task.status ?? "Pending",
            priority: task.priority ?? "Medium",
            assignedTo: task.assignedTo ?? 1,
            projectId: task.projectId ?? 1,
            dueDate: task.dueDate ?? "",
          }))

        setTaskList(formattedTasks)

        console.log(
          "TASKS LOADED:",
          formattedTasks
        )
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

  // =========================================================
  // TASK STATISTICS
  // =========================================================

  const totalTasks = taskList.length

  const pendingTasks = taskList.filter(
    (task) => task.status === "Pending"
  ).length

  const inProgressTasks = taskList.filter(
    (task) => task.status === "In Progress"
  ).length

  const completedTasks = taskList.filter(
    (task) => task.status === "Completed"
  ).length

  const highPriorityTasks = taskList.filter(
    (task) => task.priority === "High"
  ).length

  const completionPercentage =
    totalTasks > 0
      ? Math.round(
          (completedTasks / totalTasks) * 100
        )
      : 0

  const pendingPercentage =
    totalTasks > 0
      ? Math.round(
          (pendingTasks / totalTasks) * 100
        )
      : 0

  const inProgressPercentage =
    totalTasks > 0
      ? Math.round(
          (inProgressTasks / totalTasks) * 100
        )
      : 0

  const highPriorityPercentage =
    totalTasks > 0
      ? Math.round(
          (highPriorityTasks / totalTasks) * 100
        )
      : 0

  // =========================================================
  // FORM RESET
  // =========================================================

  function resetForm() {
    setTitle("")
    setDescription("")
    setStatus("Pending")
    setPriority("Medium")
    setDueDate("")
    setEditingTask(null)
    setFormError("")
    setShowForm(false)
  }

  // =========================================================
  // FORM VALIDATION
  // =========================================================

  function validateForm() {
    if (!title.trim()) {
      return "Task title is required."
    }

    if (!description.trim()) {
      return "Task description is required."
    }

    if (!dueDate) {
      return "Due date is required."
    }

    if (!status) {
      return "Task status is required."
    }

    if (!priority) {
      return "Task priority is required."
    }

    return ""
  }

  // =========================================================
  // CREATE / UPDATE TASK
  // =========================================================

  async function handleCreateTask(
    e: FormEvent
  ) {
    e.preventDefault()

    const error = validateForm()

    if (error) {
      setFormError(error)
      return
    }

    try {
      // =====================================================
      // UPDATE TASK
      // =====================================================

      if (editingTask !== null) {
        const existingTask =
          taskList.find(
            (task) =>
              task.id === editingTask
          )

        const taskData = {
          title: title.trim(),
          description: description.trim(),
          status,
          priority,
          assignedTo:
            existingTask?.assignedTo ?? 1,
          projectId:
            existingTask?.projectId ?? 1,
          dueDate,
        }

        const updatedTask =
          await updateTask(
            editingTask,
            taskData
          )

        const formattedTask: Task = {
          id: updatedTask._id,
          title: updatedTask.title ?? "",
          description:
            updatedTask.description ?? "",
          status:
            updatedTask.status ?? "Pending",
          priority:
            updatedTask.priority ?? "Medium",
          assignedTo:
            updatedTask.assignedTo ?? 1,
          projectId:
            updatedTask.projectId ?? 1,
          dueDate:
            updatedTask.dueDate ?? "",
        }

        setTaskList((currentTasks) =>
          currentTasks.map((task) =>
            task.id === editingTask
              ? formattedTask
              : task
          )
        )

        showToast(
          "Task updated successfully",
          "success"
        )
      }

      // =====================================================
      // CREATE TASK
      // =====================================================

      else {
        const newTaskData = {
          title: title.trim(),
          description: description.trim(),
          status,
          priority,
          assignedTo: 1,
          projectId: 1,
          dueDate,
        }

        const createdTask =
          await createTask(newTaskData)

        const formattedTask: Task = {
          id: createdTask._id,
          title: createdTask.title ?? "",
          description:
            createdTask.description ?? "",
          status:
            createdTask.status ?? "Pending",
          priority:
            createdTask.priority ?? "Medium",
          assignedTo:
            createdTask.assignedTo ?? 1,
          projectId:
            createdTask.projectId ?? 1,
          dueDate:
            createdTask.dueDate ?? "",
        }

        setTaskList((currentTasks) => [
          ...currentTasks,
          formattedTask,
        ])

        setNewTaskId(
          formattedTask.id
        )

        showToast(
          "Task added successfully",
          "success"
        )
      }

      resetForm()
    } catch (error) {
      console.error(
        "Create/update task error:",
        error
      )

      showToast(
        editingTask !== null
          ? "Failed to update task"
          : "Failed to add task",
        "error"
      )
    }
  }

  // =========================================================
  // DELETE TASK
  // =========================================================

  function handleDeleteTask(id: string) {
    setTaskToDelete(id)
  }

  async function confirmDeleteTask() {
    if (taskToDelete === null) {
      return
    }

    const task = taskList.find(
      (currentTask) =>
        currentTask.id === taskToDelete
    )

    if (!task) {
      setTaskToDelete(null)
      return
    }

    try {
      await deleteTask(taskToDelete)

      moveToTrash(
        "Task",
        task.id,
        task.title,
        `${task.priority} Priority • ${task.status}`,
        {
          ...task,
        }
      )

      setTaskList((currentTasks) =>
        currentTasks.filter(
          (currentTask) =>
            currentTask.id !== taskToDelete
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

      setTaskToDelete(null)
    }
  }

  // =========================================================
  // EDIT TASK
  // =========================================================

  function handleEditTask(id: string) {
    const task = taskList.find(
      (task) => task.id === id
    )

    if (!task) {
      return
    }

    setTitle(task.title)
    setDescription(task.description)
    setStatus(task.status)
    setPriority(task.priority)
    setDueDate(task.dueDate)

    setEditingTask(task.id)
    setFormError("")
    setShowForm(true)
  }

  // =========================================================
  // FILTER TASKS
  // =========================================================

  const filteredTasks = taskList.filter(
    (task) => {
      const taskTitle = String(
        task.title ?? ""
      ).toLowerCase()

      const matchesSearch =
        taskTitle.includes(
          search.toLowerCase().trim()
        )

      const matchesStatus =
        statusFilter === "All" ||
        task.status === statusFilter

      const matchesPriority =
        priorityFilter === "All" ||
        task.priority === priorityFilter

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPriority
      )
    }
  )

  // =========================================================
  // SORT TASKS
  // =========================================================

  const sortedTasks = [
    ...filteredTasks,
  ].sort((a, b) => {
    const dateA = new Date(
      a.dueDate ?? ""
    ).getTime()

    const dateB = new Date(
      b.dueDate ?? ""
    ).getTime()

    if (sortBy === "Newest") {
      return dateB - dateA
    }

    if (sortBy === "Oldest") {
      return dateA - dateB
    }

    return 0
  })

  return (
    <main className="tasks-page">

      {/* =====================================================
          PREMIUM PAGE HEADER
          ===================================================== */}

      <header className="tasks-header">

        <div className="tasks-header-main">

          <div className="tasks-title-content">

            <span className="tasks-eyebrow">
              WORKFLOW MANAGEMENT
            </span>

            <h1>
              <span className="tasks-title-icon">
                <ClipboardList size={28} />
              </span>

              Tasks
            </h1>

            <p>
              Plan, organize, and monitor your team&apos;s
              workload with a centralized task management
              workspace.
            </p>

          </div>

        </div>

        <div className="tasks-header-right">

          <div className="tasks-header-summary">

            <div className="tasks-summary-icon">
              <Activity size={17} />
            </div>

            <div>

              <span>
                Completion Rate
              </span>

              <strong>
                {completionPercentage}%
              </strong>

              <small>
                {completedTasks} of {totalTasks} completed
              </small>

            </div>

          </div>

          <button
            type="button"
            className="add-task-btn"
            onClick={() => {
              if (showForm) {
                resetForm()
              } else {
                setShowForm(true)
                setFormError("")
              }
            }}
          >

            {showForm ? (
              <>
                <X size={18} />
                <span>Close Form</span>
              </>
            ) : (
              <>
                <Plus size={18} />
                <span>Add Task</span>
              </>
            )}

          </button>

        </div>

      </header>

      {/* =====================================================
          TASK STATISTICS
          ===================================================== */}

      <section className="task-statistics">

        <div className="task-stat-card">

          <div className="task-stat-icon total">
            <ListTodo size={20} />
          </div>

          <div className="task-stat-content">

            <span>Total Tasks</span>

            <strong>
              {totalTasks}
            </strong>

            <small>
              Current workload
            </small>

          </div>

        </div>

        <div className="task-stat-card">

          <div className="task-stat-icon pending">
            <Clock3 size={20} />
          </div>

          <div className="task-stat-content">

            <span>Pending</span>

            <strong>
              {pendingTasks}
            </strong>

            <small>
              {pendingPercentage}% of all tasks
            </small>

          </div>

        </div>

        <div className="task-stat-card">

          <div className="task-stat-icon progress">
            <Activity size={20} />
          </div>

          <div className="task-stat-content">

            <span>In Progress</span>

            <strong>
              {inProgressTasks}
            </strong>

            <small>
              {inProgressPercentage}% active
            </small>

          </div>

        </div>

        <div className="task-stat-card">

          <div className="task-stat-icon completed">
            <CircleCheck size={20} />
          </div>

          <div className="task-stat-content">

            <span>Completed</span>

            <strong>
              {completedTasks}
            </strong>

            <small>
              {completionPercentage}% completion
            </small>

          </div>

        </div>

      </section>

      {/* =====================================================
          TASK PROGRESS OVERVIEW
          ===================================================== */}

      <section className="task-overview">

        <div className="task-overview-header">

          <div className="task-overview-title">

            <div className="task-overview-icon">
              <ClipboardList size={18} />
            </div>

            <div>

              <h2>
                Task Progress
              </h2>

              <p>
                Overall completion and workload distribution
              </p>

            </div>

          </div>

          <strong>
            {completionPercentage}% Completed
          </strong>

        </div>

        <div className="task-progress-track">

          <div
            className="task-progress-bar"
            style={{
              width: `${completionPercentage}%`,
            }}
          />

        </div>

        <div className="task-overview-footer">

          <span>
            <Clock3 size={14} />
            {pendingTasks} Pending ({pendingPercentage}%)
          </span>

          <span>
            <Activity size={14} />
            {inProgressTasks} In Progress ({inProgressPercentage}%)
          </span>

          <span>
            <CircleCheck size={14} />
            {completedTasks} Completed ({completionPercentage}%)
          </span>

          <span>
            <CircleAlert size={14} />
            {highPriorityTasks} High Priority ({highPriorityPercentage}%)
          </span>

        </div>

      </section>

      {/* =====================================================
          SEARCH / FILTER TOOLBAR
          ===================================================== */}

      <section className="task-search-container">

        <div className="task-search-box">

          <Search
            className="task-search-icon"
            size={19}
          />

          <input
            type="text"
            className="task-search"
            placeholder="Search tasks by title..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>

        <div className="task-filter-group">

          <label htmlFor="task-status-filter">
            Status
          </label>

          <select
            id="task-status-filter"
            className="task-status-filter"
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
          >

            <option value="All">
              All Status
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

        <div className="task-filter-group">

          <label htmlFor="task-priority-filter">
            Priority
          </label>

          <select
            id="task-priority-filter"
            className="task-priority-filter"
            value={priorityFilter}
            onChange={(e) =>
              setPriorityFilter(e.target.value)
            }
          >

            <option value="All">
              All Priority
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

        <div className="task-filter-group">

          <label htmlFor="task-sort">
            Sort By
          </label>

          <select
            id="task-sort"
            className="task-sort"
            value={sortBy}
            onChange={(e) =>
              setSortBy(e.target.value)
            }
          >

            <option value="None">
              No Sort
            </option>

            <option value="Newest">
              Newest Due Date
            </option>

            <option value="Oldest">
              Oldest Due Date
            </option>

          </select>

        </div>

      </section>

      {/* =====================================================
          RESULTS INFO
          ===================================================== */}

      <div className="task-results-info">

        <div className="task-results-left">

          <span className="task-results-icon">
            <ListTodo size={15} />
          </span>

          <span>
            Showing{" "}
            <strong>
              {sortedTasks.length}
            </strong>{" "}
            {sortedTasks.length === 1
              ? "task"
              : "tasks"}
          </span>

        </div>

      </div>

      {/* =====================================================
          ADD / EDIT TASK FORM
          ===================================================== */}

      {showForm && (
        <form
          ref={taskFormRef}
          className="task-form"
          onSubmit={handleCreateTask}
        >

          <div className="task-form-header">

            <div className="task-form-title">

              <div className="task-form-icon">

                {editingTask !== null ? (
                  <Save size={19} />
                ) : (
                  <Plus size={19} />
                )}

              </div>

              <div>

                <span className="task-form-eyebrow">
                  TASK RECORD
                </span>

                <h2>
                  {editingTask !== null
                    ? "Edit Task"
                    : "Add New Task"}
                </h2>

                <p>
                  Enter the task information below.
                </p>

              </div>

            </div>

          </div>

          {formError && (
            <p className="form-error">
              {formError}
            </p>
          )}

          <div className="task-form-grid">

            <div className="task-form-field">

              <label htmlFor="task-title">
                <ClipboardList size={15} />
                Task Title
              </label>

              <input
                id="task-title"
                type="text"
                placeholder="Enter task title"
                value={title}
                required
                onChange={(e) => {
                  setTitle(e.target.value)
                  setFormError("")
                }}
              />

            </div>

            <div className="task-form-field">

              <label htmlFor="task-due-date">
                <CalendarDays size={15} />
                Due Date
              </label>

              <input
                id="task-due-date"
                type="date"
                value={dueDate}
                required
                onChange={(e) => {
                  setDueDate(e.target.value)
                  setFormError("")
                }}
              />

            </div>

            <div className="task-form-field task-description-field">

              <label htmlFor="task-description">
                <FileText size={15} />
                Description
              </label>

              <textarea
                id="task-description"
                placeholder="Enter task description"
                value={description}
                required
                onChange={(e) => {
                  setDescription(e.target.value)
                  setFormError("")
                }}
              />

            </div>

            <div className="task-form-field">

              <label htmlFor="task-status">
                <Activity size={15} />
                Status
              </label>

              <select
                id="task-status"
                value={status}
                required
                onChange={(e) => {
                  setStatus(
                    e.target.value as Task["status"]
                  )
                  setFormError("")
                }}
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

            <div className="task-form-field">

              <label htmlFor="task-priority">
                <Flag size={15} />
                Priority
              </label>

              <select
                id="task-priority"
                value={priority}
                required
                onChange={(e) => {
                  setPriority(
                    e.target.value as Task["priority"]
                  )
                  setFormError("")
                }}
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

          <div className="task-form-actions">

            <button
              type="button"
              className="task-cancel-btn"
              onClick={resetForm}
            >
              <X size={17} />
              Cancel
            </button>

            <button
              type="submit"
              className="create-task-btn"
            >
              <Save size={17} />

              {editingTask !== null
                ? "Update Task"
                : "Create Task"}

            </button>

          </div>

        </form>
      )}

      {/* =====================================================
          TASK CARDS
          ===================================================== */}

      <section className="tasks-grid">

        {sortedTasks.length > 0 ? (
          sortedTasks.map((task) => (
            <div
              key={task.id}
              id={`task-${task.id}`}
            >
              <TaskCard
                task={task}
                onDelete={handleDeleteTask}
                onEdit={handleEditTask}
              />
            </div>
          ))
        ) : (
          <div className="task-empty-state">

            <div className="task-empty-icon">
              <Search size={26} />
            </div>

            <h2>
              No Tasks Found
            </h2>

            <p>
              No tasks match your current
              search or filters.
            </p>

            <button
              type="button"
              className="clear-task-filters-btn"
              onClick={() => {
                setSearch("")
                setStatusFilter("All")
                setPriorityFilter("All")
                setSortBy("None")
              }}
            >
              Clear Filters
            </button>

          </div>
        )}

      </section>

      {/* =====================================================
          DELETE CONFIRMATION
          ===================================================== */}

      {taskToDelete !== null && (
        <Modal
          title="Delete Task"
          message="Are you sure you want to move this task to Trash? You can recover it later from the Trash page."
          onCancel={() =>
            setTaskToDelete(null)
          }
          onConfirm={confirmDeleteTask}
        />
      )}

    </main>
  )
}