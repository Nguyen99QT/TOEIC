import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Badge } from "./ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { Search, Filter, MoreHorizontal, Eye, Edit, Trash2, Users, Star } from "lucide-react"

const courses = [
  {
    id: 1,
    title: "React Advanced Patterns",
    instructor: "John Smith",
    category: "Frontend",
    students: 234,
    rating: 4.8,
    price: "$1,200",
    status: "active",
    createdAt: "2024-01-15",
    thumbnail: "/placeholder.svg?height=60&width=80",
  },
  {
    id: 2,
    title: "Node.js Backend Development",
    instructor: "Jane Doe",
    category: "Backend",
    students: 189,
    rating: 4.6,
    price: "$1,500",
    status: "draft",
    createdAt: "2024-01-10",
    thumbnail: "/placeholder.svg?height=60&width=80",
  },
  {
    id: 3,
    title: "UI/UX Design Fundamentals",
    instructor: "Mike Johnson",
    category: "Design",
    students: 456,
    rating: 4.9,
    price: "$900",
    status: "active",
    createdAt: "2024-01-08",
    thumbnail: "/placeholder.svg?height=60&width=80",
  },
  {
    id: 4,
    title: "Python Data Science",
    instructor: "Sarah Wilson",
    category: "Data Science",
    students: 123,
    rating: 4.7,
    price: "$1,800",
    status: "review",
    createdAt: "2024-01-05",
    thumbnail: "/placeholder.svg?height=60&width=80",
  },
]

export function CoursesPage() {
  const [searchTerm, setSearchTerm] = useState("")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-black">Course Management</h1>
          <p className="text-black">Manage all courses on Toeic.com</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-gradient-to-br from-study-500 to-study-600 text-white shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-white/80">
              <span className="text-white font-medium">+3</span> new courses
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-success-500 to-success-600 text-white shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">124</div>
            <p className="text-xs text-white/80">79% of total courses</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-warning-500 to-warning-600 text-white shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
            <p className="text-xs text-white/80">Need review</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-info-500 to-info-600 text-white shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Draft</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">14</div>
            <p className="text-xs text-white/80">Not completed</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="shadow-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Course List</CardTitle>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-80 focus-visible:ring-study-500"
                />
              </div>
              <Button variant="outline" className="border-study-200 hover:bg-study-50 hover:text-study-600">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Course</TableHead>
                <TableHead>Instructor</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.map((course) => (
                <TableRow key={course.id} className="hover:bg-muted/30">
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="h-12 w-16 rounded overflow-hidden border border-muted">
                        <img
                          src={course.thumbnail || "/placeholder.svg"}
                          alt={course.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-medium text-study-700">{course.title}</div>
                        <div className="text-sm text-muted-foreground">Created: {course.createdAt}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-8 w-8 border border-muted">
                        <AvatarImage src="/placeholder-user.jpg" />
                        <AvatarFallback className="bg-study-100 text-study-700">
                          {course.instructor.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{course.instructor}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-study-100 text-study-700 hover:bg-study-200">
                      {course.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4 text-study-500" />
                      <span>{course.students}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-warning-400 text-warning-400" />
                      <span>{course.rating}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-success-600">{course.price}</TableCell>
                  <TableCell>
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
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-study-50">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem className="cursor-pointer">
                          <Eye className="mr-2 h-4 w-4 text-study-500" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">
                          <Edit className="mr-2 h-4 w-4 text-warning-500" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-danger-600 cursor-pointer focus:text-danger-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
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
