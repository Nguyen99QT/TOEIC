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
import { Search, Filter, MoreHorizontal, Eye, Edit, Trash2, Users, Star } from "lucide-react"

const courses = [
  {
    id: 1,
    title: "React Advanced Patterns",
    instructor: "Nguyễn Văn A",
    category: "Frontend",
    students: 234,
    rating: 4.8,
    price: "₫1,200,000",
    status: "active",
    createdAt: "2024-01-15",
    thumbnail: "/placeholder.svg?height=60&width=80",
  },
  {
    id: 2,
    title: "Node.js Backend Development",
    instructor: "Trần Thị B",
    category: "Backend",
    students: 189,
    rating: 4.6,
    price: "₫1,500,000",
    status: "draft",
    createdAt: "2024-01-10",
    thumbnail: "/placeholder.svg?height=60&width=80",
  },
  {
    id: 3,
    title: "UI/UX Design Fundamentals",
    instructor: "Lê Văn C",
    category: "Design",
    students: 456,
    rating: 4.9,
    price: "₫900,000",
    status: "active",
    createdAt: "2024-01-08",
    thumbnail: "/placeholder.svg?height=60&width=80",
  },
  {
    id: 4,
    title: "Python Data Science",
    instructor: "Phạm Thị D",
    category: "Data Science",
    students: 123,
    rating: 4.7,
    price: "₫1,800,000",
    status: "review",
    createdAt: "2024-01-05",
    thumbnail: "/placeholder.svg?height=60&width=80",
  },
]

export function CoursesPage() {
  const [searchTerm, setSearchTerm] = useState("")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản lý khóa học</h1>
          <p className="text-muted-foreground">Quản lý tất cả khóa học trên Toeic.com</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-gradient-to-br from-study-500 to-study-600 text-white shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng khóa học</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-white/80">
              <span className="text-white font-medium">+3</span> khóa học mới
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-success-500 to-success-600 text-white shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đang hoạt động</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">124</div>
            <p className="text-xs text-white/80">79% tổng số khóa học</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-warning-500 to-warning-600 text-white shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chờ duyệt</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
            <p className="text-xs text-white/80">Cần xem xét</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-info-500 to-info-600 text-white shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nháp</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">14</div>
            <p className="text-xs text-white/80">Chưa hoàn thành</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="shadow-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Danh sách khóa học</CardTitle>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm khóa học..."
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
                <TableHead>Khóa học</TableHead>
                <TableHead>Giảng viên</TableHead>
                <TableHead>Danh mục</TableHead>
                <TableHead>Học viên</TableHead>
                <TableHead>Đánh giá</TableHead>
                <TableHead>Giá</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.map((course) => (
                <TableRow key={course.id} className="hover:bg-muted/30">
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="h-12 w-16 rounded overflow-hidden border border-muted">
                        <img
                          src={course.thumbnail || "/placeholder.svg"}
                          alt={course.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-medium text-study-700">{course.title}</div>
                        <div className="text-sm text-muted-foreground">Tạo: {course.createdAt}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-8 w-8 border border-muted">
                        <AvatarImage src="/placeholder-user.jpg" />
                        <AvatarFallback className="bg-study-100 text-study-700">
                          {course.instructor.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{course.instructor}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-study-100 text-study-700 hover:bg-study-200">
                      {course.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4 text-study-500" />
                      <span>{course.students}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-warning-400 text-warning-400" />
                      <span>{course.rating}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-success-600">{course.price}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        course.status === "active" ? "default" : course.status === "draft" ? "secondary" : "outline"
                      }
                      className={
                        course.status === "active"
                          ? "bg-success-500 hover:bg-success-600"
                          : course.status === "draft"
                            ? "bg-warning-500 hover:bg-warning-600 text-white"
                            : "border-info-500 text-info-500"
                      }
                    >
                      {course.status === "active" ? "Hoạt động" : course.status === "draft" ? "Nháp" : "Đang duyệt"}
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
                          Xem chi tiết
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">
                          <Edit className="mr-2 h-4 w-4 text-warning-500" />
                          Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-danger-600 cursor-pointer focus:text-danger-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Xóa
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
