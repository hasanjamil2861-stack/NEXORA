import { useEffect, useRef, useState } from "react"

import {
  Activity,
  Building2,
  ListChecks,
  Mail,
  MapPin,
  Phone,
  Plus,
  Save,
  Search,
  UserCheck,
  UserRound,
  UserX,
  UsersRound,
  X,
} from "lucide-react"

import type { Client } from "../../types/Client"
import ClientCard from "../../components/ClientCard/ClientCard"
import Modal from "../../components/Modal/Modal"
import { useToast } from "../../context/ToastContext"
import { useTrash } from "../../context/TrashContext"

import {
  createClient,
  deleteClient,
  getClients,
  updateClient,
} from "../../services/api/clientApi"

type ClientApiRecord = {
  _id: string
  companyName?: string
  contactPerson?: string
  email?: string
  phone?: string
  address?: string
  status?: "Active" | "Inactive"
}

type ClientFormData = {
  companyName: string
  contactPerson: string
  email: string
  phone: string
  address: string
  status: "Active" | "Inactive"
}

const emptyClientForm: ClientFormData = {
  companyName: "",
  contactPerson: "",
  email: "",
  phone: "",
  address: "",
  status: "Active",
}

export default function Clients() {
  const { showToast } = useToast()
  const { moveToTrash } = useTrash()

  const [clientList, setClientList] = useState<Client[]>([])

  const [editingClientId, setEditingClientId] =
    useState<string | null>(null)

  const [clientToDelete, setClientToDelete] =
    useState<string | null>(null)

  const [newClientId, setNewClientId] =
    useState<string | null>(null)

  const [isAddingClient, setIsAddingClient] =
    useState(false)

  const [editError, setEditError] = useState("")
  const [addError, setAddError] = useState("")

  const [editForm, setEditForm] =
    useState<ClientFormData>(emptyClientForm)

  const [addForm, setAddForm] =
    useState<ClientFormData>(emptyClientForm)

  const [searchTerm, setSearchTerm] = useState("")

  const [statusFilter, setStatusFilter] = useState<
    "All" | "Active" | "Inactive"
  >("All")

  const [sortOption, setSortOption] = useState<
    "default" | "company-asc" | "company-desc"
  >("default")

  const addFormRef =
    useRef<HTMLFormElement | null>(null)

  const editFormRef =
    useRef<HTMLDivElement | null>(null)

  // Automatically scroll to the newly created client
  useEffect(() => {
    if (!newClientId) {
      return
    }

    const frame = requestAnimationFrame(() => {
      const newClient = document.getElementById(
        `client-${newClientId}`
      )

      if (newClient) {
        newClient.scrollIntoView({
          behavior: "smooth",
          block: "center",
        })
      }

      setNewClientId(null)
    })

    return () => cancelAnimationFrame(frame)
  }, [newClientId])

  // Load clients from the backend
  useEffect(() => {
    async function fetchClients() {
      try {
        const data =
          (await getClients()) as ClientApiRecord[]

        const formattedClients: Client[] = data.map(
          (client) => ({
            id: client._id,
            companyName: client.companyName ?? "",
            contactPerson: client.contactPerson ?? "",
            email: client.email ?? "",
            phone: client.phone ?? "",
            address: client.address ?? "",
            status: client.status ?? "Active",
          })
        )

        setClientList(formattedClients)
      } catch {
        showToast(
          "Failed to load clients",
          "error"
        )
      }
    }

    fetchClients()
  }, [showToast])

  // Calculate client statistics
  const totalClients = clientList.length

  const activeClients = clientList.filter(
    (client) => client.status === "Active"
  ).length

  const inactiveClients = clientList.filter(
    (client) => client.status === "Inactive"
  ).length

  const activePercentage =
    totalClients > 0
      ? Math.round(
          (activeClients / totalClients) * 100
        )
      : 0

  // Open the delete confirmation modal
  function handleDelete(id: string) {
    setClientToDelete(id)
  }

  // Delete from MongoDB, then move the client to Trash
  async function confirmDeleteClient() {
    if (clientToDelete === null) {
      return
    }

    const client = clientList.find(
      (currentClient) =>
        currentClient.id === clientToDelete
    )

    if (!client) {
      return
    }

    try {
      await deleteClient(client.id)

      moveToTrash(
        "Client",
        client.id,
        client.companyName,
        client.contactPerson,
        client as unknown as Record<string, unknown>
      )

      setClientList((currentClients) =>
        currentClients.filter(
          (currentClient) =>
            currentClient.id !== client.id
        )
      )

      setClientToDelete(null)

      showToast(
        "Client moved to Trash",
        "success"
      )
    } catch {
      showToast(
        "Failed to delete client",
        "error"
      )
    }
  }

  // Open the edit form and load the selected client
  function handleEdit(id: string) {
    const client = clientList.find(
      (currentClient) =>
        currentClient.id === id
    )

    if (!client) {
      return
    }

    setEditingClientId(id)

    setEditForm({
      companyName: client.companyName,
      contactPerson: client.contactPerson,
      email: client.email,
      phone: client.phone,
      address: client.address,
      status: client.status,
    })

    setEditError("")

    requestAnimationFrame(() => {
      editFormRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    })
  }

  // Validate and save the edited client
  async function handleSave() {
    if (editingClientId === null) {
      return
    }

    if (!editForm.companyName.trim()) {
      setEditError("Company name is required.")
      return
    }

    if (!editForm.contactPerson.trim()) {
      setEditError("Contact person is required.")
      return
    }

    if (!editForm.email.trim()) {
      setEditError("Email is required.")
      return
    }

    if (!editForm.phone.trim()) {
      setEditError("Phone is required.")
      return
    }

    if (!editForm.address.trim()) {
      setEditError("Address is required.")
      return
    }

    setEditError("")

    try {
      const updatedClient =
        (await updateClient(
          editingClientId,
          {
            companyName:
              editForm.companyName.trim(),
            contactPerson:
              editForm.contactPerson.trim(),
            email: editForm.email.trim(),
            phone: editForm.phone.trim(),
            address: editForm.address.trim(),
            status: editForm.status,
          }
        )) as ClientApiRecord

      const formattedClient: Client = {
        id: updatedClient._id,
        companyName:
          updatedClient.companyName ?? "",
        contactPerson:
          updatedClient.contactPerson ?? "",
        email: updatedClient.email ?? "",
        phone: updatedClient.phone ?? "",
        address: updatedClient.address ?? "",
        status: updatedClient.status ?? "Active",
      }

      setClientList((currentClients) =>
        currentClients.map((client) =>
          client.id === editingClientId
            ? formattedClient
            : client
        )
      )

      setEditingClientId(null)

      showToast(
        "Client updated successfully",
        "success"
      )
    } catch {
      showToast(
        "Failed to update client",
        "error"
      )
    }
  }

  // Close the edit form
  function handleCancel() {
    setEditingClientId(null)
    setEditError("")
  }

  // Open the add-client form
  function openAddClientForm() {
    setIsAddingClient(true)
    setAddError("")

    requestAnimationFrame(() => {
      addFormRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    })
  }

  // Validate and create a new client
  async function handleAdd() {
    if (!addForm.companyName.trim()) {
      setAddError("Company name is required.")
      return
    }

    if (!addForm.contactPerson.trim()) {
      setAddError("Contact person is required.")
      return
    }

    if (!addForm.email.trim()) {
      setAddError("Email is required.")
      return
    }

    if (!addForm.phone.trim()) {
      setAddError("Phone is required.")
      return
    }

    if (!addForm.address.trim()) {
      setAddError("Address is required.")
      return
    }

    setAddError("")

    try {
      const createdClient =
        (await createClient({
          companyName:
            addForm.companyName.trim(),
          contactPerson:
            addForm.contactPerson.trim(),
          email: addForm.email.trim(),
          phone: addForm.phone.trim(),
          address: addForm.address.trim(),
          status: addForm.status,
        })) as ClientApiRecord

      const formattedClient: Client = {
        id: createdClient._id,
        companyName:
          createdClient.companyName ?? "",
        contactPerson:
          createdClient.contactPerson ?? "",
        email: createdClient.email ?? "",
        phone: createdClient.phone ?? "",
        address: createdClient.address ?? "",
        status: createdClient.status ?? "Active",
      }

      setClientList((currentClients) => [
        ...currentClients,
        formattedClient,
      ])

      setNewClientId(formattedClient.id)

      setAddForm({ ...emptyClientForm })

      setIsAddingClient(false)

      showToast(
        "Client added successfully",
        "success"
      )
    } catch {
      showToast(
        "Failed to add client",
        "error"
      )
    }
  }

  // Close the add-client form
  function handleCancelAdd() {
    setIsAddingClient(false)
    setAddError("")
  }

  // Search, filter, and sort clients
  const filteredClients = clientList
    .filter((client) =>
      client.companyName
        .toLowerCase()
        .includes(
          searchTerm.toLowerCase()
        )
    )
    .filter((client) =>
      statusFilter === "All"
        ? true
        : client.status === statusFilter
    )

  const sortedClients = [...filteredClients].sort(
    (a, b) => {
      if (sortOption === "company-asc") {
        return a.companyName.localeCompare(
          b.companyName
        )
      }

      if (sortOption === "company-desc") {
        return b.companyName.localeCompare(
          a.companyName
        )
      }

      return 0
    }
  )

  return (
    <main className="clients-page">
      {/* Clients page header */}
      <header className="clients-header">
        <div className="clients-header-main">
          <div className="clients-title-content">
            <span className="clients-eyebrow">
              CRM MANAGEMENT
            </span>

            <h1>
              <span className="clients-title-icon">
                <UsersRound size={24} />
              </span>
              Clients
            </h1>

            <p>
              Manage your business clients,
              relationships, and contact information
              from one central workspace.
            </p>
          </div>
        </div>

        <div className="clients-header-right">
          <div className="clients-header-summary">
            <div className="clients-summary-icon">
              <Building2 size={19} />
            </div>

            <div>
              <span>Active Clients</span>
              <strong>{activeClients}</strong>
              <small>
                {activePercentage}% of total
              </small>
            </div>
          </div>

          <button
            type="button"
            className="add-client-btn"
            onClick={openAddClientForm}
          >
            <Plus size={16} />
            Add Client
          </button>
        </div>
      </header>

      {/* Client statistics */}
      <section className="client-statistics">
        <article className="client-stat-card">
          <div className="client-stat-icon total">
            <UsersRound size={20} />
          </div>

          <div className="client-stat-content">
            <span>Total Clients</span>
            <strong>{totalClients}</strong>
            <small>All registered clients</small>
          </div>
        </article>

        <article className="client-stat-card">
          <div className="client-stat-icon active">
            <UserCheck size={20} />
          </div>

          <div className="client-stat-content">
            <span>Active Clients</span>
            <strong>{activeClients}</strong>
            <small>
              {activePercentage}% of clients
            </small>
          </div>
        </article>

        <article className="client-stat-card">
          <div className="client-stat-icon inactive">
            <UserX size={20} />
          </div>

          <div className="client-stat-content">
            <span>Inactive Clients</span>
            <strong>{inactiveClients}</strong>
            <small>Accounts not active</small>
          </div>
        </article>

        <article className="client-stat-card">
          <div className="client-stat-icon contacts">
            <Building2 size={20} />
          </div>

          <div className="client-stat-content">
            <span>Business Accounts</span>
            <strong>{totalClients}</strong>
            <small>Managed companies</small>
          </div>
        </article>
      </section>

      {/* Client activity overview */}
      <section className="client-overview">
        <div className="client-overview-header">
          <div className="client-overview-title">
            <div className="client-overview-icon">
              <Activity size={18} />
            </div>

            <div>
              <h2>Client Overview</h2>
              <p>
                Current client account distribution
              </p>
            </div>
          </div>

          <strong>
            {activePercentage}% Active
          </strong>
        </div>

        <div className="client-progress-track">
          <div
            className="client-progress-bar"
            style={{
              width: `${activePercentage}%`,
            }}
          />
        </div>

        <div className="client-overview-footer">
          <span>
            ● Active: {activeClients}
          </span>

          <span>
            ● Inactive: {inactiveClients}
          </span>

          <span>
            ● Total: {totalClients}
          </span>
        </div>
      </section>

      {/* Search and filters */}
      <section className="client-search-container">
        <div className="client-search-box">
          <Search
            size={17}
            className="client-search-icon"
          />

          <input
            type="text"
            className="client-search-input"
            placeholder="Search clients..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(e.target.value)
            }
          />
        </div>

        <div className="client-filter-group">
          <label>Status</label>

          <select
            className="client-status-filter"
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(
                e.target.value as
                  | "All"
                  | "Active"
                  | "Inactive"
              )
            }
          >
            <option value="All">
              All Status
            </option>
            <option value="Active">
              Active
            </option>
            <option value="Inactive">
              Inactive
            </option>
          </select>
        </div>

        <div className="client-filter-group">
          <label>Sort By</label>

          <select
            className="client-sort"
            value={sortOption}
            onChange={(e) =>
              setSortOption(
                e.target.value as
                  | "default"
                  | "company-asc"
                  | "company-desc"
              )
            }
          >
            <option value="default">
              Default Order
            </option>
            <option value="company-asc">
              Company A → Z
            </option>
            <option value="company-desc">
              Company Z → A
            </option>
          </select>
        </div>
      </section>

      {/* Results count */}
      <div className="client-results-info">
        <div className="client-results-left">
          <div className="client-results-icon">
            <ListChecks size={15} />
          </div>

          <span>
            Showing{" "}
            <strong>{sortedClients.length}</strong>{" "}
            of{" "}
            <strong>{totalClients}</strong>{" "}
            clients
          </span>
        </div>
      </div>

      {/* Add client form */}
      {isAddingClient && (
        <form
          ref={addFormRef}
          className="client-form"
          onSubmit={(e) => {
            e.preventDefault()
            handleAdd()
          }}
        >
          <div className="client-form-header">
            <div className="client-form-title">
              <div className="client-form-icon">
                <Plus size={18} />
              </div>

              <div>
                <span className="client-form-eyebrow">
                  NEW CLIENT
                </span>

                <h2>Add Client</h2>
              </div>
            </div>

            <button
              type="button"
              className="client-form-close"
              onClick={handleCancelAdd}
            >
              <X size={17} />
            </button>
          </div>

          <div className="client-form-grid">
            <div className="client-form-field">
              <label>
                <Building2 size={14} />
                Company Name
              </label>

              <input
                type="text"
                value={addForm.companyName}
                onChange={(e) => {
                  setAddForm({
                    ...addForm,
                    companyName: e.target.value,
                  })
                  setAddError("")
                }}
                placeholder="Company Name"
                required
              />
            </div>

            <div className="client-form-field">
              <label>
                <UserRound size={14} />
                Contact Person
              </label>

              <input
                type="text"
                value={addForm.contactPerson}
                onChange={(e) => {
                  setAddForm({
                    ...addForm,
                    contactPerson:
                      e.target.value,
                  })
                  setAddError("")
                }}
                placeholder="Contact Person"
                required
              />
            </div>

            <div className="client-form-field">
              <label>
                <Mail size={14} />
                Email
              </label>

              <input
                type="email"
                value={addForm.email}
                onChange={(e) => {
                  setAddForm({
                    ...addForm,
                    email: e.target.value,
                  })
                  setAddError("")
                }}
                placeholder="Email"
                required
              />
            </div>

            <div className="client-form-field">
              <label>
                <Phone size={14} />
                Phone
              </label>

              <input
                type="tel"
                value={addForm.phone}
                onChange={(e) => {
                  setAddForm({
                    ...addForm,
                    phone: e.target.value,
                  })
                  setAddError("")
                }}
                placeholder="Phone"
                required
              />
            </div>

            <div className="client-form-field">
              <label>
                <MapPin size={14} />
                Address
              </label>

              <input
                type="text"
                value={addForm.address}
                onChange={(e) => {
                  setAddForm({
                    ...addForm,
                    address: e.target.value,
                  })
                  setAddError("")
                }}
                placeholder="Address"
                required
              />
            </div>

            <div className="client-form-field">
              <label>
                <Activity size={14} />
                Status
              </label>

              <select
                value={addForm.status}
                onChange={(e) =>
                  setAddForm({
                    ...addForm,
                    status:
                      e.target.value as
                        | "Active"
                        | "Inactive",
                  })
                }
                required
              >
                <option value="Active">
                  Active
                </option>
                <option value="Inactive">
                  Inactive
                </option>
              </select>
            </div>
          </div>

          {addError && (
            <p className="form-error">
              {addError}
            </p>
          )}

          <div className="client-form-actions">
            <button
              type="button"
              className="client-cancel-btn"
              onClick={handleCancelAdd}
            >
              <X size={14} />
              Cancel
            </button>

            <button
              type="submit"
              className="client-save-btn"
            >
              <Save size={14} />
              Save Client
            </button>
          </div>
        </form>
      )}

      {/* Edit client form */}
      {editingClientId !== null && (
        <div
          ref={editFormRef}
          className="client-form"
        >
          <div className="client-form-header">
            <div className="client-form-title">
              <div className="client-form-icon edit">
                <Building2 size={18} />
              </div>

              <div>
                <span className="client-form-eyebrow">
                  CLIENT MANAGEMENT
                </span>

                <h2>Edit Client</h2>
              </div>
            </div>

            <button
              type="button"
              className="client-form-close"
              onClick={handleCancel}
            >
              <X size={17} />
            </button>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSave()
            }}
          >
            <div className="client-form-grid">
              <div className="client-form-field">
                <label>
                  <Building2 size={14} />
                  Company Name
                </label>

                <input
                  type="text"
                  value={editForm.companyName}
                  onChange={(e) => {
                    setEditForm({
                      ...editForm,
                      companyName:
                        e.target.value,
                    })
                    setEditError("")
                  }}
                  placeholder="Company Name"
                  required
                />
              </div>

              <div className="client-form-field">
                <label>
                  <UserRound size={14} />
                  Contact Person
                </label>

                <input
                  type="text"
                  value={editForm.contactPerson}
                  onChange={(e) => {
                    setEditForm({
                      ...editForm,
                      contactPerson:
                        e.target.value,
                    })
                    setEditError("")
                  }}
                  placeholder="Contact Person"
                  required
                />
              </div>

              <div className="client-form-field">
                <label>
                  <Mail size={14} />
                  Email
                </label>

                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => {
                    setEditForm({
                      ...editForm,
                      email: e.target.value,
                    })
                    setEditError("")
                  }}
                  placeholder="Email"
                  required
                />
              </div>

              <div className="client-form-field">
                <label>
                  <Phone size={14} />
                  Phone
                </label>

                <input
                  type="tel"
                  value={editForm.phone}
                  onChange={(e) => {
                    setEditForm({
                      ...editForm,
                      phone: e.target.value,
                    })
                    setEditError("")
                  }}
                  placeholder="Phone"
                  required
                />
              </div>

              <div className="client-form-field">
                <label>
                  <MapPin size={14} />
                  Address
                </label>

                <input
                  type="text"
                  value={editForm.address}
                  onChange={(e) => {
                    setEditForm({
                      ...editForm,
                      address: e.target.value,
                    })
                    setEditError("")
                  }}
                  placeholder="Address"
                  required
                />
              </div>

              <div className="client-form-field">
                <label>
                  <Activity size={14} />
                  Status
                </label>

                <select
                  value={editForm.status}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      status:
                        e.target.value as
                          | "Active"
                          | "Inactive",
                    })
                  }
                  required
                >
                  <option value="Active">
                    Active
                  </option>
                  <option value="Inactive">
                    Inactive
                  </option>
                </select>
              </div>
            </div>

            {editError && (
              <p className="form-error">
                {editError}
              </p>
            )}

            <div className="client-form-actions">
              <button
                type="button"
                className="client-cancel-btn"
                onClick={handleCancel}
              >
                <X size={14} />
                Cancel
              </button>

              <button
                type="submit"
                className="client-save-btn"
              >
                <Save size={14} />
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Client cards */}
      <div className="clients-grid">
        {sortedClients.length === 0 ? (
          <div className="client-empty-state">
            <div className="client-empty-icon">
              <UsersRound size={24} />
            </div>

            <h2>No clients found</h2>

            <p>
              Try changing your search or filters.
            </p>

            {(searchTerm ||
              statusFilter !== "All") && (
              <button
                type="button"
                className="clear-client-filters-btn"
                onClick={() => {
                  setSearchTerm("")
                  setStatusFilter("All")
                }}
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          sortedClients.map((client) => (
            <div
              key={client.id}
              id={`client-${client.id}`}
            >
              <ClientCard
                client={client}
                onDelete={handleDelete}
                onEdit={handleEdit}
              />
            </div>
          ))
        )}
      </div>

      {/* Delete confirmation modal */}
      {clientToDelete !== null && (
        <Modal
          title="Delete Client"
          message="Are you sure you want to move this client to Trash? You can recover it later from the Trash page."
          onCancel={() =>
            setClientToDelete(null)
          }
          onConfirm={confirmDeleteClient}
        />
      )}
    </main>
  )
}