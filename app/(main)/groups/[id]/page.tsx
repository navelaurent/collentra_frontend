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
  MoreVertical,
  UserMinus,
  Calendar,
  CheckCircle,
  XCircle,
  Star,
  Power,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import api from "@/lib/axios";
import { useAlert } from "@/components/ui/showAlert";
import { AddTaskModal } from "@/components/ui/modal/group/addTaskModal";
import { InviteMemberModal } from "@/components/ui/modal/group/inviteMemberModal";
import { getUserInfo } from "@/helpers/authHelpers";
import { EditGroupModal } from "@/components/ui/modal/group/editGroupModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { KickMemberModal } from "@/components/ui/modal/group/kickMemberModal";
import { EditTaskModal } from "@/components/ui/modal/group/editTaskModal";
import { ActionModal } from "@/components/ui/modal/ActionModal";

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
  const [isKickOpen, setIsKickOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<{
    kickedId: string;
  } | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [isTerminateModalOpen, setIsTerminateModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("tasks");

  const fetchGroupDetail = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/Group/group-detail", {
        params: { groupId: id },
      });
      if (response.data.data.status) {
        const rawData = response.data.data;

        const isStillMember = rawData.members?.some(
          (member: any) =>
            member.id?.toLowerCase() === user?.sid?.toLowerCase(),
        );

        if (
          !isStillMember &&
          user?.sid?.toLowerCase() !== rawData.groupOwnerId?.toLowerCase()
        ) {
          window.location.href = "/";
          return;
        }

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

  if (!groupDetail) return null;

  return (
    <MainLayout>
      <div className="space-y-8 p-4 sm:p-6 lg:p-8">
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

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="progress">Shared Documents</TabsTrigger>
          </TabsList>

          <TabsContent value="tasks" className="space-y-4">
            <Card className="p-6">
              <h3 className="font-semibold text-foreground mb-4">Tasks</h3>
              <div className="space-y-3">
                {groupDetail.tasks?.map((task: any) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex flex-1 flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1 min-w-0 space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-semibold text-sm md:text-base text-foreground tracking-tight truncate">
                            {task.name}
                          </p>

                          <Badge
                            variant="outline"
                            className={`text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider rounded ${
                              task.priority?.toLowerCase() === "critical"
                                ? "bg-red-500/10 text-red-400 border-red-500/30"
                                : task.priority?.toLowerCase() === "high"
                                  ? "bg-orange-500/10 text-orange-400 border-orange-500/30"
                                  : task.priority?.toLowerCase() === "medium"
                                    ? "bg-blue-500/10 text-blue-400 border-blue-500/30"
                                    : "bg-slate-500/10 text-slate-400 border-slate-500/20"
                            }`}
                          >
                            {task.priority}
                          </Badge>
                        </div>

                        {task.description && (
                          <p className="text-xs text-muted-foreground/80 line-clamp-2 max-w-xl bg-black/10 p-2 rounded border border-white/5">
                            {task.description}
                          </p>
                        )}

                        <div className="flex flex-wrap items-center gap-3 text-xs pt-1">
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <span className="text-[11px]">Assigned To:</span>
                            <Badge
                              variant="secondary"
                              className="text-[11px] font-medium px-2 py-0 bg-white/5 text-gray-300"
                            >
                              {task.assignee || "Unassigned"}
                            </Badge>
                          </div>

                          {task.dueDate && (
                            <div className="flex items-center gap-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded text-[11px] font-medium">
                              <Calendar className="h-3 w-3" />
                              <span>Due: {task.dueDate.split("T")[0]}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-start md:self-center">
                        <Badge
                          variant="secondary"
                          className={`text-xs px-3 py-1 font-medium capitalize tracking-wide rounded-full ${
                            task.status?.toLowerCase() === "done"
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : task.status?.toLowerCase() === "inreview"
                                ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                                : task.status?.toLowerCase() === "inprogress"
                                  ? "bg-sky-500/10 text-sky-400 border border-sky-500/20"
                                  : task.status?.toLowerCase() === "terminate"
                                    ? "bg-red-500/10 text-red-400 border border-red-500/20"
                                    : "bg-zinc-500/10 text-zinc-400 border border-zinc-500/20"
                          }`}
                        >
                          {task.status === "inprogress"
                            ? "In Progress"
                            : task.status === "inreview"
                              ? "In Review"
                              : task.status}
                        </Badge>
                      </div>
                    </div>

                    {user?.sid == groupDetail.groupOwnerId &&
                      task?.status?.toLowerCase() !== "done" &&
                      task?.status?.toLowerCase() !== "terminate" && (
                        <>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                              >
                                <MoreVertical className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40">
                              <DropdownMenuItem
                                className="cursor-pointer text-yellow-400 focus:text-yellow-400 focus:bg-yellow-500/10"
                                onClick={() => {
                                  setSelectedTask(task);
                                  setIsEditModalOpen(true);
                                }}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Task
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="cursor-pointer text-green-400 focus:text-green-400 focus:bg-green-500/10"
                                onClick={() => {
                                  setSelectedTask(task.id);
                                  setIsCompleteModalOpen(true);
                                }}
                              >
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Complete Task
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="cursor-pointer text-red-400 focus:text-red-400 focus:bg-red-500/10"
                                onClick={() => {
                                  setSelectedTask(task.id);
                                  setIsTerminateModalOpen(true);
                                }}
                              >
                                <XCircle className="mr-2 h-4 w-4" />
                                Terminate Task
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </>
                      )}
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="members" className="space-y-4">
            <Card className="p-6">
              <h3 className="font-semibold text-foreground mb-4">
                Team Members
              </h3>
              <div className="space-y-4">
                {groupDetail.members?.map((member: any) => (
                  <div
                    key={member.id}
                    className={`flex items-center justify-between p-4 border-b border-border last:border-0 last:pb-0 
                    ${member.id === user?.sid ? "bg-blue-50 dark:bg-blue-900/20 rounded-md" : ""}`}
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
                            {member.name}{" "}
                            <span className="text-xs font-normal text-muted-foreground/80 dark:text-gray-400">
                              ({member.emailMember})
                            </span>
                          </p>
                          {(member.role?.toLowerCase() === "admin" ||
                            member.role?.toLowerCase() === "owner") && (
                            <Badge
                              variant="secondary"
                              className="text-[10px] px-1.5 py-0 bg-green-500/10 text-green-600 border-green-500/20"
                            >
                              <Star />
                              Leader
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {member.tasksCompleted} / {member.totalTasks} tasks
                          completed
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-semibold text-foreground">
                          {member.totalTasks > 0
                            ? Math.round(
                                (member.tasksCompleted / member.totalTasks) *
                                  100,
                              )
                            : 0}
                          %
                        </p>
                        <Progress
                          value={
                            member.totalTasks > 0
                              ? Math.round(
                                  (member.tasksCompleted / member.totalTasks) *
                                    100,
                                )
                              : 0
                          }
                          className="w-20 h-1.5 mt-1"
                        />
                      </div>

                      {user?.sid == groupDetail.groupOwnerId && (
                        <>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                              >
                                <MoreVertical className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40">
                              <DropdownMenuItem
                                className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer"
                                onClick={() => {
                                  setSelectedMember({
                                    kickedId: member.id,
                                  });
                                  setIsKickOpen(true);
                                }}
                              >
                                <UserMinus className="mr-2 h-4 w-4" />
                                Kick Member
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </>
                      )}
                    </div>
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
                    senderName: "Agra Radhitya",
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

          <KickMemberModal
            isOpen={isKickOpen}
            onClose={() => setIsKickOpen(false)}
            groupId={id}
            ownerId={groupDetail.groupOwnerId}
            kickedId={selectedMember?.kickedId || ""}
            onSuccess={(msg: any) => {
              showAlert(msg, "success");
              fetchGroupDetail();
            }}
            onFailed={(msg: any) => {
              showAlert(msg, "error");
            }}
          />

          <EditTaskModal
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              setSelectedTask(null);
            }}
            userId={user?.sid}
            groupId={id}
            task={selectedTask}
            onSuccess={(msg: any) => {
              showAlert(msg, "success");
              fetchGroupDetail();
            }}
            onFailed={(msg: any) => {
              showAlert(msg, "error");
            }}
          />

          <ActionModal
            isOpen={isCompleteModalOpen}
            onClose={() => setIsCompleteModalOpen(false)}
            endpoint={`/Task/complete-task`}
            payload={{ leaderId: user?.sid, taskId: selectedTask }}
            icon={<CheckCircle className="h-7 w-7 text-green-600" />}
            title="Complete Task"
            variant="success"
            description="Mark this task as completed?"
            successMessage="Task completed!"
            failedMessage="Failed to complete task!"
            onSuccess={(msg: any) => {
              showAlert(msg, "success");
              fetchGroupDetail();
            }}
            onFailed={(msg: any) => {
              showAlert(msg, "error");
            }}
          />

          <ActionModal
            isOpen={isTerminateModalOpen}
            onClose={() => setIsTerminateModalOpen(false)}
            endpoint={`/Task/terminate-task`}
            payload={{ leaderId: user?.sid, taskId: selectedTask }}
            icon={<Power className="h-7 w-7 text-red-500" />}
            title="Terminate Task"
            variant="danger"
            description="Are you sure you want to terminate this task?"
            successMessage="Task terminated!"
            failedMessage="Failed to terminate task!"
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
