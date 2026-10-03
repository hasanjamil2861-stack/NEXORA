import { apiRequest } from "./api"

type ProfilePayload = {
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

export function getProfile(id: string) {
    return apiRequest(`/profile/${id}`)
}

export function updateProfile(
    id: string,
    profile: ProfilePayload
) {
    return apiRequest(`/profile/${id}`, {
        method: "PUT",
        body: JSON.stringify(profile),
    })
}