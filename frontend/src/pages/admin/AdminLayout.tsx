import React, { useState } from 'react';
import { SidebarProvider } from "./ui/sidebar";
import { AppSidebar } from "./app-sidebar";
import { Header } from "./header";
import { ThemeProvider } from "./theme-provider";
import "./admin-styles.css";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState("dashboard");

  return (
    <ThemeProvider defaultTheme="light" storageKey="study4-theme">
      <SidebarProvider>
        <div className="flex min-h-screen w-full bg-white dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
          <AppSidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
          <div className="flex flex-1 flex-col overflow-hidden">
            <Header />
            <main className="flex-1 overflow-auto p-6 lg:p-8 bg-white dark:bg-slate-900/50">
              <div className="mx-auto max-w-7xl">
                {children}
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  );
};

export default AdminLayout; 