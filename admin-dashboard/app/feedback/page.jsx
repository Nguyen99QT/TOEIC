"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Star, MessageSquare, Clock, CheckCircle, Filter } from "lucide-react"

const feedbacks = [
  {
    id: 1,
    title: "Giao diện rất đẹp và dễ sử dụng",
    content:
      "Tôi rất thích giao diện mới của website. Mọi thứ đều rất trực quan và dễ tìm kiếm. Hy vọng team sẽ tiếp tục phát triển thêm nhiều tính năng hay ho khác.",
    author: "Nguyễn Văn A",
    authorEmail: "nguyenvana@example.com",
    authorAvatar: "/placeholder-user.jpg",
    rating: 5,
    category: "UI/UX",
    status: "new",
    createdAt: "2024-03-15 10:30",
    response: null,
  },
  {
    id: 2,
    title: "Tốc độ tải trang hơi chậm",
    content:
      "Website khá hay nhưng tốc độ tải trang có vẻ hơi chậm, đặc biệt là khi tải hình ảnh. Mong team có thể tối ưu hóa để trải nghiệm tốt hơn.",
    author: "Trần Thị B",
    authorEmail: "tranthib@example.com",
    authorAvatar: "/placeholder-user.jpg",
    rating: 3,
    category: "Performance",
    status: "in_progress",
    createdAt: "2024-03-14 15:45",
    response: "Cảm ơn bạn đã góp ý. Chúng tôi đang làm việc để tối ưu hóa tốc độ tải trang.",
  },
  {
    id: 3,
    title: "Tính năng tìm kiếm cần cải thiện",
    content:
      "Tính năng tìm kiếm không hoạt động tốt lắm. Nhiều khi tìm không ra kết quả mặc dù biết chắc có nội dung đó trên website.",
    author: "Lê Văn C",
    authorEmail: "levanc@example.com",
    authorAvatar: "/placeholder-user.jpg",
    rating: 2,
    category: "Feature",
    status: "resolved",
    createdAt: "2024-03-13 09:15",
    response: "Chúng tôi đã cập nhật thuật toán tìm kiếm. Vui lòng thử lại và cho chúng tôi biết kết quả.",
  },
  {
    id: 4,
    title: "Rất hài lòng với dịch vụ",
    content: "Dịch vụ tuyệt vời, hỗ trợ khách hàng rất nhiệt tình. Tôi sẽ giới thiệu cho bạn bè sử dụng.",
    author: "Phạm Thị D",
    authorEmail: "phamthid@example.com",
    authorAvatar: "/placeholder-user.jpg",
    rating: 5,
    category: "Service",
    status: "resolved",
    createdAt: "2024-03-12 14:20",
    response: "Cảm ơn bạn rất nhiều! Chúng tôi rất vui khi được phục vụ bạn.",
  },
]

export default function FeedbackPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFeedback, setSelectedFeedback] = useState(null)
  const [responseText, setResponseText] = useState("")

  const filteredFeedbacks = feedbacks.filter(
    (feedback) =>
      feedback.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusBadge = (status) => {
    const statusConfig = {
      new: { label: "Mới", className: "bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-sm" },
      in_progress: {
        label: "Đang xử lý",
        className: "bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 shadow-sm",
      },
      resolved: {
        label: "Đã giải quyết",
        className: "bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-sm",
      },
      closed: {
        label: "Đã đóng",
        className: "bg-gradient-to-r from-gray-500 to-slate-500 text-white border-0 shadow-sm",
      },
    }
    const config = statusConfig[status] || { label: "Không xác định", className: "bg-gray-100 text-gray-800" }
    return <Badge className={config.className}>{config.label}</Badge>
  }

  const getCategoryBadge = (category) => {
    const colors = {
      "UI/UX": "bg-gradient-to-r from-purple-500 to-pink-500 text-white",
      Performance: "bg-gradient-to-r from-orange-500 to-red-500 text-white",
      Feature: "bg-gradient-to-r from-blue-500 to-cyan-500 text-white",
      Service: "bg-gradient-to-r from-green-500 to-emerald-500 text-white",
      Bug: "bg-gradient-to-r from-red-500 to-pink-500 text-white",
    }
    return <Badge className={`${colors[category] || "bg-gray-100 text-gray-800"} border-0 shadow-sm`}>{category}</Badge>
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

  const handleViewFeedback = (feedback) => {
    setSelectedFeedback(feedback)
    setResponseText(feedback.response || "")
  }

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white shadow-xl">
        <h1 className="text-4xl font-bold tracking-tight mb-2">Quản lý Feedback</h1>
        <p className="text-purple-100 text-lg">Quản lý phản hồi và góp ý từ người dùng</p>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        {[
          {
            title: "Tổng feedback",
            value: feedbacks.length,
            gradient: "from-blue-500 to-cyan-500",
            bgGradient: "from-blue-50 to-cyan-50",
          },
          {
            title: "Mới",
            value: feedbacks.filter((f) => f.status === "new").length,
            gradient: "from-green-500 to-emerald-500",
            bgGradient: "from-green-50 to-emerald-50",
          },
          {
            title: "Đang xử lý",
            value: feedbacks.filter((f) => f.status === "in_progress").length,
            gradient: "from-yellow-500 to-orange-500",
            bgGradient: "from-yellow-50 to-orange-50",
          },
          {
            title: "Đã giải quyết",
            value: feedbacks.filter((f) => f.status === "resolved").length,
            gradient: "from-purple-500 to-pink-500",
            bgGradient: "from-purple-50 to-pink-50",
          },
        ].map((stat, index) => (
          <Card
            key={index}
            className={`bg-gradient-to-br ${stat.bgGradient} border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-gray-700">{stat.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-t-xl">
          <CardTitle className="text-xl font-bold text-gray-900">Danh sách Feedback</CardTitle>
          <CardDescription className="text-gray-600">Quản lý và phản hồi các góp ý từ người dùng</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Tìm kiếm feedback..."
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

          <div className="space-y-4">
            {filteredFeedbacks.map((feedback) => (
              <Card
                key={feedback.id}
                className="border-0 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white/80 backdrop-blur-sm"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-4">
                        <Avatar className="w-12 h-12 ring-2 ring-gray-200">
                          <AvatarImage src={feedback.authorAvatar || "/placeholder.svg"} />
                          <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold">
                            {feedback.author.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">{feedback.author}</p>
                          <p className="text-sm text-gray-500">{feedback.authorEmail}</p>
                        </div>
                        <div className="flex items-center space-x-3">
                          {renderStars(feedback.rating)}
                          <span className="text-sm font-medium text-gray-600">({feedback.rating}/5)</span>
                        </div>
                      </div>

                      <h3 className="font-bold text-lg text-gray-900 mb-3">{feedback.title}</h3>
                      <p className="text-gray-700 mb-4 leading-relaxed">{feedback.content}</p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {getStatusBadge(feedback.status)}
                          {getCategoryBadge(feedback.category)}
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4" />
                            <span>{feedback.createdAt}</span>
                          </div>
                          {feedback.response && (
                            <div className="flex items-center space-x-2 text-green-600">
                              <MessageSquare className="w-4 h-4" />
                              <span className="font-medium">Đã phản hồi</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      onClick={() => handleViewFeedback(feedback)}
                      className="ml-6 rounded-xl border-gray-200 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:border-purple-200 transition-all duration-200"
                    >
                      Xem chi tiết
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selectedFeedback} onOpenChange={() => setSelectedFeedback(null)}>
        <DialogContent className="max-w-2xl bg-white/95 backdrop-blur-sm border-0 shadow-2xl rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900">Chi tiết Feedback</DialogTitle>
            <DialogDescription className="text-gray-600">Xem và phản hồi feedback từ người dùng</DialogDescription>
          </DialogHeader>

          {selectedFeedback && (
            <div className="space-y-6">
              <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl">
                <Avatar className="w-16 h-16 ring-2 ring-gray-200">
                  <AvatarImage src={selectedFeedback.authorAvatar || "/placeholder.svg"} />
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold text-lg">
                    {selectedFeedback.author.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-900">{selectedFeedback.author}</h3>
                  <p className="text-gray-600">{selectedFeedback.authorEmail}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    {renderStars(selectedFeedback.rating)}
                    <span className="text-sm font-medium">({selectedFeedback.rating}/5)</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-bold text-xl text-gray-900">{selectedFeedback.title}</h4>
                <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-xl">{selectedFeedback.content}</p>

                <div className="flex items-center space-x-3">
                  {getStatusBadge(selectedFeedback.status)}
                  {getCategoryBadge(selectedFeedback.category)}
                  <Badge variant="outline" className="border-gray-300">
                    {selectedFeedback.createdAt}
                  </Badge>
                </div>
              </div>

              {selectedFeedback.response && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
                  <div className="flex items-center space-x-2 mb-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="font-bold text-green-800">Phản hồi của Admin</span>
                  </div>
                  <p className="text-green-700 leading-relaxed">{selectedFeedback.response}</p>
                </div>
              )}

              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-900">
                  {selectedFeedback.response ? "Cập nhật phản hồi" : "Phản hồi"}
                </label>
                <Textarea
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  placeholder="Nhập phản hồi của bạn..."
                  rows={4}
                  className="bg-gray-50/50 border-gray-200 focus:bg-white focus:border-purple-300 focus:ring-2 focus:ring-purple-100 transition-all duration-200 rounded-xl"
                />
              </div>
            </div>
          )}

          <DialogFooter className="space-x-3">
            <Button variant="outline" onClick={() => setSelectedFeedback(null)} className="rounded-xl">
              Đóng
            </Button>
            <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 rounded-xl shadow-lg">
              {selectedFeedback?.response ? "Cập nhật phản hồi" : "Gửi phản hồi"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
