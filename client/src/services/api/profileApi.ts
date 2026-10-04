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