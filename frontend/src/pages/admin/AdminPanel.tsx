import React, { useState, useEffect } from "react"
import { SidebarProvider } from "./ui/sidebar"
import { AppSidebar } from "./app-sidebar"
import { Header } from "./header"
import { AdminDashboard } from "./AdminDashboard"
import { ThemeProvider } from "./theme-provider"
import { UsersPage } from './users-page'
import { ContentPage } from './content-page'
import { CommentsPage } from './comments-page'
import { SettingsPage } from './settings-page'
import { CoursesPage } from './courses-page'
import { AnalyticsPage } from './analytics-page'
import AdminFeedbackPage from './AdminFeedbackPage'
import { BlogManagementPage } from './blog-management-page'
import BlogEditPage from './blog-edit-page'
import { useLocation, useNavigate } from 'react-router-dom'

const AdminPanel: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState("dashboard")

  // Sync URL with current page
  useEffect(() => {
    const path = location.pathname
    if (path.includes('/admin/')) {
      const segments = path.split('/admin/')[1].split('/')
      const page = segments[0]
      if (page && page !== currentPage) {
        setCurrentPage(path) // Store full path for complex routes
      }
    }
  }, [location.pathname, currentPage])

  // Update URL when page changes
  const handlePageChange = (page: string) => {
    setCurrentPage(page)
    navigate(`/admin/${page}`)
  }

  const renderPage = () => {
    const path = location.pathname

    // Handle blog edit route
    if (path.includes('/admin/blog/edit/')) {
      return <BlogEditPage />
    }

    // Extract base page from path
    const page = path.includes('/admin/') ? path.split('/admin/')[1].split('/')[0] : currentPage

    switch (page) {
      case "dashboard":
        return <AdminDashboard />
      case "courses":
        return <CoursesPage />
      case "users":
        return <UsersPage />
      case "content":
        return <ContentPage />
      case "blog":
        return <BlogManagementPage />
      case "analytics":
        return <AnalyticsPage />
      case "settings":
        return <SettingsPage />
      case "comments":
        return <CommentsPage />
      case "feedback":
        return <AdminFeedbackPage />
      default:
        return <AdminDashboard />
    }
  }

  return (
    <ThemeProvider defaultTheme="light" storageKey="study4-theme">
      <SidebarProvider>
        <div className="flex min-h-screen w-full bg-gradient-to-br from-admin-50 to-admin-100">
          <AppSidebar currentPage={currentPage} setCurrentPage={handlePageChange} />
          <div className="flex flex-1 flex-col">
            <Header />
            <main className="flex-1 p-6">
              {renderPage()}
            </main>
          </div>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  )
}

export default AdminPanel 