import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Separator } from "./ui/separator"
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  ThumbsUp, 
  ThumbsDown, 
  Reply, 
  Trash2, 
  Eye,
  MessageSquare,
  User,
  Calendar,
  Flag
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"

interface Comment {
  id: string
  user: {
    name: string
    email: string
    avatar?: string
  }
  content: string
  course: string
  lesson: string
  rating: number
  status: "pending" | "approved" | "rejected"
  createdAt: string
  likes: number
  dislikes: number
  replies: number
  isSpam: boolean
}

const mockComments: Comment[] = [
  {
    id: "1",
    user: {
      name: "John Smith",
      email: "johnsmith@email.com",
      avatar: "/avatars/user1.jpg"
    },
    content: "Great lesson and easy to understand. The instructor explains very clearly!",
    course: "TOEIC Reading",
    lesson: "Lesson 1: Reading Comprehension",
    rating: 5,
    status: "approved",
    createdAt: "2024-01-15T10:30:00Z",
    likes: 12,
    dislikes: 0,
    replies: 3,
    isSpam: false
  },
  {
    id: "2",
    user: {
      name: "Jane Doe",
      email: "janedoe@email.com"
    },
    content: "Can you slow down a bit? I find it a bit fast.",
    course: "TOEIC Listening",
    lesson: "Lesson 3: Listening Practice",
    rating: 4,
    status: "pending",
    createdAt: "2024-01-14T15:45:00Z",
    likes: 5,
    dislikes: 1,
    replies: 1,
    isSpam: false
  },
  {
    id: "3",
    user: {
      name: "Mike Johnson",
      email: "mikejohnson@email.com"
    },
    content: "Spam comment for testing purposes",
    course: "TOEIC Grammar",
    lesson: "Lesson 2: Grammar Review",
    rating: 1,
    status: "rejected",
    createdAt: "2024-01-13T09:20:00Z",
    likes: 0,
    dislikes: 8,
    replies: 0,
    isSpam: true
  },
  {
    id: "4",
    user: {
      name: "Sarah Wilson",
      email: "sarahwilson@email.com"
    },
    content: "Very useful materials, thank you teachers for sharing!",
    course: "TOEIC Writing",
    lesson: "Lesson 4: Essay Writing",
    rating: 5,
    status: "approved",
    createdAt: "2024-01-12T14:15:00Z",
    likes: 18,
    dislikes: 0,
    replies: 2,
    isSpam: false
  },
  {
    id: "5",
    user: {
      name: "David Brown",
      email: "davidbrown@email.com"
    },
    content: "The exercises are too difficult, can you explain more?",
    course: "TOEIC Speaking",
    lesson: "Lesson 5: Speaking Practice",
    rating: 3,
    status: "pending",
    createdAt: "2024-01-11T11:30:00Z",
    likes: 7,
    dislikes: 2,
    replies: 4,
    isSpam: false
  }
]

export function CommentsPage() {
  const [comments, setComments] = useState<Comment[]>(mockComments)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const filteredComments = comments.filter(comment => {
    const matchesSearch = comment.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         comment.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         comment.course.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || comment.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Approved</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>
      case "rejected":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Rejected</Badge>
      default:
        return null
    }
  }

  const handleStatusChange = (commentId: string, newStatus: string) => {
    setComments(comments.map(comment => 
      comment.id === commentId 
        ? { ...comment, status: newStatus as "pending" | "approved" | "rejected" }
        : comment
    ))
  }

  const handleDeleteComment = (commentId: string) => {
    setComments(comments.filter(comment => comment.id !== commentId))
  }

  const stats = {
    total: comments.length,
    pending: comments.filter(c => c.status === "pending").length,
    approved: comments.filter(c => c.status === "approved").length,
    rejected: comments.filter(c => c.status === "rejected").length,
    spam: comments.filter(c => c.isSpam).length
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-black">Comment Management</h1>
          <p className="text-black">
            Monitor and moderate all comments on Toeic.com
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Flag className="h-4 w-4 mr-2" />
            Report Spam
          </Button>
          <Button size="sm">
            <MessageSquare className="h-4 w-4 mr-2" />
            All Comments
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Comments</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Badge className="bg-yellow-100 text-yellow-800">P</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <Badge className="bg-green-100 text-green-800">A</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.approved}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <Badge className="bg-red-100 text-red-800">R</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.rejected}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Spam</CardTitle>
            <Flag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.spam}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters and Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search comments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={statusFilter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("all")}
              >
                All
              </Button>
              <Button
                variant={statusFilter === "pending" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("pending")}
              >
                Pending
              </Button>
              <Button
                variant={statusFilter === "approved" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("approved")}
              >
                Approved
              </Button>
              <Button
                variant={statusFilter === "rejected" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("rejected")}
              >
                Rejected
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comments List */}
      <div className="space-y-4">
        {filteredComments.map((comment) => (
          <Card key={comment.id} className={comment.isSpam ? "border-red-200 bg-red-50" : ""}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={comment.user.avatar} />
                    <AvatarFallback>
                      {comment.user.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{comment.user.name}</h4>
                      <span className="text-sm text-muted-foreground">{comment.user.email}</span>
                      {getStatusBadge(comment.status)}
                      {comment.isSpam && (
                        <Badge variant="destructive" className="text-xs">SPAM</Badge>
                      )}
                    </div>
                    
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">Course:</span> {comment.course} • 
                      <span className="font-medium ml-1">Lesson:</span> {comment.lesson}
                    </p>
                    
                    <p className="text-sm leading-relaxed">{comment.content}</p>
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(comment.createdAt).toLocaleDateString('en-US')}
                      </div>
                      <div className="flex items-center gap-1">
                        <ThumbsUp className="h-3 w-3" />
                        {comment.likes}
                      </div>
                      <div className="flex items-center gap-1">
                        <ThumbsDown className="h-3 w-3" />
                        {comment.dislikes}
                      </div>
                      <div className="flex items-center gap-1">
                        <Reply className="h-3 w-3" />
                        {comment.replies} replies
                      </div>
                      <div className="flex items-center gap-1">
                        <span>★</span>
                        {comment.rating}/5
                      </div>
                    </div>
                  </div>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleStatusChange(comment.id, "approved")}>
                      <Eye className="h-4 w-4 mr-2" />
                      Approve
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusChange(comment.id, "rejected")}>
                      <ThumbsDown className="h-4 w-4 mr-2" />
                      Reject
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Reply className="h-4 w-4 mr-2" />
                      Reply
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleDeleteComment(comment.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {filteredComments.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No comments found</h3>
              <p className="text-muted-foreground">
                No comments match the current filters.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
} 