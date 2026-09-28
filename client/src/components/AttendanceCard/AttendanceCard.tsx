import {
  AlertCircle,
  CalendarDays,
  CircleCheck,
  CircleX,
  Clock3,
  Trash2,
  UserRound,
} from "lucide-react"

import type { Attendance } from "../../types/Attendance"

type AttendanceCardProps = {
  attendance: Attendance
  onDelete: (id: string) => void
}

export default function AttendanceCard({
  attendance,
  onDelete,
}: AttendanceCardProps) {
  // Determine the current attendance status
  const isPresent = attendance.status === "Present"
  const isAbsent = attendance.status === "Absent"

  const statusClass = isPresent
    ? "present"
    : isAbsent
      ? "absent"
      : "late"

  return (
    <article className="attendance-card">
      {/* Status accent and card header */}
      <div
        className={`attendance-card-accent ${statusClass}`}
      />

      <div className="attendance-card-top">
        <div className="attendance-card-icon">
          <UserRound size={19} />
        </div>

        <div
          className={`attendance-status ${statusClass}`}
        >
          {isPresent ? (
            <CircleCheck size={13} />
          ) : isAbsent ? (
            <CircleX size={13} />
          ) : (
            <AlertCircle size={13} />
          )}

          {attendance.status}
        </div>
      </div>

      {/* Employee attendance information */}
      <div className="attendance-card-title">
        <span>EMPLOYEE ATTENDANCE</span>

        <h2>{attendance.employeeName}</h2>

        <small>
          Attendance Record #{attendance.id}
        </small>
      </div>

      {/* Attendance date */}
      <div className="attendance-date-box">
        <div className="attendance-date-icon">
          <CalendarDays size={15} />
        </div>

        <div>
          <span>Attendance Date</span>
          <strong>{attendance.date}</strong>
        </div>
      </div>

      {/* Check-in and check-out times */}
      <div className="attendance-time-details">
        <div className="attendance-time-item">
          <div className="attendance-time-icon check-in">
            <Clock3 size={14} />
          </div>

          <div>
            <span>Check In</span>
            <strong>{attendance.checkIn}</strong>
          </div>
        </div>

        <div className="attendance-time-item">
          <div className="attendance-time-icon check-out">
            <Clock3 size={14} />
          </div>

          <div>
            <span>Check Out</span>
            <strong>{attendance.checkOut}</strong>
          </div>
        </div>
      </div>

      {/* Current attendance status */}
      <div className="attendance-card-footer">
        <div>
          <span>Current Status</span>

          <strong
            className={
              isPresent
                ? "present-text"
                : isAbsent
                  ? "absent-text"
                  : "late-text"
            }
          >
            {attendance.status}
          </strong>
        </div>

        <div className="attendance-status-dot">
          <span className={statusClass} />
        </div>
      </div>

      {/* Delete action */}
      <div className="attendance-card-actions">
        <button
          type="button"
          className="attendance-delete-btn"
          onClick={() => onDelete(attendance.id)}
          aria-label={`Delete attendance record for ${attendance.employeeName}`}
        >
          <Trash2 size={15} />
          Delete Record
        </button>
      </div>
    </article>
  )
}