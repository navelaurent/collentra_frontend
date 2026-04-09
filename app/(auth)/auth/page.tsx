"use client";
import React, { useState } from "react";
import {
  Mail,
  Lock,
  User,
  ArrowRight,
  Loader2,
  Eye,
  EyeOff,
  X,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";

interface AlertState {
  show: boolean;
  message: string;
  type: "success" | "error";
}

const AuthPage = () => {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [alert, setAlert] = useState<AlertState>({
    show: false,
    message: "",
    type: "success",
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const showAlert = (message: string, type: "success" | "error") => {
    setAlert({ show: true, message, type });

    setTimeout(() => {
      setAlert((prev) => ({ ...prev, show: false }));
    }, 4000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const endpoint = isLogin ? "/Auth/login" : "/Auth/register";
      const payload = isLogin
        ? { email: formData.email, password: formData.password }
        : formData;

      const response = await api.post(endpoint, payload);

      console.log(response);

      if (response.data.message == "Login Successfully") {
        if (response.data.token) {
          localStorage.setItem("token", response.data.token);
        }

        showAlert(
          isLogin
            ? "Login Berhasil! Mengalihkan ke Dashboard..."
            : "Registrasi Berhasil! Silakan Login dengan akun baru Anda.",
          "success",
        );

        if (isLogin) {
          setTimeout(() => router.push("/"), 2000);
        } else {
          setFormData({ name: "", email: "", password: "" });
          setTimeout(() => setIsLogin(true), 1500);
        }
      } else {
        showAlert(response.data.message, "error");
      }
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.message || "Terjadi kesalahan koneksi ke server";
      showAlert(errorMsg, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6 relative overflow-hidden text-white font-sans">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px]"></div>

      <div
        className={`fixed top-8 right-8 z-50 flex items-start gap-4 px-8 py-6 rounded-3xl border backdrop-blur-xl shadow-[0_20px_60px_-10px_rgba(0,0,0,0.5)] transition-all flex-col min-w-[380px] max-w-[500px] ${
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
            {alert.type === "success" ? "Sukses!" : "Gagal"}
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

      <div className="w-full max-w-md z-10">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold mb-2">
              {isLogin ? "Selamat Datang" : "Buat Akun"}
            </h1>
            <p className="text-gray-400">
              {isLogin
                ? "Silakan masuk ke akun Anda"
                : "Daftar untuk mulai eksplorasi"}
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5 group-focus-within:text-blue-400 transition-colors" />
                <input
                  name="name"
                  type="text"
                  placeholder="Nama Lengkap"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-12 text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-gray-600"
                />
              </div>
            )}

            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5 group-focus-within:text-purple-400 transition-colors" />
              <input
                name="email"
                type="email"
                placeholder="Email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-12 text-white focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all placeholder:text-gray-600"
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5 group-focus-within:text-blue-400 transition-colors" />
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-12 text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-gray-600"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            <button
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 group transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {isLogin ? "Masuk Sekarang" : "Daftar Akun"}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-400">
              {isLogin ? "Belum punya akun? " : "Sudah punya akun? "}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className={`font-bold transition-all duration-300 ${
                  isLogin
                    ? "text-blue-400 hover:text-blue-300 hover:drop-shadow-[0_0_8px_rgba(96,165,250,0.6)]"
                    : "text-purple-400 hover:text-purple-300 hover:drop-shadow-[0_0_8px_rgba(192,132,252,0.6)]"
                }`}
              >
                {isLogin ? "Daftar" : "Login"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
