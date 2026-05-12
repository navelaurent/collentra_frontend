"use client";

import { MainLayout } from "@/components/layout/MainLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { Edit, Plus, UserPlus } from "lucide-react";
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
            <TabsTrigger value="progress">Progress</TabsTrigger>
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
            <Card className="p-6">
              <h3 className="font-semibold text-foreground mb-4">
                Progress Tracking
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={groupDetail.historyProgress || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="week" stroke="var(--muted-foreground)" />
                  <YAxis stroke="var(--muted-foreground)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: "0.5rem",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="progress"
                    stroke="var(--primary)"
                    strokeWidth={2}
                    dot={{ fill: "var(--primary)", r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
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
