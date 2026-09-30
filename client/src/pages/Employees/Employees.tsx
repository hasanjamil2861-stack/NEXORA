import {
    useEffect,
    useRef,
    useState,
} from "react"

import {
    Search,
    Users,
    UserCheck,
    UserX,
    WalletCards,
} from "lucide-react"

import { departments } from "../../data/departments"

import EmployeeCard from "../../components/EmployeeCard/EmployeeCard"
import Modal from "../../components/Modal/Modal"

import { useToast } from "../../context/ToastContext"
import { useTrash } from "../../context/TrashContext"
import { useAuth } from "../../context/AuthContext"

import type { Employee } from "../../types/Employee"

import {
    getEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee,
} from "../../services/api/employeeApi"

// Backend employee response
type EmployeeApiRecord = {
    _id: string
    firstName?: string
    lastName?: string
    email?: string
    phone?: string
    position?: string
    departmentId?: number
    salary?: number
    hireDate?: string
    status?: Employee["status"]
}

// Convert MongoDB employee data into frontend Employee type
function formatEmployee(
    employee: EmployeeApiRecord
): Employee {
    return {
        id: employee._id,
        firstName: employee.firstName ?? "",
        lastName: employee.lastName ?? "",
        email: employee.email ?? "",
        phone: employee.phone ?? "",
        position: employee.position ?? "",
        departmentId: employee.departmentId ?? 0,
        salary: employee.salary ?? 0,
        hireDate: employee.hireDate ?? "",
        status: employee.status ?? "Active",
    }
}

export default function Employees() {
    const { user } = useAuth()

    const isAdmin = user?.role === "Admin"

    const [showForm, setShowForm] =
        useState(false)

    const [firstName, setFirstName] =
        useState("")

    const [lastName, setLastName] =
        useState("")

    const [email, setEmail] =
        useState("")

    const [phone, setPhone] =
        useState("")

    const [position, setPosition] =
        useState("")

    const [salary, setSalary] =
        useState("")

    const [hireDate, setHireDate] =
        useState("")

    const [status, setStatus] =
        useState<Employee["status"]>("Active")

    const [employeeList, setEmployeeList] =
        useState<Employee[]>([])

    const [search, setSearch] =
        useState("")

    const [statusFilter, setStatusFilter] =
        useState<
            "All" | Employee["status"]
        >("All")

    const [departmentFilter, setDepartmentFilter] =
        useState("All")

    const [sortBy, setSortBy] =
        useState("None")

    const [editingEmployee, setEditingEmployee] =
        useState<string | null>(null)

    const [employeeToDelete, setEmployeeToDelete] =
        useState<string | null>(null)

    const [formError, setFormError] =
        useState("")

    const [newEmployeeId, setNewEmployeeId] =
        useState<string | null>(null)

    const employeeFormRef =
        useRef<HTMLElement | null>(null)

    const { showToast } = useToast()
    const { moveToTrash } = useTrash()

    // Scroll to newly created employee
    useEffect(() => {
        if (!newEmployeeId) {
            return
        }

        const frame = requestAnimationFrame(() => {
            const newEmployee =
                document.getElementById(
                    `employee-${newEmployeeId}`
                )

            if (newEmployee) {
                newEmployee.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                })
            }

            setNewEmployeeId(null)
        })

        return () =>
            cancelAnimationFrame(frame)
    }, [newEmployeeId])

    // Fetch employees from MongoDB
    useEffect(() => {
        async function fetchEmployees() {
            try {
                const data =
                    (await getEmployees()) as EmployeeApiRecord[]

                setEmployeeList(
                    data.map(formatEmployee)
                )
            } catch {
                setEmployeeList([])
            }
        }

        fetchEmployees()
    }, [])

    // Employee statistics
    const totalEmployees =
        employeeList.length

    const activeEmployees =
        employeeList.filter(
            (employee) =>
                employee.status === "Active"
        ).length

    const inactiveEmployees =
        employeeList.filter(
            (employee) =>
                employee.status === "Inactive"
        ).length

    const averageSalary =
        totalEmployees > 0
            ? employeeList.reduce(
                  (total, employee) =>
                      total + employee.salary,
                  0
              ) / totalEmployees
            : 0

    const activePercentage =
        totalEmployees > 0
            ? Math.round(
                  (activeEmployees /
                      totalEmployees) *
                      100
              )
            : 0

    // Reset employee form
    function resetForm() {
        setFirstName("")
        setLastName("")
        setEmail("")
        setPhone("")
        setPosition("")
        setSalary("")
        setHireDate("")
        setStatus("Active")

        setEditingEmployee(null)
        setFormError("")
        setShowForm(false)
    }

    // Open employee form
    function openEmployeeForm() {
        if (!isAdmin) {
            return
        }

        setShowForm(true)
        setFormError("")

        requestAnimationFrame(() => {
            employeeFormRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "start",
            })
        })
    }

    // Validate employee form
    function validateForm() {
        if (!firstName.trim()) {
            setFormError(
                "First Name is required"
            )
            return false
        }

        if (!lastName.trim()) {
            setFormError(
                "Last Name is required"
            )
            return false
        }

        if (!email.trim()) {
            setFormError(
                "Email is required"
            )
            return false
        }

        if (!phone.trim()) {
            setFormError(
                "Phone is required"
            )
            return false
        }

        if (!position.trim()) {
            setFormError(
                "Position is required"
            )
            return false
        }

        if (!salary) {
            setFormError(
                "Salary is required"
            )
            return false
        }

        if (Number(salary) < 0) {
            setFormError(
                "Salary cannot be negative"
            )
            return false
        }

        if (!hireDate) {
            setFormError(
                "Hire Date is required"
            )
            return false
        }

        if (!status) {
            setFormError(
                "Status is required"
            )
            return false
        }

        setFormError("")

        return true
    }

    // Open delete confirmation
    function handleDeleteEmployee(
        id: string
    ) {
        if (!isAdmin) {
            return
        }

        setEmployeeToDelete(id)
    }

    // Delete employee from MongoDB
    async function confirmDeleteEmployee() {
        if (!isAdmin) {
            return
        }

        if (employeeToDelete === null) {
            return
        }

        const employee =
            employeeList.find(
                (item) =>
                    item.id ===
                    employeeToDelete
            )

        if (!employee) {
            return
        }

        try {
            await deleteEmployee(
                employeeToDelete
            )

            moveToTrash(
                "Employee",
                employee.id,
                `${employee.firstName} ${employee.lastName}`,
                employee.position,
                employee as unknown as Record<
                    string,
                    unknown
                >
            )

            setEmployeeList(
                (currentEmployees) =>
                    currentEmployees.filter(
                        (item) =>
                            item.id !==
                            employeeToDelete
                    )
            )

            setEmployeeToDelete(null)

            showToast(
                "Employee deleted successfully"
            )
        } catch {
            showToast(
                "Failed to delete employee",
                "error"
            )
        }
    }

    // Load employee data into edit form
    function handleEditEmployee(
        id: string
    ) {
        if (!isAdmin) {
            return
        }

        const employee =
            employeeList.find(
                (employee) =>
                    employee.id === id
            )

        if (!employee) {
            return
        }

        setFirstName(
            employee.firstName
        )

        setLastName(
            employee.lastName
        )

        setEmail(
            employee.email
        )

        setPhone(
            employee.phone
        )

        setPosition(
            employee.position
        )

        setSalary(
            String(employee.salary)
        )

        setHireDate(
            employee.hireDate
        )

        setStatus(
            employee.status
        )

        setEditingEmployee(
            employee.id
        )

        setShowForm(true)
        setFormError("")

        requestAnimationFrame(() => {
            employeeFormRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "start",
            })
        })
    }

    // Create or update employee
    async function handleCreateEmployee() {
        if (!isAdmin) {
            return
        }

        if (!validateForm()) {
            return
        }

        const employeeData = {
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.trim(),
            phone: phone.trim(),
            position: position.trim(),
            departmentId: 1,
            salary: Number(salary),
            hireDate,
            status,
        }

        // Update existing employee
        if (editingEmployee !== null) {
            try {
                const data =
                    (await updateEmployee(
                        editingEmployee,
                        employeeData
                    )) as EmployeeApiRecord

                const updatedEmployee =
                    formatEmployee(data)

                setEmployeeList(
                    (currentEmployees) =>
                        currentEmployees.map(
                            (employee) =>
                                employee.id ===
                                editingEmployee
                                    ? updatedEmployee
                                    : employee
                        )
                )

                showToast(
                    "Employee updated successfully"
                )

                resetForm()
            } catch (error) {
                setFormError(
                    error instanceof Error
                        ? error.message
                        : "Failed to update employee. Please try again."
                )
            }

            return
        }

        // Create new employee
        try {
            const data =
                (await createEmployee(
                    employeeData
                )) as EmployeeApiRecord

            const newEmployee =
                formatEmployee(data)

            setEmployeeList(
                (currentEmployees) => [
                    ...currentEmployees,
                    newEmployee,
                ]
            )

            setNewEmployeeId(
                newEmployee.id
            )

            showToast(
                "Employee added successfully"
            )

            resetForm()
        } catch (error) {
            setFormError(
                error instanceof Error
                    ? error.message
                    : "Failed to add employee. Please try again."
            )
        }
    }

    // Filter employees
    const filteredEmployees =
        employeeList.filter(
            (employee) => {
                const searchValue =
                    search
                        .toLowerCase()
                        .trim()

                const matchesSearch =
                    employee.firstName
                        .toLowerCase()
                        .includes(
                            searchValue
                        ) ||
                    employee.lastName
                        .toLowerCase()
                        .includes(
                            searchValue
                        ) ||
                    employee.email
                        .toLowerCase()
                        .includes(
                            searchValue
                        ) ||
                    employee.position
                        .toLowerCase()
                        .includes(
                            searchValue
                        )

                const matchesStatus =
                    statusFilter ===
                        "All" ||
                    employee.status ===
                        statusFilter

                const matchesDepartment =
                    departmentFilter ===
                        "All" ||
                    employee.departmentId ===
                        Number(
                            departmentFilter
                        )

                return (
                    matchesSearch &&
                    matchesStatus &&
                    matchesDepartment
                )
            }
        )

    // Sort employees
    const sortedEmployees = [
        ...filteredEmployees,
    ].sort((a, b) => {
        if (sortBy === "Name") {
            return `${a.firstName} ${a.lastName}`.localeCompare(
                `${b.firstName} ${b.lastName}`
            )
        }

        if (sortBy === "Salary") {
            return b.salary - a.salary
        }

        if (sortBy === "Hire Date") {
            return (
                new Date(
                    b.hireDate
                ).getTime() -
                new Date(
                    a.hireDate
                ).getTime()
            )
        }

        return 0
    })

    return (
        <main className="employees-page">

            {/* Header */}
            <header className="employees-header">

                <div>
                    <h1>
                        Employees
                    </h1>

                    <p>
                        Manage your workforce,
                        employee information,
                        and employment status.
                    </p>
                </div>

                {isAdmin && (
                    <button
                        type="button"
                        className="add-employee-btn"
                        onClick={() => {
                            if (showForm) {
                                resetForm()
                            } else {
                                openEmployeeForm()
                            }
                        }}
                    >
                        {showForm
                            ? "Close Form"
                            : "Add Employee"}
                    </button>
                )}

            </header>

            {/* Statistics */}
            <section className="employee-statistics">

                <div className="employee-stat-card">
                    <div className="employee-stat-icon total">
                        <Users size={20} />
                    </div>

                    <div className="employee-stat-content">
                        <span>
                            Total Employees
                        </span>

                        <strong>
                            {totalEmployees}
                        </strong>

                        <small>
                            Current workforce
                        </small>
                    </div>
                </div>

                <div className="employee-stat-card">
                    <div className="employee-stat-icon active">
                        <UserCheck size={20} />
                    </div>

                    <div className="employee-stat-content">
                        <span>
                            Active Employees
                        </span>

                        <strong>
                            {activeEmployees}
                        </strong>

                        <small>
                            {activePercentage}%
                            of workforce
                        </small>
                    </div>
                </div>

                <div className="employee-stat-card">
                    <div className="employee-stat-icon inactive">
                        <UserX size={20} />
                    </div>

                    <div className="employee-stat-content">
                        <span>
                            Inactive Employees
                        </span>

                        <strong>
                            {inactiveEmployees}
                        </strong>

                        <small>
                            Currently inactive
                        </small>
                    </div>
                </div>

                <div className="employee-stat-card">
                    <div className="employee-stat-icon salary">
                        <WalletCards size={20} />
                    </div>

                    <div className="employee-stat-content">
                        <span>
                            Average Salary
                        </span>

                        <strong>
                            $
                            {averageSalary.toLocaleString(
                                undefined,
                                {
                                    maximumFractionDigits:
                                        0,
                                }
                            )}
                        </strong>

                        <small>
                            Average per employee
                        </small>
                    </div>
                </div>

            </section>

            {/* Search and filters */}
            <section className="employee-controls">

                <div className="employee-search">

                    <Search
                        className="employee-search-icon"
                        size={20}
                    />

                    <input
                        type="text"
                        placeholder="Search by name, email, or position..."
                        value={search}
                        onChange={(e) =>
                            setSearch(
                                e.target.value
                            )
                        }
                    />

                </div>

                <div className="employee-filter">

                    <select
                        value={statusFilter}
                        onChange={(e) =>
                            setStatusFilter(
                                e.target.value as
                                    | "All"
                                    | Employee["status"]
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

                <div className="employee-filter">

                    <select
                        value={
                            departmentFilter
                        }
                        onChange={(e) =>
                            setDepartmentFilter(
                                e.target.value
                            )
                        }
                    >

                        <option value="All">
                            All Departments
                        </option>

                        {departments.map(
                            (department) => (
                                <option
                                    key={
                                        department.id
                                    }
                                    value={
                                        department.id
                                    }
                                >
                                    {
                                        department.name
                                    }
                                </option>
                            )
                        )}

                    </select>

                </div>

                <div className="employee-filter">

                    <select
                        value={sortBy}
                        onChange={(e) =>
                            setSortBy(
                                e.target.value
                            )
                        }
                    >

                        <option value="None">
                            No Sort
                        </option>

                        <option value="Name">
                            Name
                        </option>

                        <option value="Salary">
                            Salary
                        </option>

                        <option value="Hire Date">
                            Hire Date
                        </option>

                    </select>

                </div>

            </section>

            {/* Results information */}
            <div className="employee-results-info">

                <span>
                    Showing{" "}
                    <strong>
                        {
                            sortedEmployees.length
                        }
                    </strong>{" "}
                    {
                        sortedEmployees.length === 1
                            ? "employee"
                            : "employees"
                    }
                </span>

            </div>

            {/* Add / edit employee form */}
            {showForm && isAdmin && (
                <section
                    ref={employeeFormRef}
                    className="employee-form"
                >

                    <div className="employee-form-header">

                        <div>

                            <h2>
                                {
                                    editingEmployee !==
                                    null
                                        ? "Edit Employee"
                                        : "Add New Employee"
                                }
                            </h2>

                            <p>
                                Enter the employee
                                information below.
                            </p>

                        </div>

                    </div>

                    <div className="form-error-container">

                        {formError && (
                            <p className="form-error">
                                {formError}
                            </p>
                        )}

                    </div>

                    <div className="employee-form-grid">

                        <div className="employee-form-field">

                            <label htmlFor="employee-first-name">
                                First Name
                            </label>

                            <input
                                id="employee-first-name"
                                type="text"
                                placeholder="Enter first name"
                                value={firstName}
                                onChange={(e) => {
                                    setFirstName(
                                        e.target.value
                                    )
                                    setFormError("")
                                }}
                                required
                            />

                        </div>

                        <div className="employee-form-field">

                            <label htmlFor="employee-last-name">
                                Last Name
                            </label>

                            <input
                                id="employee-last-name"
                                type="text"
                                placeholder="Enter last name"
                                value={lastName}
                                onChange={(e) => {
                                    setLastName(
                                        e.target.value
                                    )
                                    setFormError("")
                                }}
                                required
                            />

                        </div>

                        <div className="employee-form-field">

                            <label htmlFor="employee-email">
                                Email
                            </label>

                            <input
                                id="employee-email"
                                type="email"
                                placeholder="employee@example.com"
                                value={email}
                                onChange={(e) => {
                                    setEmail(
                                        e.target.value
                                    )
                                    setFormError("")
                                }}
                                required
                            />

                        </div>

                        <div className="employee-form-field">

                            <label htmlFor="employee-phone">
                                Phone
                            </label>

                            <input
                                id="employee-phone"
                                type="tel"
                                placeholder="Enter phone number"
                                value={phone}
                                onChange={(e) => {
                                    setPhone(
                                        e.target.value
                                    )
                                    setFormError("")
                                }}
                                required
                            />

                        </div>

                        <div className="employee-form-field">

                            <label htmlFor="employee-position">
                                Position
                            </label>

                            <input
                                id="employee-position"
                                type="text"
                                placeholder="e.g. Software Developer"
                                value={position}
                                onChange={(e) => {
                                    setPosition(
                                        e.target.value
                                    )
                                    setFormError("")
                                }}
                                required
                            />

                        </div>

                        <div className="employee-form-field">

                            <label htmlFor="employee-salary">
                                Salary
                            </label>

                            <input
                                id="employee-salary"
                                type="number"
                                placeholder="Enter salary"
                                value={salary}
                                min="0"
                                onChange={(e) => {
                                    setSalary(
                                        e.target.value
                                    )
                                    setFormError("")
                                }}
                                required
                            />

                        </div>

                        <div className="employee-form-field">

                            <label htmlFor="employee-hire-date">
                                Hire Date
                            </label>

                            <input
                                id="employee-hire-date"
                                type="date"
                                value={hireDate}
                                onChange={(e) => {
                                    setHireDate(
                                        e.target.value
                                    )
                                    setFormError("")
                                }}
                                required
                            />

                        </div>

                        <div className="employee-form-field">

                            <label htmlFor="employee-status">
                                Status
                            </label>

                            <select
                                id="employee-status"
                                value={status}
                                onChange={(e) => {
                                    setStatus(
                                        e.target.value as
                                            Employee["status"]
                                    )
                                    setFormError("")
                                }}
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

                    <div className="employee-form-actions">

                        <button
                            type="button"
                            className="create-employee-btn"
                            onClick={
                                handleCreateEmployee
                            }
                        >
                            {
                                editingEmployee !==
                                null
                                    ? "Update Employee"
                                    : "Create Employee"
                            }
                        </button>

                        <button
                            type="button"
                            className="employee-cancel-btn"
                            onClick={
                                resetForm
                            }
                        >
                            Cancel
                        </button>

                    </div>

                </section>
            )}

            {/* Employee grid */}
            <section className="employees-grid">

                {sortedEmployees.length > 0 ? (

                    sortedEmployees.map(
                        (employee) => (

                            <div
                                key={employee.id}
                                id={`employee-${employee.id}`}
                            >

                                <EmployeeCard
                                    employee={
                                        employee
                                    }
                                    onDelete={
                                        handleDeleteEmployee
                                    }
                                    onEdit={
                                        handleEditEmployee
                                    }
                                />

                            </div>

                        )
                    )

                ) : (

                    <div className="employee-empty-state">

                        <div className="employee-empty-icon">
                            <Search size={26} />
                        </div>

                        <h2>
                            No Employees Found
                        </h2>

                        <p>
                            No employees match your
                            current search or filters.
                        </p>

                        <button
                            type="button"
                            className="clear-employee-search-btn"
                            onClick={() => {
                                setSearch("")
                                setStatusFilter(
                                    "All"
                                )
                                setDepartmentFilter(
                                    "All"
                                )
                                setSortBy(
                                    "None"
                                )
                            }}
                        >
                            Clear Filters
                        </button>

                    </div>

                )}

            </section>

            {/* Delete confirmation */}
            {employeeToDelete !== null &&
                isAdmin && (
                    <Modal
                        title="Delete Employee"
                        message="Are you sure you want to delete this employee?"
                        onCancel={() =>
                            setEmployeeToDelete(
                                null
                            )
                        }
                        onConfirm={
                            confirmDeleteEmployee
                        }
                    />
                )}

        </main>
    )
}