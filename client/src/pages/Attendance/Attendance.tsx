import {
  useEffect,
  useRef,
  useState,
} from "react"

import {
  Search,
  CalendarCheck,
  Users,
  CircleCheck,
  CircleX,
  Clock3,
  ClipboardCheck,
  Activity,
  Plus,
  Pencil,
  UserRound,
} from "lucide-react"

import AttendanceCard from "../../components/AttendanceCard/AttendanceCard"
import Modal from "../../components/Modal/Modal"

import { useAuth } from "../../context/AuthContext"
import { useTrash } from "../../context/TrashContext"
import { useToast } from "../../context/ToastContext"

import {
  getAttendance,
  createAttendance,
  updateAttendance,
  deleteAttendance,
} from "../../services/api/attendanceApi"

import type { Attendance } from "../../types/Attendance"

type AttendanceApiRecord = {
  _id: string

  employeeId:
    | string
    | {
        _id: string
        firstName?: string
        lastName?: string
      }

  employeeName?: string
  date?: string
  checkIn?: string
  checkOut?: string

  status?:
    | "Present"
    | "Absent"
    | "Late"
}

type AttendanceForm = {
  employeeId: string
  date: string
  checkIn: string
  checkOut: string
  status:
    | "Present"
    | "Absent"
    | "Late"
}

export default function Attendance() {
  const { user } = useAuth()

  const isAdmin =
    user?.role === "Admin"

  const [attendanceList, setAttendanceList] =
    useState<Attendance[]>([])

  const [searchTerm, setSearchTerm] =
    useState("")

  const [statusFilter, setStatusFilter] =
    useState<
      "All" | "Present" | "Absent" | "Late"
    >("All")

  const [dateFilter, setDateFilter] =
    useState("")

  const [sortOption, setSortOption] =
    useState<
      | "default"
      | "employee-asc"
      | "employee-desc"
      | "date-asc"
      | "date-desc"
    >("default")

  const [
    attendanceToDelete,
    setAttendanceToDelete,
  ] = useState<string | null>(null)

  const [
    editingAttendance,
    setEditingAttendance,
  ] = useState<Attendance | null>(null)

  const [
    showForm,
    setShowForm,
  ] = useState(false)

  const [
    formData,
    setFormData,
  ] = useState<AttendanceForm>({
    employeeId: "",
    date: "",
    checkIn: "",
    checkOut: "",
    status: "Present",
  })

  const attendanceFormRef =
    useRef<HTMLElement | null>(null)

  const { moveToTrash } = useTrash()
  const { showToast } = useToast()

  async function fetchAttendance() {
    try {
      const data =
        (await getAttendance()) as AttendanceApiRecord[]

      const formattedAttendance: Attendance[] =
        data.map((record) => {
          const employeeId =
            typeof record.employeeId ===
            "string"
              ? record.employeeId
              : record.employeeId?._id

          return {
            id: String(record._id),

            employeeId:
              employeeId ?? "",

            employeeName:
              record.employeeName ?? "",

            date:
              record.date ?? "",

            checkIn:
              record.checkIn ?? "",

            checkOut:
              record.checkOut ?? "",

            status:
              record.status ?? "Present",
          }
        })

      setAttendanceList(
        formattedAttendance
      )
    } catch (error) {
      console.error(
        "Failed to load attendance:",
        error
      )

      showToast(
        "Failed to load attendance records",
        "error"
      )
    }
  }

  useEffect(() => {
    fetchAttendance()
  }, [])

  useEffect(() => {
    if (!showForm) return

    const timer = window.setTimeout(() => {
      attendanceFormRef.current?.scrollIntoView(
        {
          behavior: "smooth",
          block: "start",
        }
      )
    }, 50)

    return () => {
      window.clearTimeout(timer)
    }
  }, [showForm])

  function resetForm() {
    setFormData({
      employeeId: "",
      date: "",
      checkIn: "",
      checkOut: "",
      status: "Present",
    })

    setEditingAttendance(null)
    setShowForm(false)
  }

  function handleOpenCreate() {
    setEditingAttendance(null)

    setFormData({
      employeeId: "",
      date: "",
      checkIn: "",
      checkOut: "",
      status: "Present",
    })

    setShowForm(true)
  }

  function handleEdit(
    attendance: Attendance
  ) {
    setEditingAttendance(attendance)

    setFormData({
      employeeId:
        attendance.employeeId,

      date:
        attendance.date,

      checkIn:
        attendance.checkIn,

      checkOut:
        attendance.checkOut,

      status:
        attendance.status,
    })

    setShowForm(true)
  }

  async function handleSubmit(
    event: React.FormEvent
  ) {
    event.preventDefault()

    if (!formData.date) {
      showToast(
        "Date is required",
        "error"
      )

      return
    }

    if (
      isAdmin &&
      !editingAttendance &&
      !formData.employeeId
    ) {
      showToast(
        "Employee ID is required",
        "error"
      )

      return
    }

    try {
      // UPDATE
      if (editingAttendance) {
        const updated =
          (await updateAttendance(
            editingAttendance.id,
            {
              date:
                formData.date,

              checkIn:
                formData.checkIn,

              checkOut:
                formData.checkOut,

              status:
                formData.status,
            }
          )) as AttendanceApiRecord

        const updatedEmployeeId =
          typeof updated.employeeId ===
          "string"
            ? updated.employeeId
            : updated.employeeId?._id

        setAttendanceList(
          (current) =>
            current.map(
              (item) =>
                item.id ===
                editingAttendance.id
                  ? {
                      ...item,

                      employeeId:
                        updatedEmployeeId ??
                        item.employeeId,

                      employeeName:
                        updated.employeeName ??
                        item.employeeName,

                      date:
                        updated.date ??
                        formData.date,

                      checkIn:
                        updated.checkIn ??
                        formData.checkIn,

                      checkOut:
                        updated.checkOut ??
                        formData.checkOut,

                      status:
                        updated.status ??
                        formData.status,
                    }
                  : item
            )
        )

        resetForm()

        showToast(
          "Attendance updated successfully",
          "success"
        )

        return
      }

      // CREATE
      const created =
        (await createAttendance({
          // Only Admin sends employeeId.
          // Employee identity is resolved by backend.
          ...(isAdmin
            ? {
                employeeId:
                  formData.employeeId,
              }
            : {}),

          date:
            formData.date,

          checkIn:
            formData.checkIn,

          checkOut:
            formData.checkOut,

          status:
            formData.status,
        })) as AttendanceApiRecord

      const createdEmployeeId =
        typeof created.employeeId ===
        "string"
          ? created.employeeId
          : created.employeeId?._id

      const newRecord: Attendance = {
        id:
          String(created._id),

        employeeId:
          createdEmployeeId ?? "",

        employeeName:
          created.employeeName ??
          user?.name ??
          "",

        date:
          created.date ??
          formData.date,

        checkIn:
          created.checkIn ??
          formData.checkIn,

        checkOut:
          created.checkOut ??
          formData.checkOut,

        status:
          created.status ??
          formData.status,
      }

      setAttendanceList(
        (current) => [
          ...current,
          newRecord,
        ]
      )

      resetForm()

      showToast(
        "Attendance recorded successfully",
        "success"
      )
    } catch (error) {
      console.error(
        "Attendance save error:",
        error
      )

      showToast(
        "Failed to save attendance record",
        "error"
      )
    }
  }

  function handleDeleteAttendance(
    id: string
  ) {
    if (!isAdmin) return

    setAttendanceToDelete(id)
  }

  async function confirmDeleteAttendance() {
    if (
      !isAdmin ||
      attendanceToDelete === null
    ) {
      return
    }

    const attendanceRecord =
      attendanceList.find(
        (item) =>
          item.id ===
          attendanceToDelete
      )

    if (!attendanceRecord) return

    try {
      await deleteAttendance(
        attendanceRecord.id
      )

      const trashData: Record<
        string,
        unknown
      > = {
        id:
          attendanceRecord.id,

        employeeId:
          attendanceRecord.employeeId,

        employeeName:
          attendanceRecord.employeeName,

        date:
          attendanceRecord.date,

        checkIn:
          attendanceRecord.checkIn,

        checkOut:
          attendanceRecord.checkOut,

        status:
          attendanceRecord.status,
      }

      moveToTrash(
        "Attendance",
        attendanceRecord.id,
        attendanceRecord.employeeName,
        `${attendanceRecord.date} - ${attendanceRecord.status}`,
        trashData
      )

      setAttendanceList(
        (current) =>
          current.filter(
            (item) =>
              item.id !==
              attendanceRecord.id
          )
      )

      setAttendanceToDelete(null)

      showToast(
        "Attendance record moved to Trash",
        "success"
      )
    } catch (error) {
      console.error(
        "Failed to delete attendance:",
        error
      )

      showToast(
        "Failed to delete attendance record",
        "error"
      )
    }
  }

  const totalAttendance =
    attendanceList.length

  const presentCount =
    attendanceList.filter(
      (record) =>
        record.status === "Present"
    ).length

  const absentCount =
    attendanceList.filter(
      (record) =>
        record.status === "Absent"
    ).length

  const lateCount =
    attendanceList.filter(
      (record) =>
        record.status === "Late"
    ).length

  const attendanceRate =
    totalAttendance > 0
      ? Math.round(
          (presentCount /
            totalAttendance) *
            100
        )
      : 0

  const filteredAttendance =
    [...attendanceList]
      .filter((record) =>
        record.employeeName
          .toLowerCase()
          .includes(
            searchTerm
              .toLowerCase()
              .trim()
          )
      )
      .filter((record) =>
        statusFilter === "All"
          ? true
          : record.status ===
            statusFilter
      )
      .filter((record) =>
        dateFilter === ""
          ? true
          : record.date ===
            dateFilter
      )
      .sort((a, b) => {
        switch (sortOption) {
          case "employee-asc":
            return a.employeeName.localeCompare(
              b.employeeName
            )

          case "employee-desc":
            return b.employeeName.localeCompare(
              a.employeeName
            )

          case "date-asc":
            return (
              new Date(a.date).getTime() -
              new Date(b.date).getTime()
            )

          case "date-desc":
            return (
              new Date(b.date).getTime() -
              new Date(a.date).getTime()
            )

          default:
            return 0
        }
      })

  return (
    <main className="attendance-page">
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
              Attendance{" "}
              <span>Overview</span>
            </h1>

            <p>
              {isAdmin
                ? "Monitor employee attendance, daily presence, absences, and late arrivals from one central workspace."
                : "View and manage your attendance records, daily presence, absences, and late arrivals."}
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
                <strong>
                  {presentCount}
                </strong>

                <span>
                  Present
                </span>
              </div>
            </div>

            <div className="attendance-mini-divider" />

            <div className="attendance-mini-stat">
              <div className="attendance-mini-icon late">
                <Clock3 size={16} />
              </div>

              <div>
                <strong>
                  {lateCount}
                </strong>

                <span>
                  Late
                </span>
              </div>
            </div>
          </div>

          <div className="attendance-live-badge">
            <Activity size={13} />

            {isAdmin
              ? "Live Workforce"
              : "My Attendance"}
          </div>
        </div>
      </header>

      <section className="attendance-stats">
        <article className="attendance-stat-card">
          <div className="attendance-stat-icon total">
            <Users size={20} />
          </div>

          <div>
            <span>
              Total Records
            </span>

            <strong>
              {totalAttendance}
            </strong>

            <small>
              {isAdmin
                ? "Attendance records"
                : "Your attendance records"}
            </small>
          </div>
        </article>

        <article className="attendance-stat-card">
          <div className="attendance-stat-icon present">
            <CircleCheck size={20} />
          </div>

          <div>
            <span>Present</span>

            <strong>
              {presentCount}
            </strong>

            <small>
              {isAdmin
                ? "Employees present"
                : "Days present"}
            </small>
          </div>
        </article>

        <article className="attendance-stat-card">
          <div className="attendance-stat-icon absent">
            <CircleX size={20} />
          </div>

          <div>
            <span>Absent</span>

            <strong>
              {absentCount}
            </strong>

            <small>
              {isAdmin
                ? "Employees absent"
                : "Days absent"}
            </small>
          </div>
        </article>

        <article className="attendance-stat-card">
          <div className="attendance-stat-icon late">
            <Clock3 size={20} />
          </div>

          <div>
            <span>Late</span>

            <strong>
              {lateCount}
            </strong>

            <small>
              Late arrivals
            </small>
          </div>
        </article>
      </section>

      <section className="attendance-overview">
        <div className="attendance-overview-header">
          <div className="attendance-overview-title">
            <div className="attendance-overview-icon">
              <ClipboardCheck size={18} />
            </div>

            <div>
              <span>
                WORKFORCE OVERVIEW
              </span>

              <h2>
                Attendance Rate
              </h2>
            </div>
          </div>

          <strong>
            {attendanceRate}%
          </strong>
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
            {presentCount} of{" "}
            {totalAttendance} records
            marked present
          </span>

          <span>
            {lateCount} late arrivals
          </span>
        </div>
      </section>

      <div className="attendance-toolbar">
        <div className="attendance-search">
          <Search size={17} />

          <input
            type="text"
            placeholder="Search employee..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(
                e.target.value
              )
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

              <option value="Present">
                Present
              </option>

              <option value="Absent">
                Absent
              </option>

              <option value="Late">
                Late
              </option>
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
                setDateFilter(
                  e.target.value
                )
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

          <button
            type="button"
            onClick={handleOpenCreate}
            className="attendance-add-button"
          >
            <Plus size={16} />

            {isAdmin
              ? "Add Attendance"
              : "Record Attendance"}
          </button>
        </div>
      </div>

      {showForm && (
        <section
          ref={attendanceFormRef}
          className="attendance-form"
        >
          <div className="attendance-form-header">
            <div>
              <span>
                ATTENDANCE MANAGEMENT
              </span>

              <h2>
                {editingAttendance
                  ? "Edit Attendance"
                  : "Record Attendance"}
              </h2>
            </div>

            <Pencil size={18} />
          </div>

          <form onSubmit={handleSubmit}>
            {/* Employee identity */}
            {isAdmin &&
              !editingAttendance && (
                <div className="attendance-filter-control">
                  <label htmlFor="attendance-employee-id">
                    Employee ID
                  </label>

                  <input
                    id="attendance-employee-id"
                    type="text"
                    required
                    value={
                      formData.employeeId
                    }
                    onChange={(e) =>
                      setFormData(
                        (current) => ({
                          ...current,
                          employeeId:
                            e.target.value,
                        })
                      )
                    }
                    placeholder="Enter employee MongoDB ID"
                  />
                </div>
              )}

            {/* Employee sees their authenticated name */}
            {!isAdmin && (
              <div className="attendance-filter-control">
                <label htmlFor="attendance-employee-name">
                  Employee
                </label>

                <div
                  style={{
                    position:
                      "relative",
                  }}
                >
                  <UserRound
                    size={16}
                    style={{
                      position:
                        "absolute",
                      left: "12px",
                      top: "50%",
                      transform:
                        "translateY(-50%)",
                      pointerEvents:
                        "none",
                      opacity: 0.6,
                    }}
                  />

                  <input
                    id="attendance-employee-name"
                    type="text"
                    value={
                      user?.name ?? ""
                    }
                    readOnly
                    style={{
                      paddingLeft:
                        "38px",
                    }}
                  />
                </div>
              </div>
            )}

            <div className="attendance-filter-control">
              <label htmlFor="attendance-form-date">
                Date
              </label>

              <input
                id="attendance-form-date"
                type="date"
                required
                value={
                  formData.date
                }
                onChange={(e) =>
                  setFormData(
                    (current) => ({
                      ...current,
                      date:
                        e.target.value,
                    })
                  )
                }
              />
            </div>

            <div className="attendance-filter-control">
              <label htmlFor="attendance-check-in">
                Check In
              </label>

              <input
                id="attendance-check-in"
                type="time"
                value={
                  formData.checkIn
                }
                onChange={(e) =>
                  setFormData(
                    (current) => ({
                      ...current,
                      checkIn:
                        e.target.value,
                    })
                  )
                }
              />
            </div>

            <div className="attendance-filter-control">
              <label htmlFor="attendance-check-out">
                Check Out
              </label>

              <input
                id="attendance-check-out"
                type="time"
                value={
                  formData.checkOut
                }
                onChange={(e) =>
                  setFormData(
                    (current) => ({
                      ...current,
                      checkOut:
                        e.target.value,
                    })
                  )
                }
              />
            </div>

            <div className="attendance-filter-control">
              <label htmlFor="attendance-form-status">
                Status
              </label>

              <select
                id="attendance-form-status"
                value={
                  formData.status
                }
                onChange={(e) =>
                  setFormData(
                    (current) => ({
                      ...current,
                      status:
                        e.target.value as
                          | "Present"
                          | "Absent"
                          | "Late",
                    })
                  )
                }
              >
                <option value="Present">
                  Present
                </option>

                <option value="Absent">
                  Absent
                </option>

                <option value="Late">
                  Late
                </option>
              </select>
            </div>

            <div className="attendance-card-actions">
              <button type="submit">
                <CircleCheck size={15} />

                {editingAttendance
                  ? "Save Changes"
                  : "Save Attendance"}
              </button>

              <button
                type="button"
                onClick={resetForm}
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      )}

      <div className="attendance-section-header">
        <div>
          <div className="attendance-section-title">
            <span className="attendance-section-icon">
              <CalendarCheck size={16} />
            </span>

            <h2>
              {isAdmin
                ? "Attendance Records"
                : "My Attendance Records"}
            </h2>
          </div>

          <p>
            {isAdmin
              ? "Review employee attendance activity and daily records."
              : "Review and manage your attendance activity and daily records."}
          </p>
        </div>

        <span className="attendance-results-count">
          {filteredAttendance.length} records
        </span>
      </div>

      <div className="attendance-grid">
        {filteredAttendance.length >
        0 ? (
          filteredAttendance.map(
            (record) => (
              <AttendanceCard
  key={record.id}
  attendance={record}
  onDelete={handleDeleteAttendance}
  onEdit={handleEdit}
/>
              
            )
          )
        ) : (
          <div className="attendance-empty">
            <div className="attendance-empty-icon">
              <Search size={24} />
            </div>

            <h2>
              No Attendance Records Found
            </h2>

            <p>
              No attendance records match
              your current search or
              filters.
            </p>
          </div>
        )}
      </div>

      {isAdmin &&
        attendanceToDelete !== null && (
          <Modal
            title="Delete Attendance Record"
            message="This attendance record will be moved to Trash and can be recovered later."
            onCancel={() =>
              setAttendanceToDelete(
                null
              )
            }
            onConfirm={
              confirmDeleteAttendance
            }
          />
        )}
    </main>
  )
}