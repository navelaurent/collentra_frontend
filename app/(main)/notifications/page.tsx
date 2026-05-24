"use client";

import { MainLayout } from "@/components/layout/MainLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  MessageSquare,
  UserPlus,
  Clock,
  Star,
  AlertCircle,
  Send,
  Check,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";
import api from "@/lib/axios";
import { getUserInfo } from "@/helpers/authHelpers";
import { useAlert } from "@/components/ui/showAlert";
import { formatDate } from "@/lib/utils";

const iconMap: Record<string, any> = {
  task_completed: CheckCircle2,
  comment: MessageSquare,
  deadline: Clock,
  rating: Star,
  task_overdue: AlertCircle,
};

export default function NotificationsPage() {
  const user = getUserInfo();
  const { showAlert } = useAlert();
  const [activities, setActivities] = useState<any[]>([]);
  const [invites, setInvites] = useState<any[]>([]);

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
            icon: iconMap[item.type] || Send,
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

  const handleMarkAllAsRead = async () => {
    try {
      await api.put("Notification/markAllRead", `"${user?.sid}"`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      setActivities(activities.map((n) => ({ ...n, isOpen: true })));
      setInvites(invites.map((n) => ({ ...n, isOpen: true })));

      showAlert("All notifications marked as read", "success");
    } catch (error) {
      console.error("Gagal update status baca ke server:", error);
      showAlert("Failed to update notifications", "error");
    }
  };

  const handleInvitationResponse = async (
    groupId: string,
    status: boolean,
    token: string,
  ) => {
    try {
      const res = await api.post("/Invitation/inviter-target-response", {
        groupId: groupId,
        currentEmail: user?.email,
        status: status,
        token: token,
      });

      if (res.data.status) {
        setInvites((prev) => prev.filter((inv) => inv.groupId !== groupId));
        showAlert(res.data.message, "success");
      }
    } catch (error: any) {
      const msg = error.response?.data?.message || "Gagal membuat grup";
      showAlert(msg, "error");
    }
  };

  return (
    <MainLayout>
      <div className="w-full space-y-8 p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Notifications
            </h1>
            <p className="text-muted-foreground mt-1">
              Stay updated with your team activity
            </p>
          </div>
          {unreadCount > 0 && (
            <Button
              variant="outline"
              onClick={handleMarkAllAsRead}
              className="w-full sm:w-auto"
            >
              Mark all as read
            </Button>
          )}
        </div>

        {unreadCount > 0 && (
          <Card className="p-4 bg-primary/10 border-primary/20">
            <div className="flex items-center justify-between">
              <p className="font-medium text-foreground">
                You have{" "}
                <span className="font-bold text-primary">{unreadCount}</span>{" "}
                unread notifications
              </p>
              <Badge className="bg-primary">{unreadCount}</Badge>
            </div>
          </Card>
        )}

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-primary" /> Group Invites
          </h2>
          <div className="space-y-2">
            {invites.length === 0 ? (
              <Card className="p-8 text-center border-dashed">
                <p className="text-sm text-muted-foreground">
                  No pending invites
                </p>
              </Card>
            ) : (
              invites.map((notification) => (
                <Card
                  key={notification.id}
                  className={`p-5 transition-all duration-200 ${
                    notification.isOpen
                      ? "bg-background"
                      : "bg-primary/5 border-primary/20 shadow-sm"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`rounded-full p-2.5 shrink-0 ${
                        notification.isOpen ? "bg-muted" : "bg-primary/20"
                      }`}
                    >
                      <UserPlus
                        className={`h-5 w-5 ${notification.isOpen ? "text-muted-foreground" : "text-primary"}`}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-bold text-foreground text-lg leading-none">
                              {notification.groupName}
                            </h3>
                            <Badge
                              variant="secondary"
                              className="text-[10px] uppercase tracking-wider"
                            >
                              Group Invite
                            </Badge>
                          </div>

                          <p className="text-sm font-medium text-primary mt-1">
                            Invited by: {notification.inviterName} (
                            {notification.inviterEmail})
                          </p>
                        </div>

                        <div className="flex flex-col items-end gap-1.5 shrink-0">
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {notification.timestamp}
                          </span>

                          {/* Slot Countdown Expired */}
                          <span className="text-[11px] font-medium text-destructive whitespace-nowrap bg-destructive/10 px-2 py-0.5 rounded-md font-mono animate-pulse">
                            {notification.expiredCountdown}
                          </span>
                          {/* 
                          {!notification.read && (
                            <div className="h-2.5 w-2.5 rounded-full bg-primary animate-pulse mt-0.5" />
                          )} */}
                        </div>
                      </div>

                      <div className="mt-3 space-y-2">
                        <div className="bg-muted/50 rounded-lg p-3 border border-border/50">
                          <p className="text-sm font-semibold text-foreground italic">
                            "{notification.message}"
                          </p>
                          {notification.groupDescription && (
                            <p className="text-xs text-muted-foreground mt-2 line-clamp-2 border-t pt-2 border-border/50">
                              <span className="font-semibold uppercase text-[10px]">
                                About group:
                              </span>{" "}
                              {notification.groupDescription}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-3 mt-4">
                        <Button
                          size="sm"
                          className="h-9 px-6 font-semibold shadow-sm transition-transform active:scale-95"
                          onClick={() =>
                            handleInvitationResponse(
                              notification.groupId,
                              true,
                              notification.token,
                            )
                          }
                        >
                          <Check className="mr-2 h-4 w-4" /> Accept
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          className="h-9 px-6 font-semibold text-destructive hover:bg-destructive/10 transition-transform active:scale-95"
                          onClick={() =>
                            handleInvitationResponse(
                              notification.groupId,
                              false,
                              notification.token,
                            )
                          }
                        >
                          <X className="mr-2 h-4 w-4" /> Decline
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Send className="h-5 w-5 text-primary" /> Project Activity
          </h2>
          <div className="space-y-2">
            {activities.length === 0 ? (
              <Card className="p-12 text-center">
                <p className="text-muted-foreground">No activity yet</p>
              </Card>
            ) : (
              activities.map((notification) => {
                const Icon = notification.icon;
                return (
                  <Card
                    key={notification.id}
                    className={`p-4 transition-all duration-200 ${
                      notification.isOpen
                        ? "bg-background border-border"
                        : "bg-primary/5 border-primary/30 shadow-sm ring-1 ring-primary/10"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`rounded-full p-2 ${
                          notification.isOpen
                            ? "bg-muted text-muted-foreground"
                            : "bg-primary/20 text-primary"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start gap-2 mb-1">
                          <p
                            className={`text-sm ${notification.isOpen ? "font-medium text-muted-foreground" : "font-bold text-foreground"}`}
                          >
                            {notification.title}
                          </p>
                          <p className="text-xs text-muted-foreground whitespace-nowrap mt-0.5">
                            {formatDate(notification.createdAt)}
                          </p>
                        </div>
                        <p
                          className={`text-sm ${
                            notification.isOpen
                              ? "text-muted-foreground/60"
                              : "text-muted-foreground"
                          }`}
                        >
                          {notification.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                );
              })
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
