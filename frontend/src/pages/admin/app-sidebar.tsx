"use client"

import {
  BookOpen,
  Users,
  FileText,
  BarChart3,
  Settings,
  LayoutDashboard,
  GraduationCap,
  Video,
  MessageSquare,
  Bell,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    id: "dashboard",
  },
  {
    title: "Khóa học",
    icon: GraduationCap,
    id: "courses",
  },
  {
    title: "Người dùng",
    icon: Users,
    id: "users",
  },
  {
    title: "Nội dung",
    icon: FileText,
    id: "content",
  },
  {
    title: "Thống kê",
    icon: BarChart3,
    id: "analytics",
  },
]

const contentItems = [
  {
    title: "Bài giảng",
    icon: BookOpen,
    id: "lessons",
  },
  {
    title: "Video",
    icon: Video,
    id: "videos",
  },
  {
    title: "Bình luận",
    icon: MessageSquare,
    id: "comments",
  },
  {
    title: "Thông báo",
    icon: Bell,
    id: "notifications",
  },
]

interface AppSidebarProps {
  currentPage: string
  setCurrentPage: (page: string) => void
}

export function AppSidebar({ currentPage, setCurrentPage }: AppSidebarProps) {
  return (
    <Sidebar className="border-r bg-gradient-sidebar">
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-study-600 shadow-lg">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Toeic.com</h2>
            <p className="text-sm text-white/70">Admin Panel</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-white/80">Quản lý chính</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    isActive={currentPage === item.id}
                    onClick={() => setCurrentPage(item.id)}
                    className={
                      currentPage === item.id
                        ? "bg-white/20 text-white"
                        : "text-white/80 hover:bg-white/10 hover:text-white"
                    }
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-white/80">Quản lý nội dung</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {contentItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    isActive={currentPage === item.id}
                    onClick={() => setCurrentPage(item.id)}
                    className={
                      currentPage === item.id
                        ? "bg-white/20 text-white"
                        : "text-white/80 hover:bg-white/10 hover:text-white"
                    }
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-white/80">Hệ thống</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={currentPage === "settings"}
                  onClick={() => setCurrentPage("settings")}
                  className={
                    currentPage === "settings"
                      ? "bg-white/20 text-white"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  }
                >
                  <Settings className="h-4 w-4" />
                  <span>Cài đặt</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="flex items-center gap-3 rounded-lg bg-white/10 p-3">
          <Avatar className="h-8 w-8 border-2 border-white/20">
            <AvatarImage src="/placeholder-user.jpg" />
            <AvatarFallback className="bg-study-700 text-white">AD</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white">Admin User</p>
            <p className="text-xs text-white/70 truncate">admin@toeic.com</p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
