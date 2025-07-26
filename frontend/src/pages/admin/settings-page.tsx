import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Switch } from "./ui/switch"
import { Textarea } from "./ui/textarea"
import { Separator } from "./ui/separator"
import { Settings, Bell, Shield, CreditCard } from "lucide-react"

export function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-black">System Settings</h1>
          <p className="text-black">Manage configuration and settings for Toeic.com</p>
        </div>
      </div>

      <div className="grid gap-6">
        {/* General Settings */}
        <Card className="shadow-md">
          <CardHeader className="bg-gradient-to-r from-study-50 to-white">
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-study-600" />
              General Settings
            </CardTitle>
            <CardDescription>Basic configuration for the website</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="site-name">Website Name</Label>
              <Input id="site-name" defaultValue="Study4.com" className="focus-visible:ring-study-500" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="site-description">Website Description</Label>
              <Textarea
                id="site-description"
                defaultValue="Leading online learning platform"
                rows={3}
                className="focus-visible:ring-study-500"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="contact-email">Contact Email</Label>
              <Input
                id="contact-email"
                type="email"
                defaultValue="contact@study4.com"
                className="focus-visible:ring-study-500"
              />
            </div>
            <Button className="bg-study-600 hover:bg-study-700">Save Changes</Button>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="shadow-md">
          <CardHeader className="bg-gradient-to-r from-success-50 to-white">
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-success-600" />
              Notification Settings
            </CardTitle>
            <CardDescription>Manage notification types sent to users</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>New Course Notifications</Label>
                <p className="text-sm text-muted-foreground">Send email when new courses are published</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Comment Notifications</Label>
                <p className="text-sm text-muted-foreground">Notify when there are new comments on courses</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Weekly Reports</Label>
                <p className="text-sm text-muted-foreground">Send weekly statistics reports to admin</p>
              </div>
              <Switch />
            </div>
            <Button className="bg-success-600 hover:bg-success-700">Save Settings</Button>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card className="shadow-md">
          <CardHeader className="bg-gradient-to-r from-warning-50 to-white">
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-warning-600" />
              Security
            </CardTitle>
            <CardDescription>Security and access control settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Two-Factor Authentication</Label>
                <p className="text-sm text-muted-foreground">Require 2FA for admin accounts</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto Login</Label>
                <p className="text-sm text-muted-foreground">Allow users to stay logged in</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="grid gap-2">
              <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
              <Input id="session-timeout" type="number" defaultValue="60" className="focus-visible:ring-warning-500" />
            </div>
            <Button className="bg-warning-600 hover:bg-warning-700">Update Security</Button>
          </CardContent>
        </Card>

        {/* Payment Settings */}
        <Card className="shadow-md">
          <CardHeader className="bg-gradient-to-r from-info-50 to-white">
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-info-600" />
              Payment Settings
            </CardTitle>
            <CardDescription>Configure payment methods</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>VNPay Payment</Label>
                <p className="text-sm text-muted-foreground">Enable VNPay payment</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>MoMo Payment</Label>
                <p className="text-sm text-muted-foreground">Enable MoMo wallet payment</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="grid gap-2">
              <Label htmlFor="commission-rate">Commission Rate (%)</Label>
              <Input id="commission-rate" type="number" defaultValue="15" className="focus-visible:ring-info-500" />
            </div>
            <Button className="bg-info-600 hover:bg-info-700">Save Settings</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
