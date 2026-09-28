type ModalProps = {
  title: string
  message: string
  onCancel: () => void
  onConfirm: () => void
}

export default function Modal({
  title,
  message,
  onCancel,
  onConfirm,
}: ModalProps) {
  return (
    <div className="modal-overlay">
      <div className="modal">
        {/* Confirmation message and actions */}
        <h2>{title}</h2>

        <p>{message}</p>

        <div className="modal-actions">
          <button
            type="button"
            className="modal-cancel-btn"
            onClick={onCancel}
          >
            Cancel
          </button>

          <button
            type="button"
            className="modal-confirm-btn"
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}