// ProtectedRoute.tsx

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

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
      />
    )
  }

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