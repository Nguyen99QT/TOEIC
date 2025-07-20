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
  BookOpen,
  Users,
  Star,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  PlayCircle,
} from "lucide-react"

const courses = [
  {
    id: 1,
    title: "Complete React Developer Course 2024",
    instructor: "Nguyễn Văn A",
    instructorAvatar: "/placeholder-user.jpg",
    category: "Programming",
    level: "Intermediate",
    status: "published",
    students: 2847,
    lessons: 45,
    duration: "12h 30m",
    rating: 4.8,
    reviews: 234,
    price: "$99",
    revenue: "$12,450",
    createdAt: "2024-01-15",
    updatedAt: "2024-03-10",
    progress: 100,
    thumbnail: "/placeholder-course.jpg",
  },
  {
    id: 2,
    title: "Advanced JavaScript Concepts",
    instructor: "Trần Thị B",
    instructorAvatar: "/placeholder-user.jpg",
    category: "Programming",
    level: "Advanced",
    status: "pending",
    students: 1923,
    lessons: 32,
    duration: "8h 45m",
    rating: 4.7,
    reviews: 156,
    price: "$79",
    revenue: "$8,920",
    createdAt: "2024-02-20",
    updatedAt: "2024-03-12",
    progress: 85,
    thumbnail: "/placeholder-course.jpg",
  },
  {
    id: 3,
    title: "UI/UX Design Masterclass",
    instructor: "Lê Văn C",
    instructorAvatar: "/placeholder-user.jpg",
    category: "Design",
    level: "Beginner",
    status: "draft",
    students: 1456,
    lessons: 28,
    duration: "6h 20m",
    rating: 4.9,
    reviews: 89,
    price: "$69",
    revenue: "$7,680",
    createdAt: "2024-03-01",
    updatedAt: "2024-03-14",
    progress: 60,
    thumbnail: "/placeholder-course.jpg",
  },
  {
    id: 4,
    title: "Digital Marketing Strategy 2024",
    instructor: "Phạm Thị D",
    instructorAvatar: "/placeholder-user.jpg",
    category: "Marketing",
    level: "Intermediate",
    status: "published",
    students: 1234,
    lessons: 38,
    duration: "10h 15m",
    rating: 4.6,
    reviews: 178,
    price: "$89",
    revenue: "$6,540",
    createdAt: "2024-01-28",
    updatedAt: "2024-03-08",
    progress: 100,
    thumbnail: "/placeholder-course.jpg",
  },
]

export default function CoursesPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredCourses = courses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.category.toLowerCase().includes(searchTerm.toLowerCase()),
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

  const getLevelBadge = (level) => {
    const colors = {
      Beginner: "bg-green-100 text-green-800",
      Intermediate: "bg-blue-100 text-blue-800",
      Advanced: "bg-purple-100 text-purple-800",
    }
    return <Badge className={`${colors[level] || "bg-gray-100 text-gray-800"} border-0`}>{level}</Badge>
  }

  const getCategoryBadge = (category) => {
    const colors = {
      Programming: "bg-indigo-100 text-indigo-800",
      Design: "bg-pink-100 text-pink-800",
      Marketing: "bg-orange-100 text-orange-800",
      Business: "bg-emerald-100 text-emerald-800",
    }
    return <Badge className={`${colors[category] || "bg-gray-100 text-gray-800"} border-0`}>{category}</Badge>
  }

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold tracking-tight mb-2">Quản lý Khóa học</h1>
            <p className="text-indigo-100 text-lg">Quản lý tất cả khóa học trong hệ thống</p>
          </div>
          <Button className="bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm">
            <Plus className="w-4 h-4 mr-2" />
            Tạo khóa học mới
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        {[
          {
            title: "Tổng khóa học",
            value: courses.length,
            gradient: "from-indigo-500 to-purple-500",
            bgGradient: "from-indigo-50 to-purple-50",
            icon: BookOpen,
          },
          {
            title: "Đã xuất bản",
            value: courses.filter((c) => c.status === "published").length,
            gradient: "from-green-500 to-emerald-500",
            bgGradient: "from-green-50 to-emerald-50",
            icon: CheckCircle,
          },
          {
            title: "Chờ duyệt",
            value: courses.filter((c) => c.status === "pending").length,
            gradient: "from-yellow-500 to-orange-500",
            bgGradient: "from-yellow-50 to-orange-50",
            icon: Clock,
          },
          {
            title: "Tổng sinh viên",
            value: courses.reduce((sum, c) => sum + c.students, 0).toLocaleString(),
            gradient: "from-blue-500 to-cyan-500",
            bgGradient: "from-blue-50 to-cyan-50",
            icon: Users,
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
          <CardTitle className="text-xl font-bold text-gray-900">Danh sách Khóa học</CardTitle>
          <CardDescription className="text-gray-600">Quản lý và kiểm duyệt các khóa học</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Tìm kiếm khóa học..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 bg-gray-50/50 border-gray-200 focus:bg-white focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition-all duration-200 rounded-xl h-12"
              />
            </div>
            <Button variant="outline" className="rounded-xl border-gray-200 hover:bg-gray-50 h-12 px-6">
              <Filter className="w-4 h-4 mr-2" />
              Lọc
            </Button>
          </div>

          <div className="space-y-4">
            {filteredCourses.map((course) => (
              <Card
                key={course.id}
                className="border-0 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white/80 backdrop-blur-sm"
              >
                <CardContent className="p-6">
                  <div className="flex items-start space-x-6">
                    <div className="w-24 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                      <BookOpen className="w-8 h-8 text-white" />
                    </div>

                    <div className="flex-1 space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <h3 className="font-bold text-xl text-gray-900">{course.title}</h3>
                          <div className="flex items-center space-x-3">
                            <Avatar className="w-6 h-6">
                              <AvatarImage src={course.instructorAvatar || "/placeholder.svg"} />
                              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-semibold">
                                {course.instructor.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm text-gray-600">{course.instructor}</span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          {getStatusBadge(course.status)}
                          {getCategoryBadge(course.category)}
                          {getLevelBadge(course.level)}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4 text-blue-600" />
                          <span className="font-medium">{course.students.toLocaleString()}</span>
                          <span className="text-gray-500">sinh viên</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <PlayCircle className="w-4 h-4 text-green-600" />
                          <span className="font-medium">{course.lessons}</span>
                          <span className="text-gray-500">bài giảng</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-orange-600" />
                          <span className="font-medium">{course.duration}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="font-medium">{course.rating}</span>
                          <span className="text-gray-500">({course.reviews})</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <DollarSign className="w-4 h-4 text-green-600" />
                          <span className="font-medium">{course.price}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-green-600">{course.revenue}</span>
                          <span className="text-gray-500">doanh thu</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-2 flex-1 max-w-md">
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>Tiến độ hoàn thành</span>
                            <span>{course.progress}%</span>
                          </div>
                          <Progress value={course.progress} className="h-2" />
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
                              <DropdownMenuItem className="hover:bg-blue-50 rounded-lg m-1">
                                <Edit className="mr-2 h-4 w-4" />
                                Chỉnh sửa
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {course.status === "pending" && (
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
                                Xóa khóa học
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
    </div>
  )
}
