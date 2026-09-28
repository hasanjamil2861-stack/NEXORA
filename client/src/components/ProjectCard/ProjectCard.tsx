import {
  CalendarDays,
  CircleDollarSign,
  Pencil,
  Trash2,
  UserRound,
} from "lucide-react"

import type { Project } from "../../types/Project"

type ProjectCardProps = {
  project: Project
  onDelete: (id: string) => void
  onEdit: (id: string) => void
}

export default function ProjectCard({
  project,
  onDelete,
  onEdit,
}: ProjectCardProps) {
  // Convert project status into a UI progress value
  const progress =
    project.status === "Completed"
      ? 100
      : project.status === "In Progress"
        ? 60
        : project.status === "Cancelled"
          ? 0
          : 25

  return (
    <article className="project-card">
      {/* Project header and status */}
      <div className="project-card-top">
        <div className="project-card-icon">
          <CalendarDays size={21} />
        </div>

        <span
          className={`project-status status-${project.status
            .toLowerCase()
            .replace(/\s+/g, "-")}`}
        >
          {project.status}
        </span>
      </div>

      {/* Project title and description */}
      <div className="project-card-title">
        <h2>{project.name}</h2>

        <p>{project.description}</p>
      </div>

      {/* Project information */}
      <div className="project-details">
        <div className="project-detail-item">
          <div className="project-detail-icon">
            <UserRound size={16} />
          </div>

          <div>
            <span>Client</span>
            <strong>{project.client}</strong>
          </div>
        </div>

        <div className="project-detail-item">
          <div className="project-detail-icon">
            <UserRound size={16} />
          </div>

          <div>
            <span>Manager</span>
            <strong>{project.manager}</strong>
          </div>
        </div>

        <div className="project-detail-item">
          <div className="project-detail-icon">
            <CalendarDays size={16} />
          </div>

          <div>
            <span>Timeline</span>

            <strong>
              {project.startDate} → {project.endDate}
            </strong>
          </div>
        </div>

        <div className="project-detail-item">
          <div className="project-detail-icon budget-icon">
            <CircleDollarSign size={16} />
          </div>

          <div>
            <span>Budget</span>

            <strong>
              ${project.budget.toLocaleString()}
            </strong>
          </div>
        </div>
      </div>

      {/* Project progress */}
      <div className="project-progress-section">
        <div className="project-progress-header">
          <span>Project Progress</span>
          <strong>{progress}%</strong>
        </div>

        <div className="project-progress-track">
          <div
            className={`project-progress-bar progress-${project.status
              .toLowerCase()
              .replace(/\s+/g, "-")}`}
            style={{
              width: `${progress}%`,
            }}
          />
        </div>
      </div>

      {/* Edit and delete actions */}
      <div className="project-card-actions">
        <button
          type="button"
          className="project-edit-btn"
          onClick={() => onEdit(project.id)}
        >
          <Pencil size={16} />
          Edit
        </button>

        <button
          type="button"
          className="project-delete-btn"
          onClick={() => onDelete(project.id)}
        >
          <Trash2 size={16} />
          Delete
        </button>
      </div>
    </article>
  )
}
