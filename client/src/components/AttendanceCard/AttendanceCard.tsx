import {
  CalendarDays,
  Trash2,
  Pencil,
} from "lucide-react"

import { useAuth } from "../../context/AuthContext"

import type { Attendance } from "../../types/Attendance"

type AttendanceCardProps = {
  attendance: Attendance
  onDelete: (id: string) => void
  onEdit: (attendance: Attendance) => void
}

export default function AttendanceCard({
  attendance,
  onDelete,
  onEdit,
}: AttendanceCardProps) {
  const { user } = useAuth()

  const isAdmin = user?.role === "Admin"

  return (
    <article className="attendance-card">
      <div className="attendance-card-header">
        <div>
          <span>ATTENDANCE</span>

          <h2>
            {attendance.employeeName}
          </h2>
        </div>

        <span
          className={`attendance-status attendance-status-${attendance.status.toLowerCase()}`}
        >
          {attendance.status}
        </span>
      </div>

      <div className="attendance-card-details">
        <div>
          <CalendarDays size={16} />

          <span>
            {attendance.date}
          </span>
        </div>

        <div>
          <strong>
            Check In
          </strong>

          <span>
            {attendance.checkIn || "-"}
          </span>
        </div>

        <div>
          <strong>
            Check Out
          </strong>

          <span>
            {attendance.checkOut || "-"}
          </span>
        </div>
      </div>

      <div className="attendance-card-actions">
        <button
          type="button"
          onClick={() => onEdit(attendance)}
        >
          <Pencil size={15} />
          Edit
        </button>

        {isAdmin && (
          <button
            type="button"
            onClick={() =>
              onDelete(attendance.id)
            }
          >
            <Trash2 size={15} />
            Delete
          </button>
        )}
      </div>
    </article>
  )
}