"use client";

import React, { useState, useEffect } from "react";
import { Loader2, Save, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ReusableModal } from "../reusableModal";
import api from "@/lib/axios";

interface EditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  groupId: string;
  task: any;
  onSuccess: (message: string) => void;
  onFailed: (message: string) => void;
}

export const EditTaskModal = ({
  isOpen,
  onClose,
  userId,
  groupId,
  task,
  onSuccess,
  onFailed,
}: EditTaskModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [form, setForm] = useState({
    groupId: "",
    title: "",
    assigneeId: "",
    assignee: "",
    status: "",
    priority: "",
    dueDate: "",
    description: "",
  });

  useEffect(() => {
    const fetchTaskDetails = async () => {
      if (!isOpen || !task?.id) return;

      setIsLoadingData(true);
      try {
        const res = await api.get("/Task/get-edit", {
          params: {
            taskId: task.id,
          },
        });

        const dbTask = res.data.data;

        if (dbTask) {
          const normalizeStatus = (statusStr: any) => {
            if (!statusStr) return "Todo";
            const s = String(statusStr).toLowerCase().trim();
            if (s === "todo") return "Todo";
            if (s === "inprogress" || s === "in_progress") return "InProgress";
            if (s === "inreview" || s === "in_review") return "InReview";
            if (s === "done") return "Done";
            return "Todo";
          };

          const normalizePriority = (priorityStr: any) => {
            if (!priorityStr) return "Low";
            const p = String(priorityStr).toLowerCase().trim();
            if (p === "low") return "Low";
            if (p === "medium") return "Medium";
            if (p === "high") return "High";
            if (p === "critical") return "Critical";
            return "Low";
          };

          let formattedDate = "";
          if (dbTask.dueDate) {
            formattedDate = dbTask.dueDate.split("T")[0];
          }

          setForm({
            groupId: dbTask.groupId,
            title: dbTask.title,
            assigneeId: dbTask.assigneeId,
            assignee: dbTask.assigneeName?.toString(),
            status: normalizeStatus(dbTask.status),
            priority: normalizePriority(dbTask.priority),
            dueDate: formattedDate,
            description: dbTask.description,
          });
        }
      } catch (error: any) {
        console.error("Error fetching task details:", error);
        onFailed("Failed to fetch latest task details from server.");
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchTaskDetails();
  }, [isOpen, task?.id, groupId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await api.put(
        "/Task/edit-task",
        {
          groupId: form.groupId,
          title: form.title,
          description: form.description,
          assigneeId: form.assigneeId,
          priority: form.priority,
          dueDate: form.dueDate,
          estimatedHours: 0,
          actualHours: 0,
          sortOrder: 0,
        },
        {
          params: {
            userId: userId,
            taskId: task.id,
          },
        },
      );

      const successMsg = res.data?.message || "Task updated successfully";
      onSuccess(successMsg);
      onClose();
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Server error!";
      onFailed(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ReusableModal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Task Details"
      maxWidth="max-w-lg"
    >
      {isLoadingData ? (
        <div className="flex h-60 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">
              Task Title
            </label>
            <Input
              disabled
              placeholder="What needs to be done?"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="bg-white/5 border-white/10 text-white"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">
              Assignee
            </label>
            <Input
              disabled
              value={form.assignee}
              onChange={(e) => setForm({ ...form, assignee: e.target.value })}
              className="bg-white/5 border-white/10 text-white"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">
              Due Date
            </label>
            <div className="relative">
              <Input
                type="date"
                value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                className="bg-white/5 border-white/10 text-white pl-10 block w-full"
              />
              <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Status</label>
            <Select
              disabled
              value={form.status}
              onValueChange={(v) => setForm({ ...form, status: v })}
            >
              <SelectTrigger className="w-full bg-white/5 border-white/10 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#1e293b] border-white/10 text-white">
                <SelectItem value="Todo">To Do</SelectItem>
                <SelectItem value="InProgress">In Progress</SelectItem>
                <SelectItem value="InReview">In Review</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">
              Priority
            </label>
            <Select
              value={form.priority}
              onValueChange={(v) => setForm({ ...form, priority: v })}
            >
              <SelectTrigger className="w-full bg-white/5 border-white/10 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#1e293b] border-white/10 text-white">
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">
              Description
            </label>
            <textarea
              placeholder="Details about this task..."
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="flex min-h-[80px] w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:ring-1 focus:ring-purple-500/50"
            />
          </div>

          <div className="flex gap-3 mt-8">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="flex-1 text-gray-400"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" /> Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      )}
    </ReusableModal>
  );
};
