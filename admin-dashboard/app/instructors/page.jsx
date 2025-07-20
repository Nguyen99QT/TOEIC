"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Badge } from "../../components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"
import {
  Search,
  MoreHorizontal,
  UserPlus,
  Filter,
  Eye,
  Ban,
  Trash2,
  Users,
  BookOpen,
  Star,
  DollarSign,
  Award,
} from "lucide-react"

const instructors = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    email: "nguyenvana@instructor.com",
    avatar: "/placeholder-user.jpg",
    status: "active",
    specialization: "Web Development",
    courses: 8,
    students: 12847,
    rating: 4.8,
    reviews: 1234,
    totalEarnings: "$45,230",
    joinDate: "2023-01-15",
    lastActive: "2024-03-15",
    bio: "Chuyên gia phát triển web với 10+ năm kinh nghiệm",
    verified: true,
  },
  {
    id: 2,
    name: "Trần Thị B",
    email: "tranthib@instructor.com",
    avatar: "/placeholder-user.jpg",
    status: "active",
    specialization: "UI/UX Design",
    courses: 5,
    students: 8923,
    rating: 4.9,
    reviews: 567,
    totalEarnings: "$32,150",
    joinDate: "2023-03-10",
    lastActive: "2024-03-14",
    bio: "Designer chuyên nghiệp với passion về user experience",
    verified: true,
  },
  {
    id: 3,
    name: "Lê Văn C",
    email: "levanc@instructor.com",
    avatar: "/placeholder-user.jpg",
    status: "pending",
    specialization: "Digital Marketing",
    courses: 3,
    students: 4567,
    rating: 4.6,
    reviews: 234,
    totalEarnings: "$18,900",
    joinDate: "2024-01-20",
    lastActive: "2024-03-12",
    bio: "Marketing specialist với kinh nghiệm tại các công ty lớn",
    verified: false,
  },
  {
    id: 4,
    name: "Phạm Thị D",
    email: "phamthid@instructor.com",
    avatar: "/placeholder-user.jpg",
    status: "suspended",
    specialization: "Data Science",
    courses: 6,
    students: 6789,
    rating: 4.7,
    reviews: 345,
    totalEarnings: "$28,670",
    joinDate: "2023-08-01",
    lastActive: "2024-03-05",
    bio: "Data scientist với PhD từ đại học hàng đầu",
    verified: true,
  },
]

export default function InstructorsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedInstructor, setSelectedInstructor] = useState(null)

  const filteredInstructors = instructors.filter(
    (instructor) =>
      instructor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      instructor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      instructor.specialization.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 border-0">Hoạt động</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 border-0">Chờ duyệt</Badge>
      case "suspended":
        return <Badge variant="destructive">Bị đình chỉ</Badge>
      default:
        return <Badge variant="outline">Không xác định</Badge>
    }
  }

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold tracking-tight mb-2">Quản lý Giảng viên</h1>
            <p className="text-purple-100 text-lg">Quản lý thông tin và hoạt động của giảng viên</p>
          </div>
          <Button className="bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm">
            <UserPlus className="w-4 h-4 mr-2" />
            Thêm Giảng viên
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        {[
          {
            title: "Tổng Giảng viên",
            value: instructors.length,
            gradient: "from-purple-500 to-pink-500",
            bgGradient: "from-purple-50 to-pink-50",
            icon: Users,
          },
          {
            title: "Đang hoạt động",
            value: instructors.filter((i) => i.status === "active").length,
            gradient: "from-green-500 to-emerald-500",
            bgGradient: "from-green-50 to-emerald-50",
            icon: Users,
          },
          {
            title: "Tổng khóa học",
            value: instructors.reduce((sum, i) => sum + i.courses, 0),
            gradient: "from-blue-500 to-cyan-500",
            bgGradient: "from-blue-50 to-cyan-50",
            icon: BookOpen,
          },
          {
            title: "Tổng doanh thu",
            value: "$124,950",
            gradient: "from-orange-500 to-red-500",
            bgGradient: "from-orange-50 to-red-50",
            icon: DollarSign,
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
          <CardTitle className="text-xl font-bold text-gray-900">Danh sách Giảng viên</CardTitle>
          <CardDescription className="text-gray-600">
            Tổng cộng {instructors.length} giảng viên trong hệ thống
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Tìm kiếm giảng viên..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 bg-gray-50/50 border-gray-200 focus:bg-white focus:border-purple-300 focus:ring-2 focus:ring-purple-100 transition-all duration-200 rounded-xl h-12"
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
                <TableHead>Giảng viên</TableHead>
                <TableHead>Chuyên môn</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Khóa học</TableHead>
                <TableHead>Sinh viên</TableHead>
                <TableHead>Đánh giá</TableHead>
                <TableHead>Doanh thu</TableHead>
                <TableHead className="text-right">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInstructors.map((instructor) => (
                <TableRow key={instructor.id} className="hover:bg-gray-50/50">
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-10 h-10 ring-2 ring-gray-200">
                        <AvatarImage src={instructor.avatar || "/placeholder.svg"} />
                        <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold">
                          {instructor.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-gray-900">{instructor.name}</span>
                          {instructor.verified && <Award className="w-4 h-4 text-blue-500" />}
                        </div>
                        <div className="text-sm text-gray-500">{instructor.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-indigo-100 text-indigo-800 border-0">{instructor.specialization}</Badge>
                  </TableCell>
                  <TableCell>{getStatusBadge(instructor.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <BookOpen className="w-4 h-4 text-blue-600" />
                      <span className="font-medium">{instructor.courses}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4 text-green-600" />
                      <span className="font-medium">{instructor.students.toLocaleString()}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="font-medium">{instructor.rating}</span>
                      <span className="text-sm text-gray-500">({instructor.reviews})</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold text-green-600">{instructor.totalEarnings}</span>
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
                          onClick={() => setSelectedInstructor(instructor)}
                          className="hover:bg-blue-50 rounded-lg m-1"
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Xem chi tiết
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="hover:bg-yellow-50 rounded-lg m-1">
                          <Ban className="mr-2 h-4 w-4" />
                          {instructor.status === "suspended" ? "Bỏ đình chỉ" : "Đình chỉ"}
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600 hover:bg-red-50 rounded-lg m-1">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Xóa giảng viên
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

      <Dialog open={!!selectedInstructor} onOpenChange={() => setSelectedInstructor(null)}>
        <DialogContent className="max-w-3xl bg-white/95 backdrop-blur-sm border-0 shadow-2xl rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900">Chi tiết Giảng viên</DialogTitle>
            <DialogDescription className="text-gray-600">
              Thông tin chi tiết về giảng viên {selectedInstructor?.name}
            </DialogDescription>
          </DialogHeader>
          {selectedInstructor && (
            <div className="grid gap-6 py-4">
              <div className="flex items-center space-x-6 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                <Avatar className="w-20 h-20 ring-4 ring-white shadow-lg">
                  <AvatarImage src={selectedInstructor.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-2xl">
                    {selectedInstructor.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-2xl font-bold text-gray-900">{selectedInstructor.name}</h3>
                    {selectedInstructor.verified && <Award className="w-6 h-6 text-blue-500" />}
                  </div>
                  <p className="text-gray-600 mb-2">{selectedInstructor.email}</p>
                  <p className="text-gray-700 mb-3">{selectedInstructor.bio}</p>
                  <div className="flex space-x-3">
                    {getStatusBadge(selectedInstructor.status)}
                    <Badge className="bg-indigo-100 text-indigo-800 border-0">
                      {selectedInstructor.specialization}
                    </Badge>
                    <Badge className="bg-blue-100 text-blue-800 border-0">
                      Tham gia: {selectedInstructor.joinDate}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-0">
                  <CardContent className="p-4 text-center">
                    <BookOpen className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">{selectedInstructor.courses}</div>
                    <div className="text-sm text-gray-600">Khóa học</div>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-0">
                  <CardContent className="p-4 text-center">
                    <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">
                      {selectedInstructor.students.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">Sinh viên</div>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-0">
                  <CardContent className="p-4 text-center">
                    <Star className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">{selectedInstructor.rating}</div>
                    <div className="text-sm text-gray-600">Đánh giá ({selectedInstructor.reviews})</div>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-0">
                  <CardContent className="p-4 text-center">
                    <DollarSign className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">{selectedInstructor.totalEarnings}</div>
                    <div className="text-sm text-gray-600">Tổng doanh thu</div>
                  </CardContent>
                </Card>
              </div>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg font-bold">Thông tin bổ sung</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Ngày tham gia:</span>
                      <span className="ml-2 font-medium">{selectedInstructor.joinDate}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Hoạt động cuối:</span>
                      <span className="ml-2 font-medium">{selectedInstructor.lastActive}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Trạng thái xác thực:</span>
                      <span className="ml-2">
                        {selectedInstructor.verified ? (
                          <Badge className="bg-green-100 text-green-800 border-0">Đã xác thực</Badge>
                        ) : (
                          <Badge className="bg-yellow-100 text-yellow-800 border-0">Chưa xác thực</Badge>
                        )}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Chuyên môn:</span>
                      <span className="ml-2 font-medium">{selectedInstructor.specialization}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          <DialogFooter className="space-x-3">
            <Button variant="outline" onClick={() => setSelectedInstructor(null)} className="rounded-xl">
              Đóng
            </Button>
            <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 rounded-xl shadow-lg">
              Chỉnh sửa thông tin
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
