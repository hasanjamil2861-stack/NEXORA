import { apiRequest } from "./api"

export type ProfilePayload = {
    firstName: string
    lastName: string
    email: string
    phone: string
    position: string
    departmentId: string
    salary: number
    hireDate: string
    status: "Active" | "Inactive"
    profileImage?: string
}

export type AccountCredentialsPayload = {
    currentPassword: string
    newEmail?: string
    newPassword?: string
}

export function getProfile() {
    return apiRequest("/profile")
}

export function updateProfile(
    profile: ProfilePayload
) {
    return apiRequest("/profile", {
        method: "PUT",
        body: JSON.stringify(profile),
    })
}

export function updateAccountCredentials(
    credentials: AccountCredentialsPayload
) {
    return apiRequest(
        "/profile/account",
        {
            method: "PUT",
            body: JSON.stringify(
                credentials
            ),
        }
    )
}