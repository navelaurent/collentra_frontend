"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";
import { AlertCircle, CheckCircle2, X } from "lucide-react";

type AlertType = "success" | "error";

interface AlertContextType {
  showAlert: (message: string, type: AlertType) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider = ({ children }: { children: ReactNode }) => {
  const [alert, setAlert] = useState<{
    show: boolean;
    message: string;
    type: AlertType;
  }>({
    show: false,
    message: "",
    type: "success",
  });

  const showAlert = (message: string, type: AlertType) => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert((prev) => ({ ...prev, show: false })), 4000);
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}

      <div
        className={`fixed top-8 right-8 z-[100] flex items-start gap-4 px-8 py-6 rounded-3xl border backdrop-blur-xl shadow-2xl transition-all flex-col min-w-[380px] max-w-[500px] ${
          alert.type === "success"
            ? "bg-green-500/10 border-green-500/30 text-green-300"
            : "bg-red-500/10 border-red-500/30 text-red-300"
        }`}
        style={{
          transition: "all 0.6s cubic-bezier(0.22, 1, 0.36, 1)",
          opacity: alert.show ? 1 : 0,
          transform: alert.show
            ? "translateY(0) scale(1)"
            : "translateY(-20px) scale(0.95)",
          pointerEvents: alert.show ? "auto" : "none",
          visibility: alert.show ? "visible" : "hidden",
        }}
      >
        <div className="flex items-center gap-3.5 w-full">
          {alert.type === "success" ? (
            <CheckCircle2 className="w-7 h-7 text-green-400 shrink-0" />
          ) : (
            <AlertCircle className="w-7 h-7 text-red-400 shrink-0" />
          )}
          <span className="font-bold text-lg text-white/90">
            {alert.type === "success" ? "Success!" : "Failed!"}
          </span>
          <button
            onClick={() => setAlert({ ...alert, show: false })}
            className="ml-auto p-1.5 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5 opacity-60 hover:opacity-100" />
          </button>
        </div>
        <p className="text-white/80 text-base leading-relaxed pl-10.5">
          {alert.message}
        </p>
      </div>
    </AlertContext.Provider>
  );
};

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) throw new Error("useAlert must be used dalam AlertProvider");
  return context;
};
