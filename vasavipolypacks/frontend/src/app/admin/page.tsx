"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { apiRequest } from "@/utils/api";
import { ShieldCheck, Users, BarChart3, Database, Layers, Check, RefreshCw, Star, Info, TrendingUp, AlertTriangle } from "lucide-react";

export default function AdminPage() {
  const router = useRouter();
  const { user, token, loading: authLoading } = useAuth();

  // Data States
  const [metrics, setMetrics] = useState<any>(null);
  const [quotes, setQuotes] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [inventory, setInventory] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Status updating states
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchAdminData = async () => {
    try {
      const data = await apiRequest("/admin/metrics");
      setMetrics(data.metrics);
      setInventory(data.inventory);
      
      const quotesRes = await apiRequest("/admin/quotes");
      setQuotes(quotesRes.quotes || []);

      const ordersRes = await apiRequest("/admin/orders");
      setOrders(ordersRes.orders || []);

      const leadsRes = await apiRequest("/admin/leads");
      setLeads(leadsRes.leads || []);
    } catch (err) {
      console.error("Failed to load admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading) return;
    if (!token || user?.role !== "ADMIN") {
      router.push("/login");
      return;
    }

    fetchAdminData();
  }, [token, authLoading, user, router]);

  // Update Quote Status Controller
  const handleUpdateQuoteStatus = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    try {
      await apiRequest(`/admin/quotes/${id}`, {
        method: "PUT",
        body: JSON.stringify({ status: newStatus })
      });
      // Refresh local states
      setQuotes(prev => prev.map(q => q.id === id ? { ...q, status: newStatus } : q));
    } catch (err) {
      alert("Failed to update quote status.");
    } finally {
      setUpdatingId(null);
    }
  };

  // Update Order Production Stage Controller
  const handleUpdateOrderStatus = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    try {
      await apiRequest(`/admin/orders/${id}/status`, {
        method: "PUT",
        body: JSON.stringify({ status: newStatus })
      });
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
    } catch (err) {
      alert("Failed to update production stage.");
    } finally {
      setUpdatingId(null);
    }
  };

  // Update Lead callback status
  const handleUpdateLeadStatus = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    try {
      await apiRequest(`/admin/leads/${id}`, {
        method: "PUT",
        body: JSON.stringify({ status: newStatus })
      });
      setLeads(prev => prev.map(l => l.id === id ? { ...l, status: newStatus } : l));
    } catch (err) {
      alert("Failed to update lead status.");
    } finally {
      setUpdatingId(null);
    }
  };

  const productionStages = [
    "PENDING", "PLATES_DESIGN", "EXTRUSION", "WEAVING", "PRINTING", "LAMINATION", "STITCHING", "QUALITY_CHECK", "DISPATCHED"
  ];

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-yellow-500 border-t-transparent animate-spin" />
          <span className="text-xs text-yellow-500 font-semibold uppercase tracking-widest">Loading Admin Console...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen py-10 bg-[radial-gradient(circle_at_20%_15%,rgba(234,179,8,0.02),transparent_50%)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 border-b border-white/10 pb-6">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-8 h-8 text-yellow-500 shrink-0" />
            <div>
              <span className="text-[10px] text-yellow-500 font-bold uppercase tracking-wider">Enterprise Administrator</span>
              <h1 className="text-white font-display text-2xl font-black uppercase tracking-wider leading-none mt-1">Vasavi Control Console</h1>
            </div>
          </div>
          <button
            onClick={fetchAdminData}
            className="inline-flex items-center gap-1.5 py-2 px-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-semibold text-gray-300 hover:text-white transition-all cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh Live Feeds
          </button>
        </div>

        {/* Top Aggregates row */}
        {metrics && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: "B2B Enquiries Captured", value: metrics.totalLeads, labelSub: "Callbacks & Contacts" },
              { label: "Pending Quotations", value: metrics.pendingQuotes, labelSub: "Awaiting Staff Review" },
              { label: "Active Plant Orders", value: metrics.activeOrders, labelSub: "In extrusion & weaving" },
              { label: "Avg Quote Estimate", value: `₹${metrics.avgQuotePrice.toLocaleString()}`, labelSub: "Estimated Order Size" }
            ].map((box, index) => (
              <div key={index} className="glass-panel p-5 rounded-2xl border border-white/10">
                <span className="text-[10px] text-gray-500 font-semibold uppercase">{box.label}</span>
                <div className="text-2xl font-display font-black text-white mt-1">{box.value}</div>
                <span className="text-[9px] text-gray-400 mt-0.5 block">{box.labelSub}</span>
              </div>
            ))}
          </div>
        )}

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          
          {/* Left Column: Quotes & Leads */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            
            {/* Lead RFQ Table */}
            <div className="glass-panel p-6 rounded-2xl border border-white/10">
              <h2 className="text-white font-display text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                <BarChart3 className="w-4.5 h-4.5 text-tech-teal-400" />
                Quote Enquiries / RFQ Pipeline
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-white/10 text-gray-500 font-semibold uppercase tracking-wider">
                      <th className="pb-3">Reference</th>
                      <th className="pb-3">Client / Company</th>
                      <th className="pb-3">Details</th>
                      <th className="pb-3 text-right">Value Range</th>
                      <th className="pb-3 text-center">Status Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quotes.map(q => (
                      <tr key={q.id} className="border-b border-white/5 last:border-0 hover:bg-white/2">
                        <td className="py-3 font-semibold text-gray-400">Ref: {q.id.slice(0, 6)}</td>
                        <td className="py-3">
                          <div className="flex flex-col">
                            <span className="text-white font-bold">{q.name}</span>
                            <span className="text-[10px] text-gray-500">{q.company || "Guest"}</span>
                          </div>
                        </td>
                        <td className="py-3">
                          <div className="flex flex-col">
                            <span className="text-gray-300 font-semibold">{q.materialType.replace("_", " ")}</span>
                            <span className="text-[10px] text-gray-500">{q.dimensions} • {q.quantity.toLocaleString()} pcs</span>
                          </div>
                        </td>
                        <td className="py-3 text-right font-bold text-tech-teal-300">
                          ₹{q.estimatedMinPrice.toLocaleString()}
                        </td>
                        <td className="py-3 text-center">
                          <select
                            value={q.status}
                            disabled={updatingId === q.id}
                            onChange={(e) => handleUpdateQuoteStatus(q.id, e.target.value)}
                            className="bg-obsidian-900 border border-white/10 rounded-md py-1 px-2 text-[10px] text-white focus:outline-none focus:border-tech-teal-500 cursor-pointer"
                          >
                            <option value="PENDING">PENDING</option>
                            <option value="REVIEWED">REVIEWED</option>
                            <option value="CONVERTED">CONVERTED</option>
                            <option value="CLOSED">CLOSED</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* General Lead Manager Table */}
            <div className="glass-panel p-6 rounded-2xl border border-white/10">
              <h2 className="text-white font-display text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                <Users className="w-4.5 h-4.5 text-packaging-green-500" />
                Callback Leads & Messages
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-white/10 text-gray-500 font-semibold uppercase tracking-wider">
                      <th className="pb-3">Contact</th>
                      <th className="pb-3">Inquiry Type</th>
                      <th className="pb-3">Message</th>
                      <th className="pb-3 text-center">Status Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map(l => (
                      <tr key={l.id} className="border-b border-white/5 last:border-0 hover:bg-white/2">
                        <td className="py-3">
                          <div className="flex flex-col">
                            <span className="text-white font-bold">{l.name}</span>
                            <span className="text-[10px] text-gray-400">{l.phone}</span>
                            <span className="text-[9px] text-gray-500">{l.email}</span>
                          </div>
                        </td>
                        <td className="py-3">
                          <span className={`text-[9px] font-bold uppercase py-0.5 px-2 rounded-full inline-block ${
                            l.type === "CALLBACK"
                              ? "bg-yellow-500/10 text-yellow-400"
                              : l.type === "EXPORT"
                              ? "bg-indigo-500/10 text-indigo-400"
                              : "bg-gray-500/10 text-gray-400"
                          }`}>
                            {l.type}
                          </span>
                        </td>
                        <td className="py-3 max-w-[200px] truncate text-gray-400" title={l.message}>
                          {l.message || "Request call back ASAP."}
                        </td>
                        <td className="py-3 text-center">
                          <select
                            value={l.status}
                            disabled={updatingId === l.id}
                            onChange={(e) => handleUpdateLeadStatus(l.id, e.target.value)}
                            className="bg-obsidian-900 border border-white/10 rounded-md py-1 px-2 text-[10px] text-white focus:outline-none focus:border-tech-teal-500 cursor-pointer"
                          >
                            <option value="NEW">NEW</option>
                            <option value="CONTACTED">CONTACTED</option>
                            <option value="ARCHIVED">ARCHIVED</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* Right Column: Order Stage Control & Inventory */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            
            {/* Active Production Stage Controller */}
            <div className="glass-panel p-6 rounded-2xl border border-white/10">
              <h2 className="text-white font-display text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                <Layers className="w-4.5 h-4.5 text-yellow-500" />
                Plant Production Stages
              </h2>

              <div className="flex flex-col gap-5">
                {orders.map(o => (
                  <div key={o.id} className="p-4 rounded-xl bg-white/5 border border-white/5 flex flex-col gap-3">
                    <div className="flex justify-between items-start">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-gray-500 font-bold uppercase">{o.orderNumber}</span>
                        <span className="text-white font-bold text-xs uppercase mt-0.5">{o.quote.materialType.replace("_", " ")}</span>
                      </div>
                      <span className="text-[10px] font-bold text-yellow-500">{o.totalQuantity.toLocaleString()} pcs</span>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <span className="text-[10px] text-gray-400 font-semibold uppercase">Move Production Pipeline:</span>
                      <select
                        value={o.status}
                        disabled={updatingId === o.id}
                        onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                        className="w-full bg-obsidian-900 border border-white/10 rounded-lg py-2 px-3 text-xs text-white focus:outline-none focus:border-yellow-500 cursor-pointer"
                      >
                        {productionStages.map(stage => (
                          <option key={stage} value={stage}>{stage.replace("_", " ")}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mock Live Factory Stock/Inventory Meters */}
            {inventory && (
              <div className="glass-panel p-6 rounded-2xl border border-white/10 bg-gradient-to-b from-[#0c0c16] to-[#04040a]">
                <h2 className="text-white font-display text-sm font-bold uppercase tracking-wider mb-5 flex items-center gap-2">
                  <Database className="w-4.5 h-4.5 text-tech-teal-400" />
                  Live Factory Stock Levels
                </h2>

                <div className="flex flex-col gap-4">
                  {/* Granules */}
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">PP Resin Granules</span>
                      <span className="text-white font-bold">{inventory.rawPPGranulesTons} Tons</span>
                    </div>
                    <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden border border-white/5">
                      <div className="bg-tech-teal-500 h-full rounded-full" style={{ width: "85%" }} />
                    </div>
                  </div>

                  {/* BOPP Film */}
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">BOPP High Gloss Film</span>
                      <span className="text-yellow-400 font-bold">{inventory.boppLaminationFilmKg} Kg</span>
                    </div>
                    <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden border border-white/5">
                      <div className="bg-yellow-500 h-full rounded-full" style={{ width: "45%" }} />
                    </div>
                  </div>

                  {/* Fabric Meters */}
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">Looms Fabric rolls</span>
                      <span className="text-white font-bold">{inventory.wovenLoomsFabricMeters.toLocaleString()} Meters</span>
                    </div>
                    <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden border border-white/5">
                      <div className="bg-packaging-green-500 h-full rounded-full" style={{ width: "70%" }} />
                    </div>
                  </div>

                  {/* Ink Canisters */}
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">Ink canisters stock</span>
                      <span className="text-white font-bold">{inventory.inkContainersCount} canisters</span>
                    </div>
                    <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden border border-white/5">
                      <div className="bg-purple-500 h-full rounded-full" style={{ width: "90%" }} />
                    </div>
                  </div>
                </div>

                <div className="mt-6 border-t border-white/5 pt-4 flex flex-col gap-2">
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Raw Material grades:</span>
                  {inventory.rawGrades.map((grade: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center text-[10px] bg-white/3 py-1.5 px-3 rounded-lg border border-white/5">
                      <span className="text-white font-semibold">{grade.grade}</span>
                      <span className={`font-bold px-1.5 py-0.5 rounded-full ${
                        grade.status === "OPTIMAL" ? "text-emerald-400" : "text-yellow-400"
                      }`}>{grade.stock}T ({grade.status})</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
}
