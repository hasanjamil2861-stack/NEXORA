import type { Employee } from "../../types/Employee"
import { departments } from "../../data/departments"

import { useNavigate } from "react-router-dom"

import {
    Mail,
    Phone,
    Building2,
    WalletCards,
    CalendarDays,
    Eye,
    Pencil,
    Trash2,
    BriefcaseBusiness,
    CircleCheck,
    CircleX,
} from "lucide-react"

type EmployeeCardProps = {
    employee: Employee
    onDelete: (id: string) => void
    onEdit: (id: string) => void
}

export default function EmployeeCard({
    employee,
    onDelete,
    onEdit,
}: EmployeeCardProps) {

    const navigate = useNavigate()

    /* =========================================================
       FIND EMPLOYEE DEPARTMENT
       ========================================================= */

    const department = departments.find(
        (department) =>
            String(department.id) ===
            String(employee.departmentId)
    )

    /* =========================================================
       CREATE AVATAR INITIALS
       ========================================================= */

    const initials =
        `${employee.firstName.charAt(0)}${employee.lastName.charAt(0)}`
            .toUpperCase()

    const isActive = employee.status === "Active"

    return (

        <article className="employee-card">

            {/* =================================================
               EMPLOYEE HEADER
               ================================================= */}

            <div className="employee-card-header">

                <div className="employee-avatar">
                    {initials}
                </div>

                <div className="employee-main-info">

                    <div className="employee-name-row">

                        <h2>
                            {employee.firstName}{" "}
                            {employee.lastName}
                        </h2>

                    </div>

                    <p className="employee-position">
                        <BriefcaseBusiness size={13} />
                        {employee.position}
                    </p>

                    <span className="employee-id">
                        Employee #{employee.id}
                    </span>

                </div>

                <span
                    className={`employee-status ${
                        employee.status.toLowerCase()
                    }`}
                >
                    {isActive ? (
                        <CircleCheck size={13} />
                    ) : (
                        <CircleX size={13} />
                    )}

                    {employee.status}
                </span>

            </div>


            {/* =================================================
               EMPLOYEE DETAILS
               ================================================= */}

            <div className="employee-details">

                <div className="employee-detail-row">

                    <div className="employee-detail-icon">
                        <Mail size={14} />
                    </div>

                    <div className="employee-detail-content">

                        <span>
                            Email
                        </span>

                        <strong>
                            {employee.email}
                        </strong>

                    </div>

                </div>


                <div className="employee-detail-row">

                    <div className="employee-detail-icon">
                        <Phone size={14} />
                    </div>

                    <div className="employee-detail-content">

                        <span>
                            Phone
                        </span>

                        <strong>
                            {employee.phone}
                        </strong>

                    </div>

                </div>


                <div className="employee-detail-row">

                    <div className="employee-detail-icon">
                        <Building2 size={14} />
                    </div>

                    <div className="employee-detail-content">

                        <span>
                            Department
                        </span>

                        <strong>
                            {department?.name ||
                                "Not Assigned"}
                        </strong>

                    </div>

                </div>

            </div>


            {/* =================================================
               EMPLOYEE SUMMARY
               ================================================= */}

            <div className="employee-summary">

                <div className="employee-summary-item">

                    <div className="employee-summary-icon salary-icon">
                        <WalletCards size={14} />
                    </div>

                    <div>

                        <span>
                            Salary
                        </span>

                        <strong>
                            $
                            {employee.salary.toLocaleString()}
                        </strong>

                    </div>

                </div>


                <div className="employee-summary-item">

                    <div className="employee-summary-icon date-icon">
                        <CalendarDays size={14} />
                    </div>

                    <div>

                        <span>
                            Hired
                        </span>

                        <strong>
                            {employee.hireDate}
                        </strong>

                    </div>

                </div>

            </div>


            {/* =================================================
               CRUD ACTIONS
               ================================================= */}

            <div className="employee-actions">

                <button
                    type="button"
                    className="view-details-btn"
                    onClick={() =>
                        navigate(
                            `/employees/${employee.id}`
                        )
                    }
                >
                    <Eye size={14} />
                    View Details
                </button>


                <button
                    type="button"
                    className="edit-btn"
                    onClick={() =>
                        onEdit(employee.id)
                    }
                >
                    <Pencil size={14} />
                    Edit
                </button>


                <button
                    type="button"
                    className="delete-btn"
                    onClick={() =>
                        onDelete(employee.id)
                    }
                >
                    <Trash2 size={14} />
                    Delete
                </button>

            </div>

        </article>
    )
}