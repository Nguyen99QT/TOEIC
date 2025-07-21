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
  MessageCircle,
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
} from "./ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"

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
  {
    title: "Feedback",
    icon: MessageCircle,
    id: "feedback",
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
    <Sidebar className="border-r border-slate-200 bg-gradient-to-b from-slate-700 via-blue-800 to-indigo-800 dark:border-slate-800">
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/25">
            <GraduationCap className="h-7 w-7" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Toeic.com</h2>
            <p className="text-sm text-sky-200 font-medium">Admin Panel</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3">
        <SidebarGroup>
          <SidebarGroupLabel className="text-sky-200 font-semibold text-xs uppercase tracking-wider">Quản lý chính</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    isActive={currentPage === item.id}
                    onClick={() => setCurrentPage(item.id)}
                    className={`group relative overflow-hidden rounded-lg transition-all duration-200 ${
                      currentPage === item.id
                        ? "bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/25"
                        : "text-sky-100 hover:bg-white/15 hover:text-white"
                    }`}
                  >
                    <item.icon className={`h-4 w-4 transition-transform duration-200 ${
                      currentPage === item.id ? "scale-110" : "group-hover:scale-110"
                    }`} />
                    <span className="font-medium">{item.title}</span>
                    {currentPage === item.id && (
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" />
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-sky-200 font-semibold text-xs uppercase tracking-wider">Quản lý nội dung</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {contentItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    isActive={currentPage === item.id}
                    onClick={() => setCurrentPage(item.id)}
                    className={`group relative overflow-hidden rounded-lg transition-all duration-200 ${
                      currentPage === item.id
                        ? "bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/25"
                        : "text-sky-100 hover:bg-white/15 hover:text-white"
                    }`}
                  >
                    <item.icon className={`h-4 w-4 transition-transform duration-200 ${
                      currentPage === item.id ? "scale-110" : "group-hover:scale-110"
                    }`} />
                    <span className="font-medium">{item.title}</span>
                    {currentPage === item.id && (
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" />
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-sky-200 font-semibold text-xs uppercase tracking-wider">Hệ thống</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={currentPage === "settings"}
                  onClick={() => setCurrentPage("settings")}
                  className={`group relative overflow-hidden rounded-lg transition-all duration-200 ${
                    currentPage === "settings"
                      ? "bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/25"
                      : "text-sky-100 hover:bg-white/15 hover:text-white"
                  }`}
                >
                  <Settings className={`h-4 w-4 transition-transform duration-200 ${
                    currentPage === "settings" ? "scale-110" : "group-hover:scale-110"
                  }`} />
                  <span className="font-medium">Cài đặt</span>
                  {currentPage === "settings" && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" />
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="flex items-center gap-3 rounded-xl bg-gradient-to-r from-white/15 to-sky-500/20 p-4 border border-sky-300/30 backdrop-blur-sm">
          <Avatar className="h-10 w-10 border-2 border-sky-300 shadow-lg">
            <AvatarImage src="/placeholder-user.jpg" />
            <AvatarFallback className="bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-500 text-white font-bold">AD</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">Admin User</p>
            <p className="text-xs text-sky-200 truncate">admin@toeic.com</p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
