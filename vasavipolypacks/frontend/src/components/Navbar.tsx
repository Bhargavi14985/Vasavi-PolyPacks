"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";
import { Menu, X, Box, BarChart3, ShieldCheck, User2, LogOut, ArrowRight, Sun, Moon, ChevronDown } from "lucide-react";

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [signInOpen, setSignInOpen] = useState(false);
  const signInRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (signInRef.current && !signInRef.current.contains(e.target as Node)) {
        setSignInOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const isActive = (path: string) => pathname === path;

  const navLinks = [
    { href: "/", labelKey: "home" },
    { href: "/products", labelKey: "products" },
    { href: "/studio", labelKey: "3d_studio", icon: <Box className="w-4 h-4 mr-1 text-tech-teal-300" /> },
    { href: "/calculator", labelKey: "get_quotation", icon: <BarChart3 className="w-4 h-4 mr-1 text-packaging-green-500" /> },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2 group">
              <img src="/images/logo.png" alt="Vasavi Polypacks" className="h-16 w-auto rounded bg-white p-1 shadow-sm" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center text-sm font-medium transition-colors hover:text-tech-teal-300 ${
                  isActive(link.href) ? "text-tech-teal-400 font-semibold" : "text-gray-300"
                }`}
              >
                {link.icon}
                {t(link.labelKey)}
              </Link>
            ))}

            {/* Portal Context Links */}
            {user && user.role === "ADMIN" && (
              <Link
                href="/admin"
                className={`flex items-center text-sm font-medium transition-colors hover:text-yellow-400 ${
                  isActive("/admin") ? "text-yellow-400" : "text-yellow-500"
                }`}
              >
                <ShieldCheck className="w-4 h-4 mr-1" />
                {t("admin_console")}
              </Link>
            )}

            {user && user.role === "CUSTOMER" && (
              <Link
                href="/dashboard"
                className={`flex items-center text-sm font-medium transition-colors hover:text-tech-teal-300 ${
                  isActive("/dashboard") ? "text-tech-teal-400" : "text-gray-300"
                }`}
              >
                <User2 className="w-4 h-4 mr-1 text-tech-teal-400" />
                {t("b2b_portal")}
              </Link>
            )}
          </nav>

          {/* Action CTAs */}
          <div className="hidden md:flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:text-white transition-colors cursor-pointer"
              title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
            >
              {theme === "light" ? <Moon className="w-4 h-4 text-slate-700" /> : <Sun className="w-4 h-4 text-yellow-400" />}
            </button>

            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-400 font-medium bg-white/5 py-1.5 px-3 rounded-full border border-white/5">
                  {user.company || user.name}
                </span>
                <button
                  onClick={logout}
                  className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <>
                {/* Sign In Dropdown */}
                <div ref={signInRef} className="relative">
                  <button
                    onClick={() => setSignInOpen(!signInOpen)}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-300 hover:text-white transition-colors border border-white/10 hover:border-white/20 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 cursor-pointer"
                  >
                    {t("sign_in")}
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${signInOpen ? "rotate-180" : ""}`} />
                  </button>

                  {/* Dropdown */}
                  {signInOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-[#0c0c16] border border-gray-200 dark:border-white/10 rounded-xl shadow-lg dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)] overflow-hidden z-50">
                      <div className="p-1.5 flex flex-col gap-1">
                        <Link
                          href="/login?role=admin"
                          onClick={() => setSignInOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg hover:bg-amber-500/10 dark:hover:bg-yellow-500/10 transition-colors group"
                        >
                          <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-yellow-400 shrink-0" />
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-amber-600 dark:text-yellow-400">{t("admin_sign_in")}</span>
                            <span className="text-[10px] text-gray-500">{t("staff_console")}</span>
                          </div>
                        </Link>
                        <Link
                          href="/login"
                          onClick={() => setSignInOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg hover:bg-tech-teal-500/10 transition-colors group"
                        >
                          <User2 className="w-4 h-4 text-tech-teal-600 dark:text-tech-teal-400 shrink-0" />
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-tech-teal-700 dark:text-tech-teal-300">{t("client_sign_in")}</span>
                            <span className="text-[10px] text-gray-500">{t("b2b_portal")}</span>
                          </div>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                <Link
                  href="/calculator"
                  className="inline-flex items-center justify-center rounded-lg bg-linear-to-r from-tech-teal-500 to-tech-teal-700 px-4 py-2 text-xs font-semibold text-background hover:scale-105 transition-transform shadow-[0_0_15px_rgba(0,242,254,0.3)]"
                >
                  {t("get_quotation")}
                  <ArrowRight className="ml-1.5 w-3.5 h-3.5" />
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-400 hover:text-white cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-white/10 bg-background px-4 py-3 flex flex-col gap-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center py-2 text-base font-medium transition-colors ${
                isActive(link.href) ? "text-tech-teal-400" : "text-gray-300"
              }`}
            >
              {t(link.labelKey)}
            </Link>
          ))}

          {user && user.role === "ADMIN" && (
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center py-2 text-base font-medium text-yellow-500"
            >
              {t("admin_console")}
            </Link>
          )}

          {user && user.role === "CUSTOMER" && (
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center py-2 text-base font-medium text-tech-teal-300"
            >
              {t("b2b_portal")}
            </Link>
          )}

          <hr className="border-white/10 my-1" />
          
          <div className="flex justify-between items-center py-1">
            <span className="text-xs text-gray-400">Theme</span>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:text-white transition-colors cursor-pointer"
            >
              {theme === "light" ? <Moon className="w-4 h-4 text-slate-700" /> : <Sun className="w-4 h-4 text-yellow-400" />}
            </button>
          </div>

          <hr className="border-white/10 my-1" />

          {user ? (
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-400">{user.company || user.name}</span>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                className="flex items-center text-sm text-red-400 gap-1.5 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                {t("logout")}
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2 pt-1">
              <Link
                href="/login?role=admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 py-2.5 px-3 text-sm font-bold text-yellow-400 border border-yellow-500/20 bg-yellow-500/5 rounded-lg"
              >
                <ShieldCheck className="w-4 h-4" />
                {t("admin_sign_in")}
              </Link>
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 py-2.5 px-3 text-sm font-bold text-tech-teal-300 border border-tech-teal-500/20 bg-tech-teal-500/5 rounded-lg"
              >
                <User2 className="w-4 h-4" />
                {t("client_sign_in")}
              </Link>
              <Link
                href="/calculator"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center py-2.5 text-sm font-semibold bg-linear-to-r from-tech-teal-500 to-tech-teal-700 text-background rounded-lg"
              >
                {t("get_quotation")}
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
