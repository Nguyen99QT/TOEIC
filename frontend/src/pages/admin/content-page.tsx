import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Video, ImageIcon, Plus, Eye, Edit, Clock, User } from "lucide-react"

export function ContentPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản lý nội dung</h1>
          <p className="text-muted-foreground">Quản lý tất cả nội dung học tập trên Toeic.com</p>
        </div>
        <Button className="bg-study-600 hover:bg-study-700">
          <Plus className="mr-2 h-4 w-4" />
          Thêm nội dung
        </Button>
      </div>

      {/* Content Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-gradient-to-br from-study-500 to-study-600 text-white shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bài giảng</CardTitle>
            <FileText className="h-4 w-4 text-white/80" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-white/80">
              <span className="text-white font-medium">+12</span> bài mới tuần này
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-success-500 to-success-600 text-white shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Video</CardTitle>
            <Video className="h-4 w-4 text-white/80" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">456</div>
            <p className="text-xs text-white/80">
              <span className="text-white font-medium">+5</span> video mới
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-warning-500 to-warning-600 text-white shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hình ảnh</CardTitle>
            <ImageIcon className="h-4 w-4 text-white/80" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,345</div>
            <p className="text-xs text-white/80">
              <span className="text-white font-medium">+23</span> ảnh mới
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-info-500 to-info-600 text-white shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chờ duyệt</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
            <p className="text-xs text-white/80">Cần xem xét</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Content */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-md">
          <CardHeader className="bg-gradient-to-r from-study-50 to-white">
            <CardTitle>Nội dung gần đây</CardTitle>
            <CardDescription>Nội dung được tạo và cập nhật gần đây</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  title: "Giới thiệu về React Hooks",
                  type: "lesson",
                  author: "Nguyễn Văn A",
                  status: "published",
                  views: 1234,
                  createdAt: "2024-01-20",
                },
                {
                  title: "Video: Xây dựng API với Node.js",
                  type: "video",
                  author: "Trần Thị B",
                  status: "draft",
                  views: 0,
                  createdAt: "2024-01-19",
                },
                {
                  title: "Thiết kế UI/UX hiện đại",
                  type: "lesson",
                  author: "Lê Văn C",
                  status: "review",
                  views: 567,
                  createdAt: "2024-01-18",
                },
              ].map((content, index) => (
                <div key={index} className="flex items-center justify-between space-x-4 rounded-lg border p-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                      {content.type === "video" ? <Video className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">{content.title}</p>
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <User className="h-3 w-3" />
                        <span>{content.author}</span>
                        <Clock className="h-3 w-3" />
                        <span>{content.createdAt}</span>
                        <Eye className="h-3 w-3" />
                        <span>{content.views} lượt xem</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant={
                        content.status === "published"
                          ? "default"
                          : content.status === "draft"
                            ? "secondary"
                            : "outline"
                      }
                      className={
                        content.status === "published"
                          ? "bg-success-500 hover:bg-success-600"
                          : content.status === "draft"
                            ? "bg-warning-500 hover:bg-warning-600 text-white"
                            : "border-info-500 text-info-500"
                      }
                    >
                      {content.status === "published"
                        ? "Đã xuất bản"
                        : content.status === "draft"
                          ? "Nháp"
                          : "Đang duyệt"}
                    </Badge>
                    <Button variant="ghost" size="sm" className="text-study-600 hover:text-study-700 hover:bg-study-50">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader className="bg-gradient-to-r from-study-50 to-white">
            <CardTitle>Nội dung phổ biến</CardTitle>
            <CardDescription>Nội dung có lượt xem cao nhất</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  title: "JavaScript ES6+ Complete Guide",
                  type: "lesson",
                  views: 15234,
                  likes: 1234,
                  comments: 89,
                },
                {
                  title: "React Performance Optimization",
                  type: "video",
                  views: 12456,
                  likes: 987,
                  comments: 156,
                },
                {
                  title: "CSS Grid Layout Mastery",
                  type: "lesson",
                  views: 9876,
                  likes: 765,
                  comments: 234,
                },
              ].map((content, index) => (
                <div key={index} className="flex items-center justify-between space-x-4 rounded-lg border p-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                      {content.type === "video" ? <Video className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">{content.title}</p>
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Eye className="h-3 w-3" />
                          <span>{content.views.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span>👍 {content.likes}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span>💬 {content.comments}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-study-600 hover:text-study-700 hover:bg-study-50">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
