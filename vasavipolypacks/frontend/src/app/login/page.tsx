"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { Mail, Lock, ShieldCheck } from "lucide-react";
import { getApiBaseUrl } from "@/utils/api";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { t } = useLanguage();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      setIsAdmin(params.get("role") === "admin");
    }
  }, []);

  // Listen for navigation changes (in case the user clicks in the menu while on this page)
  useEffect(() => {
    const handleUrlChange = () => {
      const params = new URLSearchParams(window.location.search);
      setIsAdmin(params.get("role") === "admin");
    };
    window.addEventListener("popstate", handleUrlChange);
    // Periodically check URL search (due to NextJS routing not triggering popstate on local clicks)
    const interval = setInterval(handleUrlChange, 500);
    return () => {
      window.removeEventListener("popstate", handleUrlChange);
      clearInterval(interval);
    };
  }, []);

  const handleGoogleCredentialResponse = async (googleResponse: any) => {
    setError(null);
    setLoading(true);
    try {
      const apiBaseUrl = getApiBaseUrl();
      const response = await fetch(`${apiBaseUrl}/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: googleResponse.credential })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to log in with Google.");
      }

      if (data.token && data.user) {
        // Enforce role matching based on portal mode
        if (isAdmin && data.user.role !== "ADMIN") {
          throw new Error("Access denied. Admin console is restricted to administrators.");
        }
        if (!isAdmin && data.user.role !== "CUSTOMER") {
          throw new Error("Access denied. Please use the Admin Sign In portal.");
        }

        login(data.token, data.user);
        
        // Redirect based on role
        if (data.user.role === "ADMIN") {
          router.push("/admin");
        } else {
          router.push("/dashboard");
        }
      }
    } catch (err: any) {
      setError(err.message || "Google authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initGoogleSignIn = () => {
      if (typeof window !== "undefined" && window.google) {
        window.google.accounts.id.initialize({
          client_id: "572769494662-3a79kvilq1d6554t5pfjm3ctg1i6j9uu.apps.googleusercontent.com",
          callback: handleGoogleCredentialResponse,
        });
        window.google.accounts.id.renderButton(
          document.getElementById("google-signin-button"),
          {
            theme: "filled_blue",
            size: "large",
            width: 384,
            logo_alignment: "left"
          }
        );
      }
    };

    const interval = setInterval(() => {
      if (typeof window !== "undefined" && window.google) {
        initGoogleSignIn();
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isAdmin]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setError(null);
    setLoading(true);
    try {
      const apiBaseUrl = getApiBaseUrl();
      const response = await fetch(`${apiBaseUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to log in.");
      }

      if (data.token && data.user) {
        // Enforce role matching based on portal mode
        if (isAdmin && data.user.role !== "ADMIN") {
          throw new Error("Access denied. Admin console is restricted to administrators.");
        }
        if (!isAdmin && data.user.role !== "CUSTOMER") {
          throw new Error("Access denied. Please use the Admin Sign In portal.");
        }

        login(data.token, data.user);
        
        // Redirect based on role
        if (data.user.role === "ADMIN") {
          router.push("/admin");
        } else {
          router.push("/dashboard");
        }
      }
    } catch (err: any) {
      setError(err.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[radial-gradient(circle_at_50%_40%,rgba(0,242,254,0.04),transparent_50%)]">
      <div className="max-w-md w-full space-y-8 glass-panel p-8 rounded-2xl border border-white/10 relative">
        {/* Brand */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 group mb-4">
            <img src="/images/logo.png" alt="Vasavi Polypacks" className="h-24 w-auto rounded bg-white p-1.5 shadow-md" />
          </Link>
          <h2 className={`font-display text-lg font-bold uppercase tracking-wider ${isAdmin ? "text-yellow-500" : "text-white"}`}>
            {isAdmin ? t("admin_console_signin") : t("client_portal_access")}
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            {isAdmin ? t("staff_console_desc") : t("client_portal_desc")}
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-lg border border-red-500/20 bg-red-500/5 text-xs text-red-400 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div className="relative">
            <input
              type="email"
              placeholder={isAdmin ? t("staff_email") : t("business_email")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 px-3 pl-10 text-xs text-white focus:outline-none focus:border-tech-teal-500"
            />
            <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
          </div>

          <div className="relative">
            <input
              type="password"
              placeholder={t("password")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 px-3 pl-10 text-xs text-white focus:outline-none focus:border-tech-teal-500"
            />
            <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 rounded-lg font-bold text-xs hover:scale-102 transition-transform cursor-pointer text-center ${
              isAdmin 
                ? "bg-linear-to-r from-yellow-500 to-amber-600 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.2)]" 
                : "bg-linear-to-r from-tech-teal-500 to-tech-teal-700 text-background shadow-[0_0_15px_rgba(0,242,254,0.2)]"
            }`}
          >
            {loading ? t("verifying_credentials") : (isAdmin ? t("access_console") : t("login_to_workspace"))}
          </button>
        </form>

        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-white/10"></div>
          <span className="flex-shrink mx-4 text-[10px] text-gray-500 font-bold uppercase">{t("or_sign_in_with")}</span>
          <div className="flex-grow border-t border-white/10"></div>
        </div>

        <div id="google-signin-button" className="flex justify-center w-full min-h-[40px]"></div>

        <div className="text-center pt-2 flex flex-col gap-1 text-[11px] text-gray-500">
          {isAdmin ? (
            <span>{t("not_staff")} <Link href="/login" className="text-tech-teal-300 font-semibold hover:underline">{t("client_sign_in")}</Link></span>
          ) : (
            <span>{t("first_time_buyer")} <Link href="/signup" className="text-tech-teal-300 font-semibold hover:underline">{t("register_corporate_account")}</Link></span>
          )}
          <span className="flex items-center justify-center gap-1 mt-3">
            <ShieldCheck className="w-3.5 h-3.5 text-tech-teal-400" /> {t("secure_session")}
          </span>
        </div>
      </div>
    </div>
  );
}
