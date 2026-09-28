import {
  Archive,
  ArrowUpRight,
  CalendarDays,
  CircleCheck,
  FilePenLine,
  FileSpreadsheet,
  FileText,
  FileType2,
  FolderOpen,
  Image,
  Pencil,
  Trash2,
  UserRound,
} from "lucide-react"

import type { Document } from "../../types/Document"

type DocumentCardProps = {
  document: Document
  onDelete: (id: string) => void
  onEdit: (id: string) => void
}

export default function DocumentCard({
  document,
  onDelete,
  onEdit,
}: DocumentCardProps) {
  // Return the correct icon based on document type
  const getTypeIcon = () => {
    switch (document.type) {
      case "PDF":
        return <FileType2 size={22} />

      case "Word":
        return <FilePenLine size={22} />

      case "Excel":
        return <FileSpreadsheet size={22} />

      case "Image":
        return <Image size={22} />

      default:
        return <FileText size={22} />
    }
  }

  // Determine document type and status styles
  const typeClass = document.type.toLowerCase()
  const isActive = document.status === "Active"

  return (
    <article
      className={`document-card document-card-${typeClass}`}
    >
      <div className="document-card-accent" />

      {/* Document header and status */}
      <div className="document-card-header">
        <div className="document-card-type-icon">
          {getTypeIcon()}
        </div>

        <div className="document-card-header-content">
          <span className="document-card-label">
            DOCUMENT
          </span>

          <h2>{document.name}</h2>
        </div>

        <div
          className={`document-card-status ${
            isActive
              ? "document-status-active"
              : "document-status-archived"
          }`}
        >
          {isActive ? (
            <CircleCheck size={14} />
          ) : (
            <Archive size={14} />
          )}

          <span>{document.status}</span>
        </div>
      </div>

      {/* Document type and category */}
      <div className="document-card-meta">
        <div className="document-meta-item">
          <div className="document-meta-icon">
            <FileText size={15} />
          </div>

          <div>
            <span>Type</span>

            <strong>{document.type}</strong>
          </div>
        </div>

        <div className="document-meta-item">
          <div className="document-meta-icon">
            <FolderOpen size={15} />
          </div>

          <div>
            <span>Category</span>

            <strong>{document.category}</strong>
          </div>
        </div>
      </div>

      {/* Upload information */}
      <div className="document-card-details">
        <div className="document-detail-row">
          <div className="document-detail-left">
            <UserRound size={16} />
            <span>Uploaded By</span>
          </div>

          <strong>{document.uploadedBy}</strong>
        </div>

        <div className="document-detail-row">
          <div className="document-detail-left">
            <CalendarDays size={16} />
            <span>Upload Date</span>
          </div>

          <strong>{document.uploadDate}</strong>
        </div>
      </div>

      {/* Document reference and actions */}
      <div className="document-card-footer">
        <div className="document-card-reference">
          <FileText size={14} />

          <span>
            DOC-{document.id.slice(-4).toUpperCase()}
          </span>
        </div>

        <div className="document-card-actions">
          <button
            type="button"
            className="document-edit-btn"
            onClick={() => onEdit(document.id)}
            title="Edit Document"
          >
            <Pencil size={15} />
            <span>Edit</span>
          </button>

          <button
            type="button"
            className="document-delete-btn"
            onClick={() => onDelete(document.id)}
            title="Delete Document"
          >
            <Trash2 size={15} />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Hover indicator */}
      <div className="document-card-hover-icon">
        <ArrowUpRight size={16} />
      </div>
    </article>
  )
}