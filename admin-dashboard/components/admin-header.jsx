"use client"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, Search, LogOut, User, Settings } from "lucide-react"

export function AdminHeader() {
  return (
    <header className="flex h-16 items-center gap-4 border-b border-gray-200/50 bg-white/95 backdrop-blur-sm px-6 shadow-sm">
      <SidebarTrigger className="hover:bg-gray-100 rounded-lg transition-colors duration-200" />

      <div className="flex-1 flex items-center gap-4">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Tìm kiếm..."
            className="pl-10 bg-gray-50/50 border-gray-200 focus:bg-white focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all duration-200 rounded-xl"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative hover:bg-gray-100 rounded-xl transition-all duration-200"
            >
              <Bell className="w-5 h-5" />
              <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 text-xs bg-gradient-to-r from-red-500 to-pink-500 border-0 animate-pulse">
                3
              </Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-80 bg-white/95 backdrop-blur-sm border-gray-200/50 shadow-xl rounded-xl"
          >
            <DropdownMenuLabel className="text-gray-900 font-semibold">Thông báo</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="p-4 hover:bg-blue-50 rounded-lg m-1 transition-colors duration-200">
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium text-gray-900">User mới đăng ký</p>
                <p className="text-xs text-gray-500">john.doe@example.com vừa tạo tài khoản</p>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem className="p-4 hover:bg-yellow-50 rounded-lg m-1 transition-colors duration-200">
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium text-gray-900">Bài viết cần duyệt</p>
                <p className="text-xs text-gray-500">5 bài viết đang chờ phê duyệt</p>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem className="p-4 hover:bg-green-50 rounded-lg m-1 transition-colors duration-200">
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium text-gray-900">Feedback mới</p>
                <p className="text-xs text-gray-500">Có 2 feedback mới từ người dùng</p>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-10 w-10 rounded-full hover:ring-2 hover:ring-blue-200 transition-all duration-200"
            >
              <Avatar className="h-10 w-10 ring-2 ring-gray-200">
                <AvatarImage src="/placeholder-user.jpg" alt="Admin" />
                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold">
                  AD
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-56 bg-white/95 backdrop-blur-sm border-gray-200/50 shadow-xl rounded-xl"
            align="end"
            forceMount
          >
            <DropdownMenuLabel className="font-normal p-4">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-semibold leading-none text-gray-900">Admin User</p>
                <p className="text-xs leading-none text-gray-500">admin@example.com</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="hover:bg-blue-50 rounded-lg m-1 transition-colors duration-200">
              <User className="mr-2 h-4 w-4" />
              <span>Hồ sơ</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-gray-50 rounded-lg m-1 transition-colors duration-200">
              <Settings className="mr-2 h-4 w-4" />
              <span>Cài đặt</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="hover:bg-red-50 text-red-600 rounded-lg m-1 transition-colors duration-200">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Đăng xuất</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
