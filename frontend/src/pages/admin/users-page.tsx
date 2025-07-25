import React, { useState, useEffect } from "react"
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
import { Plus, Search, Filter, MoreHorizontal, Eye, Edit, Ban, UserCheck, Mail, Calendar, Loader2, RefreshCw, Bug } from "lucide-react"
import { getUsers, toggleUserStatus, updateUserRole } from "../../services/users"
import { User, Role } from "../../types"
import { toast } from "react-hot-toast"
import apiClient from "../../services/apiClient"

// Helper function to get user display name
const getUserDisplayName = (user: User): string => {
  if (user.fullName) return user.fullName
  if (user.firstName && user.lastName) return `${user.firstName} ${user.lastName}`
  return user.username || user.email || 'Unknown User'
}

// Helper function to get user avatar fallback
const getUserAvatarFallback = (user: User): string => {
  const name = getUserDisplayName(user)
  return name.charAt(0).toUpperCase()
}

// No fallback data - only use real API

export function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(0)
  const [totalUsers, setTotalUsers] = useState(0)
  const [totalStudents, setTotalStudents] = useState(0)
  const [totalInstructors, setTotalInstructors] = useState(0)
  const [pendingUsers, setPendingUsers] = useState(0)


  // Load users from API
  const loadUsers = async () => {
    try {
      setLoading(true)
      
      console.log("🔄 Loading users from API...")
      console.log("📝 Request params:", {
        page: currentPage,
        size: 20,
        search: searchTerm || undefined
      })
      
      const response = await getUsers({
        page: currentPage,
        size: 20,
        search: searchTerm || undefined
      })
      
      console.log("✅ Users loaded successfully:", response)
      console.log("📊 Response structure:", {
        content: response.content?.length,
        totalElements: response.totalElements,
        totalPages: response.totalPages,
        hasContent: !!response.content
      })
      
      // Check if response has the expected structure
      if (!response.content || !Array.isArray(response.content)) {
        console.error("❌ Invalid response structure:", response)
        throw new Error("API response không có định dạng mong đợi")
      }
      
      setUsers(response.content)
      setTotalUsers(response.totalElements || 0)
      
      // Calculate stats
      const students = response.content.filter(user => user.role === 'USER')
      const instructors = response.content.filter(user => user.role === 'COLLABORATOR')
      const pending = response.content.filter(user => !user.isActive)
      
      setTotalStudents(students.length)
      setTotalInstructors(instructors.length)
      setPendingUsers(pending.length)
      
    } catch (error: any) {
      console.error("❌ Failed to load users:", error)
      toast.error('Không thể tải danh sách người dùng: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  // Debug function to test user count
  const debugUserCount = async () => {
    try {
      console.log("🐛 [DEBUG] Testing user count endpoint...")
      const response = await apiClient.get('/api/users/count')
      console.log("🐛 [DEBUG] User count response:", response.data)
      toast.success('Debug info logged to console')
    } catch (error: any) {
      console.error("🐛 [DEBUG] User count error:", error)
      toast.error('Debug failed: ' + error.message)
    }
  }

  // Debug function to test main users endpoint
  const debugUsersAPI = async () => {
    try {
      console.log("🐛 [DEBUG] Testing main users endpoint...")
      console.log("🐛 [DEBUG] Auth token:", localStorage.getItem('toeic_access_token') ? 'Present' : 'Missing')
      console.log("🐛 [DEBUG] Current user:", localStorage.getItem('toeic_current_user'))
      
      const response = await apiClient.get('/api/users?page=0&size=5')
      console.log("🐛 [DEBUG] Main users API response:", response.data)
      toast.success('Debug users API logged to console')
    } catch (error: any) {
      console.error("🐛 [DEBUG] Main users API error:", error)
      console.error("🐛 [DEBUG] Error response:", error.response?.data)
      console.error("🐛 [DEBUG] Error status:", error.response?.status)
      toast.error('Debug users API failed: ' + (error.response?.data?.message || error.message))
    }
  }

  // Handle user status toggle
  const handleToggleStatus = async (userId: number, currentStatus: boolean) => {
    try {
      await toggleUserStatus(userId, !currentStatus)
      toast.success('Cập nhật trạng thái thành công')
      loadUsers() // Reload users
    } catch (error: any) {
      toast.error('Không thể cập nhật trạng thái: ' + error.message)
    }
  }

  // Handle role update
  const handleRoleUpdate = async (userId: number, newRole: Role) => {
    try {
      await updateUserRole(userId, newRole)
      toast.success('Cập nhật vai trò thành công')
      loadUsers() // Reload users
    } catch (error: any) {
      toast.error('Không thể cập nhật vai trò: ' + error.message)
    }
  }

  // Load users on component mount and when search term changes
  useEffect(() => {
    loadUsers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchTerm])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-black">Quản lý người dùng</h1>
          <p className="text-black">Quản lý học viên và giảng viên trên Toeic.com</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            onClick={loadUsers}
            disabled={loading}
            className="border-study-200 hover:bg-study-50 hover:text-study-600"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Làm mới
          </Button>
          <Button className="bg-study-600 hover:bg-study-700">
            <Plus className="mr-2 h-4 w-4" />
            Thêm giảng viên
          </Button>
          <Button 
            variant="outline" 
            onClick={debugUserCount}
            className="border-study-200 hover:bg-study-50 hover:text-study-600"
          >
            <Bug className="mr-2 h-4 w-4" />
            Debug User Count
          </Button>
          <Button 
            variant="outline" 
            onClick={debugUsersAPI}
            className="border-yellow-200 hover:bg-yellow-50 hover:text-yellow-600"
          >
            <Bug className="mr-2 h-4 w-4" />
            Debug Users API
          </Button>
        </div>
      </div>



      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-gradient-to-br from-study-500 to-study-600 text-white shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng người dùng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-white/80">
              <span className="text-white font-medium">+{totalUsers}</span> người dùng mới
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-success-500 to-success-600 text-white shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Học viên</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents}</div>
            <p className="text-xs text-white/80">{totalUsers > 0 ? Math.round((totalStudents / totalUsers) * 100) : 0}% tổng số người dùng</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-warning-500 to-warning-600 text-white shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Giảng viên</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalInstructors}</div>
            <p className="text-xs text-white/80">{totalUsers > 0 ? Math.round((totalInstructors / totalUsers) * 100) : 0}% tổng số người dùng</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-study-500 to-study-600 text-white shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chờ duyệt</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingUsers}</div>
            <p className="text-xs text-white/80">Cần xem xét</p>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card className="shadow-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Danh sách người dùng</CardTitle>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm người dùng..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-80 focus-visible:ring-study-500"
                />
              </div>
              <Button variant="outline" className="border-study-200 hover:bg-study-50 hover:text-study-600">
                <Filter className="mr-2 h-4 w-4" />
                Lọc
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Người dùng</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Vai trò</TableHead>
                <TableHead>Loại tài khoản</TableHead>
                <TableHead>Ngày tham gia</TableHead>
                <TableHead>Hoạt động cuối</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <div className="flex items-center justify-center space-x-2">
                      <Loader2 className="h-6 w-6 animate-spin" />
                      <span>Đang tải danh sách người dùng...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <span>Không có người dùng nào</span>
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id} className="hover:bg-muted/30">
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="border border-muted">
                          <AvatarImage src={user.profilePicture || "/placeholder.svg"} />
                          <AvatarFallback className="bg-study-100 text-study-700">{getUserAvatarFallback(user)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-study-700">{getUserDisplayName(user)}</div>
                          <div className="text-sm text-muted-foreground">ID: {user.id}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{user.email}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={user.role === "COLLABORATOR" ? "default" : "secondary"}
                        className={
                          user.role === "COLLABORATOR"
                            ? "bg-study-500 hover:bg-study-600"
                            : user.role === "ADMIN"
                              ? "bg-danger-500 hover:bg-danger-600"
                              : "bg-success-100 text-success-700 hover:bg-success-200"
                        }
                      >
                        {user.role === "COLLABORATOR" ? "Giảng viên" : user.role === "ADMIN" ? "Admin" : "Học viên"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={user.membershipType === "PREMIUM" ? "default" : "secondary"}
                        className={
                          user.membershipType === "PREMIUM"
                            ? "bg-warning-500 hover:bg-warning-600"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }
                      >
                        {user.membershipType === "PREMIUM" ? "Premium" : "Free"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{user.registrationDate ? new Date(user.registrationDate).toLocaleDateString('vi-VN') : '-'}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{user.lastLoginDate ? new Date(user.lastLoginDate).toLocaleDateString('vi-VN') : '-'}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={user.isActive ? "default" : "secondary"}
                        className={
                          user.isActive
                            ? "bg-success-500 hover:bg-success-600"
                            : "bg-warning-500 hover:bg-warning-600 text-white"
                        }
                      >
                        {user.isActive ? "Hoạt động" : "Không hoạt động"}
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
                          <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                          <DropdownMenuItem className="cursor-pointer">
                            <Eye className="mr-2 h-4 w-4 text-study-500" />
                            Xem hồ sơ
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer">
                            <Edit className="mr-2 h-4 w-4 text-warning-500" />
                            Chỉnh sửa
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {user.role !== "ADMIN" && (
                            <>
                              <DropdownMenuItem 
                                className="cursor-pointer"
                                onClick={() => handleRoleUpdate(user.id, user.role === Role.COLLABORATOR ? Role.USER : Role.COLLABORATOR)}
                              >
                                <UserCheck className="mr-2 h-4 w-4 text-study-500" />
                                {user.role === Role.COLLABORATOR ? "Chuyển thành học viên" : "Chuyển thành giảng viên"}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                            </>
                          )}
                          {!user.isActive && (
                            <DropdownMenuItem 
                              className="cursor-pointer"
                              onClick={() => handleToggleStatus(user.id, user.isActive || false)}
                            >
                              <UserCheck className="mr-2 h-4 w-4 text-success-500" />
                              Kích hoạt tài khoản
                            </DropdownMenuItem>
                          )}
                          {user.isActive && user.role !== "ADMIN" && (
                            <DropdownMenuItem 
                              className="text-danger-600 cursor-pointer focus:text-danger-600"
                              onClick={() => handleToggleStatus(user.id, user.isActive || false)}
                            >
                              <Ban className="mr-2 h-4 w-4" />
                              Khóa tài khoản
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
