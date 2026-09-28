import { NavLink } from "react-router-dom"

export default function Navbar() {
  return (
    <nav className="navbar">
      <h2>NEXORA</h2>

      {/* Main navigation links */}
      <div className="navbar-links">
        <NavLink to="/">Dashboard</NavLink>
        <NavLink to="/employees">Employees</NavLink>
        <NavLink to="/departments">Departments</NavLink>
        <NavLink to="/projects">Projects</NavLink>
        <NavLink to="/tasks">Tasks</NavLink>
      </div>
    </nav>
  )
}