import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Progress } from "./ui/progress"
import { Users, BookOpen, DollarSign, Eye, MessageSquare, Star } from "lucide-react"

export function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-black">Overview of Toeic.com activities</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-study-500 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <div className="rounded-full bg-study-50 p-2 text-study-500">
              <Users className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,543</div>
            <p className="text-xs text-success-600">
              <span className="font-medium">+12%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-success-500 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Courses</CardTitle>
            <div className="rounded-full bg-success-50 p-2 text-success-500">
              <BookOpen className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-success-600">
              <span className="font-medium">+3</span> new courses this week
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-warning-500 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <div className="rounded-full bg-warning-50 p-2 text-warning-500">
              <DollarSign className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231</div>
            <p className="text-xs text-success-600">
              <span className="font-medium">+8%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-info-500 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Page Views</CardTitle>
            <div className="rounded-full bg-info-50 p-2 text-info-500">
              <Eye className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89,432</div>
            <p className="text-xs text-success-600">
              <span className="font-medium">+15%</span> from last week
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Recent Courses */}
        <Card className="col-span-4 shadow-md">
          <CardHeader className="bg-gradient-to-r from-study-50 to-white">
            <CardTitle>Recent Courses</CardTitle>
            <CardDescription>Courses created and updated recently</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  title: "React Advanced Patterns",
                  instructor: "John Smith",
                  students: 234,
                  status: "active",
                  progress: 85,
                  color: "study",
                },
                {
                  title: "Node.js Backend Development",
                  instructor: "Jane Doe",
                  students: 189,
                  status: "draft",
                  progress: 60,
                  color: "warning",
                },
                {
                  title: "UI/UX Design Fundamentals",
                  instructor: "Mike Johnson",
                  students: 456,
                  status: "active",
                  progress: 100,
                  color: "success",
                },
                {
                  title: "Python Data Science",
                  instructor: "Sarah Wilson",
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
                        {course.status === "active" ? "Active" : course.status === "draft" ? "Draft" : "Under Review"}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {course.instructor} • {course.students} students
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
                    View Details
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card className="col-span-3 shadow-md">
          <CardHeader className="bg-gradient-to-r from-study-50 to-white">
            <CardTitle>Today's Activity</CardTitle>
            <CardDescription>Quick statistics about today's activity</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-study-100">
                <Users className="h-5 w-5 text-study-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">New Users</p>
                <p className="text-2xl font-bold text-study-700">23</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success-100">
                <BookOpen className="h-5 w-5 text-success-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Completed Lessons</p>
                <p className="text-2xl font-bold text-success-700">156</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-warning-100">
                <MessageSquare className="h-5 w-5 text-warning-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">New Comments</p>
                <p className="text-2xl font-bold text-warning-700">34</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-info-100">
                <Star className="h-5 w-5 text-info-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">New Ratings</p>
                <p className="text-2xl font-bold text-info-700">12</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
