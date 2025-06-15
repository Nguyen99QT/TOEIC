"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, MoreHorizontal, UserPlus, Filter, Eye, Ban, Trash2 } from "lucide-react"

const users = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    email: "nguyenvana@example.com",
    avatar: "/placeholder-user.jpg",
    status: "active",
    role: "user",
    posts: 12,
    comments: 45,
    joinDate: "2024-01-15",
    lastActive: "2024-03-15",
  },
  {
    id: 2,
    name: "Trần Thị B",
    email: "tranthib@example.com",
    avatar: "/placeholder-user.jpg",
    status: "inactive",
    role: "user",
    posts: 8,
    comments: 23,
    joinDate: "2024-02-10",
    lastActive: "2024-03-10",
  },
  {
    id: 3,
    name: "Lê Văn C",
    email: "levanc@example.com",
    avatar: "/placeholder-user.jpg",
    status: "banned",
    role: "user",
    posts: 3,
    comments: 67,
    joinDate: "2024-01-20",
    lastActive: "2024-03-05",
  },
  {
    id: 4,
    name: "Phạm Thị D",
    email: "phamthid@example.com",
    avatar: "/placeholder-user.jpg",
    status: "active",
    role: "moderator",
    posts: 25,
    comments: 89,
    joinDate: "2023-12-01",
    lastActive: "2024-03-16",
  },
]

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUser, setSelectedUser] = useState(null)

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Hoạt động</Badge>
      case "inactive":
        return <Badge variant="secondary">Không hoạt động</Badge>
      case "banned":
        return <Badge variant="destructive">Bị cấm</Badge>
      default:
        return <Badge variant="outline">Không xác định</Badge>
    }
  }

  const getRoleBadge = (role) => {
    switch (role) {
      case "admin":
        return <Badge className="bg-purple-100 text-purple-800">Admin</Badge>
      case "moderator":
        return <Badge className="bg-blue-100 text-blue-800">Moderator</Badge>
      case "user":
        return <Badge variant="outline">User</Badge>
      default:
        return <Badge variant="outline">Không xác định</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản lý Users</h1>
          <p className="text-muted-foreground">Quản lý tài khoản người dùng trong hệ thống</p>
        </div>
        <Button>
          <UserPlus className="w-4 h-4 mr-2" />
          Thêm User
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách Users</CardTitle>
          <CardDescription>Tổng cộng {users.length} users trong hệ thống</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Tìm kiếm users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Lọc
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Vai trò</TableHead>
                <TableHead>Bài viết</TableHead>
                <TableHead>Comments</TableHead>
                <TableHead>Ngày tham gia</TableHead>
                <TableHead>Hoạt động cuối</TableHead>
                <TableHead className="text-right">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={user.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(user.status)}</TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell>{user.posts}</TableCell>
                  <TableCell>{user.comments}</TableCell>
                  <TableCell>{user.joinDate}</TableCell>
                  <TableCell>{user.lastActive}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => setSelectedUser(user)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Xem chi tiết
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Ban className="mr-2 h-4 w-4" />
                          {user.status === "banned" ? "Bỏ cấm" : "Cấm user"}
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Xóa user
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

      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chi tiết User</DialogTitle>
            <DialogDescription>Thông tin chi tiết về user {selectedUser?.name}</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="grid gap-4 py-4">
              <div className="flex items-center space-x-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={selectedUser.avatar || "/placeholder.svg"} />
                  <AvatarFallback>{selectedUser.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">{selectedUser.name}</h3>
                  <p className="text-muted-foreground">{selectedUser.email}</p>
                  <div className="flex space-x-2 mt-2">
                    {getStatusBadge(selectedUser.status)}
                    {getRoleBadge(selectedUser.role)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Số bài viết</label>
                  <p className="text-2xl font-bold">{selectedUser.posts}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Số comments</label>
                  <p className="text-2xl font-bold">{selectedUser.comments}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Ngày tham gia</label>
                  <p>{selectedUser.joinDate}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Hoạt động cuối</label>
                  <p>{selectedUser.lastActive}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedUser(null)}>
              Đóng
            </Button>
            <Button>Chỉnh sửa</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
