import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ref, query, orderByChild, equalTo, onValue } from 'firebase/database';
import { db } from './firebase.js';
import { useAuth } from './AuthContext.jsx';
import { Link } from 'react-router-dom';
import { ShoppingBag, Clock, CheckCircle2, XCircle, Download, Key, ArrowRight } from 'lucide-react';

const PageUserPurchases = () => {
  const { currentUser } = useAuth();
  const [purchases, setPurchases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // 🚀 ADVANCED: Secure Real-time Fetching (सिर्फ लॉगिन यूज़र का डेटा लाएगा)
  useEffect(() => {
    if (!currentUser) return;
    
    const paymentsRef = ref(db, 'payments');
    // Firebase Query: सिर्फ वो पेमेंट लाओ जहाँ userId इस गेमर का uid हो
    const userPurchasesQuery = query(paymentsRef, orderByChild('userId'), equalTo(currentUser.uid));
    
    const unsubscribe = onValue(userPurchasesQuery, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const purchasesArray = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        // लेटेस्ट पेमेंट सबसे ऊपर दिखाने के लिए Reverse कर रहे हैं
        setPurchases(purchasesArray.reverse());
      } else {
        setPurchases([]);
      }
      setIsLoading(false);
    });
    
    return () => unsubscribe();
  }, [currentUser]);
  
  // 🚦 Traffic Light UI Helper
  const getStatusUI = (status) => {
    switch (status) {
      case 'approved':
        return { color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/30', icon: <CheckCircle2 size={18} />, text: 'Approved & Unlocked' };
      case 'rejected':
        return { color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30', icon: <XCircle size={18} />, text: 'Payment Rejected' };
      default:
        return { color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', icon: <Clock size={18} className="animate-spin-slow" />, text: 'Verification Pending' };
    }
  };
  
  return (
    <div className="min-h-screen bg-[#0A1428] pt-8 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        
        <div className="mb-10">
          <h1 className="text-3xl font-black text-pureWhite flex items-center gap-3">
            <ShoppingBag className="text-blue-400" size={32} /> MY INVENTORY
          </h1>
          <p className="text-gray-400 mt-2">Track your payments and access your VIP settings here.</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-[#001233] border-t-blue-500 rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {/* ❌ Empty State */}
            {purchases.length === 0 ? (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-panel p-12 text-center rounded-3xl border border-white/5">
                <div className="w-24 h-24 bg-[#001233] rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                  <ShoppingBag size={40} className="text-gray-500" />
                </div>
                <h3 className="text-2xl font-bold text-pureWhite mb-2">Your Locker is Empty</h3>
                <p className="text-gray-400 mb-8 max-w-md mx-auto">You haven't purchased any premium Funchi FF settings yet. Get your first VIP file now to dominate the game!</p>
                <Link to="/user/dashboard" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-xl transition-all hover:scale-105 shadow-[0_0_20px_rgba(37,99,235,0.4)]">
                  Go to Store <ArrowRight size={18} />
                </Link>
              </motion.div>
            ) : (
              /* 📦 List of Purchases */
              <div className="space-y-6">
                <AnimatePresence>
                  {purchases.map((purchase, index) => {
                    const statusUI = getStatusUI(purchase.status);
                    const isApproved = purchase.status === 'approved';

                    return (
                      <motion.div 
                        key={purchase.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`glass-panel p-6 rounded-2xl border transition-all ${isApproved ? 'border-green-500/30 shadow-[0_0_20px_rgba(34,197,94,0.1)]' : 'border-white/10'}`}
                      >
                        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 border-b border-white/5 pb-4 mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-pureWhite">{purchase.hackTitle}</h3>
                            <p className="text-sm text-gray-500 mt-1">UTR: {purchase.utrNumber}</p>
                          </div>
                          <div className={`px-4 py-2 rounded-lg flex items-center gap-2 font-bold text-sm border ${statusUI.bg} ${statusUI.color} ${statusUI.border}`}>
                            {statusUI.icon} {statusUI.text}
                          </div>
                        </div>

                        {/* 🔓 The Magic Unlock (Conditional Rendering) */}
                        {isApproved ? (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="bg-gradient-to-r from-green-900/20 to-[#001233] p-5 rounded-xl border border-green-500/20">
                            <p className="text-green-400 text-sm font-bold mb-4">🎉 Payment Verified! Your files are ready.</p>
                            <div className="flex flex-col sm:flex-row gap-4">
                              <a href="#" className="flex-1 bg-pureWhite text-[#0A1428] font-black py-3 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-200 transition-all shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                                <Download size={18} /> DOWNLOAD CONFIG
                              </a>
                              <div className="flex-1 bg-[#0A1428] border border-white/10 p-3 rounded-lg flex items-center justify-between">
                                <div className="flex items-center gap-2 text-gray-400 text-sm">
                                  <Key size={16} className="text-yellow-500" /> Password:
                                </div>
                                <span className="font-mono text-pureWhite font-bold tracking-wider">FUNCHI2026</span>
                              </div>
                            </div>
                          </motion.div>
                        ) : (
                          <div className="bg-[#001233]/50 p-4 rounded-xl border border-white/5 text-center">
                            <p className="text-sm text-gray-400">
                              {purchase.status === 'rejected' 
                                ? "Your payment screenshot or UTR was invalid. Please contact support." 
                                : "Your files will be unlocked here automatically once the admin verifies your payment."}
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