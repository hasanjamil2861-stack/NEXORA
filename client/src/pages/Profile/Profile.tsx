import {
    Camera,
    Mail,
    Phone,
    BriefcaseBusiness,
    Building2,
    CalendarDays,
    ShieldCheck,
    UserRound,
    UsersRound,
    Pencil,
    Save,
    X,
    Trash2,
    WalletCards,
    CircleCheck,
    CircleX,
} from "lucide-react"

import {
    useEffect,
    useState,
    type ChangeEvent,
    type FormEvent,
} from "react"

import { useAuth } from "../../context/AuthContext"

import {
    getProfile,
    updateProfile,
} from "../../services/api/profileApi"

import { departments } from "../../data/departments"

import { useToast } from "../../context/ToastContext"

import type { Employee } from "../../types/Employee"

type EmployeeApiResponse = Employee & {
    _id?: string
}

type ProfileFormData = {
    firstName: string
    lastName: string
    email: string
    phone: string
    position: string
    departmentId: string
    salary: number
    hireDate: string
    status: "Active" | "Inactive"
}

export default function Profile() {
    const { user } = useAuth()
    const { showToast } = useToast()

    const [employee, setEmployee] =
        useState<Employee | null>(null)

    const [profileImage, setProfileImage] =
        useState<string | null>(null)

    const [loading, setLoading] =
        useState(true)

    const [saving, setSaving] =
        useState(false)

    const [isEditing, setIsEditing] =
        useState(false)

    const [profileError, setProfileError] =
        useState(false)

    const [formData, setFormData] =
        useState<ProfileFormData>({
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            position: "",
            departmentId: "",
            salary: 0,
            hireDate: "",
            status: "Active",
        })

    useEffect(() => {
        if (!user) {
            setLoading(false)
            return
        }

        const currentUser = user

        const savedImage =
            localStorage.getItem(
                `nexora-profile-image-${currentUser.id}`
            )

        if (savedImage) {
            setProfileImage(savedImage)
        }

        async function loadProfile() {
            try {
                setProfileError(false)

                const data =
                    (await getProfile(
                        currentUser.id
                    )) as EmployeeApiResponse

                const loadedEmployee: Employee = {
                    id: String(
                        data._id ?? data.id
                    ),
                    firstName:
                        data.firstName ?? "",
                    lastName:
                        data.lastName ?? "",
                    email:
                        data.email ??
                        currentUser.email ??
                        "",
                    phone:
                        data.phone ?? "",
                    position:
                        data.position ??
                        (currentUser.role ===
                        "Admin"
                            ? "Administrator"
                            : "Employee"),
                    departmentId:
                        String(
                            data.departmentId ?? ""
                        ),
                    salary:
                        Number(
                            data.salary ?? 0
                        ),
                    hireDate:
                        data.hireDate ?? "",
                    status:
                        data.status ?? "Active",
                }

                setEmployee(
                    loadedEmployee
                )

                setFormData({
                    firstName:
                        loadedEmployee.firstName,
                    lastName:
                        loadedEmployee.lastName,
                    email:
                        loadedEmployee.email,
                    phone:
                        loadedEmployee.phone,
                    position:
                        loadedEmployee.position,
                    departmentId:
                        loadedEmployee.departmentId,
                    salary:
                        loadedEmployee.salary,
                    hireDate:
                        loadedEmployee.hireDate,
                    status:
                        loadedEmployee.status,
                })
            } catch (error) {
                console.error(
                    "PROFILE LOAD ERROR:",
                    error
                )

                setProfileError(true)
                setEmployee(null)
            } finally {
                setLoading(false)
            }
        }

        loadProfile()
    }, [user])

    if (!user) {
        return null
    }

    const currentUser = user

    const handleProfileImage = (
        event: ChangeEvent<HTMLInputElement>
    ) => {
        const file =
            event.target.files?.[0]

        if (!file) {
            return
        }

        if (
            !file.type.startsWith(
                "image/"
            )
        ) {
            showToast(
                "Please select an image file.",
                "error"
            )

            event.target.value = ""
            return
        }

        if (
            file.size >
            5 * 1024 * 1024
        ) {
            showToast(
                "Image must be smaller than 5MB.",
                "error"
            )

            event.target.value = ""
            return
        }

        const reader =
            new FileReader()

        reader.onload = () => {
            const image =
                reader.result

            if (
                typeof image !== "string"
            ) {
                return
            }

            try {
                localStorage.setItem(
                    `nexora-profile-image-${currentUser.id}`,
                    image
                )

                setProfileImage(image)

                showToast(
                    "Profile picture updated.",
                    "success"
                )
            } catch {
                showToast(
                    "Unable to save profile picture.",
                    "error"
                )
            }
        }

        reader.readAsDataURL(file)

        event.target.value = ""
    }

    const handleDeleteProfileImage = () => {
        try {
            localStorage.removeItem(
                `nexora-profile-image-${currentUser.id}`
            )

            setProfileImage(null)

            showToast(
                "Profile picture removed.",
                "success"
            )
        } catch {
            showToast(
                "Unable to remove profile picture.",
                "error"
            )
        }
    }

    const handleInputChange = (
        field: keyof ProfileFormData,
        value: string
    ) => {
        setFormData(
            (current) => ({
                ...current,
                [field]:
                    field === "salary"
                        ? Number(value)
                        : value,
            })
        )
    }

    const handleEdit = () => {
        if (!employee) {
            showToast(
                "Profile data is not available.",
                "error"
            )

            return
        }

        setFormData({
            firstName:
                employee.firstName,
            lastName:
                employee.lastName,
            email:
                employee.email,
            phone:
                employee.phone,
            position:
                employee.position,
            departmentId:
                employee.departmentId,
            salary:
                employee.salary,
            hireDate:
                employee.hireDate,
            status:
                employee.status,
        })

        setIsEditing(true)
    }

    const handleCancel = () => {
        if (employee) {
            setFormData({
                firstName:
                    employee.firstName,
                lastName:
                    employee.lastName,
                email:
                    employee.email,
                phone:
                    employee.phone,
                position:
                    employee.position,
                departmentId:
                    employee.departmentId,
                salary:
                    employee.salary,
                hireDate:
                    employee.hireDate,
                status:
                    employee.status,
            })
        }

        setIsEditing(false)
    }

    const handleSave = async (
        event: FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault()

        if (!employee) {
            return
        }

        if (
            !formData.firstName.trim() ||
            !formData.lastName.trim() ||
            !formData.email.trim() ||
            !formData.phone.trim() ||
            !formData.position.trim()
        ) {
            showToast(
                "Please complete all required fields.",
                "error"
            )

            return
        }

        if (formData.salary < 0) {
            showToast(
                "Salary cannot be negative.",
                "error"
            )

            return
        }

        try {
            setSaving(true)

            const data =
                (await updateProfile(
                    employee.id,
                    {
                        firstName:
                            formData.firstName.trim(),
                        lastName:
                            formData.lastName.trim(),
                        email:
                            formData.email.trim(),
                        phone:
                            formData.phone.trim(),
                        position:
                            formData.position.trim(),
                        departmentId:
                            formData.departmentId,
                        salary:
                            Number(
                                formData.salary
                            ),
                        hireDate:
                            formData.hireDate,
                        status:
                            formData.status,
                    }
                )) as EmployeeApiResponse

            const updatedEmployee: Employee = {
                id: String(
                    data._id ?? data.id
                ),
                firstName:
                    data.firstName ?? "",
                lastName:
                    data.lastName ?? "",
                email:
                    data.email ?? "",
                phone:
                    data.phone ?? "",
                position:
                    data.position ?? "",
                departmentId:
                    String(
                        data.departmentId ?? ""
                    ),
                salary:
                    Number(
                        data.salary ?? 0
                    ),
                hireDate:
                    data.hireDate ?? "",
                status:
                    data.status ?? "Active",
            }

            setEmployee(
                updatedEmployee
            )

            setFormData({
                firstName:
                    updatedEmployee.firstName,
                lastName:
                    updatedEmployee.lastName,
                email:
                    updatedEmployee.email,
                phone:
                    updatedEmployee.phone,
                position:
                    updatedEmployee.position,
                departmentId:
                    updatedEmployee.departmentId,
                salary:
                    updatedEmployee.salary,
                hireDate:
                    updatedEmployee.hireDate,
                status:
                    updatedEmployee.status,
            })

            setIsEditing(false)
            setProfileError(false)

            showToast(
                "Profile updated successfully.",
                "success"
            )
        } catch (error) {
            console.error(
                "PROFILE UPDATE ERROR:",
                error
            )

            showToast(
                "Failed to update profile.",
                "error"
            )
        } finally {
            setSaving(false)
        }
    }

    const department =
        employee?.departmentId
            ? departments.find(
                  (department) =>
                      String(
                          department.id
                      ) ===
                      String(
                          employee.departmentId
                      )
              )
            : undefined

    const manager =
        department?.manager ||
        "Not Assigned"

    const fullName =
        employee
            ? `${employee.firstName} ${employee.lastName}`.trim()
            : currentUser.name

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

    const position =
        employee?.position ||
        (currentUser.role === "Admin"
            ? "Administrator"
            : "Employee")

    const departmentName =
        department?.name ||
        (currentUser.role === "Admin"
            ? "Management"
            : "Not Assigned")

    const phone =
        employee?.phone ||
        "Not Available"

    const hireDate =
        employee?.hireDate ||
        "Not Available"

    const salary =
        employee?.salary ?? 0

    const status =
        employee?.status ||
        "Active"

    return (
        <main className="profile-page">
            <header className="profile-page-header">
                <div>
                    <span className="profile-eyebrow">
                        ACCOUNT
                    </span>

                    <h1>
                        My Profile
                    </h1>

                    <p>
                        Manage your personal
                        information and account
                        details.
                    </p>
                </div>

                {!loading &&
                    employee && (
                        <div className="profile-header-actions">
                            {!isEditing ? (
                                <button
                                    type="button"
                                    className="profile-edit-btn"
                                    onClick={
                                        handleEdit
                                    }
                                >
                                    <Pencil
                                        size={15}
                                    />
                                    Edit Profile
                                </button>
                            ) : (
                                <>
                                    <button
                                        type="button"
                                        className="profile-cancel-btn"
                                        onClick={
                                            handleCancel
                                        }
                                    >
                                        <X
                                            size={15}
                                        />
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        form="profile-edit-form"
                                        className="profile-save-btn"
                                        disabled={
                                            saving
                                        }
                                    >
                                        <Save
                                            size={15}
                                        />

                                        {saving
                                            ? "Saving..."
                                            : "Save Changes"}
                                    </button>
                                </>
                            )}
                        </div>
                    )}
            </header>

            <section className="profile-card">
                <div className="profile-cover">
                    <div className="profile-cover-glow" />
                </div>

                <div className="profile-main">
                    <div className="profile-avatar-wrapper">
                        {profileImage ? (
                            <img
                                src={
                                    profileImage
                                }
                                alt={`${fullName} profile`}
                                className="profile-avatar-image"
                            />
                        ) : (
                            <div className="profile-avatar">
                                {initials}
                            </div>
                        )}

                        <div className="profile-avatar-actions">
                            <label
                                htmlFor="profile-image-upload"
                                className="profile-camera-btn"
                                title="Change profile picture"
                            >
                                <Camera
                                    size={16}
                                />

                                <input
                                    id="profile-image-upload"
                                    type="file"
                                    accept="image/*"
                                    onChange={
                                        handleProfileImage
                                    }
                                />
                            </label>

                            {profileImage && (
                                <button
                                    type="button"
                                    className="profile-delete-image-btn"
                                    onClick={
                                        handleDeleteProfileImage
                                    }
                                    title="Delete profile picture"
                                    aria-label="Delete profile picture"
                                >
                                    <Trash2
                                        size={15}
                                    />
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="profile-identity">
                        <div className="profile-name-row">
                            <h2>
                                {fullName}
                            </h2>

                            <span
                                className={`profile-role-badge ${currentUser.role.toLowerCase()}`}
                            >
                                <ShieldCheck
                                    size={14}
                                />

                                {
                                    currentUser.role
                                }
                            </span>
                        </div>

                        <p>
                            {position}
                        </p>

                        <span className="profile-email">
                            <Mail size={14} />

                            {
                                employee?.email ||
                                currentUser.email
                            }
                        </span>
                    </div>
                </div>

                <div className="profile-divider" />

                <section className="profile-information">
                    <div className="profile-section-heading">
                        <div className="profile-section-icon">
                            <UserRound
                                size={17}
                            />
                        </div>

                        <div>
                            <h3>
                                Personal Information
                            </h3>

                            <p>
                                Your account and
                                employment details.
                            </p>
                        </div>
                    </div>

                    {loading ? (
                        <div className="profile-loading">
                            Loading profile...
                        </div>
                    ) : (
                        <form
                            id="profile-edit-form"
                            className="profile-details-grid"
                            onSubmit={
                                handleSave
                            }
                        >
                            <div className="profile-detail">
                                <div className="profile-detail-icon">
                                    <Mail
                                        size={17}
                                    />
                                </div>

                                <div>
                                    <span>
                                        Email
                                    </span>

                                    {isEditing &&
                                    employee ? (
                                        <input
                                            type="email"
                                            className="profile-inline-input"
                                            value={
                                                formData.email
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                handleInputChange(
                                                    "email",
                                                    event
                                                        .target
                                                        .value
                                                )
                                            }
                                            required
                                        />
                                    ) : (
                                        <strong>
                                            {employee?.email ||
                                                currentUser.email}
                                        </strong>
                                    )}
                                </div>
                            </div>

                            <div className="profile-detail">
                                <div className="profile-detail-icon">
                                    <Phone
                                        size={17}
                                    />
                                </div>

                                <div>
                                    <span>
                                        Phone
                                    </span>

                                    {isEditing &&
                                    employee ? (
                                        <input
                                            type="tel"
                                            className="profile-inline-input"
                                            value={
                                                formData.phone
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                handleInputChange(
                                                    "phone",
                                                    event
                                                        .target
                                                        .value
                                                )
                                            }
                                            required
                                        />
                                    ) : (
                                        <strong>
                                            {phone}
                                        </strong>
                                    )}
                                </div>
                            </div>

                            <div className="profile-detail">
                                <div className="profile-detail-icon">
                                    <BriefcaseBusiness
                                        size={17}
                                    />
                                </div>

                                <div>
                                    <span>
                                        Position
                                    </span>

                                    {isEditing &&
                                    employee ? (
                                        <input
                                            type="text"
                                            className="profile-inline-input"
                                            value={
                                                formData.position
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                handleInputChange(
                                                    "position",
                                                    event
                                                        .target
                                                        .value
                                                )
                                            }
                                            required
                                        />
                                    ) : (
                                        <strong>
                                            {position}
                                        </strong>
                                    )}
                                </div>
                            </div>

                            <div className="profile-detail">
                                <div className="profile-detail-icon">
                                    <Building2
                                        size={17}
                                    />
                                </div>

                                <div>
                                    <span>
                                        Department
                                    </span>

                                    {isEditing &&
                                    employee ? (
                                        <select
                                            className="profile-inline-input"
                                            value={
                                                formData.departmentId
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                handleInputChange(
                                                    "departmentId",
                                                    event
                                                        .target
                                                        .value
                                                )
                                            }
                                        >
                                            <option value="">
                                                Not Assigned
                                            </option>

                                            {departments.map(
                                                (
                                                    department
                                                ) => (
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
                                    ) : (
                                        <strong>
                                            {
                                                departmentName
                                            }
                                        </strong>
                                    )}
                                </div>
                            </div>

                            <div className="profile-detail">
                                <div className="profile-detail-icon">
                                    <UsersRound
                                        size={17}
                                    />
                                </div>

                                <div>
                                    <span>
                                        Manager
                                    </span>

                                    <strong>
                                        {manager}
                                    </strong>
                                </div>
                            </div>

                            <div className="profile-detail">
                                <div className="profile-detail-icon">
                                    <WalletCards
                                        size={17}
                                    />
                                </div>

                                <div>
                                    <span>
                                        Salary
                                    </span>

                                    {isEditing &&
                                    employee ? (
                                        <input
                                            type="number"
                                            min="0"
                                            className="profile-inline-input"
                                            value={
                                                formData.salary
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                handleInputChange(
                                                    "salary",
                                                    event
                                                        .target
                                                        .value
                                                )
                                            }
                                        />
                                    ) : (
                                        <strong>
                                            $
                                            {salary.toLocaleString()}
                                        </strong>
                                    )}
                                </div>
                            </div>

                            <div className="profile-detail">
                                <div className="profile-detail-icon">
                                    <CalendarDays
                                        size={17}
                                    />
                                </div>

                                <div>
                                    <span>
                                        Hire Date
                                    </span>

                                    {isEditing &&
                                    employee ? (
                                        <input
                                            type="date"
                                            className="profile-inline-input"
                                            value={
                                                formData.hireDate
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                handleInputChange(
                                                    "hireDate",
                                                    event
                                                        .target
                                                        .value
                                                )
                                            }
                                        />
                                    ) : (
                                        <strong>
                                            {hireDate}
                                        </strong>
                                    )}
                                </div>
                            </div>

                            <div className="profile-detail">
                                <div className="profile-detail-icon">
                                    {status ===
                                    "Active" ? (
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
                                        Status
                                    </span>

                                    {isEditing &&
                                    employee ? (
                                        <select
                                            className="profile-inline-input"
                                            value={
                                                formData.status
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                handleInputChange(
                                                    "status",
                                                    event
                                                        .target
                                                        .value
                                                )
                                            }
                                        >
                                            <option value="Active">
                                                Active
                                            </option>

                                            <option value="Inactive">
                                                Inactive
                                            </option>
                                        </select>
                                    ) : (
                                        <strong>
                                            {status}
                                        </strong>
                                    )}
                                </div>
                            </div>

                            {isEditing &&
                                employee && (
                                    <>
                                        <div className="profile-detail">
                                            <div className="profile-detail-icon">
                                                <UserRound
                                                    size={17}
                                                />
                                            </div>

                                            <div>
                                                <span>
                                                    First Name
                                                </span>

                                                <input
                                                    type="text"
                                                    className="profile-inline-input"
                                                    value={
                                                        formData.firstName
                                                    }
                                                    onChange={(
                                                        event
                                                    ) =>
                                                        handleInputChange(
                                                            "firstName",
                                                            event
                                                                .target
                                                                .value
                                                        )
                                                    }
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="profile-detail">
                                            <div className="profile-detail-icon">
                                                <UserRound
                                                    size={17}
                                                />
                                            </div>

                                            <div>
                                                <span>
                                                    Last Name
                                                </span>

                                                <input
                                                    type="text"
                                                    className="profile-inline-input"
                                                    value={
                                                        formData.lastName
                                                    }
                                                    onChange={(
                                                        event
                                                    ) =>
                                                        handleInputChange(
                                                            "lastName",
                                                            event
                                                                .target
                                                                .value
                                                        )
                                                    }
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}
                        </form>
                    )}

                    {profileError && (
                        <p
                            className="profile-error-message"
                            style={{
                                marginTop: "16px",
                            }}
                        >
                            Profile data could not be loaded.
                            Check the browser console for
                            <strong>
                                {" "}
                                PROFILE LOAD ERROR
                            </strong>
                            .
                        </p>
                    )}
                </section>
            </section>
        </main>
    )
}