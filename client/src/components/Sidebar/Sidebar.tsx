import { NavLink, useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"

import {
  LayoutDashboard,
  Users,
  Building2,
  FolderKanban,
  ClipboardList,
  UsersRound,
  CalendarDays,
  CalendarCheck,
  FileSignature,
  Receipt,
  FileText,
  BarChart3,
  LogIn,
  LogOut,
  Trash2,
} from "lucide-react"

export default function Sidebar() {
  const navigate = useNavigate()
  const { logout } = useAuth()

  // Handle user logout
  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <aside className="sidebar">
      {/* NEXORA brand */}
      <div className="sidebar-brand">
        <div className="sidebar-brand-logo">
          <img
            src="/images/Logo.jpg"
            alt="NEXORA Logo"
          />
        </div>

        <div className="sidebar-brand-text">
          <h2>NEXORA</h2>
          <span>Business Management</span>
        </div>
      </div>

      {/* Main navigation */}
      <nav className="sidebar-navigation">
        <NavLink to="/" title="Dashboard">
          <LayoutDashboard className="sidebar-icon" />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/employees" title="Employees">
          <Users className="sidebar-icon" />
          <span>Employees</span>
        </NavLink>

        <NavLink to="/departments" title="Departments">
          <Building2 className="sidebar-icon" />
          <span>Departments</span>
        </NavLink>

        <NavLink to="/projects" title="Projects">
          <FolderKanban className="sidebar-icon" />
          <span>Projects</span>
        </NavLink>

        <NavLink to="/tasks" title="Tasks">
          <ClipboardList className="sidebar-icon" />
          <span>Tasks</span>
        </NavLink>

        <NavLink to="/clients" title="Clients">
          <UsersRound className="sidebar-icon" />
          <span>Clients</span>
        </NavLink>

        <NavLink
          to="/leave-requests"
          title="Leave Requests"
        >
          <CalendarDays className="sidebar-icon" />
          <span>Leave Requests</span>
        </NavLink>

        <NavLink to="/attendance" title="Attendance">
          <CalendarCheck className="sidebar-icon" />
          <span>Attendance</span>
        </NavLink>

        <NavLink to="/contracts" title="Contracts">
          <FileSignature className="sidebar-icon" />
          <span>Contracts</span>
        </NavLink>

        <NavLink to="/invoices" title="Invoices">
          <Receipt className="sidebar-icon" />
          <span>Invoices</span>
        </NavLink>

        <NavLink to="/documents" title="Documents">
          <FileText className="sidebar-icon" />
          <span>Documents</span>
        </NavLink>

        <NavLink to="/reports" title="Reports">
          <BarChart3 className="sidebar-icon" />
          <span>Reports</span>
        </NavLink>

        <NavLink to="/trash" title="Trash">
          <Trash2 className="sidebar-icon" />
          <span>Trash</span>
        </NavLink>

        <NavLink to="/login" title="Login">
          <LogIn className="sidebar-icon" />
          <span>Login</span>
        </NavLink>
      </nav>

      {/* Logout action */}
      <button
        type="button"
        className="sidebar-logout"
        onClick={handleLogout}
        title="Logout"
      >
        <LogOut className="sidebar-icon" />
        <span>Logout</span>
      </button>
    </aside>
  )
}