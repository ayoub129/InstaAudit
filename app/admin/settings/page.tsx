"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Shield, Bell, Settings } from "lucide-react"

export default function AdminSettingsPage() {
  const [platformName, setPlatformName] = useState("InstaAudit")
  const [supportEmail, setSupportEmail] = useState("support@instaaudit.com")
  const [notifications, setNotifications] = useState({
    userSignup: true,
    auditComplete: true,
    paymentFailed: false,
  })
  const [security, setSecurity] = useState({
    twoFactor: false,
    adminAlerts: true,
  })

  return (
    <div className="space-y-8 w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Admin Settings</h1>
        <p className="text-muted-foreground">Manage platform settings and admin preferences</p>
      </div>
      <div className="grid gap-8 md:grid-cols-2">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Settings className="h-5 w-5" /> General Settings</CardTitle>
            <CardDescription>Update platform information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="platform-name">Platform Name</Label>
              <Input
                id="platform-name"
                value={platformName}
                onChange={e => setPlatformName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="support-email">Support Email</Label>
              <Input
                id="support-email"
                type="email"
                value={supportEmail}
                onChange={e => setSupportEmail(e.target.value)}
              />
            </div>
            <Button className="bg-pink-500 hover:bg-pink-600">Save Changes</Button>
          </CardContent>
        </Card>
        {/* Notification Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Bell className="h-5 w-5" /> Notification Preferences</CardTitle>
            <CardDescription>Choose which admin notifications to receive</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>User Signup Alerts</Label>
                <p className="text-xs text-muted-foreground">Notify when a new user signs up</p>
              </div>
              <Switch
                checked={notifications.userSignup}
                onCheckedChange={checked => setNotifications({ ...notifications, userSignup: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Audit Completion Alerts</Label>
                <p className="text-xs text-muted-foreground">Notify when an audit is completed</p>
              </div>
              <Switch
                checked={notifications.auditComplete}
                onCheckedChange={checked => setNotifications({ ...notifications, auditComplete: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Payment Failure Alerts</Label>
                <p className="text-xs text-muted-foreground">Notify when a payment fails</p>
              </div>
              <Switch
                checked={notifications.paymentFailed}
                onCheckedChange={checked => setNotifications({ ...notifications, paymentFailed: checked })}
              />
            </div>
            <Button className="bg-pink-500 hover:bg-pink-600">Save Preferences</Button>
          </CardContent>
        </Card>
      </div>
      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5" /> Security Settings</CardTitle>
          <CardDescription>Manage security options for admin accounts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Two-Factor Authentication</Label>
              <p className="text-xs text-muted-foreground">Require 2FA for all admin logins</p>
            </div>
            <Switch
              checked={security.twoFactor}
              onCheckedChange={checked => setSecurity({ ...security, twoFactor: checked })}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Critical Admin Alerts</Label>
              <p className="text-xs text-muted-foreground">Send alerts for critical admin actions</p>
            </div>
            <Switch
              checked={security.adminAlerts}
              onCheckedChange={checked => setSecurity({ ...security, adminAlerts: checked })}
            />
          </div>
          <Button className="bg-pink-500 hover:bg-pink-600">Save Security Settings</Button>
        </CardContent>
      </Card>
    </div>
  )
} 