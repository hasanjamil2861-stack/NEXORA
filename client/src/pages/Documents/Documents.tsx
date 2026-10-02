import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react"

import {
  Search,
  FileText,
  Files,
  FileCheck2,
  Archive,
  FileType2,
  Image,
  FileSpreadsheet,
  FilePenLine,
  Plus,
  SlidersHorizontal,
  ArrowUpDown,
  FolderOpen,
  UploadCloud,
  Activity,
  Database,
  CircleCheck,
  Clock3,
  HardDrive,
  X,
} from "lucide-react"

import { useToast } from "../../context/ToastContext"
import { useTrash } from "../../context/TrashContext"
import { useAuth } from "../../context/AuthContext"

import type { Document } from "../../types/Document"
import DocumentCard from "../../components/DocumentCard/DocumentCard"
import Modal from "../../components/Modal/Modal"

import {
  getDocuments,
  updateDocument,
  deleteDocument,
} from "../../services/api/documentApi"

import {
  uploadDocument,
} from "../../services/api/documentUploadApi"

type DocumentEmployee = {
  _id: string
  firstName: string
  lastName: string
  email: string
  position: string
}

type DocumentWithEmployee = Document & {
  employeeId?: string | DocumentEmployee | null
}

type DocumentApiRecord = {
  _id: string
  name?: string
  type?: Document["type"]
  category?: Document["category"]
  employeeId?: string | DocumentEmployee | null
  uploadedBy?: string | {
    _id: string
    name: string
    email: string
    role: string
  }
  uploadDate?: string
  status?: Document["status"]
  fileUrl?: string
}

type DocumentFormData = {
  name: string
  type: Document["type"]
  category: Document["category"]
  employeeId: string
  uploadedBy: string
  uploadDate: string
  status: Document["status"]
}

const emptyDocumentForm: DocumentFormData = {
  name: "",
  type: "PDF",
  category: "Employee",
  employeeId: "",
  uploadedBy: "",
  uploadDate: "",
  status: "Active",
}

export default function Documents() {
  const { showToast } = useToast()
  const { moveToTrash } = useTrash()
  const { user } = useAuth()

  const isAdmin =
    user?.role === "Admin"

  const [documentList, setDocumentList] =
    useState<DocumentWithEmployee[]>([])

  const [showForm, setShowForm] =
    useState(false)

  const [formData, setFormData] =
    useState<DocumentFormData>(
      emptyDocumentForm
    )

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null)

  const [editingDocument, setEditingDocument] =
    useState<string | null>(null)

  const [documentToDelete, setDocumentToDelete] =
    useState<string | null>(null)

  const [newDocumentId, setNewDocumentId] =
    useState<string | null>(null)

  const [search, setSearch] =
    useState("")

  const [typeFilter, setTypeFilter] =
    useState("All")

  const [categoryFilter, setCategoryFilter] =
    useState("All")

  const [statusFilter, setStatusFilter] =
    useState("All")

  const [sortOption, setSortOption] =
    useState("name-asc")

  const [formError, setFormError] =
    useState("")

  const documentFormRef =
    useRef<HTMLFormElement | null>(null)

  const fileInputRef =
    useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const data =
          (await getDocuments()) as DocumentApiRecord[]

        const formattedDocuments:
          DocumentWithEmployee[] =
          data.map((document) => ({
            id:
              document._id,

            name:
              document.name ?? "",

            type:
              document.type ?? "PDF",

            category:
              document.category ??
              "Employee",

            employeeId:
              document.employeeId ??
              null,

            uploadedBy:
              typeof document.uploadedBy ===
              "string"
                ? document.uploadedBy
                : document.uploadedBy?.name ??
                  "",

            uploadDate:
              document.uploadDate ?? "",

            status:
              document.status ?? "Active",

            fileUrl:
              document.fileUrl ?? "",
          }))

        setDocumentList(
          formattedDocuments
        )
      } catch {
        showToast(
          "Failed to load documents",
          "error"
        )
      }
    }

    fetchDocuments()
  }, [showToast])

  useEffect(() => {
    if (!newDocumentId) {
      return
    }

    const frame =
      requestAnimationFrame(() => {
        const newDocument =
          document.getElementById(
            `document-${newDocumentId}`
          )

        if (newDocument) {
          newDocument.scrollIntoView({
            behavior: "smooth",
            block: "center",
          })
        }

        setNewDocumentId(null)
      })

    return () =>
      cancelAnimationFrame(frame)
  }, [newDocumentId])

  const resetForm = () => {
    setFormData({
      ...emptyDocumentForm,
    })

    setSelectedFile(null)
    setEditingDocument(null)
    setFormError("")

    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const openDocumentForm = () => {
    resetForm()
    setShowForm(true)

    requestAnimationFrame(() => {
      documentFormRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    })
  }

  const updateFormField = <
    K extends keyof DocumentFormData
  >(
    field: K,
    value: DocumentFormData[K]
  ) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }))

    setFormError("")
  }

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      event.target.files?.[0] ??
      null

    if (!file) {
      setSelectedFile(null)
      return
    }

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "image/jpeg",
      "image/png",
      "image/webp",
    ]

    if (
      !allowedTypes.includes(
        file.type
      )
    ) {
      setSelectedFile(null)

      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }

      setFormError(
        "Only PDF, Word, Excel and image files are allowed."
      )

      return
    }

    const maxSize =
      10 * 1024 * 1024

    if (file.size > maxSize) {
      setSelectedFile(null)

      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }

      setFormError(
        "File size must be 10MB or less."
      )

      return
    }

    setSelectedFile(file)
    setFormError("")
  }

  const handleRemoveFile = () => {
    setSelectedFile(null)

    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault()

    if (!formData.name.trim()) {
      setFormError(
        "Document name is required."
      )
      return
    }

    if (!formData.uploadDate) {
      setFormError(
        "Upload date is required."
      )
      return
    }

    if (
      editingDocument !== null &&
      !isAdmin
    ) {
      return
    }

    if (
      editingDocument === null &&
      !selectedFile
    ) {
      setFormError(
        "Please select a file to upload."
      )
      return
    }

    if (
      isAdmin &&
      formData.category ===
        "Employee" &&
      !formData.employeeId.trim()
    ) {
      setFormError(
        "Employee assignment is required."
      )
      return
    }

    if (editingDocument !== null) {
      try {
        const updatedDocument =
          (await updateDocument(
            editingDocument,
            {
              name:
                formData.name.trim(),

              type:
                formData.type,

              category:
                formData.category,

              employeeId:
                isAdmin &&
                formData.category ===
                  "Employee"
                  ? formData.employeeId.trim()
                  : null,

              uploadedBy:
                isAdmin
                  ? formData.uploadedBy.trim()
                  : undefined,

              uploadDate:
                formData.uploadDate,

              status:
                formData.status,
            } as Parameters<
              typeof updateDocument
            >[1]
          )) as DocumentApiRecord

        const formattedDocument:
          DocumentWithEmployee = {
          id:
            updatedDocument._id,

          name:
            updatedDocument.name ??
            "",

          type:
            updatedDocument.type ??
            "PDF",

          category:
            updatedDocument.category ??
            "Employee",

          employeeId:
            updatedDocument.employeeId ??
            null,

          uploadedBy:
            typeof updatedDocument.uploadedBy ===
            "string"
              ? updatedDocument.uploadedBy
              : updatedDocument.uploadedBy?.name ??
                "",

          uploadDate:
            updatedDocument.uploadDate ??
            "",

          status:
            updatedDocument.status ??
            "Active",

          fileUrl:
            updatedDocument.fileUrl ??
            "",
        }

        setDocumentList((current) =>
          current.map((document) =>
            document.id ===
            editingDocument
              ? formattedDocument
              : document
          )
        )

        showToast(
          "Document updated successfully",
          "success"
        )

        resetForm()
        setShowForm(false)
      } catch {
        showToast(
          "Failed to update document",
          "error"
        )
      }

      return
    }

    if (!selectedFile) {
      setFormError(
        "Please select a file to upload."
      )
      return
    }

    try {
      const uploadedDocument =
        (await uploadDocument({
          name:
            formData.name.trim(),

          category:
            formData.category,

          file:
            selectedFile,

          projectId:
            undefined,

          taskId:
            undefined,
        })) as DocumentApiRecord

      const formattedDocument:
        DocumentWithEmployee = {
        id:
          uploadedDocument._id,

        name:
          uploadedDocument.name ??
          formData.name.trim(),

        type:
          uploadedDocument.type ??
          "PDF",

        category:
          uploadedDocument.category ??
          formData.category,

        employeeId:
          uploadedDocument.employeeId ??
          null,

        uploadedBy:
          typeof uploadedDocument.uploadedBy ===
          "string"
            ? uploadedDocument.uploadedBy
            : uploadedDocument.uploadedBy?.name ??
              "",

        uploadDate:
          uploadedDocument.uploadDate ??
          formData.uploadDate,

        status:
          uploadedDocument.status ??
          "Active",

        fileUrl:
          uploadedDocument.fileUrl ??
          "",
      }

      setDocumentList((current) => [
        ...current,
        formattedDocument,
      ])

      setNewDocumentId(
        formattedDocument.id
      )

      showToast(
        "Document uploaded successfully",
        "success"
      )

      resetForm()
      setShowForm(false)
    } catch (error) {
      showToast(
        error instanceof Error
          ? error.message
          : "Failed to upload document",
        "error"
      )
    }
  }

  const handleEdit = (
    id: string
  ) => {
    if (!isAdmin) {
      return
    }

    const documentToEdit =
      documentList.find(
        (document) =>
          document.id === id
      )

    if (!documentToEdit) {
      return
    }

    const employeeId =
      typeof documentToEdit.employeeId ===
      "string"
        ? documentToEdit.employeeId
        : documentToEdit.employeeId?._id ??
          ""

    setEditingDocument(id)

    setSelectedFile(null)

    setFormData({
      name:
        documentToEdit.name,

      type:
        documentToEdit.type,

      category:
        documentToEdit.category,

      employeeId,

      uploadedBy:
        documentToEdit.uploadedBy,

      uploadDate:
        documentToEdit.uploadDate,

      status:
        documentToEdit.status,
    })

    setFormError("")
    setShowForm(true)

    requestAnimationFrame(() => {
      documentFormRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    })
  }

  const handleDelete = (
    id: string
  ) => {
    if (!isAdmin) {
      return
    }

    setDocumentToDelete(id)
  }

  const confirmDelete = async () => {
    if (
      documentToDelete === null ||
      !isAdmin
    ) {
      return
    }

    const document =
      documentList.find(
        (item) =>
          item.id ===
          documentToDelete
      )

    if (!document) {
      return
    }

    try {
      await deleteDocument(
        documentToDelete
      )

      moveToTrash(
        "Document",
        document.id,
        document.name,
        `${document.category} Document`,
        document as unknown as Record<
          string,
          unknown
        >
      )

      setDocumentList((current) =>
        current.filter(
          (item) =>
            item.id !==
            documentToDelete
        )
      )

      setDocumentToDelete(null)

      showToast(
        "Document moved to Trash",
        "success"
      )
    } catch {
      showToast(
        "Failed to delete document",
        "error"
      )
    }
  }

  const handleCancelForm = () => {
    resetForm()
    setShowForm(false)
  }

  const filteredDocuments =
    [...documentList]
      .filter((document) => {
        const searchValue =
          search
            .toLowerCase()
            .trim()

        const documentName =
          document.name.toLowerCase()

        const uploadedByValue =
          document.uploadedBy.toLowerCase()

        const matchesSearch =
          documentName.includes(
            searchValue
          ) ||
          uploadedByValue.includes(
            searchValue
          )

        const matchesType =
          typeFilter === "All" ||
          document.type ===
            typeFilter

        const matchesCategory =
          categoryFilter === "All" ||
          document.category ===
            categoryFilter

        const matchesStatus =
          statusFilter === "All" ||
          document.status ===
            statusFilter

        return (
          matchesSearch &&
          matchesType &&
          matchesCategory &&
          matchesStatus
        )
      })
      .sort((a, b) => {
        switch (sortOption) {
          case "name-asc":
            return a.name.localeCompare(
              b.name
            )

          case "name-desc":
            return b.name.localeCompare(
              a.name
            )

          case "date-newest":
            return (
              new Date(
                b.uploadDate
              ).getTime() -
              new Date(
                a.uploadDate
              ).getTime()
            )

          case "date-oldest":
            return (
              new Date(
                a.uploadDate
              ).getTime() -
              new Date(
                b.uploadDate
              ).getTime()
            )

          case "type-asc":
            return a.type.localeCompare(
              b.type
            )

          case "category-asc":
            return a.category.localeCompare(
              b.category
            )

          case "status-asc":
            return a.status.localeCompare(
              b.status
            )

          default:
            return 0
        }
      })

  const totalDocuments =
    documentList.length

  const activeDocuments =
    documentList.filter(
      (document) =>
        document.status ===
        "Active"
    ).length

  const archivedDocuments =
    documentList.filter(
      (document) =>
        document.status ===
        "Archived"
    ).length

  const pdfDocuments =
    documentList.filter(
      (document) =>
        document.type === "PDF"
    ).length

  const wordDocuments =
    documentList.filter(
      (document) =>
        document.type === "Word"
    ).length

  const excelDocuments =
    documentList.filter(
      (document) =>
        document.type === "Excel"
    ).length

  const imageDocuments =
    documentList.filter(
      (document) =>
        document.type === "Image"
    ).length

  const employeeDocuments =
    documentList.filter(
      (document) =>
        document.category ===
        "Employee"
    ).length

  const contractDocuments =
    documentList.filter(
      (document) =>
        document.category ===
        "Contract"
    ).length

  const invoiceDocuments =
    documentList.filter(
      (document) =>
        document.category ===
        "Invoice"
    ).length

  const projectDocuments =
    documentList.filter(
      (document) =>
        document.category ===
        "Project"
    ).length

  const companyDocuments =
    documentList.filter(
      (document) =>
        document.category ===
        "Company"
    ).length

  const activePercentage =
    totalDocuments > 0
      ? Math.round(
          (activeDocuments /
            totalDocuments) *
            100
        )
      : 0

  const largestTypeCount =
    Math.max(
      pdfDocuments,
      wordDocuments,
      excelDocuments,
      imageDocuments,
      1
    )

  return (
    <main className="documents-page">
      <section className="documents-hero">
        <div className="documents-hero-content">
          <div className="documents-eyebrow">
            <span className="documents-live-dot" />
            NEXORA DOCUMENT CENTER
          </div>

          <div className="documents-title-row">
            <div className="documents-title-icon">
              <Files
                size={31}
                strokeWidth={2.2}
              />

              <span className="documents-title-status">
                <Activity size={11} />
              </span>
            </div>

            <div className="documents-title-content">
              <h1>Documents</h1>

              <p>
                Centralize, organize and
                manage company documents
                from one place.
              </p>
            </div>
          </div>
        </div>

        <div className="documents-hero-right">
          <div className="documents-health-card">
            <div className="documents-health-icon">
              <Database size={19} />
            </div>

            <div>
              <span>
                DOCUMENT STORAGE
              </span>

              <strong>
                Operational
              </strong>
            </div>

            <CircleCheck
              size={20}
              className="documents-health-check"
            />
          </div>

          <button
            type="button"
            className="documents-add-btn"
            onClick={() => {
              if (showForm) {
                handleCancelForm()
              } else {
                openDocumentForm()
              }
            }}
          >
            <Plus size={19} />

            {showForm
              ? "Close Form"
              : "Add Document"}
          </button>
        </div>
      </section>

      <section className="documents-stats">
        <article className="document-stat-card documents-stat-blue">
          <div className="document-stat-icon">
            <Files size={21} />
          </div>

          <div className="document-stat-content">
            <span>
              Total Documents
            </span>

            <strong>
              {totalDocuments}
            </strong>

            <small>
              <Activity size={12} />
              Complete document inventory
            </small>
          </div>
        </article>

        <article className="document-stat-card documents-stat-green">
          <div className="document-stat-icon">
            <FileCheck2 size={21} />
          </div>

          <div className="document-stat-content">
            <span>
              Active Documents
            </span>

            <strong>
              {activeDocuments}
            </strong>

            <small>
              <CircleCheck size={12} />
              {activePercentage}% currently active
            </small>
          </div>
        </article>

        <article className="document-stat-card documents-stat-orange">
          <div className="document-stat-icon">
            <Archive size={21} />
          </div>

          <div className="document-stat-content">
            <span>
              Archived
            </span>

            <strong>
              {archivedDocuments}
            </strong>

            <small>
              <HardDrive size={12} />
              Stored for reference
            </small>
          </div>
        </article>

        <article className="document-stat-card documents-stat-purple">
          <div className="document-stat-icon">
            <FileText size={21} />
          </div>

          <div className="document-stat-content">
            <span>
              PDF Documents
            </span>

            <strong>
              {pdfDocuments}
            </strong>

            <small>
              <FileType2 size={12} />
              Most common format
            </small>
          </div>
        </article>
      </section>

      <section className="documents-analytics">
        <div className="documents-analytics-card">
          <div className="documents-section-heading">
            <div className="documents-section-icon">
              <SlidersHorizontal size={18} />
            </div>

            <div>
              <h2>
                Document Overview
              </h2>

              <p>
                Current document distribution
              </p>
            </div>
          </div>

          <div className="documents-type-rows">
            {[
              [
                "PDF",
                pdfDocuments,
                "pdf",
                <FileType2 size={16} />,
              ],
              [
                "Word",
                wordDocuments,
                "word",
                <FilePenLine size={16} />,
              ],
              [
                "Excel",
                excelDocuments,
                "excel",
                <FileSpreadsheet size={16} />,
              ],
              [
                "Images",
                imageDocuments,
                "image",
                <Image size={16} />,
              ],
            ].map(
              ([
                label,
                count,
                className,
                icon,
              ]) => (
                <div
                  className="documents-type-row"
                  key={String(label)}
                >
                  <div className="documents-type-info">
                    <span
                      className={`documents-type-symbol ${String(
                        className
                      )}`}
                    >
                      {icon}
                    </span>

                    <span>
                      {label}
                    </span>
                  </div>

                  <div className="documents-progress">
                    <span
                      style={{
                        width: `${
                          (Number(count) /
                            largestTypeCount) *
                          100
                        }%`,
                      }}
                    />
                  </div>

                  <strong>
                    {count}
                  </strong>
                </div>
              )
            )}
          </div>
        </div>

        <div className="documents-analytics-card">
          <div className="documents-section-heading">
            <div className="documents-section-icon">
              <FolderOpen size={18} />
            </div>

            <div>
              <h2>
                Categories
              </h2>

              <p>
                Documents by business area
              </p>
            </div>
          </div>

          <div className="documents-category-grid">
            <div className="documents-category-item">
              <span>
                <FileText size={15} />
                Employees
              </span>

              <strong>
                {employeeDocuments}
              </strong>
            </div>

            <div className="documents-category-item">
              <span>
                <FilePenLine size={15} />
                Contracts
              </span>

              <strong>
                {contractDocuments}
              </strong>
            </div>

            <div className="documents-category-item">
              <span>
                <FileText size={15} />
                Invoices
              </span>

              <strong>
                {invoiceDocuments}
              </strong>
            </div>

            <div className="documents-category-item">
              <span>
                <FolderOpen size={15} />
                Projects
              </span>

              <strong>
                {projectDocuments}
              </strong>
            </div>

            <div className="documents-category-item">
              <span>
                <Database size={15} />
                Company
              </span>

              <strong>
                {companyDocuments}
              </strong>
            </div>
          </div>
        </div>
      </section>

      {showForm && (
        <section className="documents-form-card">
          <div className="documents-form-header">
            <div className="documents-form-heading">
              <div className="documents-form-icon">
                {editingDocument !== null ? (
                  <FilePenLine size={20} />
                ) : (
                  <UploadCloud size={20} />
                )}
              </div>

              <div>
                <span>
                  {editingDocument !== null
                    ? "DOCUMENT EDITOR"
                    : "DOCUMENT UPLOAD"}
                </span>

                <h2>
                  {editingDocument !== null
                    ? "Edit Document"
                    : "Upload New Document"}
                </h2>
              </div>
            </div>

            <div className="documents-form-badge">
              <CircleCheck size={14} />
              All fields required
            </div>
          </div>

          <form
            ref={documentFormRef}
            onSubmit={handleSubmit}
          >
            <div className="documents-field">
              <label>
                Document Name
              </label>

              <div className="documents-input-wrapper">
                <FileText size={17} />

                <input
                  type="text"
                  placeholder="Enter document name"
                  value={formData.name}
                  required
                  onChange={(event) =>
                    updateFormField(
                      "name",
                      event.target.value
                    )
                  }
                />
              </div>
            </div>

            {editingDocument === null && (
              <div className="documents-field">
                <label>
                  File
                </label>

                <div className="documents-input-wrapper">
                  <UploadCloud size={17} />

                  <input
                    ref={fileInputRef}
                    type="file"
                    required
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.webp"
                    onChange={
                      handleFileChange
                    }
                  />
                </div>

                <small>
                  PDF, Word, Excel or Image • Maximum 10MB
                </small>

                {selectedFile && (
                  <div className="documents-selected-file">
                    <div>
                      <FileText size={16} />

                      <span>
                        {selectedFile.name}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={
                        handleRemoveFile
                      }
                      title="Remove file"
                    >
                      <X size={15} />
                    </button>
                  </div>
                )}
              </div>
            )}

            {editingDocument !== null && (
              <div className="documents-field">
                <label>
                  Document Type
                </label>

                <div className="documents-input-wrapper">
                  <FileType2 size={17} />

                  <select
                    value={formData.type}
                    required
                    onChange={(event) =>
                      updateFormField(
                        "type",
                        event.target.value as Document["type"]
                      )
                    }
                  >
                    <option value="PDF">
                      PDF
                    </option>

                    <option value="Word">
                      Word
                    </option>

                    <option value="Excel">
                      Excel
                    </option>

                    <option value="Image">
                      Image
                    </option>
                  </select>
                </div>
              </div>
            )}

            <div className="documents-field">
              <label>
                Category
              </label>

              <div className="documents-input-wrapper">
                <FolderOpen size={17} />

                <select
                  value={formData.category}
                  required
                  onChange={(event) =>
                    updateFormField(
                      "category",
                      event.target.value as Document["category"]
                    )
                  }
                >
                  <option value="Employee">
                    Employee
                  </option>

                  {isAdmin && (
                    <>
                      <option value="Contract">
                        Contract
                      </option>

                      <option value="Invoice">
                        Invoice
                      </option>

                      <option value="Project">
                        Project
                      </option>

                      <option value="Company">
                        Company
                      </option>
                    </>
                  )}
                </select>
              </div>
            </div>

            {isAdmin &&
              formData.category ===
                "Employee" && (
                <div className="documents-field">
                  <label>
                    Employee ID
                  </label>

                  <div className="documents-input-wrapper">
                    <FileText size={17} />

                    <input
                      type="text"
                      placeholder="Enter employee MongoDB ID"
                      value={
                        formData.employeeId
                      }
                      required
                      onChange={(event) =>
                        updateFormField(
                          "employeeId",
                          event.target.value
                        )
                      }
                    />
                  </div>
                </div>
              )}

            {isAdmin && (
              <div className="documents-field">
                <label>
                  Uploaded By
                </label>

                <div className="documents-input-wrapper">
                  <FilePenLine size={17} />

                  <input
                    type="text"
                    placeholder="Enter uploader name"
                    value={
                      formData.uploadedBy
                    }
                    onChange={(event) =>
                      updateFormField(
                        "uploadedBy",
                        event.target.value
                      )
                    }
                  />
                </div>
              </div>
            )}

            <div className="documents-field">
              <label>
                Upload Date
              </label>

              <div className="documents-input-wrapper">
                <Clock3 size={17} />

                <input
                  type="date"
                  value={
                    formData.uploadDate
                  }
                  required
                  onChange={(event) =>
                    updateFormField(
                      "uploadDate",
                      event.target.value
                    )
                  }
                />
              </div>
            </div>

            <div className="documents-field">
              <label>
                Status
              </label>

              <div className="documents-input-wrapper">
                <Activity size={17} />

                <select
                  value={
                    formData.status
                  }
                  required
                  disabled={!isAdmin}
                  onChange={(event) =>
                    updateFormField(
                      "status",
                      event.target.value as Document["status"]
                    )
                  }
                >
                  <option value="Active">
                    Active
                  </option>

                  {isAdmin && (
                    <option value="Archived">
                      Archived
                    </option>
                  )}
                </select>
              </div>
            </div>

            {formError && (
              <div className="documents-form-error">
                <Clock3 size={16} />

                <span>
                  {formError}
                </span>
              </div>
            )}

            <div className="documents-form-actions">
              <button
                type="submit"
                className="documents-submit-btn"
              >
                {editingDocument !==
                null ? (
                  <>
                    <FileCheck2 size={17} />
                    Update Document
                  </>
                ) : (
                  <>
                    <UploadCloud size={17} />
                    Upload Document
                  </>
                )}
              </button>

              <button
                type="button"
                className="documents-cancel-btn"
                onClick={
                  handleCancelForm
                }
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      )}

      <section className="documents-controls">
        <div className="documents-controls-header">
          <div>
            <span className="documents-controls-eyebrow">
              DOCUMENT EXPLORER
            </span>

            <h2>
              Browse Documents
            </h2>
          </div>

          <div className="documents-result-count">
            <Files size={15} />

            {filteredDocuments.length}{" "}
            result
            {filteredDocuments.length !==
            1
              ? "s"
              : ""}
          </div>
        </div>

        <div className="documents-controls-row">
          <div className="documents-search">
            <Search size={18} />

            <input
              type="text"
              placeholder="Search by document or uploader..."
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
            />
          </div>

          <div className="documents-filter">
            <FileType2 size={16} />

            <select
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

              <option value="PDF">
                PDF
              </option>

              <option value="Word">
                Word
              </option>

              <option value="Excel">
                Excel
              </option>

              <option value="Image">
                Image
              </option>
            </select>
          </div>

          <div className="documents-filter">
            <FolderOpen size={16} />

            <select
              value={categoryFilter}
              onChange={(event) =>
                setCategoryFilter(
                  event.target.value
                )
              }
            >
              <option value="All">
                All Categories
              </option>

              <option value="Employee">
                Employee
              </option>

              {isAdmin && (
                <>
                  <option value="Contract">
                    Contract
                  </option>

                  <option value="Invoice">
                    Invoice
                  </option>

                  <option value="Project">
                    Project
                  </option>

                  <option value="Company">
                    Company
                  </option>
                </>
              )}
            </select>
          </div>

          <div className="documents-filter">
            <Activity size={16} />

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(
                  event.target.value
                )
              }
            >
              <option value="All">
                All Statuses
              </option>

              <option value="Active">
                Active
              </option>

              <option value="Archived">
                Archived
              </option>
            </select>
          </div>

          <div className="documents-filter">
            <ArrowUpDown size={16} />

            <select
              value={sortOption}
              onChange={(event) =>
                setSortOption(
                  event.target.value
                )
              }
            >
              <option value="name-asc">
                Name: A → Z
              </option>

              <option value="name-desc">
                Name: Z → A
              </option>

              <option value="date-newest">
                Upload Date: Newest
              </option>

              <option value="date-oldest">
                Upload Date: Oldest
              </option>

              <option value="type-asc">
                Type: A → Z
              </option>

              <option value="category-asc">
                Category: A → Z
              </option>

              <option value="status-asc">
                Status: A → Z
              </option>
            </select>
          </div>
        </div>
      </section>

      <section className="documents-grid">
        {filteredDocuments.length >
        0 ? (
          filteredDocuments.map(
            (document) => (
              <div
                key={document.id}
                id={`document-${document.id}`}
              >
                <DocumentCard
                  document={document}
                  onDelete={
                    handleDelete
                  }
                  onEdit={handleEdit}
                />
              </div>
            )
          )
        ) : (
          <div className="documents-empty">
            <div className="documents-empty-icon">
              <Files size={32} />
            </div>

            <h2>
              No Documents Found
            </h2>

            <p>
              No documents match your
              current search or filters.
            </p>

            <button
              type="button"
              onClick={() => {
                setSearch("")
                setTypeFilter("All")
                setCategoryFilter(
                  "All"
                )
                setStatusFilter("All")
              }}
            >
              <Search size={16} />
              Clear Filters
            </button>
          </div>
        )}
      </section>

      {documentToDelete !==
        null &&
        isAdmin && (
          <Modal
            title="Delete Document"
            message="Are you sure you want to move this document to Trash? You can recover it later from the Trash page."
            onCancel={() =>
              setDocumentToDelete(
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