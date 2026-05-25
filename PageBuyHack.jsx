// PageBuyHack.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ref, get, push, set, onValue, serverTimestamp } from 'firebase/database';
import { db } from './firebase.jsx'; // Flat structure database instance connectivity
import { uploadPaymentScreenshot } from './supabase.js'; // Advanced Supabase asset streaming engine
import { useAuth } from './AuthContext.jsx'; // Core security clearance guard channel
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Copy, UploadCloud, ShieldCheck, QrCode, ArrowLeft, 
  Image as ImageIcon, ChevronLeft, ChevronRight, Star, 
  Percent, Zap, X, AlertTriangle, IndianRupee 
} from 'lucide-react';

const PageBuyHack = () => {
  const { hackId } = useParams(); // URL routing parameters parsing
  const navigate = useNavigate();
  const { currentUser } = useAuth(); // Secure user session log trace
  
  // 🛰️ Full-Stack Global Controlled States
  const [hack, setHack] = useState(null);
  const [globalSettings, setGlobalSettings] = useState({
    upiId: 'ajaybhai@ybl', // Dynamic system database fallback default values
    upiQrCodeUrl: '',
    maintenanceMode: false
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 📸 Advanced Flipkart Media Slider Index State
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // 🔓 Premium Modal & Transaction Pipeline Input Buffers
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [utrNumber, setUtrNumber] = useState('');
  const [proofFile, setProofFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // 📡 STEP 1: Continuous Live Sync Listener for Master Admin Settings (UPI & QR Overwrites)
  useEffect(() => {
    const settingsRef = ref(db, 'globalSettings');
    const unsubscribeSettings = onValue(settingsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setGlobalSettings(data);
      }
    });

    return () => unsubscribeSettings();
  }, []);
  
  // 📦 STEP 2: Fetch Targeted Catalog Product Specifications Node from Firebase Realtime Cluster
  useEffect(() => {
    const fetchHackData = async () => {
      try {
        const hackSnapshot = await get(ref(db, `hacks/${hackId}`));
        if (hackSnapshot.exists()) {
          setHack(hackSnapshot.val());
        } else {
          toast.error("Targeted system configuration node was not found on cloud index!");
          navigate('/user/dashboard'); //
        }
      } catch (error) {
        toast.error("Network telemetry sync anomaly detected.");
        console.error(error);
      } finally {
        setIsLoading(false); //
      }
    };
    fetchHackData();
  }, [hackId, navigate]);
  
  // 📋 Copy Active UPI Destination String Command Handler
  const handleCopyUpiId = () => {
    const targetUpi = globalSettings.upiId || "ajaybhai@ybl";
    navigator.clipboard.writeText(targetUpi);
    toast.success("Merchant UPI ID successfully copied to clipboard layer!"); //
  };
  
  // 🖼️ Client Image Screen Capture Selection Validation Mechanism
  const handleScreenshotSelection = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      if (uploadedFile.size > 5 * 1024 * 1024) { // Absolute 5MB hard barrier ceiling limit
        toast.error("Media rejection: Individual file overhead size boundary constraint is 5MB!");
        return;
      }
      setProofFile(uploadedFile);
      setPreviewUrl(URL.createObjectURL(uploadedFile)); // Reactive blob visualization instantiation
    }
  };
  
  // 🚀 STEP 3: Complete Unified Transaction Submission Pipeline Gateway
  const handlePaymentVerificationRequest = async (e) => {
    e.preventDefault();
    
    // Strict compliance screening protocol checks
    if (!utrNumber || utrNumber.length < 12) {
      toast.error("Compliance alert: Official bank reference UTR sequence must contain exactly 12 digits.");
      return;
    }
    if (!proofFile) {
      toast.error("Verification dropped: Physical bank receipt screenshot verification file is required.");
      return;
    }
    
    setIsSubmitting(true);
    const billingToastToken = toast.loading("Streaming secure verification document to Supabase Storage nodes..."); //
    
    try {
      // Phase A: Stream physical file buffer directly to Supabase storage cluster bucket
      const publicStorageUrl = await uploadPaymentScreenshot(proofFile, currentUser.uid);
      
      if (!publicStorageUrl) {
        throw new Error("Supabase cloud object ingestion sequence drops stream.");
      }
      
      toast.loading("Compiling transaction hashes and mutating Firebase Realtime registry...", { id: billingToastToken });
      
      // Phase B: Commit persistent ledger node entry inside Firebase database system
      const transactionsQueueRef = push(ref(db, 'payments'));
      const executionPrice = hack.sellingPrice || hack.price || 0;
      
      await set(transactionsQueueRef, {
        userId: currentUser.uid, //
        userEmail: currentUser.email, //
        hackId: hackId, //
        hackTitle: hack.title, //
        price: Number(executionPrice), // Map exact active monetary transaction rate
        utrNumber: utrNumber, //
        proofImageUrl: publicStorageUrl, // Persistent cloud asset reference mapping address
        status: 'pending', // Commenced under operational auditing validation protocol queues
        rejectionReason: '', // Empty placeholder init state string
        timestamp: serverTimestamp() //
      });
      
      toast.success("Verification request safely logged to admin desk! System checking active.", { id: billingToastToken }); //
      setIsModalOpen(false);
      navigate('/user/purchases'); // Direct buyer to active digital inventory dashboard lockers
      
    } catch (error) {
      toast.error(`Transaction process aborted: ${error.message}`, { id: billingToastToken });
    } finally {
      setIsSubmitting(false); //
    }
  };

  // Flipkart Media Gallery Index Navigation Switches
  const nextSlide = () => {
    const imagesArray = hack.images || [hack.imageUrl];
    setCurrentImageIndex((prevIdx) => (prevIdx + 1) % imagesArray.length);
  };

  const prevSlide = () => {
    const imagesArray = hack.images || [hack.imageUrl];
    setCurrentImageIndex((prevIdx) => (prevIdx - 1 + imagesArray.length) % imagesArray.length);
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A1428] flex items-center justify-center">
        <div className="w-14 h-14 border-4 border-navy-700 border-t-white rounded-full animate-spin shadow-glass"></div>
      </div>
    );
  }

  // Backup dictionary mapping to guard against old schema models compatibility crashes
  const sliderImagesCollection = hack.images && hack.images.length > 0 
    ? hack.images 
    : [hack.imageUrl || "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070"];

  // Flipkart Advanced Reduction Percentage Pricing Engine Logic
  const baseMRP = Number(hack.originalPrice || (hack.price ? hack.price * 3 : 499));
  const finalPrice = Number(hack.sellingPrice || hack.price || 149);
  const mathematicalDiscountPercent = Math.round(((baseMRP - finalPrice) / baseMRP) * 100);

  return (
    <div className="min-h-screen bg-[#0A1428] pb-32 pt-6 px-4 select-none relative overflow-x-hidden">
      
      {/* 🌌 High-Performance Ambient Aesthetic Radial Vector Glow Layers */}
      <div className="absolute top-[-5%] left-[-10%] w-[450px] h-[450px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-[10%] right-[-5%] w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto">
        
        {/* Navigation Action Node Anchor Links */}
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors group text-sm font-bold tracking-wider"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> BACK TO CATALOG SYSTEM
        </button>

        {/* Global Structural Network Maintenance Isolation Trigger Ribbon Info banner */}
        {globalSettings.maintenanceMode && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 mb-8 flex items-center gap-3 text-red-400">
            <AlertTriangle className="flex-shrink-0 animate-bounce" />
            <p className="text-xs font-bold uppercase tracking-wide">
              Emergency Network Alert: Secure buying pipelines are temporarily rate-limited due to system core optimizations!
            </p>
          </div>
        )}

        {/* ⚡ TWO-COLUMN DISCRETE PRODUCT CATALOG WRAPPER ARCHITECTURE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ==================== LEFT COMPONENT BLOCK: FLIPKART MULTI-MEDIA GALLERY SLIDER ==================== */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Main Visual Display Framework */}
            <div className="glass-panel p-2 rounded-3xl border border-white/5 relative shadow-2xl group/slider overflow-hidden">
              <div className="relative h-72 sm:h-96 w-full rounded-2xl overflow-hidden bg-black/40">
                
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentImageIndex}
                    src={sliderImagesCollection[currentImageIndex]}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                    alt={`Ecosystem snapshot visual coordinate sequence ${currentImageIndex + 1}`}
                    className="w-full h-full object-cover"
                  />
                </AnimatePresence>

                {/* Trust Matrix Authentication System Badges overlay flags */}
                <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                  <span className="bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-md shadow-lg border border-blue-400/30 flex items-center gap-1">
                    <Zap size={10} className="fill-white" /> FLIPKART QUALITY SPEC
                  </span>
                  <span className="bg-green-500/20 backdrop-blur-md text-green-400 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-md border border-green-500/40 w-fit">
                    🛡️ INTEGRITY DRIVER v1.2
                  </span>
                </div>

                {/* Left/Right Click Chevron Action Controls */}
                {sliderImagesCollection.length > 1 && (
                  <>
                    <button 
                      onClick={prevSlide}
                      className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-[#0A1428]/70 text-white hover:bg-white hover:text-black transition-all shadow-xl opacity-0 group-hover/slider:opacity-100 backdrop-blur-md border border-white/10"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button 
                      onClick={nextSlide}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-[#0A1428]/70 text-white hover:bg-white hover:text-black transition-all shadow-xl opacity-0 group-hover/slider:opacity-100 backdrop-blur-md border border-white/10"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}

                {/* Matrix Index Pagination Text Indicator block */}
                <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-md border border-white/10 text-white px-3 py-1 rounded-lg text-xs font-mono font-bold">
                  {currentImageIndex + 1} / {sliderImagesCollection.length}
                </div>
              </div>

              {/* Lower Level Navigation Strip Row for Thumbnail syncing maps */}
              {sliderImagesCollection.length > 1 && (
                <div className="flex justify-center gap-2 mt-3 px-2 pb-1 overflow-x-auto custom-scrollbar">
                  {sliderImagesCollection.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-16 h-12 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all bg-black ${
                        index === currentImageIndex ? 'border-blue-500 scale-105 shadow-md' : 'border-white/10 opacity-60'
                      }`}
                    >
                      <img src={img} alt="Structural thumbnail layer index strip" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Systematic Product Specifications Grid Block layout */}
            <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-4">
              <h4 className="text-lg font-black text-white tracking-wider border-b border-white/10 pb-3 uppercase flex items-center gap-2">
                📋 SYSTEM SPECIFICATIONS & CORE MATRIX DELIVERABLES
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm font-medium">
                <div className="bg-[#001233]/60 p-3 rounded-xl border border-white/5 flex justify-between">
                  <span className="text-gray-400">Architecture Vector:</span>
                  <span className="text-blue-400 font-bold font-mono">Mobile-First</span>
                </div>
                <div className="bg-[#001233]/60 p-3 rounded-xl border border-white/5 flex justify-between">
                  <span className="text-gray-400">Security Guard Ring:</span>
                  <span className="text-green-400 font-bold">100% Core Layer Safe</span>
                </div>
                <div className="bg-[#001233]/60 p-3 rounded-xl border border-white/5 flex justify-between">
                  <span className="text-gray-400">System Build String:</span>
                  <span className="text-purple-400 font-bold font-mono">{hack.version || "v1.2"}</span>
                </div>
                <div className="bg-[#001233]/60 p-3 rounded-xl border border-white/5 flex justify-between">
                  <span className="text-gray-400">Overhead Payload Delivery:</span>
                  <span className="text-yellow-400 font-bold">External Cloud Redirect</span>
                </div>
              </div>
            </div>

          </div>

          {/* ==================== RIGHT COMPONENT BLOCK: COMMERCIAL META PRICING INFORMATION ==================== */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Title Summary card content box */}
            <div className="glass-panel p-6 md:p-8 rounded-3xl border border-white/5 space-y-4 shadow-2xl">
              
              <div className="flex items-center gap-2 text-xs font-bold text-green-400 uppercase tracking-widest">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div> REPOSITORY ONLINE / IN STOCK
              </div>

              <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-tight uppercase">
                {hack.title}
              </h1>

              {/* E-Commerce Review Realism Star Framework Badge elements */}
              <div className="flex items-center gap-2 border-b border-white/5 pb-4">
                <div className="bg-green-600 text-white px-2 py-0.5 rounded flex items-center gap-0.5 text-xs font-bold shadow-md">
                  4.8 <Star size={12} className="fill-white" />
                </div>
                <span className="text-xs text-gray-400 font-bold tracking-wide hover:underline cursor-pointer">
                  (4,103 Verified Operational Client Appraisals)
                </span>
              </div>

              {/* Flipkart Dual Layer Pricing Layout Block */}
              <div className="bg-[#001233]/40 p-4 rounded-2xl border border-white/5 space-y-1">
                <p className="text-xs text-gray-400 font-bold tracking-wider uppercase">Catalog Special Deal Pricing</p>
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-black text-white tracking-tight font-mono">
                    ₹{finalPrice}
                  </span>
                  <span className="text-gray-500 line-through font-bold text-sm font-mono">
                    ₹{baseMRP}
                  </span>
                  <span className="text-green-400 text-sm font-black tracking-wide flex items-center gap-0.5 bg-green-500/10 px-2 py-0.5 rounded-md border border-green-500/20">
                    <Percent size={12} /> {mathematicalDiscountPercent}% SPECIAL OFF
                  </span>
                </div>
                <p className="text-[11px] text-yellow-500/90 font-bold pt-1">
                  * Perpetual distribution clearance asset. Zero subscription parameters attached.
                </p>
              </div>

              {/* Split Array Bullet Features Output Lists highlights */}
              <div className="space-y-3 pt-2">
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Ecosystem Deliverables Log Matrix</p>
                <div className="space-y-2">
                  {hack.features && hack.features.map((featureItem, indexToken) => (
                    <div key={indexToken} className="flex items-start gap-2 text-sm text-gray-300">
                      <ShieldCheck size={18} className="text-blue-500 flex-shrink-0 mt-0.5" />
                      <span className="font-medium">{featureItem}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Descriptive Paragraph summary field boxes */}
              <div className="pt-2">
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Configuration Narrative Spec</p>
                <p className="text-sm text-gray-400 font-medium leading-relaxed bg-[#001233]/30 p-3 rounded-xl border border-white/5">
                  {hack.description || "No specific detailed description texts compiled for this terminal file node allocation registry."}
                </p>
              </div>

              {/* Desktop View Trigger Interaction Button elements */}
              <button
                onClick={() => {
                  if(!globalSettings.maintenanceMode) setIsModalOpen(true);
                }}
                disabled={globalSettings.maintenanceMode}
                className="hidden lg:flex w-full bg-white text-[#0A1428] font-black text-lg py-4 rounded-2xl shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:bg-gray-200 transition-all active:scale-[0.98] items-center justify-center gap-2 tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Zap size={20} className="fill-current" /> UNLOCK PREMIUM CORE REPOSITORY ACCESS
              </button>

            </div>

          </div>
        </div>

      </div>
      
      
      
      {/* ==================== STICKY BOTTOM ACTIONS CONTROL BAR FOR HANDSET VIEWPORTS ==================== */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full bg-[#001233]/95 backdrop-blur-md border-t border-white/10 p-4 z-40 shadow-[0_-10px_30px_rgba(0,0,0,0.5)] flex items-center justify-between gap-4">
        <div className="flex flex-col">
          <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Total Valuation</span>
          <span className="text-2xl font-black text-white font-mono">₹{finalPrice}</span>
        </div>
        <button
          onClick={() => {
            if(!globalSettings.maintenanceMode) setIsModalOpen(true);
          }}
          disabled={globalSettings.maintenanceMode}
          className="flex-grow max-w-[240px] bg-white text-[#0A1428] font-black text-sm py-3 px-4 rounded-xl shadow-lg hover:bg-gray-100 active:scale-95 transition-all text-center uppercase tracking-widest disabled:opacity-50"
        >
          Unlock System Access
        </button>
      </div>

      {/* ==================== ADVANCED HIGH-FIDELITY GLASSMORPHISM GATEWAY MODAL INTERFACE ==================== */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* Deep blurred dark mask trigger overlay component */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/85 backdrop-blur-md"
            />

            {/* Core Modal Core Structural Canvas Component layout window shell */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="glass-panel w-full max-w-lg rounded-3xl border border-blue-500/30 overflow-hidden shadow-2xl relative z-10 max-h-[95vh] flex flex-col"
            >
              
              {/* Header block interface bar component */}
              <div className="p-5 border-b border-white/10 flex items-center justify-between bg-[#001233]/80">
                <div className="flex items-center gap-2">
                  <QrCode className="text-blue-400" size={22} />
                  <h3 className="text-xl font-bold text-white uppercase tracking-wider">Dynamic Clearing Node Dashboard</h3>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Scrollable Container Content Body Form Area */}
              <div className="p-6 overflow-y-auto custom-scrollbar space-y-5 flex-grow">
                
                {/* 🚨 NEW PREMIUM EXCLUSIVE HIGH-FIDELITY COGNITIVE ACTION: GIANT TARGET VALUE VIEWPORT BANNER */}
                <div className="bg-gradient-to-r from-emerald-950/40 to-emerald-900/20 border-2 border-emerald-500/40 rounded-2xl p-5 text-center space-y-1 shadow-[0_0_30px_rgba(16,185,129,0.15)] animate-pulse-slow">
                  <span className="text-[11px] font-black text-emerald-400 uppercase tracking-widest block mb-0.5">
                    🚨 PAY EXACTLY THIS MONETARY AMOUNT / कुल भुगतान राशि 🚨
                  </span>
                  <div className="flex items-center justify-center gap-1.5 text-white font-mono">
                    <IndianRupee size={32} className="text-emerald-400 stroke-[3]" />
                    <h4 className="text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-100 to-gray-300 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                      {finalPrice}
                    </h4>
                  </div>
                  <p className="text-[10px] text-yellow-500 font-bold uppercase tracking-wider pt-1">
                    Attention: Do not modify the subtotal digits to safeguard against verification delays or drops!
                  </p>
                </div>

                {/* Secure Payment routing channel asset container layout section */}
                <div className="bg-gradient-to-br from-blue-900/20 to-black/50 p-5 rounded-2xl border border-white/5 text-center space-y-4">
                  <p className="text-xs text-gray-300 font-bold tracking-wide">
                    Scan Authorized Merchant QR Frame or Execute Secure UPI Route Transfers
                  </p>

                  {/* High Definition QR Layout display wrapper bracket channel rendering logic */}
                  <div className="w-48 h-48 bg-white rounded-xl mx-auto flex items-center justify-center p-2.5 shadow-2xl border border-white/10 relative group/qr overflow-hidden">
                    {globalSettings.upiQrCodeUrl ? (
                      <img 
                        src={globalSettings.upiQrCodeUrl} 
                        alt="Official Authorized Live System Clearing QR Stream Identity Vector" 
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="text-[#0A1428] font-black text-center text-xs space-y-1">
                        <QrCode size={40} className="mx-auto text-navy-900 animate-pulse" />
                        <p className="text-[10px] text-gray-400">Mapping Live QR Channel...</p>
                      </div>
                    )}
                  </div>

                  {/* Copy String interface controller routing component elements */}
                  <div className="flex items-center justify-center gap-2 bg-[#0A1428] py-2.5 px-4 rounded-xl border border-white/10 mx-auto w-fit max-w-full shadow-inner">
                    <span className="text-sm font-black text-blue-400 font-mono tracking-widest truncate max-w-[220px]">
                      {globalSettings.upiId || "ajaybhai@ybl"}
                    </span>
                    <button 
                      type="button"
                      onClick={handleCopyUpiId} 
                      className="p-1.5 bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white rounded-lg transition-all active:scale-90 shadow-md"
                    >
                      <Copy size={14} />
                    </button>
                  </div>
                </div>

                {/* Form Processing Gateway fields validation mapping component block */}
                <form onSubmit={handlePaymentVerificationRequest} className="space-y-4">
                  
                  {/* UTR Input text tracking block */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest">
                      12-Digit Banking Reference Sequence Number (UTR)
                    </label>
                    <input 
                      type="number" 
                      required
                      value={utrNumber}
                      onChange={(e) => setUtrNumber(e.target.value)}
                      placeholder="e.g. 312345678901" 
                      className="w-full bg-[#001233] border border-white/10 text-white rounded-xl px-4 py-3.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none font-mono font-bold transition-all"
                    />
                  </div>

                  {/* Image Screening capture documents upload module assembly block layout */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest">
                      Transmit Verified Clearing Screenshot Receipt File
                    </label>
                    <div className="relative">
                      <input 
                        type="file" 
                        accept="image/*" 
                        required
                        onChange={handleScreenshotSelection}
                        className="hidden" 
                        id="modal-screenshot-input-hook" 
                      />
                      <label 
                        htmlFor="modal-screenshot-input-hook" 
                        className="flex flex-col items-center justify-center w-full h-32 bg-[#001233]/80 border-2 border-dashed border-white/10 rounded-xl cursor-pointer hover:border-blue-500 hover:bg-blue-950/20 transition-all group overflow-hidden relative shadow-inner"
                      >
                        {previewUrl ? (
                          <img src={previewUrl} alt="Transaction document verification file data index tracking preview" className="w-full h-full object-cover opacity-40 group-hover:opacity-20 transition-opacity" />
                        ) : (
                          <div className="text-center text-gray-400 group-hover:text-blue-400 transition-colors space-y-1 p-4">
                            <UploadCloud size={26} className="mx-auto" />
                            <p className="text-xs font-bold">Pick Transaction Image Screenshot</p>
                            <p className="text-[10px] text-gray-500 font-medium">JPEG, PNG, or WEBP file structure max 5MB</p>
                          </div>
                        )}
                        {previewUrl && (
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <span className="bg-[#0A1428]/95 border border-white/10 px-3 py-1.5 rounded-xl text-[11px] font-black uppercase text-white shadow-2xl flex items-center gap-1">
                              <ImageIcon size={12} /> Alter File Instance
                            </span>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>

                  {/* Dispatch process terminal switch interface triggers action item */}
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black text-md py-4 rounded-xl shadow-[0_0_25px_rgba(37,99,235,0.4)] transition-all active:scale-[0.97] flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed uppercase tracking-wider pt-4 border border-blue-400/20"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <ShieldCheck size={18} /> TRANSMIT ARCHIVE METADATA ROUTE
                      </>
                    )}
                  </button>

                </form>

              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default PageBuyHack;