import {
  BriefcaseBusiness,
  CalendarDays,
  CircleCheck,
  CircleX,
  Clock3,
  FileText,
  Pencil,
  Trash2,
  UserRound,
} from "lucide-react"

import type { LeaveRequest } from "../../types/LeaveRequest"

import { useAuth } from "../../context/AuthContext"

type LeaveRequestCardProps = {
  leaveRequest: LeaveRequest
  onDelete: (id: string) => void
  onEdit: (id: string) => void
}

export default function LeaveRequestCard({
  leaveRequest,
  onDelete,
  onEdit,
}: LeaveRequestCardProps) {
  const { user } = useAuth()

  const isAdmin =
    user?.role === "Admin"

  const isApproved =
    leaveRequest.status ===
    "Approved"

  const isRejected =
    leaveRequest.status ===
    "Rejected"

  const statusClass = isApproved
    ? "approved"
    : isRejected
      ? "rejected"
      : "pending"

  const employeeName =
    `${leaveRequest.employeeId.firstName} ${leaveRequest.employeeId.lastName}`

  return (
    <article className="leave-request-card">
      <div
        className={`leave-card-accent ${statusClass}`}
      />

      <div className="leave-card-top">
        <div className="leave-card-icon">
          <UserRound size={19} />
        </div>

        <div
          className={`leave-status ${statusClass}`}
        >
          {isApproved ? (
            <CircleCheck size={13} />
          ) : isRejected ? (
            <CircleX size={13} />
          ) : (
            <Clock3 size={13} />
          )}

          {leaveRequest.status}
        </div>
      </div>

      <div className="leave-card-title">
        <span>
          EMPLOYEE REQUEST
        </span>

        <h2>
          {employeeName}
        </h2>

        <small>
          Request #{leaveRequest.id}
        </small>
      </div>

      <div className="leave-type-box">
        <div className="leave-type-icon">
          <BriefcaseBusiness
            size={15}
          />
        </div>

        <div>
          <span>
            Leave Type
          </span>

          <strong>
            {leaveRequest.leaveType}
          </strong>
        </div>
      </div>

      <div className="leave-card-details">
        <div className="leave-detail-item">
          <div className="leave-detail-icon">
            <CalendarDays size={14} />
          </div>

          <div>
            <span>
              Start Date
            </span>

            <strong>
              {leaveRequest.startDate}
            </strong>
          </div>
        </div>

        <div className="leave-detail-item">
          <div className="leave-detail-icon">
            <CalendarDays size={14} />
          </div>

          <div>
            <span>
              End Date
            </span>

            <strong>
              {leaveRequest.endDate}
            </strong>
          </div>
        </div>
      </div>

      <div className="leave-reason-box">
        <div className="leave-reason-icon">
          <FileText size={14} />
        </div>

        <div>
          <span>
            Reason
          </span>

          <p>
            {leaveRequest.reason}
          </p>
        </div>
      </div>

      {isAdmin && (
        <div className="leave-card-actions">
          <button
            type="button"
            className="leave-edit-btn"
            onClick={() =>
              onEdit(
                leaveRequest.id
              )
            }
          >
            <Pencil size={14} />
            Edit
          </button>

          <button
            type="button"
            className="leave-delete-btn"
            onClick={() =>
              onDelete(
                leaveRequest.id
              )
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