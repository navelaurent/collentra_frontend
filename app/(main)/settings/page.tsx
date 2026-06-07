"use client";

import { MainLayout } from "@/components/layout/MainLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(true);
  const [visibility, setVisibility] = useState("public");
  const [mounted, setMounted] = useState(false);

  const [initialSettings, setInitialSettings] = useState({
    darkMode: true,
    visibility: "public",
  });

  const handleThemeToggle = (checked: boolean) => {
    setDarkMode(checked);

    if (checked) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const isDark =
      savedTheme === "dark" ||
      (!savedTheme &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);

    setDarkMode(isDark);

    setInitialSettings({
      darkMode: isDark,
      visibility: "public",
    });
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode, mounted]);

  const hasChanges =
    darkMode !== initialSettings.darkMode ||
    visibility !== initialSettings.visibility;

  const handleSave = () => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");

    setInitialSettings({
      darkMode,
      visibility,
    });
  };

  const handleCancel = () => {
    setDarkMode(initialSettings.darkMode);
    setVisibility(initialSettings.visibility);
  };

  if (!mounted) return null;

  return (
    <MainLayout>
      <div className="space-y-8 p-4 sm:p-6 lg:p-8 max-w-full overflow-x-hidden">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-1">
            Manage your account and preferences
          </p>
        </div>

        <Card className="p-6">
          <h3 className="font-semibold text-foreground">Appearance</h3>
          <div className="flex items-center justify-between mt-4">
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
            <Switch checked={darkMode} onCheckedChange={handleThemeToggle} />
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold text-foreground">Privacy & Security</h3>
          <div className="mt-4">
            <p className="font-medium text-foreground">Profile Visibility</p>
            <Select value={visibility} onValueChange={setVisibility}>
              <SelectTrigger className="w-full mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="private">Private</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button
            onClick={handleSave}
            disabled={!hasChanges}
            className="w-full sm:w-auto transition-all"
          >
            Save Changes
          </Button>
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={!hasChanges}
            className="w-full sm:w-auto transition-all"
          >
            Cancel
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}
