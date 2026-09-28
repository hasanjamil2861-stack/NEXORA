import {
  Building2,
  CircleCheck,
  CircleX,
  Pencil,
  Trash2,
  UserRound,
  Users,
} from "lucide-react"

import type { Department } from "../../types/Department"

type DepartmentCardProps = {
  department: Department
  onDelete: (id: string) => void
  onEdit: (id: string) => void
}

export default function DepartmentCard({
  department,
  onDelete,
  onEdit,
}: DepartmentCardProps) {
  // Determine department status
  const isActive = department.status === "Active"

  return (
    <article className="department-card">
      {/* Department header */}
      <div className="department-card-header">
        <div className="department-card-title">
          <div className="department-card-icon">
            <Building2 size={20} />
          </div>

          <div>
            <h2>{department.name}</h2>

            <span>Department</span>
          </div>
        </div>

        {/* Department status */}
        <div
          className={`department-status-badge ${
            isActive ? "active" : "inactive"
          }`}
        >
          {isActive ? (
            <CircleCheck size={13} />
          ) : (
            <CircleX size={13} />
          )}

          {department.status}
        </div>
      </div>

      {/* Department description */}
      <div className="department-description">
        <DepartmentDescriptionIcon />

        <p>{department.description}</p>
      </div>

      {/* Department information */}
      <div className="department-info-list">
        <div className="department-info-item">
          <div className="department-info-icon">
            <UserRound size={16} />
          </div>

          <div>
            <span>Manager</span>

            <strong>
              {department.manager}
            </strong>
          </div>
        </div>

        <div className="department-info-item">
          <div className="department-info-icon">
            <Users size={16} />
          </div>

          <div>
            <span>Employees</span>

            <strong>
              {department.employeeCount}
            </strong>
          </div>
        </div>
      </div>

      {/* Edit and delete actions */}
      <div className="department-card-actions">
        <button
          type="button"
          className="department-edit-btn"
          onClick={() => onEdit(department.id)}
        >
          <Pencil size={15} />
          Edit
        </button>

        <button
          type="button"
          className="department-delete-btn"
          onClick={() => onDelete(department.id)}
        >
          <Trash2 size={15} />
          Delete
        </button>
      </div>
    </article>
  )
}

function DepartmentDescriptionIcon() {
  return (
    <div className="department-description-icon">
      <Building2 size={16} />
    </div>
  )
}