"use client";
import React, { useRef, useState } from "react";
import {
  Mail,
  Lock,
  User,
  ArrowRight,
  Loader2,
  Eye,
  EyeOff,
  Calendar,
} from "lucide-react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import Cookies from "js-cookie";
import ReCAPTCHA from "react-google-recaptcha";
import { useAlert } from "@/components/ui/showAlert";

const AuthPage = () => {
  const router = useRouter();
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const { showAlert } = useAlert();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmpassword: "",
    gender: "",
    dob: "",
    tokenCaptcha: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCaptchaChange = (token: string | null) => {
    setFormData((prev) => ({
      ...prev,
      tokenCaptcha: token || "",
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const endpoint = isLogin ? "/Auth/login" : "/Auth/register";

      if (!formData.tokenCaptcha) {
        showAlert("Please Checklist the captcha first !", "error");
        return;
      }

      const payload = isLogin
        ? {
            email: formData.email,
            password: formData.password,
            tokenCaptcha: formData.tokenCaptcha,
          }
        : formData;

      const response = await api.post(endpoint, payload);

      if (response.data.status) {
        if (response.data.token) {
          Cookies.set("token", response.data.token, { expires: 1, path: "/" });
        }

        showAlert(
          isLogin
            ? "Redirect to your dashboard..."
            : "Register Success ! Please Login with your new account",
          "success",
        );

        if (isLogin) {
          setTimeout(() => router.push("/"), 1000);
        } else {
          setFormData({
            username: "",
            email: "",
            password: "",
            confirmpassword: "",
            gender: "",
            dob: "",
            tokenCaptcha: "",
          });
          setTimeout(() => setIsLogin(true), 1500);
        }
      } else {
        showAlert(response.data.message, "error");
      }
    } catch (error: any) {
      recaptchaRef.current?.reset();
      const errorMsg =
        error.response?.data?.message || "Failed connected to server !";
      showAlert(errorMsg, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6 relative overflow-hidden text-white font-sans">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px]"></div>

      <div className="w-full max-w-xl z-10">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold mb-2">
              {isLogin ? "Welcome" : "Create Account"}
            </h1>
            <p className="text-gray-400">
              {isLogin
                ? "Login to your Account !"
                : "Register to explore Collentra !"}
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5 group-focus-within:text-blue-400 transition-colors" />
                <input
                  name="username"
                  type="text"
                  placeholder="Username"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-12 text-white focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all placeholder:text-white"
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
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-12 text-white focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all placeholder:text-white"
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
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-12 text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-white"
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

            {!isLogin && (
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5 group-focus-within:text-blue-400 transition-colors" />
                <input
                  name="confirmpassword"
                  type={showCPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  required
                  value={formData.confirmpassword}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-12 text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowCPassword(!showCPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                >
                  {showCPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            )}

            {!isLogin && (
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-white">Gender :</label>
                  <div className="relative group mt-2">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5 group-focus-within:text-blue-400 transition-colors" />
                    <select
                      name="gender"
                      required
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-12 text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all appearance-none cursor-pointer"
                    >
                      <option value="" disabled hidden className="bg-[#1a1a1a]">
                        Select Gender
                      </option>
                      <option value="M" className="bg-[#1a1a1a] text-white">
                        Male
                      </option>
                      <option value="F" className="bg-[#1a1a1a] text-white">
                        Female
                      </option>
                    </select>

                    <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-gray-500">
                      <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="flex-1">
                  <label className="text-white">Date of Birth :</label>
                  <div className="relative group mt-2">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5 group-focus-within:text-blue-400 transition-colors" />
                    <input
                      name="dob"
                      type="date"
                      required
                      value={formData.dob}
                      onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all [color-scheme:dark] placeholder:text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-center w-full my-4">
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
                onChange={handleCaptchaChange}
              />
            </div>

            <button
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 group transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {isLogin ? "Login Now!" : "Register your account"}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-400">
              {isLogin
                ? "don't have an account ? "
                : "already have an account ? "}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className={`font-bold transition-all duration-300 ${
                  isLogin
                    ? "text-blue-400 hover:text-blue-300 hover:drop-shadow-[0_0_8px_rgba(96,165,250,0.6)]"
                    : "text-purple-400 hover:text-purple-300 hover:drop-shadow-[0_0_8px_rgba(192,132,252,0.6)]"
                }`}
              >
                {isLogin ? "Register" : "Login"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
