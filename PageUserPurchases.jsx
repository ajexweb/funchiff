// PageUserPurchases.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ref, query, orderByChild, equalTo, onValue } from 'firebase/database';
import { db } from './firebase.jsx'; // Flat Structure Firebase Cluster Instance
import { useAuth } from './AuthContext.jsx'; // Core Security clearance context
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
  ShoppingBag, Clock, CheckCircle2, XCircle, Download, 
  Key, ArrowRight, Copy, Check, ShieldAlert, AlertCircle, Sparkles 
} from 'lucide-react';

const PageUserPurchases = () => {
  const { currentUser } = useAuth(); //
  const [purchases, setPurchases] = useState([]);
  const [hacksData, setHacksData] = useState({}); // Dynamic cross-reference matrix dictionary
  const [isLoading, setIsLoading] = useState(true);
  
  // 📋 Clipboard State Tracker Vector
  const [copiedId, setCopiedId] = useState(null);

  // 🎉 Pure SVG/Framer-Motion Celebration Effect State (No npm package dependency to prevent build breaks)
  const [showCelebration, setShowCelebration] = useState(false);
  const [unlockedItemTitle, setUnlockedItemTitle] = useState('');
  
  // 🛡️ Reference pointer to monitor real-time node transitions (Pending -> Approved)
  const previousPurchasesStateRef = useRef([]);

  // 📡 STEP 1: Global Real-time Listener for Hacks Catalog to cross-reference file vectors
  useEffect(() => {
    const hacksCatalogRef = ref(db, 'hacks');
    const unsubscribeHacks = onValue(hacksCatalogRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setHacksData(data);
      }
    });

    return () => unsubscribeHacks();
  }, []);

  // 📡 STEP 2: Secure User-Isolated Real-time Purchase Tracking Engine
  useEffect(() => {
    if (!currentUser) return; //
    
    const paymentsRef = ref(db, 'payments'); //
    const userPurchasesQuery = query(paymentsRef, orderByChild('userId'), equalTo(currentUser.uid)); //
    
    const unsubscribePurchases = onValue(userPurchasesQuery, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const purchasesArray = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        
        const freshOrderedData = purchasesArray.reverse(); // Latest transaction node on top layer

        // ⚡ ADVANCED TELEMETRY DETECTOR: Check if any item state transitioned from 'pending' to 'approved'
        if (previousPurchasesStateRef.current.length > 0) {
          freshOrderedData.forEach(newRecord => {
            const olderMatchingRecord = previousPurchasesStateRef.current.find(oldRec => oldRec.id === newRecord.id);
            
            if (olderMatchingRecord && olderMatchingRecord.status === 'pending' && newRecord.status === 'approved') {
              // Trigger instant high-fidelity live audio-visual celebration workflow!
              setUnlockedItemTitle(newRecord.hackTitle);
              setShowCelebration(true);
              toast.success(`🎉 BOOM! Your purchase for "${newRecord.hackTitle}" has been verified live!`, { duration: 5000 });
            }
          });
        }

        // Cache persistent state records inside ref pointer coordinates
        previousPurchasesStateRef.current = freshOrderedData;
        setPurchases(freshOrderedData);
      } else {
        setPurchases([]);
      }
      setIsLoading(false); //
    });
    
    return () => unsubscribePurchases();
  }, [currentUser]);
  
  // 📋 Copy Password to Clipboard Command Controller
  const handlePasscodeClipboardCopy = (passcodeString, idKey) => {
    navigator.clipboard.writeText(passcodeString);
    setCopiedId(idKey);
    toast.success("Security passcode copied to context clipboard!");
    setTimeout(() => setCopiedId(null), 2500); // Clear visualization indicator
  };

  // 📥 Secure Heavy File Redirection Interceptor Logic
  const executeSecureDistributionRedirect = (targetUrl) => {
    if (!targetUrl || targetUrl === "#") {
      toast.error("Distribution overhead error: Download endpoint not loaded yet.");
      return;
    }
    window.open(targetUrl, "_blank", "noopener,noreferrer");
  };

  // 🚦 Advanced Realtime Traffic Light Status Engine UI
  const getStatusUI = (status) => {
    switch (status) { //
      case 'approved': //
        return { 
          color: 'text-green-400', 
          bg: 'bg-green-500/10', 
          border: 'border-green-500/30', 
          icon: <CheckCircle2 size={18} />, 
          text: 'Approved & Unlocked' //
        };
      case 'rejected': //
        return { 
          color: 'text-red-400', 
          bg: 'bg-red-500/10', 
          border: 'border-red-500/30', 
          icon: <XCircle size={18} />, 
          text: 'Payment Rejected' //
        };
      default:
        return { 
          color: 'text-yellow-400', 
          bg: 'bg-yellow-500/10', 
          border: 'border-yellow-500/30', 
          icon: <Clock size={18} className="animate-spin" />, //
          text: 'Verification Pending' 
        };
    }
  };
  
  return (
    <div className="min-h-screen bg-[#0A1428] pt-8 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* 🌌 High-End Ambient Background Aesthetic Grids */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-600/5 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-[-5%] left-[-5%] w-[450px] h-[450px] bg-blue-600/5 rounded-full blur-[140px] pointer-events-none"></div>

      {/* ==================== PURE SVG CELEBRATION UNLOCK OVERLAY SYSTEM ==================== */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
          >
            {/* Sparkles Particle Stream Burst Animation Effect Mapping */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {[...Array(20)].map((_, idx) => (
                <motion.div
                  key={idx}
                  initial={{ 
                    opacity: 1, 
                    x: "50% riots", 
                    y: "50% view", 
                    scale: Math.random() * 0.4 + 0.6 
                  }}
                  animate={{ 
                    x: `${Math.random() * 100 - 50}vw`, 
                    y: `${Math.random() * 100 - 50}vh`, 
                    opacity: 0,
                    rotation: Math.random() * 360 
                  }}
                  transition={{ duration: 2.5, ease: "easeOut" }}
                  className="absolute top-1/2 left-1/2 text-yellow-400"
                >
                  <Sparkles size={24} className="fill-current" />
                </motion.div>
              ))}
            </div>

            <motion.div 
              initial={{ scale: 0.8, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 30 }}
              className="glass-panel max-w-md w-full p-8 rounded-3xl border border-green-500/40 text-center space-y-6 relative shadow-2xl"
            >
              <div className="w-20 h-20 bg-green-500/20 border border-green-500/40 text-green-400 rounded-full flex items-center justify-center mx-auto shadow-lg animate-pulse">
                <Sparkles size={40} className="fill-current" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-black text-white uppercase tracking-tight">VIP System Unlocked!</h2>
                <p className="text-gray-400 text-sm font-medium">
                  Ajay Bhai authorization server validated your payment parameter logs. Your custom file matrix is primed.
                </p>
                <div className="bg-[#001233] p-3 rounded-xl border border-white/5 font-mono text-xs font-black text-blue-400 uppercase tracking-wider truncate mt-3">
                  {unlockedItemTitle}
                </div>
              </div>
              <button 
                onClick={() => setShowCelebration(false)}
                className="w-full bg-white text-[#0A1428] font-black text-sm py-3.5 rounded-xl uppercase tracking-widest shadow-lg hover:bg-gray-100 transition-all active:scale-95"
              >
                Access My Locker Inventory
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* Page Main Header Meta block */}
        <div className="mb-10 border-b border-white/5 pb-6">
          <h1 className="text-3xl font-black text-pureWhite flex items-center gap-3 uppercase tracking-wider">
            <ShoppingBag className="text-blue-400" size={32} /> CRYPTO LOCKER INVENTORY // MY PURCHASES
          </h1>
          <p className="text-gray-400 mt-2 text-sm font-medium">
            Track validation logs, display merchant status queues, and access high-capacity 2GB distribution endpoints.
          </p>
        </div>

        {isLoading ? ( //
          <div className="flex justify-center py-20">
            <div className="w-14 h-14 border-4 border-[#001233] border-t-blue-500 rounded-full animate-spin shadow-glass"></div>
          </div>
        ) : (
          <>
            {/* ❌ Absolute Empty State View */}
            {purchases.length === 0 ? ( //
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-panel p-12 text-center rounded-3xl border border-white/5 shadow-2xl">
                <div className="w-24 h-24 bg-[#001233] rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner border border-white/5">
                  <ShoppingBag size={40} className="text-gray-600" />
                </div>
                <h3 className="text-2xl font-bold text-pureWhite mb-2 uppercase tracking-tight">Your Personal Locker is Vacant</h3>
                <p className="text-gray-400 mb-8 max-w-sm mx-auto text-sm font-medium leading-relaxed">
                  You have not initialized any merchant transaction logs inside Funchi FF network core. Acquire a premium profile node to populate your grid.
                </p>
                <Link to="/user/dashboard" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-black py-3.5 px-8 rounded-xl transition-all hover:scale-105 shadow-[0_0_20px_rgba(37,99,235,0.4)] uppercase tracking-wider text-sm">
                  Initialize Store Node <ArrowRight size={18} />
                </Link>
              </motion.div>
            ) : (
              /* 📦 List of Purchases Map */
              <div className="space-y-6">
                <AnimatePresence>
                  {purchases.map((purchase, index) => {
                    const statusUI = getStatusUI(purchase.status); //
                    const isApproved = purchase.status === 'approved'; //
                    const isRejected = purchase.status === 'rejected';

                    // Extract active dynamic specifications mapped from live catalog dictionary context matching key id
                    const associatedCatalogNode = hacksData[purchase.hackId] || {};
                    const workingDownloadLink = associatedCatalogNode.downloadUrl || purchase.downloadUrl || "#";
                    const dynamicPasscodeDecrypted = associatedCatalogNode.password || purchase.password || "DECRYPT_ERROR";

                    return (
                      <motion.div 
                        key={purchase.id} //
                        initial={{ opacity: 0, x: -25 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`glass-panel p-6 rounded-3xl border transition-all duration-300 relative overflow-hidden ${
                          isApproved 
                            ? 'border-green-500/20 bg-gradient-to-br from-[#001233]/40 via-[#0A1428] to-[#0A1428] shadow-[0_0_30px_rgba(34,197,94,0.03)]' 
                            : isRejected 
                            ? 'border-red-500/20 bg-gradient-to-br from-red-950/5 via-[#0A1428] to-[#0A1428]'
                            : 'border-white/5'
                        }`}
                      >
                        {/* Status context layout row */}
                        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 border-b border-white/5 pb-4 mb-4">
                          <div>
                            <span className="text-[10px] font-mono font-black text-blue-500 uppercase tracking-widest block mb-0.5">SECURE PAY_NODE ID: {purchase.id.substring(1, 10).toUpperCase()}</span>
                            <h3 className="text-xl font-black text-pureWhite uppercase tracking-wide">{purchase.hackTitle}</h3> {/* */}
                            <div className="flex items-center gap-4 mt-1">
                              <p className="text-xs font-mono text-gray-500 font-bold">BANK UTR: <span className="text-gray-400 font-bold">{purchase.utrNumber}</span></p> {/* */}
                              <p className="text-xs font-mono text-gray-500 font-bold">VALUE: <span className="text-emerald-400 font-black">₹{purchase.price}</span></p>
                            </div>
                          </div>
                          <div className={`px-4 py-2 rounded-xl flex items-center gap-2 font-black text-xs uppercase tracking-wider border backdrop-blur-md ${statusUI.bg} ${statusUI.color} ${statusUI.border}`}>
                            {statusUI.icon} {statusUI.text} {/* */}
                          </div>
                        </div>

                        {/* ==================== CONDITION DATA RENDERING CORE HUB ==================== */}
                        {isApproved ? ( //
                          /* 🔓 PREMIUM UNLOCKED MODE: Real working Download and Dynamic Key components */
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.98 }} 
                            animate={{ opacity: 1, scale: 1 }} 
                            className="bg-[#001233]/40 p-5 rounded-2xl border border-green-500/20 space-y-4"
                          >
                            <div className="flex items-center gap-2 text-green-400 text-xs font-black uppercase tracking-wider animate-pulse">
                              <Sparkles size={14} className="fill-current" /> Authorization verification cleared! Media package ready for deployment.
                            </div>
                            
                            <div className="flex flex-col sm:flex-row gap-4">
                              {/* 2GB file stream redirect handle button */}
                              <button 
                                type="button"
                                onClick={() => executeSecureDistributionRedirect(workingDownloadLink)}
                                className="flex-1 bg-white text-[#0A1428] font-black py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] active:scale-[0.98] uppercase tracking-wider text-sm"
                              >
                                <Download size={18} /> DOWNLOAD CONFIG SYSTEM
                              </button>
                              
                              {/* Decryption Code controller interface row with copy mechanism */}
                              <div className="flex-1 bg-[#0A1428] border border-white/10 p-3 rounded-xl flex items-center justify-between shadow-inner">
                                <div className="flex items-center gap-2 text-gray-400 text-xs font-black uppercase tracking-wider">
                                  <Key size={14} className="text-yellow-500 fill-yellow-500/20" /> Decryption Key:
                                </div>
                                <div className="flex items-center gap-3">
                                  <span className="font-mono text-white font-black tracking-widest text-sm bg-[#001233] px-3 py-1 rounded-lg border border-white/5 shadow-md">
                                    {dynamicPasscodeDecrypted}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handlePasscodeClipboardCopy(dynamicPasscodeDecrypted, purchase.id)}
                                    className={`p-2 rounded-lg transition-all active:scale-90 flex items-center justify-center border ${
                                      copiedId === purchase.id 
                                        ? 'bg-green-500/20 border-green-500/30 text-green-400' 
                                        : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
                                    }`}
                                  >
                                    {copiedId === purchase.id ? <Check size={14} /> : <Copy size={14} />}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ) : isRejected ? (
                          /* 🚫 ADVANCED REJECTION TRANSPARENCY HUB: Display comprehensive reason nodes */
                          <div className="bg-red-500/5 p-4 rounded-2xl border border-red-500/20 flex items-start gap-3">
                            <ShieldAlert className="text-red-400 flex-shrink-0 mt-0.5 animate-pulse" size={20} />
                            <div className="space-y-1">
                              <h5 className="text-xs font-black text-red-400 uppercase tracking-widest">Transaction Audit Rejection Log:</h5>
                              <p className="text-xs text-gray-300 font-medium leading-relaxed">
                                {purchase.rejectionReason || "Your document screenshot verification or bank UTR signature mapping failed structural confirmation validation routines. Submit correct transaction payload details."}
                              </p>
                            </div>
                          </div>
                        ) : (
                          /* ⏳ VERIFICATION PENDING HOLD BAR MODE */
                          <div className="bg-[#001233]/30 p-4 rounded-2xl border border-white/5 flex items-center justify-center gap-2.5 text-center">
                            <AlertCircle size={16} className="text-yellow-500/80 animate-pulse" />
                            <p className="text-xs text-gray-400 font-medium tracking-wide">
                              Data telemetry under tracking review context. Terminal access will safely unlock instantly once authorized by master nodes.
                            </p>
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PageUserPurchases;
