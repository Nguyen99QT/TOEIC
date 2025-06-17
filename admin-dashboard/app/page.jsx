import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Progress } from "../components/ui/progress"
import { GraduationCap, Users, BookOpen, DollarSign, TrendingUp, TrendingDown, Star, MessageSquare } from "lucide-react"

const stats = [
  {
    title: "Tổng Sinh viên",
    value: "12,847",
    change: "+18%",
    trend: "up",
    icon: GraduationCap,
    description: "So với tháng trước",
    gradient: "from-blue-500 to-cyan-500",
    bgGradient: "from-blue-50 to-cyan-50",
  },
  {
    title: "Giảng viên",
    value: "234",
    change: "+12%",
    trend: "up",
    icon: Users,
    description: "Giảng viên hoạt động",
    gradient: "from-green-500 to-emerald-500",
    bgGradient: "from-green-50 to-emerald-50",
  },
  {
    title: "Khóa học",
    value: "1,456",
    change: "+8%",
    trend: "up",
    icon: BookOpen,
    description: "Khóa học được tạo",
    gradient: "from-purple-500 to-pink-500",
    bgGradient: "from-purple-50 to-pink-50",
  },
  {
    title: "Doanh thu",
    value: "$89,234",
    change: "+25%",
    trend: "up",
    icon: DollarSign,
    description: "Doanh thu tháng này",
    gradient: "from-orange-500 to-red-500",
    bgGradient: "from-orange-50 to-red-50",
  },
]

const topCourses = [
  {
    id: 1,
    title: "Complete React Developer Course",
    instructor: "Nguyễn Văn A",
    students: 2847,
    rating: 4.8,
    revenue: "$12,450",
    progress: 85,
    category: "Programming",
  },
  {
    id: 2,
    title: "Advanced JavaScript Concepts",
    instructor: "Trần Thị B",
    students: 1923,
    rating: 4.7,
    revenue: "$8,920",
    progress: 92,
    category: "Programming",
  },
  {
    id: 3,
    title: "UI/UX Design Masterclass",
    instructor: "Lê Văn C",
    students: 1456,
    rating: 4.9,
    revenue: "$7,680",
    progress: 78,
    category: "Design",
  },
  {
    id: 4,
    title: "Digital Marketing Strategy",
    instructor: "Phạm Thị D",
    students: 1234,
    rating: 4.6,
    revenue: "$6,540",
    progress: 88,
    category: "Marketing",
  },
]

const recentActivities = [
  {
    type: "enrollment",
    message: "125 sinh viên mới đăng ký khóa học hôm nay",
    time: "2 phút trước",
    status: "success",
  },
  {
    type: "course",
    message: "Khóa học 'Python for Beginners' cần được duyệt",
    time: "5 phút trước",
    status: "warning",
  },
  {
    type: "review",
    message: "Nhận được 15 đánh giá 5 sao mới",
    time: "10 phút trước",
    status: "success",
  },
  {
    type: "instructor",
    message: "Giảng viên mới đăng ký: john.doe@example.com",
    time: "15 phút trước",
    status: "info",
  },
]

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white shadow-xl">
        <h1 className="text-4xl font-bold tracking-tight mb-2">Dashboard</h1>
        <p className="text-indigo-100 text-lg">Tổng quan về nền tảng học tập trực tuyến</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card
            key={stat.title}
            className={`bg-gradient-to-br ${stat.bgGradient} border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-gray-700">{stat.title}</CardTitle>
              <div className={`p-2 rounded-xl bg-gradient-to-r ${stat.gradient} shadow-lg`}>
                <stat.icon className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
              <div className="flex items-center space-x-2 text-sm">
                <div
                  className={`flex items-center font-semibold ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}
                >
                  {stat.trend === "up" ? (
                    <TrendingUp className="w-4 h-4 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 mr-1" />
                  )}
                  {stat.change}
                </div>
                <span className="text-gray-600">{stat.description}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-t-xl">
            <CardTitle className="text-xl font-bold text-gray-900">Top Khóa học</CardTitle>
            <CardDescription className="text-gray-600">Các khóa học có doanh thu cao nhất</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              {topCourses.map((course) => (
                <div
                  key={course.id}
                  className="flex items-center space-x-4 p-4 rounded-xl hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                    <BookOpen className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900">{course.title}</h3>
                      <Badge className="bg-indigo-100 text-indigo-800 hover:bg-indigo-200">{course.category}</Badge>
                    </div>
                    <p className="text-sm text-gray-600">Giảng viên: {course.instructor}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <GraduationCap className="w-4 h-4" />
                        <span>{course.students.toLocaleString()} sinh viên</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span>{course.rating}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <DollarSign className="w-4 h-4" />
                        <span className="font-semibold text-green-600">{course.revenue}</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Tiến độ hoàn thành</span>
                        <span>{course.progress}%</span>
                      </div>
                      <Progress value={course.progress} className="h-2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-t-xl">
            <CardTitle className="text-xl font-bold text-gray-900">Hoạt động gần đây</CardTitle>
            <CardDescription className="text-gray-600">Các hoạt động mới nhất</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-4 p-4 rounded-xl hover:bg-gray-50 transition-colors duration-200"
                >
                  <div
                    className={`w-3 h-3 rounded-full shadow-sm ${
                      activity.status === "success"
                        ? "bg-gradient-to-r from-green-400 to-green-500"
                        : activity.status === "warning"
                          ? "bg-gradient-to-r from-yellow-400 to-orange-500"
                          : activity.status === "info"
                            ? "bg-gradient-to-r from-blue-400 to-blue-500"
                            : "bg-gradient-to-r from-red-400 to-red-500"
                    }`}
                  />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                  <Badge
                    className={`${
                      activity.status === "success"
                        ? "bg-green-100 text-green-800 hover:bg-green-200"
                        : activity.status === "warning"
                          ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                          : activity.status === "info"
                            ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
                            : "bg-red-100 text-red-800 hover:bg-red-200"
                    } border-0 font-medium`}
                  >
                    {activity.type}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-t-xl">
            <CardTitle className="text-lg font-bold text-gray-900">Thống kê học tập</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {[
                { label: "Tỷ lệ hoàn thành khóa học", value: "78%", color: "blue" },
                { label: "Thời gian học trung bình", value: "2.5h/ngày", color: "green" },
                { label: "Khóa học phổ biến nhất", value: "Programming", color: "purple" },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  <span className="text-sm font-medium text-gray-700">{item.label}</span>
                  <span className="text-sm font-bold text-gray-900">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-xl">
            <CardTitle className="text-lg font-bold text-gray-900">Đánh giá & Phản hồi</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {[
                { label: "Đánh giá trung bình", value: "4.7/5", icon: Star },
                { label: "Tổng reviews", value: "12,456", icon: MessageSquare },
                { label: "Phản hồi tích cực", value: "94%", icon: TrendingUp },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  <item.icon className="w-5 h-5 text-green-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-700">{item.label}</p>
                    <p className="text-lg font-bold text-gray-900">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-xl">
            <CardTitle className="text-lg font-bold text-gray-900">Cần xử lý</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {[
                { label: "Khóa học chờ duyệt", value: "23", color: "yellow" },
                { label: "Báo cáo vi phạm", value: "5", color: "red" },
                { label: "Yêu cầu hỗ trợ", value: "12", color: "blue" },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  <span className="text-sm font-medium text-gray-700">{item.label}</span>
                  <Badge
                    className={`${
                      item.color === "yellow"
                        ? "bg-yellow-100 text-yellow-800"
                        : item.color === "red"
                          ? "bg-red-100 text-red-800"
                          : "bg-blue-100 text-blue-800"
                    } border-0 font-bold`}
                  >
                    {item.value}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
