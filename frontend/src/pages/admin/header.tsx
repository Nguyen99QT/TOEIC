import { Bell, Search, User, Settings, LogOut, ChevronDown } from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Badge } from "./ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { ModeToggle } from "./mode-toggle"
import React from "react"

const BLOG_KEYBOARD_SHORTCUT = "b"

export function Header() {
  // Thêm phím tắt để điều hướng đến trang blog
  const navigateToBlog = React.useCallback(() => {
    window.location.href = '/blogs'
  }, [])

  // Lắng nghe phím tắt Ctrl+Shift+B để mở blog
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === BLOG_KEYBOARD_SHORTCUT && (event.metaKey || event.ctrlKey) && event.shiftKey) {
        event.preventDefault()
        navigateToBlog()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [navigateToBlog])

  const navigationItems = [
    { name: 'Dashboard', href: '/dashboard', emoji: '📊' },
    { name: 'Lessons', href: '/lessons', emoji: '📚' },
    { name: 'Exercises', href: '/exercises', emoji: '✏️' },
    { name: 'Flashcards', href: '/flashcards', emoji: '💳' },
    { name: 'Progress', href: '/progress', emoji: '📈' },
    { name: 'Feedback', href: '/feedback', emoji: '💬' },
    { name: 'Blog', href: '/blogs', emoji: '📰' },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/80">
      {/* Navigation Bar */}
      <div className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
        <div className="flex h-12 items-center px-6 lg:px-8">
          {/* Logo */}
          <div className="flex items-center gap-2 mr-8">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">LE</span>
            </div>
            <span className="font-semibold text-slate-900 dark:text-slate-100">LeEnglish</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">TOEIC Platform</span>
          </div>

          {/* Navigation Items */}
          <nav className="flex items-center gap-1">
            {navigationItems.map((item) => (
              <Button
                key={item.name}
                variant="ghost"
                className="h-8 px-3 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-700 rounded-md transition-colors"
                onClick={() => window.location.href = item.href}
                title={item.name === 'Blog' ? `Mở trang ${item.name} (Ctrl+Shift+B)` : `Mở trang ${item.name}`}
              >
                <span className="mr-1">{item.emoji}</span>
                {item.name}
              </Button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Header */}
      <div className="flex h-16 items-center gap-4 px-6 lg:px-8">
        <div className="flex-1">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Tìm kiếm khóa học, người dùng..."
              className="pl-10 bg-slate-50 border-slate-200 focus-visible:ring-blue-500 focus-visible:border-blue-500 dark:bg-slate-800/50 dark:border-slate-700 dark:focus-visible:ring-blue-400 dark:focus-visible:border-blue-400 transition-all duration-200"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="relative text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-blue-400 dark:hover:bg-blue-950/50 transition-all duration-200"
          >
            <Bell className="h-4 w-4" />
            <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs bg-blue-500 border-2 border-white dark:border-slate-900">3</Badge>
          </Button>

          <ModeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-auto rounded-full px-3 gap-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200">
                <Avatar className="h-7 w-7 border-2 border-slate-200 dark:border-slate-700">
                  <AvatarImage src="/placeholder-user.jpg" alt="Admin" />
                  <AvatarFallback className="bg-blue-500 text-white font-semibold">AD</AvatarFallback>
                </Avatar>
                <div className="hidden sm:flex flex-col items-start">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Admin User</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">admin@toeic.com</span>
                </div>
                <ChevronDown className="h-4 w-4 text-slate-400" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none text-slate-900 dark:text-slate-100">Admin User</p>
                  <p className="text-xs leading-none text-slate-500 dark:text-slate-400">admin@toeic.com</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors duration-150">
                <User className="mr-2 h-4 w-4" />
                <span>Hồ sơ</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors duration-150">
                <Settings className="mr-2 h-4 w-4" />
                <span>Cài đặt</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors duration-150">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Đăng xuất</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
