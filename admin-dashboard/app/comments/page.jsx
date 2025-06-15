"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, MoreHorizontal, Filter, Eye, Flag, Trash2, CheckCircle, XCircle } from "lucide-react"

const comments = [
  {
    id: 1,
    content: "Bài viết rất hay và bổ ích! Cảm ơn tác giả đã chia sẻ.",
    author: "Nguyễn Văn A",
    authorAvatar: "/placeholder-user.jpg",
    postTitle: "Hướng dẫn học React từ cơ bản đến nâng cao",
    status: "approved",
    likes: 12,
    replies: 3,
    createdAt: "2024-03-15 10:30",
    reportCount: 0,
  },
  {
    id: 2,
    content: "Mình không đồng ý với quan điểm này. Theo mình thì...",
    author: "Trần Thị B",
    authorAvatar: "/placeholder-user.jpg",
    postTitle: "10 mẹo để tối ưu hóa hiệu suất website",
    status: "pending",
    likes: 5,
    replies: 1,
    createdAt: "2024-03-14 15:45",
    reportCount: 0,
  },
  {
    id: 3,
    content: "Spam content here!!! Click this link to get free money!!!",
    author: "Lê Văn C",
    authorAvatar: "/placeholder-user.jpg",
    postTitle: "Xu hướng thiết kế UI/UX năm 2024",
    status: "flagged",
    likes: 0,
    replies: 0,
    createdAt: "2024-03-13 09:15",
    reportCount: 5,
  },
  {
    id: 4,
    content: "Cảm ơn bạn đã chia sẻ kiến thức hữu ích này!",
    author: "Phạm Thị D",
    authorAvatar: "/placeholder-user.jpg",
    postTitle: "Cách sử dụng TypeScript hiệu quả",
    status: "approved",
    likes: 8,
    replies: 2,
    createdAt: "2024-03-12 14:20",
    reportCount: 0,
  },
]

export default function CommentsPage() {
  const [searchTerm, setSearchTerm] = useState("")

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
        return <Badge className="bg-green-100 text-green-800">Đã duyệt</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Chờ duyệt</Badge>
      case "flagged":
        return <Badge variant="destructive">Bị gắn cờ</Badge>
      case "rejected":
        return <Badge variant="secondary">Bị từ chối</Badge>
      default:
        return <Badge variant="outline">Không xác định</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản lý Comments</h1>
          <p className="text-muted-foreground">Kiểm duyệt và quản lý bình luận trong hệ thống</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng comments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{comments.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đã duyệt</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{comments.filter((c) => c.status === "approved").length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chờ duyệt</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{comments.filter((c) => c.status === "pending").length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bị báo cáo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{comments.filter((c) => c.reportCount > 0).length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách Comments</CardTitle>
          <CardDescription>Kiểm duyệt và quản lý các bình luận</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Tìm kiếm comments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Lọc
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nội dung</TableHead>
                <TableHead>Tác giả</TableHead>
                <TableHead>Bài viết</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Likes</TableHead>
                <TableHead>Replies</TableHead>
                <TableHead>Thời gian</TableHead>
                <TableHead className="text-right">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredComments.map((comment) => (
                <TableRow key={comment.id}>
                  <TableCell className="font-medium">
                    <div className="max-w-xs">
                      <p className="truncate">{comment.content}</p>
                      <div className="text-sm text-muted-foreground">ID: {comment.id}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Avatar className="w-6 h-6">
                        <AvatarImage src={comment.authorAvatar || "/placeholder.svg"} />
                        <AvatarFallback>{comment.author.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{comment.author}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-xs">
                      <p className="text-sm truncate">{comment.postTitle}</p>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(comment.status, comment.reportCount)}</TableCell>
                  <TableCell>{comment.likes}</TableCell>
                  <TableCell>{comment.replies}</TableCell>
                  <TableCell>{comment.createdAt}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          Xem chi tiết
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {comment.status === "pending" && (
                          <>
                            <DropdownMenuItem className="text-green-600">
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Phê duyệt
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <XCircle className="mr-2 h-4 w-4" />
                              Từ chối
                            </DropdownMenuItem>
                          </>
                        )}
                        <DropdownMenuItem className="text-orange-600">
                          <Flag className="mr-2 h-4 w-4" />
                          Gắn cờ spam
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Xóa comment
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
