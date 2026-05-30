"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navbar
    home: "Home",
    products: "Products",
    "3d_studio": "3D Studio",
    get_quotation: "Get Quotation",
    b2b_portal: "B2B Portal",
    admin_console: "Admin Console",
    sign_in: "Sign In",
    client_sign_in: "Client Sign In",
    admin_sign_in: "Admin Sign In",
    logout: "Logout",
    staff_console: "Staff Console",
    or_sign_in_with: "or sign in with",
    
    // Homepage Hero
    hero_tag: "Export-Grade B2B Industrial Supply",
    hero_title: "FUTURE-READY PACKAGING SYSTEMS FOR INDUSTRIAL LEADERS",
    hero_desc: "Vasavi Polypacks manufactures high-strength BOPP laminated bags, PP woven sacks, dal & food grain bags, and block bottom valve sacks. Completely customized configurations delivered globally.",
    launch_3d_studio: "Launch 3D studio",
    
    // Homepage Factory Workflow
    mfg_facility: "Advanced Manufacturing Facility",
    production_workflow: "Cinematic Production Workflow",
    view_machinery: "View Plant Tour Machinery",
    
    step_1_title: "Granule Extrusion",
    step_1_desc: "High-grade virgin polypropylene granules are melted and extruded into high-strength micro tapes.",
    step_2_title: "PP Weaving Looms",
    step_2_desc: "Circular weaving looms weave tape spools into high-durability tubular fabric rolls.",
    step_3_title: "High-Speed Gravure Printing",
    step_3_desc: "Photorealistic up to 8-color designs reverse printed on BOPP film layers.",
    step_4_title: "Extrusion Lamination",
    step_4_desc: "Printed BOPP films are heat bonded onto the PP fabric layer using raw molten polymer.",
    step_5_title: "Seaming & Stitching",
    step_5_desc: "Cutting rolls, folding gussets, inserting PE liners, and sewing base hems.",
    step_6_title: "QA Auditing",
    step_6_desc: "Every batch passes drop tests, weld seam inspections, and weight checks.",
    
    // Homepage Quality Audit Section
    trusted_enterprises: "Trusted by 850+ Global Enterprises",
    quality_audit: "Uncompromising Quality Audit",
    quality_desc: "Vasavi Polypacks stands for quality packaging solutions. Our clean vaults and advanced manufacturing units allow us to ensure zero defects, optimal GSM weights, and tear-free lamination films.",
    quality_point_1: "100% Food-Grade high strength Virgin Polypropylene materials",
    quality_point_2: "ISO 9001:2015 & ISO 22000 quality control systems",
    quality_point_3: "Custom plate designing for brand shelf dominance",
    quality_point_4: "Advanced extrusion coating lamination units",
    
    // Homepage Callback Form
    request_callback: "Request Callback",
    callback_subtitle: "Quick query? Drop your phone and we'll ring you back.",
    enter_name: "Enter Your Name",
    contact_number: "Contact Number (e.g. +91 9490343682)",
    schedule_call: "Schedule Call",
    callback_success_title: "Callback Logged!",
    callback_success_desc: "Thank you. An industrial packaging consultant will ring you shortly.",
    submitting_request: "Submitting Request...",

    // Login Portal
    client_portal_access: "Client Portal Access",
    admin_console_signin: "Admin Console Sign In",
    staff_console_desc: "Staff console access for managing quotes, orders, and inquiries.",
    client_portal_desc: "Sign in to track orders, save designs, and review quotes.",
    staff_email: "Staff Email",
    business_email: "Business Email",
    password: "Password",
    verifying_credentials: "Verifying Credentials...",
    access_console: "Access Console",
    login_to_workspace: "Log In to Workspace",
    not_staff: "Not staff?",
    first_time_buyer: "First time B2B buyer?",
    register_corporate_account: "Register Corporate Account",
    secure_session: "Secure 256-bit Encrypted Session",

    // Signup Portal
    corporate_registration: "Corporate Registration",
    b2b_init_desc: "Initialize your B2B account for custom manufacturing runs.",
    contact_name: "Contact Name *",
    corporate_email: "Corporate Email *",
    company_name: "Company Name",
    phone_number: "Phone / WhatsApp Number",
    access_password: "Access Password *",
    registering_account: "Registering Account...",
    create_b2b_account: "Create B2B Account",
    already_have_account: "Already have an account?",
    signin_here: "Sign In here",

    // Footer
    footer_desc: "Next-generation industrial packaging solutions. Manufacturers of clean-room BOPP laminated & PP woven sacks.",
    quick_links: "Quick Links",
    contact_us: "Contact Us",
    all_rights_reserved: "All rights reserved.",
    packaging_categories: "Packaging Categories",
    digital_workspace: "Digital Workspace",
    privacy_policy: "Privacy Policy",
    terms_of_trade: "Terms of Trade",
    export_licensing: "Export Licensing",
    chat_on_whatsapp: "Chat on WhatsApp",
    iso_certified: "ISO 9001:2015 & ISO 22000 Certified",
    address_text: "Near HP Petrol Bunk, Janapadu, 522413, Piduguralla, Palnadu District, Andhra Pradesh",
    bopp_bags: "BOPP Laminated Bags",
    pp_sacks: "PP Woven Sacks",
    food_bags: "Rice & Food Grain Bags",
    cement_bags: "Cement & Fertilizer Bags",
    valve_bags: "Block Bottom Valve Bags",
    printed_sacks: "Custom Printed Sacks"
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    const savedLang = localStorage.getItem("vp_lang") as Language;
    if (savedLang === "en") {
      setLanguageState(savedLang);
    } else {
      setLanguageState("en");
      localStorage.setItem("vp_lang", "en");
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("vp_lang", lang);
  };

  const t = (key: string): string => {
    const translationsForLang = translations[language];
    if (translationsForLang && translationsForLang[key]) {
      return translationsForLang[key];
    }
    // Fallback to English dictionary
    const fallbackTranslations = translations["en"];
    if (fallbackTranslations && fallbackTranslations[key]) {
      return fallbackTranslations[key];
    }
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
