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
  MessageSquare,
  Reply,
  ChevronDown,
  ChevronRight,
  Clock,
  Heart,
} from "lucide-react"

const comments = [
  {
    id: 1,
    content: "Bài viết rất hay và bổ ích! Cảm ơn tác giả đã chia sẻ kiến thức quý báu này.",
    author: "Nguyễn Văn A",
    authorAvatar: "/placeholder-user.jpg",
    postTitle: "Hướng dẫn học React từ cơ bản đến nâng cao",
    status: "approved",
    likes: 12,
    replies: [
      {
        id: 11,
        content: "Mình cũng đồng ý với bạn. Bài viết này thực sự hữu ích cho người mới bắt đầu.",
        author: "Trần Thị B",
        authorAvatar: "/placeholder-user.jpg",
        status: "approved",
        likes: 5,
        createdAt: "2024-03-15 11:15",
        reportCount: 0,
      },
      {
        id: 12,
        content: "Có thể bạn chia sẻ thêm về hooks không?",
        author: "Lê Văn C",
        authorAvatar: "/placeholder-user.jpg",
        status: "approved",
        likes: 3,
        createdAt: "2024-03-15 12:30",
        reportCount: 0,
      },
    ],
    createdAt: "2024-03-15 10:30",
    reportCount: 0,
  },
  {
    id: 2,
    content: "Mình không đồng ý với quan điểm này. Theo mình thì nên sử dụng cách tiếp cận khác...",
    author: "Trần Thị B",
    authorAvatar: "/placeholder-user.jpg",
    postTitle: "10 mẹo để tối ưu hóa hiệu suất website",
    status: "pending",
    likes: 5,
    replies: [
      {
        id: 21,
        content: "Bạn có thể giải thích rõ hơn về cách tiếp cận mà bạn đề xuất không?",
        author: "Phạm Thị D",
        authorAvatar: "/placeholder-user.jpg",
        status: "approved",
        likes: 2,
        createdAt: "2024-03-14 16:20",
        reportCount: 0,
      },
    ],
    createdAt: "2024-03-14 15:45",
    reportCount: 0,
  },
  {
    id: 3,
    content: "Spam content here!!! Click this link to get free money!!! 🎁💰",
    author: "Lê Văn C",
    authorAvatar: "/placeholder-user.jpg",
    postTitle: "Xu hướng thiết kế UI/UX năm 2024",
    status: "flagged",
    likes: 0,
    replies: [],
    createdAt: "2024-03-13 09:15",
    reportCount: 5,
  },
  {
    id: 4,
    content: "Cảm ơn bạn đã chia sẻ kiến thức hữu ích này! Mình đã áp dụng và thấy hiệu quả rõ rệt.",
    author: "Phạm Thị D",
    authorAvatar: "/placeholder-user.jpg",
    postTitle: "Cách sử dụng TypeScript hiệu quả",
    status: "approved",
    likes: 8,
    replies: [
      {
        id: 41,
        content: "Bạn có thể chia sẻ cụ thể đã áp dụng như thế nào không?",
        author: "Nguyễn Văn A",
        authorAvatar: "/placeholder-user.jpg",
        status: "approved",
        likes: 4,
        createdAt: "2024-03-12 15:10",
        reportCount: 0,
      },
      {
        id: 42,
        content: "Mình cũng muốn biết thêm chi tiết về implementation.",
        author: "Hoàng Văn E",
        authorAvatar: "/placeholder-user.jpg",
        status: "pending",
        likes: 1,
        createdAt: "2024-03-12 16:45",
        reportCount: 0,
      },
    ],
    createdAt: "2024-03-12 14:20",
    reportCount: 0,
  },
]

export default function CommentsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedComment, setSelectedComment] = useState(null)
  const [expandedComments, setExpandedComments] = useState(new Set())
  const [replyText, setReplyText] = useState("")

  const filteredComments = comments.filter(
    (comment) =>
      comment.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.postTitle.toLowerCase().includes(searchTerm.toLowerCase()),
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

  const toggleExpanded = (commentId) => {
    const newExpanded = new Set(expandedComments)
    if (newExpanded.has(commentId)) {
      newExpanded.delete(commentId)
    } else {
      newExpanded.add(commentId)
    }
    setExpandedComments(newExpanded)
  }

  const getTotalReplies = (comment) => {
    return comment.replies ? comment.replies.length : 0
  }

  const getAllComments = () => {
    let allComments = []
    comments.forEach((comment) => {
      allComments.push(comment)
      if (comment.replies) {
        allComments = allComments.concat(comment.replies)
      }
    })
    return allComments
  }

  const allComments = getAllComments()

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-8 text-white shadow-xl">
        <h1 className="text-4xl font-bold tracking-tight mb-2">Quản lý Comments</h1>
        <p className="text-emerald-100 text-lg">Kiểm duyệt và quản lý bình luận trong hệ thống</p>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        {[
          {
            title: "Tổng comments",
            value: allComments.length,
            gradient: "from-emerald-500 to-teal-500",
            bgGradient: "from-emerald-50 to-teal-50",
            icon: MessageSquare,
          },
          {
            title: "Đã duyệt",
            value: allComments.filter((c) => c.status === "approved").length,
            gradient: "from-green-500 to-emerald-500",
            bgGradient: "from-green-50 to-emerald-50",
            icon: CheckCircle,
          },
          {
            title: "Chờ duyệt",
            value: allComments.filter((c) => c.status === "pending").length,
            gradient: "from-yellow-500 to-orange-500",
            bgGradient: "from-yellow-50 to-orange-50",
            icon: Clock,
          },
          {
            title: "Bị báo cáo",
            value: allComments.filter((c) => c.reportCount > 0).length,
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
          <CardTitle className="text-xl font-bold text-gray-900">Danh sách Comments</CardTitle>
          <CardDescription className="text-gray-600">Kiểm duyệt và quản lý các bình luận</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Tìm kiếm comments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 bg-gray-50/50 border-gray-200 focus:bg-white focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 transition-all duration-200 rounded-xl h-12"
              />
            </div>
            <Button variant="outline" className="rounded-xl border-gray-200 hover:bg-gray-50 h-12 px-6">
              <Filter className="w-4 h-4 mr-2" />
              Lọc
            </Button>
          </div>

          <div className="space-y-4">
            {filteredComments.map((comment) => (
              <Card
                key={comment.id}
                className="border-0 shadow-md hover:shadow-lg transition-all duration-300 bg-white/80 backdrop-blur-sm"
              >
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Main Comment */}
                    <div className="flex items-start space-x-4">
                      <Avatar className="w-12 h-12 ring-2 ring-gray-200">
                        <AvatarImage src={comment.authorAvatar || "/placeholder.svg"} />
                        <AvatarFallback className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold">
                          {comment.author.charAt(0)}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-gray-900">{comment.author}</p>
                            <p className="text-sm text-gray-500">Bài viết: {comment.postTitle}</p>
                          </div>
                          <div className="flex items-center space-x-3">
                            {getStatusBadge(comment.status, comment.reportCount)}
                            <Badge variant="outline" className="border-gray-300">
                              <Clock className="w-3 h-3 mr-1" />
                              {comment.createdAt}
                            </Badge>
                          </div>
                        </div>

                        <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-xl">{comment.content}</p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Heart className="w-4 h-4" />
                              <span>{comment.likes} likes</span>
                            </div>
                            {getTotalReplies(comment) > 0 && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleExpanded(comment.id)}
                                className="flex items-center space-x-1 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg"
                              >
                                {expandedComments.has(comment.id) ? (
                                  <ChevronDown className="w-4 h-4" />
                                ) : (
                                  <ChevronRight className="w-4 h-4" />
                                )}
                                <MessageSquare className="w-4 h-4" />
                                <span>{getTotalReplies(comment)} replies</span>
                              </Button>
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
                                onClick={() => setSelectedComment(comment)}
                                className="hover:bg-blue-50 rounded-lg m-1"
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                Xem chi tiết
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {comment.status === "pending" && (
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
                                Xóa comment
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>

                    {/* Replies */}
                    {expandedComments.has(comment.id) && comment.replies && comment.replies.length > 0 && (
                      <div className="ml-16 space-y-4 border-l-2 border-emerald-100 pl-6">
                        {comment.replies.map((reply) => (
                          <div key={reply.id} className="flex items-start space-x-4">
                            <Avatar className="w-10 h-10 ring-2 ring-gray-200">
                              <AvatarImage src={reply.authorAvatar || "/placeholder.svg"} />
                              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold">
                                {reply.author.charAt(0)}
                              </AvatarFallback>
                            </Avatar>

                            <div className="flex-1 space-y-2">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium text-gray-900">{reply.author}</p>
                                  <p className="text-xs text-gray-500">{reply.createdAt}</p>
                                </div>
                                <div className="flex items-center space-x-2">
                                  {getStatusBadge(reply.status, reply.reportCount)}
                                </div>
                              </div>

                              <p className="text-gray-700 bg-blue-50 p-3 rounded-lg text-sm">{reply.content}</p>

                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3 text-xs text-gray-500">
                                  <div className="flex items-center space-x-1">
                                    <Heart className="w-3 h-3" />
                                    <span>{reply.likes} likes</span>
                                  </div>
                                </div>

                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0 rounded">
                                      <MoreHorizontal className="h-3 w-3" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent
                                    align="end"
                                    className="bg-white/95 backdrop-blur-sm border-gray-200/50 shadow-xl rounded-xl"
                                  >
                                    <DropdownMenuLabel className="text-xs">Hành động</DropdownMenuLabel>
                                    {reply.status === "pending" && (
                                      <>
                                        <DropdownMenuItem className="text-green-600 hover:bg-green-50 rounded-lg m-1 text-xs">
                                          <CheckCircle className="mr-2 h-3 w-3" />
                                          Phê duyệt
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="text-red-600 hover:bg-red-50 rounded-lg m-1 text-xs">
                                          <XCircle className="mr-2 h-3 w-3" />
                                          Từ chối
                                        </DropdownMenuItem>
                                      </>
                                    )}
                                    <DropdownMenuItem className="text-orange-600 hover:bg-orange-50 rounded-lg m-1 text-xs">
                                      <Flag className="mr-2 h-3 w-3" />
                                      Gắn cờ
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="text-red-600 hover:bg-red-50 rounded-lg m-1 text-xs">
                                      <Trash2 className="mr-2 h-3 w-3" />
                                      Xóa
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Comment Detail Dialog */}
      <Dialog open={!!selectedComment} onOpenChange={() => setSelectedComment(null)}>
        <DialogContent className="max-w-4xl bg-white/95 backdrop-blur-sm border-0 shadow-2xl rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900">Chi tiết Comment</DialogTitle>
            <DialogDescription className="text-gray-600">
              Xem chi tiết và quản lý comment từ {selectedComment?.author}
            </DialogDescription>
          </DialogHeader>

          {selectedComment && (
            <div className="space-y-6 max-h-[70vh] overflow-y-auto">
              {/* Main Comment Detail */}
              <div className="space-y-4 p-6 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl">
                <div className="flex items-center space-x-4">
                  <Avatar className="w-16 h-16 ring-4 ring-white shadow-lg">
                    <AvatarImage src={selectedComment.authorAvatar || "/placeholder.svg"} />
                    <AvatarFallback className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-xl">
                      {selectedComment.author.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900">{selectedComment.author}</h3>
                    <p className="text-gray-600 mb-2">Bài viết: {selectedComment.postTitle}</p>
                    <div className="flex space-x-3">
                      {getStatusBadge(selectedComment.status, selectedComment.reportCount)}
                      <Badge className="bg-emerald-100 text-emerald-800 border-0">{selectedComment.createdAt}</Badge>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-sm">
                  <p className="text-gray-700 leading-relaxed">{selectedComment.content}</p>
                </div>

                <div className="flex items-center space-x-6 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <Heart className="w-4 h-4" />
                    <span>{selectedComment.likes} likes</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="w-4 h-4" />
                    <span>{getTotalReplies(selectedComment)} replies</span>
                  </div>
                  {selectedComment.reportCount > 0 && (
                    <div className="flex items-center space-x-2 text-red-600">
                      <Flag className="w-4 h-4" />
                      <span>{selectedComment.reportCount} báo cáo</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Replies Section */}
              {selectedComment.replies && selectedComment.replies.length > 0 && (
                <div className="space-y-4">
                  <h4 className="text-lg font-bold text-gray-900 flex items-center space-x-2">
                    <Reply className="w-5 h-5" />
                    <span>Replies ({selectedComment.replies.length})</span>
                  </h4>

                  <div className="space-y-4">
                    {selectedComment.replies.map((reply) => (
                      <div key={reply.id} className="bg-blue-50 p-4 rounded-xl border-l-4 border-blue-300">
                        <div className="flex items-start space-x-4">
                          <Avatar className="w-12 h-12 ring-2 ring-white">
                            <AvatarImage src={reply.authorAvatar || "/placeholder.svg"} />
                            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold">
                              {reply.author.charAt(0)}
                            </AvatarFallback>
                          </Avatar>

                          <div className="flex-1 space-y-2">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-semibold text-gray-900">{reply.author}</p>
                                <p className="text-sm text-gray-500">{reply.createdAt}</p>
                              </div>
                              {getStatusBadge(reply.status, reply.reportCount)}
                            </div>

                            <p className="text-gray-700 bg-white p-3 rounded-lg">{reply.content}</p>

                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <div className="flex items-center space-x-1">
                                <Heart className="w-4 h-4" />
                                <span>{reply.likes} likes</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Admin Reply Section */}
              <div className="space-y-4 p-4 bg-gray-50 rounded-xl">
                <h4 className="text-lg font-bold text-gray-900">Trả lời với tư cách Admin</h4>
                <Textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Nhập phản hồi của bạn..."
                  rows={3}
                  className="bg-white border-gray-200 focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 transition-all duration-200 rounded-xl"
                />
                <Button className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white border-0 rounded-xl">
                  <Reply className="w-4 h-4 mr-2" />
                  Gửi phản hồi
                </Button>
              </div>
            </div>
          )}

          <DialogFooter className="space-x-3">
            <Button variant="outline" onClick={() => setSelectedComment(null)} className="rounded-xl">
              Đóng
            </Button>
            {selectedComment?.status === "pending" && (
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
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
