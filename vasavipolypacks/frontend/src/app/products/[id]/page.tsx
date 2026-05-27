"use client";

import React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Box, CheckCircle2, ShieldCheck, Factory, HelpCircle, BarChart3 } from "lucide-react";

interface ProductDetails {
  id: string;
  name: string;
  categoryName: string;
  desc: string;
  capacity: string;
  moq: string;
  gsmRange: string;
  denier: string;
  printing: string;
  lamination: string;
  features: string[];
  applications: string[];
}

const PRODUCTS_MAP: Record<string, ProductDetails> = {
  "bopp-rice": {
    id: "bopp-rice",
    name: "Premium BOPP Rice Bags",
    categoryName: "Rice Bags Series",
    desc: "Engineered specifically for rice mill packaging requirements. These bags are manufactured using high-strength virgin polypropylene woven fabric reverse-laminated with multi-color printed BOPP film to give your brand a photorealistic, premium appearance on retail shelves.",
    capacity: "5kg, 10kg, 25kg, 30kg, 50kg standard capacities",
    moq: "10,000 Pcs per size/design",
    gsmRange: "80 - 100 GSM fabric density",
    denier: "800 - 1000 tape strength",
    printing: "Up to 8 Colors high-definition rotogravure reverse printing",
    lamination: "Glossy OPP film lamination, double-side options available",
    features: [
      "100% moisture-barrier lamination to prevent grains from getting damp",
      "High tensile strength to withstand rough shipping and bulk stacking",
      "Excellent print resolution for photographic quality branding",
      "Anti-skid weave texture to prevent slips during pallet stacking",
      "Option to insert high-density PE liners for additional moisture protection"
    ],
    applications: ["Basmati & Non-Basmati Rice packaging", "Export-grade grain storage", "Premium retail display sacks"]
  },
  "bopp-dal": {
    id: "bopp-dal",
    name: "BOPP Dal Bags",
    categoryName: "Pulses & Lentils Series",
    desc: "Premium packaging bags custom-tailored for dal, pulses, lentils, and grocery brands. Standard specifications include a glossy surface lamination, precise alignment for display branding, and optional transparent windows to let buyers inspect grain quality.",
    capacity: "5kg, 10kg, 25kg, 30kg, 50kg standard capacities",
    moq: "10,000 Pcs",
    gsmRange: "85 - 105 GSM fabric density",
    denier: "800 - 950 tape strength",
    printing: "Up to 8 Colors photorealistic gravure reverse printing",
    lamination: "Glossy BOPP film lamination with option for transparent product window strip",
    features: [
      "Ultra-clear transparent window strips for grain visibility",
      "Food-grade certification for chemical-free raw material weave",
      "Heavy load bearing construction with reinforced base stitching",
      "Ultraviolet (UV) protection options for warehousing longevity",
      "Punched handle options for easy consumer handling on smaller sizes"
    ],
    applications: ["Toor Dal, Moong Dal, Chana Dal packaging", "Pulses & grocery cereals", "Agro-retail shelf boxes"]
  },
  "bopp-flour": {
    id: "bopp-flour",
    name: "BOPP Flour Bags",
    categoryName: "Flour & Powders Series",
    desc: "Manufactured for packing Atta, Maida, Suji, and other fine powders. Features a micro-porous or sealed construction that prevents powder sifting and flour leakage while ensuring the bag stays dry and moisture-free during distribution.",
    capacity: "5kg, 10kg, 25kg, 30kg, 50kg standard capacities",
    moq: "15,000 Pcs",
    gsmRange: "75 - 90 GSM fabric density",
    denier: "750 - 900 tape strength",
    printing: "Up to 8 Colors rotogravure precision printing",
    lamination: "Dual extrusion BOPP film lamination with dust-proof inner PE liner",
    features: [
      "Leak-proof seams to prevent flour sifting and micro-dust leakage",
      "High moisture barrier properties to prevent flour caking or spoilage",
      "Extremely smooth glossy or matte surface finish for eye-catching graphics",
      "Eco-friendly food grade polymer material",
      "Bottom-fold gusset options for square shelf presentation"
    ],
    applications: ["Wheat Atta & Maida packaging", "Suji & Semolina branding", "Baking powder and powder mix supply"]
  },
  "bopp-cem": {
    id: "bopp-cem",
    name: "BOPP Cem Bags",
    categoryName: "Cement & Dry Mixes Series",
    desc: "Heavy-duty BOPP laminated woven sacks specifically constructed to survive automated high-speed filling machinery. Ideal for white cement, wall putty, tile adhesives, and dry powder building mixes. Features dust-proof micro-perforations to allow air release during high pressure filling.",
    capacity: "5kg, 10kg, 25kg, 30kg, 50kg standard capacities",
    moq: "20,000 Pcs",
    gsmRange: "75 - 90 GSM fabric density",
    denier: "750 - 850 tape strength",
    printing: "Up to 4 Colors flexographic or rotogravure surface lamination",
    lamination: "Extrusion coated BOPP with micro-perforated air ventilation holes",
    features: [
      "Micro-perforations for instantaneous air release during automated filling",
      "Zero product leakage / spillage through reinforced block seams",
      "High drop strength to withstand rough construction site handling",
      "Waterproof laminate film surface to prevent cement hydration in storage",
      "Anti-slip weave structure for secure tall pallet stacking"
    ],
    applications: ["White Cement packaging", "Wall Putty & plaster mix", "Tile Adhesives & grout compounds"]
  },
  "general-packaging": {
    id: "general-packaging",
    name: "General Packaging Bags",
    categoryName: "Custom Packaging Series",
    desc: "Versatile, customizable BOPP laminated sacks for miscellaneous agriculture, agro-chemical, pet food, animal feed, fertilizer, and bulk raw material applications. Allows custom sizes, layouts, and accessory combinations.",
    capacity: "Custom dimensions based on customer requirements",
    moq: "5,000 Pcs minimum order",
    gsmRange: "80 - 110 GSM fabric density",
    denier: "700 - 1100 tape strength",
    printing: "Custom high quality Gravure or Flexo printing options",
    lamination: "Laminated or unlaminated outer layers, side gusseted or flat",
    features: [
      "Fully customized dimensions (width, height, and side gusset folds)",
      "Optional heavy duty handles (punched D-cuts, stitched loops)",
      "Optional inner PE lining for humidity protection",
      "Excellent resistance to tearing, punctures, and temperature extremes",
      "Flexible printing layouts to accommodate diverse industrial specifications"
    ],
    applications: ["Fertilizers & Agro-chemicals", "Animal feed & Pet food bags", "Sugar, Salt & Dry chemicals supply"]
  }
};

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params?.id as string;
  const product = PRODUCTS_MAP[productId];

  if (!product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-background text-white p-4">
        <h2 className="text-xl font-bold uppercase tracking-wider mb-2 text-red-400">Product Not Found</h2>
        <p className="text-xs text-gray-400 mb-6">The requested product ID does not exist in our catalog.</p>
        <Link
          href="/products"
          className="py-2.5 px-6 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-bold text-white transition-colors"
        >
          Return to Product Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen py-10 bg-[radial-gradient(circle_at_50%_10%,rgba(0,242,254,0.04),transparent_50%)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back navigation */}
        <div className="mb-6">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Catalog
          </Link>
        </div>

        {/* Product Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Product Visual Mockup Panel */}
          <div className="lg:col-span-5 glass-panel p-8 rounded-2xl border border-white/10 flex flex-col justify-center items-center min-h-[400px] relative overflow-hidden bg-gradient-to-b from-[#0c0c16] to-[#04040a]">
            {/* Ambient visual indicator */}
            <div className="absolute -top-12 -left-12 w-32 h-32 bg-tech-teal-500/10 rounded-full blur-2xl pointer-events-none" />
            
            {/* Graphic Bag Representation */}
            <div className="relative w-48 h-72 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 flex flex-col justify-between items-center transform -rotate-2 hover:rotate-0 transition-transform duration-500 cursor-pointer">
              {/* Top border lines representing packaging stitch */}
              <div className="w-full flex justify-between border-b-2 border-dashed border-gray-300 pb-1 text-[8px] text-gray-400 font-mono">
                <span>VP PACK</span>
                <span>SEALED</span>
              </div>

              {/* Logo / Badge in middle */}
              <div className="flex flex-col items-center gap-1.5 my-auto text-center w-full">
                <img src="/images/logo.png" alt="Vasavi Polypacks" className="w-24 h-auto object-contain bg-white rounded p-0.5" />
                <div className="w-full h-px bg-gray-200 my-2" />
                <span className="text-[14px] font-black text-gray-800 uppercase tracking-tight leading-none">
                  {product.name}
                </span>
                <span className="text-[8px] text-gray-500 font-semibold tracking-wider uppercase mt-1">
                  Premium B2B Supply
                </span>
              </div>

              {/* Bottom bag seal */}
              <div className="w-full flex justify-between items-center text-[7px] text-gray-400 font-bold border-t border-gray-100 pt-1.5">
                <span>CAPACITY: 5-50 KG</span>
                <span>ISO CERTIFIED</span>
              </div>
            </div>

            <p className="text-[10px] text-gray-400 mt-8 text-center italic">
              *Real-time photorealistic visual preview of {product.name}. Customize this bag layout inside our 3D Packaging Studio.
            </p>
          </div>

          {/* Right Column: Detailed Product Information Specs */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            
            {/* Header info */}
            <div className="glass-panel p-6 rounded-2xl border border-white/10">
              <span className="text-xs uppercase font-extrabold text-tech-teal-300 tracking-wider">
                {product.categoryName}
              </span>
              <h1 className="text-white font-display text-2xl sm:text-3xl font-black uppercase tracking-wider mt-1">
                {product.name}
              </h1>
              <p className="text-xs text-gray-400 leading-relaxed mt-3">
                {product.desc}
              </p>
            </div>

            {/* Spec Sheet Table */}
            <div className="glass-panel p-6 rounded-2xl border border-white/10">
              <h3 className="text-white font-bold text-xs uppercase tracking-wider mb-4 flex items-center gap-1.5 border-b border-white/5 pb-2">
                <Factory className="w-4 h-4 text-tech-teal-400" />
                Manufacturing Technical Specifications
              </h3>
              
              <div className="flex flex-col gap-3 text-xs">
                <div className="flex justify-between py-1.5 border-b border-white/5">
                  <span className="text-gray-500">GSM Fabric Range:</span>
                  <span className="text-white font-semibold">{product.gsmRange}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/5">
                  <span className="text-gray-500">Polymer Denier:</span>
                  <span className="text-white font-semibold">{product.denier}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/5">
                  <span className="text-gray-500">Size Options:</span>
                  <span className="text-white font-semibold">{product.capacity}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/5">
                  <span className="text-gray-500">HD Printing Capability:</span>
                  <span className="text-white font-semibold">{product.printing}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/5">
                  <span className="text-gray-500">Surface Lamination:</span>
                  <span className="text-white font-semibold">{product.lamination}</span>
                </div>
                <div className="flex justify-between py-1.5 text-tech-teal-300">
                  <span className="font-semibold">Minimum Order Quantity (MOQ):</span>
                  <span className="font-bold">{product.moq}</span>
                </div>
              </div>
            </div>

            {/* Key Features & Applications */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
              
              {/* Product Features */}
              <div className="glass-panel p-5 rounded-2xl border border-white/10 flex flex-col gap-3">
                <h4 className="text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-packaging-green-500 shrink-0" />
                  Key Features
                </h4>
                <ul className="flex flex-col gap-2 text-[11px] text-gray-400 pl-1">
                  {product.features.map((feat, index) => (
                    <li key={index} className="flex gap-2 items-start">
                      <span className="text-tech-teal-400 font-bold shrink-0">•</span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Product Applications */}
              <div className="glass-panel p-5 rounded-2xl border border-white/10 flex flex-col gap-3">
                <h4 className="text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-yellow-500 shrink-0" />
                  Standard Applications
                </h4>
                <ul className="flex flex-col gap-2 text-[11px] text-gray-400 pl-1">
                  {product.applications.map((app, index) => (
                    <li key={index} className="flex gap-2 items-start">
                      <span className="text-yellow-500 font-bold shrink-0">•</span>
                      <span>{app}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            {/* Action CTAs */}
            <div className="flex gap-4 mt-2">
              <Link
                href={`/studio?type=${product.id}`}
                className="flex-grow py-3 px-4 rounded-xl bg-linear-to-r from-tech-teal-500 to-tech-teal-700 text-background font-bold text-xs hover:scale-102 transition-transform text-center shadow-[0_0_20px_rgba(0,242,254,0.25)] flex items-center justify-center gap-1.5"
              >
                <Box className="w-4 h-4" />
                Launch 3D Packaging Studio
              </Link>
              <Link
                href={`/calculator?type=${product.id}`}
                className="flex-grow py-3 px-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold text-xs transition-colors text-center flex items-center justify-center gap-1.5"
              >
                <BarChart3 className="w-4 h-4 text-packaging-green-500" />
                Request Custom Quotation
              </Link>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
