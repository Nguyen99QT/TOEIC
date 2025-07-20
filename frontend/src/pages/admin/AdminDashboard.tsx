import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Progress } from "./ui/progress"
import { Users, BookOpen, DollarSign, Eye, MessageSquare, Star } from "lucide-react"

export function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Tổng quan về hoạt động của Toeic.com</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-admin-500 shadow-md hover:shadow-lg transition-shadow bg-gradient-to-br from-admin-50 to-admin-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-admin-800">Tổng người dùng</CardTitle>
            <div className="rounded-full bg-admin-200 p-2 text-admin-700">
              <Users className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-admin-700">12,543</div>
            <p className="text-xs text-success-600">
              <span className="font-medium">+12%</span> so với tháng trước
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-success-500 shadow-md hover:shadow-lg transition-shadow bg-gradient-to-br from-success-50 to-success-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-success-800">Khóa học</CardTitle>
            <div className="rounded-full bg-success-200 p-2 text-success-700">
              <BookOpen className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success-700">156</div>
            <p className="text-xs text-success-600">
              <span className="font-medium">+3</span> khóa học mới tuần này
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-warning-500 shadow-md hover:shadow-lg transition-shadow bg-gradient-to-br from-warning-50 to-warning-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-warning-800">Doanh thu</CardTitle>
            <div className="rounded-full bg-warning-200 p-2 text-warning-700">
              <DollarSign className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning-700">₫45,231,000</div>
            <p className="text-xs text-success-600">
              <span className="font-medium">+8%</span> so với tháng trước
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-primary-500 shadow-md hover:shadow-lg transition-shadow bg-gradient-to-br from-primary-50 to-primary-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-primary-800">Lượt xem</CardTitle>
            <div className="rounded-full bg-primary-200 p-2 text-primary-700">
              <Eye className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary-700">89,432</div>
            <p className="text-xs text-success-600">
              <span className="font-medium">+15%</span> so với tuần trước
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Recent Courses */}
        <Card className="col-span-4 shadow-md hover:shadow-lg transition-shadow bg-gradient-to-br from-admin-50 to-admin-100">
          <CardHeader className="bg-gradient-to-r from-admin-200 to-admin-150">
            <CardTitle className="text-admin-800">Khóa học gần đây</CardTitle>
            <CardDescription>Các khóa học được tạo và cập nhật gần đây</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  title: "React Advanced Patterns",
                  instructor: "Nguyễn Văn A",
                  students: 234,
                  status: "active",
                  progress: 85,
                  color: "study",
                },
                {
                  title: "Node.js Backend Development",
                  instructor: "Trần Thị B",
                  students: 189,
                  status: "draft",
                  progress: 60,
                  color: "warning",
                },
                {
                  title: "UI/UX Design Fundamentals",
                  instructor: "Lê Văn C",
                  students: 456,
                  status: "active",
                  progress: 100,
                  color: "success",
                },
                {
                  title: "Python Data Science",
                  instructor: "Phạm Thị D",
                  students: 123,
                  status: "review",
                  progress: 40,
                  color: "info",
                },
              ].map((course, index) => (
                <div key={index} className="flex items-center justify-between space-x-4">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium leading-none">{course.title}</p>
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
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {course.instructor} • {course.students} học viên
                    </p>
                    <Progress
                      value={course.progress}
                      className="h-1"
                      indicatorClassName={
                        course.color === "study"
                          ? "bg-study-500"
                          : course.color === "success"
                            ? "bg-success-500"
                            : course.color === "warning"
                              ? "bg-warning-500"
                              : "bg-info-500"
                      }
                    />
                  </div>
                  <Button variant="ghost" size="sm" className="text-study-600 hover:text-study-700 hover:bg-study-50">
                    Xem chi tiết
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card className="col-span-3 shadow-md hover:shadow-lg transition-shadow bg-gradient-to-br from-admin-50 to-admin-100">
          <CardHeader className="bg-gradient-to-r from-admin-200 to-admin-150">
            <CardTitle className="text-admin-800">Hoạt động hôm nay</CardTitle>
            <CardDescription>Thống kê nhanh về hoạt động trong ngày</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-admin-100">
                <Users className="h-5 w-5 text-admin-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Người dùng mới</p>
                <p className="text-2xl font-bold text-admin-700">23</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success-100">
                <BookOpen className="h-5 w-5 text-success-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Bài học hoàn thành</p>
                <p className="text-2xl font-bold text-success-700">156</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-warning-100">
                <MessageSquare className="h-5 w-5 text-warning-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Bình luận mới</p>
                <p className="text-2xl font-bold text-warning-700">34</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-info-100">
                <Star className="h-5 w-5 text-info-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Đánh giá mới</p>
                <p className="text-2xl font-bold text-info-700">12</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
