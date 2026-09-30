import {
  Navigate,
  Outlet,
} from "react-router-dom"

import { useAuth } from "../../context/AuthContext"

type ProtectedRouteProps = {
  adminOnly?: boolean
}

export default function ProtectedRoute({
  adminOnly = false,
}: ProtectedRouteProps) {
  const {
    isAuthenticated,
    user,
  } = useAuth()

  // User must be logged in
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
      />
    )
  }

  // Admin-only route
  if (
    adminOnly &&
    user?.role !== "Admin"
  ) {
    return (
      <Navigate
        to="/tasks"
        replace
      />
    )
  }

  return <Outlet />
}