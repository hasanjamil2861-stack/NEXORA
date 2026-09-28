import { Outlet } from "react-router-dom"

import Sidebar from "../../components/Sidebar/Sidebar"
import Footer from "../../components/Footer/Footer"

export default function MainLayout() {
  return (
    <div className="layout">
      {/* Main sidebar navigation */}
      <Sidebar />

      <div className="main-content-wrapper">
        {/* Current page content */}
        <main className="main-content">
          <Outlet />
        </main>

        {/* Shared footer */}
        <Footer />
      </div>
    </div>
  )
}