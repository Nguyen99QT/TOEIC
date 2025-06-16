import { SidebarProvider } from "../components/ui/sidebar"
import { AdminSidebar } from "../components/admin-sidebar"
import { AdminHeader } from "../components/admin-header"
import "./globals.css"

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body>
        <SidebarProvider defaultOpen={true}>
          <div className="flex min-h-screen w-full bg-gradient-to-br from-slate-50 to-blue-50">
            <AdminSidebar />
            <div className="flex-1 flex flex-col">
              <AdminHeader />
              <main className="flex-1 p-6 bg-gradient-to-br from-gray-50/80 to-blue-50/80">{children}</main>
            </div>
          </div>
        </SidebarProvider>
      </body>
    </html>
  )
}

export const metadata = {
      generator: 'v0.dev'
    };
