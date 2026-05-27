"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, ArrowRight, MessageSquare } from "lucide-react";

interface Product {
  id: string;
  name: string;
  category: string;
  desc: string;
  capacity: string;
  moq: string;
  gsmRange: string;
  denier: string;
  printing: string;
  lamination: string;
}

interface BrandItem {
  name: string;
  type: "rice" | "dal" | "flour" | "cem" | "general";
  image: string;
}

const BRANDS: BrandItem[] = [
  { name: "Aahar HMT Rice", type: "rice", image: "/brand-image/aahar.jpg" },
  { name: "Gokul", type: "rice", image: "/brand-image/gokul.jpg" },
  { name: "Delhi Darbar", type: "rice", image: "/brand-image/delhi-darbar.jpg" },
  { name: "Bell", type: "dal", image: "/brand-image/bell.jpg" },
  { name: "Shimla Apple", type: "general", image: "/brand-image/shimla-apple.jpg" },
  { name: "Anarkali", type: "dal", image: "/brand-image/anarkali.jpg" },
  { name: "Nawab", type: "rice", image: "/brand-image/nawab.jpg" },
  { name: "Annapurna Gold", type: "rice", image: "/brand-image/annapurna.jpg" },
  { name: "Lion", type: "rice", image: "/brand-image/lion.jpg" },
  { name: "Kurnool Special", type: "rice", image: "/brand-image/kurnool.jpg" },
  { name: "Kisan", type: "rice", image: "/brand-image/kisan.jpg" },
  { name: "Jaguar", type: "rice", image: "/brand-image/jaguar.jpg" },
  { name: "Lakshmi", type: "rice", image: "/brand-image/lakshmi.jpg" },
  { name: "Bullet", type: "rice", image: "/brand-image/bullet.jpg" },
  { name: "Royal Bullet", type: "rice", image: "/brand-image/royal bullet.jpg" },
  { name: "5 Star", type: "rice", image: "/brand-image/5 star.jpg" },
  { name: "Tajmahal Gold", type: "rice", image: "/brand-image/tajmahal gold.jpg" },
  { name: "Tomato Gold", type: "rice", image: "/brand-image/tomato gold.jpg" },
  { name: "JSR Rice", type: "rice", image: "/brand-image/jsr.jpg" },
  { name: "HMT Rice", type: "rice", image: "/brand-image/hmt.jpg" },
  { name: "Classic Gold", type: "rice", image: "/brand-image/classic gold.jpg" },
  { name: "Golden Eagle", type: "rice", image: "/brand-image/golden eagle.jpg" },
  { name: "Veer Shivaji", type: "rice", image: "/brand-image/veer shivaji.jpg" },
  { name: "Gajraj Evergreen", type: "rice", image: "/brand-image/gajraj.jpg" },
  { name: "Cow", type: "rice", image: "/brand-image/cow.jpg" },
  { name: "Mezbaan", type: "rice", image: "/brand-image/mezbaan.jpg" },
  { name: "Lal Badshah", type: "rice", image: "/brand-image/lalbadshah.jpg" },
  { name: "Raja Gajendra", type: "rice", image: "/brand-image/raja gajendra.jpg" },
  { name: "Dawat Special", type: "rice", image: "/brand-image/daawat.jpg" },
  { name: "Golden Cycle", type: "rice", image: "/brand-image/golden cycle brand.jpg" },
  { name: "Kissan Tractor", type: "rice", image: "/brand-image/kissan tractor.jpg" }
];

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedBrandName, setSelectedBrandName] = useState<string>("Aahar HMT Rice");

  const productData: Product[] = [
    {
      id: "bopp-rice",
      name: "Premium BOPP Rice Bags",
      category: "RICE_BAGS",
      desc: "Premium printed BOPP bags for rice mills and brands with robust build.",
      capacity: "5kg, 10kg, 25kg, 30kg, 50kg",
      moq: "10,000 Pcs",
      gsmRange: "80 - 100 GSM",
      denier: "800 - 1000",
      printing: "Up to 8 Colors (Gravure)",
      lamination: "High Gloss / Matte Film Lamination"
    },
    {
      id: "bopp-dal",
      name: "BOPP Dal Bags",
      category: "DAL_BAGS",
      desc: "Durable BOPP bags for pulses and lentils with custom brand detailing.",
      capacity: "5kg, 10kg, 25kg, 30kg, 50kg",
      moq: "10,000 Pcs",
      gsmRange: "85 - 105 GSM",
      denier: "800 - 950",
      printing: "Up to 8 Colors (Gravure)",
      lamination: "Gloss Lamination with transparent window"
    },
    {
      id: "bopp-flour",
      name: "BOPP Flour Bags",
      category: "FLOUR_BAGS",
      desc: "Attractive BOPP bags for packaging atta, maida, suji, and other flours.",
      capacity: "5kg, 10kg, 25kg, 30kg, 50kg",
      moq: "15,000 Pcs",
      gsmRange: "75 - 90 GSM",
      denier: "750 - 900",
      printing: "Up to 8 Colors (Gravure)",
      lamination: "BOPP lamination + PE food liner"
    },
    {
      id: "bopp-cem",
      name: "BOPP Cem Bags",
      category: "CEM_BAGS",
      desc: "Strong BOPP laminated packaging bags engineered for white cement and dry mixes.",
      capacity: "5kg, 10kg, 25kg, 30kg, 50kg",
      moq: "20,000 Pcs",
      gsmRange: "75 - 90 GSM",
      denier: "750 - 850",
      printing: "Up to 4 Colors (Flexo/Gravure)",
      lamination: "External PP Coating + Perforated seams"
    },
    {
      id: "general-packaging",
      name: "General Packaging Bags",
      category: "GENERAL_PACKAGING",
      desc: "Custom BOPP laminated bags for multiple agriculture, grain, and chemical products.",
      capacity: "Custom size, Custom print",
      moq: "5,000 Pcs",
      gsmRange: "80 - 110 GSM",
      denier: "700 - 1100",
      printing: "Custom Printing (Up to 8 Colors)",
      lamination: "Laminated or Unlaminated Options"
    },
    {
      id: "general-brands-card",
      name: "Ready General Brand Bags",
      category: "GENERAL_BRANDS",
      desc: "Instant pre-printed bags for major regional brands. Ready to dispatch with no minimum order size.",
      capacity: "5kg, 10kg, 25kg, 30kg",
      moq: "No Minimum (Available in stock)",
      gsmRange: "80 - 105 GSM",
      denier: "800 - 1000",
      printing: "Standard Pre-Printed Brand Layouts",
      lamination: "Gloss BOPP Lamination Film"
    }
  ];

  const categories = [
    { id: "ALL", label: "All Products" },
    { id: "RICE_BAGS", label: "Rice Bags" },
    { id: "DAL_BAGS", label: "Dal Bags" },
    { id: "FLOUR_BAGS", label: "Flour Bags" },
    { id: "CEM_BAGS", label: "Cem Bags" },
    { id: "GENERAL_PACKAGING", label: "General Packaging" },
    { id: "GENERAL_BRANDS", label: "General Brands" }
  ];

  const filteredProducts = productData.filter(prod => {
    const matchesSearch = prod.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          prod.desc.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === "ALL" || prod.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const filteredBrands = BRANDS.filter(br =>
    br.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedBrand = BRANDS.find(b => b.name === selectedBrandName) || BRANDS[0];

  return (
    <div className="relative min-h-screen py-10 bg-[radial-gradient(circle_at_50%_10%,rgba(0,242,254,0.04),transparent_50%)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="font-display font-black text-3xl sm:text-4xl text-white uppercase tracking-wider">
            Industrial Packaging Catalog
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1 max-w-xl mx-auto">
            Browse our range of high-strength laminated and woven sacks engineered to global export specifications.
          </p>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8 border-b border-white/10 pb-6">
          {/* Categories tag list */}
          <div className="flex gap-2 flex-wrap items-center justify-center md:justify-start">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`py-1.5 px-4 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                  selectedCategory === cat.id
                    ? "bg-tech-teal-500 text-background"
                    : "bg-white/5 border border-white/5 text-gray-400 hover:text-white"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search field */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder={selectedCategory === "GENERAL_BRANDS" ? "Search brands..." : "Search specifications..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 pl-9 text-xs text-white focus:outline-none focus:border-tech-teal-500"
            />
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
          </div>
        </div>

        {/* Conditionally Render General Brands Viewer or Products Grid */}
        {selectedCategory === "GENERAL_BRANDS" ? (
          <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 max-w-4xl mx-auto my-6 bg-gradient-to-b from-[#0c0c16] to-[#04040a]">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              {/* Left Column: Selector */}
              <div className="md:col-span-7 flex flex-col gap-6">
                <div>
                  <span className="text-xs uppercase font-extrabold text-tech-teal-300 tracking-wider">
                    General Brand BOPP Bags
                  </span>
                  <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                    Ready general brand bags for rice, dal, flour and cement. No bulk requirement – you can order any quantity by call, WhatsApp, or form.
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs text-gray-300 font-semibold uppercase tracking-wider">
                    Select General Brand
                  </label>
                  <select
                    value={selectedBrandName}
                    onChange={(e) => setSelectedBrandName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 px-3 text-xs text-white focus:outline-none focus:border-tech-teal-500 cursor-pointer"
                  >
                    {filteredBrands.map((br) => (
                      <option key={br.name} value={br.name} className="bg-obsidian-950 text-white">
                        {br.name}
                      </option>
                    ))}
                    {filteredBrands.length === 0 && (
                      <option disabled value="" className="bg-obsidian-950 text-gray-500">
                        No brands match your search
                      </option>
                    )}
                  </select>
                </div>

                <div className="flex flex-col gap-2 bg-white/5 p-4 rounded-xl border border-white/5">
                  <h4 className="text-[11px] font-bold text-white uppercase tracking-wider">Customization & Order Details</h4>
                  <ul className="text-[11px] text-gray-400 flex flex-col gap-1.5 list-disc pl-4">
                    <li>Any brand name and artwork as per customer design.</li>
                    <li>Up to 8 colours with high-quality printing.</li>
                    <li>Thickness as per requirement.</li>
                    <li>Gum lamination and metallic finish available.</li>
                    <li>Any fabric brand, any colour (as per availability).</li>
                    <li>Standard inks and proto/rotogravure fabric not supplied.</li>
                  </ul>
                  <p className="text-[10px] text-yellow-500 font-bold mt-2">
                    * Mill Brand: Bulk orders only. Contact by call, WhatsApp, or enquiry form.
                  </p>
                  <p className="text-[10px] text-tech-teal-300 font-bold">
                    * General Brand: No bulk requirement. Order any quantity by call, WhatsApp, or enquiry form.
                  </p>
                </div>
              </div>

              {/* Right Column: Bag Mockup Preview */}
              <div className="md:col-span-5 flex flex-col items-center justify-center p-4 rounded-xl border border-white/5 bg-white/5 relative">
                <img
                  src={selectedBrand.image}
                  alt={selectedBrand.name}
                  className="max-h-[300px] w-auto object-contain rounded-lg shadow-xl mb-4 border border-white/10 bg-white"
                />
                <h3 className="text-white font-bold text-xs uppercase tracking-wider text-center mb-4">
                  {selectedBrand.name}
                </h3>
                
                <a
                  href={`https://wa.me/919490343682?text=Hello,%20I'm%20inquiring%20about%20your%20General%20Brand%20packaging%20bag:%20${encodeURIComponent(selectedBrand.name)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs transition-colors cursor-pointer text-center inline-flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(234,88,12,0.2)]"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  WhatsApp about this brand
                </a>
              </div>
            </div>
          </div>
        ) : (
          /* Products Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map(prod => (
              <div
                key={prod.id}
                className="glass-panel p-6 rounded-2xl border border-white/10 hover:border-tech-teal-500/30 flex flex-col justify-between group transition-all"
              >
                {/* Product header info */}
                <div>
                  <h3 className="text-white font-bold text-base uppercase tracking-wider mb-2">
                    {prod.name}
                  </h3>
                  <p className="text-xs text-gray-400 leading-relaxed mb-5">{prod.desc}</p>

                  {/* Specification Table */}
                  <div className="border-t border-white/5 pt-3 flex flex-col gap-2 mb-6">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-gray-500">Weight GSM:</span>
                      <span className="text-white font-medium">{prod.gsmRange}</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-gray-500">Polymer Denier:</span>
                      <span className="text-white font-medium">{prod.denier}</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-gray-500">Load Capacity:</span>
                      <span className="text-white font-medium">{prod.capacity}</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-gray-500">Printing Styles:</span>
                      <span className="text-white font-medium">{prod.printing}</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-gray-500">MOQ requirement:</span>
                      <span className="text-tech-teal-300 font-semibold">{prod.moq}</span>
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex gap-3 border-t border-white/5 pt-4 mt-auto">
                  {prod.id === "general-brands-card" ? (
                    <>
                      <button
                        onClick={() => setSelectedCategory("GENERAL_BRANDS")}
                        className="flex-grow py-2.5 px-3 rounded-lg border border-white/10 hover:bg-white/5 text-xs font-semibold text-gray-300 hover:text-white transition-colors cursor-pointer text-center inline-flex items-center justify-center"
                      >
                        Browse Brands
                      </button>
                      <a
                        href="https://wa.me/919490343682?text=Hello,%20I'm%20inquiring%20about%20your%20Ready%20General%20Brand%20Bags"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-grow py-2.5 px-3 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs hover:scale-102 transition-transform cursor-pointer inline-flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(234,88,12,0.2)]"
                      >
                        WhatsApp
                      </a>
                    </>
                  ) : (
                    <>
                      <Link
                        href={`/products/${prod.id}`}
                        className="flex-grow py-2.5 px-3 rounded-lg border border-white/10 hover:bg-white/5 text-xs font-semibold text-gray-300 hover:text-white transition-colors cursor-pointer text-center inline-flex items-center justify-center"
                      >
                        View Details
                      </Link>
                      <Link
                        href={`/studio?type=${prod.id}`}
                        className="flex-grow py-2.5 px-3 rounded-lg bg-linear-to-r from-tech-teal-500 to-tech-teal-700 text-background font-bold text-xs hover:scale-102 transition-transform cursor-pointer inline-flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(0,242,254,0.15)]"
                      >
                        Design 3D
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Ready General Brands Showcase (Visible on ALL, GENERAL_BRANDS, and category views) */}
        {((selectedCategory === "ALL" || selectedCategory === "GENERAL_BRANDS" || selectedCategory === "RICE_BAGS" || selectedCategory === "DAL_BAGS" || selectedCategory === "FLOUR_BAGS" || selectedCategory === "GENERAL_PACKAGING") && (
          <div className="mt-16 border-t border-white/10 pt-12">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <span className="text-[10px] text-tech-teal-300 font-bold uppercase tracking-wider">Ready Sacks Inventory</span>
                <h2 className="text-white font-display text-xl font-black uppercase tracking-wider mt-1">
                  {selectedCategory === "ALL" ? "Ready General Brands Gallery" : 
                   selectedCategory === "RICE_BAGS" ? "Ready Rice Brands Gallery" :
                   selectedCategory === "DAL_BAGS" ? "Ready Dal/Pulses Brands Gallery" : 
                   selectedCategory === "FLOUR_BAGS" ? "Ready Flour Brands Gallery" : "General Brands Gallery"}
                </h2>
                <p className="text-xs text-gray-400 mt-1 max-w-xl">
                  Pre-designed branded woven sacks available for immediate ordering. Tap "Open in 3D" to customize or "WhatsApp" to place a quick order.
                </p>
              </div>
            </div>

            {/* Brands Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {BRANDS.filter(br => {
                const matchesSearch = br.name.toLowerCase().includes(searchQuery.toLowerCase());
                if (!matchesSearch) return false;
                
                if (selectedCategory === "RICE_BAGS") return br.type === "rice";
                if (selectedCategory === "DAL_BAGS") return br.type === "dal";
                if (selectedCategory === "FLOUR_BAGS") return br.type === "flour";
                if (selectedCategory === "GENERAL_PACKAGING") return br.type === "general";
                return true; // show all for ALL and GENERAL_BRANDS
              }).map((br) => (
                <div key={br.name} className="bg-white/3 border border-white/5 hover:border-tech-teal-500/30 rounded-xl p-3 flex flex-col justify-between group transition-all">
                  <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg bg-white/5 mb-3 flex items-center justify-center border border-white/5 p-2">
                    <img
                      src={br.image}
                      alt={br.name}
                      className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div>
                    <span className={`text-[8px] font-extrabold uppercase py-0.5 px-1.5 rounded-full inline-block mb-1.5 ${
                      br.type === "rice" ? "bg-yellow-500/10 text-yellow-400" :
                      br.type === "dal" ? "bg-teal-500/10 text-teal-400" : "bg-purple-500/10 text-purple-400"
                    }`}>
                      {br.type === "rice" ? "Rice Bag" : br.type === "dal" ? "Dal Bag" : "General Packaging"}
                    </span>
                    <h3 className="text-white font-bold text-xs uppercase tracking-wider line-clamp-1 mb-3" title={br.name}>
                      {br.name}
                    </h3>
                  </div>
                  <div className="flex flex-col gap-1.5 mt-auto">
                    <a
                      href={`https://wa.me/919490343682?text=Hello,%20I'm%20inquiring%20about%20your%20General%20Brand%20bag:%20${encodeURIComponent(br.name)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-1.5 rounded-md bg-orange-600 hover:bg-orange-500 text-white font-bold text-[10px] transition-colors text-center inline-flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <MessageSquare className="w-3 h-3" />
                      WhatsApp
                    </a>
                    <Link
                      href={`/studio?type=${br.type === "rice" ? "bopp-rice" : "bopp-dal"}&brand=${encodeURIComponent(br.name)}`}
                      className="w-full py-1.5 rounded-md bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 hover:text-white font-bold text-[10px] transition-colors text-center inline-flex items-center justify-center gap-1 cursor-pointer"
                    >
                      Open in 3D
                    </Link>
                  </div>
                </div>
              ))}
              {BRANDS.filter(br => {
                const matchesSearch = br.name.toLowerCase().includes(searchQuery.toLowerCase());
                if (!matchesSearch) return false;
                if (selectedCategory === "RICE_BAGS") return br.type === "rice";
                if (selectedCategory === "DAL_BAGS") return br.type === "dal";
                if (selectedCategory === "FLOUR_BAGS") return br.type === "flour";
                if (selectedCategory === "GENERAL_PACKAGING") return br.type === "general";
                return true;
              }).length === 0 && (
                <div className="col-span-full py-12 text-center text-gray-500 text-xs">
                  No matching brands found for "{searchQuery}".
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
