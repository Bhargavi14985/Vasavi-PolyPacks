"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { apiRequest } from "@/utils/api";
import { BarChart3, Mail, Phone, Building, ArrowRight, ShieldCheck, CheckCircle2, ChevronRight, Search, Check, ChevronDown } from "lucide-react";
import confetti from "canvas-confetti";
import { CAPACITY_MAP } from "./ThreeDConfigurator";

const ALL_BRANDS = [
  { label: "Aahar HMT Rice",   value: "AAHAR_HMT_RICE"    },
  { label: "Anarkali",         value: "ANARKALI"           },
  { label: "Annapurna Gold",   value: "ANNAPURNA_GOLD"     },
  { label: "Bell",             value: "BELL"               },
  { label: "Bullet",           value: "BULLET"             },
  { label: "Classic Gold",     value: "CLASSIC_GOLD"       },
  { label: "Cow",              value: "COW"                },
  { label: "Dawat Special",    value: "DAWAT_SPECIAL"      },
  { label: "Delhi Darbar",     value: "DELHI_DARBAR"       },
  { label: "5 Star",           value: "5_STAR"             },
  { label: "Gajraj Evergreen", value: "GAJRAJ_EVERGREEN"   },
  { label: "Gokul",            value: "GOKUL"              },
  { label: "Golden Cycle",     value: "GOLDEN_CYCLE"       },
  { label: "Golden Eagle",     value: "GOLDEN_EAGLE"       },
  { label: "HMT Rice",         value: "HMT_RICE"           },
  { label: "Jaguar",           value: "JAGUAR"             },
  { label: "JSR Rice",         value: "JSR_RICE"           },
  { label: "Kisan",            value: "KISAN"              },
  { label: "Kissan Tractor",   value: "KISSAN_TRACTOR"     },
  { label: "Kurnool Special",  value: "KURNOOL_SPECIAL"    },
  { label: "Lakshmi",          value: "LAKSHMI"            },
  { label: "Lal Badshah",      value: "LAL_BADSHAH"        },
  { label: "Lion",             value: "LION"               },
  { label: "Mezbaan",          value: "MEZBAAN"            },
  { label: "Nawab",            value: "NAWAB"              },
  { label: "Raja Gajendra",    value: "RAJA_GAJENDRA"      },
  { label: "Royal Bullet",     value: "ROYAL_BULLET"       },
  { label: "Shimla Apple",     value: "SHIMLA_APPLE"       },
  { label: "Tajmahal Gold",    value: "TAJMAHAL_GOLD"      },
  { label: "Tomato Gold",      value: "TOMATO_GOLD"        },
  { label: "Veer Shivaji",     value: "VEER_SHIVAJI"       },
];

interface CostCalculatorProps {
  prefilledConfig?: {
    bagType: string;
    color: string;
    width: number;
    height: number;
    gusset: number;
    features: string[];
    printingStyle: string;
    configId: string | null;
  } | null;
}

export const CostCalculator: React.FC<CostCalculatorProps> = ({ prefilledConfig }) => {
  const { user } = useAuth();

  // Inputs
  const [quantity, setQuantity] = useState<number>(25000);
  const [materialType, setMaterialType] = useState<string>("AAHAR_HMT_RICE");
  const [capacityWeight, setCapacityWeight] = useState<string>("25_KG");
  const [brandSearch, setBrandSearch] = useState("");
  const [brandOpen, setBrandOpen] = useState(false);
  const brandRef = useRef<HTMLDivElement>(null);

  // Close brand dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (brandRef.current && !brandRef.current.contains(e.target as Node)) {
        setBrandOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);
  const [width, setWidth] = useState<number>(48);
  const [height, setHeight] = useState<number>(75);
  const [gusset, setGusset] = useState<number>(8);
  const [printingColors, setPrintingColors] = useState<number>(4);
  const [gsm, setGsm] = useState<number>(85); // Grams per Sq. Meter
  
  // Custom features
  const [customRequirements, setCustomRequirements] = useState("");

  // Lead Generation Contact Info
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientCompany, setClientCompany] = useState("");

  // Outputs / Estimations
  const [loading, setLoading] = useState(false);
  const [estimatedPrice, setEstimatedPrice] = useState<any>(null);
  const [successQuoteId, setSuccessQuoteId] = useState<string | null>(null);

  // Sync dimensions with capacityWeight selection
  useEffect(() => {
    const map = CAPACITY_MAP[capacityWeight];
    if (map) {
      setWidth(map.width);
      setHeight(map.height);
      setGusset(map.gusset);
    }
  }, [capacityWeight]);

  // Pre-fill if redirected from 3D studio
  useEffect(() => {
    if (prefilledConfig) {
      setMaterialType(prefilledConfig.bagType);
      setWidth(prefilledConfig.width);
      setHeight(prefilledConfig.height);
      setGusset(prefilledConfig.gusset);
      
      // Infer capacity weight from prefilled dimensions
      const w = prefilledConfig.width;
      const h = prefilledConfig.height;
      if (w <= 32 && h <= 50) {
        setCapacityWeight("5_KG");
      } else if (w <= 38 && h <= 65) {
        setCapacityWeight("10_KG");
      } else if (w <= 49 && h <= 76) {
        setCapacityWeight("25_KG");
      } else if (w <= 52 && h <= 82) {
        setCapacityWeight("30_KG");
      } else {
        setCapacityWeight("50_KG");
      }

      if (prefilledConfig.features && prefilledConfig.features.length > 0) {
        setCustomRequirements(`Configured features: ${prefilledConfig.features.join(", ")}`);
      }

      if (prefilledConfig.printingStyle === "GRAVURE") {
        setPrintingColors(4);
      } else if (prefilledConfig.printingStyle === "FLEXO") {
        setPrintingColors(2);
      } else {
        setPrintingColors(0);
      }
    }
  }, [prefilledConfig]);

  // Pre-fill user profile info if logged in
  useEffect(() => {
    if (user) {
      setClientName(user.name);
      setClientEmail(user.email);
      setClientPhone(user.phone || "");
      setClientCompany(user.company || "");
    }
  }, [user]);

  // Load pre-fill from URL query parameter
  useEffect(() => {
    if (!prefilledConfig && typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const typeParam = params.get("type");
      if (typeParam) {
        if (typeParam === "bopp-rice") {
          setMaterialType("RICE_BAG");
          setPrintingColors(8);
          setCapacityWeight("25_KG");
        } else if (typeParam === "bopp-dal") {
          setMaterialType("DAL_BAG");
          setPrintingColors(8);
          setCapacityWeight("25_KG");
        } else if (typeParam === "bopp-flour") {
          setMaterialType("FLOUR_BAG");
          setPrintingColors(8);
          setCapacityWeight("25_KG");
        } else if (typeParam === "bopp-cem") {
          setMaterialType("CEM_BAG");
          setPrintingColors(4);
          setCapacityWeight("50_KG");
        } else if (typeParam === "general-packaging") {
          setMaterialType("GENERAL_PACKAGING");
          setPrintingColors(4);
          setCapacityWeight("25_KG");
        }
      }
    }
  }, [prefilledConfig]);

  // Client-side calculator prediction removed at user request to focus purely on RFQ submission

  // Handle Form Submission
  const handleSubmitQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientEmail || !clientPhone) {
      alert("Please fill in contact name, email, and phone number.");
      return;
    }

    setLoading(true);
    try {
      const lastSavedConfigId = sessionStorage.getItem("last_saved_config_id") || prefilledConfig?.configId || null;
      const data = await apiRequest("/quotes", {
        method: "POST",
        body: JSON.stringify({
          name: clientName,
          email: clientEmail,
          phone: clientPhone,
          company: clientCompany ? `${clientCompany} | Custom Specs: ${customRequirements}` : (customRequirements ? `Custom Specs: ${customRequirements}` : ""),
          bagType: materialType,
          width,
          height,
          gusset,
          quantity,
          printingColors,
          gsm,
          liner: false,
          handles: false,
          perforations: false,
          bagConfigId: lastSavedConfigId
        })
      });

      if (data.quote) {
        setSuccessQuoteId(data.quote.id);
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 },
          colors: ["#00f2fe", "#10b981", "#ffffff"]
        });
      }
    } catch (err: any) {
      alert(err.message || "Failed to generate quote. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (successQuoteId) {
    return (
      <div className="glass-panel p-8 rounded-2xl border border-white/10 text-center max-w-2xl mx-auto my-12">
        <CheckCircle2 className="w-16 h-16 text-packaging-green-500 mx-auto mb-4" />
        <h2 className="text-white font-display text-2xl font-bold uppercase tracking-wider">Quotation Saved Successfully!</h2>
        <p className="text-sm text-gray-400 mt-2">
          Your estimate was logged as Reference <span className="text-tech-teal-300 font-semibold uppercase">{successQuoteId.slice(0, 8)}</span>. 
          A Vasavi B2B consultant will contact you via phone or email within 2 business hours.
        </p>

        <div className="my-6 p-4 rounded-xl bg-white/5 border border-white/5 text-left text-xs text-gray-300 flex flex-col gap-2">
          <div className="flex justify-between border-b border-white/5 pb-1">
            <span>Client:</span>
            <span className="text-white font-medium">{clientName} ({clientCompany || "Indie Builder"})</span>
          </div>
          <div className="flex justify-between border-b border-white/5 pb-1">
            <span>Material:</span>
            <span className="text-white font-medium">{materialType} ({CAPACITY_MAP[capacityWeight]?.label || capacityWeight} - {width}x{height}x{gusset} cm)</span>
          </div>
          <div className="flex justify-between">
            <span>Order Volume:</span>
            <span className="text-white font-medium">{quantity.toLocaleString()} bags</span>
          </div>
        </div>

        <button
          onClick={() => {
            setSuccessQuoteId(null);
            setClientName("");
            setClientEmail("");
            setClientPhone("");
            setClientCompany("");
            sessionStorage.removeItem("last_saved_config_id");
          }}
          className="inline-flex items-center justify-center rounded-lg bg-linear-to-r from-tech-teal-500 to-tech-teal-700 py-2.5 px-6 font-bold text-xs text-background hover:scale-102 transition-transform cursor-pointer"
        >
          Generate Another Quote
          <ArrowRight className="ml-1.5 w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto w-full">
      {/* Configuration Form */}
      <form onSubmit={handleSubmitQuote} className="flex flex-col gap-6 glass-panel p-6 sm:p-8 rounded-2xl border border-white/10">
        <div>
          <h2 className="text-white font-display text-lg font-bold uppercase tracking-wider flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-tech-teal-400" />
            B2B RFQ Quotation
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">Input order details to dynamically submit a quotation request.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Material Selection */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-gray-300 font-medium">Brand / Packaging Type</label>

            {/* Custom Searchable Brand Dropdown */}
            <div ref={brandRef} className="relative">
              {/* Trigger button */}
              <button
                type="button"
                onClick={() => { setBrandOpen(!brandOpen); setBrandSearch(""); }}
                className="w-full flex items-center justify-between bg-white/5 border border-white/10 hover:border-tech-teal-500/50 rounded-lg py-2 px-3 text-xs text-white focus:outline-none focus:border-tech-teal-500 cursor-pointer transition-colors"
              >
                <span className={materialType ? "text-white" : "text-gray-500"}>
                  {ALL_BRANDS.find(b => b.value === materialType)?.label || "Select a brand..."}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${brandOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Dropdown panel */}
              {brandOpen && (
                <div className="absolute z-50 left-0 right-0 top-full mt-1.5 bg-white dark:bg-[#0d0d1a] border border-gray-200 dark:border-white/10 rounded-xl shadow-lg dark:shadow-[0_8px_32px_rgba(0,0,0,0.6)] overflow-hidden">
                  {/* Search input */}
                  <div className="p-2 border-b border-gray-100 dark:border-white/10">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-gray-500" />
                      <input
                        autoFocus
                        type="text"
                        placeholder="Search brand..."
                        value={brandSearch}
                        onChange={e => setBrandSearch(e.target.value)}
                        className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg py-1.5 pl-8 pr-3 text-xs text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:border-tech-teal-500"
                      />
                    </div>
                  </div>

                  {/* Brand list */}
                  <ul className="max-h-52 overflow-y-auto py-1">
                    {ALL_BRANDS.filter(b =>
                      b.label.toLowerCase().includes(brandSearch.toLowerCase())
                    ).map(brand => (
                      <li
                        key={brand.value}
                        onClick={() => { setMaterialType(brand.value); setBrandOpen(false); setBrandSearch(""); }}
                        className={`flex items-center justify-between px-3 py-2 text-xs cursor-pointer transition-colors ${
                          materialType === brand.value
                            ? "bg-tech-teal-500/15 text-tech-teal-600 dark:text-tech-teal-300"
                            : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white"
                        }`}
                      >
                        {brand.label}
                        {materialType === brand.value && <Check className="w-3 h-3 text-tech-teal-600 dark:text-tech-teal-400 shrink-0" />}
                      </li>
                    ))}
                    {ALL_BRANDS.filter(b =>
                      b.label.toLowerCase().includes(brandSearch.toLowerCase())
                    ).length === 0 && (
                      <li className="px-3 py-4 text-xs text-gray-500 text-center">No brands found</li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Quantity */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-gray-300 font-medium">Quantity (MOQ: 5,000)</label>
            <input
              type="number"
              min="5000"
              max="5000000"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-xs text-white focus:outline-none focus:border-tech-teal-500"
            />
          </div>

          {/* Bag Capacity & Sizing */}
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label className="text-xs text-gray-300 font-semibold uppercase tracking-wider">Bag Capacity & Sizing</label>
            <div className="grid grid-cols-4 gap-2">
              {(Object.keys(CAPACITY_MAP) as Array<keyof typeof CAPACITY_MAP>).map((key) => {
                const opt = CAPACITY_MAP[key];
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setCapacityWeight(key)}
                    className={`py-2.5 px-2 border rounded-lg text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                      capacityWeight === key
                        ? "bg-tech-teal-500/10 border-tech-teal-500 text-tech-teal-300"
                        : "bg-white/5 border-white/5 text-gray-400 hover:text-white"
                    }`}
                  >
                    <span className="text-xs font-bold">{opt.label}</span>
                    <span className="text-[8px] text-gray-500 mt-0.5">{opt.width}x{opt.height} cm</span>
                  </button>
                );
              })}
            </div>
          </div>


        </div>

        {/* Custom Sizing Requirements Box */}
        <div className="flex flex-col gap-2">
          <label className="text-xs text-gray-300 font-semibold uppercase tracking-wider">Custom Specifications / Add-on Requirements</label>
          <textarea
            placeholder="Describe what you want (e.g. inner PE liner, specific carry handles, custom printing specifications, micro-perforations, aeration instructions, or custom dimensions)..."
            value={customRequirements}
            onChange={(e) => setCustomRequirements(e.target.value)}
            rows={3}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-tech-teal-500 resize-y"
          />
        </div>

        {/* Lead Capture form */}
        <div className="flex flex-col gap-3 border-t border-white/10 pt-5">
          <label className="text-xs text-white font-bold uppercase tracking-wider">B2B Contact Information</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Full Contact Name *"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                required
                className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 pl-9 text-xs text-white focus:outline-none focus:border-tech-teal-500"
              />
              <span className="absolute left-3 top-2.5 text-gray-500">
                <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>

            <div className="relative">
              <input
                type="email"
                placeholder="Business Email *"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                required
                className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 pl-9 text-xs text-white focus:outline-none focus:border-tech-teal-500"
              />
              <span className="absolute left-3 top-2.5 text-gray-500">
                <Mail className="w-3.5 h-3.5" />
              </span>
            </div>

            <div className="relative">
              <input
                type="tel"
                placeholder="Phone Number / Mobile *"
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                required
                className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 pl-9 text-xs text-white focus:outline-none focus:border-tech-teal-500"
              />
              <span className="absolute left-3 top-2.5 text-gray-500">
                <Phone className="w-3.5 h-3.5" />
              </span>
            </div>

            <div className="relative">
              <input
                type="text"
                placeholder="Company Name (Optional)"
                value={clientCompany}
                onChange={(e) => setClientCompany(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 pl-9 text-xs text-white focus:outline-none focus:border-tech-teal-500"
              />
              <span className="absolute left-3 top-2.5 text-gray-500">
                <Building className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 py-3.5 px-4 rounded-xl bg-linear-to-r from-tech-teal-500 to-tech-teal-700 text-background font-bold text-sm hover:scale-102 transition-transform shadow-[0_0_20px_rgba(0,242,254,0.3)] cursor-pointer text-center"
        >
          {loading ? "Submitting RFQ..." : "Submit Quotation Request & Get Final Pricing"}
        </button>
      </form>
    </div>
  );
};
