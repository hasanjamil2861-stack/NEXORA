import {
  Banknote,
  CalendarDays,
  CircleAlert,
  CircleCheck,
  Clock3,
  Package,
  Pencil,
  Receipt,
  Trash2,
  UserRound,
} from "lucide-react"

import type { Invoice } from "../../types/Invoice"

type InvoiceCardProps = {
  invoice: Invoice
  onDelete: (id: string) => void
  onEdit: (id: string) => void
}

export default function InvoiceCard({
  invoice,
  onDelete,
  onEdit,
}: InvoiceCardProps) {
  // Determine invoice status
  const isPaid = invoice.status === "Paid"
  const isOverdue = invoice.status === "Overdue"
  const isPending = invoice.status === "Pending"
  const isCancelled = invoice.status === "Cancelled"

  const statusClass = isPaid
    ? "paid"
    : isOverdue
      ? "overdue"
      : isPending
        ? "pending"
        : "cancelled"

  return (
    <article className="invoice-card">
      {/* Status accent */}
      <div
        className={`invoice-card-accent ${statusClass}`}
      />

      {/* Invoice header */}
      <div className="invoice-card-header">
        <div className="invoice-header-left">
          <div className="invoice-icon">
            <Receipt size={19} />
          </div>

          <div className="invoice-title-content">
            <span>INVOICE</span>

            <h2>{invoice.invoiceNumber}</h2>
          </div>
        </div>

        <div
          className={`invoice-status ${statusClass}`}
        >
          {isPaid && <CircleCheck size={13} />}
          {isOverdue && <CircleAlert size={13} />}
          {isPending && <Clock3 size={13} />}
          {isCancelled && <CircleAlert size={13} />}

          <span>{invoice.status}</span>
        </div>
      </div>

      {/* Client information */}
      <div className="invoice-client-box">
        <div className="invoice-client-icon">
          <UserRound size={15} />
        </div>

        <div>
          <span>Billed To</span>

          <strong>{invoice.clientName}</strong>
        </div>
      </div>

      {/* Invoice dates */}
      <div className="invoice-dates">
        <div className="invoice-date-item">
          <div className="invoice-date-icon">
            <CalendarDays size={14} />
          </div>

          <div>
            <span>Issue Date</span>

            <strong>{invoice.issueDate}</strong>
          </div>
        </div>

        <div className="invoice-date-item">
          <div className="invoice-date-icon">
            <CalendarDays size={14} />
          </div>

          <div>
            <span>Due Date</span>

            <strong>{invoice.dueDate}</strong>
          </div>
        </div>
      </div>

      {/* Invoice items */}
      <div className="invoice-items">
        <div className="invoice-items-header">
          <div className="invoice-items-title">
            <div className="invoice-items-icon">
              <Package size={14} />
            </div>

            <div>
              <h3>Invoice Items</h3>

              <span>
                {invoice.items.length} item
                {invoice.items.length !== 1
                  ? "s"
                  : ""}
              </span>
            </div>
          </div>
        </div>

        <div className="invoice-items-list">
          {invoice.items.map((item, index) => (
            <div
              className="invoice-item"
              key={index}
            >
              <div className="invoice-item-info">
                <strong>{item.description}</strong>

                <span>
                  {item.quantity} × ${item.unitPrice}
                </span>
              </div>

              <strong className="invoice-item-total">
                $
                {(
                  item.quantity * item.unitPrice
                ).toLocaleString()}
              </strong>
            </div>
          ))}
        </div>
      </div>

      {/* Invoice financial summary */}
      <div className="invoice-summary">
        <div className="invoice-summary-row">
          <span>Subtotal</span>

          <strong>
            ${invoice.subtotal.toLocaleString()}
          </strong>
        </div>

        <div className="invoice-summary-row">
          <span>Tax</span>

          <strong>
            ${invoice.tax.toLocaleString()}
          </strong>
        </div>

        <div className="invoice-total">
          <div className="invoice-total-label">
            <div className="invoice-total-icon">
              <Banknote size={15} />
            </div>

            <span>Total Amount</span>
          </div>

          <strong>
            ${invoice.total.toLocaleString()}
          </strong>
        </div>
      </div>

      {/* Invoice status and actions */}
      <div className="invoice-card-footer">
        <div className="invoice-footer-status">
          <span>Current Status</span>

          <strong
            className={`${statusClass}-text`}
          >
            {invoice.status}
          </strong>
        </div>

        <div className="invoice-actions">
          <button
            type="button"
            className="invoice-edit-btn"
            onClick={() => onEdit(invoice.id)}
          >
            <Pencil size={13} />
            <span>Edit</span>
          </button>

          <button
            type="button"
            className="invoice-delete-btn"
            onClick={() => onDelete(invoice.id)}
          >
            <Trash2 size={13} />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </article>
  )
}