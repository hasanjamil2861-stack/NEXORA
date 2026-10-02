import type { Task } from "../../types/Task"

import {
  ClipboardList,
  CalendarDays,
  CircleCheck,
  Clock3,
  Activity,
  Flag,
  Pencil,
  Trash2,
} from "lucide-react"

import { useAuth } from "../../context/AuthContext"

type TaskCardProps = {
  task: Task
  onDelete: (id: string) => void
  onEdit: (id: string) => void
}

export default function TaskCard({
  task,
  onDelete,
  onEdit,
}: TaskCardProps) {
  const { user } = useAuth()

  const isAdmin =
    user?.role === "Admin"

  const isCompleted =
    task.status === "Completed"

  const isInProgress =
    task.status === "In Progress"

  const priority = String(
    task.priority ?? "Medium"
  )

  return (
    <article className="task-card">
      <div className="task-card-header">
        <div className="task-card-title">
          <div className="task-card-icon">
            <ClipboardList size={19} />
          </div>

          <div>
            <h2>
              {task.title ?? ""}
            </h2>

            <span>
              Task #{task.id}
            </span>
          </div>
        </div>

        <div
          className={`task-status-badge ${
            isCompleted
              ? "completed"
              : isInProgress
                ? "in-progress"
                : "pending"
          }`}
        >
          {isCompleted ? (
            <CircleCheck size={13} />
          ) : isInProgress ? (
            <Activity size={13} />
          ) : (
            <Clock3 size={13} />
          )}

          {task.status ?? "Pending"}
        </div>
      </div>

      <div className="task-description">
        <p>
          {task.description ?? ""}
        </p>
      </div>

      <div className="task-info-list">
        <div className="task-info-item">
          <div className="task-info-icon">
            <Flag size={15} />
          </div>

          <div>
            <span>
              Priority
            </span>

            <strong
              className={`task-priority-value ${priority.toLowerCase()}`}
            >
              {priority}
            </strong>
          </div>
        </div>

        <div className="task-info-item">
          <div className="task-info-icon">
            <CalendarDays size={15} />
          </div>

          <div>
            <span>
              Due Date
            </span>

            <strong>
              {task.dueDate ?? ""}
            </strong>
          </div>
        </div>
      </div>

      {isAdmin && (
        <div className="task-actions">
          <button
            type="button"
            className="task-edit-btn"
            onClick={() =>
              onEdit(task.id)
            }
          >
            <Pencil size={14} />
            Edit Task
          </button>

          <button
            type="button"
            className="task-delete-btn"
            onClick={() =>
              onDelete(task.id)
            }
          >
            <Trash2 size={14} />
            Delete
          </button>
        </div>
      )}
    </article>
  )
}