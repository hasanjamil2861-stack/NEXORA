import {
  Archive,
  ArrowUpRight,
  CalendarDays,
  CircleCheck,
  ExternalLink,
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
import { useAuth } from "../../context/AuthContext"

const API_URL =
  "https://nexora-3-v485.onrender.com"

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
  const { user } = useAuth()

  const isAdmin =
    user?.role === "Admin"

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

  const typeClass =
    document.type.toLowerCase()

  const isActive =
    document.status === "Active"

  const handleViewDocument =
    async () => {
      if (!document.fileUrl) {
        return
      }

      const token =
        localStorage.getItem(
          "nexora-token"
        )

      if (!token) {
        return
      }

      const newTab =
        window.open(
          "",
          "_blank"
        )

      if (!newTab) {
        return
      }

      try {
        const fileUrl =
          document.fileUrl.startsWith(
            "http"
          )
            ? document.fileUrl
            : `${API_URL}${document.fileUrl}`

        const response =
          await fetch(
            fileUrl,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          )

        if (!response.ok) {
          throw new Error(
            "Failed to open document."
          )
        }

        const blob =
          await response.blob()

        const blobUrl =
          URL.createObjectURL(
            blob
          )

        newTab.location.href =
          blobUrl

        setTimeout(() => {
          URL.revokeObjectURL(
            blobUrl
          )
        }, 60000)
      } catch (error) {
        console.error(
          "View document error:",
          error
        )

        newTab.close()
      }
    }

  return (
    <article
      className={`document-card document-card-${typeClass}`}
    >
      <div className="document-card-accent" />

      <div className="document-card-header">
        <div className="document-card-type-icon">
          {getTypeIcon()}
        </div>

        <div className="document-card-header-content">
          <span className="document-card-label">
            DOCUMENT
          </span>

          <h2>
            {document.name}
          </h2>
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

          <span>
            {document.status}
          </span>
        </div>
      </div>

      <div className="document-card-meta">
        <div className="document-meta-item">
          <div className="document-meta-icon">
            <FileText size={15} />
          </div>

          <div>
            <span>
              Type
            </span>

            <strong>
              {document.type}
            </strong>
          </div>
        </div>

        <div className="document-meta-item">
          <div className="document-meta-icon">
            <FolderOpen size={15} />
          </div>

          <div>
            <span>
              Category
            </span>

            <strong>
              {document.category}
            </strong>
          </div>
        </div>
      </div>

      <div className="document-card-details">
        <div className="document-detail-row">
          <div className="document-detail-left">
            <UserRound size={16} />

            <span>
              Uploaded By
            </span>
          </div>

          <strong>
            {document.uploadedBy}
          </strong>
        </div>

        <div className="document-detail-row">
          <div className="document-detail-left">
            <CalendarDays size={16} />

            <span>
              Upload Date
            </span>
          </div>

          <strong>
            {document.uploadDate}
          </strong>
        </div>
      </div>

      <div className="document-card-footer">
        <div className="document-card-reference">
          <FileText size={14} />

          <span>
            DOC-
            {document.id
              .slice(-4)
              .toUpperCase()}
          </span>
        </div>

        <div className="document-card-actions">
          {document.fileUrl && (
            <button
              type="button"
              className="document-view-btn"
              onClick={
                handleViewDocument
              }
              title="View Document"
            >
              <ExternalLink size={15} />

              <span>
                View
              </span>
            </button>
          )}

          {isAdmin && (
            <>
              <button
                type="button"
                className="document-edit-btn"
                onClick={() =>
                  onEdit(
                    document.id
                  )
                }
                title="Edit Document"
              >
                <Pencil size={15} />

                <span>
                  Edit
                </span>
              </button>

              <button
                type="button"
                className="document-delete-btn"
                onClick={() =>
                  onDelete(
                    document.id
                  )
                }
                title="Delete Document"
              >
                <Trash2 size={15} />

                <span>
                  Delete
                </span>
              </button>
            </>
          )}
        </div>
      </div>

      <div className="document-card-hover-icon">
        <ArrowUpRight size={16} />
      </div>
    </article>
  )
}