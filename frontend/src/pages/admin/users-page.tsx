"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Plus, Search, Filter, MoreHorizontal, Eye, Edit, Ban, UserCheck, Mail, Calendar } from "lucide-react"

const users = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    email: "nguyenvana@email.com",
    role: "student",
    status: "active",
    courses: 5,
    joinDate: "2024-01-15",
    lastActive: "2024-01-20",
    avatar: "/placeholder-user.jpg",
  },
  {
    id: 2,
    name: "Trần Thị B",
    email: "tranthib@email.com",
    role: "instructor",
    status: "active",
    courses: 12,
    joinDate: "2023-12-10",
    lastActive: "2024-01-19",
    avatar: "/placeholder-user.jpg",
  },
  {
    id: 3,
    name: "Lê Văn C",
    email: "levanc@email.com",
    role: "student",
    status: "inactive",
    courses: 2,
    joinDate: "2024-01-08",
    lastActive: "2024-01-12",
    avatar: "/placeholder-user.jpg",
  },
  {
    id: 4,
    name: "Phạm Thị D",
    email: "phamthid@email.com",
    role: "student",
    status: "pending",
    courses: 0,
    joinDate: "2024-01-18",
    lastActive: "2024-01-18",
    avatar: "/placeholder-user.jpg",
  },
]

export function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản lý người dùng</h1>
          <p className="text-muted-foreground">Quản lý học viên và giảng viên trên Toeic.com</p>
        </div>
        <Button className="bg-study-600 hover:bg-study-700">
          <Plus className="mr-2 h-4 w-4" />
          Thêm giảng viên
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-gradient-to-br from-study-500 to-study-600 text-white shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng người dùng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,543</div>
            <p className="text-xs text-white/80">
              <span className="text-white font-medium">+23</span> người dùng mới
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-success-500 to-success-600 text-white shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Học viên</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">11,234</div>
            <p className="text-xs text-white/80">89% tổng số người dùng</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-warning-500 to-warning-600 text-white shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Giảng viên</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-white/80">10% tổng số người dùng</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-info-500 to-info-600 text-white shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chờ duyệt</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">75</div>
            <p className="text-xs text-white/80">Cần xem xét</p>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card className="shadow-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Danh sách người dùng</CardTitle>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm người dùng..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-80 focus-visible:ring-study-500"
                />
              </div>
              <Button variant="outline" className="border-study-200 hover:bg-study-50 hover:text-study-600">
                <Filter className="mr-2 h-4 w-4" />
                Lọc
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Người dùng</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Vai trò</TableHead>
                <TableHead>Khóa học</TableHead>
                <TableHead>Ngày tham gia</TableHead>
                <TableHead>Hoạt động cuối</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id} className="hover:bg-muted/30">
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="border border-muted">
                        <AvatarImage src={user.avatar || "/placeholder.svg"} />
                        <AvatarFallback className="bg-study-100 text-study-700">{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-study-700">{user.name}</div>
                        <div className="text-sm text-muted-foreground">ID: {user.id}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{user.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={user.role === "instructor" ? "default" : "secondary"}
                      className={
                        user.role === "instructor"
                          ? "bg-study-500 hover:bg-study-600"
                          : "bg-success-100 text-success-700 hover:bg-success-200"
                      }
                    >
                      {user.role === "instructor" ? "Giảng viên" : "Học viên"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{user.courses}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{user.joinDate}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">{user.lastActive}</span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        user.status === "active" ? "default" : user.status === "inactive" ? "secondary" : "outline"
                      }
                      className={
                        user.status === "active"
                          ? "bg-success-500 hover:bg-success-600"
                          : user.status === "inactive"
                            ? "bg-warning-500 hover:bg-warning-600 text-white"
                            : "border-info-500 text-info-500"
                      }
                    >
                      {user.status === "active"
                        ? "Hoạt động"
                        : user.status === "inactive"
                          ? "Không hoạt động"
                          : "Chờ duyệt"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-study-50">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                        <DropdownMenuItem className="cursor-pointer">
                          <Eye className="mr-2 h-4 w-4 text-study-500" />
                          Xem hồ sơ
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">
                          <Edit className="mr-2 h-4 w-4 text-warning-500" />
                          Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {user.status === "pending" && (
                          <DropdownMenuItem className="cursor-pointer">
                            <UserCheck className="mr-2 h-4 w-4 text-success-500" />
                            Phê duyệt
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem className="text-danger-600 cursor-pointer focus:text-danger-600">
                          <Ban className="mr-2 h-4 w-4" />
                          Khóa tài khoản
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
