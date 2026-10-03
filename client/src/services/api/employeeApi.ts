import { apiRequest } from "./api"

type EmployeePayload = {
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

// Get all employees
export function getEmployees() {
    return apiRequest("/employees")
}

// Get one employee by ID
export function getEmployee(id: string) {
    return apiRequest(`/employees/${id}`)
}

// Create a new employee
export function createEmployee(
    employee: EmployeePayload
) {
    return apiRequest("/employees", {
        method: "POST",
        body: JSON.stringify(employee),
    })
}

// Update an existing employee
export function updateEmployee(
    id: string,
    employee: EmployeePayload
) {
    return apiRequest(`/employees/${id}`, {
        method: "PUT",
        body: JSON.stringify(employee),
    })
}

// Delete an employee
export function deleteEmployee(id: string) {
    return apiRequest(`/employees/${id}`, {
        method: "DELETE",
    })
}