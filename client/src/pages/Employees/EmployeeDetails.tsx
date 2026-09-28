import {
  useNavigate,
  useParams,
} from "react-router-dom"
import { useEffect, useState } from "react"

import {
  ArrowLeft,
  Building2,
  BriefcaseBusiness,
  CalendarDays,
  CircleCheck,
  CircleX,
  Mail,
  Phone,
  WalletCards,
  UserRound,
} from "lucide-react"

import { departments } from "../../data/departments"
import type { Employee } from "../../types/Employee"

import { getEmployees } from "../../services/api/employeeApi"

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
  status?: "Active" | "Inactive"
}

export default function EmployeeDetails() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [employee, setEmployee] =
    useState<Employee | null>(null)

  const [loading, setLoading] =
    useState(true)

  // Load employee details from MongoDB
  useEffect(() => {
    async function fetchEmployee() {
      try {
        setLoading(true)

        const data =
          (await getEmployees()) as EmployeeApiRecord[]

        const foundEmployee =
          data.find(
            (item) => item._id === id
          )

        if (!foundEmployee) {
          setEmployee(null)
          return
        }

        const formattedEmployee: Employee = {
          id: foundEmployee._id,
          firstName:
            foundEmployee.firstName ?? "",
          lastName:
            foundEmployee.lastName ?? "",
          email:
            foundEmployee.email ?? "",
          phone:
            foundEmployee.phone ?? "",
          position:
            foundEmployee.position ?? "",
          departmentId:
            foundEmployee.departmentId ?? 0,
          salary:
            foundEmployee.salary ?? 0,
          hireDate:
            foundEmployee.hireDate ?? "",
          status:
            foundEmployee.status ?? "Active",
        }

        setEmployee(formattedEmployee)
      } catch {
        setEmployee(null)
      } finally {
        setLoading(false)
      }
    }

    fetchEmployee()
  }, [id])

  // Loading state
  if (loading) {
    return (
      <main className="employee-details-page">
        <div className="employee-not-found">
          <div className="employee-not-found-icon">
            <UserRound size={28} />
          </div>

          <span>
            EMPLOYEE MANAGEMENT
          </span>

          <h1>
            Loading Employee...
          </h1>

          <p>
            Please wait while we load the
            employee information.
          </p>
        </div>
      </main>
    )
  }

  // Employee not found state
  if (!employee) {
    return (
      <main className="employee-details-page">
        <div className="employee-not-found">
          <div className="employee-not-found-icon">
            <UserRound size={28} />
          </div>

          <span>
            EMPLOYEE MANAGEMENT
          </span>

          <h1>
            Employee Not Found
          </h1>

          <p>
            The employee you are looking for
            does not exist or may have been removed.
          </p>

          <button
            type="button"
            className="employee-back-btn"
            onClick={() =>
              navigate("/employees")
            }
          >
            <ArrowLeft size={17} />
            Back to Employees
          </button>
        </div>
      </main>
    )
  }

  // Find department from the current department data
  const department =
    departments.find(
      (item) =>
        String(item.id) ===
        String(employee.departmentId)
    )

  const initials =
    `${employee.firstName.charAt(0)}${employee.lastName.charAt(0)}`
      .toUpperCase()

  const isActive =
    employee.status === "Active"

  return (
    <main className="employee-details-page">

      {/* Page header */}
      <header className="employee-details-header">
        <div className="employee-details-header-content">
          <div className="employee-details-header-icon">
            <UserRound size={25} />
          </div>

          <div>
            <span className="employee-details-eyebrow">
              WORKFORCE MANAGEMENT
            </span>

            <h1>
              Employee Details
            </h1>

            <p>
              View detailed information and
              employment data for this team member.
            </p>
          </div>
        </div>

        <button
          type="button"
          className="employee-back-btn"
          onClick={() =>
            navigate("/employees")
          }
        >
          <ArrowLeft size={17} />
          Back to Employees
        </button>
      </header>

      {/* Employee profile */}
      <section className="employee-details-profile">
        <div className="employee-profile-main">
          <div className="employee-details-avatar">
            {initials}
          </div>

          <div className="employee-profile-content">
            <div className="employee-profile-name-row">
              <div>
                <span className="employee-profile-label">
                  EMPLOYEE PROFILE
                </span>

                <h2>
                  {employee.firstName}{" "}
                  {employee.lastName}
                </h2>
              </div>

              <span
                className={`employee-details-status ${
                  isActive
                    ? "active"
                    : "inactive"
                }`}
              >
                {isActive ? (
                  <CircleCheck size={14} />
                ) : (
                  <CircleX size={14} />
                )}

                {employee.status}
              </span>
            </div>

            <p className="employee-profile-position">
              <BriefcaseBusiness size={15} />
              {employee.position}
            </p>

            <span className="employee-profile-id">
              Employee #{employee.id}
            </span>
          </div>
        </div>

        <div className="employee-profile-summary">
          <div className="employee-profile-summary-item">
            <div className="employee-profile-summary-icon salary">
              <WalletCards size={17} />
            </div>

            <div>
              <span>
                Monthly Salary
              </span>

              <strong>
                $
                {employee.salary.toLocaleString()}
              </strong>
            </div>
          </div>

          <div className="employee-profile-summary-item">
            <div className="employee-profile-summary-icon department">
              <Building2 size={17} />
            </div>

            <div>
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
      </section>

      {/* Employee information */}
      <section className="employee-information-section">
        <div className="employee-section-heading">
          <div className="employee-section-icon">
            <UserRound size={18} />
          </div>

          <div>
            <span>
              EMPLOYEE INFORMATION
            </span>

            <h2>
              Personal & Employment Details
            </h2>
          </div>
        </div>

        <div className="employee-details-info">
          <div className="employee-details-item">
            <div className="employee-details-item-icon">
              <Mail size={17} />
            </div>

            <div>
              <span>
                Email Address
              </span>

              <strong className="employee-details-email">
                {employee.email}
              </strong>
            </div>
          </div>

          <div className="employee-details-item">
            <div className="employee-details-item-icon">
              <Phone size={17} />
            </div>

            <div>
              <span>
                Phone Number
              </span>

              <strong>
                {employee.phone}
              </strong>
            </div>
          </div>

          <div className="employee-details-item">
            <div className="employee-details-item-icon">
              <BriefcaseBusiness size={17} />
            </div>

            <div>
              <span>
                Position
              </span>

              <strong>
                {employee.position}
              </strong>
            </div>
          </div>

          <div className="employee-details-item">
            <div className="employee-details-item-icon">
              <Building2 size={17} />
            </div>

            <div>
              <span>
                Department
              </span>

              <strong>
                {department?.name ||
                  "Not Assigned"}
              </strong>
            </div>
          </div>

          <div className="employee-details-item">
            <div className="employee-details-item-icon">
              <WalletCards size={17} />
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

          <div className="employee-details-item">
            <div className="employee-details-item-icon">
              <CalendarDays size={17} />
            </div>

            <div>
              <span>
                Hire Date
              </span>

              <strong>
                {employee.hireDate}
              </strong>
            </div>
          </div>

          <div className="employee-details-item">
            <div className="employee-details-item-icon status">
              {isActive ? (
                <CircleCheck size={17} />
              ) : (
                <CircleX size={17} />
              )}
            </div>

            <div>
              <span>
                Employment Status
              </span>

              <strong
                className={`employee-details-status-text ${
                  isActive
                    ? "active"
                    : "inactive"
                }`}
              >
                {employee.status}
              </strong>
            </div>
          </div>
        </div>
      </section>

      {/* Employee record footer */}
      <div className="employee-details-footer">
        <div className="employee-details-footer-left">
          <div className="employee-footer-icon">
            <CircleCheck size={16} />
          </div>

          <div>
            <strong>
              Employee Record
            </strong>

            <span>
              Information shown from the current
              NEXORA employee workspace.
            </span>
          </div>
        </div>

        <span className="employee-record-id">
          ID #{employee.id}
        </span>
      </div>
    </main>
  )
}