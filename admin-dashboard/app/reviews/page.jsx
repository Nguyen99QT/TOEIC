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
import { Textarea } from "../../components/ui/textarea"
import {
  Search,
  MoreHorizontal,
  Filter,
  Eye,
  Flag,
  Trash2,
  CheckCircle,
  XCircle,
  Star,
  Clock,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react"

const reviews = [
  {
    id: 1,
    title: "Khóa học tuyệt vời!",
    content:
      "Đây là một trong những khóa học React tốt nhất mà tôi từng tham gia. Giảng viên giải thích rất rõ ràng và dễ hiểu. Các bài tập thực hành rất hữu ích.",
    rating: 5,
    author: "Nguyễn Văn A",
    authorAvatar: "/placeholder-user.jpg",
    course: "Complete React Developer Course 2024",
    instructor: "Nguyễn Văn A",
    status: "approved",
    helpful: 23,
    notHelpful: 2,
    createdAt: "2024-03-15 10:30",
    reportCount: 0,
    response: null,
  },
  {
    id: 2,
    title: "Nội dung hay nhưng hơi nhanh",
    content:
      "Khóa học có nội dung rất hay và cập nhật. Tuy nhiên, tốc độ giảng dạy hơi nhanh đối với người mới bắt đầu. Mong giảng viên có thể giảm tốc độ một chút.",
    rating: 4,
    author: "Trần Thị B",
    authorAvatar: "/placeholder-user.jpg",
    course: "Complete React Developer Course 2024",
    instructor: "Nguyễn Văn A",
    status: "pending",
    helpful: 15,
    notHelpful: 3,
    createdAt: "2024-03-14 15:45",
    reportCount: 0,
    response: null,
  },
  {
    id: 3,
    title: "Không đáng tiền",
    content: "Khóa học này quá tệ, nội dung lỗi thời và giảng viên không nhiệt tình. Tôi muốn hoàn tiền!!!",
    rating: 1,
    author: "Lê Văn C",
    authorAvatar: "/placeholder-user.jpg",
    course: "Advanced JavaScript Concepts",
    instructor: "Trần Thị B",
    status: "flagged",
    helpful: 2,
    notHelpful: 18,
    createdAt: "2024-03-13 09:15",
    reportCount: 5,
    response: null,
  },
  {
    id: 4,
    title: "Rất hài lòng với khóa học",
    content:
      "Khóa học UI/UX này thực sự đã thay đổi cách nhìn của tôi về thiết kế. Giảng viên có kinh nghiệm thực tế và chia sẻ rất nhiều tips hữu ích.",
    rating: 5,
    author: "Phạm Thị D",
    authorAvatar: "/placeholder-user.jpg",
    course: "UI/UX Design Masterclass",
    instructor: "Lê Văn C",
    status: "approved",
    helpful: 31,
    notHelpful: 1,
    createdAt: "2024-03-12 14:20",
    reportCount: 0,
    response: "Cảm ơn bạn rất nhiều! Chúng tôi rất vui khi khóa học đã giúp ích cho bạn.",
  },
]

export default function ReviewsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedReview, setSelectedReview] = useState(null)
  const [responseText, setResponseText] = useState("")

  const filteredReviews = reviews.filter(
    (review) =>
      review.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.course.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusBadge = (status, reportCount) => {
    if (reportCount > 0) {
      return <Badge variant="destructive">Bị báo cáo ({reportCount})</Badge>
    }

    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800 border-0">Đã duyệt</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 border-0">Chờ duyệt</Badge>
      case "flagged":
        return <Badge variant="destructive">Bị gắn cờ</Badge>
      case "rejected":
        return <Badge variant="secondary">Bị từ chối</Badge>
      default:
        return <Badge variant="outline">Không xác định</Badge>
    }
  }

  const renderStars = (rating) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 transition-colors duration-200 ${
              star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    )
  }

  const handleViewReview = (review) => {
    setSelectedReview(review)
    setResponseText(review.response || "")
  }

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-yellow-600 to-orange-600 rounded-2xl p-8 text-white shadow-xl">
        <h1 className="text-4xl font-bold tracking-tight mb-2">Quản lý Reviews</h1>
        <p className="text-yellow-100 text-lg">Quản lý đánh giá và phản hồi từ học viên</p>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        {[
          {
            title: "Tổng reviews",
            value: reviews.length,
            gradient: "from-yellow-500 to-orange-500",
            bgGradient: "from-yellow-50 to-orange-50",
            icon: Star,
          },
          {
            title: "Đã duyệt",
            value: reviews.filter((r) => r.status === "approved").length,
            gradient: "from-green-500 to-emerald-500",
            bgGradient: "from-green-50 to-emerald-50",
            icon: CheckCircle,
          },
          {
            title: "Chờ duyệt",
            value: reviews.filter((r) => r.status === "pending").length,
            gradient: "from-blue-500 to-cyan-500",
            bgGradient: "from-blue-50 to-cyan-50",
            icon: Clock,
          },
          {
            title: "Bị báo cáo",
            value: reviews.filter((r) => r.reportCount > 0).length,
            gradient: "from-red-500 to-pink-500",
            bgGradient: "from-red-50 to-pink-50",
            icon: Flag,
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
          <CardTitle className="text-xl font-bold text-gray-900">Danh sách Reviews</CardTitle>
          <CardDescription className="text-gray-600">Quản lý và phản hồi các đánh giá từ học viên</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Tìm kiếm reviews..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 bg-gray-50/50 border-gray-200 focus:bg-white focus:border-yellow-300 focus:ring-2 focus:ring-yellow-100 transition-all duration-200 rounded-xl h-12"
              />
            </div>
            <Button variant="outline" className="rounded-xl border-gray-200 hover:bg-gray-50 h-12 px-6">
              <Filter className="w-4 h-4 mr-2" />
              Lọc
            </Button>
          </div>

          <div className="space-y-4">
            {filteredReviews.map((review) => (
              <Card
                key={review.id}
                className="border-0 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white/80 backdrop-blur-sm"
              >
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <Avatar className="w-12 h-12 ring-2 ring-gray-200">
                      <AvatarImage src={review.authorAvatar || "/placeholder.svg"} />
                      <AvatarFallback className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold">
                        {review.author.charAt(0)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-gray-900">{review.author}</p>
                          <p className="text-sm text-gray-500">Khóa học: {review.course}</p>
                        </div>
                        <div className="flex items-center space-x-3">
                          {getStatusBadge(review.status, review.reportCount)}
                          <Badge variant="outline" className="border-gray-300">
                            <Clock className="w-3 h-3 mr-1" />
                            {review.createdAt}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4 mb-3">
                        {renderStars(review.rating)}
                        <span className="text-sm font-medium text-gray-600">({review.rating}/5)</span>
                      </div>

                      <h3 className="font-bold text-lg text-gray-900">{review.title}</h3>
                      <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-xl">{review.content}</p>

                      {review.response && (
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
                          <div className="flex items-center space-x-2 mb-2">
                            <MessageSquare className="w-4 h-4 text-green-600" />
                            <span className="font-semibold text-green-800">Phản hồi từ Instructor</span>
                          </div>
                          <p className="text-green-700">{review.response}</p>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-6 text-sm text-gray-500">
                          <div className="flex items-center space-x-2">
                            <ThumbsUp className="w-4 h-4 text-green-600" />
                            <span>{review.helpful} hữu ích</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <ThumbsDown className="w-4 h-4 text-red-600" />
                            <span>{review.notHelpful} không hữu ích</span>
                          </div>
                          {review.reportCount > 0 && (
                            <div className="flex items-center space-x-2 text-red-600">
                              <Flag className="w-4 h-4" />
                              <span>{review.reportCount} báo cáo</span>
                            </div>
                          )}
                        </div>

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
                              onClick={() => handleViewReview(review)}
                              className="hover:bg-blue-50 rounded-lg m-1"
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              Xem chi tiết
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {review.status === "pending" && (
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
                            <DropdownMenuItem className="text-orange-600 hover:bg-orange-50 rounded-lg m-1">
                              <Flag className="mr-2 h-4 w-4" />
                              Gắn cờ spam
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600 hover:bg-red-50 rounded-lg m-1">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Xóa review
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Review Detail Dialog */}
      <Dialog open={!!selectedReview} onOpenChange={() => setSelectedReview(null)}>
        <DialogContent className="max-w-4xl bg-white/95 backdrop-blur-sm border-0 shadow-2xl rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900">Chi tiết Review</DialogTitle>
            <DialogDescription className="text-gray-600">
              Xem chi tiết và phản hồi review từ {selectedReview?.author}
            </DialogDescription>
          </DialogHeader>

          {selectedReview && (
            <div className="space-y-6">
              <div className="flex items-center space-x-4 p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl">
                <Avatar className="w-16 h-16 ring-4 ring-white shadow-lg">
                  <AvatarImage src={selectedReview.authorAvatar || "/placeholder.svg"} />
                  <AvatarFallback className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold text-xl">
                    {selectedReview.author.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900">{selectedReview.author}</h3>
                  <p className="text-gray-600 mb-2">Khóa học: {selectedReview.course}</p>
                  <div className="flex items-center space-x-4 mb-3">
                    {renderStars(selectedReview.rating)}
                    <span className="text-sm font-medium">({selectedReview.rating}/5)</span>
                  </div>
                  <div className="flex space-x-3">
                    {getStatusBadge(selectedReview.status, selectedReview.reportCount)}
                    <Badge className="bg-yellow-100 text-yellow-800 border-0">{selectedReview.createdAt}</Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-bold text-xl text-gray-900">{selectedReview.title}</h4>
                <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-xl">{selectedReview.content}</p>

                <div className="flex items-center space-x-6 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <ThumbsUp className="w-4 h-4 text-green-600" />
                    <span>{selectedReview.helpful} người thấy hữu ích</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ThumbsDown className="w-4 h-4 text-red-600" />
                    <span>{selectedReview.notHelpful} người thấy không hữu ích</span>
                  </div>
                  {selectedReview.reportCount > 0 && (
                    <div className="flex items-center space-x-2 text-red-600">
                      <Flag className="w-4 h-4" />
                      <span>{selectedReview.reportCount} báo cáo</span>
                    </div>
                  )}
                </div>
              </div>

              {selectedReview.response && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
                  <div className="flex items-center space-x-2 mb-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="font-bold text-green-800">Phản hồi từ Instructor</span>
                  </div>
                  <p className="text-green-700 leading-relaxed">{selectedReview.response}</p>
                </div>
              )}

              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-900">
                  {selectedReview.response ? "Cập nhật phản hồi" : "Phản hồi với tư cách Admin"}
                </label>
                <Textarea
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  placeholder="Nhập phản hồi của bạn..."
                  rows={4}
                  className="bg-gray-50/50 border-gray-200 focus:bg-white focus:border-yellow-300 focus:ring-2 focus:ring-yellow-100 transition-all duration-200 rounded-xl"
                />
              </div>
            </div>
          )}

          <DialogFooter className="space-x-3">
            <Button variant="outline" onClick={() => setSelectedReview(null)} className="rounded-xl">
              Đóng
            </Button>
            {selectedReview?.status === "pending" && (
              <>
                <Button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white border-0 rounded-xl">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Phê duyệt
                </Button>
                <Button variant="destructive" className="rounded-xl">
                  <XCircle className="w-4 h-4 mr-2" />
                  Từ chối
                </Button>
              </>
            )}
            <Button className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white border-0 rounded-xl shadow-lg">
              {selectedReview?.response ? "Cập nhật phản hồi" : "Gửi phản hồi"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
