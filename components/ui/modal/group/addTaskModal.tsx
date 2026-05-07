"use client";

import React, { useState } from "react";
import { Loader2, Plus, Calendar } from "lucide-react";
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

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  groupId: string;
  members: any[];
  onSuccess: (message: string) => void;
  onFailed: (message: string) => void;
}

export const AddTaskModal = ({
  isOpen,
  onClose,
  userId,
  groupId,
  members,
  onSuccess,
  onFailed,
}: AddTaskModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    groupId: groupId,
    title: "",
    assigneeId: "",
    status: "todo",
    priority: "medium",
    dueDate: "",
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await api.post(
        "/Task/create-task",
        { ...form },
        {
          params: {
            userId: userId,
          },
        },
      );

      const successMsg = res.data?.message || "Successfully add this email";
      onSuccess(successMsg);
      onClose();

      setForm({
        groupId: groupId,
        title: "",
        assigneeId: "",
        status: "todo",
        priority: "medium",
        dueDate: "",
        description: "",
      });
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Server erorr !";
      onFailed(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ReusableModal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Task"
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">
            Task Title
          </label>
          <Input
            required
            placeholder="What needs to be done?"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="bg-white/5 border-white/10 text-white"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Assignee</label>
          <Select onValueChange={(v) => setForm({ ...form, assigneeId: v })}>
            <SelectTrigger className="w-full bg-white/5 border-white/10 text-white">
              <SelectValue placeholder="Select Member" />
            </SelectTrigger>
            <SelectContent className="bg-[#1e293b] border-white/10 text-white">
              {members?.map((m: any) => (
                <SelectItem key={m.id} value={m.id.toString()}>
                  {m.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Due Date</label>
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
            defaultValue="todo"
            onValueChange={(v) => setForm({ ...form, status: v })}
          >
            <SelectTrigger className="w-full bg-white/5 border-white/10 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#1e293b] border-white/10 text-white">
              <SelectItem value="Todo">To Do</SelectItem>
              <SelectItem value="InProgress">In Progress</SelectItem>
              <SelectItem value="InReview">In Review</SelectItem>
              <SelectItem value="Done">Done</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Priority</label>
          <Select
            defaultValue="medium"
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
            onChange={(e) => setForm({ ...form, description: e.target.value })}
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
                <Plus className="mr-2 h-4 w-4" /> Create Task
              </>
            )}
          </Button>
        </div>
      </form>
    </ReusableModal>
  );
};
