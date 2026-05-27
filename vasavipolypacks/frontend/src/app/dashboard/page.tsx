"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { apiRequest } from "@/utils/api";
import {
  User, ClipboardList, Box, Truck, ChevronRight,
  CheckCircle, Clock, Zap, X, RefreshCw, Package
} from "lucide-react";

// ── Toast Notification ──────────────────────────────────────────────────────
function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-emerald-600 text-white text-xs font-bold px-5 py-3.5 rounded-xl shadow-[0_0_30px_rgba(16,185,129,0.4)]">
      <CheckCircle className="w-4 h-4 shrink-0" />
      {message}
      <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100 cursor-pointer">
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

// ── Reorder Confirmation Modal ───────────────────────────────────────────────
function ReorderModal({
  quote,
  onConfirm,
  onClose,
  loading,
}: {
  quote: any;
  onConfirm: () => void;
  onClose: () => void;
  loading: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-white dark:bg-[#0c0c16] border border-gray-200 dark:border-tech-teal-500/30 rounded-2xl shadow-xl dark:shadow-[0_0_60px_rgba(0,242,254,0.15)] p-6 flex flex-col gap-5">

        {/* Close */}
        <button
          onClick={onClose}
          disabled={loading}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-tech-teal-500/10 border border-tech-teal-500/30 flex items-center justify-center shrink-0">
            <Zap className="w-5 h-5 text-tech-teal-600 dark:text-tech-teal-400" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-tech-teal-700 dark:text-tech-teal-300 tracking-wider">One-Click Reorder</span>
            <h3 className="text-gray-900 dark:text-white font-bold text-sm uppercase tracking-wider">Confirm Repeat Order</h3>
          </div>
        </div>

        {/* Order Summary Card */}
        <div className="bg-gray-50 dark:bg-white/5 border border-gray-150 dark:border-white/10 rounded-xl p-4 flex flex-col gap-3">
          <div className="flex items-center gap-2 mb-1">
            <Package className="w-3.5 h-3.5 text-tech-teal-600 dark:text-tech-teal-400" />
            <span className="text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400 tracking-wider">Order Summary</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="flex flex-col">
              <span className="text-gray-400 dark:text-gray-500">Ref ID</span>
              <span className="text-gray-900 dark:text-white font-mono font-bold">{quote.id.slice(0, 8).toUpperCase()}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-400 dark:text-gray-500">Bag Type</span>
              <span className="text-gray-900 dark:text-white font-bold">{quote.materialType.replace(/_/g, " ")}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-400 dark:text-gray-500">Dimensions</span>
              <span className="text-gray-900 dark:text-white font-bold">{quote.dimensions}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-400 dark:text-gray-500">Quantity</span>
              <span className="text-gray-900 dark:text-white font-bold">{quote.quantity.toLocaleString()} bags</span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-400 dark:text-gray-500">Print Colors</span>
              <span className="text-gray-900 dark:text-white font-bold">{quote.printingColors} Colors</span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-400 dark:text-gray-500">Est. Range</span>
              <span className="text-tech-teal-700 dark:text-tech-teal-300 font-bold">
                ₹{quote.estimatedMinPrice.toLocaleString()} – ₹{quote.estimatedMaxPrice.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">
          A new RFQ will be instantly created with the same specifications. Our team will contact you within{" "}
          <span className="text-gray-900 dark:text-white font-semibold">2 business hours</span> to confirm pricing and timeline.
        </p>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl border border-gray-250 dark:border-white/10 text-xs font-semibold text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-[2] py-2.5 rounded-xl bg-gradient-to-r from-tech-teal-500 to-tech-teal-700 text-background font-bold text-xs flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform shadow-[0_0_20px_rgba(0,242,254,0.3)] cursor-pointer disabled:opacity-60 disabled:scale-100"
          >
            {loading ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                Placing Reorder...
              </>
            ) : (
              <>
                <Zap className="w-3.5 h-3.5" />
                Reorder Instantly
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Dashboard ───────────────────────────────────────────────────────────
export default function DashboardPage() {
  const router = useRouter();
  const { user, token, loading: authLoading } = useAuth();

  const [configs, setConfigs] = useState<any[]>([]);
  const [quotes, setQuotes] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [trackingOrder, setTrackingOrder] = useState<any | null>(null);
  const [trackingLoading, setTrackingLoading] = useState(false);

  // Reorder state
  const [reorderQuote, setReorderQuote] = useState<any | null>(null);
  const [reorderLoading, setReorderLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!token) { router.push("/login"); return; }

    const fetchPortalData = async () => {
      setLoading(true);
      try {
        const configsRes = await apiRequest("/configs/my-configs");
        const quotesRes  = await apiRequest("/quotes/my-quotes");
        const ordersRes  = await apiRequest("/orders/my-orders");
        setConfigs(configsRes.configs || []);
        setQuotes(quotesRes.quotes   || []);
        setOrders(ordersRes.orders   || []);
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPortalData();
  }, [token, authLoading, router]);

  const handleTrackOrder = async (orderId: string) => {
    setTrackingLoading(true);
    setTrackingOrder(null);
    try {
      const data = await apiRequest(`/orders/${orderId}/track`);
      setTrackingOrder(data);
    } catch {
      alert("Failed to retrieve order tracking timeline.");
    } finally {
      setTrackingLoading(false);
    }
  };

  const handleConfirmReorder = async () => {
    if (!reorderQuote) return;
    setReorderLoading(true);
    try {
      const data = await apiRequest("/quotes", {
        method: "POST",
        body: JSON.stringify({
          name:           reorderQuote.name,
          email:          reorderQuote.email,
          phone:          reorderQuote.phone,
          company:        reorderQuote.company,
          bagType:        reorderQuote.materialType,
          width:          parseInt(reorderQuote.dimensions.split("x")[0]),
          height:         parseInt(reorderQuote.dimensions.split("x")[1]),
          gusset:         parseInt(reorderQuote.dimensions.split("x")[2]),
          quantity:       reorderQuote.quantity,
          printingColors: reorderQuote.printingColors,
          gsm:            80,
          bagConfigId:    reorderQuote.bagConfigId,
        }),
      });
      if (data.quote) {
        setReorderQuote(null);
        setToast(`Reorder placed! Ref: ${data.quote.id.slice(0, 8).toUpperCase()}`);
        const quotesRes = await apiRequest("/quotes/my-quotes");
        setQuotes(quotesRes.quotes || []);
      }
    } catch {
      alert("Failed to submit reorder. Please try again.");
    } finally {
      setReorderLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-tech-teal-500 border-t-transparent animate-spin" />
          <span className="text-xs text-gray-400 font-semibold uppercase tracking-widest">Loading B2B Portal...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen py-10 bg-[radial-gradient(circle_at_20%_15%,rgba(0,242,254,0.03),transparent_50%)]">

      {/* Reorder Modal */}
      {reorderQuote && (
        <ReorderModal
          quote={reorderQuote}
          onConfirm={handleConfirmReorder}
          onClose={() => !reorderLoading && setReorderQuote(null)}
          loading={reorderLoading}
        />
      )}

      {/* Toast */}
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Welcome Banner */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-tech-teal-500/10 border border-tech-teal-500/20 flex items-center justify-center shrink-0">
              <User className="w-6 h-6 text-tech-teal-400" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-tech-teal-300 tracking-wider">Corporate Client Account</span>
              <h1 className="text-white font-display text-xl font-bold uppercase tracking-wider">{user?.name}</h1>
              <p className="text-xs text-gray-400">{user?.company || "Balaji Agro Group"}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link
              href="/studio"
              className="py-2 px-4 rounded-lg bg-gradient-to-r from-tech-teal-500 to-tech-teal-700 text-background font-bold text-xs hover:scale-102 transition-transform cursor-pointer"
            >
              Configure New Bag
            </Link>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Left – Quotes & Configs */}
          <div className="lg:col-span-8 flex flex-col gap-8">

            {/* Active Quotes */}
            <div className="glass-panel p-6 rounded-2xl border border-white/10">
              <h2 className="text-white font-display text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                <ClipboardList className="w-4 h-4 text-tech-teal-400" />
                Active RFQ Quotations ({quotes.length})
              </h2>

              {quotes.length === 0 ? (
                <div className="text-center py-8 text-xs text-gray-500">
                  No quotes found. Request a quotation to generate a B2B quote.
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {quotes.map(quote => (
                    <div
                      key={quote.id}
                      className="p-4 rounded-xl bg-white/5 border border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-white/10 transition-all"
                    >
                      <div className="flex flex-col">
                        <span className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">
                          Ref: {quote.id.slice(0, 8)}
                        </span>
                        <span className="text-white font-bold text-xs uppercase mt-0.5">
                          {quote.materialType.replace("_", " ")}
                        </span>
                        <span className="text-[11px] text-gray-400 mt-0.5">
                          {quote.dimensions} • {quote.quantity.toLocaleString()} bags
                        </span>
                      </div>

                      <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                        <div className="flex flex-col text-right">
                          <span className="text-xs font-semibold text-tech-teal-300">
                            ₹{quote.estimatedMinPrice.toLocaleString()} - ₹{quote.estimatedMaxPrice.toLocaleString()}
                          </span>
                          <span className={`text-[9px] font-bold uppercase mt-1 px-2 py-0.5 rounded-full inline-block text-center ${
                            quote.status === "PENDING"
                              ? "bg-yellow-500/10 text-yellow-400"
                              : quote.status === "CONVERTED"
                              ? "bg-emerald-500/10 text-emerald-400"
                              : "bg-gray-500/10 text-gray-400"
                          }`}>
                            {quote.status}
                          </span>
                        </div>

                        {/* ⚡ One-Click Reorder Button */}
                        <button
                          onClick={() => setReorderQuote(quote)}
                          className="flex items-center gap-1.5 py-2 px-3.5 rounded-lg bg-tech-teal-500/10 border border-tech-teal-500/30 hover:bg-tech-teal-500/20 hover:border-tech-teal-500/60 text-[10px] font-bold text-tech-teal-300 hover:text-tech-teal-200 transition-all cursor-pointer shadow-[0_0_10px_rgba(0,242,254,0.05)] hover:shadow-[0_0_15px_rgba(0,242,254,0.2)]"
                        >
                          <Zap className="w-3 h-3" />
                          Reorder
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Saved Configurations */}
            <div className="glass-panel p-6 rounded-2xl border border-white/10">
              <h2 className="text-white font-display text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                <Box className="w-4 h-4 text-tech-teal-400" />
                Saved Packaging configurations ({configs.length})
              </h2>

              {configs.length === 0 ? (
                <div className="text-center py-8 text-xs text-gray-500">
                  No saved designs. Customize a bag inside the 3D Studio and save to load.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {configs.map(cfg => (
                    <div
                      key={cfg.id}
                      className="p-4 rounded-xl bg-white/5 border border-white/5 flex flex-col justify-between hover:border-white/10 transition-all"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] text-gray-500 font-semibold uppercase">
                          {cfg.bagType.replace("_", " ")}
                        </span>
                        <div
                          className="w-3.5 h-3.5 rounded-full border border-white/10"
                          style={{ backgroundColor: cfg.color }}
                        />
                      </div>
                      <h4 className="text-white font-bold text-xs uppercase mb-1 truncate">
                        {cfg.textFront || "Custom Design"}
                      </h4>
                      <p className="text-[10px] text-gray-400 mb-4">
                        Dimensions: {cfg.width}x{cfg.height}x{cfg.gusset} cm
                      </p>
                      <Link
                        href={`/studio?config=${cfg.id}`}
                        className="w-full text-center py-2 px-3 rounded-lg border border-tech-teal-500/30 hover:border-tech-teal-500 bg-tech-teal-500/5 hover:bg-tech-teal-500/10 text-[10px] font-bold text-tech-teal-300 transition-colors"
                      >
                        Reload in 3D Studio
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Right – Orders & Tracking */}
          <div className="lg:col-span-4 flex flex-col gap-8">

            {/* Active Shipments */}
            <div className="glass-panel p-6 rounded-2xl border border-white/10">
              <h2 className="text-white font-display text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                <Truck className="w-4 h-4 text-packaging-green-500" />
                Active Shipments ({orders.length})
              </h2>

              {orders.length === 0 ? (
                <div className="text-center py-8 text-xs text-gray-500">
                  No active orders tracked. Once a quote is accepted, order tracking details appear here.
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {orders.map(order => (
                    <button
                      key={order.id}
                      onClick={() => handleTrackOrder(order.id)}
                      className="w-full p-4 rounded-xl bg-white/5 border border-white/5 hover:border-tech-teal-500/40 text-left transition-all flex justify-between items-center gap-3 cursor-pointer"
                    >
                      <div className="flex flex-col">
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                          {order.orderNumber}
                        </span>
                        <span className="text-white font-bold text-xs uppercase mt-0.5">
                          {order.quote.materialType.replace("_", " ")}
                        </span>
                        <span className="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-tech-teal-400" />
                          Est: {new Date(order.estDeliveryDate).toLocaleDateString()}
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-500 shrink-0" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Live Pipeline Tracker */}
            {trackingOrder && (
              <div className="glass-panel p-6 rounded-2xl border border-tech-teal-500/30 bg-gradient-to-b from-[#0c0c16] to-[#04040a] relative">
                <div className="absolute top-4 right-4 z-10">
                  <span className="text-[9px] uppercase font-bold text-tech-teal-300 tracking-widest bg-tech-teal-500/10 py-1 px-2.5 rounded-full border border-tech-teal-500/20">
                    Live Tracking
                  </span>
                </div>

                <h3 className="text-white font-display text-xs font-black uppercase tracking-wider mb-1">
                  Order {trackingOrder.orderNumber}
                </h3>
                <p className="text-[10px] text-gray-400 mb-6">
                  {trackingOrder.material.replace("_", " ")} • {trackingOrder.totalQuantity.toLocaleString()} bags
                </p>

                <div className="relative border-l border-white/10 pl-6 flex flex-col gap-6">
                  {trackingOrder.stages.map((stage: any, index: number) => (
                    <div key={stage.key} className="relative">
                      <span className={`absolute -left-[31px] top-0.5 w-4 h-4 rounded-full border flex items-center justify-center text-[9px] shrink-0 ${
                        stage.isActive
                          ? "bg-tech-teal-500 border-tech-teal-500 text-background animate-pulse"
                          : stage.isCompleted
                          ? "bg-emerald-600 border-emerald-500 text-white"
                          : "bg-obsidian-950 border-white/10 text-gray-600"
                      }`}>
                        {stage.isCompleted && !stage.isActive ? "✓" : index + 1}
                      </span>
                      <div className="flex flex-col">
                        <span className={`text-xs font-bold uppercase tracking-wider ${
                          stage.isActive ? "text-tech-teal-300 font-extrabold"
                          : stage.isCompleted ? "text-white"
                          : "text-gray-600"
                        }`}>
                          {stage.label}
                        </span>
                        <p className={`text-[10px] leading-relaxed mt-0.5 ${
                          stage.isActive ? "text-gray-300"
                          : stage.isCompleted ? "text-gray-400"
                          : "text-gray-700"
                        }`}>
                          {stage.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {trackingLoading && (
              <div className="text-center py-6 text-xs text-gray-500">
                Loading production pipeline tracker...
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
