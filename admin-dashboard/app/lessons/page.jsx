"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Badge } from "../../components/ui/badge"
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
import { Progress } from "../../components/ui/progress"
import {
  Search,
  MoreHorizontal,
  Plus,
  Filter,
  Eye,
  Edit,
  Trash2,
  PlayCircle,
  Clock,
  Users,
  CheckCircle,
  XCircle,
  FileText,
} from "lucide-react"

const lessons = [
  {
    id: 1,
    title: "Giới thiệu về React Components",
    course: "Complete React Developer Course 2024",
    instructor: "Nguyễn Văn A",
    instructorAvatar: "/placeholder-user.jpg",
    duration: "15:30",
    type: "video",
    status: "published",
    views: 1234,
    completionRate: 85,
    createdAt: "2024-03-15",
    updatedAt: "2024-03-15",
    description: "Học cách tạo và sử dụng React Components cơ bản",
  },
  {
    id: 2,
    title: "State và Props trong React",
    course: "Complete React Developer Course 2024",
    instructor: "Nguyễn Văn A",
    instructorAvatar: "/placeholder-user.jpg",
    duration: "22:45",
    type: "video",
    status: "pending",
    views: 567,
    completionRate: 72,
    createdAt: "2024-03-14",
    updatedAt: "2024-03-14",
    description: "Hiểu về State và Props để quản lý dữ liệu trong React",
  },
  {
    id: 3,
    title: "Bài tập thực hành: Todo App",
    course: "Complete React Developer Course 2024",
    instructor: "Nguyễn Văn A",
    instructorAvatar: "/placeholder-user.jpg",
    duration: "45:20",
    type: "exercise",
    status: "draft",
    views: 0,
    completionRate: 0,
    createdAt: "2024-03-13",
    updatedAt: "2024-03-13",
    description: "Xây dựng ứng dụng Todo để thực hành kiến thức đã học",
  },
  {
    id: 4,
    title: "JavaScript ES6+ Features",
    course: "Advanced JavaScript Concepts",
    instructor: "Trần Thị B",
    instructorAvatar: "/placeholder-user.jpg",
    duration: "35:15",
    type: "video",
    status: "published",
    views: 2156,
    completionRate: 91,
    createdAt: "2024-03-12",
    updatedAt: "2024-03-12",
    description: "Tìm hiểu các tính năng mới của JavaScript ES6+",
  },
]

export default function LessonsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedLesson, setSelectedLesson] = useState(null)

  const filteredLessons = lessons.filter(
    (lesson) =>
      lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lesson.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lesson.instructor.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusBadge = (status) => {
    switch (status) {
      case "published":
        return <Badge className="bg-green-100 text-green-800 border-0">Đã xuất bản</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 border-0">Chờ duyệt</Badge>
      case "draft":
        return <Badge variant="secondary">Bản nháp</Badge>
      case "rejected":
        return <Badge variant="destructive">Bị từ chối</Badge>
      default:
        return <Badge variant="outline">Không xác định</Badge>
    }
  }

  const getTypeBadge = (type) => {
    const colors = {
      video: "bg-blue-100 text-blue-800",
      exercise: "bg-purple-100 text-purple-800",
      reading: "bg-orange-100 text-orange-800",
      quiz: "bg-green-100 text-green-800",
    }
    const icons = {
      video: PlayCircle,
      exercise: FileText,
      reading: FileText,
      quiz: CheckCircle,
    }
    const Icon = icons[type] || FileText
    return (
      <Badge className={`${colors[type] || "bg-gray-100 text-gray-800"} border-0 flex items-center gap-1`}>
        <Icon className="w-3 h-3" />
        {type === "video" ? "Video" : type === "exercise" ? "Bài tập" : type === "reading" ? "Đọc" : "Quiz"}
      </Badge>
    )
  }

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold tracking-tight mb-2">Quản lý Bài giảng</h1>
            <p className="text-blue-100 text-lg">Quản lý tất cả bài giảng trong hệ thống</p>
          </div>
          <Button className="bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm">
            <Plus className="w-4 h-4 mr-2" />
            Tạo bài giảng mới
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        {[
          {
            title: "Tổng bài giảng",
            value: lessons.length,
            gradient: "from-blue-500 to-purple-500",
            bgGradient: "from-blue-50 to-purple-50",
            icon: PlayCircle,
          },
          {
            title: "Đã xuất bản",
            value: lessons.filter((l) => l.status === "published").length,
            gradient: "from-green-500 to-emerald-500",
            bgGradient: "from-green-50 to-emerald-50",
            icon: CheckCircle,
          },
          {
            title: "Chờ duyệt",
            value: lessons.filter((l) => l.status === "pending").length,
            gradient: "from-yellow-500 to-orange-500",
            bgGradient: "from-yellow-50 to-orange-50",
            icon: Clock,
          },
          {
            title: "Tổng lượt xem",
            value: lessons.reduce((sum, l) => sum + l.views, 0).toLocaleString(),
            gradient: "from-pink-500 to-red-500",
            bgGradient: "from-pink-50 to-red-50",
            icon: Eye,
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
          <CardTitle className="text-xl font-bold text-gray-900">Danh sách Bài giảng</CardTitle>
          <CardDescription className="text-gray-600">Quản lý và kiểm duyệt các bài giảng</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Tìm kiếm bài giảng..."
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

          <div className="space-y-4">
            {filteredLessons.map((lesson) => (
              <Card
                key={lesson.id}
                className="border-0 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white/80 backdrop-blur-sm"
              >
                <CardContent className="p-6">
                  <div className="flex items-start space-x-6">
                    <div className="w-24 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                      <PlayCircle className="w-8 h-8 text-white" />
                    </div>

                    <div className="flex-1 space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <h3 className="font-bold text-xl text-gray-900">{lesson.title}</h3>
                          <p className="text-gray-600">{lesson.course}</p>
                          <div className="flex items-center space-x-3">
                            <Avatar className="w-6 h-6">
                              <AvatarImage src={lesson.instructorAvatar || "/placeholder.svg"} />
                              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-semibold">
                                {lesson.instructor.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm text-gray-600">{lesson.instructor}</span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          {getStatusBadge(lesson.status)}
                          {getTypeBadge(lesson.type)}
                        </div>
                      </div>

                      <p className="text-gray-700 text-sm">{lesson.description}</p>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-blue-600" />
                          <span className="font-medium">{lesson.duration}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Eye className="w-4 h-4 text-green-600" />
                          <span className="font-medium">{lesson.views.toLocaleString()}</span>
                          <span className="text-gray-500">lượt xem</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4 text-purple-600" />
                          <span className="font-medium">{lesson.completionRate}%</span>
                          <span className="text-gray-500">hoàn thành</span>
                        </div>
                        <div className="text-gray-500">Cập nhật: {lesson.updatedAt}</div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-2 flex-1 max-w-md">
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>Tỷ lệ hoàn thành</span>
                            <span>{lesson.completionRate}%</span>
                          </div>
                          <Progress value={lesson.completionRate} className="h-2" />
                        </div>

                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm" className="rounded-lg">
                            <Eye className="w-4 h-4 mr-1" />
                            Xem
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="rounded-lg">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="bg-white/95 backdrop-blur-sm border-gray-200/50 shadow-xl rounded-xl"
                            >
                              <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                              <DropdownMenuItem
                                onClick={() => setSelectedLesson(lesson)}
                                className="hover:bg-blue-50 rounded-lg m-1"
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                Xem chi tiết
                              </DropdownMenuItem>
                              <DropdownMenuItem className="hover:bg-blue-50 rounded-lg m-1">
                                <Edit className="mr-2 h-4 w-4" />
                                Chỉnh sửa
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {lesson.status === "pending" && (
                                <>
                                  <DropdownMenuItem className="text-green-600 hover:bg-green-50 rounded-lg m-1">
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Phê duyệt
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="text-red-600 hover:bg-red-50 rounded-lg m-1">
                                    <XCircle className="mr-2 h-4 w-4" />
                                    Từ chối
                                  </DropdownMenuItem>
                                </>
                              )}
                              <DropdownMenuItem className="text-red-600 hover:bg-red-50 rounded-lg m-1">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Xóa bài giảng
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Lesson Detail Dialog */}
      <Dialog open={!!selectedLesson} onOpenChange={() => setSelectedLesson(null)}>
        <DialogContent className="max-w-4xl bg-white/95 backdrop-blur-sm border-0 shadow-2xl rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900">Chi tiết Bài giảng</DialogTitle>
            <DialogDescription className="text-gray-600">
              Thông tin chi tiết về bài giảng `{selectedLesson?.title}`
            </DialogDescription>
          </DialogHeader>

          {selectedLesson && (
            <div className="space-y-6">
              <div className="flex items-center space-x-6 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                  <PlayCircle className="w-10 h-10 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900">{selectedLesson.title}</h3>
                  <p className="text-gray-600 mb-2">{selectedLesson.course}</p>
                  <p className="text-gray-700 mb-3">{selectedLesson.description}</p>
                  <div className="flex space-x-3">
                    {getStatusBadge(selectedLesson.status)}
                    {getTypeBadge(selectedLesson.type)}
                    <Badge className="bg-blue-100 text-blue-800 border-0">{selectedLesson.duration}</Badge>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-0">
                  <CardContent className="p-4 text-center">
                    <Eye className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">{selectedLesson.views.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Lượt xem</div>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-0">
                  <CardContent className="p-4 text-center">
                    <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">{selectedLesson.completionRate}%</div>
                    <div className="text-sm text-gray-600">Tỷ lệ hoàn thành</div>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-0">
                  <CardContent className="p-4 text-center">
                    <Clock className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">{selectedLesson.duration}</div>
                    <div className="text-sm text-gray-600">Thời lượng</div>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-0">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-gray-900">{selectedLesson.createdAt}</div>
                    <div className="text-sm text-gray-600">Ngày tạo</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          <DialogFooter className="space-x-3">
            <Button variant="outline" onClick={() => setSelectedLesson(null)} className="rounded-xl">
              Đóng
            </Button>
            <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-0 rounded-xl shadow-lg">
              Chỉnh sửa bài giảng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
