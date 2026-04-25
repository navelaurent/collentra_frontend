"use client";

import { useState, useEffect } from "react";
import { LogOut } from "lucide-react";

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function LogoutModal({ isOpen, onClose, onConfirm }: LogoutModalProps) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setAnimate(true), 10);
      return () => clearTimeout(timer);
    } else {
      setAnimate(false);
    }
  }, [isOpen]);

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
            <LogOut className="h-7 w-7 text-destructive" />
          </div>
          <h3 className="text-xl font-bold text-foreground tracking-tight">
            Sudah selesai, Agra?
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Sesi kamu akan ditutup. Jangan lupa simpan semua perubahan data
            sebelum keluar.
          </p>
        </div>

        <div className="flex gap-3 p-6 pt-0">
          <button
            className="flex-1 px-4 py-2.5 text-sm font-semibold rounded-xl bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-all active:scale-95"
            onClick={onClose}
          >
            Batal
          </button>
          <button
            className="flex-1 px-4 py-2.5 text-sm font-semibold rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-lg shadow-destructive/20 transition-all active:scale-95"
            onClick={onConfirm}
          >
            Ya, Logout
          </button>
        </div>
      </div>
    </div>
  );
}
