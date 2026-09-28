import {
  Banknote,
  Building2,
  CalendarDays,
  CircleCheck,
  CircleX,
  Clock3,
  FileSignature,
  Pencil,
  Trash2,
  UserRound,
} from "lucide-react"

import type { Contract } from "../../types/Contract"

type ContractCardProps = {
  contract: Contract
  onDelete: (id: string) => void
  onEdit: (id: string) => void
}

export default function ContractCard({
  contract,
  onDelete,
  onEdit,
}: ContractCardProps) {
  // Determine contract status and type
  const isActive = contract.status === "Active"
  const isExpired = contract.status === "Expired"
  const isEmployee = contract.contractType === "Employee"

  const statusClass = isActive
    ? "active"
    : isExpired
      ? "expired"
      : "pending"

  return (
    <article className="contract-card">
      {/* Status accent and card header */}
      <div
        className={`contract-card-accent ${statusClass}`}
      />

      <div className="contract-card-top">
        <div className="contract-card-icon">
          <FileSignature size={19} />
        </div>

        <div
          className={`contract-status ${statusClass}`}
        >
          {isActive ? (
            <CircleCheck size={13} />
          ) : isExpired ? (
            <CircleX size={13} />
          ) : (
            <Clock3 size={13} />
          )}

          {contract.status}
        </div>
      </div>

      {/* Contract information */}
      <div className="contract-card-title">
        <span>
          {isEmployee
            ? "EMPLOYEE CONTRACT"
            : "CLIENT CONTRACT"}
        </span>

        <h2>{contract.partyName}</h2>

        <small>
          Contract #{contract.id}
        </small>
      </div>

      {/* Contract type */}
      <div className="contract-type-box">
        <div className="contract-type-icon">
          {isEmployee ? (
            <UserRound size={15} />
          ) : (
            <Building2 size={15} />
          )}
        </div>

        <div>
          <span>Contract Type</span>

          <strong>
            {contract.contractType}
          </strong>
        </div>
      </div>

      {/* Contract value */}
      <div className="contract-value-box">
        <div className="contract-value-icon">
          <Banknote size={17} />
        </div>

        <div>
          <span>Contract Value</span>

          <strong>
            ${contract.value.toLocaleString()}
          </strong>
        </div>
      </div>

      {/* Contract dates */}
      <div className="contract-details">
        <div className="contract-detail-item">
          <div className="contract-detail-icon">
            <CalendarDays size={14} />
          </div>

          <div>
            <span>Start Date</span>

            <strong>
              {contract.startDate}
            </strong>
          </div>
        </div>

        <div className="contract-detail-item">
          <div className="contract-detail-icon">
            <CalendarDays size={14} />
          </div>

          <div>
            <span>End Date</span>

            <strong>
              {contract.endDate}
            </strong>
          </div>
        </div>
      </div>

      {/* Status and actions */}
      <div className="contract-card-footer">
        <div>
          <span>Current Status</span>

          <strong
            className={
              isActive
                ? "active-text"
                : isExpired
                  ? "expired-text"
                  : "pending-text"
            }
          >
            {contract.status}
          </strong>
        </div>

        <div className="contract-footer-actions">
          <button
            type="button"
            className="contract-edit-btn"
            onClick={() => onEdit(contract.id)}
          >
            <Pencil size={14} />
            Edit
          </button>

          <button
            type="button"
            className="contract-delete-btn"
            onClick={() => onDelete(contract.id)}
          >
            <Trash2 size={14} />
            Delete
          </button>
        </div>
      </div>
    </article>
  )
}