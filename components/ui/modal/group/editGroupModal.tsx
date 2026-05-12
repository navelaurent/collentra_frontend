"use client";

import React, { useState } from "react";
import { Edit2Icon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import api from "@/lib/axios";
import { ReusableModal } from "../reusableModal";
import { getUserInfo } from "@/helpers/authHelpers";
import { Switch } from "../../switch";

interface EditGroupModal {
  isOpen: boolean;
  onClose: () => void;
  groupId: string;
  groupName: string;
  groupDesc: string;
  groupArchived: boolean;
  onSuccess: (message: string) => void;
  onFailed: (message: string) => void;
}

export const EditGroupModal = ({
  isOpen,
  onClose,
  groupId,
  groupName,
  groupDesc,
  groupArchived,
  onSuccess,
  onFailed,
}: EditGroupModal) => {
  const user = getUserInfo();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    groupId: groupId,
    name: groupName,
    userId: user?.sid,
    description: groupDesc,
    isArchived: groupArchived,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await api.put(`/Group/${groupId}`, { ...form });
      const successMsg = res.data?.message || "Successfully update this group";

      onSuccess(successMsg);
      onClose();
      setForm({
        groupId: groupId,
        name: groupName,
        userId: user?.sid,
        description: groupDesc,
        isArchived: groupArchived,
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
      title="Edit Group Information"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">
            Group Name
          </label>
          <Input
            required
            placeholder="What needs to be done?"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="bg-white/5 border-white/10 text-white"
          />
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

        <div className="flex items-center justify-between space-y-0 rounded-lg border border-white/10 p-3 bg-white/5">
          <div className="space-y-0.5">
            <label className="text-sm font-medium text-gray-300">
              Archive Group
            </label>
            <p className="text-xs text-gray-500">
              {form.isArchived ? "Group will be hidden" : "Project is active"}
            </p>
          </div>
          <Switch
            checked={form.isArchived}
            onCheckedChange={(checked) =>
              setForm({ ...form, isArchived: checked })
            }
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
                <Edit2Icon className="mr-2 h-4 w-4" /> Update Group
              </>
            )}
          </Button>
        </div>
      </form>
    </ReusableModal>
  );
};
