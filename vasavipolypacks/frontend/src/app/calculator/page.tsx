"use client";

import React from "react";
import { CostCalculator } from "@/components/CostCalculator";

export default function CalculatorPage() {
  return (
    <div className="relative min-h-screen py-10 bg-[radial-gradient(circle_at_50%_10%,rgba(16,185,129,0.03),transparent_50%)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="font-display font-black text-3xl sm:text-4xl text-white uppercase tracking-wider">
            Industrial Price Estimator
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1 max-w-xl mx-auto">
            Input target dimensions, material weights, and order volumes to instantly calculate sliding scale quotes.
          </p>
        </div>

        <CostCalculator prefilledConfig={null} />
      </div>
    </div>
  );
}
