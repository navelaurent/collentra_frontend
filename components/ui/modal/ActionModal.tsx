"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import api from "@/lib/axios";

type Variant = "success" | "danger" | "info";

interface ActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  endpoint: string;
  payload: any;
  icon: React.ReactNode;
  title: string;
  description: string;
  variant: Variant; // success = hijau, danger = merah, info = biru
  successMessage: string;
  failedMessage: string;
  onSuccess: (message: string) => void;
  onFailed: (message: string) => void;
}

export function ActionModal({
  isOpen,
  onClose,
  endpoint,
  payload,
  icon,
  title,
  description,
  variant,
  successMessage,
  failedMessage,
  onSuccess,
  onFailed,
}: ActionModalProps) {
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

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const res = await api.post(endpoint, payload);
      onSuccess(res.data?.message || successMessage);
      onClose();
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || failedMessage;
      onFailed(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  // mapping warna berdasarkan variant
  const variantClasses: Record<Variant, string> = {
    success: "bg-green-500 hover:bg-green-600 shadow-green-500/20 text-white",
    danger: "bg-red-500 hover:bg-red-600 shadow-red-500/20 text-white",
    info: "bg-blue-500 hover:bg-blue-600 shadow-blue-500/20 text-white",
  };

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
            {icon}
          </div>
          <h3 className="text-xl font-bold text-foreground tracking-tight">
            {title}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {description}
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
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 
              text-sm font-semibold rounded-xl transition-all active:scale-95 disabled:opacity-50 ${variantClasses[variant]}`}
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Confirm"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
