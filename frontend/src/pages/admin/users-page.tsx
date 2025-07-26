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
import { Plus, Search, Filter, MoreHorizontal, Eye, Edit, Ban, UserCheck, Mail, Calendar, Loader2, RefreshCw, ChevronLeft, ChevronRight } from "lucide-react"
import { getUsers, toggleUserStatus, updateUserRole } from "../../services/users"
import { User, Role } from "../../types"
import { toast } from "react-hot-toast"

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
  const [totalPages, setTotalPages] = useState(0)
  const [totalStudents, setTotalStudents] = useState(0)
  const [totalInstructors, setTotalInstructors] = useState(0)
  const [pendingUsers, setPendingUsers] = useState(0)
  const pageSize = 10

  // Load users from API
  const loadUsers = async () => {
    try {
      setLoading(true)
      
      console.log("🔄 Loading users from API...")
      console.log("📝 Request params:", {
        page: currentPage,
        size: pageSize,
        search: searchTerm || undefined
      })
      
      const response = await getUsers({
        page: currentPage,
        size: pageSize,
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
      setTotalPages(response.totalPages || 0)
      
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

  // Handle search
  const handleSearch = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(0) // Reset to first page when searching
  }

  // Pagination handlers
  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1)
    }
  }

  const handlePageClick = (page: number) => {
    setCurrentPage(page)
  }

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = []
    const maxPagesToShow = 5
    const halfRange = Math.floor(maxPagesToShow / 2)
    
    let startPage = Math.max(0, currentPage - halfRange)
    let endPage = Math.min(totalPages - 1, startPage + maxPagesToShow - 1)
    
    // Adjust start if we're near the end
    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(0, endPage - maxPagesToShow + 1)
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }
    
    return pages
  }

  // Load users on component mount and when search term or page changes
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
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Tìm kiếm theo tên hoặc email..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" className="border-study-200 hover:bg-study-50">
          <Filter className="mr-2 h-4 w-4" />
          Bộ lọc
        </Button>
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
              <Button variant="outline" onClick={handlePreviousPage} disabled={currentPage === 0}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {getPageNumbers().map((page) => (
                <Button
                  key={page}
                  variant={page === currentPage ? "default" : "outline"}
                  onClick={() => handlePageClick(page)}
                  className="h-8 w-8"
                >
                  {page + 1}
                </Button>
              ))}
              <Button variant="outline" onClick={handleNextPage} disabled={currentPage === totalPages - 1}>
                <ChevronRight className="h-4 w-4" />
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
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t">
            <div className="text-sm text-gray-500">
              Hiển thị {currentPage * pageSize + 1} - {Math.min((currentPage + 1) * pageSize, totalUsers)} 
              trong tổng số {totalUsers} người dùng
            </div>
            
            <div className="flex items-center space-x-2">
              {/* Previous button */}
              <Button
                variant="outline"
                size="sm"
                onClick={handlePreviousPage}
                disabled={currentPage === 0}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              {/* Page numbers */}
              <div className="flex items-center space-x-1">
                {/* First page if not in range */}
                {getPageNumbers()[0] > 0 && (
                  <>
                    <Button
                      variant={currentPage === 0 ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageClick(0)}
                      className="h-8 w-8 p-0"
                    >
                      1
                    </Button>
                    {getPageNumbers()[0] > 1 && (
                      <span className="text-gray-400">...</span>
                    )}
                  </>
                )}
                
                {/* Page range */}
                {getPageNumbers().map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageClick(page)}
                    className="h-8 w-8 p-0"
                  >
                    {page + 1}
                  </Button>
                ))}
                
                {/* Last page if not in range */}
                {getPageNumbers()[getPageNumbers().length - 1] < totalPages - 1 && (
                  <>
                    {getPageNumbers()[getPageNumbers().length - 1] < totalPages - 2 && (
                      <span className="text-gray-400">...</span>
                    )}
                    <Button
                      variant={currentPage === totalPages - 1 ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageClick(totalPages - 1)}
                      className="h-8 w-8 p-0"
                    >
                      {totalPages}
                    </Button>
                  </>
                )}
              </div>
              
              {/* Next button */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={currentPage >= totalPages - 1}
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
