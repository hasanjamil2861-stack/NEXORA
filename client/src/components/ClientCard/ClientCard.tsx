import {
  Building2,
  CircleCheck,
  CircleX,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Trash2,
  UserRound,
} from "lucide-react"

import type { Client } from "../../types/Client"

type ClientCardProps = {
  client: Client
  onDelete: (id: string) => void
  onEdit: (id: string) => void
}

export default function ClientCard({
  client,
  onDelete,
  onEdit,
}: ClientCardProps) {
  // Determine client status
  const isActive = client.status === "Active"

  // Create short company initials
  const initials = client.companyName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase()

  return (
    <article className="client-card">
      {/* Client header */}
      <div className="client-card-header">
        <div className="client-company-info">
          <div className="client-avatar">
            {initials}
          </div>

          <div>
            <span className="client-card-label">
              BUSINESS CLIENT
            </span>

            <h2>{client.companyName}</h2>

            <span className="client-id">
              Client #{client.id}
            </span>
          </div>
        </div>

        {/* Client status */}
        <div
          className={`client-status-badge ${
            isActive ? "active" : "inactive"
          }`}
        >
          {isActive ? (
            <CircleCheck size={13} />
          ) : (
            <CircleX size={13} />
          )}

          {client.status}
        </div>
      </div>

      {/* Client information */}
      <div className="client-details">
        <div className="client-detail-row">
          <div className="client-detail-icon">
            <UserRound size={14} />
          </div>

          <div className="client-detail-content">
            <span>Contact Person</span>
            <strong>{client.contactPerson}</strong>
          </div>
        </div>

        <div className="client-detail-row">
          <div className="client-detail-icon">
            <Mail size={14} />
          </div>

          <div className="client-detail-content">
            <span>Email</span>
            <strong className="client-email">
              {client.email}
            </strong>
          </div>
        </div>

        <div className="client-detail-row">
          <div className="client-detail-icon">
            <Phone size={14} />
          </div>

          <div className="client-detail-content">
            <span>Phone</span>
            <strong>{client.phone}</strong>
          </div>
        </div>

        <div className="client-detail-row">
          <div className="client-detail-icon">
            <MapPin size={14} />
          </div>

          <div className="client-detail-content">
            <span>Address</span>
            <strong>{client.address}</strong>
          </div>
        </div>
      </div>

      {/* Client footer */}
      <div className="client-card-footer">
        <div className="client-type">
          <Building2 size={14} />
          <span>Company Account</span>
        </div>

        <span className="client-status-text">
          {isActive
            ? "Currently Active"
            : "Currently Inactive"}
        </span>
      </div>

      {/* Client actions */}
      <div className="client-actions">
        <button
          type="button"
          className="client-edit-btn"
          onClick={() => onEdit(client.id)}
        >
          <Pencil size={14} />
          Edit
        </button>

        <button
          type="button"
          className="client-delete-btn"
          onClick={() => onDelete(client.id)}
        >
          <Trash2 size={14} />
          Delete
        </button>
      </div>
    </article>
  )
}