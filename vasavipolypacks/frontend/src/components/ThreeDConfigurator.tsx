"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Upload, Download, RotateCw, ZoomIn, Info, Check, Sparkles, RefreshCw } from "lucide-react";
import { getApiBaseUrl } from "@/utils/api";

export const CAPACITY_MAP: Record<string, { width: number; height: number; gusset: number; label: string }> = {
  "5_KG": { width: 30, height: 45, gusset: 4, label: "5 Kg" },
  "10_KG": { width: 35, height: 58, gusset: 6, label: "10 Kg" },
  "25_KG": { width: 48, height: 75, gusset: 8, label: "25 Kg" },
  "30_KG": { width: 50, height: 80, gusset: 9, label: "30 Kg" },
  "50_KG": { width: 60, height: 90, gusset: 12, label: "50 Kg" }
};

interface ThreeDConfiguratorProps {
  onQuoteTrigger?: (configData: any) => void;
  initialConfigId?: string | null;
}

export const ThreeDConfigurator: React.FC<ThreeDConfiguratorProps> = ({ onQuoteTrigger, initialConfigId }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Customization States
  const [bagType, setBagType] = useState<string>("RICE_BAG");
  const [bagColor, setBagColor] = useState<string>("#ffffff");
  const [capacityWeight, setCapacityWeight] = useState<string>("25_KG");
  const [width, setWidth] = useState<number>(48); // cm
  const [height, setHeight] = useState<number>(75); // cm
  const [gusset, setGusset] = useState<number>(8); // cm
  const [printingStyle, setPrintingStyle] = useState<string>("GRAVURE");
  const [features, setFeatures] = useState<string[]>([]);
  const [logoImage, setLogoImage] = useState<string | null>(null);

  // Photo Alignment States
  const [photoScale, setPhotoScale] = useState<number>(1.0);
  const [photoOffsetX, setPhotoOffsetX] = useState<number>(0);
  const [photoOffsetY, setPhotoOffsetY] = useState<number>(0);
  const [photoRotation, setPhotoRotation] = useState<number>(0);

  // Three.js References
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const meshRef = useRef<THREE.Mesh | null>(null);
  const textureCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const textureRef = useRef<THREE.CanvasTexture | null>(null);

  // UI States
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Upload Logo
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setLogoImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const drawTextureCanvas = () => {
    const canvas = textureCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (logoImage) {
      const img = new Image();
      img.src = logoImage;
      img.onload = () => {
        // Clear background with solid white
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Save context state for translation/rotation/scaling
        ctx.save();

        // Translate origin to canvas center + offsets
        const centerX = canvas.width / 2 + photoOffsetX;
        const centerY = canvas.height / 2 + photoOffsetY;
        ctx.translate(centerX, centerY);

        // Rotate (degrees to radians)
        const rotationRadians = (photoRotation * Math.PI) / 180;
        ctx.rotate(rotationRadians);

        // Scale
        ctx.scale(photoScale, photoScale);

        // Draw image centered at the translated coordinate origin
        ctx.drawImage(
          img,
          -canvas.width / 2,
          -canvas.height / 2,
          canvas.width,
          canvas.height
        );

        // Restore context
        ctx.restore();

        // Overlay woven PP weave stripes (subtle light grid lines in light mode)
        ctx.strokeStyle = "rgba(0, 0, 0, 0.04)";
        ctx.lineWidth = 1;
        for (let i = 0; i < canvas.height; i += 6) {
          ctx.beginPath();
          ctx.moveTo(0, i);
          ctx.lineTo(canvas.width, i);
          ctx.stroke();
        }
        for (let i = 0; i < canvas.width; i += 6) {
          ctx.beginPath();
          ctx.moveTo(i, 0);
          ctx.lineTo(i, canvas.height);
          ctx.stroke();
        }

        if (textureRef.current) textureRef.current.needsUpdate = true;
      };
    } else {
      // Light slate fallback representing empty canvas
      ctx.fillStyle = "#f8fafc";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Border highlights
      ctx.strokeStyle = "rgba(15, 23, 42, 0.08)";
      ctx.lineWidth = 4;
      ctx.strokeRect(8, 8, canvas.width - 16, canvas.height - 16);

      // Draw custom placeholders
      ctx.fillStyle = "#475569";
      ctx.textAlign = "center";
      ctx.font = "bold 20px 'Space Grotesk', sans-serif";
      ctx.fillText("AWAITING ARTWORK UPLOAD", canvas.width / 2, canvas.height / 2 - 30);
      
      ctx.fillStyle = "#64748b";
      ctx.font = "14px sans-serif";
      ctx.fillText("Upload your full photo or bag layout design", canvas.width / 2, canvas.height / 2);
      ctx.fillText("to preview it in 3D real-time.", canvas.width / 2, canvas.height / 2 + 20);

      // Overlay woven PP weave stripes
      ctx.strokeStyle = "rgba(0, 0, 0, 0.03)";
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.height; i += 6) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
      }
      for (let i = 0; i < canvas.width; i += 6) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }
    }
  };

  useEffect(() => {
    drawTextureCanvas();
    if (textureRef.current) {
      textureRef.current.needsUpdate = true;
    }
  }, [bagColor, logoImage, bagType, features, photoScale, photoOffsetX, photoOffsetY, photoRotation]);

  // Three.js Mount Setup
  useEffect(() => {
    if (!mountRef.current || !canvasRef.current) return;

    const widthPx = mountRef.current.clientWidth;
    const heightPx = mountRef.current.clientHeight || 500;

    // Create Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(45, widthPx / heightPx, 0.1, 100);
    camera.position.set(0, 0.5, 3.5);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true // Required for downloading screenshots
    });
    renderer.setSize(widthPx, heightPx);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    rendererRef.current = renderer;

    // Ambient Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    // Directional Lighting (Studio effect)
    const dirLight1 = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight1.position.set(2, 4, 3);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x00f2fe, 0.4); // Subtle cyan highlights
    dirLight2.position.set(-2, 2, -3);
    scene.add(dirLight2);

    // Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 + 0.1; // Don't let orbit below floor
    controls.minDistance = 2;
    controls.maxDistance = 6;

    // Floor Grid / Mirror Shadow
    const gridHelper = new THREE.GridHelper(10, 20, 0x1e293b, 0x0f172a);
    gridHelper.position.y = -1.1;
    scene.add(gridHelper);

    // Setup Bag Custom Texture
    const textureCanvas = document.createElement("canvas");
    textureCanvas.width = 512;
    textureCanvas.height = 512;
    textureCanvasRef.current = textureCanvas;
    
    const texture = new THREE.CanvasTexture(textureCanvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    textureRef.current = texture;

    // Draw initial Canvas content
    drawTextureCanvas();

    // Bag Geometry creation representing woven polypropylene structure
    const bagW = 1.0;
    const bagH = 1.6;
    const bagD = 0.2;

    const geometry = new THREE.BoxGeometry(bagW, bagH, bagD, 10, 10, 1);
    
    // Deform box slightly to look like a packed soft industrial bag
    const position = geometry.attributes.position;
    for (let i = 0; i < position.count; i++) {
      const x = position.getX(i);
      const y = position.getY(i);
      const z = position.getZ(i);

      // Pillow deformation: bulging in the middle, pinch at top/bottom seams
      const bulge = Math.cos((y / bagH) * Math.PI) * Math.cos((x / bagW) * Math.PI);
      const pinchZ = z > 0 ? z + bulge * 0.15 : z - bulge * 0.15;
      position.setZ(i, pinchZ);
    }
    geometry.computeVertexNormals();

    // Standard materials
    const materials = [
      new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.6 }), // Side Left
      new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.6 }), // Side Right
      new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.6 }), // Top seam
      new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.6 }), // Bottom seam
      new THREE.MeshStandardMaterial({ map: texture, roughness: 0.35, metalness: 0.1 }), // Front (Showcase)
      new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.6 }) // Back
    ];

    const bagMesh = new THREE.Mesh(geometry, materials);
    bagMesh.position.y = -0.1;
    scene.add(bagMesh);
    meshRef.current = bagMesh;

    // Resize Handler
    const handleResize = () => {
      if (!mountRef.current || !camera || !renderer) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight || 500;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    // Animation Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      
      

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      controls.dispose();
      geometry.dispose();
      materials.forEach(m => m.dispose());
      texture.dispose();
      renderer.dispose();
    };
  }, []);

  // Update Mesh Dimensions
  useEffect(() => {
    if (!meshRef.current) return;
    
    // Scale bag mesh slightly based on cm height/width ratios
    const baseW = 50;
    const baseH = 80;
    const baseD = 10;
    
    const scaleX = width / baseW;
    const scaleY = height / baseH;
    const scaleZ = gusset > 0 ? (gusset / baseD) : 0.5;

    meshRef.current.scale.set(scaleX, scaleY, scaleZ);
  }, [width, height, gusset]);

  // Update Mesh Geometry based on Bag Type (Morphing Shape)
  useEffect(() => {
    if (!meshRef.current) return;

    const bagW = 1.0;
    const bagH = 1.6;
    let bagD = 0.25;

    let newGeometry: THREE.BufferGeometry;

    if (bagType === "BOX_BOTTOM" || bagType === "CEM_BAG") {
      // Box Bottom: sharp flat box structure
      newGeometry = new THREE.BoxGeometry(bagW, bagH, bagD * 1.5, 4, 4, 4);
    } else if (bagType === "GUSSETED_SACK" || bagType === "FLOUR_BAG") {
      // Gusseted: side edges folder inwards along X axis
      newGeometry = new THREE.BoxGeometry(bagW, bagH, bagD, 12, 12, 1);
      const position = newGeometry.attributes.position;
      for (let i = 0; i < position.count; i++) {
        const x = position.getX(i);
        const y = position.getY(i);
        const z = position.getZ(i);

        const bulge = Math.cos((y / bagH) * Math.PI) * Math.cos((x / bagW) * Math.PI);
        let pinchZ = z > 0 ? z + bulge * 0.12 : z - bulge * 0.12;
        
        // Pinch sides inward
        if (Math.abs(x) > bagW * 0.35) {
          pinchZ *= 0.5; // flatter at sides
        }
        position.setZ(i, pinchZ);
      }
    } else {
      // Standard PP Woven / BOPP Laminated: Pillow Bulge structure
      newGeometry = new THREE.BoxGeometry(bagW, bagH, bagD, 10, 10, 1);
      const position = newGeometry.attributes.position;
      for (let i = 0; i < position.count; i++) {
        const x = position.getX(i);
        const y = position.getY(i);
        const z = position.getZ(i);

        const bulge = Math.cos((y / bagH) * Math.PI) * Math.cos((x / bagW) * Math.PI);
        const pinchZ = z > 0 ? z + bulge * 0.16 : z - bulge * 0.16;
        position.setZ(i, pinchZ);
      }
    }

    newGeometry.computeVertexNormals();

    const oldGeom = meshRef.current.geometry;
    meshRef.current.geometry = newGeometry;
    oldGeom.dispose();
  }, [bagType]);

  // Load Saved Design from backend if InitialConfigId is passed
  // Sync dimensions with capacityWeight selection
  useEffect(() => {
    const map = CAPACITY_MAP[capacityWeight];
    if (map) {
      setWidth(map.width);
      setHeight(map.height);
      setGusset(map.gusset);
    }
  }, [capacityWeight]);

  useEffect(() => {
    const loadConfig = async (id: string) => {
      try {
        const apiBaseUrl = getApiBaseUrl();
        const response = await fetch(`${apiBaseUrl}/configs/${id}`);
        const data = await response.json();
        if (response.ok && data.config) {
          const c = data.config;
          setBagType(c.bagType);
          setBagColor(c.color);
          setWidth(c.width);
          setHeight(c.height);
          setGusset(c.gusset);
          setPrintingStyle(c.printingStyle);
          // Infer capacity weight from loaded dimensions
          if (c.width <= 32 && c.height <= 50) {
            setCapacityWeight("5_KG");
          } else if (c.width <= 38 && c.height <= 65) {
            setCapacityWeight("10_KG");
          } else if (c.width <= 49 && c.height <= 76) {
            setCapacityWeight("25_KG");
          } else if (c.width <= 52 && c.height <= 82) {
            setCapacityWeight("30_KG");
          } else {
            setCapacityWeight("50_KG");
          }
          try {
            setFeatures(JSON.parse(c.features));
          } catch (_) {
            setFeatures([]);
          }
          if (c.logoUrl) setLogoImage(c.logoUrl);
        }
      } catch (err) {
        console.error("Failed to load saved config:", err);
      }
    };

    if (initialConfigId) {
      loadConfig(initialConfigId);
    } else if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const configParam = params.get("config");
      const typeParam = params.get("type");
      const brandParam = params.get("brand");
      
      if (configParam) {
        loadConfig(configParam);
      } else {
        if (typeParam) {
          if (typeParam === "bopp-rice") {
            setBagType("RICE_BAG");
            setPrintingStyle("GRAVURE");
            setCapacityWeight("25_KG");
          } else if (typeParam === "bopp-dal") {
            setBagType("DAL_BAG");
            setPrintingStyle("GRAVURE");
            setCapacityWeight("25_KG");
          } else if (typeParam === "bopp-flour") {
            setBagType("FLOUR_BAG");
            setPrintingStyle("GRAVURE");
            setCapacityWeight("25_KG");
          } else if (typeParam === "bopp-cem") {
            setBagType("CEM_BAG");
            setPrintingStyle("FLEXO");
            setCapacityWeight("50_KG");
          } else if (typeParam === "general-packaging") {
            setBagType("GENERAL_PACKAGING");
            setPrintingStyle("FLEXO");
            setCapacityWeight("25_KG");
          }
        }

        if (brandParam) {
          if (typeParam === "bopp-rice") {
            setLogoImage("/images/rice_bag_layout.png");
          } else {
            setLogoImage("/images/dal_bag_layout.png");
          }
        }
      }
    }
  }, [initialConfigId]);

  // Download Mockup Screenshot
  const downloadMockup = () => {
    const renderer = rendererRef.current;
    if (!renderer) return;

    // Stop rotation to take clean shot

    setTimeout(() => {
      const dataUrl = renderer.domElement.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `Vasavi_Polypacks_Mockup_${bagType}.png`;
      link.href = dataUrl;
      link.click();
    }, 100);
  };

  // Save Design to Backend API
  const saveDesign = async () => {
    setSaving(true);
    setSavedSuccess(false);
    try {
      const token = localStorage.getItem("vp_token");
      const apiBaseUrl = getApiBaseUrl();
      const response = await fetch(`${apiBaseUrl}/configs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          bagType,
          color: bagColor,
          logoUrl: logoImage,
          logoScale: 1.0,
          textFront: "",
          textBack: "",
          width,
          height,
          gusset,
          features,
          printingStyle
        })
      });

      const data = await response.json();
      if (response.ok && data.config) {
        setSavedSuccess(true);
        // Save config ID locally in session so we can attach to Quote
        sessionStorage.setItem("last_saved_config_id", data.config.id);
        setTimeout(() => setSavedSuccess(false), 4000);
      }
    } catch (err) {
      console.error("Failed to save packaging configuration:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleProceedToQuote = () => {
    const configData = {
      bagType,
      color: bagColor,
      textFront: "",
      textBack: "",
      width,
      height,
      gusset,
      features,
      printingStyle,
      configId: sessionStorage.getItem("last_saved_config_id") || null
    };
    if (onQuoteTrigger) {
      onQuoteTrigger(configData);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
      {/* 3D Visualizer Canvas (Left side) */}
      <div className="lg:col-span-7 flex flex-col relative rounded-2xl overflow-hidden glass-panel border border-white/10 min-h-[500px]">
        {/* Floating overlays */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-1 pointer-events-none">
          <h2 className="text-white font-display text-base font-bold uppercase tracking-wider flex items-center gap-1.5 leading-none">
            <Sparkles className="w-4 h-4 text-tech-teal-300" />
            3D Studio Configurators
          </h2>
          <p className="text-[10px] text-gray-400">Interactive 360° Industrial-Tech Mockup</p>
        </div>

        {/* View Controls */}
        <div className="absolute bottom-4 right-4 z-10 flex gap-2">
          <button
            onClick={downloadMockup}
            className="p-2 rounded-lg bg-white/5 border border-white/10 text-xs font-semibold text-gray-400 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Save PNG
          </button>
        </div>

        {/* Mounting element for ThreeJS WebGL Canvas */}
        <div ref={mountRef} className="w-full flex-grow relative bg-linear-to-b from-[#0c0c14] to-[#040408]">
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block cursor-grab active:cursor-grabbing" />
        </div>
      </div>

      {/* Editor Panels (Right side) */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        {/* Panel Container */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col gap-5">
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Bag Specifications</h3>
            <p className="text-xs text-gray-400 mt-0.5">Customize dimensions, layout alignment, and save your setup.</p>
          </div>

          {/* Bag Capacity & Sizing Selector */}
          <div className="flex flex-col gap-2">
            <label className="text-xs text-gray-300 font-semibold uppercase tracking-wider">Bag Capacity & Sizing</label>
            <div className="grid grid-cols-4 gap-2">
              {(Object.keys(CAPACITY_MAP) as Array<keyof typeof CAPACITY_MAP>).map((key) => {
                const opt = CAPACITY_MAP[key];
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setCapacityWeight(key)}
                    className={`py-2 px-1 border rounded-lg text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
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

          {/* Artwork Upload & Alignment Slider Controls */}
          <div className="flex flex-col gap-4 border-t border-white/10 pt-4">
            <div>
              <label className="text-xs text-gray-300 font-semibold uppercase tracking-wider block mb-1">Artwork Upload & Alignment</label>
              <p className="text-[11px] text-gray-400">Upload a print design layout to align it on the 3D bag.</p>
            </div>

            {/* Custom Photo Upload */}
            <div className="flex items-center gap-3">
              <label className="flex items-center justify-center gap-2 border border-dashed border-white/20 hover:border-tech-teal-400 py-2.5 px-4 rounded-lg bg-white/5 text-xs text-gray-400 hover:text-white cursor-pointer transition-all flex-grow text-center">
                <Upload className="w-4 h-4 text-tech-teal-400" />
                Upload Full Layout / Photo
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
              </label>
              {logoImage && (
                <button
                  onClick={() => {
                    setLogoImage(null);
                    setPhotoScale(1.0);
                    setPhotoOffsetX(0);
                    setPhotoOffsetY(0);
                    setPhotoRotation(0);
                  }}
                  className="text-[10px] font-semibold text-red-400 border border-red-400/20 py-2.5 px-3 rounded-lg bg-red-400/5 hover:bg-red-400/10 transition-colors cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>

            {logoImage && (
              <div className="flex flex-col gap-3 bg-white/5 p-4 rounded-xl border border-white/10">
                {/* Scale/Zoom Slider */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[11px] text-gray-300 font-medium">Zoom / Scale</span>
                    <span className="text-[11px] text-tech-teal-400 font-mono font-bold">{photoScale.toFixed(1)}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.2"
                    max="4.0"
                    step="0.1"
                    value={photoScale}
                    onChange={(e) => setPhotoScale(Number(e.target.value))}
                    className="w-full accent-tech-teal-500 cursor-pointer"
                  />
                </div>

                {/* X-Offset Slider */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[11px] text-gray-300 font-medium">Horizontal Position (X)</span>
                    <span className="text-[11px] text-tech-teal-400 font-mono font-bold">{photoOffsetX}px</span>
                  </div>
                  <input
                    type="range"
                    min="-512"
                    max="512"
                    step="5"
                    value={photoOffsetX}
                    onChange={(e) => setPhotoOffsetX(Number(e.target.value))}
                    className="w-full accent-tech-teal-500 cursor-pointer"
                  />
                </div>

                {/* Y-Offset Slider */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[11px] text-gray-300 font-medium">Vertical Position (Y)</span>
                    <span className="text-[11px] text-tech-teal-400 font-mono font-bold">{photoOffsetY}px</span>
                  </div>
                  <input
                    type="range"
                    min="-512"
                    max="512"
                    step="5"
                    value={photoOffsetY}
                    onChange={(e) => setPhotoOffsetY(Number(e.target.value))}
                    className="w-full accent-tech-teal-500 cursor-pointer"
                  />
                </div>

                {/* Rotation Slider */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[11px] text-gray-300 font-medium">Rotation</span>
                    <span className="text-[11px] text-tech-teal-400 font-mono font-bold">{photoRotation}°</span>
                  </div>
                  <input
                    type="range"
                    min="-180"
                    max="180"
                    step="5"
                    value={photoRotation}
                    onChange={(e) => setPhotoRotation(Number(e.target.value))}
                    className="w-full accent-tech-teal-500 cursor-pointer"
                  />
                </div>

                {/* Reset button */}
                <button
                  onClick={() => {
                    setPhotoScale(1.0);
                    setPhotoOffsetX(0);
                    setPhotoOffsetY(0);
                    setPhotoRotation(0);
                  }}
                  className="mt-1 py-1.5 px-3 bg-white/5 border border-white/10 hover:bg-white/10 text-[10px] font-semibold text-gray-300 hover:text-white rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RotateCw className="w-3 h-3" />
                  Reset Photo Adjustments
                </button>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-2">
            <button
              onClick={saveDesign}
              disabled={saving}
              className={`flex-grow py-3 px-4 rounded-lg font-bold text-xs flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                savedSuccess
                  ? "bg-emerald-600 border-emerald-500 text-white"
                  : "bg-white/5 border-white/10 hover:bg-white/10 text-white"
              }`}
            >
              {saving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-tech-teal-400" />
                  Saving Design...
                </>
              ) : savedSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  Design Saved!
                </>
              ) : (
                "Save Design to Account"
              )}
            </button>
            <button
              onClick={handleProceedToQuote}
              className="flex-grow py-3 px-4 rounded-lg bg-linear-to-r from-tech-teal-500 to-tech-teal-700 text-background font-bold text-xs hover:scale-102 transition-transform shadow-[0_0_15px_rgba(0,242,254,0.2)] cursor-pointer text-center"
            >
              Get Quotation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
