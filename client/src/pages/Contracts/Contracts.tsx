import { useEffect, useRef, useState } from "react"

import {
  Search,
  FileSignature,
  Activity,
  CircleCheck,
  Clock3,
  Banknote,
  Plus,
} from "lucide-react"

import ContractCard from "../../components/ContractCard/ContractCard"
import Modal from "../../components/Modal/Modal"
import { useToast } from "../../context/ToastContext"
import { useTrash } from "../../context/TrashContext"
import { useAuth } from "../../context/AuthContext"
import type { Contract } from "../../types/Contract"

import {
  getContracts,
  createContract,
  updateContract,
  deleteContract,
} from "../../services/api/contractApi"

type ContractForm = {
  partyName: string
  contractType: "Employee" | "Client"
  startDate: string
  endDate: string
  value: number | ""
  status: "Active" | "Expired" | "Pending"
}

type ContractApiRecord = {
  _id: string
  partyName?: string
  contractType?: "Employee" | "Client"
  startDate?: string
  endDate?: string
  value?: number
  status?: "Active" | "Expired" | "Pending"
}

function formatContract(
  contract: ContractApiRecord
): Contract {
  return {
    id: contract._id,
    partyName: contract.partyName ?? "",
    contractType:
      contract.contractType ?? "Employee",
    startDate: contract.startDate ?? "",
    endDate: contract.endDate ?? "",
    value: contract.value ?? 0,
    status: contract.status ?? "Pending",
  }
}

export default function Contracts() {
  const { user } = useAuth()

  const isAdmin =
    user?.role === "Admin"

  const [contractList, setContractList] =
    useState<Contract[]>([])

  const [searchTerm, setSearchTerm] =
    useState("")

  const [statusFilter, setStatusFilter] =
    useState<
      "All" | "Active" | "Expired" | "Pending"
    >("All")

  const [typeFilter, setTypeFilter] =
    useState<
      "All" | "Employee" | "Client"
    >("All")

  const [sortOption, setSortOption] =
    useState<
      | "default"
      | "name-asc"
      | "name-desc"
      | "date-asc"
      | "date-desc"
      | "value-asc"
      | "value-desc"
    >("default")

  const [
    editingContractId,
    setEditingContractId,
  ] = useState<string | null>(null)

  const [
    contractToDelete,
    setContractToDelete,
  ] = useState<string | null>(null)

  const [isAdding, setIsAdding] =
    useState(false)

  const [addError, setAddError] =
    useState("")

  const [editError, setEditError] =
    useState("")

  const [newContractId, setNewContractId] =
    useState<string | null>(null)

  const addFormRef =
    useRef<HTMLFormElement | null>(null)

  const editFormRef =
    useRef<HTMLFormElement | null>(null)

  const { showToast } = useToast()
  const { moveToTrash } = useTrash()

  const [editForm, setEditForm] =
    useState<ContractForm>({
      partyName: "",
      contractType: "Employee",
      startDate: "",
      endDate: "",
      value: "",
      status: "Pending",
    })

  const [addForm, setAddForm] =
    useState<ContractForm>({
      partyName: "",
      contractType: "Employee",
      startDate: "",
      endDate: "",
      value: "",
      status: "Pending",
    })

  useEffect(() => {
    if (!isAdmin) {
      return
    }

    async function fetchContracts() {
      try {
        const data =
          (await getContracts()) as ContractApiRecord[]

        const formattedContracts =
          data.map(formatContract)

        setContractList(
          formattedContracts
        )
      } catch {
        showToast(
          "Failed to load contracts",
          "error"
        )
      }
    }

    fetchContracts()
  }, [isAdmin, showToast])

  useEffect(() => {
    if (!newContractId) {
      return
    }

    const frame = requestAnimationFrame(() => {
      const newContract =
        document.getElementById(
          `contract-${newContractId}`
        )

      if (newContract) {
        newContract.scrollIntoView({
          behavior: "smooth",
          block: "center",
        })
      }

      setNewContractId(null)
    })

    return () =>
      cancelAnimationFrame(frame)
  }, [newContractId])

  function openContractForm() {
    if (!isAdmin) {
      return
    }

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
    if (!isAdmin) {
      return
    }

    setContractToDelete(id)
  }

  async function confirmDelete() {
    if (!isAdmin) {
      return
    }

    if (contractToDelete === null) {
      return
    }

    const contract =
      contractList.find(
        (item) =>
          item.id === contractToDelete
      )

    if (!contract) {
      return
    }

    try {
      await deleteContract(contract.id)

      moveToTrash(
        "Contract",
        contract.id,
        contract.partyName,
        `${contract.contractType} Contract`,
        contract as unknown as Record<
          string,
          unknown
        >
      )

      setContractList(
        (currentContracts) =>
          currentContracts.filter(
            (currentContract) =>
              currentContract.id !==
              contract.id
          )
      )

      setContractToDelete(null)

      showToast(
        "Contract moved to Trash",
        "success"
      )
    } catch {
      showToast(
        "Failed to delete contract",
        "error"
      )
    }
  }

  function handleEdit(id: string) {
    if (!isAdmin) {
      return
    }

    const contract =
      contractList.find(
        (item) => item.id === id
      )

    if (!contract) {
      return
    }

    setEditingContractId(id)
    setEditError("")

    setEditForm({
      partyName: contract.partyName,
      contractType:
        contract.contractType,
      startDate: contract.startDate,
      endDate: contract.endDate,
      value: contract.value,
      status: contract.status,
    })

    requestAnimationFrame(() => {
      editFormRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    })
  }

  function validateForm(
    form: ContractForm
  ) {
    if (!form.partyName.trim()) {
      return "Party name is required."
    }

    if (!form.startDate) {
      return "Start date is required."
    }

    if (!form.endDate) {
      return "End date is required."
    }

    if (form.endDate < form.startDate) {
      return "End date cannot be before start date."
    }

    if (form.value === "") {
      return "Contract value is required."
    }

    if (Number(form.value) <= 0) {
      return "Contract value must be greater than 0."
    }

    return ""
  }

  async function handleSave() {
    if (!isAdmin) {
      return
    }

    if (editingContractId === null) {
      return
    }

    const error =
      validateForm(editForm)

    if (error) {
      setEditError(error)
      return
    }

    try {
      const updatedContract =
        (await updateContract(
          editingContractId,
          {
            partyName:
              editForm.partyName.trim(),
            contractType:
              editForm.contractType,
            startDate:
              editForm.startDate,
            endDate:
              editForm.endDate,
            value:
              Number(editForm.value),
            status:
              editForm.status,
          }
        )) as ContractApiRecord

      const formattedContract =
        formatContract(
          updatedContract
        )

      setContractList(
        (currentContracts) =>
          currentContracts.map(
            (contract) =>
              contract.id ===
              editingContractId
                ? formattedContract
                : contract
          )
      )

      setEditingContractId(null)
      setEditError("")

      showToast(
        "Contract updated successfully",
        "success"
      )
    } catch {
      showToast(
        "Failed to update contract",
        "error"
      )
    }
  }

  function handleCancel() {
    setEditingContractId(null)
    setEditError("")
  }

  async function handleAdd() {
    if (!isAdmin) {
      return
    }

    const error =
      validateForm(addForm)

    if (error) {
      setAddError(error)
      return
    }

    try {
      const newContract =
        (await createContract({
          partyName:
            addForm.partyName.trim(),
          contractType:
            addForm.contractType,
          startDate:
            addForm.startDate,
          endDate:
            addForm.endDate,
          value:
            Number(addForm.value),
          status:
            addForm.status,
        })) as ContractApiRecord

      const formattedContract =
        formatContract(
          newContract
        )

      setContractList(
        (currentContracts) => [
          ...currentContracts,
          formattedContract,
        ]
      )

      setNewContractId(
        formattedContract.id
      )

      setAddForm({
        partyName: "",
        contractType: "Employee",
        startDate: "",
        endDate: "",
        value: "",
        status: "Pending",
      })

      setAddError("")
      setIsAdding(false)

      showToast(
        "Contract added successfully",
        "success"
      )
    } catch {
      showToast(
        "Failed to add contract",
        "error"
      )
    }
  }

  function handleCancelAdd() {
    setIsAdding(false)
    setAddError("")
  }

  if (!isAdmin) {
    return null
  }

  const totalContracts =
    contractList.length

  const activeContracts =
    contractList.filter(
      (contract) =>
        contract.status === "Active"
    ).length

  const pendingContracts =
    contractList.filter(
      (contract) =>
        contract.status === "Pending"
    ).length

  const expiredContracts =
    contractList.filter(
      (contract) =>
        contract.status === "Expired"
    ).length

  const totalContractValue =
    contractList.reduce(
      (total, contract) =>
        total + contract.value,
      0
    )

  const activePercentage =
    totalContracts > 0
      ? Math.round(
          (activeContracts /
            totalContracts) *
            100
        )
      : 0

  const filteredContracts =
    [...contractList]
      .filter((contract) =>
        contract.partyName
          .toLowerCase()
          .includes(
            searchTerm.toLowerCase()
          )
      )
      .filter((contract) =>
        statusFilter === "All"
          ? true
          : contract.status ===
            statusFilter
      )
      .filter((contract) =>
        typeFilter === "All"
          ? true
          : contract.contractType ===
            typeFilter
      )
      .sort((a, b) => {
        if (
          sortOption === "name-asc"
        ) {
          return a.partyName.localeCompare(
            b.partyName
          )
        }

        if (
          sortOption === "name-desc"
        ) {
          return b.partyName.localeCompare(
            a.partyName
          )
        }

        if (
          sortOption === "date-asc"
        ) {
          return (
            new Date(
              a.startDate
            ).getTime() -
            new Date(
              b.startDate
            ).getTime()
          )
        }

        if (
          sortOption === "date-desc"
        ) {
          return (
            new Date(
              b.startDate
            ).getTime() -
            new Date(
              a.startDate
            ).getTime()
          )
        }

        if (
          sortOption === "value-asc"
        ) {
          return (
            a.value - b.value
          )
        }

        if (
          sortOption === "value-desc"
        ) {
          return (
            b.value - a.value
          )
        }

        return 0
      })

  return (
    <main className="contracts-page">
      <header className="contracts-page-header">
        <div className="contracts-header-main">
          <span className="contracts-eyebrow">
            CONTRACT MANAGEMENT
          </span>

          <div className="contracts-title-row">
            <div className="contracts-title-icon">
              <FileSignature size={24} />
            </div>

            <div className="contracts-title-content">
              <h1>Contracts</h1>

              <p>
                Manage employee and client
                agreements, monitor contract
                status, and track financial
                value from one centralized
                workspace.
              </p>
            </div>
          </div>
        </div>

        <div className="contracts-header-right">
          <div className="contracts-header-stats">
            <div className="contracts-header-stat">
              <div className="contracts-header-stat-icon total">
                <FileSignature size={16} />
              </div>

              <div>
                <span>Total</span>
                <strong>
                  {totalContracts}
                </strong>
              </div>
            </div>

            <div className="contracts-header-stat">
              <div className="contracts-header-stat-icon active">
                <CircleCheck size={16} />
              </div>

              <div>
                <span>Active</span>
                <strong>
                  {activeContracts}
                </strong>
              </div>
            </div>

            <div className="contracts-header-stat">
              <div className="contracts-header-stat-icon pending">
                <Clock3 size={16} />
              </div>

              <div>
                <span>Pending</span>
                <strong>
                  {pendingContracts}
                </strong>
              </div>
            </div>

            <div className="contracts-header-stat">
              <div className="contracts-header-stat-icon value">
                <Banknote size={16} />
              </div>

              <div>
                <span>Value</span>

                <strong>
                  $
                  {totalContractValue.toLocaleString()}
                </strong>
              </div>
            </div>
          </div>

          <div className="contracts-header-status">
            <div className="contracts-live-icon">
              <Activity size={16} />
            </div>

            <div>
              <span>Portfolio Health</span>

              <strong>
                {activePercentage}% Active
              </strong>
            </div>

            <small>
              {expiredContracts} expired
            </small>
          </div>

          <button
            type="button"
            className="add-contract-btn"
            onClick={openContractForm}
          >
            <Plus size={16} />
            Add Contract
          </button>
        </div>
      </header>

      {isAdding && (
        <form
          ref={addFormRef}
          className="contract-edit-form"
          onSubmit={(e) => {
            e.preventDefault()
            handleAdd()
          }}
        >
          <h2>Add Contract</h2>

          <input
            type="text"
            placeholder="Employee or Client Name"
            value={addForm.partyName}
            required
            onChange={(e) => {
              setAddForm({
                ...addForm,
                partyName:
                  e.target.value,
              })

              setAddError("")
            }}
          />

          <select
            value={addForm.contractType}
            required
            onChange={(e) => {
              setAddForm({
                ...addForm,
                contractType:
                  e.target.value as
                    | "Employee"
                    | "Client",
              })

              setAddError("")
            }}
          >
            <option value="Employee">
              Employee
            </option>

            <option value="Client">
              Client
            </option>
          </select>

          <input
            type="date"
            value={addForm.startDate}
            required
            onChange={(e) => {
              setAddForm({
                ...addForm,
                startDate:
                  e.target.value,
              })

              setAddError("")
            }}
          />

          <input
            type="date"
            value={addForm.endDate}
            min={
              addForm.startDate ||
              undefined
            }
            required
            onChange={(e) => {
              setAddForm({
                ...addForm,
                endDate:
                  e.target.value,
              })

              setAddError("")
            }}
          />

          <input
            type="number"
            placeholder="Contract Value"
            value={addForm.value}
            min="0.01"
            step="0.01"
            required
            onChange={(e) => {
              setAddForm({
                ...addForm,
                value:
                  e.target.value === ""
                    ? ""
                    : Number(
                        e.target.value
                      ),
              })

              setAddError("")
            }}
          />

          <select
            value={addForm.status}
            required
            onChange={(e) => {
              setAddForm({
                ...addForm,
                status:
                  e.target.value as
                    | "Active"
                    | "Expired"
                    | "Pending",
              })

              setAddError("")
            }}
          >
            <option value="Active">
              Active
            </option>

            <option value="Expired">
              Expired
            </option>

            <option value="Pending">
              Pending
            </option>
          </select>

          {addError && (
            <p className="form-error">
              {addError}
            </p>
          )}

          <button type="submit">
            Save
          </button>

          <button
            type="button"
            onClick={handleCancelAdd}
          >
            Cancel
          </button>
        </form>
      )}

      {editingContractId !== null && (
        <form
          ref={editFormRef}
          className="contract-edit-form"
          onSubmit={(e) => {
            e.preventDefault()
            handleSave()
          }}
        >
          <h2>Edit Contract</h2>

          <input
            type="text"
            placeholder="Employee or Client Name"
            value={editForm.partyName}
            required
            onChange={(e) => {
              setEditForm({
                ...editForm,
                partyName:
                  e.target.value,
              })

              setEditError("")
            }}
          />

          <select
            value={editForm.contractType}
            required
            onChange={(e) => {
              setEditForm({
                ...editForm,
                contractType:
                  e.target.value as
                    | "Employee"
                    | "Client",
              })

              setEditError("")
            }}
          >
            <option value="Employee">
              Employee
            </option>

            <option value="Client">
              Client
            </option>
          </select>

          <input
            type="date"
            value={editForm.startDate}
            required
            onChange={(e) => {
              setEditForm({
                ...editForm,
                startDate:
                  e.target.value,
              })

              setEditError("")
            }}
          />

          <input
            type="date"
            value={editForm.endDate}
            min={
              editForm.startDate ||
              undefined
            }
            required
            onChange={(e) => {
              setEditForm({
                ...editForm,
                endDate:
                  e.target.value,
              })

              setEditError("")
            }}
          />

          <input
            type="number"
            placeholder="Contract Value"
            value={editForm.value}
            min="0.01"
            step="0.01"
            required
            onChange={(e) => {
              setEditForm({
                ...editForm,
                value:
                  e.target.value === ""
                    ? ""
                    : Number(
                        e.target.value
                      ),
              })

              setEditError("")
            }}
          />

          <select
            value={editForm.status}
            required
            onChange={(e) => {
              setEditForm({
                ...editForm,
                status:
                  e.target.value as
                    | "Active"
                    | "Expired"
                    | "Pending",
              })

              setEditError("")
            }}
          >
            <option value="Active">
              Active
            </option>

            <option value="Expired">
              Expired
            </option>

            <option value="Pending">
              Pending
            </option>
          </select>

          {editError && (
            <p className="form-error">
              {editError}
            </p>
          )}

          <button type="submit">
            Save
          </button>

          <button
            type="button"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </form>
      )}

      <div className="contracts-controls">
        <div className="contracts-search">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search employee or client..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(
                e.target.value
              )
            }
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(
              e.target.value as
                | "All"
                | "Active"
                | "Expired"
                | "Pending"
            )
          }
        >
          <option value="All">
            All Statuses
          </option>

          <option value="Active">
            Active
          </option>

          <option value="Expired">
            Expired
          </option>

          <option value="Pending">
            Pending
          </option>
        </select>

        <select
          value={typeFilter}
          onChange={(e) =>
            setTypeFilter(
              e.target.value as
                | "All"
                | "Employee"
                | "Client"
            )
          }
        >
          <option value="All">
            All Types
          </option>

          <option value="Employee">
            Employee
          </option>

          <option value="Client">
            Client
          </option>
        </select>

        <select
          value={sortOption}
          onChange={(e) =>
            setSortOption(
              e.target.value as
                | "default"
                | "name-asc"
                | "name-desc"
                | "date-asc"
                | "date-desc"
                | "value-asc"
                | "value-desc"
            )
          }
        >
          <option value="default">
            Default Order
          </option>

          <option value="name-asc">
            Name A-Z
          </option>

          <option value="name-desc">
            Name Z-A
          </option>

          <option value="date-asc">
            Start Date: Oldest
          </option>

          <option value="date-desc">
            Start Date: Newest
          </option>

          <option value="value-asc">
            Value: Lowest
          </option>

          <option value="value-desc">
            Value: Highest
          </option>
        </select>
      </div>

      <div className="contracts-grid">
        {filteredContracts.length > 0 ? (
          filteredContracts.map(
            (contract) => (
              <div
                key={contract.id}
                id={`contract-${contract.id}`}
              >
                <ContractCard
                  contract={contract}
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                />
              </div>
            )
          )
        ) : (
          <div className="contract-empty">
            <h2>
              No contracts found
            </h2>

            <p>
              Try changing your search
              or filters.
            </p>
          </div>
        )}
      </div>

      {contractToDelete !== null && (
        <Modal
          title="Delete Contract"
          message="Are you sure you want to move this contract to Trash? You can recover it later from the Trash page."
          onCancel={() =>
            setContractToDelete(null)
          }
          onConfirm={confirmDelete}
        />
      )}
    </main>
  )
}