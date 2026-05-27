"use client";

import React, { useState } from "react";
import { ThreeDConfigurator } from "@/components/ThreeDConfigurator";
import { CostCalculator } from "@/components/CostCalculator";
import { Box, BarChart3, HelpCircle } from "lucide-react";

export default function StudioPage() {
  const [activeTab, setActiveTab] = useState<"visualizer" | "pricing">("visualizer");
  const [prefilledData, setPrefilledData] = useState<any>(null);

  const handleConfigToQuote = (configData: any) => {
    setPrefilledData(configData);
    setActiveTab("pricing");
  };

  return (
    <div className="relative min-h-screen py-10 bg-[radial-gradient(circle_at_50%_10%,rgba(0,242,254,0.05),transparent_50%)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Title */}
        <div className="text-center mb-10">
          <h1 className="font-display font-black text-3xl sm:text-4xl text-white uppercase tracking-wider">
            Packaging Design Workspace
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1 max-w-xl mx-auto">
            Design your bags in 3D, inspect real-time dimensions, and instantly generate B2B manufacturing quotes.
          </p>
        </div>

        {/* Workspace Tab Switcher */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-xl bg-white/5 p-1 border border-white/5">
            <button
              onClick={() => setActiveTab("visualizer")}
              className={`inline-flex items-center gap-2 py-2 px-5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                activeTab === "visualizer"
                  ? "bg-tech-teal-500 text-background"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Box className="w-4 h-4" />
              1. 3D Packaging Studio
            </button>
            <button
              onClick={() => setActiveTab("pricing")}
              className={`inline-flex items-center gap-2 py-2 px-5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                activeTab === "pricing"
                  ? "bg-packaging-green-500 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              2. RFQ Get Quotation
            </button>
          </div>
        </div>

        {/* Tab Contents */}
        <div className="mt-4">
          {activeTab === "visualizer" ? (
            <ThreeDConfigurator onQuoteTrigger={handleConfigToQuote} />
          ) : (
            <CostCalculator prefilledConfig={prefilledData} />
          )}
        </div>

        {/* Help Widget card */}
        <div className="mt-16 glass-panel p-6 rounded-2xl border border-white/5 max-w-3xl mx-auto flex flex-col sm:flex-row gap-4 items-start">
          <HelpCircle className="w-6 h-6 text-tech-teal-400 shrink-0 mt-0.5" />
          <div className="flex flex-col gap-2">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">How B2B Custom Printing Works</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Our B2B platform allows you to customize fabric colors, sizes, and logos. Once you submit a quote, our designers finalize the vector file layout, prepare cylinders, and issue a manufacturing agreement. Mock sample bags can be dispatched to your corporate office for inspection before main printing extrusion.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
