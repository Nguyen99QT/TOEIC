import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Progress } from "./ui/progress"
import { TrendingUp, Users, Eye, Clock, BookOpen, DollarSign, Star, MessageSquare } from "lucide-react"

export function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-black">Analytics & Statistics</h1>
          <p className="text-black">Track performance and trends of Toeic.com</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-study-500 to-study-600 text-white shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-white/80" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231</div>
            <p className="text-xs text-white/80">
              <span className="text-white font-medium">+20.1%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-success-500 to-success-600 text-white shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-white/80" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8,234</div>
            <p className="text-xs text-white/80">
              <span className="text-white font-medium">+12%</span> from last week
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-warning-500 to-warning-600 text-white shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Study Time</CardTitle>
            <Clock className="h-4 w-4 text-white/80" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.4h</div>
            <p className="text-xs text-white/80">
              <span className="text-white font-medium">+5%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-info-500 to-info-600 text-white shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-white/80" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">73%</div>
            <p className="text-xs text-white/80">
              <span className="text-white font-medium">+2%</span> from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Popular Courses */}
        <Card className="col-span-4 shadow-md">
          <CardHeader className="bg-gradient-to-r from-study-50 to-white">
            <CardTitle>Most Popular Courses</CardTitle>
            <CardDescription>Top 5 courses with most students</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "React Advanced Patterns", students: 1234, progress: 85, revenue: "$12,340" },
                { name: "Node.js Backend Development", students: 987, progress: 72, revenue: "$9,870" },
                { name: "UI/UX Design Fundamentals", students: 856, progress: 68, revenue: "$8,560" },
                { name: "Python Data Science", students: 743, progress: 61, revenue: "$7,430" },
                { name: "JavaScript ES6+ Complete", students: 692, progress: 58, revenue: "$6,920" },
              ].map((course, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-sm font-medium">
                    {index + 1}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">{course.name}</p>
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <span>{course.students} students</span>
                      <span>{course.revenue}</span>
                    </div>
                    <Progress value={course.progress} className="h-1" />
                  </div>
                  <div className="text-sm font-medium">{course.progress}%</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* User Engagement */}
        <Card className="col-span-3 shadow-md">
          <CardHeader className="bg-gradient-to-r from-study-50 to-white">
            <CardTitle>User Engagement</CardTitle>
            <CardDescription>Activity statistics for the last 7 days</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-study-100">
                <Eye className="h-5 w-5 text-study-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Page Views</p>
                <p className="text-2xl font-bold text-study-700">89,432</p>
                <p className="text-xs text-muted-foreground">+15% from last week</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success-100">
                <BookOpen className="h-5 w-5 text-success-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Completed Lessons</p>
                <p className="text-2xl font-bold text-success-700">2,156</p>
                <p className="text-xs text-muted-foreground">+8% from last week</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-warning-100">
                <MessageSquare className="h-5 w-5 text-warning-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">New Comments</p>
                <p className="text-2xl font-bold text-warning-700">234</p>
                <p className="text-xs text-muted-foreground">+12% from last week</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-info-100">
                <Star className="h-5 w-5 text-info-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Average Rating</p>
                <p className="text-2xl font-bold text-info-700">4.8</p>
                <p className="text-xs text-muted-foreground">+0.2 from last month</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue and Growth */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-md">
          <CardHeader className="bg-gradient-to-r from-study-50 to-white">
            <CardTitle>Revenue by Category</CardTitle>
            <CardDescription>Revenue distribution by field</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { category: "Frontend Development", revenue: "$18,500", percentage: 41 },
                { category: "Backend Development", revenue: "$13,200", percentage: 29 },
                { category: "UI/UX Design", revenue: "$8,900", percentage: 20 },
                { category: "Data Science", revenue: "$4,631", percentage: 10 },
              ].map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{item.category}</span>
                    <span className="text-sm text-muted-foreground">{item.revenue}</span>
                  </div>
                  <Progress value={item.percentage} className="h-2" />
                  <div className="text-xs text-muted-foreground text-right">{item.percentage}% of total revenue</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader className="bg-gradient-to-r from-study-50 to-white">
            <CardTitle>Registration Trends</CardTitle>
            <CardDescription>Number of new users by month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { month: "January", users: 1234, growth: "+15%" },
                { month: "February", users: 1456, growth: "+18%" },
                { month: "March", users: 1678, growth: "+15%" },
                { month: "April", users: 1890, growth: "+13%" },
                { month: "May", users: 2123, growth: "+12%" },
                { month: "June", users: 2345, growth: "+10%" },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-medium">
                      {index + 1}
                    </div>
                    <span className="text-sm font-medium">{item.month}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{item.users.toLocaleString()}</p>
                    <p className="text-xs text-success-600">{item.growth}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
