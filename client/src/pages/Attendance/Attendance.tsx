import { useEffect, useState } from "react"

import {
  Search,
  CalendarCheck,
  Users,
  CircleCheck,
  CircleX,
  Clock3,
  ClipboardCheck,
  Activity,
} from "lucide-react"

import AttendanceCard from "../../components/AttendanceCard/AttendanceCard"
import Modal from "../../components/Modal/Modal"

import { useTrash } from "../../context/TrashContext"
import { useToast } from "../../context/ToastContext"

import {
  getAttendance,
  deleteAttendance,
} from "../../services/api/attendanceApi"

type AttendanceRecord = {
  id: string
  employeeName: string
  date: string
  checkIn: string
  checkOut: string
  status: "Present" | "Absent" | "Late"
}

type AttendanceApiRecord = {
  _id: string
  employeeName?: string
  date?: string
  checkIn?: string
  checkOut?: string
  status?: "Present" | "Absent" | "Late"
}

export default function Attendance() {
  const [attendanceList, setAttendanceList] =
    useState<AttendanceRecord[]>([])

  const [searchTerm, setSearchTerm] = useState("")

  const [statusFilter, setStatusFilter] = useState<
    "All" | "Present" | "Absent" | "Late"
  >("All")

  const [dateFilter, setDateFilter] = useState("")

  const [sortOption, setSortOption] = useState<
    | "default"
    | "employee-asc"
    | "employee-desc"
    | "date-asc"
    | "date-desc"
  >("default")

  const [attendanceToDelete, setAttendanceToDelete] =
    useState<string | null>(null)

  const { moveToTrash } = useTrash()
  const { showToast } = useToast()

  // Load attendance records from the backend
  useEffect(() => {
    async function fetchAttendance() {
      try {
        const data =
          (await getAttendance()) as AttendanceApiRecord[]

        const formattedAttendance: AttendanceRecord[] =
          data.map((record) => ({
            id: record._id,
            employeeName: record.employeeName ?? "",
            date: record.date ?? "",
            checkIn: record.checkIn ?? "",
            checkOut: record.checkOut ?? "",
            status: record.status ?? "Present",
          }))

        setAttendanceList(formattedAttendance)
      } catch {
        showToast(
          "Failed to load attendance records",
          "error"
        )
      }
    }

    fetchAttendance()
  }, [showToast])

  // Prepare an attendance record for deletion
  function handleDeleteAttendance(id: string) {
    setAttendanceToDelete(id)
  }

  // Delete from MongoDB, then move the record to Trash
  async function confirmDeleteAttendance() {
    if (attendanceToDelete === null) {
      return
    }

    const attendanceRecord =
      attendanceList.find(
        (item) => item.id === attendanceToDelete
      )

    if (!attendanceRecord) {
      return
    }

    try {
      await deleteAttendance(attendanceRecord.id)

      moveToTrash(
        "Attendance",
        attendanceRecord.id,
        attendanceRecord.employeeName,
        `${attendanceRecord.date} - ${attendanceRecord.status}`,
        attendanceRecord as unknown as Record<
          string,
          unknown
        >
      )

      setAttendanceList((currentAttendance) =>
        currentAttendance.filter(
          (item) =>
            item.id !== attendanceRecord.id
        )
      )

      setAttendanceToDelete(null)

      showToast(
        "Attendance record moved to Trash",
        "success"
      )
    } catch {
      showToast(
        "Failed to delete attendance record",
        "error"
      )
    }
  }

  // Attendance statistics
  const totalAttendance = attendanceList.length

  const presentCount = attendanceList.filter(
    (record) => record.status === "Present"
  ).length

  const absentCount = attendanceList.filter(
    (record) => record.status === "Absent"
  ).length

  const lateCount = attendanceList.filter(
    (record) => record.status === "Late"
  ).length

  const attendanceRate =
    totalAttendance > 0
      ? Math.round(
          (presentCount / totalAttendance) * 100
        )
      : 0

  // Search, filter, and sort attendance records
  const filteredAttendance = [...attendanceList]
    .filter((record) =>
      String(record.employeeName ?? "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
    .filter((record) =>
      statusFilter === "All"
        ? true
        : record.status === statusFilter
    )
    .filter((record) =>
      dateFilter === ""
        ? true
        : record.date === dateFilter
    )
    .sort((a, b) => {
      if (sortOption === "employee-asc") {
        return a.employeeName.localeCompare(
          b.employeeName
        )
      }

      if (sortOption === "employee-desc") {
        return b.employeeName.localeCompare(
          a.employeeName
        )
      }

      if (sortOption === "date-asc") {
        return (
          new Date(a.date).getTime() -
          new Date(b.date).getTime()
        )
      }

      if (sortOption === "date-desc") {
        return (
          new Date(b.date).getTime() -
          new Date(a.date).getTime()
        )
      }

      return 0
    })

  return (
    <main className="attendance-page">
      {/* Hero header */}
      <header className="attendance-hero">
        <div className="attendance-hero-main">
          <div className="attendance-hero-icon">
            <CalendarCheck size={25} />
          </div>

          <div className="attendance-hero-content">
            <span className="attendance-hero-label">
              <span className="attendance-hero-dot" />
              WORKFORCE MANAGEMENT
            </span>

            <h1>
              Attendance <span>Overview</span>
            </h1>

            <p>
              Monitor employee attendance,
              daily presence, absences, and
              late arrivals from one central workspace.
            </p>
          </div>
        </div>

        <div className="attendance-hero-right">
          <div className="attendance-mini-stats">
            <div className="attendance-mini-stat">
              <div className="attendance-mini-icon">
                <CircleCheck size={16} />
              </div>

              <div>
                <strong>{presentCount}</strong>
                <span>Present</span>
              </div>
            </div>

            <div className="attendance-mini-divider" />

            <div className="attendance-mini-stat">
              <div className="attendance-mini-icon late">
                <Clock3 size={16} />
              </div>

              <div>
                <strong>{lateCount}</strong>
                <span>Late</span>
              </div>
            </div>
          </div>

          <div className="attendance-live-badge">
            <Activity size={13} />
            Live Workforce
          </div>
        </div>
      </header>

      {/* Attendance statistics */}
      <section className="attendance-stats">
        <article className="attendance-stat-card">
          <div className="attendance-stat-icon total">
            <Users size={20} />
          </div>

          <div>
            <span>Total Records</span>
            <strong>{totalAttendance}</strong>
            <small>Attendance records</small>
          </div>
        </article>

        <article className="attendance-stat-card">
          <div className="attendance-stat-icon present">
            <CircleCheck size={20} />
          </div>

          <div>
            <span>Present</span>
            <strong>{presentCount}</strong>
            <small>Employees present</small>
          </div>
        </article>

        <article className="attendance-stat-card">
          <div className="attendance-stat-icon absent">
            <CircleX size={20} />
          </div>

          <div>
            <span>Absent</span>
            <strong>{absentCount}</strong>
            <small>Employees absent</small>
          </div>
        </article>

        <article className="attendance-stat-card">
          <div className="attendance-stat-icon late">
            <Clock3 size={20} />
          </div>

          <div>
            <span>Late</span>
            <strong>{lateCount}</strong>
            <small>Late arrivals</small>
          </div>
        </article>
      </section>

      {/* Attendance rate overview */}
      <section className="attendance-overview">
        <div className="attendance-overview-header">
          <div className="attendance-overview-title">
            <div className="attendance-overview-icon">
              <ClipboardCheck size={18} />
            </div>

            <div>
              <span>WORKFORCE OVERVIEW</span>
              <h2>Attendance Rate</h2>
            </div>
          </div>

          <strong>{attendanceRate}%</strong>
        </div>

        <div className="attendance-progress-track">
          <div
            className="attendance-progress-bar"
            style={{
              width: `${attendanceRate}%`,
            }}
          />
        </div>

        <div className="attendance-overview-footer">
          <span>
            {presentCount} of {totalAttendance} records
            marked present
          </span>

          <span>{lateCount} late arrivals</span>
        </div>
      </section>

      {/* Search, filters, and sorting */}
      <div className="attendance-toolbar">
        <div className="attendance-search">
          <Search size={17} />

          <input
            type="text"
            placeholder="Search employee..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(e.target.value)
            }
          />
        </div>

        <div className="attendance-filter">
          <div className="attendance-filter-control">
            <label htmlFor="attendance-status">
              Status
            </label>

            <select
              id="attendance-status"
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(
                  e.target.value as
                    | "All"
                    | "Present"
                    | "Absent"
                    | "Late"
                )
              }
            >
              <option value="All">
                All Statuses
              </option>
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
              <option value="Late">Late</option>
            </select>
          </div>

          <div className="attendance-filter-control">
            <label htmlFor="attendance-date">
              Date
            </label>

            <input
              id="attendance-date"
              type="date"
              value={dateFilter}
              onChange={(e) =>
                setDateFilter(e.target.value)
              }
            />
          </div>

          <div className="attendance-filter-control">
            <label htmlFor="attendance-sort">
              Sort By
            </label>

            <select
              id="attendance-sort"
              value={sortOption}
              onChange={(e) =>
                setSortOption(
                  e.target.value as
                    | "default"
                    | "employee-asc"
                    | "employee-desc"
                    | "date-asc"
                    | "date-desc"
                )
              }
            >
              <option value="default">
                Default Order
              </option>
              <option value="employee-asc">
                Employee A → Z
              </option>
              <option value="employee-desc">
                Employee Z → A
              </option>
              <option value="date-asc">
                Date: Oldest
              </option>
              <option value="date-desc">
                Date: Newest
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* Attendance records header */}
      <div className="attendance-section-header">
        <div>
          <div className="attendance-section-title">
            <span className="attendance-section-icon">
              <CalendarCheck size={16} />
            </span>

            <h2>Attendance Records</h2>
          </div>

          <p>
            Review employee attendance activity and
            daily records.
          </p>
        </div>

        <span className="attendance-results-count">
          {filteredAttendance.length} records
        </span>
      </div>

      {/* Attendance records */}
      <div className="attendance-grid">
        {filteredAttendance.length > 0 ? (
          filteredAttendance.map((record) => (
            <AttendanceCard
              key={record.id}
              attendance={record}
              onDelete={handleDeleteAttendance}
            />
          ))
        ) : (
          <div className="attendance-empty">
            <div className="attendance-empty-icon">
              <Search size={24} />
            </div>

            <h2>No Attendance Records Found</h2>

            <p>
              No attendance records match your
              current search or filters.
            </p>
          </div>
        )}
      </div>

      {/* Delete confirmation */}
      {attendanceToDelete !== null && (
        <Modal
          title="Delete Attendance Record"
          message="This attendance record will be moved to Trash and can be recovered later."
          onCancel={() =>
            setAttendanceToDelete(null)
          }
          onConfirm={confirmDeleteAttendance}
        />
      )}
    </main>
  )
}