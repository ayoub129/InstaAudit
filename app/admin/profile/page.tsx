"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Shield } from "lucide-react"

export default function AdminProfilePage() {
  const [profile, setProfile] = useState({
    name: "Admin",
    email: "admin@instaaudit.com",
    username: "adminuser",
  })
  const [password, setPassword] = useState({
    current: "",
    new: "",
    confirm: "",
  })

  return (
    <div className="space-y-8 w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Admin Profile</h1>
        <p className="text-muted-foreground">View and update your admin account details</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your personal information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-slate-200 flex items-center justify-center">
              <User className="h-8 w-8 text-slate-500" />
            </div>
            <div>
              <div className="font-medium text-lg">{profile.name}</div>
              <div className="text-sm text-muted-foreground">{profile.email}</div>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={profile.name}
                onChange={e => setProfile({ ...profile, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={e => setProfile({ ...profile, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={profile.username}
                onChange={e => setProfile({ ...profile, username: e.target.value })}
              />
            </div>
          </div>
          <Button className="bg-pink-500 hover:bg-pink-600">Save Profile</Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5" /> Change Password</CardTitle>
          <CardDescription>Update your account password</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">Current Password</Label>
            <Input
              id="current-password"
              type="password"
              value={password.current}
              onChange={e => setPassword({ ...password, current: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <Input
              id="new-password"
              type="password"
              value={password.new}
              onChange={e => setPassword({ ...password, new: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm New Password</Label>
            <Input
              id="confirm-password"
              type="password"
              value={password.confirm}
              onChange={e => setPassword({ ...password, confirm: e.target.value })}
            />
          </div>
          <Button className="bg-pink-500 hover:bg-pink-600">Update Password</Button>
        </CardContent>
      </Card>
    </div>
  )
} 