"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { User, Mail, Lock, Building, Phone, ShieldCheck } from "lucide-react";
import { getApiBaseUrl } from "@/utils/api";

export default function SignupPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) return;

    setError(null);
    setLoading(true);
    try {
      const apiBaseUrl = getApiBaseUrl();
      const response = await fetch(`${apiBaseUrl}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, company, phone })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to register corporate account.");
      }

      if (data.token && data.user) {
        login(data.token, data.user);
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err.message || "Registration failed. Try a different email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[radial-gradient(circle_at_50%_40%,rgba(0,242,254,0.04),transparent_50%)]">
      <div className="max-w-md w-full space-y-8 glass-panel p-8 rounded-2xl border border-white/10 relative">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 group mb-4">
            <img src="/images/logo.png" alt="Vasavi Polypacks" className="h-24 w-auto rounded bg-white p-1.5 shadow-md" />
          </Link>
          <h2 className="text-white font-display text-lg font-bold uppercase tracking-wider">Corporate Registration</h2>
          <p className="text-xs text-gray-400 mt-1">Initialize your B2B account for custom manufacturing runs.</p>
        </div>

        {error && (
          <div className="p-3 rounded-lg border border-red-500/20 bg-red-500/5 text-xs text-red-400 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSignupSubmit} className="space-y-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Contact Name *"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 px-3 pl-10 text-xs text-white focus:outline-none focus:border-tech-teal-500"
            />
            <User className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
          </div>

          <div className="relative">
            <input
              type="email"
              placeholder="Corporate Email *"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 px-3 pl-10 text-xs text-white focus:outline-none focus:border-tech-teal-500"
            />
            <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Company Name"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 px-3 pl-10 text-xs text-white focus:outline-none focus:border-tech-teal-500"
            />
            <Building className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
          </div>

          <div className="relative">
            <input
              type="tel"
              placeholder="Phone / WhatsApp Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 px-3 pl-10 text-xs text-white focus:outline-none focus:border-tech-teal-500"
            />
            <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
          </div>

          <div className="relative">
            <input
              type="password"
              placeholder="Access Password *"
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
            className="w-full py-3 px-4 rounded-lg bg-linear-to-r from-tech-teal-500 to-tech-teal-700 text-background font-bold text-xs hover:scale-102 transition-transform shadow-[0_0_15px_rgba(0,242,254,0.2)] cursor-pointer text-center"
          >
            {loading ? "Registering Account..." : "Create B2B Account"}
          </button>
        </form>

        <div className="text-center pt-2 text-[11px] text-gray-500">
          <span>Already have an account? <Link href="/login" className="text-tech-teal-300 font-semibold hover:underline">Sign In here</Link></span>
        </div>
      </div>
    </div>
  );
}
