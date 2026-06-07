"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bell, LogOut, User, Menu, X, Send, UserPlus } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import Cookies from "js-cookie";
import { LogoutModal } from "../ui/modal/logout_modal";
import { getUserInfo } from "@/helpers/authHelpers";
import Image from "next/image";
import logoImg from "../../public/logo.png";
import api from "@/lib/axios";
import { usePathname } from "next/navigation";

export function Navigation() {
  const user = getUserInfo();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activities, setActivities] = useState<any[]>([]);
  const [invites, setInvites] = useState<any[]>([]);
  const pathname = usePathname();
  const handleLogout = () => {
    Cookies.remove("token", { path: "/" });
    localStorage.clear();
    window.location.href = "/auth";
  };

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [resActivity, resInvites] = await Promise.all([
          api.get("Notification/getAllNotif", {
            params: { targetId: user?.sid },
          }),
          api.get("/Invitation", { params: { userId: user?.sid } }),
        ]);

        const actData = (resActivity.data?.data || resActivity.data || []).map(
          (item: any) => ({
            ...item,
            icon: Send,
          }),
        );

        const invData = (resInvites.data?.data || resInvites.data || []).map(
          (item: any) => ({
            ...item,
            icon: UserPlus,
          }),
        );

        setActivities(actData);
        setInvites(invData);
      } catch (error) {
        console.error("Gagal ambil data:", error);
      }
    };

    fetchAllData();
  }, [user?.sid]);

  const unreadCount =
    activities.filter((n) => !n.isOpen).length +
    invites.filter((n) => !n.isOpen).length;

  const notifIsActive =
    pathname === "/notifications" || pathname.startsWith("/notifications/");

  return (
    <>
      <nav className="sticky top-0 z-40 w-full border-b border-border bg-card">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative h-8 w-8 overflow-hidden rounded-lg">
              <Image
                src={logoImg}
                alt="Collentra Logo"
                fill
                sizes="32px"
                className="object-cover"
                priority
              />
            </div>

            <span className="font-bold text-lg hidden sm:inline text-foreground">
              Collentra
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className={`relative transition-colors ${
                notifIsActive
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              <Link href="/notifications">
                <Bell className="h-4 w-4" />

                {unreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}

                <span className="sr-only">Notifications</span>
              </Link>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                    {user?.name.substring(0, 1).toUpperCase() || ""}
                  </div>
                  <span className="text-sm">{user?.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="gap-2">
                    <User className="h-4 w-4" />
                    My Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive gap-2 cursor-pointer"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsModalOpen(true);
                  }}
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-muted rounded-lg"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-background px-4 py-3 space-y-2">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-2"
              asChild
            >
              <Link href="/notifications">
                <Bell className="h-4 w-4" />
                Notifications
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-2"
              asChild
            >
              <Link href="/profile">
                <User className="h-4 w-4" />
                Profile
              </Link>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-2 text-destructive"
              onClick={() => {
                setMobileMenuOpen(false);
                setIsModalOpen(true);
              }}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        )}
      </nav>

      <LogoutModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleLogout}
      />
    </>
  );
}
