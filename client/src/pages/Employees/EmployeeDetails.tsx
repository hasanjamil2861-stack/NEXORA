import {
    ArrowLeft,
    BriefcaseBusiness,
    Building2,
    CalendarDays,
    CircleCheck,
    CircleX,
    Mail,
    Phone,
    ShieldCheck,
    UserRound,
    UsersRound,
    WalletCards,
} from "lucide-react"

import {
    useEffect,
    useState,
} from "react"

import {
    useNavigate,
    useParams,
} from "react-router-dom"

import { departments } from "../../data/departments"
import type { Employee } from "../../types/Employee"
import { getEmployees } from "../../services/api/employeeApi"

type EmployeeUser = {
    _id?: string
    name?: string
    email?: string
    role?: "Admin" | "Employee"
}

type EmployeeRecord = {
    _id: string
    firstName?: string
    lastName?: string
    email?: string
    phone?: string
    position?: string
    departmentId?: string | number
    salary?: number
    hireDate?: string
    status?: "Active" | "Inactive"
    profileImage?: string
    userId?: EmployeeUser | string | null
}

export default function EmployeeDetails() {
    const { id } = useParams()
    const navigate = useNavigate()

    const [employee, setEmployee] =
        useState<Employee | null>(null)

    const [profileImage, setProfileImage] =
        useState<string | null>(null)

    const [employeeUser, setEmployeeUser] =
        useState<EmployeeUser | null>(null)

    const [loading, setLoading] =
        useState(true)

    useEffect(() => {
        const fetchEmployee = async () => {
            try {
                setLoading(true)

                const response =
                    (await getEmployees()) as EmployeeRecord[]

                const foundEmployee =
                    response.find(
                        (item) =>
                            String(item._id) ===
                            String(id)
                    )

                if (!foundEmployee) {
                    setEmployee(null)
                    setProfileImage(null)
                    setEmployeeUser(null)
                    return
                }

                const formattedEmployee: Employee = {
                    id: String(
                        foundEmployee._id
                    ),

                    firstName:
                        foundEmployee.firstName ||
                        "",

                    lastName:
                        foundEmployee.lastName ||
                        "",

                    email:
                        foundEmployee.email ||
                        "",

                    phone:
                        foundEmployee.phone ||
                        "",

                    position:
                        foundEmployee.position ||
                        "",

                    departmentId:
                        String(
                            foundEmployee.departmentId ||
                                ""
                        ),

                    salary:
                        Number(
                            foundEmployee.salary ||
                                0
                        ),

                    hireDate:
                        foundEmployee.hireDate ||
                        "",

                    status:
                        foundEmployee.status ||
                        "Active",
                }

                setEmployee(
                    formattedEmployee
                )

                setProfileImage(
                    foundEmployee.profileImage ||
                        null
                )

                if (
                    foundEmployee.userId &&
                    typeof foundEmployee.userId ===
                        "object"
                ) {
                    setEmployeeUser(
                        foundEmployee.userId
                    )
                } else {
                    setEmployeeUser(null)
                }
            } catch (error) {
                console.error(
                    "Failed to load employee:",
                    error
                )

                setEmployee(null)
                setProfileImage(null)
                setEmployeeUser(null)
            } finally {
                setLoading(false)
            }
        }

        fetchEmployee()
    }, [id])

    if (loading) {
        return (
            <main className="employee-details-page">
                <div className="employee-not-found">
                    <div className="employee-not-found-icon">
                        <UserRound size={28} />
                    </div>

                    <span>
                        EMPLOYEE PROFILE
                    </span>

                    <h1>
                        Loading Employee...
                    </h1>

                    <p>
                        Please wait while the
                        employee profile is loading.
                    </p>
                </div>
            </main>
        )
    }

    if (!employee) {
        return (
            <main className="employee-details-page">
                <div className="employee-not-found">
                    <div className="employee-not-found-icon">
                        <UserRound size={28} />
                    </div>

                    <span>
                        EMPLOYEE PROFILE
                    </span>

                    <h1>
                        Employee Not Found
                    </h1>

                    <p>
                        This employee does not exist
                        or may have been removed.
                    </p>

                    <button
                        type="button"
                        className="employee-back-btn"
                        onClick={() =>
                            navigate(
                                "/employees"
                            )
                        }
                    >
                        <ArrowLeft size={17} />

                        Back to Employees
                    </button>
                </div>
            </main>
        )
    }

    const department =
        departments.find(
            (department) =>
                String(department.id) ===
                String(
                    employee.departmentId
                )
        )

    const fullName =
        `${employee.firstName} ${employee.lastName}`.trim()

    const initials =
        fullName
            .split(" ")
            .filter(Boolean)
            .map(
                (name) =>
                    name.charAt(0)
            )
            .join("")
            .slice(0, 2)
            .toUpperCase()

    const isActive =
        employee.status === "Active"

    const accountName =
        employeeUser?.name ||
        fullName

    const accountEmail =
        employeeUser?.email ||
        employee.email

    const accountRole =
        employeeUser?.role ||
        "Employee"

    return (
        <main className="employee-details-page">

            {/* PAGE HEADER */}

            <header className="employee-details-header">

                <div className="employee-details-header-content">

                    <div className="employee-details-header-icon">
                        <UserRound size={25} />
                    </div>

                    <div>
                        <span className="employee-details-eyebrow">
                            EMPLOYEE MANAGEMENT
                        </span>

                        <h1>
                            Employee Profile
                        </h1>

                        <p>
                            View the complete profile
                            and employment information
                            for this employee.
                        </p>
                    </div>

                </div>

                <button
                    type="button"
                    className="employee-back-btn"
                    onClick={() =>
                        navigate(
                            "/employees"
                        )
                    }
                >
                    <ArrowLeft size={17} />

                    Back to Employees
                </button>

            </header>

            {/* PROFILE SUMMARY */}

            <section className="employee-details-profile">

                <div className="employee-profile-main">

                    <div className="employee-details-avatar">

                        {profileImage ? (
                            <img
                                src={
                                    profileImage
                                }
                                alt={`${fullName} profile`}
                                className="employee-details-avatar-image"
                            />
                        ) : (
                            initials || "U"
                        )}

                    </div>

                    <div className="employee-profile-content">

                        <div className="employee-profile-name-row">

                            <div>
                                <span className="employee-profile-label">
                                    EMPLOYEE PROFILE
                                </span>

                                <h2>
                                    {fullName ||
                                        "Unnamed Employee"}
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
                                    <CircleCheck
                                        size={14}
                                    />
                                ) : (
                                    <CircleX
                                        size={14}
                                    />
                                )}

                                {employee.status}
                            </span>

                        </div>

                        <p className="employee-profile-position">

                            <BriefcaseBusiness
                                size={15}
                            />

                            {employee.position ||
                                "Employee"}

                        </p>

                        <span className="employee-profile-id">
                            Employee #{employee.id}
                        </span>

                    </div>

                </div>

                <div className="employee-profile-summary">

                    <div className="employee-profile-summary-item">

                        <div className="employee-profile-summary-icon salary">
                            <WalletCards
                                size={17}
                            />
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
                            <Building2
                                size={17}
                            />
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

            {/* PERSONAL & EMPLOYMENT INFORMATION */}

            <section className="employee-information-section">

                <div className="employee-section-heading">

                    <div className="employee-section-icon">
                        <UserRound size={18} />
                    </div>

                    <div>
                        <span>
                            PERSONAL INFORMATION
                        </span>

                        <h2>
                            Personal & Employment Details
                        </h2>
                    </div>

                </div>

                <div className="employee-details-info">

                    <div className="employee-details-item">

                        <div className="employee-details-item-icon">
                            <UserRound
                                size={17}
                            />
                        </div>

                        <div>
                            <span>
                                First Name
                            </span>

                            <strong>
                                {employee.firstName ||
                                    "Not Available"}
                            </strong>
                        </div>

                    </div>

                    <div className="employee-details-item">

                        <div className="employee-details-item-icon">
                            <UserRound
                                size={17}
                            />
                        </div>

                        <div>
                            <span>
                                Last Name
                            </span>

                            <strong>
                                {employee.lastName ||
                                    "Not Available"}
                            </strong>
                        </div>

                    </div>

                    <div className="employee-details-item">

                        <div className="employee-details-item-icon">
                            <Mail size={17} />
                        </div>

                        <div>
                            <span>
                                Email Address
                            </span>

                            <strong className="employee-details-email">
                                {employee.email ||
                                    "Not Available"}
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
                                {employee.phone ||
                                    "Not Available"}
                            </strong>
                        </div>

                    </div>

                    <div className="employee-details-item">

                        <div className="employee-details-item-icon">
                            <BriefcaseBusiness
                                size={17}
                            />
                        </div>

                        <div>
                            <span>
                                Position
                            </span>

                            <strong>
                                {employee.position ||
                                    "Not Assigned"}
                            </strong>
                        </div>

                    </div>

                    <div className="employee-details-item">

                        <div className="employee-details-item-icon">
                            <Building2
                                size={17}
                            />
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
                            <UsersRound
                                size={17}
                            />
                        </div>

                        <div>
                            <span>
                                Manager
                            </span>

                            <strong>
                                {department?.manager ||
                                    "Not Assigned"}
                            </strong>
                        </div>

                    </div>

                    <div className="employee-details-item">

                        <div className="employee-details-item-icon">
                            <WalletCards
                                size={17}
                            />
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
                            <CalendarDays
                                size={17}
                            />
                        </div>

                        <div>
                            <span>
                                Hire Date
                            </span>

                            <strong>
                                {employee.hireDate ||
                                    "Not Available"}
                            </strong>
                        </div>

                    </div>

                    <div className="employee-details-item">

                        <div className="employee-details-item-icon status">
                            {isActive ? (
                                <CircleCheck
                                    size={17}
                                />
                            ) : (
                                <CircleX
                                    size={17}
                                />
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

            {/* NEXORA ACCOUNT */}

            <section className="employee-information-section">

                <div className="employee-section-heading">

                    <div className="employee-section-icon">
                        <ShieldCheck
                            size={18}
                        />
                    </div>

                    <div>
                        <span>
                            ACCOUNT INFORMATION
                        </span>

                        <h2>
                            NEXORA Account
                        </h2>
                    </div>

                </div>

                <div className="employee-details-info">

                    <div className="employee-details-item">

                        <div className="employee-details-item-icon">
                            <UserRound
                                size={17}
                            />
                        </div>

                        <div>
                            <span>
                                Account Name
                            </span>

                            <strong>
                                {accountName}
                            </strong>
                        </div>

                    </div>

                    <div className="employee-details-item">

                        <div className="employee-details-item-icon">
                            <Mail size={17} />
                        </div>

                        <div>
                            <span>
                                Account Email
                            </span>

                            <strong className="employee-details-email">
                                {accountEmail}
                            </strong>
                        </div>

                    </div>

                    <div className="employee-details-item">

                        <div className="employee-details-item-icon">
                            <ShieldCheck
                                size={17}
                            />
                        </div>

                        <div>
                            <span>
                                Account Role
                            </span>

                            <strong>
                                {accountRole}
                            </strong>
                        </div>

                    </div>

                </div>

            </section>

            {/* FOOTER */}

            <div className="employee-details-footer">

                <div className="employee-details-footer-left">

                    <div className="employee-footer-icon">
                        <CircleCheck
                            size={16}
                        />
                    </div>

                    <div>
                        <strong>
                            Employee Profile
                        </strong>

                        <span>
                            Information displayed from
                            the employee's NEXORA
                            employee record and account.
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