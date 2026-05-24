"use client";

import { MainLayout } from "@/components/layout/MainLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Edit,
  Plus,
  UserPlus,
  FileText,
  Download,
  Paperclip,
  Send,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import api from "@/lib/axios";
import { useAlert } from "@/components/ui/showAlert";
import { AddTaskModal } from "@/components/ui/modal/group/addTaskModal";
import { InviteMemberModal } from "@/components/ui/modal/group/inviteMemberModal";
import { getUserInfo } from "@/helpers/authHelpers";
import { EditGroupModal } from "@/components/ui/modal/group/editGroupModal";

export default function GroupDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const user = getUserInfo();
  const unwrappedParams = React.use(params);
  const id = unwrappedParams.id;
  const { showAlert } = useAlert();
  const [groupDetail, setGroupDetail] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isEditGroupOpen, setIsEditGroupOpen] = useState(false);
  const [isTaskOpen, setIsTaskOpen] = useState(false);

  const fetchGroupDetail = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/Group/group-detail", {
        params: { groupId: id },
      });
      if (response.data.data.status) {
        const rawData = response.data.data;
        setGroupDetail({
          ...rawData,
          overallProgress:
            rawData.taskTotal > 0
              ? Math.round((rawData.taskComplete / rawData.taskTotal) * 100)
              : 0,
        });
      }
    } catch (error: any) {
      showAlert(error.response?.data?.message || "Gagal memuat data", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchGroupDetail();
  }, [id]);

  if (isLoading)
    return (
      <MainLayout>
        <div className="flex h-96 items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </MainLayout>
    );

  // console.log(groupDetail, user?.sid);
  if (!groupDetail) return null;

  return (
    <MainLayout>
      <div className="space-y-8 p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {groupDetail.groupName}
            </h1>
            <p className="text-muted-foreground mt-1">
              {groupDetail.description}
            </p>
          </div>
          {user?.sid == groupDetail.groupOwnerId && (
            <>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={() => setIsEditGroupOpen(true)}
                >
                  <Edit className="h-4 w-4" /> Edit Group
                </Button>
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={() => setIsInviteOpen(true)}
                >
                  <UserPlus className="h-4 w-4" /> Invite Member
                </Button>
                <Button
                  className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500"
                  onClick={() => setIsTaskOpen(true)}
                >
                  <Plus className="h-4 w-4" /> Add Task
                </Button>
              </div>
            </>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card className="p-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Overall Progress</p>
              <p className="text-3xl font-bold text-foreground">
                {groupDetail.overallProgress}%
              </p>
              <Progress value={groupDetail.overallProgress} className="mt-3" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Tasks Completed</p>
              <p className="text-3xl font-bold text-foreground">
                {groupDetail.taskComplete} / {groupDetail.taskTotal}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                {groupDetail.taskTotal - groupDetail.taskComplete} tasks
                remaining
              </p>
            </div>
          </Card>
          <Card className="p-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Team Members</p>
              <p className="text-3xl font-bold text-foreground">
                {groupDetail.members?.length || 0}
              </p>
              <p className="text-xs text-muted-foreground mt-2">All active</p>
            </div>
          </Card>
        </div>

        <Tabs defaultValue="members" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="progress">Shared Documents</TabsTrigger>
          </TabsList>
          <TabsContent value="members" className="space-y-4">
            <Card className="p-6">
              <h3 className="font-semibold text-foreground mb-4">
                Team Members
              </h3>
              <div className="space-y-4">
                {groupDetail.members?.map((member: any) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between pb-4 border-b border-border last:border-0 last:pb-0"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {member.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-foreground">
                            {member.name}
                          </p>
                          {(member.role?.toLowerCase() === "admin" ||
                            member.role?.toLowerCase() === "owner") && (
                            <Badge
                              variant="secondary"
                              className="text-[10px] px-1.5 py-0 bg-amber-500/10 text-amber-600 border-amber-500/20"
                            >
                              Owner
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {member.tasksCompleted} tasks completed
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-foreground">
                        {member.progress}%
                      </p>
                      <Progress
                        value={member.progress}
                        className="w-20 h-1.5 mt-1"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
          <TabsContent value="tasks" className="space-y-4">
            <Card className="p-6">
              <h3 className="font-semibold text-foreground mb-4">Tasks</h3>
              <div className="space-y-3">
                {groupDetail.tasks?.map((task: any) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{task.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {task.assignee}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {task.dueDate}
                        </span>
                      </div>
                    </div>
                    <Badge
                      variant="secondary"
                      className={`text-xs ${task.status === "done" ? "bg-emerald-500/20 text-emerald-700" : "bg-slate-500/20"}`}
                    >
                      {task.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
          <TabsContent value="progress" className="space-y-4">
            <Card className="p-0 flex flex-col h-[500px] overflow-hidden">
              <div className="p-4 border-b border-border bg-muted/30">
                <h3 className="font-semibold text-foreground">
                  Shared Documents
                </h3>
                <p className="text-xs text-muted-foreground">
                  Share and download group files
                </p>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {[
                  {
                    id: 1,
                    senderId: "user-1",
                    senderName: "Budi Utomo",
                    fileName: "Requirements.pdf",
                    size: "2.4 MB",
                    time: "10:30 AM",
                  },
                  {
                    id: 2,
                    senderId: user?.sid,
                    senderName: "Agra Radhitya", // Menampilkan nama kamu saat ini
                    fileName: "Design_Assets.zip",
                    size: "15.1 MB",
                    time: "11:05 AM",
                  },
                  {
                    id: 3,
                    senderId: "user-2",
                    senderName: "Siti Aminah",
                    fileName: "Database_Schema.sql",
                    size: "124 KB",
                    time: "13:15 PM",
                  },
                ].map((chat) => {
                  const isMine = chat.senderId === user?.sid;
                  // Ambil huruf pertama dari nama untuk dijadikan inisial avatar
                  const initial = chat.senderName
                    ? chat.senderName.charAt(0).toUpperCase()
                    : "?";

                  return (
                    <div
                      key={chat.id}
                      className={`flex items-start gap-3 ${isMine ? "justify-end" : "justify-start"}`}
                    >
                      {!isMine && (
                        <Avatar className="h-8 w-8 shrink-0 mt-5">
                          <AvatarFallback className="bg-muted-foreground/20 text-foreground text-xs font-semibold">
                            {initial}
                          </AvatarFallback>
                        </Avatar>
                      )}

                      <div
                        className={`flex flex-col max-w-[85%] sm:max-w-[70%] ${isMine ? "items-end" : "items-start"}`}
                      >
                        <span className="text-xs text-muted-foreground mb-1 px-1">
                          {isMine ? "You" : chat.senderName}
                        </span>

                        <div
                          className={`p-3 rounded-2xl flex items-center gap-3 ${
                            isMine
                              ? "bg-primary text-primary-foreground rounded-tr-sm"
                              : "bg-muted text-foreground rounded-tl-sm"
                          }`}
                        >
                          <div
                            className={`p-2 rounded-lg flex-shrink-0 ${
                              isMine
                                ? "bg-primary-foreground/20"
                                : "bg-background"
                            }`}
                          >
                            <FileText className="h-5 w-5" />
                          </div>

                          <div className="flex flex-col overflow-hidden pr-2">
                            <span className="font-medium text-sm truncate max-w-[120px] sm:max-w-[200px]">
                              {chat.fileName}
                            </span>
                            <span className="text-[11px] opacity-70 mt-0.5">
                              {chat.size} • {chat.time}
                            </span>
                          </div>

                          <Button
                            variant={isMine ? "secondary" : "outline"}
                            size="icon"
                            className={`h-8 w-8 rounded-full shrink-0 ${isMine ? "hover:bg-primary-foreground/20" : ""}`}
                            onClick={() =>
                              console.log("Download", chat.fileName)
                            }
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {isMine && (
                        <Avatar className="h-8 w-8 shrink-0 mt-5">
                          <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                            {initial}
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="p-4 border-t border-border bg-card shadow-sm z-10">
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    className="hidden"
                    id="file-upload"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) console.log("File selected:", file.name);
                    }}
                  />
                  <label
                    htmlFor="file-upload"
                    className="flex-1 cursor-pointer"
                  >
                    <div className="flex items-center gap-2 w-full px-4 py-2.5 border rounded-lg hover:bg-muted/80 transition-colors border-dashed border-muted-foreground/40 bg-muted/50">
                      <Paperclip className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span className="text-sm text-muted-foreground truncate">
                        Select a document to share...
                      </span>
                    </div>
                  </label>
                  <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2 has-[>svg]:px-3 gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500">
                    <Send className="h-4 w-4" />
                    <span className="hidden sm:inline">Send</span>
                  </button>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {user?.sid == groupDetail.groupOwnerId && (
        <>
          <EditGroupModal
            isOpen={isEditGroupOpen}
            onClose={() => setIsEditGroupOpen(false)}
            groupId={id}
            groupName={groupDetail.groupName}
            groupDesc={groupDetail.description}
            groupArchived={groupDetail.isArchived}
            onSuccess={(msg: any) => {
              showAlert(msg, "success");
              fetchGroupDetail();
            }}
            onFailed={(msg: any) => {
              showAlert(msg, "error");
            }}
          />

          <InviteMemberModal
            isOpen={isInviteOpen}
            onClose={() => setIsInviteOpen(false)}
            groupId={id}
            onSuccess={(msg: any) => {
              showAlert(msg, "success");
              fetchGroupDetail();
            }}
            onFailed={(msg: any) => {
              showAlert(msg, "error");
            }}
          />

          <AddTaskModal
            isOpen={isTaskOpen}
            onClose={() => setIsTaskOpen(false)}
            userId={user?.sid}
            groupId={id}
            members={groupDetail.members}
            onSuccess={(msg: any) => {
              showAlert(msg, "success");
              fetchGroupDetail();
            }}
            onFailed={(msg: any) => {
              showAlert(msg, "error");
            }}
          />
        </>
      )}
    </MainLayout>
  );
}
