"use client";

import { useState, useEffect } from "react";
import { UserX, ShieldCheck, Loader2, SquareArrowLeft } from "lucide-react";
import api from "@/lib/axios";

export type ManageMemberAction = "kick" | "promote" | "leave";

interface ManageMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupId: string;
  ownerId: string;
  targetMemberId: string;
  actionType: ManageMemberAction;
  onSuccess: (message: string) => void;
  onFailed: (message: string) => void;
}

export function ManageMemberModal({
  isOpen,
  onClose,
  groupId,
  ownerId,
  targetMemberId,
  actionType,
  onSuccess,
  onFailed,
}: ManageMemberModalProps) {
  const [animate, setAnimate] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setAnimate(true), 10);
      return () => clearTimeout(timer);
    } else {
      setAnimate(false);
    }
  }, [isOpen]);

  const config = {
    kick: {
      title: "Kick Member",
      desc: "Are you sure you want to remove this member? They will lose access to all group conversations and data.",
      btnText: "Yes, Kick",
      icon: <UserX className="h-7 w-7 text-destructive" />,
      iconBgClass: "bg-destructive/10 ring-8 ring-destructive/5",
      btnClass:
        "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-destructive/20",
      apiEndpoint: `/Group/kick-member/${groupId}`,
      payload: { leaderId: ownerId, kickedMemberId: targetMemberId },
    },
    promote: {
      title: "Promote to Admin",
      desc: "Are you sure you want to promote this member? They will have administrative privileges to manage the group.",
      btnText: "Yes, Promote",
      icon: <ShieldCheck className="h-7 w-7 text-primary" />,
      iconBgClass: "bg-primary/10 ring-8 ring-primary/5",
      btnClass:
        "bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary/20",
      apiEndpoint: `/Group/promote-member/${groupId}`,
      payload: { leaderId: ownerId, kickedMemberId: targetMemberId },
    },
    leave: {
      title: "Leave Group",
      desc: "Are you sure you want to leave this group? You will lose access to all group conversations, tasks, and data immediately.",
      btnText: "Yes, Leave",
      icon: <SquareArrowLeft className="h-7 w-7 text-destructive" />,
      iconBgClass: "bg-destructive/10 ring-8 ring-destructive/5",
      btnClass:
        "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-lg shadow-destructive/20",
      apiEndpoint: `/Group/leave-group/${groupId}`,
      payload: { leaderId: ownerId, kickedMemberId: targetMemberId },
    },
  };

  const currentConfig = config[actionType];

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const res = await api.post(
        currentConfig.apiEndpoint,
        currentConfig.payload,
      );
      const successMsg =
        res.data?.message || `Successfully ${actionType}d member!`;

      onSuccess(successMsg);
      onClose();
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.message ||
        `Server error, failed to ${actionType} member!`;
      onFailed(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-300 ease-out ${
        animate
          ? "bg-black/40 backdrop-blur-sm opacity-100"
          : "bg-black/0 backdrop-blur-none opacity-0"
      }`}
      onClick={onClose}
    >
      <div
        className={`w-full max-w-sm overflow-hidden rounded-2xl bg-card border border-border shadow-2xl transition-all duration-300 ease-out ${
          animate
            ? "translate-y-0 scale-100 opacity-100"
            : "translate-y-4 scale-95 opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8 text-center">
          <div
            className={`mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full ${currentConfig.iconBgClass}`}
          >
            {currentConfig.icon}
          </div>
          <h3 className="text-xl font-bold text-foreground tracking-tight">
            {currentConfig.title}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {currentConfig.desc}
          </p>
        </div>

        <div className="flex gap-3 p-6 pt-0">
          <button
            type="button"
            className="flex-1 px-4 py-2.5 text-sm font-semibold rounded-xl bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-all active:scale-95 disabled:opacity-50"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </button>

          <button
            type="button"
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl shadow-lg transition-all active:scale-95 disabled:opacity-50 ${currentConfig.btnClass}`}
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              currentConfig.btnText
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
