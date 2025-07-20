import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Progress } from "./ui/progress"
import { Users, BookOpen, DollarSign, Eye, MessageSquare, Star, TrendingUp, Activity } from "lucide-react"

export function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900">
          Dashboard
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          Tổng quan về hoạt động của Toeic.com
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="group relative overflow-hidden border border-slate-200 bg-white dark:from-blue-950/50 dark:to-indigo-950/50 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-semibold text-slate-700 dark:text-blue-200">Tổng người dùng</CardTitle>
            <div className="rounded-xl bg-blue-500 p-3 text-white shadow-sm">
              <Users className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold text-slate-900 dark:text-blue-100">12,543</div>
            <div className="flex items-center gap-2 mt-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <p className="text-sm text-slate-600 font-medium">
                +12% so với tháng trước
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden border border-slate-200 bg-white dark:from-emerald-950/50 dark:to-green-950/50 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-semibold text-slate-700 dark:text-emerald-200">Khóa học</CardTitle>
            <div className="rounded-xl bg-emerald-500 p-3 text-white shadow-sm">
              <BookOpen className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold text-slate-900 dark:text-emerald-100">156</div>
            <div className="flex items-center gap-2 mt-2">
              <Activity className="h-4 w-4 text-green-500" />
              <p className="text-sm text-slate-600 font-medium">
                +3 khóa học mới tuần này
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden border border-slate-200 bg-white dark:from-amber-950/50 dark:to-orange-950/50 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-semibold text-slate-700 dark:text-amber-200">Doanh thu</CardTitle>
            <div className="rounded-xl bg-amber-500 p-3 text-white shadow-sm">
              <DollarSign className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold text-slate-900 dark:text-amber-100">₫45,231,000</div>
            <div className="flex items-center gap-2 mt-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <p className="text-sm text-slate-600 font-medium">
                +8% so với tháng trước
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden border border-slate-200 bg-white dark:from-purple-950/50 dark:to-pink-950/50 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-semibold text-slate-700 dark:text-purple-200">Lượt xem</CardTitle>
            <div className="rounded-xl bg-purple-500 p-3 text-white shadow-sm">
              <Eye className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold text-slate-900 dark:text-purple-100">89,432</div>
            <div className="flex items-center gap-2 mt-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <p className="text-sm text-slate-600 font-medium">
                +15% so với tuần trước
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-7">
        {/* Recent Courses */}
        <Card className="col-span-4 group border border-slate-200 bg-white dark:bg-slate-900/80 backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-300">
          <CardHeader className="bg-slate-50/50 dark:from-slate-800 dark:to-slate-700 border-b border-slate-200 dark:border-slate-700/50">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">Nội dung gần đây</CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400">
                  Nội dung được tạo và cập nhật gần đây
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" className="border-slate-300 text-slate-600 hover:bg-slate-50 dark:border-slate-600">
                Xem tất cả
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6 bg-white dark:from-slate-900 dark:to-slate-900">
            <div className="space-y-4">
              {[
                {
                  title: "Giới thiệu về React Hooks",
                  instructor: "Nguyễn Văn A",
                  date: "2024-01-20",
                  views: "1234 lượt xem",
                  status: "published",
                  type: "article",
                },
                {
                  title: "Video: Xây dựng API với Node.js",
                  instructor: "Trần Thị B", 
                  date: "2024-01-19",
                  views: "0 lượt xem",
                  status: "draft",
                  type: "video",
                },
                {
                  title: "Thiết kế UI/UX hiện đại",
                  instructor: "Lê Văn C",
                  date: "2024-01-18", 
                  views: "567 lượt xem",
                  status: "review",
                  type: "article",
                },
              ].map((content, index) => (
                <div key={index} className="flex items-center justify-between space-x-4 p-4 rounded-lg hover:bg-slate-50 transition-all duration-200 bg-slate-50/30">
                  <div className="flex items-center space-x-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
                      {content.type === "video" ? (
                        <svg className="h-5 w-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-900">{content.title}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <p className="text-xs text-slate-500">👤 {content.instructor}</p>
                        <p className="text-xs text-slate-500">📅 {content.date}</p>
                        <p className="text-xs text-slate-500">👁 {content.views}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        content.status === "published"
                          ? "border-green-500 text-green-700 bg-green-50"
                          : content.status === "draft"
                            ? "border-orange-500 text-orange-700 bg-orange-50"
                            : "border-purple-500 text-purple-700 bg-purple-50"
                      }`}
                    >
                      {content.status === "published" ? "Đã xuất bản" : content.status === "draft" ? "Nháp" : "Đang duyệt"}
                    </Badge>
                    <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-700">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Popular Content */}
        <Card className="col-span-3 group border border-slate-200 bg-white dark:bg-slate-900/80 backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-300">
          <CardHeader className="bg-slate-50/50 dark:from-slate-800 dark:to-slate-700 border-b border-slate-200 dark:border-slate-700/50">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">Nội dung phổ biến</CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400">
                  Nội dung có lượt xem cao nhất
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm">
                <svg className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-4 bg-white dark:from-slate-900 dark:to-slate-900">
            {[
              {
                title: "JavaScript ES6+ Complete Guide",
                views: "15,234",
                likes: "1234", 
                comments: "89",
                type: "article"
              },
              {
                title: "React Performance Optimization",
                views: "12,456",
                likes: "987",
                comments: "156", 
                type: "video"
              },
              {
                title: "CSS Grid Layout Mastery",
                views: "9,876",
                likes: "765",
                comments: "234",
                type: "article"
              }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-slate-50/50 hover:bg-slate-100/50 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white border border-slate-200">
                    {item.type === "video" ? (
                      <svg className="h-4 w-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    ) : (
                      <svg className="h-4 w-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">{item.title}</p>
                    <div className="flex items-center gap-4 mt-1 text-xs text-slate-500">
                      <span>👁 {item.views}</span>
                      <span>👍 {item.likes}</span>
                      <span>💬 {item.comments}</span>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-slate-600">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
