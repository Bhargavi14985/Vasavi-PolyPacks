"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "en" | "te";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  te: {
    // Navbar
    home: "హోమ్",
    products: "ఉత్పత్తులు",
    "3d_studio": "3D స్టూడియో",
    get_quotation: "ధర అంచనా పొందండి",
    b2b_portal: "B2B పోర్టల్",
    admin_console: "అడ్మిన్ కన్సోల్",
    sign_in: "సైన్ ఇన్",
    client_sign_in: "క్లయింట్ సైన్ ఇన్",
    admin_sign_in: "అడ్మిన్ సైన్ ఇన్",
    logout: "లాగ్ అవుట్",
    staff_console: "స్టాఫ్ కన్సోల్",
    or_sign_in_with: "లేదా దీనితో సైన్ ఇన్ అవ్వండి",
    
    // Homepage Hero
    hero_tag: "ఎగుమతి-స్థాయి B2B పారిశ్రామిక సరఫరా",
    hero_title: "పారిశ్రామిక నాయకుల కోసం ఫ్యూచర్-రెడీ ప్యాకేజింగ్ సిస్టమ్స్",
    hero_desc: "వాసవి పాలిప్యాక్స్ అధిక-బలం కలిగిన BOPP లామినేటెడ్ సంచులు, PP నేసిన సంచులు, పప్పులు & ఆహార ధాన్యాల సంచులు మరియు బ్లాక్ బాటమ్ వాల్వ్ సంచులను తయారు చేస్తుంది. ప్రపంచవ్యాప్తంగా పంపిణీ చేయబడే పూర్తిగా అనుకూలీకరించిన కాన్ఫిగరేషన్లు.",
    launch_3d_studio: "3D స్టూడియో ప్రారంభించండి",
    
    // Homepage Factory Workflow
    mfg_facility: "అధునాతన ఉత్పాదక సదుపాయం",
    production_workflow: "సినిమాటిక్ ప్రొడక్షన్ వర్క్‌ఫ్లో",
    view_machinery: "ప్లాంట్ టూర్ యంత్రాలను వీక్షించండి",
    
    step_1_title: "గ్రాన్యూల్ ఎక్స్‌ట్రూషన్",
    step_1_desc: "అధిక-గ్రేడ్ వర్జిన్ పాలీప్రొఫైలిన్ గ్రాన్యూల్స్ కరిగించబడి అధిక-బలం కలిగిన మైక్రో టేపులుగా మార్చబడతాయి.",
    step_2_title: "PP వీవింగ్ లూమ్స్",
    step_2_desc: "వృత్తాకార వీవింగ్ లూమ్స్ టేప్ స్పూల్‌లను అధిక-మన్నికైన గొట్టపు ఫాబ్రిక్ రోల్స్‌గా నేస్తాయి.",
    step_3_title: "అధిక-వేగ గ్రావర్ ప్రింటింగ్",
    step_3_desc: "BOPP ఫిల్మ్ లేయర్‌లపై రివర్స్ ప్రింట్ చేయబడిన ఫోటోరియలిస్టిక్ 8-రంగుల డిజైన్లు.",
    step_4_title: "ఎక్స్‌ట్రూషన్ లామినేషన్",
    step_4_desc: "ముద్రించిన BOPP ఫిల్మ్‌లు కరిగించిన పాలిమర్ ఉపయోగించి PP ఫాబ్రిక్ పొరపై వేడి బంధించబడతాయి.",
    step_5_title: "సీమింగ్ & స్టిచింగ్",
    step_5_desc: "రోల్స్ కటింగ్, గుస్సెట్స్ మడతపెట్టడం, PE లైనర్లను చొప్పించడం మరియు బేస్ హెమ్స్ కుట్టడం.",
    step_6_title: "QA ఆడిటింగ్",
    step_6_desc: "ప్రతి బ్యాచ్ డ్రాప్ టెస్టులు, వెల్డ్ సీమ్ తనిఖీలు మరియు బరువు తనిఖీలను దాటుతుంది.",
    
    // Homepage Quality Audit Section
    trusted_enterprises: "850+ గ్లోబల్ ఎంటర్‌ప్రైజెస్‌ల నమ్మకం",
    quality_audit: "రాజీపడని నాణ్యత ఆడిట్",
    quality_desc: "వాసవి పాలిప్యాక్స్ నాణ్యమైన ప్యాకేజింగ్ పరిష్కారాలకు నిలుస్తుంది. మా క్లీన్ వాల్ట్‌లు మరియు అధునాతన ఉత్పాదక యూనిట్లు సున్నా లోపాలు, సరైన GSM బరువులు మరియు కన్నీటి రహిత లామినేషన్ ఫిల్మ్‌లను నిర్ధారించడానికి మమ్మల్ని అనుమతిస్తాయి.",
    quality_point_1: "100% ఫుడ్-గ్రేడ్ అధిక బలం కలిగిన వర్జిన్ పాలీప్రొఫైలిన్ పదార్థాలు",
    quality_point_2: "ISO 9001:2015 & ISO 22000 నాణ్యత నియంత్రణ వ్యవస్థలు",
    quality_point_3: "బ్రాండ్ షెల్ఫ్ ఆధిపత్యం కోసం అనుకూల ప్లేట్ రూపకల్పన",
    quality_point_4: "అధునాతన ఎక్స్‌ట్రూషన్ కోటింగ్ లామినేషన్ యూనిట్లు",
    
    // Homepage Callback Form
    request_callback: "కాల్‌బ్యాక్ అభ్యర్థించండి",
    callback_subtitle: "శీఘ్ర ప్రశ్న ఉందా? మీ ఫోన్ నంబర్ ఇవ్వండి, మేము మీకు కాల్ చేస్తాము.",
    enter_name: "మీ పేరు నమోదు చేయండి",
    contact_number: "సంప్రదింపు సంఖ్య (ఉదా. +91 9490343682)",
    schedule_call: "కాల్ షెడ్యూల్ చేయండి",
    callback_success_title: "కాల్‌బ్యాక్ నమోదైంది!",
    callback_success_desc: "ధన్యవాదాలు. పారిశ్రామిక ప్యాకేజింగ్ సలహాదారు త్వరలో మీకు కాల్ చేస్తారు.",
    submitting_request: "సమర్పిస్తోంది...",

    // Login Portal
    client_portal_access: "క్లయింట్ పోర్టల్ యాక్సెస్",
    admin_console_signin: "అడ్మిన్ కన్సోల్ సైన్ ఇన్",
    staff_console_desc: "ఆర్డర్‌లు మరియు విచారణలను నిర్వహించడానికి సిబ్బంది కన్సోల్ యాక్సెస్.",
    client_portal_desc: "ఆర్డర్‌లను ట్రాక్ చేయడానికి, డిజైన్‌లను సేవ్ చేయడానికి లాగిన్ అవ్వండి.",
    staff_email: "సిబ్బంది ఈమెయిల్",
    business_email: "వ్యాపార ఈమెయిల్",
    password: "పాస్‌వర్డ్",
    verifying_credentials: "ధృవీకరిస్తోంది...",
    access_console: "కన్సోల్ ప్రవేశించు",
    login_to_workspace: "వర్క్‌స్పేస్‌లోకి లాగిన్ అవ్వండి",
    not_staff: "సిబ్బంది కాదా?",
    first_time_buyer: "మొదటి సారి B2B కొనుగోలుదారా?",
    register_corporate_account: "కార్పొరేట్ ఖాతాను నమోదు చేయండి",
    secure_session: "సురక్షితమైన 256-బిట్ ఎన్‌క్రిప్టెడ్ సెషన్",

    // Signup Portal
    corporate_registration: "కార్పొరేట్ రిజిస్ట్రేషన్",
    b2b_init_desc: "అనుకూల ఉత్పాదక పరుగుల కోసం మీ B2B ఖాతాను ప్రారంభించండి.",
    contact_name: "సంప్రదింపు పేరు *",
    corporate_email: "కార్పొరేట్ ఈమెయిల్ *",
    company_name: "కంపెనీ పేరు",
    phone_number: "ఫోన్ / వాట్సాప్ నంబర్",
    access_password: "యాక్సెస్ పాస్‌వర్డ్ *",
    registering_account: "నమోదు చేస్తోంది...",
    create_b2b_account: "B2B ఖాతాను సృష్టించండి",
    already_have_account: "ఇప్పటికే ఖాతా ఉందా?",
    signin_here: "ఇక్కడ సైన్ ఇన్ అవ్వండి",

    // Footer
    footer_desc: "తదుపరి తరం పారిశ్రామిక ప్యాకేజింగ్ సొల్యూషన్స్. క్లీన్-రూమ్ BOPP లామినేటెడ్ మరియు PP నేసిన ప్యాకేజింగ్ సంచుల తయారీదారులు.",
    quick_links: "శీఘ్ర లింకులు",
    contact_us: "మమ్మల్ని సంప్రదించండి",
    all_rights_reserved: "అన్ని హక్కులు ప్రత్యేకించబడినవి.",
    packaging_categories: "ప్యాకేజింగ్ విభాగాలు",
    digital_workspace: "డిజిటల్ వర్క్‌స్పేస్",
    privacy_policy: "గోప్యతా విధానం",
    terms_of_trade: "వర్తక నిబంధనలు",
    export_licensing: "ఎగుమతి లైసెన్సింగ్",
    chat_on_whatsapp: "వాట్సాప్‌లో చాట్ చేయండి",
    iso_certified: "ISO 9001:2015 & ISO 22000 ధృవీకరించబడింది",
    address_text: "హెచ్‌పి పెట్రోల్ బంక్ దగ్గర, జానపాడు, 522413, పిడుగురాళ్ల, పల్నాడు జిల్లా, ఆంధ్రప్రదేశ్",
    bopp_bags: "BOPP లామినేటెడ్ సంచులు",
    pp_sacks: "PP నేసిన సంచులు",
    food_bags: "బియ్యం & ఆహార ధాన్యాల సంచులు",
    cement_bags: "సిమెంట్ & ఎరువుల సంచులు",
    valve_bags: "బ్లాక్ బాటమ్ వాల్వ్ సంచులు",
    printed_sacks: "కస్టమ్ ప్రింటెడ్ సంచులు"
  },
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
    if (savedLang === "en" || savedLang === "te") {
      setLanguageState(savedLang);
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
