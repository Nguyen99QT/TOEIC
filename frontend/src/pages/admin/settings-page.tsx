import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Settings, Bell, Shield, CreditCard } from "lucide-react"

export function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Cài đặt hệ thống</h1>
        <p className="text-muted-foreground">Quản lý cấu hình và thiết lập cho Toeic.com</p>
      </div>

      <div className="grid gap-6">
        {/* General Settings */}
        <Card className="shadow-md">
          <CardHeader className="bg-gradient-to-r from-study-50 to-white">
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-study-600" />
              Cài đặt chung
            </CardTitle>
            <CardDescription>Cấu hình cơ bản cho website</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="site-name">Tên website</Label>
              <Input id="site-name" defaultValue="Study4.com" className="focus-visible:ring-study-500" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="site-description">Mô tả website</Label>
              <Textarea
                id="site-description"
                defaultValue="Nền tảng học trực tuyến hàng đầu Việt Nam"
                rows={3}
                className="focus-visible:ring-study-500"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="contact-email">Email liên hệ</Label>
              <Input
                id="contact-email"
                type="email"
                defaultValue="contact@study4.com"
                className="focus-visible:ring-study-500"
              />
            </div>
            <Button className="bg-study-600 hover:bg-study-700">Lưu thay đổi</Button>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="shadow-md">
          <CardHeader className="bg-gradient-to-r from-success-50 to-white">
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-success-600" />
              Cài đặt thông báo
            </CardTitle>
            <CardDescription>Quản lý các loại thông báo gửi đến người dùng</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Thông báo khóa học mới</Label>
                <p className="text-sm text-muted-foreground">Gửi email khi có khóa học mới được xuất bản</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Thông báo bình luận</Label>
                <p className="text-sm text-muted-foreground">Thông báo khi có bình luận mới trên khóa học</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Báo cáo hàng tuần</Label>
                <p className="text-sm text-muted-foreground">Gửi báo cáo thống kê hàng tuần cho admin</p>
              </div>
              <Switch />
            </div>
            <Button className="bg-success-600 hover:bg-success-700">Lưu cài đặt</Button>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card className="shadow-md">
          <CardHeader className="bg-gradient-to-r from-warning-50 to-white">
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-warning-600" />
              Bảo mật
            </CardTitle>
            <CardDescription>Cài đặt bảo mật và quyền truy cập</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Xác thực 2 bước</Label>
                <p className="text-sm text-muted-foreground">Bắt buộc xác thực 2 bước cho tài khoản admin</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Đăng nhập tự động</Label>
                <p className="text-sm text-muted-foreground">Cho phép người dùng duy trì đăng nhập</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="grid gap-2">
              <Label htmlFor="session-timeout">Thời gian hết phiên (phút)</Label>
              <Input id="session-timeout" type="number" defaultValue="60" className="focus-visible:ring-warning-500" />
            </div>
            <Button className="bg-warning-600 hover:bg-warning-700">Cập nhật bảo mật</Button>
          </CardContent>
        </Card>

        {/* Payment Settings */}
        <Card className="shadow-md">
          <CardHeader className="bg-gradient-to-r from-info-50 to-white">
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-info-600" />
              Cài đặt thanh toán
            </CardTitle>
            <CardDescription>Cấu hình các phương thức thanh toán</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Thanh toán qua VNPay</Label>
                <p className="text-sm text-muted-foreground">Kích hoạt thanh toán qua VNPay</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Thanh toán qua MoMo</Label>
                <p className="text-sm text-muted-foreground">Kích hoạt thanh toán qua ví MoMo</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="grid gap-2">
              <Label htmlFor="commission-rate">Tỷ lệ hoa hồng (%)</Label>
              <Input id="commission-rate" type="number" defaultValue="15" className="focus-visible:ring-info-500" />
            </div>
            <Button className="bg-info-600 hover:bg-info-700">Lưu cài đặt</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
