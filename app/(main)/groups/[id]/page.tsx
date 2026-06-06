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
  MoreVertical,
  UserMinus,
  Calendar,
  CheckCircle,
  XCircle,
  Star,
  Power,
  Play,
  ShieldCheck,
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
import { ManageMemberModal } from "@/components/ui/modal/group/ManageMemberModal";
import { EditTaskModal } from "@/components/ui/modal/group/editTaskModal";
import { ActionModal } from "@/components/ui/modal/ActionModal";
import { RateUserModal } from "@/components/ui/modal/group/RateUserModal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SharedDocumentsTab } from "@/components/groups/sharedDocumentTab";

export default function GroupDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const user = getUserInfo();
  const unwrappedParams = React.use(params);
  const id = unwrappedParams.id;
  const [isLoading, setIsLoading] = useState(true);
  const { showAlert } = useAlert();

  const [groupDetail, setGroupDetail] = useState<any>(null);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("tasks");
  const [taskFilter, setTaskFilter] = useState<"all" | "mine">("all");
  const [selectedMember, setSelectedMember] = useState<{
    kickedId: string;
  } | null>(null);
  const [selectedRating, setSelectedselectedRating] = useState<{
    TargetId: string;
    TargetName: string;
    TargetEmail: string;
  } | null>(null);

  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isEditGroupOpen, setIsEditGroupOpen] = useState(false);
  const [isTaskOpen, setIsTaskOpen] = useState(false);
  const [isKickOpen, setIsKickOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [isTerminateModalOpen, setIsTerminateModalOpen] = useState(false);
  const [isRatingOpen, setIsRatingOpen] = useState(false);
  const [isDoTaskOpen, setIsDoTaskOpen] = useState(false);
  const [isPromoteOpen, setIsPromoteOpen] = useState(false);

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
      showAlert(error.response?.data?.message || "Failed Load Data", "error");
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
            <TabsTrigger value="progress">Shared Works</TabsTrigger>
          </TabsList>

          <TabsContent value="tasks" className="space-y-4">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground">Tasks</h3>

                <Select
                  value={taskFilter}
                  onValueChange={(value) =>
                    setTaskFilter(value as "all" | "mine")
                  }
                >
                  <SelectTrigger className="w-[140px] text-xs bg-white/5 border-white/10 text-white">
                    <SelectValue placeholder="Filter Tasks" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1e293b] border-white/10 text-white">
                    <SelectItem value="all" className="text-xs cursor-pointer">
                      All Tasks
                    </SelectItem>
                    <SelectItem value="mine" className="text-xs cursor-pointer">
                      Only My Tasks
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                {(() => {
                  const filteredTasks =
                    groupDetail.tasks?.filter((task: any) => {
                      if (taskFilter === "mine") {
                        return task.assigneeId === user?.sid;
                      }
                      return true;
                    }) || [];

                  return filteredTasks.length > 0 ? (
                    filteredTasks.map((task: any) => (
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
                                      : task.priority?.toLowerCase() ===
                                          "medium"
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
                                <span className="text-[11px]">
                                  Assigned To:
                                </span>
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
                                    : task.status?.toLowerCase() ===
                                        "inprogress"
                                      ? "bg-sky-500/10 text-sky-400 border border-sky-500/20"
                                      : task.status?.toLowerCase() ===
                                          "terminate"
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

                        {(user?.sid === groupDetail?.groupOwnerId ||
                          user?.sid === task?.assigneeId) &&
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
                                <DropdownMenuContent
                                  align="end"
                                  className="w-40"
                                >
                                  {user?.sid === task?.assigneeId &&
                                    task?.status?.toLowerCase() === "todo" && (
                                      <>
                                        <DropdownMenuItem
                                          className="cursor-pointer text-indigo-500 focus:text-indigo-400 focus:bg-indigo-500/10 font-medium"
                                          onClick={() => {
                                            setSelectedTask(task.id);
                                            setIsDoTaskOpen(true);
                                          }}
                                        >
                                          <Play className="mr-2 h-4 w-4" />
                                          Do this Task !
                                        </DropdownMenuItem>
                                      </>
                                    )}

                                  {user?.sid == groupDetail.groupOwnerId &&
                                    task?.status?.toLowerCase() !== "done" &&
                                    task?.status?.toLowerCase() !==
                                      "terminate" && (
                                      <>
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

                                        {user?.sid ==
                                          groupDetail.groupOwnerId &&
                                          task?.status?.toLowerCase() ===
                                            "inreview" && (
                                            <>
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
                                            </>
                                          )}
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
                                      </>
                                    )}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </>
                          )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 border border-dashed rounded-lg text-muted-foreground text-sm">
                      No task found
                    </div>
                  );
                })()}
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

                      {user?.sid != member.id && (
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
                              {user?.sid == groupDetail.groupOwnerId &&
                                user?.sid != member.id && (
                                  <>
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

                                    <DropdownMenuItem
                                      className="text-indigo-500 focus:text-indigo-500 focus:bg-indigo-500/10 cursor-pointer"
                                      onClick={() => {
                                        setSelectedMember({
                                          kickedId: member.id,
                                        });
                                        setIsPromoteOpen(true);
                                      }}
                                    >
                                      <ShieldCheck className="mr-2 h-4 w-4" />
                                      Make Admin
                                    </DropdownMenuItem>
                                  </>
                                )}
                              {user?.sid != member.id && (
                                <>
                                  <DropdownMenuItem
                                    className="text-yellow-500 focus:text-yellow-500 focus:bg-yellow-500/10 cursor-pointer"
                                    onClick={() => {
                                      setSelectedselectedRating({
                                        TargetId: member.id,
                                        TargetName: member.name,
                                        TargetEmail: member.emailMember,
                                      });
                                      setIsRatingOpen(true);
                                    }}
                                  >
                                    <Star className="mr-2 h-4 w-4" />
                                    Rate Person
                                  </DropdownMenuItem>
                                </>
                              )}
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
            <SharedDocumentsTab
              groupId={id}
              user={user}
              tasks={groupDetail.tasks}
            />
          </TabsContent>
        </Tabs>
      </div>

      {user?.sid != selectedRating?.TargetId && (
        <>
          <RateUserModal
            isOpen={isRatingOpen}
            onClose={() => setIsRatingOpen(false)}
            groupId={id}
            userId={user?.sid}
            targetUserId={selectedRating?.TargetId}
            groupName={groupDetail.groupName}
            targetUserName={selectedRating?.TargetName}
            targetUserEmail={selectedRating?.TargetEmail}
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

      <ActionModal
        isOpen={isDoTaskOpen}
        onClose={() => setIsDoTaskOpen(false)}
        endpoint={`/Task/change-status`}
        payload={{
          groupId: id,
          leaderId: user?.sid,
          taskId: selectedTask,
          statusTask: "In Progress",
        }}
        icon={<Play className="h-7 w-7 text-indigo-500" />}
        title="Start This Task"
        variant="success"
        description="Are you sure you want to Start this task?"
        successMessage="Task Started!"
        failedMessage="Failed to Start task!"
        onSuccess={(msg: any) => {
          showAlert(msg, "success");
          fetchGroupDetail();
        }}
        onFailed={(msg: any) => {
          showAlert(msg, "error");
        }}
      />

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

          <ManageMemberModal
            isOpen={isKickOpen}
            onClose={() => setIsKickOpen(false)}
            groupId={id}
            ownerId={groupDetail.groupOwnerId}
            targetMemberId={selectedMember?.kickedId || ""}
            actionType="kick"
            onSuccess={(msg: any) => {
              showAlert(msg, "success");
              fetchGroupDetail();
            }}
            onFailed={(msg: any) => {
              showAlert(msg, "error");
            }}
          />

          <ManageMemberModal
            isOpen={isPromoteOpen}
            onClose={() => setIsPromoteOpen(false)}
            groupId={id}
            ownerId={groupDetail.groupOwnerId}
            targetMemberId={selectedMember?.kickedId || ""}
            actionType="promote"
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
            endpoint={`/Task/change-status`}
            payload={{
              groupId: id,
              leaderId: user?.sid,
              taskId: selectedTask,
              statusTask: "Done",
            }}
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
            endpoint={`/Task/change-status`}
            payload={{
              groupId: id,
              leaderId: user?.sid,
              taskId: selectedTask,
              statusTask: "Terminate",
            }}
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
