import {
  CalendarDays,
  CircleDollarSign,
  Pencil,
  Trash2,
  UserRound,
} from "lucide-react"

import type { Contract } from "../../types/Contract"
import { useAuth } from "../../context/AuthContext"

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
  const { user } = useAuth()

  const isAdmin =
    user?.role === "Admin"

  return (
    <article className="contract-card">
      <div className="contract-card-header">
        <div>
          <span>
            {contract.contractType}
          </span>

          <h2>
            {contract.partyName}
          </h2>
        </div>

        <span
          className={`contract-status contract-status-${contract.status.toLowerCase()}`}
        >
          {contract.status}
        </span>
      </div>

      <div className="contract-details">
        <div className="contract-detail-item">
          <UserRound size={16} />

          <div>
            <span>Party</span>
            <strong>
              {contract.partyName}
            </strong>
          </div>
        </div>

        <div className="contract-detail-item">
          <CalendarDays size={16} />

          <div>
            <span>Timeline</span>
            <strong>
              {contract.startDate} →{" "}
              {contract.endDate}
            </strong>
          </div>
        </div>

        <div className="contract-detail-item">
          <CircleDollarSign size={16} />

          <div>
            <span>Value</span>
            <strong>
              $
              {contract.value.toLocaleString()}
            </strong>
          </div>
        </div>
      </div>

      {isAdmin && (
        <div className="contract-card-actions">
          <button
            type="button"
            className="contract-edit-btn"
            onClick={() =>
              onEdit(contract.id)
            }
          >
            <Pencil size={15} />
            Edit
          </button>

          <button
            type="button"
            className="contract-delete-btn"
            onClick={() =>
              onDelete(contract.id)
            }
          >
            <Trash2 size={15} />
            Delete
          </button>
        </div>
      )}
    </article>
  )
}