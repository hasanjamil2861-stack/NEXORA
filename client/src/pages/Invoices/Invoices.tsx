import {
  useEffect,
  useRef,
  useState,
} from "react"

import {
  Search,
  Receipt,
  FileText,
  CircleCheck,
  Clock3,
  CircleAlert,
  Banknote,
  Plus,
} from "lucide-react"

import { useToast } from "../../context/ToastContext"
import { useTrash } from "../../context/TrashContext"

import InvoiceCard from "../../components/InvoiceCard/InvoiceCard"
import Modal from "../../components/Modal/Modal"

import type { Invoice } from "../../types/Invoice"

import {
  getInvoices,
  createInvoice,
  updateInvoice,
  deleteInvoice,
} from "../../services/api/invoiceApi"

type InvoiceStatus =
  | "Pending"
  | "Paid"
  | "Overdue"
  | "Cancelled"

type InvoiceForm = {
  invoiceNumber: string
  clientName: string
  issueDate: string
  dueDate: string
  subtotal: number | ""
  tax: number | ""
  status: InvoiceStatus
}

type InvoiceApiRecord = {
  _id: string
  invoiceNumber?: string
  clientName?: string
  issueDate?: string
  dueDate?: string
  items?: Invoice["items"]
  subtotal?: number
  tax?: number
  total?: number
  status?: InvoiceStatus
}

const initialInvoiceForm: InvoiceForm = {
  invoiceNumber: "",
  clientName: "",
  issueDate: "",
  dueDate: "",
  subtotal: "",
  tax: "",
  status: "Pending",
}

export default function Invoices() {
  const { showToast } = useToast()
  const { moveToTrash } = useTrash()

  const [invoiceList, setInvoiceList] =
    useState<Invoice[]>([])

  const [searchTerm, setSearchTerm] =
    useState("")

  const [statusFilter, setStatusFilter] =
    useState<
      "All" | "Pending" | "Paid" | "Overdue" | "Cancelled"
    >("All")

  const [sortOption, setSortOption] =
    useState<
      | "default"
      | "number-asc"
      | "number-desc"
      | "issue-asc"
      | "issue-desc"
      | "due-asc"
      | "due-desc"
      | "total-asc"
      | "total-desc"
    >("default")

  const [editingInvoiceId, setEditingInvoiceId] =
    useState<string | null>(null)

  const [invoiceToDelete, setInvoiceToDelete] =
    useState<string | null>(null)

  const [editError, setEditError] =
    useState("")

  const [addError, setAddError] =
    useState("")

  const [isAdding, setIsAdding] =
    useState(false)

  const [newInvoiceId, setNewInvoiceId] =
    useState<string | null>(null)

  const addFormRef =
    useRef<HTMLFormElement | null>(null)

  const editFormRef =
    useRef<HTMLFormElement | null>(null)

  const [editForm, setEditForm] =
    useState<InvoiceForm>(initialInvoiceForm)

  const [addForm, setAddForm] =
    useState<InvoiceForm>(initialInvoiceForm)

  // Load invoices from MongoDB.
  useEffect(() => {
    async function fetchInvoices() {
      try {
        const data =
          (await getInvoices()) as InvoiceApiRecord[]

        const formattedInvoices: Invoice[] =
          data.map((invoice) => ({
            id: invoice._id,
            invoiceNumber:
              invoice.invoiceNumber ?? "",
            clientName:
              invoice.clientName ?? "",
            issueDate:
              invoice.issueDate ?? "",
            dueDate:
              invoice.dueDate ?? "",
            items:
              invoice.items ?? [],
            subtotal:
              invoice.subtotal ?? 0,
            tax:
              invoice.tax ?? 0,
            total:
              invoice.total ?? 0,
            status:
              invoice.status ?? "Pending",
          }))

        setInvoiceList(formattedInvoices)
      } catch (error) {
        console.log(
          "Fetch invoices error:",
          error
        )

        showToast(
          "Failed to load invoices",
          "error"
        )
      }
    }

    fetchInvoices()
  }, [showToast])

  // Scroll to the newly created invoice.
  useEffect(() => {
    if (!newInvoiceId) {
      return
    }

    const frame = requestAnimationFrame(() => {
      const newInvoice =
        document.getElementById(
          `invoice-${newInvoiceId}`
        )

      if (newInvoice) {
        newInvoice.scrollIntoView({
          behavior: "smooth",
          block: "center",
        })
      }

      setNewInvoiceId(null)
    })

    return () => {
      cancelAnimationFrame(frame)
    }
  }, [newInvoiceId])

  function openInvoiceForm() {
    setIsAdding(true)
    setAddError("")

    requestAnimationFrame(() => {
      addFormRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    })
  }

  function handleDelete(id: string) {
    setInvoiceToDelete(id)
  }

  // Delete from MongoDB, then move the record to local Trash.
  async function confirmDelete() {
    if (invoiceToDelete === null) {
      return
    }

    const invoice = invoiceList.find(
      (item) =>
        item.id === invoiceToDelete
    )

    if (!invoice) {
      return
    }

    try {
      await deleteInvoice(invoiceToDelete)

      moveToTrash(
        "Invoice",
        invoice.id,
        invoice.invoiceNumber,
        invoice.clientName,
        invoice as unknown as Record<string, unknown>
      )

      setInvoiceList((currentInvoices) =>
        currentInvoices.filter(
          (item) =>
            item.id !== invoiceToDelete
        )
      )

      setInvoiceToDelete(null)

      showToast(
        "Invoice moved to Trash",
        "success"
      )
    } catch (error) {
      console.log(
        "Delete invoice error:",
        error
      )

      showToast(
        "Failed to delete invoice",
        "error"
      )
    }
  }

  function handleEdit(id: string) {
    const invoice = invoiceList.find(
      (item) => item.id === id
    )

    if (!invoice) {
      return
    }

    setEditingInvoiceId(id)
    setEditError("")

    setEditForm({
      invoiceNumber:
        invoice.invoiceNumber,
      clientName:
        invoice.clientName,
      issueDate:
        invoice.issueDate,
      dueDate:
        invoice.dueDate,
      subtotal:
        invoice.subtotal,
      tax:
        invoice.tax,
      status:
        invoice.status,
    })

    requestAnimationFrame(() => {
      editFormRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    })
  }

  function validateForm(form: InvoiceForm) {
    if (!form.invoiceNumber.trim()) {
      return "Invoice number is required."
    }

    if (!form.clientName.trim()) {
      return "Client name is required."
    }

    if (!form.issueDate) {
      return "Issue date is required."
    }

    if (!form.dueDate) {
      return "Due date is required."
    }

    if (form.dueDate < form.issueDate) {
      return "Due date cannot be before issue date."
    }

    if (form.subtotal === "") {
      return "Subtotal is required."
    }

    if (Number(form.subtotal) <= 0) {
      return "Subtotal must be greater than 0."
    }

    if (form.tax === "") {
      return "Tax is required."
    }

    if (Number(form.tax) < 0) {
      return "Tax cannot be negative."
    }

    return ""
  }

  // Update the invoice in MongoDB.
  async function handleSave() {
    if (editingInvoiceId === null) {
      return
    }

    const error = validateForm(editForm)

    if (error) {
      setEditError(error)
      return
    }

    const subtotal = Number(editForm.subtotal)
    const tax = Number(editForm.tax)
    const total = subtotal + tax

    const updatedData = {
      invoiceNumber:
        editForm.invoiceNumber.trim(),
      clientName:
        editForm.clientName.trim(),
      issueDate:
        editForm.issueDate,
      dueDate:
        editForm.dueDate,
      subtotal,
      tax,
      total,
      status:
        editForm.status,
    }

    try {
      const updatedInvoice =
        (await updateInvoice(
          editingInvoiceId,
          updatedData
        )) as InvoiceApiRecord

      const formattedInvoice: Invoice = {
        id: updatedInvoice._id,
        invoiceNumber:
          updatedInvoice.invoiceNumber ?? "",
        clientName:
          updatedInvoice.clientName ?? "",
        issueDate:
          updatedInvoice.issueDate ?? "",
        dueDate:
          updatedInvoice.dueDate ?? "",
        items:
          updatedInvoice.items ?? [],
        subtotal:
          updatedInvoice.subtotal ?? 0,
        tax:
          updatedInvoice.tax ?? 0,
        total:
          updatedInvoice.total ?? 0,
        status:
          updatedInvoice.status ?? "Pending",
      }

      setInvoiceList((currentInvoices) =>
        currentInvoices.map((invoice) =>
          invoice.id === editingInvoiceId
            ? formattedInvoice
            : invoice
        )
      )

      setEditingInvoiceId(null)
      setEditError("")
      setEditForm(initialInvoiceForm)

      showToast(
        "Invoice updated successfully",
        "success"
      )
    } catch (error) {
      console.log(
        "Update invoice error:",
        error
      )

      showToast(
        "Failed to update invoice",
        "error"
      )
    }
  }

  function handleCancel() {
    setEditingInvoiceId(null)
    setEditError("")
    setEditForm(initialInvoiceForm)
  }

  // Create the invoice in MongoDB.
  async function handleAdd() {
    const error = validateForm(addForm)

    if (error) {
      setAddError(error)
      return
    }

    const subtotal = Number(addForm.subtotal)
    const tax = Number(addForm.tax)
    const total = subtotal + tax

    const newInvoiceData = {
      invoiceNumber:
        addForm.invoiceNumber.trim(),
      clientName:
        addForm.clientName.trim(),
      issueDate:
        addForm.issueDate,
      dueDate:
        addForm.dueDate,
      items: [],
      subtotal,
      tax,
      total,
      status:
        addForm.status,
    }

    try {
      const createdInvoice =
        (await createInvoice(
          newInvoiceData
        )) as InvoiceApiRecord

      const formattedInvoice: Invoice = {
        id: createdInvoice._id,
        invoiceNumber:
          createdInvoice.invoiceNumber ?? "",
        clientName:
          createdInvoice.clientName ?? "",
        issueDate:
          createdInvoice.issueDate ?? "",
        dueDate:
          createdInvoice.dueDate ?? "",
        items:
          createdInvoice.items ?? [],
        subtotal:
          createdInvoice.subtotal ?? 0,
        tax:
          createdInvoice.tax ?? 0,
        total:
          createdInvoice.total ?? 0,
        status:
          createdInvoice.status ?? "Pending",
      }

      setInvoiceList((currentInvoices) => [
        ...currentInvoices,
        formattedInvoice,
      ])

      setNewInvoiceId(formattedInvoice.id)
      setAddForm(initialInvoiceForm)
      setAddError("")
      setIsAdding(false)

      showToast(
        "Invoice added successfully",
        "success"
      )
    } catch (error) {
      console.log(
        "Add invoice error:",
        error
      )

      showToast(
        "Failed to add invoice",
        "error"
      )
    }
  }

  function handleCancelAdd() {
    setIsAdding(false)
    setAddError("")
    setAddForm(initialInvoiceForm)
  }

  // Invoice statistics.
  const totalInvoices = invoiceList.length

  const paidInvoices =
    invoiceList.filter(
      (invoice) =>
        invoice.status === "Paid"
    ).length

  const pendingInvoices =
    invoiceList.filter(
      (invoice) =>
        invoice.status === "Pending"
    ).length

  const overdueInvoices =
    invoiceList.filter(
      (invoice) =>
        invoice.status === "Overdue"
    ).length

  const totalInvoiceValue =
    invoiceList.reduce(
      (total, invoice) =>
        total + invoice.total,
      0
    )

  // Search, filter, and sort invoices.
  const filteredInvoices =
    [...invoiceList]
      .filter((invoice) => {
        const search =
          searchTerm.toLowerCase()

        const invoiceNumber =
          invoice.invoiceNumber
            .toLowerCase()

        const clientName =
          invoice.clientName
            .toLowerCase()

        return (
          invoiceNumber.includes(search) ||
          clientName.includes(search)
        )
      })
      .filter((invoice) =>
        statusFilter === "All"
          ? true
          : invoice.status === statusFilter
      )
      .sort((a, b) => {
        switch (sortOption) {
          case "number-asc":
            return a.invoiceNumber.localeCompare(
              b.invoiceNumber
            )

          case "number-desc":
            return b.invoiceNumber.localeCompare(
              a.invoiceNumber
            )

          case "issue-asc":
            return (
              new Date(a.issueDate).getTime() -
              new Date(b.issueDate).getTime()
            )

          case "issue-desc":
            return (
              new Date(b.issueDate).getTime() -
              new Date(a.issueDate).getTime()
            )

          case "due-asc":
            return (
              new Date(a.dueDate).getTime() -
              new Date(b.dueDate).getTime()
            )

          case "due-desc":
            return (
              new Date(b.dueDate).getTime() -
              new Date(a.dueDate).getTime()
            )

          case "total-asc":
            return a.total - b.total

          case "total-desc":
            return b.total - a.total

          default:
            return 0
        }
      })

  return (
    <main className="invoices-page">
      <header className="invoices-page-header">
        <div className="invoices-header-main">
          <span className="invoices-eyebrow">
            FINANCE MANAGEMENT
          </span>

          <div className="invoices-title-row">
            <div className="invoices-title-icon">
              <Receipt size={24} />
            </div>

            <div className="invoices-title-content">
              <h1>Invoices</h1>

              <p>
                Manage client invoices, payment
                status, billing dates, and financial
                activity from one centralized workspace.
              </p>
            </div>
          </div>
        </div>

        <div className="invoices-header-right">
          <div className="invoices-header-stats">
            <div className="invoices-header-stat">
              <div className="invoices-header-stat-icon total">
                <FileText size={16} />
              </div>

              <div>
                <span>Total</span>
                <strong>{totalInvoices}</strong>
              </div>
            </div>

            <div className="invoices-header-stat">
              <div className="invoices-header-stat-icon paid">
                <CircleCheck size={16} />
              </div>

              <div>
                <span>Paid</span>
                <strong>{paidInvoices}</strong>
              </div>
            </div>

            <div className="invoices-header-stat">
              <div className="invoices-header-stat-icon pending">
                <Clock3 size={16} />
              </div>

              <div>
                <span>Pending</span>
                <strong>{pendingInvoices}</strong>
              </div>
            </div>

            <div className="invoices-header-stat">
              <div className="invoices-header-stat-icon overdue">
                <CircleAlert size={16} />
              </div>

              <div>
                <span>Overdue</span>
                <strong>{overdueInvoices}</strong>
              </div>
            </div>
          </div>

          <div className="invoices-header-value">
            <div className="invoices-header-value-icon">
              <Banknote size={17} />
            </div>

            <div>
              <span>Total Value</span>

              <strong>
                $
                {totalInvoiceValue.toLocaleString()}
              </strong>
            </div>
          </div>

          <button
            type="button"
            className="add-invoice-btn"
            onClick={openInvoiceForm}
          >
            <Plus size={16} />
            Add Invoice
          </button>
        </div>
      </header>

      {/* Add invoice form */}
      {isAdding && (
        <form
          ref={addFormRef}
          className="invoice-form"
          onSubmit={(event) => {
            event.preventDefault()
            handleAdd()
          }}
        >
          <h2>Add Invoice</h2>

          <input
            type="text"
            placeholder="Invoice Number"
            value={addForm.invoiceNumber}
            required
            onChange={(event) => {
              setAddForm({
                ...addForm,
                invoiceNumber:
                  event.target.value,
              })
              setAddError("")
            }}
          />

          <input
            type="text"
            placeholder="Client Name"
            value={addForm.clientName}
            required
            onChange={(event) => {
              setAddForm({
                ...addForm,
                clientName:
                  event.target.value,
              })
              setAddError("")
            }}
          />

          <input
            type="date"
            value={addForm.issueDate}
            required
            onChange={(event) => {
              setAddForm({
                ...addForm,
                issueDate:
                  event.target.value,
              })
              setAddError("")
            }}
          />

          <input
            type="date"
            value={addForm.dueDate}
            min={
              addForm.issueDate || undefined
            }
            required
            onChange={(event) => {
              setAddForm({
                ...addForm,
                dueDate:
                  event.target.value,
              })
              setAddError("")
            }}
          />

          <input
            type="number"
            placeholder="Subtotal"
            value={addForm.subtotal}
            min="0.01"
            step="0.01"
            required
            onChange={(event) => {
              setAddForm({
                ...addForm,
                subtotal:
                  event.target.value === ""
                    ? ""
                    : Number(
                        event.target.value
                      ),
              })
              setAddError("")
            }}
          />

          <input
            type="number"
            placeholder="Tax"
            value={addForm.tax}
            min="0"
            step="0.01"
            required
            onChange={(event) => {
              setAddForm({
                ...addForm,
                tax:
                  event.target.value === ""
                    ? ""
                    : Number(
                        event.target.value
                      ),
              })
              setAddError("")
            }}
          />

          <div className="invoice-form-total">
            <span>Total</span>

            <strong>
              $
              {(
                Number(addForm.subtotal || 0) +
                Number(addForm.tax || 0)
              ).toLocaleString()}
            </strong>
          </div>

          <select
            value={addForm.status}
            required
            onChange={(event) => {
              setAddForm({
                ...addForm,
                status:
                  event.target.value as InvoiceStatus,
              })
              setAddError("")
            }}
          >
            <option value="Pending">Pending</option>
            <option value="Paid">Paid</option>
            <option value="Overdue">Overdue</option>
            <option value="Cancelled">
              Cancelled
            </option>
          </select>

          {addError && (
            <p className="invoice-form-error">
              {addError}
            </p>
          )}

          <button
            type="submit"
            className="invoice-save-btn"
          >
            Save
          </button>

          <button
            type="button"
            className="invoice-cancel-btn"
            onClick={handleCancelAdd}
          >
            Cancel
          </button>
        </form>
      )}

      {/* Edit invoice form */}
      {editingInvoiceId !== null && (
        <form
          ref={editFormRef}
          className="invoice-form"
          onSubmit={(event) => {
            event.preventDefault()
            handleSave()
          }}
        >
          <h2>Edit Invoice</h2>

          <input
            type="text"
            placeholder="Invoice Number"
            value={editForm.invoiceNumber}
            required
            onChange={(event) => {
              setEditForm({
                ...editForm,
                invoiceNumber:
                  event.target.value,
              })
              setEditError("")
            }}
          />

          <input
            type="text"
            placeholder="Client Name"
            value={editForm.clientName}
            required
            onChange={(event) => {
              setEditForm({
                ...editForm,
                clientName:
                  event.target.value,
              })
              setEditError("")
            }}
          />

          <input
            type="date"
            value={editForm.issueDate}
            required
            onChange={(event) => {
              setEditForm({
                ...editForm,
                issueDate:
                  event.target.value,
              })
              setEditError("")
            }}
          />

          <input
            type="date"
            value={editForm.dueDate}
            min={
              editForm.issueDate || undefined
            }
            required
            onChange={(event) => {
              setEditForm({
                ...editForm,
                dueDate:
                  event.target.value,
              })
              setEditError("")
            }}
          />

          <input
            type="number"
            placeholder="Subtotal"
            value={editForm.subtotal}
            min="0.01"
            step="0.01"
            required
            onChange={(event) => {
              setEditForm({
                ...editForm,
                subtotal:
                  event.target.value === ""
                    ? ""
                    : Number(
                        event.target.value
                      ),
              })
              setEditError("")
            }}
          />

          <input
            type="number"
            placeholder="Tax"
            value={editForm.tax}
            min="0"
            step="0.01"
            required
            onChange={(event) => {
              setEditForm({
                ...editForm,
                tax:
                  event.target.value === ""
                    ? ""
                    : Number(
                        event.target.value
                      ),
              })
              setEditError("")
            }}
          />

          <div className="invoice-form-total">
            <span>Total</span>

            <strong>
              $
              {(
                Number(editForm.subtotal || 0) +
                Number(editForm.tax || 0)
              ).toLocaleString()}
            </strong>
          </div>

          <select
            value={editForm.status}
            required
            onChange={(event) => {
              setEditForm({
                ...editForm,
                status:
                  event.target.value as InvoiceStatus,
              })
              setEditError("")
            }}
          >
            <option value="Pending">Pending</option>
            <option value="Paid">Paid</option>
            <option value="Overdue">Overdue</option>
            <option value="Cancelled">
              Cancelled
            </option>
          </select>

          {editError && (
            <p className="invoice-form-error">
              {editError}
            </p>
          )}

          <button
            type="submit"
            className="invoice-save-btn"
          >
            Save
          </button>

          <button
            type="button"
            className="invoice-cancel-btn"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </form>
      )}

      {/* Search, filters, and sorting */}
      <div className="invoices-controls">
        <div className="invoices-search">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search invoice or client..."
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(event.target.value)
            }
          />
        </div>

        <select
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(
              event.target.value as
                | "All"
                | "Pending"
                | "Paid"
                | "Overdue"
                | "Cancelled"
            )
          }
        >
          <option value="All">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Paid">Paid</option>
          <option value="Overdue">Overdue</option>
          <option value="Cancelled">
            Cancelled
          </option>
        </select>

        <select
          value={sortOption}
          onChange={(event) =>
            setSortOption(
              event.target.value as
                | "default"
                | "number-asc"
                | "number-desc"
                | "issue-asc"
                | "issue-desc"
                | "due-asc"
                | "due-desc"
                | "total-asc"
                | "total-desc"
            )
          }
        >
          <option value="default">
            Default Order
          </option>
          <option value="number-asc">
            Invoice A-Z
          </option>
          <option value="number-desc">
            Invoice Z-A
          </option>
          <option value="issue-asc">
            Issue Date: Oldest
          </option>
          <option value="issue-desc">
            Issue Date: Newest
          </option>
          <option value="due-asc">
            Due Date: Oldest
          </option>
          <option value="due-desc">
            Due Date: Newest
          </option>
          <option value="total-asc">
            Total: Lowest
          </option>
          <option value="total-desc">
            Total: Highest
          </option>
        </select>
      </div>

      {/* Invoice list */}
      <div className="invoices-grid">
        {filteredInvoices.length > 0 ? (
          filteredInvoices.map((invoice) => (
            <div
              key={invoice.id}
              id={`invoice-${invoice.id}`}
            >
              <InvoiceCard
                invoice={invoice}
                onDelete={handleDelete}
                onEdit={handleEdit}
              />
            </div>
          ))
        ) : (
          <div className="invoice-empty">
            <h2>No invoices found</h2>

            <p>
              Try changing your search
              or filters.
            </p>
          </div>
        )}
      </div>

      {/* Delete confirmation */}
      {invoiceToDelete !== null && (
        <Modal
          title="Delete Invoice"
          message="Are you sure you want to move this invoice to Trash? You can recover it later from the Trash page."
          onCancel={() =>
            setInvoiceToDelete(null)
          }
          onConfirm={confirmDelete}
        />
      )}
    </main>
  )
}