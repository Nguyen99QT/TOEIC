import { useState } from "react"
import { SidebarProvider } from "./ui/sidebar"
import { AppSidebar } from "./app-sidebar"
import { Header } from "./header"
import { AdminDashboard } from "./AdminDashboard"
import { CoursesPage } from "./courses-page"
import { UsersPage } from "./users-page"
import { ContentPage } from "./content-page"
import { AnalyticsPage } from "./analytics-page"
import { SettingsPage } from "./settings-page"
import { CommentsPage } from "./comments-page"
import { ThemeProvider } from "./theme-provider"

export default function Index() {
  const [currentPage, setCurrentPage] = useState("dashboard")

  const renderPage = () => {
    switch (currentPage) {
      case "admin/dashboard":
        return <AdminDashboard />
      case "courses":
        return <CoursesPage />
      case "users":
        return <UsersPage />
      case "content":
        return <ContentPage />
      case "analytics":
        return <AnalyticsPage />
      case "settings":
        return <SettingsPage />
      case "comments":
        return <CommentsPage />
      default:
        return <AdminDashboard />
    }
  }

  return (
    <ThemeProvider defaultTheme="light" storageKey="study4-theme">
      <SidebarProvider>
        <div className="flex min-h-screen w-full bg-muted/40">
          <AppSidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
          <div className="flex flex-1 flex-col">
            <Header />
            <main className="flex-1 p-6">{renderPage()}</main>
          </div>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  )
}
