import { useMemo, useState } from "react"

import {
  Archive,
  ArchiveRestore,
  ArchiveX,
  CalendarDays,
  CircleAlert,
  Clock3,
  FileArchive,
  Files,
  RotateCcw,
  Search,
  Trash2,
} from "lucide-react"

import { useToast } from "../../context/ToastContext"
import { useTrash } from "../../context/TrashContext"

import Modal from "../../components/Modal/Modal"

const restoreEndpoints: Record<string, string> = {
  Employee: "http://localhost:5000/employees",
  Department: "http://localhost:5000/departments",
  Project: "http://localhost:5000/projects",
  Task: "http://localhost:5000/tasks",
  Client: "http://localhost:5000/clients",
  "Leave Request": "http://localhost:5000/leaveRequests",
  Attendance: "http://localhost:5000/attendance",
  Contract: "http://localhost:5000/contracts",
  Invoice: "http://localhost:5000/invoices",
  Document: "http://localhost:5000/documents",
}

type TrashFilter = "All" | string

export default function Trash() {
  const {
    trashItems,
    restoreFromTrash,
    deleteForever,
    emptyTrash,
  } = useTrash()

  const { showToast } = useToast()

  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] =
    useState<TrashFilter>("All")

  const [deleteId, setDeleteId] =
    useState<string | null>(null)

  const [showEmptyModal, setShowEmptyModal] =
    useState(false)

  const [restoringId, setRestoringId] =
    useState<string | null>(null)

  // Available entity types for the filter
  const availableTypes = useMemo(() => {
    return Array.from(
      new Set(
        trashItems.map(
          (item) => item.entityType
        )
      )
    )
  }, [trashItems])

  // Search and type filtering
  const filteredItems = useMemo(() => {
    const search = searchTerm
      .trim()
      .toLowerCase()

    return trashItems.filter((item) => {
      const matchesSearch =
        !search ||
        item.title
          .toLowerCase()
          .includes(search) ||
        item.subtitle
          .toLowerCase()
          .includes(search)

      const matchesType =
        typeFilter === "All" ||
        item.entityType === typeFilter

      return matchesSearch && matchesType
    })
  }, [
    trashItems,
    searchTerm,
    typeFilter,
  ])

  // Trash statistics
  const employeeCount = trashItems.filter(
    (item) =>
      item.entityType === "Employee"
  ).length

  const documentCount = trashItems.filter(
    (item) =>
      item.entityType === "Document"
  ).length

  const invoiceCount = trashItems.filter(
    (item) =>
      item.entityType === "Invoice"
  ).length

  const otherCount =
    trashItems.length -
    employeeCount -
    documentCount -
    invoiceCount

  // Prepare data before restoring it to MongoDB
  function prepareRestoreData(
    data: Record<string, unknown>
  ) {
    const restoreData = {
      ...data,
    }

    delete restoreData.id
    delete restoreData._id

    return restoreData
  }

  // Restore deleted record to MongoDB
  async function handleRestore(id: string) {
    const item = trashItems.find(
      (trashItem) =>
        trashItem.id === id
    )

    if (!item) {
      return
    }

    const endpoint =
      restoreEndpoints[item.entityType]

    if (!endpoint) {
      showToast(
        "Restore endpoint not found",
        "error"
      )

      return
    }

    try {
      setRestoringId(id)

      const restoreData =
        prepareRestoreData(item.data)

      const response = await fetch(
        endpoint,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(
            restoreData
          ),
        }
      )

      if (!response.ok) {
        throw new Error(
          `Failed to restore ${item.entityType}`
        )
      }

      // Remove from Trash only after MongoDB restore succeeds
      restoreFromTrash(id)

      showToast(
        `${item.entityType} restored successfully`
      )
    } catch (error) {
      console.error(
        `Restore ${item.entityType} error:`,
        error
      )

      showToast(
        `Failed to restore ${item.entityType}`,
        "error"
      )
    } finally {
      setRestoringId(null)
    }
  }

  // Permanently remove one item from local Trash
  function confirmDeleteForever() {
    if (deleteId === null) {
      return
    }

    deleteForever(deleteId)
    setDeleteId(null)

    showToast(
      "Record permanently removed from Trash"
    )
  }

  // Permanently remove all Trash items
  function confirmEmptyTrash() {
    emptyTrash()
    setShowEmptyModal(false)

    showToast(
      "Trash emptied successfully"
    )
  }

  // Format deleted record date/time
  function formatDate(date: string) {
    return new Date(date).toLocaleDateString(
      "en-US",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
      }
    )
  }

  function formatTime(date: string) {
    return new Date(date).toLocaleTimeString(
      "en-US",
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    )
  }

  return (
    <main className="trash-page">
      {/* Hero */}
      <section className="trash-hero">
        <div className="trash-hero-content">
          <div className="trash-eyebrow">
            <span className="trash-live-dot" />
            SYSTEM RECOVERY
          </div>

          <div className="trash-title-row">
            <div className="trash-title-icon">
              <Trash2 size={29} />
            </div>

            <div className="trash-title-content">
              <h1>Trash</h1>

              <p>
                Review deleted records, restore
                important information, or permanently
                remove old data.
              </p>
            </div>
          </div>
        </div>

        <div className="trash-hero-right">
          <div className="trash-hero-stat">
            <span>Total Items</span>

            <strong>
              {trashItems.length}
            </strong>
          </div>

          <button
            type="button"
            className="empty-trash-btn"
            onClick={() =>
              setShowEmptyModal(true)
            }
            disabled={
              trashItems.length === 0
            }
          >
            <ArchiveX size={17} />
            Empty Trash
          </button>
        </div>
      </section>

      {/* Statistics */}
      <section className="trash-stats">
        <article className="trash-stat-card">
          <div className="trash-stat-icon total">
            <Files size={19} />
          </div>

          <div>
            <span>Total Deleted</span>

            <strong>
              {trashItems.length}
            </strong>
          </div>
        </article>

        <article className="trash-stat-card">
          <div className="trash-stat-icon employee">
            <Archive size={19} />
          </div>

          <div>
            <span>Employees</span>

            <strong>
              {employeeCount}
            </strong>
          </div>
        </article>

        <article className="trash-stat-card">
          <div className="trash-stat-icon document">
            <FileArchive size={19} />
          </div>

          <div>
            <span>Documents</span>

            <strong>
              {documentCount}
            </strong>
          </div>
        </article>

        <article className="trash-stat-card">
          <div className="trash-stat-icon invoice">
            <ArchiveRestore size={19} />
          </div>

          <div>
            <span>Other Records</span>

            <strong>
              {otherCount + invoiceCount}
            </strong>
          </div>
        </article>
      </section>

      {/* Search and filters */}
      <section className="trash-controls">
        <div className="trash-search">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search deleted records..."
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(
                event.target.value
              )
            }
          />
        </div>

        <div className="trash-filter">
          <label htmlFor="trash-type">
            Type
          </label>

          <select
            id="trash-type"
            value={typeFilter}
            onChange={(event) =>
              setTypeFilter(
                event.target.value
              )
            }
          >
            <option value="All">
              All Types
            </option>

            {availableTypes.map(
              (type) => (
                <option
                  key={type}
                  value={type}
                >
                  {type}
                </option>
              )
            )}
          </select>
        </div>

        <div className="trash-results">
          <strong>
            {filteredItems.length}
          </strong>

          <span>results</span>
        </div>
      </section>

      {/* Recovery notice */}
      {trashItems.length > 0 && (
        <div className="trash-notice">
          <CircleAlert size={17} />

          <p>
            Deleted records remain recoverable
            until you permanently remove them
            from Trash.
          </p>
        </div>
      )}

      {/* Trash records */}
      <section className="trash-grid">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <article
              className="trash-card"
              key={item.id}
            >
              <div className="trash-card-accent" />

              <div className="trash-card-header">
                <div className="trash-card-icon">
                  <FileArchive size={21} />
                </div>

                <div className="trash-card-type">
                  <span>Deleted Item</span>

                  <strong>
                    {item.entityType}
                  </strong>
                </div>

                <div className="trash-card-status">
                  <Clock3 size={13} />

                  <span>In Trash</span>
                </div>
              </div>

              <div className="trash-card-body">
                <h3>{item.title}</h3>

                <p>{item.subtitle}</p>
              </div>

              <div className="trash-card-meta">
                <div className="trash-meta-item">
                  <CalendarDays size={14} />

                  <span>
                    {formatDate(
                      item.deletedAt
                    )}
                  </span>
                </div>

                <div className="trash-meta-item">
                  <Clock3 size={14} />

                  <span>
                    {formatTime(
                      item.deletedAt
                    )}
                  </span>
                </div>
              </div>

              <div className="trash-card-footer">
                <div className="trash-retention">
                  <ArchiveRestore size={14} />

                  <span>Recoverable</span>
                </div>

                <div className="trash-actions">
                  <button
                    type="button"
                    className="trash-restore-btn"
                    onClick={() =>
                      handleRestore(
                        item.id
                      )
                    }
                    disabled={
                      restoringId ===
                      item.id
                    }
                  >
                    <RotateCcw size={15} />

                    <span>
                      {restoringId ===
                      item.id
                        ? "Restoring..."
                        : "Restore"}
                    </span>
                  </button>

                  <button
                    type="button"
                    className="trash-delete-btn"
                    onClick={() =>
                      setDeleteId(
                        item.id
                      )
                    }
                    disabled={
                      restoringId ===
                      item.id
                    }
                  >
                    <Trash2 size={15} />

                    <span>
                      Delete Forever
                    </span>
                  </button>
                </div>
              </div>
            </article>
          ))
        ) : (
          <div className="trash-empty-state">
            <div className="trash-empty-icon">
              <Trash2 size={31} />
            </div>

            <h2>
              {trashItems.length === 0
                ? "Trash is Empty"
                : "No Deleted Records Found"}
            </h2>

            <p>
              {trashItems.length === 0
                ? "Deleted records will appear here when you remove data from NEXORA."
                : "Try changing your search or type filter."}
            </p>

            {trashItems.length === 0 && (
              <div className="trash-empty-badge">
                <RotateCcw size={14} />
                Nothing needs recovery
              </div>
            )}
          </div>
        )}
      </section>

      {/* Delete forever confirmation */}
      {deleteId !== null && (
        <Modal
          title="Delete Forever"
          message="This record will be permanently removed from Trash. This action cannot be undone."
          onCancel={() =>
            setDeleteId(null)
          }
          onConfirm={
            confirmDeleteForever
          }
        />
      )}

      {/* Empty Trash confirmation */}
      {showEmptyModal && (
        <Modal
          title="Empty Trash"
          message={`Are you sure you want to permanently delete all ${trashItems.length} records from Trash? This action cannot be undone.`}
          onCancel={() =>
            setShowEmptyModal(false)
          }
          onConfirm={
            confirmEmptyTrash
          }
        />
      )}
    </main>
  )
}