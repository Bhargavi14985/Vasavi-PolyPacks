"use client";

import React from "react";
import Link from "next/link";
import { MessageSquare, Mail, Phone, MapPin, Award, ShieldAlert, Globe } from "lucide-react";

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const handleWhatsAppChat = () => {
    // Open whatsapp link
    window.open("https://wa.me/919490343682?text=Hello%20Vasavi%20Polypacks%20team,%20I'd%20like%20to%20inquire%20about%20packaging%20bags.", "_blank");
  };

  return (
    <footer className="w-full bg-obsidian-950 border-t border-white/10 text-gray-400 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Info */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col">
              <span className="font-display font-bold text-xl tracking-wider text-white">
                VASAVI POLYPACKS
              </span>
              <span className="text-xs uppercase tracking-widest text-tech-teal-300 font-semibold mt-1">
                Industrial Packaging Systems
              </span>
            </div>
            <p className="text-xs leading-relaxed text-gray-400">
              Leading manufacturer and global exporter of high-grade BOPP laminated bags, PP woven sacks, block bottom valve bags, and custom printed industrial packaging.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-white/90">
              <Award className="w-4 h-4 text-yellow-500" />
              <span>ISO 9001:2015 & ISO 22000 Certified</span>
            </div>
          </div>

          {/* Product Lines */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Packaging Categories
            </h3>
            <ul className="flex flex-col gap-2 text-xs">
              <li>
                <Link href="/products" className="hover:text-tech-teal-300 transition-colors">BOPP Laminated Bags</Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-tech-teal-300 transition-colors">PP Woven Sacks</Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-tech-teal-300 transition-colors">Rice & Food Grain Bags</Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-tech-teal-300 transition-colors">Cement & Fertilizer Bags</Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-tech-teal-300 transition-colors">Block Bottom Valve Bags</Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-tech-teal-300 transition-colors">Custom Printed Sacks</Link>
              </li>
            </ul>
          </div>

          {/* Interactive Tools */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Digital Workspace
            </h3>
            <ul className="flex flex-col gap-2 text-xs">
              <li>
                <Link href="/studio" className="hover:text-tech-teal-300 transition-colors font-medium text-tech-teal-300">
                  Interactive 3D Studio
                </Link>
              </li>
              <li>
                <Link href="/calculator" className="hover:text-tech-teal-300 transition-colors font-medium text-packaging-green-500">
                  Get Quotation
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-tech-teal-300 transition-colors">B2B Customer Login</Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-tech-teal-300 transition-colors text-yellow-500">Staff Console</Link>
              </li>
            </ul>
          </div>

          {/* Export & Contact Desk */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
              Contact & Support
            </h3>
            <div className="flex flex-col gap-2 text-xs">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-tech-teal-400 shrink-0 mt-0.5" />
                <span>Near HP Petrol Bunk, Janapadu, 522413,<br />Piduguralla, Palnadu District,<br />Andhra Pradesh</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-tech-teal-400 shrink-0" />
                <span>+91 94903 43682</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-tech-teal-400 shrink-0" />
                <span>durgaraomunaganuri@gmail.com</span>
              </div>
            </div>

            <button
              onClick={handleWhatsAppChat}
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2 px-4 text-xs transition-colors cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              Chat on WhatsApp
            </button>
          </div>
        </div>

        <hr className="border-white/10 my-8" />

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>© {currentYear} Vasavi Polypacks Private Limited. All Rights Reserved.</p>
          <div className="flex gap-4">
            <Link href="/" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/" className="hover:text-white transition-colors">Terms of Trade</Link>
            <Link href="/" className="hover:text-white transition-colors">Export Licensing</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
