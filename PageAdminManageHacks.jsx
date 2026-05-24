// PageAdminManageHacks.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ref, push, set, onValue, remove, update } from 'firebase/database';
import { db } from './firebase.jsx'; // Flat Structure Firebase Instance
import { uploadPanelImages, cleanUpStorageAssetsByUrls } from './supabase.js'; // Advanced Supabase Storage Engine
import toast from 'react-hot-toast';
import { 
  Settings, Plus, Trash2, Edit3, UploadCloud, 
  IndianRupee, Key, Link2, FileText, LayoutGrid, 
  RefreshCw, X, ShieldCheck, AlertTriangle, HelpCircle 
} from 'lucide-react';

const PageAdminManageHacks = () => {
  // 📡 Core Node States
  const [hacks, setHacks] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const formRef = useRef(null);

  // 📝 Advanced Edit Engine Control States
  const [isEditing, setIsEditing] = useState(false);
  const [editHackId, setEditHackId] = useState(null);
  const [savedImagesQueue, setSavedImagesQueue] = useState([]);

  // 🖼️ Multi-Media Stream States
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [mediaPreviews, setMediaPreviews] = useState([]);

  // 📊 Full-Stack Monitored Form State Architecture
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    originalPrice: '',
    sellingPrice: '',
    downloadUrl: '',
    password: '',
    features: '' // Inputs received as comma separated strings
  });

  // 🚀 STEP 1: Real-Time Listener to Fetch Existing Live Store Listings
  useEffect(() => {
    const hacksDatabaseRef = ref(db, 'hacks'); //
    const unsubscribeHacks = onValue(hacksDatabaseRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Converting Firebase Object node matrix to map-ready array structures
        const hacksArray = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        setHacks(hacksArray.reverse()); // Latest updates slide to top layer
      } else {
        setHacks([]);
      }
    });
    
    return () => unsubscribeHacks();
  }, []);

  // 📝 Input Stream Parameter State Handlers
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 📸 Multiple Screenshots Batch File Handler (With Realtime Previews)
  const handleMediaSelection = (e) => {
    const rawFiles = Array.from(e.target.files);
    
    // Safety boundary constraints enforcement check
    const sizeOverheadLimit = 5 * 1024 * 1024; // 5MB limit check per asset image
    const validFilesQueue = [];
    const temporaryPreviewsUrls = [];

    rawFiles.forEach(fileNode => {
      if (fileNode.size > sizeOverheadLimit) {
        toast.error(`Asset "${fileNode.name}" rejected! Individual images cannot exceed 5MB.`);
        return;
      }
      validFilesQueue.push(fileNode);
      temporaryPreviewsUrls.push(URL.createObjectURL(fileNode));
    });

    setSelectedFiles([...selectedFiles, ...validFilesQueue]);
    setMediaPreviews([...mediaPreviews, ...temporaryPreviewsUrls]);
  };

  // 🧹 Clear Selected Image Cache Buffer Stream Unit
  const clearTargetMediaNode = (indexToken) => {
    const filteredFiles = selectedFiles.filter((_, idx) => idx !== indexToken);
    const filteredPreviews = mediaPreviews.filter((_, idx) => idx !== indexToken);
    setSelectedFiles(filteredFiles);
    setMediaPreviews(filteredPreviews);
  };

  // 📤 STEP 2: Unified Write/Update Database Submission Pipeline (Firebase + Supabase)
  const handleFormDeploymentGate = async (e) => {
    e.preventDefault();

    // Comprehensive compliance baseline parameters verification rule
    if (!formData.title || !formData.originalPrice || !formData.sellingPrice || !formData.downloadUrl || !formData.password) {
      toast.error("Compliance Alert: All operational infrastructure fields are mandatory!");
      return;
    }

    if (Number(formData.sellingPrice) > Number(formData.originalPrice)) {
      toast.error("Financial Anomaly: Selling Price cannot be larger than base original MRP valuation!");
      return;
    }

    if (!isEditing && selectedFiles.length === 0) {
      toast.error("Media Requirement: Minimum 1 product screenshot is required for catalog injection!");
      return;
    }

    setIsProcessing(true);
    const executionToastId = toast.loading(
      isEditing ? "Re-syncing cloud structures and compiling updates..." : "Deploying secure configurations to network infrastructure..."
    );

    try {
      let finalMediaUrlsArray = [...savedImagesQueue];

      // If admin selected new files, stream them batch-wise into Supabase storage buckets
      if (selectedFiles.length > 0) {
        const adminUidToken = import.meta.env.VITE_ADMIN_UID || "system_admin";
        const uploadedUrlsResult = await uploadPanelImages(selectedFiles, adminUidToken); //
        
        if (isEditing) {
          // If editing and replacing, merge or overwrite depending on operational status
          finalMediaUrlsArray = [...finalMediaUrlsArray, ...uploadedUrlsResult];
        } else {
          finalMediaUrlsArray = uploadedUrlsResult;
        }
      }

      // Safeguard checking constraints to avoid empty arrays
      if (finalMediaUrlsArray.length === 0) {
        throw new Error("Media payload verification drop: Zero persistent URL links verified.");
      }

      // Convert structural features input to array segments via comma trimming criteria
      const featuresArrayCompiled = formData.features
        .split(',')
        .map(feat => feat.trim())
        .filter(feat => feat !== "");

      const hackPayloadObject = {
        title: formData.title,
        description: formData.description,
        originalPrice: Number(formData.originalPrice),
        sellingPrice: Number(formData.sellingPrice),
        downloadUrl: formData.downloadUrl,
        password: formData.password,
        features: featuresArrayCompiled,
        images: finalMediaUrlsArray, // Full URLs array vector for Flipkart slider conversion
        updatedAt: Date.now()
      };

      if (isEditing) {
        // Execute targeting node overwrite script block inside Realtime Database
        const targetHackUpdateNodeRef = ref(db, `hacks/${editHackId}`);
        await update(targetHackUpdateNodeRef, hackPayloadObject);
        toast.success(`VIP Package "${formData.title}" updated successfully!`, { id: executionToastId });
      } else {
        // Append new operational listing context object entry
        const targetNewHackPushRef = push(ref(db, 'hacks')); //
        await set(targetNewHackPushRef, {
          ...hackPayloadObject,
          createdAt: Date.now() //
        });
        toast.success("New Advanced VIP configuration deployed successfully to global live servers!", { id: executionToastId });
      }

      // Flush form buffer vectors down to clean defaults
      resetFormEngineState();
    } catch (networkDeploymentError) {
      toast.error(`Deployment Interrupted: ${networkDeploymentError.message}`, { id: executionToastId });
    } finally {
      setIsProcessing(false);
    }
  };

  // 📝 STEP 3: Edit Trigger Phase - Hydrate Form Fields with Existing Database Records
  const loadTargetHackIntoEditMode = (hackNode) => {
    setIsEditing(true);
    setEditHackId(hackNode.id);
    setSavedImagesQueue(hackNode.images || [hackNode.imageUrl]);
    
    // Convert string array objects match back to text input interface
    const featuresReconstructedString = hackNode.features ? hackNode.features.join(', ') : '';

    setFormData({
      title: hackNode.title || '',
      description: hackNode.description || '',
      originalPrice: hackNode.originalPrice || hackNode.price || '',
      sellingPrice: hackNode.sellingPrice || hackNode.price || '',
      downloadUrl: hackNode.downloadUrl || '',
      password: hackNode.password || '',
      features: featuresReconstructedString
    });

    // Reset files upload temporary cache streams
    setSelectedFiles([]);
    setMediaPreviews([]);

    // Scroll display viewing focus smoothly back to operational control workbench dashboard
    if(formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // 🧹 Reset Dashboard State Engine Actions
  const resetFormEngineState = () => {
    setIsEditing(false);
    setEditHackId(null);
    setSavedImagesQueue([]);
    setSelectedFiles([]);
    setMediaPreviews([]);
    setFormData({
      title: '',
      description: '',
      originalPrice: '',
      sellingPrice: '',
      downloadUrl: '',
      password: '',
      features: ''
    });
  };

  // 🗑️ STEP 4: Absolute Anti-Garbage Storage Clean up & Database Purge Pipeline
  const handleListingPermanentPurge = async (hackIdToken, hackTitleText, fallbackMediaList) => {
    const executionConfirmationMessage = `CRITICAL WARNING:\nAre you absolutely authorized to permanently destroy "${hackTitleText}"?\n\nThis deployment operation will completely wipe out the listing and instantly scrub all physical file records from Supabase Cloud Storage repositories!`;
    
    if (window.confirm(executionConfirmationMessage)) {
      const deletionToastToken = toast.loading(`Executing storage space sweep matching asset indexes...`);
      
      try {
        // Phase A: Identify associated public links context array and sweep files out of server storage clusters
        if (fallbackMediaList && fallbackMediaList.length > 0) {
          console.log("Purge Sequence Active for Media Registry Nodes:", fallbackMediaList);
          await cleanUpStorageAssetsByUrls(fallbackMediaList); // Purge files systematically
        }

        // Phase B: Drop structural object mapping context entirely from Realtime cluster
        const targetDatabaseNodeRef = ref(db, `hacks/${hackIdToken}`); //
        await remove(targetDatabaseNodeRef); //
        
        toast.success("Ecosystem cleaned up. Target listings and media assets completely purged!", { id: deletionToastToken });
        
        // If the admin was editing the target node while calling deletion, reset panel mechanics
        if(editHackId === hackIdToken) {
          resetFormEngineState();
        }
      } catch (systemPurgeError) {
        toast.error(`Cleanup Sequence Dropped: ${systemPurgeError.message}`, { id: deletionToastToken });
      }
    }
  };

  // 🧹 Individual Target Array Asset Clear out inside Edit Runtime State
  const dropPersistentSavedImageNode = async (targetUrlString) => {
    if (savedImagesQueue.length <= 1 && selectedFiles.length === 0) {
      toast.error("Constraint Violation: Catalog listings require at least 1 verified media anchor link mapping!");
      return;
    }

    if(window.confirm("Do you want to permanently delete this single image from storage servers immediately?")) {
      const syncPurgeToast = toast.loading("Scrubbing cloud asset space...");
      try {
        // Call cleanup routine straight on server target index reference link
        await cleanUpStorageAssetsByUrls(targetUrlString); //
        const updatedQueue = savedImagesQueue.filter(url => url !== targetUrlString);
        setSavedImagesQueue(updatedQueue);
        
        // Update live state maps inside database nodes safely
        if(isEditing) {
          await update(ref(db, `hacks/${editHackId}`), { images: updatedQueue });
        }
        toast.success("Asset wiped out successfully!", { id: syncPurgeToast });
      } catch (err) {
        toast.error("Failed to alter remote storage layout mapping constraints.", { id: syncPurgeToast });
      }
    }
  };

  return (
    <div className="p-4 sm:p-8 w-full max-w-7xl mx-auto select-none" ref={formRef}>
      
      {/* 👑 MASTER HEADER CONTEXT REGISTRY SECTION */}
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center border-b border-white/5 pb-6 gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-wider flex items-center gap-3 uppercase">
            <Settings className="text-blue-500 animate-spin-slow" size={32} /> MASTER CATALOG CONTROL PANEL
          </h1>
          <p className="text-gray-400 mt-1 text-sm font-medium">
            Advanced inventory management studio. Synchronize pricing models, security parameters, and files instantly.
          </p>
        </div>
        <div className="bg-[#001233] px-5 py-3 rounded-2xl border border-white/10 font-mono text-xs shadow-inner flex items-center gap-2">
          NETWORK MATRIX INDEX LISTINGS: <span className="text-blue-400 font-black text-sm">{hacks.length}</span>
        </div>
      </div>

      {/* ⚡ GRID WORKBENCH WORKSPACE ASSEMBLY SYSTEM */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ==================== LEFT COLUMN: ADVANCED INPUT COMPLIANCE FORM ==================== */}
        <motion.div 
          initial={{ opacity: 0, x: -25 }} 
          animate={{ opacity: 1, x: 0 }} 
          className={`lg:col-span-5 glass-panel p-6 md:p-8 rounded-3xl border transition-all duration-300 relative ${
            isEditing ? 'border-amber-500/30 shadow-[0_0_40px_rgba(245,158,11,0.05)]' : 'border-blue-500/10'
          }`}
        >
          {/* Edit State Overlay Tracker Mode Ribbon Indicator */}
          {isEditing && (
            <div className="absolute top-0 right-8 -translate-y-1/2 bg-amber-500 text-[#0A1428] font-black text-[10px] uppercase tracking-widest px-4 py-1 rounded-full shadow-lg flex items-center gap-1">
              <RefreshCw size={10} className="animate-spin" /> EDIT WORKSPACE ACTIVE
            </div>
          )}

          <h2 className="text-xl font-black text-white mb-6 flex items-center gap-2 uppercase tracking-wide">
            {isEditing ? <Edit3 className="text-amber-400" size={20} /> : <Plus className="text-blue-400" size={20} />}
            {isEditing ? 'Modify Selected Configuration' : 'Inject VIP Storage Listing'}
          </h2>
          
          <form onSubmit={handleFormDeploymentGate} className="space-y-5">
            
            {/* Title Block input */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest">Configuration Title Label</label>
              <input type="text" name="title" value={formData.title} onChange={handleInputChange} placeholder="e.g. FUNCHI VIP CONFIG AUTOMATIC v1.4" required className="w-full bg-[#001233] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 font-medium outline-none transition-all" />
            </div>
            
            {/* Dual Complex Pricing Entry Fields Matrix layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                  <IndianRupee size={12} /> Catalog Base MRP (Original)
                </label>
                <input type="number" name="originalPrice" value={formData.originalPrice} onChange={handleInputChange} placeholder="e.g. 499" required className="w-full bg-[#001233] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 font-mono font-bold outline-none" />
              </div>
              <div className="space-y-1.5">
                <label className="block text-[11px] font-black text-blue-400 uppercase tracking-widest flex items-center gap-1">
                  <IndianRupee size={12} /> Actual Selling Cost
                </label>
                <input type="number" name="sellingPrice" value={formData.sellingPrice} onChange={handleInputChange} placeholder="e.g. 149" required className="w-full bg-[#001233] border border-white/10 rounded-xl px-4 py-3 text-sm text-emerald-400 focus:border-blue-500 font-mono font-bold outline-none" />
              </div>
            </div>

            {/* Heavy Distribution Asset Routing Target URL Box */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-black text-purple-400 uppercase tracking-widest flex items-center gap-1">
                <Link2 size={12} /> 2GB Max Distribution Endpoint Link (Download URL)
              </label>
              <input type="url" name="downloadUrl" value={formData.downloadUrl} onChange={handleInputChange} placeholder="e.g. https://mediafire.com/file/heavy-package-funchi.zip" required className="w-full bg-[#001233] border border-white/10 rounded-xl px-4 py-3 text-xs text-gray-300 focus:border-blue-500 outline-none font-mono" />
            </div>

            {/* Unique Dedicated File Protection Access Passcode */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-black text-amber-400 uppercase tracking-widest flex items-center gap-1">
                <Key size={12} /> Dedicated Locker Decryption Key (File Password)
              </label>
              <input type="text" name="password" value={formData.password} onChange={handleInputChange} placeholder="e.g. FUNCHI_VIP_SECURE_2026" required className="w-full bg-[#001233] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 font-mono font-bold outline-none" />
            </div>

            {/* Descriptions Meta Parameters Textarea */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest">Public Product Catalog Descriptor Summary</label>
              <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Brief breakdown summarizing core setting optimizations..." rows="2" className="w-full bg-[#001233] border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-300 focus:border-blue-500 outline-none resize-none h-20 leading-relaxed"></textarea>
            </div>

            {/* Technical Highlights Feature Items Array Separators */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                <FileText size={12} /> Bullet Deliverables Matrix (Comma Separated Features)
              </label>
              <textarea name="features" value={formData.features} onChange={handleInputChange} placeholder="Auto Headshot, 100% Main ID Anti-Ban, Zero Lag Engine, Smooth 90 FPS..." rows="2" className="w-full bg-[#001233] border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-300 focus:border-blue-500 outline-none resize-none h-16"></textarea>
            </div>

            {/* ==================== RE-ENGINEERED DRAG-DROP MEDIA COMPONENT ASSEMBLY ==================== */}
            <div className="space-y-2">
              <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest">Multiple Screenshot Media Catalog Matrix</label>
              
              {/* Existing persistent cloud files stream track controller view inside Edit Mode */}
              {isEditing && savedImagesQueue.length > 0 && (
                <div className="space-y-1.5 bg-amber-500/5 p-3 rounded-xl border border-amber-500/20">
                  <p className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Live Persistent Cloud Media Queue:</p>
                  <div className="flex flex-wrap gap-2">
                    {savedImagesQueue.map((urlLink, idx) => (
                      <div key={idx} className="w-14 h-11 rounded-lg overflow-hidden relative bg-black border border-white/10 group/saved">
                        <img src={urlLink} alt="Live Asset Index Link" className="w-full h-full object-cover" />
                        <button 
                          type="button"
                          onClick={() => dropPersistentSavedImageNode(urlLink)}
                          className="absolute inset-0 bg-red-600/90 text-white flex items-center justify-center opacity-0 group-hover/saved:opacity-100 transition-opacity"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Physical Input Stream Interface File Box */}
              <div className="relative">
                <input 
                  type="file" 
                  multiple 
                  accept="image/*" 
                  onChange={handleMediaSelection} 
                  className="hidden" 
                  id="catalog-batch-media-uploader" 
                />
                <label 
                  htmlFor="catalog-batch-media-uploader" 
                  className="flex flex-col items-center justify-center w-full h-28 bg-[#001233] border-2 border-dashed border-white/10 hover:border-blue-500 hover:bg-blue-900/5 rounded-2xl cursor-pointer transition-all p-4 group/upload"
                >
                  <UploadCloud size={28} className="text-gray-500 group-hover/upload:text-blue-400 mb-1 transition-colors" />
                  <span className="text-xs font-bold text-gray-400 group-hover/upload:text-white">Choose Product Screenshots</span>
                  <span className="text-[10px] text-gray-600 mt-0.5">Multi-selection protocol support up to 5MB files</span>
                </label>
              </div>

              {/* Local File Cache Previews Strip Elements */}
              {mediaPreviews.length > 0 && (
                <div className="flex gap-2 overflow-x-auto py-1 custom-scrollbar">
                  {mediaPreviews.map((previewBlobUrl, indexKey) => (
                    <div key={indexKey} className="w-16 h-12 rounded-xl overflow-hidden bg-black/50 border border-white/10 relative flex-shrink-0 group/preview">
                      <img src={previewBlobUrl} alt="Pending Pipeline preview cache" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => clearTargetMediaNode(indexKey)}
                        className="absolute top-0.5 right-0.5 p-0.5 bg-black/70 rounded-md text-red-400 hover:text-white transition-colors"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Interactive Master Action Control Launch Switches */}
            <div className="flex gap-3 pt-2">
              {isEditing && (
                <button
                  type="button"
                  onClick={resetFormEngineState}
                  className="bg-navy-800 border border-white/10 hover:bg-white/5 text-gray-400 hover:text-white px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all active:scale-95"
                >
                  Cancel
                </button>
              )}
              <button 
                type="submit" 
                disabled={isProcessing} 
                className={`flex-grow font-black py-4 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2 text-md shadow-lg ${
                  isEditing 
                    ? 'bg-amber-500 hover:bg-amber-400 text-[#0A1428] shadow-amber-500/20' 
                    : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30'
                }`}
              >
                {isProcessing ? (
                  <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <ShieldCheck size={18} />
                    {isEditing ? 'SYNCHRONIZE LIVE CHANGES' : 'DEPLOY CONFIGURATION STREAM'}
                  </>
                )}
              </button>
            </div>

          </form>
        </motion.div>

        {/* ==================== RIGHT COLUMN: ACTIVE SYSTEM INDEX AND ARCHIVE ==================== */}
        <div className="lg:col-span-7">
          <div className="glass-panel p-6 rounded-3xl min-h-[60vh] flex flex-col border border-white/5">
            <h2 className="text-xl font-black text-white mb-6 border-b border-white/10 pb-4 flex items-center gap-2 uppercase tracking-wide">
              <LayoutGrid className="text-blue-400" size={20} /> Operational Ecosystem Inventory
            </h2>

            {hacks.length === 0 ? (
              <div className="flex flex-col items-center justify-center my-auto text-center py-20">
                <HelpCircle size={48} className="text-gray-600 mb-3 animate-pulse" />
                <p className="text-gray-400 font-medium max-w-sm">
                  The active system catalog repository contains zero listing elements. Inject configurations to spawn nodes.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AnimatePresence>
                  {hacks.map((hackItem) => {
                    const fallbackArrayImages = hackItem.images || [hackItem.imageUrl];
                    return (
                      <motion.div 
                        key={hackItem.id}
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.92 }}
                        className={`bg-[#001233] rounded-2xl border overflow-hidden flex flex-col group transition-all duration-300 hover:border-white/10 shadow-lg ${
                          editHackId === hackItem.id ? 'ring-2 ring-amber-500/50 border-amber-500/50' : 'border-white/5'
                        }`}
                      >
                        {/* Catalog Visualization Cover Layer */}
                        <div className="h-36 w-full relative overflow-hidden bg-black/40">
                          <img 
                            src={fallbackArrayImages[0] || "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070"} 
                            alt="Ecosystem Thumbnail Snapshot" 
                            className="w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-500" 
                          />
                          
                          {/* Flipkart Financial Overview Discount Indicator Ring */}
                          <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-black text-emerald-400 border border-emerald-500/20 font-mono">
                            ₹{hackItem.sellingPrice || hackItem.price || 149}
                          </div>

                          {fallbackArrayImages.length > 1 && (
                            <div className="absolute top-3 right-3 bg-blue-600/80 backdrop-blur-md px-2 py-0.5 rounded text-[9px] font-black font-mono text-white">
                              📁 {fallbackArrayImages.length} IMAGES
                            </div>
                          )}
                        </div>
                        
                        {/* Structural Details Summary Content Elements */}
                        <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                          <div>
                            <h3 className="font-black text-white text-md tracking-wide truncate group-hover:text-blue-400 transition-colors uppercase">
                              {hackItem.title}
                            </h3>
                            <p className="text-xs text-gray-400 line-clamp-2 mt-1 leading-relaxed font-medium">
                              {hackItem.description || "No customized structural text summary compiled for this system file context node."}
                            </p>
                          </div>
                          
                          {/* Interactive Dual Engine Manipulation Trigger Buttons */}
                          <div className="grid grid-cols-2 gap-2 pt-1">
                            <button
                              onClick={() => loadTargetHackIntoEditMode(hackItem)}
                              className="bg-navy-700 hover:bg-navy-700 border border-white/10 text-gray-300 hover:text-amber-400 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-md"
                            >
                              <Edit3 size={14} /> Edit Mode
                            </button>
                            <button 
                              onClick={() => handleListingPermanentPurge(hackItem.id, hackItem.title, fallbackArrayImages)}
                              className="bg-red-500/5 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/10 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-md"
                            >
                              <Trash2 size={14} /> Purge Node
                            </button>
                          </div>
                        </div>

                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default PageAdminManageHacks;