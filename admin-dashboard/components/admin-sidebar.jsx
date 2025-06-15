"use client"

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
  SidebarRail,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  LayoutDashboard,
  GraduationCap,
  Users,
  BookOpen,
  PlayCircle,
  MessageSquare,
  Star,
  Settings,
  BarChart3,
  Shield,
  DollarSign,
  Award,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Quản lý Sinh viên",
    url: "/students",
    icon: GraduationCap,
  },
  {
    title: "Quản lý Giảng viên",
    url: "/instructors",
    icon: Users,
  },
  {
    title: "Quản lý Khóa học",
    url: "/courses",
    icon: BookOpen,
  },
  {
    title: "Quản lý Bài giảng",
    url: "/lessons",
    icon: PlayCircle,
  },
  {
    title: "Quản lý Comments",
    url: "/comments",
    icon: MessageSquare,
  },
  {
    title: "Quản lý Reviews",
    url: "/reviews",
    icon: Star,
  },
  {
    title: "Doanh thu",
    url: "/revenue",
    icon: DollarSign,
  },
]

const settingsItems = [
  {
    title: "Thống kê",
    url: "/analytics",
    icon: BarChart3,
  },
  {
    title: "Chứng chỉ",
    url: "/certificates",
    icon: Award,
  },
  {
    title: "Cài đặt",
    url: "/settings",
    icon: Settings,
  },
  {
    title: "Bảo mật",
    url: "/security",
    icon: Shield,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar className="border-r border-gray-200/50 bg-white/95 backdrop-blur-sm shadow-xl">
      <SidebarHeader className="p-6 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-lg text-white">EduAdmin</h2>
            <p className="text-xs text-indigo-100">Quản lý khóa học</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-600 font-semibold text-sm uppercase tracking-wide mb-3">
            Quản lý chính
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    className="rounded-xl transition-all duration-200 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:shadow-md data-[active=true]:bg-gradient-to-r data-[active=true]:from-indigo-500 data-[active=true]:to-purple-500 data-[active=true]:text-white data-[active=true]:shadow-lg"
                  >
                    <Link href={item.url} className="flex items-center gap-3 p-3">
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-8">
          <SidebarGroupLabel className="text-gray-600 font-semibold text-sm uppercase tracking-wide mb-3">
            Hệ thống
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {settingsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    className="rounded-xl transition-all duration-200 hover:bg-gradient-to-r hover:from-gray-50 hover:to-slate-50 hover:shadow-md data-[active=true]:bg-gradient-to-r data-[active=true]:from-gray-500 data-[active=true]:to-slate-500 data-[active=true]:text-white data-[active=true]:shadow-lg"
                  >
                    <Link href={item.url} className="flex items-center gap-3 p-3">
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 bg-gradient-to-r from-gray-50 to-slate-50 border-t border-gray-200/50">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
          <Avatar className="w-10 h-10 ring-2 ring-indigo-100">
            <AvatarImage src="/placeholder-user.jpg" />
            <AvatarFallback className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold">
              AD
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">Admin User</p>
            <p className="text-xs text-gray-500 truncate">admin@eduplatform.com</p>
          </div>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
