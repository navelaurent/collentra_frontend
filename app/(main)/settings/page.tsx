"use client";

import { MainLayout } from "@/components/layout/MainLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Moon, Sun, Bell, Lock, LogOut } from "lucide-react";
import { useEffect, useState } from "react";

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    taskAssigned: true,
    taskCompleted: true,
    deadline: true,
    comment: true,
    rating: true,
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <MainLayout>
      <div className="space-y-8 p-4 sm:p-6 lg:p-8 w-full">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-1">
            Manage your account and preferences
          </p>
        </div>

        <Card className="p-6">
          <h3 className="font-semibold text-foreground mb-4">
            Account Settings
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Email Address
              </label>
              <Input value="alex.johnson@company.com" className="mt-2" />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Password
              </label>
              <Button
                variant="outline"
                className="mt-2 gap-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white hover:opacity-90 transition-all shadow-md"
              >
                <Lock className="h-4 w-4" />
                Change Password
              </Button>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Account Status
              </label>
              <div className="mt-2 flex items-center gap-2">
                <Badge className="bg-emerald-500">Active</Badge>
                <span className="text-sm text-muted-foreground">
                  Since March 2024
                </span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold text-foreground mb-4">Appearance</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {darkMode ? (
                  <Moon className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Sun className="h-4 w-4 text-muted-foreground" />
                )}
                <div>
                  <p className="font-medium text-foreground">Dark Mode</p>
                  <p className="text-xs text-muted-foreground">
                    Use dark theme by default
                  </p>
                </div>
              </div>
              <Switch checked={darkMode} onCheckedChange={setDarkMode} />
            </div>

            <div className="border-t border-border pt-4">
              <p className="font-medium text-foreground mb-2">Color Theme</p>
              <Select defaultValue="purple">
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="purple">Purple</SelectItem>
                  <SelectItem value="blue">Blue</SelectItem>
                  <SelectItem value="emerald">Emerald</SelectItem>
                  <SelectItem value="slate">Slate</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="h-5 w-5 text-muted-foreground" />
            <h3 className="font-semibold text-foreground">
              Notification Preferences
            </h3>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">
                  Email Notifications
                </p>
                <p className="text-xs text-muted-foreground">
                  Receive notifications via email
                </p>
              </div>
              <Switch checked={notifications.email} onChange={() => {}} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">
                  Push Notifications
                </p>
                <p className="text-xs text-muted-foreground">
                  Receive in-app notifications
                </p>
              </div>
              <Switch checked={notifications.push} onChange={() => {}} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">SMS Notifications</p>
                <p className="text-xs text-muted-foreground">
                  Receive SMS alerts for urgent items
                </p>
              </div>
              <Switch checked={notifications.sms} onChange={() => {}} />
            </div>
          </div>

          <div className="border-t border-border pt-4 space-y-4">
            <p className="font-medium text-foreground text-sm">
              What to notify me about
            </p>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm text-foreground">Task assigned to me</p>
                <Switch
                  checked={notifications.taskAssigned}
                  onChange={() => {}}
                />
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-foreground">Task I completed</p>
                <Switch
                  checked={notifications.taskCompleted}
                  onChange={() => {}}
                />
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-foreground">Deadline approaching</p>
                <Switch checked={notifications.deadline} onChange={() => {}} />
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-foreground">
                  New comments on my tasks
                </p>
                <Switch checked={notifications.comment} onChange={() => {}} />
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-foreground">
                  Rating or feedback received
                </p>
                <Switch checked={notifications.rating} onChange={() => {}} />
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold text-foreground mb-4">
            Privacy & Security
          </h3>
          <div className="space-y-4">
            <div>
              <p className="font-medium text-foreground">Profile Visibility</p>
              <Select defaultValue="friends">
                <SelectTrigger className="w-full mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="friends">Friends Only</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="pt-4 border-t border-border">
              <p className="font-medium text-foreground mb-2">
                Two-Factor Authentication
              </p>
              <Button variant="outline">Enable 2FA</Button>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-destructive/20 bg-destructive/5">
          <h3 className="font-semibold text-destructive mb-4">Danger Zone</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Logout</p>
                <p className="text-xs text-muted-foreground">
                  Sign out from all devices
                </p>
              </div>
              <Button variant="outline" className="gap-2">
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </Card>

        <div className="flex gap-2">
          <Button className="w-full sm:w-auto">Save Changes</Button>
          <Button variant="outline" className="w-full sm:w-auto">
            Cancel
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}
