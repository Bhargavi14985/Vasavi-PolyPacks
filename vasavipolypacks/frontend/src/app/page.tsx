"use client";

import React, { useState } from "react";
import Link from "next/link";
import { apiRequest } from "@/utils/api";
import { ArrowRight, Box, BarChart3, ShieldCheck, Factory, Award, MessageSquare, Globe, ArrowUpRight, Play, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function HomePage() {
  // Callback Request Lead Capture State
  const [callbackName, setCallbackName] = useState("");
  const [callbackPhone, setCallbackPhone] = useState("");
  const [callbackSuccess, setCallbackSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCallbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!callbackName || !callbackPhone) return;

    setLoading(true);
    try {
      await apiRequest("/leads", {
        method: "POST",
        body: JSON.stringify({
          name: callbackName,
          phone: callbackPhone,
          message: "Requesting callback from Homepage quick widget",
          type: "CALLBACK"
        })
      });
      setCallbackSuccess(true);
      setCallbackName("");
      setCallbackPhone("");
      setTimeout(() => setCallbackSuccess(false), 5000);
    } catch (err) {
      console.error(err);
      alert("Failed to submit callback request. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  const workflowSteps = [
    {
      step: "01",
      title: "Granule Extrusion",
      desc: "High-grade virgin polypropylene granules are melted and extruded into high-strength micro tapes."
    },
    {
      step: "02",
      title: "PP Weaving Looms",
      desc: "Circular weaving looms weave tape spools into high-durability tubular fabric rolls."
    },
    {
      step: "03",
      title: "High-Speed Gravure Printing",
      desc: "Photorealistic up to 8-color designs reverse printed on BOPP film layers."
    },
    {
      step: "04",
      title: "Extrusion Lamination",
      desc: "Printed BOPP films are heat bonded onto the PP fabric layer using raw molten polymer."
    },
    {
      step: "05",
      title: "Seaming & Stitching",
      desc: "Cutting rolls, folding gussets, inserting PE liners, and sewing base hems."
    },
    {
      step: "06",
      title: "QA Auditing",
      desc: "Every batch passes drop tests, weld seam inspections, and weight checks."
    }
  ];

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Cyber Glow Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,242,254,0.06),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(16,185,129,0.04),transparent_50%)]" />

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-tech-teal-500/30 bg-tech-teal-500/5 text-tech-teal-300 text-xs font-semibold uppercase tracking-wider mb-6">
          <Globe className="w-3.5 h-3.5" />
          Export-Grade B2B Industrial Supply
        </div>

        <h1 className="font-display font-black text-4xl sm:text-6xl tracking-tight text-white max-w-4xl leading-tight">
          FUTURE-READY <span className="text-gradient-teal-emerald">PACKAGING SYSTEMS</span> FOR INDUSTRIAL LEADERS
        </h1>

        <p className="mt-6 text-sm sm:text-base text-gray-400 max-w-2xl leading-relaxed">
          Vasavi Polypacks manufactures high-strength BOPP laminated bags, PP woven sacks, dal & food grain bags, and block bottom valve sacks. Completely customized configurations delivered globally.
        </p>

        {/* Hero CTAs */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 items-center justify-center">
          <Link
            href="/studio"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-tech-teal-500 to-tech-teal-700 py-3.5 px-8 font-bold text-sm text-background hover:scale-103 transition-transform shadow-[0_0_20px_rgba(0,242,254,0.3)]"
          >
            <Box className="w-4 h-4" />
            Launch 3D studio
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/calculator"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-white/5 border border-white/10 py-3.5 px-8 font-bold text-sm text-white hover:bg-white/10 transition-colors"
          >
            <BarChart3 className="w-4 h-4 text-packaging-green-500" />
            Get Quotation
          </Link>
        </div>
      </section>


      {/* Cinematic Factory Timeline Experience */}
      <section className="bg-obsidian-950/70 border-y border-white/10 py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-16">
            <div>
              <span className="text-xs uppercase tracking-widest text-tech-teal-300 font-semibold flex items-center gap-1">
                <Factory className="w-3.5 h-3.5" />
                Advanced Manufacturing Facility
              </span>
              <h2 className="font-display font-black text-2xl sm:text-4xl text-white uppercase tracking-wider mt-2">
                Cinematic Production Workflow
              </h2>
            </div>
            <Link
              href="/products"
              className="inline-flex items-center gap-1 text-xs text-tech-teal-300 font-bold uppercase tracking-wider border-b border-tech-teal-500/30 hover:border-tech-teal-300 pb-0.5"
            >
              View Plant Tour Machinery
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Timeline Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {workflowSteps.map((step, idx) => (
              <div key={idx} className="flex gap-4 relative">
                <div className="font-display font-black text-2xl text-white/10 leading-none shrink-0">
                  {step.step}
                </div>
                <div className="flex flex-col">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">{step.title}</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust section, certifications & Lead Generation form */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Trust points */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            <div>
              <span className="text-xs uppercase tracking-widest text-packaging-green-500 font-semibold flex items-center gap-1.5">
                <Award className="w-4 h-4" />
                Trusted by 850+ Global Enterprises
              </span>
              <h2 className="font-display font-black text-2xl sm:text-4xl text-white uppercase tracking-wider mt-2">
                Uncompromising Quality Audit
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
              Vasavi Polypacks stands for quality packaging solutions. Our clean vaults and advanced manufacturing units allow us to ensure zero defects, optimal GSM weights, and tear-free lamination films.
            </p>

            <div className="flex flex-col gap-3">
              {[
                "100% Food-Grade high strength Virgin Polypropylene materials",
                "ISO 9001:2015 & ISO 22000 quality control systems",
                "Custom plate designing for brand shelf dominance",
                "Advanced extrusion coating lamination units"
              ].map((point, index) => (
                <div key={index} className="flex items-center gap-2.5 text-xs text-white">
                  <CheckCircle className="w-4 h-4 text-tech-teal-400 shrink-0" />
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Callback capture form */}
          <div className="lg:col-span-6 glass-panel p-8 rounded-2xl border border-white/10 relative">
            {callbackSuccess ? (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-packaging-green-500 mx-auto mb-4" />
                <h3 className="text-white font-semibold text-lg uppercase tracking-wider">Callback Logged!</h3>
                <p className="text-xs text-gray-400 mt-2">
                  Thank you. An industrial packaging consultant will ring you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleCallbackSubmit} className="flex flex-col gap-5">
                <div>
                  <h3 className="text-white font-semibold text-base uppercase tracking-wider">Request Callback</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Quick query? Drop your phone and we'll ring you back.</p>
                </div>

                <div className="flex flex-col gap-2">
                  <input
                    type="text"
                    placeholder="Enter Your Name"
                    value={callbackName}
                    onChange={(e) => setCallbackName(e.target.value)}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 px-3 text-xs text-white focus:outline-none focus:border-tech-teal-500"
                  />
                  <input
                    type="tel"
                    placeholder="Contact Number (e.g. +91 9490343682)"
                    value={callbackPhone}
                    onChange={(e) => setCallbackPhone(e.target.value)}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 px-3 text-xs text-white focus:outline-none focus:border-tech-teal-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="py-3 px-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold text-xs transition-colors cursor-pointer text-center"
                >
                  {loading ? "Submitting Request..." : "Schedule Call"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
