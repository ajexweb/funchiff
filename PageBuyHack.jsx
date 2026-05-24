// PageBuyHack.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ref, get, push, set, onValue, serverTimestamp } from 'firebase/database';
import { db } from './firebase.jsx'; // Flat structure database instance
import { uploadPaymentScreenshot } from './supabase.js'; // Advanced Supabase engine connection
import { useAuth } from './AuthContext.jsx'; // Security guard
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Copy, UploadCloud, ShieldCheck, QrCode, ArrowLeft, 
  Image as ImageIcon, ChevronLeft, ChevronRight, Star, 
  Percent, Zap, X, AlertTriangle 
} from 'lucide-react';

const PageBuyHack = () => {
  const { hackId } = useParams(); // URL se panel ki unique id fetch ho rhi hai
  const navigate = useNavigate();
  const { currentUser } = useAuth(); // Active gamer session validation
  
  // 🛰️ Full-Stack Global States
  const [hack, setHack] = useState(null);
  const [globalSettings, setGlobalSettings] = useState({
    upiId: 'ajaybhai@ybl', // Fallback defaults if database is syncing
    upiQrCodeUrl: '',
    maintenanceMode: false
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 📸 Advanced Flipkart Media Slider State
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // 🔓 Premium Modal & Form Submission States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [utrNumber, setUtrNumber] = useState('');
  const [proofFile, setProofFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // 📡 STEP 1: Real-time Listener for Global Admin Settings (UPI ID & QR Code)
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
  
  // 📦 STEP 2: Fetch Target Game Panel Specifications from Firebase
  useEffect(() => {
    const fetchHackData = async () => {
      try {
        const hackSnapshot = await get(ref(db, `hacks/${hackId}`));
        if (hackSnapshot.exists()) {
          setHack(hackSnapshot.val());
        } else {
          toast.error("Requested VIP file node not found on server!");
          navigate('/user/dashboard'); //
        }
      } catch (error) {
        toast.error("Network synchronization anomaly detected.");
        console.error(error);
      } finally {
        setIsLoading(false); //
      }
    };
    fetchHackData();
  }, [hackId, navigate]);
  
  // 📋 Copy Live UPI ID Action Channel
  const handleCopyUpiId = () => {
    const targetUpi = globalSettings.upiId || "ajaybhai@ybl";
    navigator.clipboard.writeText(targetUpi);
    toast.success("Official UPI ID copied to clipboard context!"); //
  };
  
  // 🖼️ Media Stream Input Verification Protocol
  const handleScreenshotSelection = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      if (uploadedFile.size > 5 * 1024 * 1024) { // Absolute 5MB restriction
        toast.error("Asset matrix overflow! Image size constraint limit is 5MB.");
        return;
      }
      setProofFile(uploadedFile);
      setPreviewUrl(URL.createObjectURL(uploadedFile)); // Real-time preview instantiation
    }
  };
  
  // 🚀 STEP 3: Complete Transaction Gateway Pipeline (Supabase + Firebase)
  const handlePaymentVerificationRequest = async (e) => {
    e.preventDefault();
    
    // Strict parameters screening
    if (!utrNumber || utrNumber.length < 12) {
      toast.error("Compliance failure: Bank reference UTR must be exactly 12 digits.");
      return;
    }
    if (!proofFile) {
      toast.error("Validation error: Transaction receipt screen capture is mandatory.");
      return;
    }
    
    setIsSubmitting(true);
    const billingToastToken = toast.loading("Uploading secure payload block to Supabase Storage..."); //
    
    try {
      // Phase A: Push image stream to Supabase Storage system
      const publicStorageUrl = await uploadPaymentScreenshot(proofFile, currentUser.uid);
      
      if (!publicStorageUrl) {
        throw new Error("Payload distribution dropped by Supabase cluster node.");
      }
      
      toast.loading("Compiling telemetry and updating Firebase Realtime cluster...", { id: billingToastToken });
      
      // Phase B: Write persistent transaction instance into Firebase Database
      const transactionsQueueRef = push(ref(db, 'payments'));
      
      // Dynamic Pricing fallback algorithm to ensure older models don't crash
      const executionPrice = hack.sellingPrice || hack.price || 0;
      
      await set(transactionsQueueRef, {
        userId: currentUser.uid, //
        userEmail: currentUser.email, //
        hackId: hackId, //
        hackTitle: hack.title, //
        price: Number(executionPrice), // Dynamic billing value assignment
        utrNumber: utrNumber, //
        proofImageUrl: publicStorageUrl, // Permanent cloud link reference
        status: 'pending', // Awaiting manual verification review pipeline
        rejectionReason: '', // Clean empty string state initialization
        timestamp: serverTimestamp() //
      });
      
      toast.success("Verification request queued successfully! Awaiting master authorization.", { id: billingToastToken }); //
      setIsModalOpen(false); // Clear screen view
      navigate('/user/purchases'); // Redirect player to active inventory view
      
    } catch (error) {
      toast.error(`Critical transaction error: ${error.message}`, { id: billingToastToken });
    } finally {
      setIsSubmitting(false); //
    }
  };

  // 🛠️ Flipkart Image Slider Navigation Index Controllers
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

  // Fallback checks for image sources matrix conversion
  const sliderImagesCollection = hack.images && hack.images.length > 0 
    ? hack.images 
    : [hack.imageUrl || "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070"];

  // Flipkart Dynamic Pricing Data Engine Calculations
  const baseMRP = Number(hack.originalPrice || (hack.price ? hack.price * 3 : 499));
  const finalPrice = Number(hack.sellingPrice || hack.price || 149);
  const mathematicalDiscountPercent = Math.round(((baseMRP - finalPrice) / baseMRP) * 100);

  return (
    <div className="min-h-screen bg-[#0A1428] pb-32 pt-6 px-4 select-none relative overflow-x-hidden">
      
      {/* 🌌 Ambient Vector Aesthetic Lights */}
      <div className="absolute top-[-5%] left-[-10%] w-[450px] h-[450px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-[10%] right-[-5%] w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto">
        
        {/* Navigation History Action Node */}
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors group text-sm font-bold tracking-wider"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> BACK TO ECOSYSTEM
        </button>

        {/* Emergency Maintenance Mode Notification Bar */}
        {globalSettings.maintenanceMode && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 mb-8 flex items-center gap-3 text-red-400">
            <AlertTriangle className="flex-shrink-0 animate-bounce" />
            <p className="text-xs font-bold uppercase tracking-wide">
              System Notice: Purchases are temporarily rate-limited due to core node synchronization deployment!
            </p>
          </div>
        )}

        {/* ⚡ TWO COLUMN MASTER FLIPKART ARCHITECTURE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ==================== LEFT PANEL: MEDIA ENGINE MATRIX ==================== */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Flipkart Image Slider Main Assembly */}
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
                    alt={`Visualization Stream State ${currentImageIndex + 1}`}
                    className="w-full h-full object-cover"
                  />
                </AnimatePresence>

                {/* Trust Factor System Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                  <span className="bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-md shadow-lg border border-blue-400/30 flex items-center gap-1">
                    <Zap size={10} className="fill-white" /> FLIPKART CHOICE
                  </span>
                  <span className="bg-green-500/20 backdrop-blur-md text-green-400 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-md border border-green-500/40 w-fit">
                    🛡️ ANTI-BAN v1.2
                  </span>
                </div>

                {/* Navigation Chevron Arrow Handles */}
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

                {/* Pagination Metrics Indicator String */}
                <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-md border border-white/10 text-white px-3 py-1 rounded-lg text-xs font-mono font-bold">
                  {currentImageIndex + 1} / {sliderImagesCollection.length}
                </div>
              </div>

              {/* Bottom Thumbnail Strip for Visual Synchronization */}
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
                      <img src={img} alt="Strip Thumbnail" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Structured Specifications Matrix - Flipkart Content Accordion */}
            <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-4">
              <h4 className="text-lg font-black text-white tracking-wider border-b border-white/10 pb-3 uppercase flex items-center gap-2">
                📋 Technical Specifications & Engine Details
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm font-medium">
                <div className="bg-[#001233]/60 p-3 rounded-xl border border-white/5 flex justify-between">
                  <span className="text-gray-400">Deployment Architecture:</span>
                  <span className="text-blue-400 font-bold font-mono">Mobile-First</span>
                </div>
                <div className="bg-[#001233]/60 p-3 rounded-xl border border-white/5 flex justify-between">
                  <span className="text-gray-400">Security Core Level:</span>
                  <span className="text-green-400 font-bold">100% Kernel Safe</span>
                </div>
                <div className="bg-[#001233]/60 p-3 rounded-xl border border-white/5 flex justify-between">
                  <span className="text-gray-400">Patch Version:</span>
                  <span className="text-purple-400 font-bold font-mono">{hack.version || "v1.2"}</span>
                </div>
                <div className="bg-[#001233]/60 p-3 rounded-xl border border-white/5 flex justify-between">
                  <span className="text-gray-400">Data Overhead:</span>
                  <span className="text-yellow-400 font-bold">External URL Link</span>
                </div>
              </div>
            </div>

          </div>

          {/* ==================== RIGHT PANEL: SCHEMATIC SPECIFICATIONS BLOCK ==================== */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Title & Core Meta Overview */}
            <div className="glass-panel p-6 md:p-8 rounded-3xl border border-white/5 space-y-4 shadow-2xl">
              
              <div className="flex items-center gap-2 text-xs font-bold text-green-400 uppercase tracking-widest">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div> IN STOCK / REVERSIBLE ENGINE
              </div>

              <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-tight uppercase">
                {hack.title}
              </h1>

              {/* Fake Realism Stars Framework Badge */}
              <div className="flex items-center gap-2 border-b border-white/5 pb-4">
                <div className="bg-green-600 text-white px-2 py-0.5 rounded flex items-center gap-0.5 text-xs font-bold shadow-md">
                  4.8 <Star size={12} className="fill-white" />
                </div>
                <span className="text-xs text-gray-400 font-bold tracking-wide hover:underline cursor-pointer">
                  (3,842 Client Appraisals / Reviews)
                </span>
              </div>

              {/* Flipkart Style Complex Price Interface Block */}
              <div className="bg-[#001233]/40 p-4 rounded-2xl border border-white/5 space-y-1">
                <p className="text-xs text-gray-400 font-bold tracking-wider uppercase">Special Investment Cost</p>
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-black text-white tracking-tight font-mono">
                    ₹{finalPrice}
                  </span>
                  <span className="text-gray-500 line-through font-bold text-sm font-mono">
                    ₹{baseMRP}
                  </span>
                  <span className="text-green-400 text-sm font-black tracking-wide flex items-center gap-0.5 bg-green-500/10 px-2 py-0.5 rounded-md border border-green-500/20">
                    <Percent size={12} /> {mathematicalDiscountPercent}% OFF
                  </span>
                </div>
                <p className="text-[11px] text-yellow-500/90 font-bold pt-1">
                  * Inclusive of all master database configuration parameters. No recurring charges.
                </p>
              </div>

              {/* Bullet Highlights Section */}
              <div className="space-y-3 pt-2">
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Product Deliverables Matrix</p>
                <div className="space-y-2">
                  {hack.features && hack.features.map((featureItem, indexToken) => (
                    <div key={indexToken} className="flex items-start gap-2 text-sm text-gray-300">
                      <ShieldCheck size={18} className="text-blue-500 flex-shrink-0 mt-0.5" />
                      <span className="font-medium">{featureItem}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Short Descriptive Summary Text Box */}
              <div className="pt-2">
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Configuration Overview</p>
                <p className="text-sm text-gray-400 font-medium leading-relaxed bg-[#001233]/30 p-3 rounded-xl border border-white/5">
                  {hack.description || "No customized descriptor provided for this specific system listing nodes."}
                </p>
              </div>

              {/* Desktop Layout Operational Interface Button */}
              <button
                onClick={() => {
                  if(!globalSettings.maintenanceMode) setIsModalOpen(true);
                }}
                disabled={globalSettings.maintenanceMode}
                className="hidden lg:flex w-full bg-white text-[#0A1428] font-black text-lg py-4 rounded-2xl shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:bg-gray-200 transition-all active:scale-[0.98] items-center justify-center gap-2 tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Zap size={20} className="fill-current" /> UNLOCK PREMIUM SYSTEM ACCESS
              </button>

            </div>

          </div>
        </div>

      </div>

      {/* ==================== STICKY BOTTOM BAR FOR MOBILE LAYOUT NODES ==================== */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full bg-[#001233]/90 backdrop-blur-md border-t border-white/10 p-4 z-40 shadow-[0_-10px_30px_rgba(0,0,0,0.5)] flex items-center justify-between gap-4">
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
          Unlock Now
        </button>
      </div>

      {/* ==================== ADVANCED GLASSMORPHISM TRANSACTION GATEWAY MODAL ==================== */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* Dark Blurred Backdrop Space Trigger */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Core Modal Window Shell */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="glass-panel w-full max-w-lg rounded-3xl border border-blue-500/30 overflow-hidden shadow-2xl relative z-10 max-h-[90vh] flex flex-col"
            >
              
              {/* Header Context Bar */}
              <div className="p-5 border-b border-white/10 flex items-center justify-between bg-[#001233]/80">
                <div className="flex items-center gap-2">
                  <QrCode className="text-blue-400" size={22} />
                  <h3 className="text-xl font-bold text-white uppercase tracking-wider">Dynamic Clearing Node</h3>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Scrollable Form Body Container */}
              <div className="p-6 overflow-y-auto custom-scrollbar space-y-6 flex-grow">
                
                {/* Step A: Live Sync QR Code Assets Viewport */}
                <div className="bg-gradient-to-br from-blue-900/30 to-black/40 p-4 rounded-2xl border border-blue-500/20 text-center space-y-4">
                  <p className="text-xs text-gray-300 font-bold tracking-wide">
                    Scan Authorized QR Signature or Process Direct API Transfer
                  </p>

                  {/* QR Core Image Frame Render Channel */}
                  <div className="w-44 h-44 bg-white rounded-xl mx-auto flex items-center justify-center p-2 shadow-inner border border-white/20 relative group/qr">
                    {globalSettings.upiQrCodeUrl ? (
                      <img 
                        src={globalSettings.upiQrCodeUrl} 
                        alt="Official Merchant Realtime Verification QR" 
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="text-[#0A1428] font-black text-center text-xs space-y-1">
                        <QrCode size={40} className="mx-auto text-navy-900 animate-pulse" />
                        <p>Syncing QR Asset...</p>
                      </div>
                    )}
                  </div>

                  {/* Dynamic String Handler Input Interface */}
                  <div className="flex items-center justify-center gap-2 bg-[#0A1428] py-2.5 px-4 rounded-xl border border-white/10 mx-auto w-fit max-w-full">
                    <span className="text-sm font-black text-blue-400 font-mono tracking-widest truncate max-w-[220px]">
                      {globalSettings.upiId || "ajaybhai@ybl"}
                    </span>
                    <button 
                      type="button"
                      onClick={handleCopyUpiId} 
                      className="p-1.5 bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white rounded-lg transition-all active:scale-90"
                    >
                      <Copy size={14} />
                    </button>
                  </div>

                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-2.5 text-center">
                    <p className="text-[11px] text-yellow-500 font-black uppercase tracking-wider">
                      ⚠️ Instruction: Deposit exactly INR {finalPrice} to guarantee immediate approval node.
                    </p>
                  </div>
                </div>

                {/* Step B: Telemetry Verification Data Inputs Form */}
                <form onSubmit={handlePaymentVerificationRequest} className="space-y-4">
                  
                  {/* UTR Input Block */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest">
                      12-Digit Bank UTR / Reference Parameter
                    </label>
                    <input 
                      type="number" 
                      required
                      value={utrNumber}
                      onChange={(e) => setUtrNumber(e.target.value)}
                      placeholder="e.g. 312345678901" 
                      className="w-full bg-[#001233] border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none font-mono"
                    />
                  </div>

                  {/* Screenshot Document Upload Framework */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest">
                      Upload Verification File (Image Screenshot)
                    </label>
                    <div className="relative">
                      <input 
                        type="file" 
                        accept="image/*" 
                        required
                        onChange={handleScreenshotSelection}
                        className="hidden" 
                        id="modal-screenshot-input" 
                      />
                      <label 
                        htmlFor="modal-screenshot-input" 
                        className="flex flex-col items-center justify-center w-full h-36 bg-[#001233]/80 border-2 border-dashed border-white/10 rounded-xl cursor-pointer hover:border-blue-500 hover:bg-blue-950/20 transition-all group overflow-hidden"
                      >
                        {previewUrl ? (
                          <img src={previewUrl} alt="Payload Verification Screen Specimen" className="w-full h-full object-cover opacity-50 group-hover:opacity-30 transition-opacity" />
                        ) : (
                          <div className="text-center text-gray-400 group-hover:text-blue-400 transition-colors space-y-1">
                            <UploadCloud size={28} className="mx-auto" />
                            <p className="text-xs font-bold">Select Receipt Screen Capture</p>
                            <p className="text-[10px] text-gray-500 font-medium">JPEG, PNG, WEBP format limit 5MB</p>
                          </div>
                        )}
                        {previewUrl && (
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <span className="bg-[#0A1428]/90 border border-white/10 px-3 py-1.5 rounded-xl text-[11px] font-black uppercase text-white shadow-xl flex items-center gap-1">
                              <ImageIcon size={12} /> Swap Specimen File
                            </span>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>

                  {/* Operational Launch Submission Element */}
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black text-md py-3.5 rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all active:scale-[0.97] flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed uppercase tracking-wider pt-4"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <ShieldCheck size={18} /> Transmit Routing Payload
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