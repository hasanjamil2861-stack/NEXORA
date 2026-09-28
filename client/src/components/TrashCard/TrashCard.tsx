import {
  ArchiveRestore,
  CalendarDays,
  Clock3,
  FileArchive,
  RotateCcw,
  Trash2,
} from "lucide-react"

import type { TrashItem } from "../../context/TrashContext"

type TrashCardProps = {
  item: TrashItem
  onRestore: (id: string) => void
  onDeleteForever: (id: string) => void
}

export default function TrashCard({
  item,
  onRestore,
  onDeleteForever,
}: TrashCardProps) {
  // Format deleted date for display
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

  // Format deleted time for display
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
    <article className="trash-card">
      <div className="trash-card-accent" />

      {/* Deleted item header */}
      <div className="trash-card-header">
        <div className="trash-card-icon">
          <FileArchive size={21} />
        </div>

        <div className="trash-card-type">
          <span>Deleted Item</span>

          <strong>{item.entityType}</strong>
        </div>

        <div className="trash-card-status">
          <Clock3 size={13} />

          <span>In Trash</span>
        </div>
      </div>

      {/* Deleted item information */}
      <div className="trash-card-body">
        <h3>{item.title}</h3>

        <p>{item.subtitle}</p>
      </div>

      {/* Deleted date and time */}
      <div className="trash-card-meta">
        <div className="trash-meta-item">
          <CalendarDays size={14} />

          <span>
            {formatDate(item.deletedAt)}
          </span>
        </div>

        <div className="trash-meta-item">
          <Clock3 size={14} />

          <span>
            {formatTime(item.deletedAt)}
          </span>
        </div>
      </div>

      {/* Restore and permanent delete actions */}
      <div className="trash-card-footer">
        <div className="trash-retention">
          <ArchiveRestore size={14} />

          <span>Recoverable</span>
        </div>

        <div className="trash-actions">
          <button
            type="button"
            className="trash-restore-btn"
            onClick={() => onRestore(item.id)}
          >
            <RotateCcw size={15} />

            <span>Restore</span>
          </button>

          <button
            type="button"
            className="trash-delete-btn"
            onClick={() =>
              onDeleteForever(item.id)
            }
          >
            <Trash2 size={15} />

            <span>Delete Forever</span>
          </button>
        </div>
      </div>
    </article>
  )
}