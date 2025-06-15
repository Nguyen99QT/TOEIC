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
import { Progress } from "@/components/ui/progress"
import {
  Search,
  MoreHorizontal,
  UserPlus,
  Filter,
  Eye,
  Ban,
  Trash2,
  GraduationCap,
  BookOpen,
  Clock,
  Award,
} from "lucide-react"

const students = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    email: "nguyenvana@example.com",
    avatar: "/placeholder-user.jpg",
    status: "active",
    enrolledCourses: 5,
    completedCourses: 3,
    totalProgress: 75,
    joinDate: "2024-01-15",
    lastActive: "2024-03-15",
    totalSpent: "$299",
    certificates: 2,
  },
  {
    id: 2,
    name: "Trần Thị B",
    email: "tranthib@example.com",
    avatar: "/placeholder-user.jpg",
    status: "inactive",
    enrolledCourses: 3,
    completedCourses: 1,
    totalProgress: 45,
    joinDate: "2024-02-10",
    lastActive: "2024-03-10",
    totalSpent: "$149",
    certificates: 1,
  },
  {
    id: 3,
    name: "Lê Văn C",
    email: "levanc@example.com",
    avatar: "/placeholder-user.jpg",
    status: "suspended",
    enrolledCourses: 8,
    completedCourses: 6,
    totalProgress: 88,
    joinDate: "2024-01-20",
    lastActive: "2024-03-05",
    totalSpent: "$599",
    certificates: 4,
  },
  {
    id: 4,
    name: "Phạm Thị D",
    email: "phamthid@example.com",
    avatar: "/placeholder-user.jpg",
    status: "active",
    enrolledCourses: 12,
    completedCourses: 8,
    totalProgress: 92,
    joinDate: "2023-12-01",
    lastActive: "2024-03-16",
    totalSpent: "$899",
    certificates: 6,
  },
]

export default function StudentsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStudent, setSelectedStudent] = useState(null)

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 border-0">Hoạt động</Badge>
      case "inactive":
        return <Badge variant="secondary">Không hoạt động</Badge>
      case "suspended":
        return <Badge variant="destructive">Bị đình chỉ</Badge>
      default:
        return <Badge variant="outline">Không xác định</Badge>
    }
  }

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold tracking-tight mb-2">Quản lý Sinh viên</h1>
            <p className="text-blue-100 text-lg">Quản lý thông tin và tiến độ học tập của sinh viên</p>
          </div>
          <Button className="bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm">
            <UserPlus className="w-4 h-4 mr-2" />
            Thêm Sinh viên
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        {[
          {
            title: "Tổng Sinh viên",
            value: students.length,
            gradient: "from-blue-500 to-cyan-500",
            bgGradient: "from-blue-50 to-cyan-50",
            icon: GraduationCap,
          },
          {
            title: "Đang hoạt động",
            value: students.filter((s) => s.status === "active").length,
            gradient: "from-green-500 to-emerald-500",
            bgGradient: "from-green-50 to-emerald-50",
            icon: GraduationCap,
          },
          {
            title: "Tổng khóa học đăng ký",
            value: students.reduce((sum, s) => sum + s.enrolledCourses, 0),
            gradient: "from-purple-500 to-pink-500",
            bgGradient: "from-purple-50 to-pink-50",
            icon: BookOpen,
          },
          {
            title: "Chứng chỉ đã cấp",
            value: students.reduce((sum, s) => sum + s.certificates, 0),
            gradient: "from-orange-500 to-red-500",
            bgGradient: "from-orange-50 to-red-50",
            icon: Award,
          },
        ].map((stat, index) => (
          <Card
            key={index}
            className={`bg-gradient-to-br ${stat.bgGradient} border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-gray-700">{stat.title}</CardTitle>
              <div className={`p-2 rounded-xl bg-gradient-to-r ${stat.gradient} shadow-lg`}>
                <stat.icon className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-t-xl">
          <CardTitle className="text-xl font-bold text-gray-900">Danh sách Sinh viên</CardTitle>
          <CardDescription className="text-gray-600">
            Tổng cộng {students.length} sinh viên trong hệ thống
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Tìm kiếm sinh viên..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 bg-gray-50/50 border-gray-200 focus:bg-white focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all duration-200 rounded-xl h-12"
              />
            </div>
            <Button variant="outline" className="rounded-xl border-gray-200 hover:bg-gray-50 h-12 px-6">
              <Filter className="w-4 h-4 mr-2" />
              Lọc
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sinh viên</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Khóa học</TableHead>
                <TableHead>Tiến độ</TableHead>
                <TableHead>Chi tiêu</TableHead>
                <TableHead>Chứng chỉ</TableHead>
                <TableHead>Hoạt động cuối</TableHead>
                <TableHead className="text-right">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student.id} className="hover:bg-gray-50/50">
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-10 h-10 ring-2 ring-gray-200">
                        <AvatarImage src={student.avatar || "/placeholder.svg"} />
                        <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold">
                          {student.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold text-gray-900">{student.name}</div>
                        <div className="text-sm text-gray-500">{student.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(student.status)}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="text-sm font-medium">{student.enrolledCourses} đăng ký</div>
                      <div className="text-xs text-gray-500">{student.completedCourses} hoàn thành</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Tổng tiến độ</span>
                        <span className="font-medium">{student.totalProgress}%</span>
                      </div>
                      <Progress value={student.totalProgress} className="h-2" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold text-green-600">{student.totalSpent}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Award className="w-4 h-4 text-yellow-500" />
                      <span className="font-medium">{student.certificates}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span>{student.lastActive}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-gray-100 rounded-lg">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="bg-white/95 backdrop-blur-sm border-gray-200/50 shadow-xl rounded-xl"
                      >
                        <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => setSelectedStudent(student)}
                          className="hover:bg-blue-50 rounded-lg m-1"
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Xem chi tiết
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="hover:bg-yellow-50 rounded-lg m-1">
                          <Ban className="mr-2 h-4 w-4" />
                          {student.status === "suspended" ? "Bỏ đình chỉ" : "Đình chỉ"}
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600 hover:bg-red-50 rounded-lg m-1">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Xóa sinh viên
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

      <Dialog open={!!selectedStudent} onOpenChange={() => setSelectedStudent(null)}>
        <DialogContent className="max-w-3xl bg-white/95 backdrop-blur-sm border-0 shadow-2xl rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900">Chi tiết Sinh viên</DialogTitle>
            <DialogDescription className="text-gray-600">
              Thông tin chi tiết về sinh viên {selectedStudent?.name}
            </DialogDescription>
          </DialogHeader>
          {selectedStudent && (
            <div className="grid gap-6 py-4">
              <div className="flex items-center space-x-6 p-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl">
                <Avatar className="w-20 h-20 ring-4 ring-white shadow-lg">
                  <AvatarImage src={selectedStudent.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold text-2xl">
                    {selectedStudent.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900">{selectedStudent.name}</h3>
                  <p className="text-gray-600 mb-2">{selectedStudent.email}</p>
                  <div className="flex space-x-3">
                    {getStatusBadge(selectedStudent.status)}
                    <Badge className="bg-blue-100 text-blue-800 border-0">Tham gia: {selectedStudent.joinDate}</Badge>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-0">
                  <CardContent className="p-4 text-center">
                    <BookOpen className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">{selectedStudent.enrolledCourses}</div>
                    <div className="text-sm text-gray-600">Khóa học đăng ký</div>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-0">
                  <CardContent className="p-4 text-center">
                    <GraduationCap className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">{selectedStudent.completedCourses}</div>
                    <div className="text-sm text-gray-600">Đã hoàn thành</div>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-0">
                  <CardContent className="p-4 text-center">
                    <Award className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">{selectedStudent.certificates}</div>
                    <div className="text-sm text-gray-600">Chứng chỉ</div>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-0">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-gray-900">{selectedStudent.totalSpent}</div>
                    <div className="text-sm text-gray-600">Tổng chi tiêu</div>
                  </CardContent>
                </Card>
              </div>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg font-bold">Tiến độ học tập tổng quan</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tiến độ tổng thể</span>
                      <span className="font-semibold">{selectedStudent.totalProgress}%</span>
                    </div>
                    <Progress value={selectedStudent.totalProgress} className="h-3" />
                    <div className="text-xs text-gray-500">Hoạt động cuối: {selectedStudent.lastActive}</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          <DialogFooter className="space-x-3">
            <Button variant="outline" onClick={() => setSelectedStudent(null)} className="rounded-xl">
              Đóng
            </Button>
            <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white border-0 rounded-xl shadow-lg">
              Chỉnh sửa thông tin
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
