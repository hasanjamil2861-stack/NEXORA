import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react"

import {
  Search,
  CalendarDays,
  Clock3,
  CircleCheck,
  CircleX,
  ClipboardList,
  Plus,
  X,
  Save,
  FileText,
  BriefcaseBusiness,
  Activity,
} from "lucide-react"

import type { LeaveRequest } from "../../types/LeaveRequest"

import LeaveRequestCard from "../../components/LeaveRequestCard/LeaveRequestCard"
import Modal from "../../components/Modal/Modal"

import { useToast } from "../../context/ToastContext"
import { useTrash } from "../../context/TrashContext"
import { useAuth } from "../../context/AuthContext"

import {
  getLeaveRequests,
  createLeaveRequest,
  updateLeaveRequest,
  deleteLeaveRequest,
} from "../../services/api/leaveRequestApi"

type LeaveType =
  | "Annual"
  | "Sick"
  | "Personal"

type LeaveStatus =
  | "Pending"
  | "Approved"
  | "Rejected"

type LeaveForm = {
  leaveType: LeaveType
  startDate: string
  endDate: string
  reason: string
  status: LeaveStatus
}

type LeaveApiRecord = {
  _id: string
  employeeId?: {
    _id: string
    firstName: string
    lastName: string
    email: string
    position: string
  }
  leaveType?: LeaveType
  startDate?: string
  endDate?: string
  reason?: string
  status?: LeaveStatus
}

type SortOption =
  | "default"
  | "employee-asc"
  | "employee-desc"
  | "date-asc"
  | "date-desc"

const initialLeaveForm: LeaveForm = {
  leaveType: "Annual",
  startDate: "",
  endDate: "",
  reason: "",
  status: "Pending",
}

export default function LeaveRequests() {
  const { showToast } = useToast()
  const { moveToTrash } = useTrash()
  const { user } = useAuth()

  const isAdmin =
    user?.role === "Admin"

  const [leaveList, setLeaveList] =
    useState<LeaveRequest[]>([])

  const [searchTerm, setSearchTerm] =
    useState("")

  const [statusFilter, setStatusFilter] =
    useState<"All" | LeaveStatus>("All")

  const [sortOption, setSortOption] =
    useState<SortOption>("default")

  const [editingLeaveId, setEditingLeaveId] =
    useState<string | null>(null)

  const [leaveToDelete, setLeaveToDelete] =
    useState<string | null>(null)

  const [newLeaveId, setNewLeaveId] =
    useState<string | null>(null)

  const [isAdding, setIsAdding] =
    useState(false)

  const [addError, setAddError] =
    useState("")

  const [editError, setEditError] =
    useState("")

  const addFormRef =
    useRef<HTMLFormElement | null>(null)

  const editFormRef =
    useRef<HTMLFormElement | null>(null)

  const [editForm, setEditForm] =
    useState<LeaveForm>(initialLeaveForm)

  const [addForm, setAddForm] =
    useState<LeaveForm>(initialLeaveForm)

  /*
   * Scroll to newly created request
   */
  useEffect(() => {
    if (!newLeaveId) {
      return
    }

    const frame = requestAnimationFrame(() => {
      const newLeave =
        document.getElementById(
          `leave-${newLeaveId}`
        )

      if (newLeave) {
        newLeave.scrollIntoView({
          behavior: "smooth",
          block: "center",
        })
      }

      setNewLeaveId(null)
    })

    return () => {
      cancelAnimationFrame(frame)
    }
  }, [newLeaveId])

  /*
   * Load leave requests
   *
   * Backend:
   * Admin    -> all requests
   * Employee -> own requests
   */
  useEffect(() => {
    async function fetchLeaveRequests() {
      try {
        const data =
          (await getLeaveRequests()) as LeaveApiRecord[]

        const formattedLeaveRequests:
          LeaveRequest[] =
          data
            .filter(
              (leave) =>
                Boolean(leave.employeeId)
            )
            .map((leave) => ({
              id: leave._id,

              employeeId:
                leave.employeeId!,

              leaveType:
                leave.leaveType ??
                "Annual",

              startDate:
                leave.startDate ??
                "",

              endDate:
                leave.endDate ??
                "",

              reason:
                leave.reason ??
                "",

              status:
                leave.status ??
                "Pending",
            }))

        setLeaveList(
          formattedLeaveRequests
        )
      } catch (error) {
        console.error(
          "Fetch leave requests error:",
          error
        )

        showToast(
          "Failed to load leave requests",
          "error"
        )
      }
    }

    fetchLeaveRequests()
  }, [showToast])

  /*
   * Helper for employee name
   */
  function getEmployeeName(
    leave: LeaveRequest
  ) {
    return `${leave.employeeId.firstName} ${leave.employeeId.lastName}`
  }

  /*
   * Validate Add/Edit form
   */
  function validateForm(
    form: LeaveForm
  ) {
    if (!form.leaveType) {
      return "Leave type is required."
    }

    if (!form.startDate) {
      return "Start date is required."
    }

    if (!form.endDate) {
      return "End date is required."
    }

    if (
      new Date(form.endDate).getTime() <
      new Date(form.startDate).getTime()
    ) {
      return (
        "End date cannot be before " +
        "start date."
      )
    }

    if (!form.reason.trim()) {
      return "Reason is required."
    }

    return ""
  }

  /*
   * Delete request
   */
  function handleDelete(id: string) {
    setLeaveToDelete(id)
  }

  /*
   * Confirm delete
   */
  async function confirmDelete() {
    if (leaveToDelete === null) {
      return
    }

    const leave = leaveList.find(
      (item) =>
        item.id === leaveToDelete
    )

    if (!leave) {
      return
    }

    try {
      await deleteLeaveRequest(
        leaveToDelete
      )

      moveToTrash(
        "Leave Request",
        leave.id,
        getEmployeeName(leave),
        `${leave.leaveType} Leave Request`,
        leave as unknown as Record<
          string,
          unknown
        >
      )

      setLeaveList(
        (currentLeaves) =>
          currentLeaves.filter(
            (currentLeave) =>
              currentLeave.id !==
              leaveToDelete
          )
      )

      setLeaveToDelete(null)

      showToast(
        "Leave request moved to Trash",
        "success"
      )
    } catch (error) {
      console.error(
        "Delete leave request error:",
        error
      )

      showToast(
        "Failed to delete leave request",
        "error"
      )
    }
  }

  /*
   * Open edit form
   *
   * Admin uses this for approving/rejecting.
   */
  function handleEdit(id: string) {
    if (!isAdmin) {
      return
    }

    const leave = leaveList.find(
      (item) => item.id === id
    )

    if (!leave) {
      return
    }

    setEditingLeaveId(id)

    setEditForm({
      leaveType:
        leave.leaveType,

      startDate:
        leave.startDate,

      endDate:
        leave.endDate,

      reason:
        leave.reason,

      status:
        leave.status,
    })

    setEditError("")

    requestAnimationFrame(() => {
      editFormRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    })
  }

  /*
   * Admin updates request status
   */
  async function handleSave(
    event: FormEvent
  ) {
    event.preventDefault()

    if (
      editingLeaveId === null ||
      !isAdmin
    ) {
      return
    }

    if (!editForm.status) {
      setEditError(
        "Leave status is required."
      )

      return
    }

    try {
      const updatedLeave =
        (await updateLeaveRequest(
          editingLeaveId,
          {
            status:
              editForm.status,
          }
        )) as LeaveApiRecord

      if (!updatedLeave._id) {
        throw new Error(
          "MongoDB did not return the updated leave request."
        )
      }

      if (!updatedLeave.employeeId) {
        throw new Error(
          "Updated leave request is missing employee information."
        )
      }

      const formattedLeave:
        LeaveRequest = {
          id: updatedLeave._id,

          employeeId:
            updatedLeave.employeeId,

          leaveType:
            updatedLeave.leaveType ??
            "Annual",

          startDate:
            updatedLeave.startDate ??
            "",

          endDate:
            updatedLeave.endDate ??
            "",

          reason:
            updatedLeave.reason ??
            "",

          status:
            updatedLeave.status ??
            "Pending",
        }

      setLeaveList(
        (currentLeaves) =>
          currentLeaves.map(
            (leave) =>
              leave.id ===
              editingLeaveId
                ? formattedLeave
                : leave
          )
      )

      setEditingLeaveId(null)

      setEditError("")

      setEditForm(
        initialLeaveForm
      )

      showToast(
        "Leave request updated successfully",
        "success"
      )
    } catch (error) {
      console.error(
        "Update leave request error:",
        error
      )

      setEditError(
        error instanceof Error
          ? error.message
          : "Failed to update leave request."
      )
    }
  }

  function handleCancel() {
    setEditingLeaveId(null)

    setEditError("")

    setEditForm(
      initialLeaveForm
    )
  }

  /*
   * Open Add form
   */
  function openAddForm() {
    setIsAdding(true)

    setAddError("")

    requestAnimationFrame(() => {
      addFormRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    })
  }

  /*
   * Employee creates request
   *
   * Backend automatically determines
   * employeeId from authenticated user.
   *
   * Status is NOT sent by Employee.
   */
  async function handleAdd(
    event: FormEvent
  ) {
    event.preventDefault()

    const error =
      validateForm(addForm)

    if (error) {
      setAddError(error)
      return
    }

    try {
      const requestBody = {
        leaveType:
          addForm.leaveType,

        startDate:
          addForm.startDate,

        endDate:
          addForm.endDate,

        reason:
          addForm.reason.trim(),
      }

      const responseData =
        (await createLeaveRequest(
          requestBody
        )) as LeaveApiRecord

      if (!responseData._id) {
        throw new Error(
          "Leave request was not saved correctly."
        )
      }

      if (!responseData.employeeId) {
        throw new Error(
          "Leave request is missing employee information."
        )
      }

      const newLeave:
        LeaveRequest = {
          id: responseData._id,

          employeeId:
            responseData.employeeId,

          leaveType:
            responseData.leaveType ??
            "Annual",

          startDate:
            responseData.startDate ??
            "",

          endDate:
            responseData.endDate ??
            "",

          reason:
            responseData.reason ??
            "",

          status:
            responseData.status ??
            "Pending",
        }

      setLeaveList(
        (currentLeaves) => [
          ...currentLeaves,
          newLeave,
        ]
      )

      setNewLeaveId(
        newLeave.id
      )

      setAddForm(
        initialLeaveForm
      )

      setAddError("")

      setIsAdding(false)

      showToast(
        "Leave request added successfully",
        "success"
      )
    } catch (error) {
      console.error(
        "Add leave request error:",
        error
      )

      setAddError(
        error instanceof Error
          ? error.message
          : "Failed to add leave request."
      )
    }
  }

  function handleCancelAdd() {
    setIsAdding(false)

    setAddForm(
      initialLeaveForm
    )

    setAddError("")
  }

  /*
   * Statistics
   */
  const totalRequests =
    leaveList.length

  const pendingRequests =
    leaveList.filter(
      (leave) =>
        leave.status ===
        "Pending"
    ).length

  const approvedRequests =
    leaveList.filter(
      (leave) =>
        leave.status ===
        "Approved"
    ).length

  const rejectedRequests =
    leaveList.filter(
      (leave) =>
        leave.status ===
        "Rejected"
    ).length

  const approvalPercentage =
    totalRequests > 0
      ? Math.round(
          (approvedRequests /
            totalRequests) *
            100
        )
      : 0

  /*
   * Search / filter / sort
   */
  const filteredLeaves =
    [...leaveList]
      .filter((leave) =>
        getEmployeeName(
          leave
        )
          .toLowerCase()
          .includes(
            searchTerm.toLowerCase()
          )
      )
      .filter((leave) =>
        statusFilter === "All"
          ? true
          : leave.status ===
            statusFilter
      )
      .sort((a, b) => {
        switch (sortOption) {
          case "employee-asc":
            return getEmployeeName(
              a
            ).localeCompare(
              getEmployeeName(b)
            )

          case "employee-desc":
            return getEmployeeName(
              b
            ).localeCompare(
              getEmployeeName(a)
            )

          case "date-asc":
            return (
              new Date(
                a.startDate
              ).getTime() -
              new Date(
                b.startDate
              ).getTime()
            )

          case "date-desc":
            return (
              new Date(
                b.startDate
              ).getTime() -
              new Date(
                a.startDate
              ).getTime()
            )

          default:
            return 0
        }
      })

  return (
    <main className="leave-requests-page">
      <header className="leave-hero">
        <div className="leave-hero-main">
          <div className="leave-hero-icon">
            <CalendarDays
              size={25}
            />
          </div>

          <div className="leave-hero-content">
            <span className="leave-hero-label">
              <span className="leave-hero-dot" />
              HR MANAGEMENT
            </span>

            <h1>
              Leave{" "}
              <span>Requests</span>
            </h1>

            <p>
              {isAdmin
                ? "Review and manage employee leave requests, approvals, dates, and statuses."
                : "Submit and track your leave requests from one central workspace."}
            </p>
          </div>
        </div>

        <div className="leave-hero-right">
          <div className="leave-mini-stats">
            <div className="leave-mini-stat">
              <div className="leave-mini-icon">
                <Clock3 size={16} />
              </div>

              <div>
                <strong>
                  {pendingRequests}
                </strong>

                <span>
                  Pending
                </span>
              </div>
            </div>

            <div className="leave-mini-divider" />

            <div className="leave-mini-stat">
              <div className="leave-mini-icon approved">
                <CircleCheck
                  size={16}
                />
              </div>

              <div>
                <strong>
                  {approvedRequests}
                </strong>

                <span>
                  Approved
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            className="add-leave-btn"
            onClick={openAddForm}
          >
            <Plus size={16} />
            Add Request
          </button>
        </div>
      </header>

      <section className="leave-stats">
        <article className="leave-stat-card">
          <div className="leave-stat-icon total">
            <ClipboardList
              size={20}
            />
          </div>

          <div>
            <span>
              Total Requests
            </span>

            <strong>
              {totalRequests}
            </strong>

            <small>
              {isAdmin
                ? "All submitted requests"
                : "Your submitted requests"}
            </small>
          </div>
        </article>

        <article className="leave-stat-card">
          <div className="leave-stat-icon pending">
            <Clock3 size={20} />
          </div>

          <div>
            <span>Pending</span>

            <strong>
              {pendingRequests}
            </strong>

            <small>
              Waiting for review
            </small>
          </div>
        </article>

        <article className="leave-stat-card">
          <div className="leave-stat-icon approved">
            <CircleCheck
              size={20}
            />
          </div>

          <div>
            <span>
              Approved
            </span>

            <strong>
              {approvedRequests}
            </strong>

            <small>
              Approved requests
            </small>
          </div>
        </article>

        <article className="leave-stat-card">
          <div className="leave-stat-icon rejected">
            <CircleX size={20} />
          </div>

          <div>
            <span>
              Rejected
            </span>

            <strong>
              {rejectedRequests}
            </strong>

            <small>
              Rejected requests
            </small>
          </div>
        </article>
      </section>

      <section className="leave-overview">
        <div className="leave-overview-header">
          <div className="leave-overview-title">
            <div className="leave-overview-icon">
              <Activity
                size={18}
              />
            </div>

            <div>
              <span>
                REQUEST OVERVIEW
              </span>

              <h2>
                Approval Progress
              </h2>
            </div>
          </div>

          <strong>
            {approvalPercentage}%
          </strong>
        </div>

        <div className="leave-progress-track">
          <div
            className="leave-progress-bar"
            style={{
              width:
                `${approvalPercentage}%`,
            }}
          />
        </div>

        <div className="leave-overview-footer">
          <span>
            {approvedRequests} of{" "}
            {totalRequests} requests
            approved
          </span>

          <span>
            {pendingRequests} pending
            review
          </span>
        </div>
      </section>

      {/* Add leave request */}
      {isAdding && (
        <form
          ref={addFormRef}
          className="leave-form"
          onSubmit={handleAdd}
        >
          <div className="leave-form-header">
            <div>
              <span className="leave-form-eyebrow">
                NEW REQUEST
              </span>

              <h2>
                Add Leave Request
              </h2>
            </div>

            <div className="leave-form-icon">
              <Plus size={19} />
            </div>
          </div>

          <div className="leave-form-grid">
            <div className="leave-field">
              <label>
                Leave Type
              </label>

              <div className="leave-input-wrapper">
                <BriefcaseBusiness
                  size={16}
                />

                <select
                  value={
                    addForm.leaveType
                  }
                  required
                  onChange={(event) => {
                    setAddForm({
                      ...addForm,
                      leaveType:
                        event.target
                          .value as LeaveType,
                    })

                    setAddError("")
                  }}
                >
                  <option value="Annual">
                    Annual
                  </option>

                  <option value="Sick">
                    Sick
                  </option>

                  <option value="Personal">
                    Personal
                  </option>
                </select>
              </div>
            </div>

            <div className="leave-field">
              <label>
                Start Date
              </label>

              <div className="leave-input-wrapper">
                <CalendarDays
                  size={16}
                />

                <input
                  type="date"
                  value={
                    addForm.startDate
                  }
                  required
                  onChange={(event) => {
                    setAddForm({
                      ...addForm,
                      startDate:
                        event.target
                          .value,
                    })

                    setAddError("")
                  }}
                />
              </div>
            </div>

            <div className="leave-field">
              <label>
                End Date
              </label>

              <div className="leave-input-wrapper">
                <CalendarDays
                  size={16}
                />

                <input
                  type="date"
                  value={
                    addForm.endDate
                  }
                  min={
                    addForm.startDate ||
                    undefined
                  }
                  required
                  onChange={(event) => {
                    setAddForm({
                      ...addForm,
                      endDate:
                        event.target
                          .value,
                    })

                    setAddError("")
                  }}
                />
              </div>
            </div>

            <div className="leave-field">
              <label>
                Reason
              </label>

              <div className="leave-input-wrapper">
                <FileText
                  size={16}
                />

                <input
                  type="text"
                  placeholder="Reason"
                  value={
                    addForm.reason
                  }
                  required
                  onChange={(event) => {
                    setAddForm({
                      ...addForm,
                      reason:
                        event.target
                          .value,
                    })

                    setAddError("")
                  }}
                />
              </div>
            </div>

            <div className="leave-field">
              <label>
                Status
              </label>

              <div className="leave-input-wrapper">
                <Activity
                  size={16}
                />

                <input
                  type="text"
                  value="Pending"
                  disabled
                />
              </div>
            </div>
          </div>

          {addError && (
            <p className="form-error">
              {addError}
            </p>
          )}

          <div className="leave-form-actions">
            <button
              type="button"
              className="leave-form-cancel-btn"
              onClick={
                handleCancelAdd
              }
            >
              <X size={15} />
              Cancel
            </button>

            <button
              type="submit"
              className="leave-save-btn"
            >
              <Save size={15} />
              Submit Request
            </button>
          </div>
        </form>
      )}

      {/* Admin edit / approval form */}
      {editingLeaveId !== null &&
        isAdmin && (
          <form
            ref={editFormRef}
            className="leave-form edit"
            onSubmit={handleSave}
          >
            <div className="leave-form-header">
              <div>
                <span className="leave-form-eyebrow">
                  REQUEST REVIEW
                </span>

                <h2>
                  Review Leave Request
                </h2>
              </div>

              <div className="leave-form-icon edit">
                <Save size={19} />
              </div>
            </div>

            <div className="leave-form-grid">
              <div className="leave-field">
                <label>
                  Leave Type
                </label>

                <div className="leave-input-wrapper">
                  <BriefcaseBusiness
                    size={16}
                  />

                  <input
                    type="text"
                    value={
                      editForm.leaveType
                    }
                    disabled
                  />
                </div>
              </div>

              <div className="leave-field">
                <label>
                  Start Date
                </label>

                <div className="leave-input-wrapper">
                  <CalendarDays
                    size={16}
                  />

                  <input
                    type="date"
                    value={
                      editForm.startDate
                    }
                    disabled
                  />
                </div>
              </div>

              <div className="leave-field">
                <label>
                  End Date
                </label>

                <div className="leave-input-wrapper">
                  <CalendarDays
                    size={16}
                  />

                  <input
                    type="date"
                    value={
                      editForm.endDate
                    }
                    disabled
                  />
                </div>
              </div>

              <div className="leave-field">
                <label>
                  Reason
                </label>

                <div className="leave-input-wrapper">
                  <FileText
                    size={16}
                  />

                  <input
                    type="text"
                    value={
                      editForm.reason
                    }
                    disabled
                  />
                </div>
              </div>

              <div className="leave-field">
                <label>
                  Status
                </label>

                <div className="leave-input-wrapper">
                  <Activity
                    size={16}
                  />

                  <select
                    value={
                      editForm.status
                    }
                    required
                    onChange={(event) => {
                      setEditForm({
                        ...editForm,
                        status:
                          event.target
                            .value as LeaveStatus,
                      })

                      setEditError("")
                    }}
                  >
                    <option value="Pending">
                      Pending
                    </option>

                    <option value="Approved">
                      Approved
                    </option>

                    <option value="Rejected">
                      Rejected
                    </option>
                  </select>
                </div>
              </div>
            </div>

            {editError && (
              <p className="form-error">
                {editError}
              </p>
            )}

            <div className="leave-form-actions">
              <button
                type="button"
                className="leave-form-cancel-btn"
                onClick={
                  handleCancel
                }
              >
                <X size={15} />
                Cancel
              </button>

              <button
                type="submit"
                className="leave-save-btn"
              >
                <Save size={15} />
                Update Status
              </button>
            </div>
          </form>
        )}

      {/* Search / filters */}
      <div className="leave-toolbar">
        <div className="leave-search">
          <Search size={17} />

          <input
            type="text"
            placeholder={
              isAdmin
                ? "Search employee..."
                : "Search your requests..."
            }
            value={
              searchTerm
            }
            onChange={(event) =>
              setSearchTerm(
                event.target
                  .value
              )
            }
          />
        </div>

        <div className="leave-filter">
          <select
            value={
              statusFilter
            }
            onChange={(event) =>
              setStatusFilter(
                event.target
                  .value as
                  | "All"
                  | LeaveStatus
              )
            }
          >
            <option value="All">
              All Statuses
            </option>

            <option value="Pending">
              Pending
            </option>

            <option value="Approved">
              Approved
            </option>

            <option value="Rejected">
              Rejected
            </option>
          </select>

          <select
            value={
              sortOption
            }
            onChange={(event) =>
              setSortOption(
                event.target
                  .value as SortOption
              )
            }
          >
            <option value="default">
              Default Order
            </option>

            <option value="employee-asc">
              Employee A-Z
            </option>

            <option value="employee-desc">
              Employee Z-A
            </option>

            <option value="date-asc">
              Start Date: Oldest
            </option>

            <option value="date-desc">
              Start Date: Newest
            </option>
          </select>
        </div>
      </div>

      <div className="leave-section-header">
        <div>
          <h2>
            Leave Requests
          </h2>

          <p>
            {isAdmin
              ? "Review and manage employee leave activity."
              : "Track your submitted leave requests."}
          </p>
        </div>

        <span className="leave-results-count">
          {
            filteredLeaves.length
          }{" "}
          requests
        </span>
      </div>

      {/* Leave request list */}
      <section className="leave-requests-grid">
        {filteredLeaves.length >
        0 ? (
          filteredLeaves.map(
            (leaveRequest) => (
              <div
                key={
                  leaveRequest.id
                }
                id={`leave-${leaveRequest.id}`}
              >
                <LeaveRequestCard
                  leaveRequest={
                    leaveRequest
                  }
                  onDelete={
                    handleDelete
                  }
                  onEdit={
                    handleEdit
                  }
                />
              </div>
            )
          )
        ) : (
          <div className="leave-empty-state">
            <div className="leave-empty-icon">
              <CalendarDays
                size={27}
              />
            </div>

            <h2>
              No leave requests
              found
            </h2>

            <p>
              Try changing your
              search or filter.
            </p>
          </div>
        )}
      </section>

      {/* Delete confirmation */}
      {leaveToDelete !==
        null && (
        <Modal
          title="Delete Leave Request"
          message="Are you sure you want to move this leave request to Trash? You can recover it later from the Trash page."
          onCancel={() =>
            setLeaveToDelete(
              null
            )
          }
          onConfirm={
            confirmDelete
          }
        />
      )}
    </main>
  )
}