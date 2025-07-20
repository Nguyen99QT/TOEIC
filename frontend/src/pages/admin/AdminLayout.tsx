import React, { useState } from 'react';
import { SidebarProvider } from "./ui/sidebar";
import { AppSidebar } from "./app-sidebar";
import { Header } from "./header";
import { ThemeProvider } from "./theme-provider";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState("dashboard");

  return (
    <ThemeProvider defaultTheme="light" storageKey="study4-theme">
      <SidebarProvider>
        <div className="flex min-h-screen w-full bg-muted/40">
          <AppSidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
          <div className="flex flex-1 flex-col">
            <Header />
            <main className="flex-1 p-6">
              {children}
            </main>
          </div>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  );
};

export default AdminLayout; 