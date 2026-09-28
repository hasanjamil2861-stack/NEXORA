import { BrowserRouter, Route, Routes } from "react-router-dom"

import "@assets/styles/Attendance.css"
import "@assets/styles/Client.css"
import "@assets/styles/Contract.css"
import "@assets/styles/Dashboard.css"
import "@assets/styles/Documents.css"
import "@assets/styles/DepartmentCard.css"
import "@assets/styles/EmployeeCard.css"
import "@assets/styles/EmployeesDetails.css"
import "@assets/styles/Footer.css"
import "@assets/styles/Invoice.css"
import "@assets/styles/LeaveRequest.css"
import "@assets/styles/Login.css"
import "@assets/styles/MainLayout.css"
import "@assets/styles/Modal.css"
import "@assets/styles/Navbar.css"
import "@assets/styles/Project.css"
import "@assets/styles/Report.css"
import "@assets/styles/Sidebar.css"
import "@assets/styles/TaskCard.css"
import "@assets/styles/Toast.css"
import "@assets/styles/Trash.css"
import "@assets/styles/TrashCard.css"

import { TrashProvider } from "./context/TrashContext"
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute"
import MainLayout from "./layouts/MainLayout/MainLayout"
import Attendance from "./pages/Attendance/Attendance"
import Clients from "./pages/Clients/Clients"
import Contracts from "./pages/Contracts/Contracts"
import Dashboard from "./pages/Dashboard"
import Departments from "./pages/Departments/Departments"
import Documents from "./pages/Documents/Documents"
import EmployeeDetails from "./pages/Employees/EmployeeDetails"
import Employees from "./pages/Employees/Employees"
import Invoices from "./pages/Invoices/Invoices"
import LeaveRequests from "./pages/LeaveRequests/LeaveRequests"
import Login from "./pages/Login/Login"
import Projects from "./pages/Projects/Projects"
import Reports from "./pages/Reports/Reports"
import Tasks from "./pages/Tasks/Tasks"
import Trash from "./pages/Trash/Trash"

export default function App() {
  return (
    <BrowserRouter>
      <TrashProvider>
        <Routes>
          <Route
            path="/login"
            element={<Login />}
          />

          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route
                path="/"
                element={<Dashboard />}
              />

              <Route
                path="/employees"
                element={<Employees />}
              />

              <Route
                path="/employees/:id"
                element={<EmployeeDetails />}
              />

              <Route
                path="/departments"
                element={<Departments />}
              />

              <Route
                path="/projects"
                element={<Projects />}
              />

              <Route
                path="/tasks"
                element={<Tasks />}
              />

              <Route
                path="/clients"
                element={<Clients />}
              />

              <Route
                path="/leave-requests"
                element={<LeaveRequests />}
              />

              <Route
                path="/attendance"
                element={<Attendance />}
              />

              <Route
                path="/contracts"
                element={<Contracts />}
              />

              <Route
                path="/invoices"
                element={<Invoices />}
              />

              <Route
                path="/documents"
                element={<Documents />}
              />

              <Route
                path="/reports"
                element={<Reports />}
              />

              <Route
                path="/trash"
                element={<Trash />}
              />
            </Route>
          </Route>
        </Routes>
      </TrashProvider>
    </BrowserRouter>
  )
}