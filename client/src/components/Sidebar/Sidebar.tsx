// Sidebar.tsx

import { useState } from "react"

import {
  NavLink,
  useNavigate,
} from "react-router-dom"

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
  LogOut,
  Trash2,
  Menu,
  X,
} from "lucide-react"

export default function Sidebar() {
  const navigate = useNavigate()

  const {
    logout,
    user,
  } = useAuth()

  const [
    isMobileMenuOpen,
    setIsMobileMenuOpen,
  ] = useState(false)

  const isAdmin =
    user?.role === "Admin"

  const handleLogout = () => {
    setIsMobileMenuOpen(false)

    logout()

    navigate("/login")
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <>
      <button
        type="button"
        className="sidebar-mobile-trigger"
        onClick={() =>
          setIsMobileMenuOpen(
            (current) => !current
          )
        }
        aria-label={
          isMobileMenuOpen
            ? "Close navigation menu"
            : "Open navigation menu"
        }
        aria-expanded={
          isMobileMenuOpen
        }
      >
        {isMobileMenuOpen ? (
          <X size={22} />
        ) : (
          <Menu size={22} />
        )}
      </button>

      {isMobileMenuOpen && (
        <button
          type="button"
          className="sidebar-mobile-overlay"
          onClick={closeMobileMenu}
          aria-label="Close navigation menu"
        />
      )}

      <aside
        className={`sidebar ${
          isMobileMenuOpen
            ? "sidebar-mobile-open"
            : ""
        }`}
      >
        <div className="sidebar-brand">
          <div className="sidebar-brand-logo">
            <img
              src="/images/Logo.jpg"
              alt="NEXORA Logo"
            />
          </div>

          <div className="sidebar-brand-text">
            <h2>NEXORA</h2>

            <span>
              Business Management
            </span>
          </div>
        </div>

        <nav className="sidebar-navigation">
          {isAdmin && (
            <>
              <NavLink
                to="/"
                title="Dashboard"
                onClick={closeMobileMenu}
              >
                <LayoutDashboard className="sidebar-icon" />
                <span>Dashboard</span>
              </NavLink>

              <NavLink
                to="/employees"
                title="Employees"
                onClick={closeMobileMenu}
              >
                <Users className="sidebar-icon" />
                <span>Employees</span>
              </NavLink>

              <NavLink
                to="/departments"
                title="Departments"
                onClick={closeMobileMenu}
              >
                <Building2 className="sidebar-icon" />
                <span>Departments</span>
              </NavLink>
            </>
          )}

          <NavLink
            to="/projects"
            title="Projects"
            onClick={closeMobileMenu}
          >
            <FolderKanban className="sidebar-icon" />
            <span>Projects</span>
          </NavLink>

          <NavLink
            to="/tasks"
            title="Tasks"
            onClick={closeMobileMenu}
          >
            <ClipboardList className="sidebar-icon" />
            <span>Tasks</span>
          </NavLink>

          {isAdmin && (
            <NavLink
              to="/clients"
              title="Clients"
              onClick={closeMobileMenu}
            >
              <UsersRound className="sidebar-icon" />
              <span>Clients</span>
            </NavLink>
          )}

          <NavLink
            to="/leave-requests"
            title="Leave Requests"
            onClick={closeMobileMenu}
          >
            <CalendarDays className="sidebar-icon" />
            <span>
              Leave Requests
            </span>
          </NavLink>

          {isAdmin && (
            <>
              <NavLink
                to="/attendance"
                title="Attendance"
                onClick={closeMobileMenu}
              >
                <CalendarCheck className="sidebar-icon" />
                <span>Attendance</span>
              </NavLink>

              <NavLink
                to="/contracts"
                title="Contracts"
                onClick={closeMobileMenu}
              >
                <FileSignature className="sidebar-icon" />
                <span>Contracts</span>
              </NavLink>
            </>
          )}

          {isAdmin && (
            <NavLink
              to="/invoices"
              title="Invoices"
              onClick={closeMobileMenu}
            >
              <Receipt className="sidebar-icon" />
              <span>Invoices</span>
            </NavLink>
          )}

          <NavLink
            to="/documents"
            title="Documents"
            onClick={closeMobileMenu}
          >
            <FileText className="sidebar-icon" />
            <span>Documents</span>
          </NavLink>

          {isAdmin && (
            <>
              <NavLink
                to="/reports"
                title="Reports"
                onClick={closeMobileMenu}
              >
                <BarChart3 className="sidebar-icon" />
                <span>Reports</span>
              </NavLink>

              <NavLink
                to="/trash"
                title="Trash"
                onClick={closeMobileMenu}
              >
                <Trash2 className="sidebar-icon" />
                <span>Trash</span>
              </NavLink>
            </>
          )}
        </nav>

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
    </>
  )
}