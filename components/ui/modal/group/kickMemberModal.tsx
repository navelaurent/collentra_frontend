"use client";

import { useState, useEffect } from "react";
import { UserX, Loader2 } from "lucide-react";
import api from "@/lib/axios";

interface KickMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupId: string;
  ownerId: string;
  kickedId: string;
  onSuccess: (message: string) => void;
  onFailed: (message: string) => void;
}

export function KickMemberModal({
  isOpen,
  onClose,
  groupId,
  ownerId,
  kickedId,
  onSuccess,
  onFailed,
}: KickMemberModalProps) {
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

  const handleKickSubmit = async () => {
    setIsSubmitting(true);
    try {
      const res = await api.post(`/Group/kick-member/${groupId}`, {
        leaderId: ownerId,
        kickedMemberId: kickedId,
      });

      const successMsg = res.data?.message;

      onSuccess(successMsg);
      onClose();
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.message || "Server error, failed to kick member!";
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
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 ring-8 ring-destructive/5">
            <UserX className="h-7 w-7 text-destructive" />
          </div>
          <h3 className="text-xl font-bold text-foreground tracking-tight"></h3>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Are you sure you want to remove this member? They will lose access
            to all group conversations and data.
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
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-lg shadow-destructive/20 transition-all active:scale-95 disabled:opacity-50"
            onClick={handleKickSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Yes, Kick"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
