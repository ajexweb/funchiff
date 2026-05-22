import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ref, onValue } from 'firebase/database';
import { db } from './firebase.js';
import { Users, Search, Award, TrendingUp, ShieldAlert, Mail } from 'lucide-react';

const PageAdminUsers = () => {
  const [userStats, setUserStats] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  
  // 🚀 ADVANCED: Data Aggregation Engine
  // यह फंक्शन सारे पेमेंट्स को पढ़ेगा और हर यूज़र का एक 'रिपोर्ट कार्ड' बनाएगा
  useEffect(() => {
    const paymentsRef = ref(db, 'payments');
    
    const unsubscribe = onValue(paymentsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const usersMap = {};
        
        // डेटाबेस के हर एक पेमेंट को चेक करो
        Object.keys(data).forEach(key => {
          const payment = data[key];
          const uid = payment.userId;
          
          // अगर यूज़र मैप में नहीं है, तो उसका नया खाता खोलो
          if (!usersMap[uid]) {
            usersMap[uid] = {
              uid: uid,
              email: payment.userEmail,
              totalOrders: 0,
              totalSpent: 0,
              approvedOrders: 0,
              lastActive: payment.timestamp
            };
          }
          
          // यूज़र के खाते में डिटेल्स अपडेट करो
          usersMap[uid].totalOrders += 1;
          
          if (payment.status === 'approved') {
            usersMap[uid].approvedOrders += 1;
            usersMap[uid].totalSpent += Number(payment.price || 0);
          }
          
          // लेटेस्ट एक्टिविटी टाइम सेट करो
          if (payment.timestamp > usersMap[uid].lastActive) {
            usersMap[uid].lastActive = payment.timestamp;
          }
        });
        
        // मैप को वापस Array में बदलो ताकि टेबल में दिखा सकें
        const usersArray = Object.values(usersMap);
        
        // सबसे ज़्यादा पैसे खर्च करने वाले (VIPs) सबसे ऊपर दिखेंगे
        usersArray.sort((a, b) => b.totalSpent - a.totalSpent);
        
        setUserStats(usersArray);
      } else {
        setUserStats([]);
      }
      setIsLoading(false);
    });
    
    return () => unsubscribe();
  }, []);
  
  // 🔍 Smart Search Filter
  const filteredUsers = userStats.filter(user =>
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.uid.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // 🏆 VIP Logic: जिसने ₹500 से ज़्यादा खर्च किए वो VIP
  const VIP_THRESHOLD = 500;
  
  return (
    <div className="p-4 sm:p-8 w-full max-w-7xl mx-auto">
      
      {/* 👑 Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-pureWhite flex items-center gap-3">
            <Users className="text-blue-500" size={32} /> GAMER DATABASE
          </h1>
          <p className="text-gray-400 mt-1">Track your customers, their purchases, and VIP status.</p>
        </div>

        {/* 🔍 Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by Email or UID..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#001233]/80 border border-white/10 text-white rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-glass"
          />
        </div>
      </div>

      {/* 📊 Top Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-panel p-6 rounded-2xl border-l-4 border-blue-500">
          <p className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-2 flex items-center gap-2"><Users size={16}/> Total Customers</p>
          <h3 className="text-3xl font-black text-pureWhite">{userStats.length}</h3>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-panel p-6 rounded-2xl border-l-4 border-yellow-500">
          <p className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-2 flex items-center gap-2"><Award size={16}/> VIP Gamers</p>
          <h3 className="text-3xl font-black text-pureWhite">
            {userStats.filter(u => u.totalSpent >= VIP_THRESHOLD).length}
          </h3>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-panel p-6 rounded-2xl border-l-4 border-green-500">
          <p className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-2 flex items-center gap-2"><TrendingUp size={16}/> Top Spender Total</p>
          <h3 className="text-3xl font-black text-pureWhite flex items-center gap-1">
            ₹{userStats.length > 0 ? userStats[0].totalSpent : 0}
          </h3>
        </motion.div>
      </div>

      {/* 📋 Users Data Table */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="w-12 h-12 border-4 border-[#001233] border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-panel rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#001233] text-gray-300 text-xs uppercase tracking-wider border-b border-white/10">
                  <th className="p-5 font-bold">Gamer Profile</th>
                  <th className="p-5 font-bold text-center">Total Requests</th>
                  <th className="p-5 font-bold text-center">Approved Hacks</th>
                  <th className="p-5 font-bold text-right">Total Spent</th>
                  <th className="p-5 font-bold text-center">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-10 text-center text-gray-500">
                      <ShieldAlert size={40} className="mx-auto mb-3 opacity-50" />
                      No users found matching "{searchQuery}"
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user, index) => (
                    <motion.tr 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      key={user.uid} 
                      className="border-b border-white/5 hover:bg-white/5 transition-colors group"
                    >
                      <td className="p-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold uppercase shadow-inner">
                            {user.email.charAt(0)}
                          </div>
                          <div>
                            <p className="text-pureWhite font-bold flex items-center gap-2">
                              {user.email} 
                              {user.totalSpent >= VIP_THRESHOLD && <Award size={14} className="text-yellow-400" title="VIP Gamer" />}
                            </p>
                            <p className="text-xs text-gray-500 font-mono mt-0.5">UID: {user.uid.substring(0, 8)}...</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-5 text-center text-gray-400 font-bold">{user.totalOrders}</td>
                      <td className="p-5 text-center text-green-400 font-bold">{user.approvedOrders}</td>
                      <td className="p-5 text-right">
                        <span className="bg-green-500/10 text-green-400 px-3 py-1.5 rounded-lg font-mono font-bold border border-green-500/20">
                          ₹{user.totalSpent}
                        </span>
                      </td>
                      <td className="p-5 text-center">
                        {user.totalSpent >= VIP_THRESHOLD ? (
                          <span className="inline-flex items-center gap-1 bg-gradient-to-r from-yellow-600/20 to-yellow-400/20 text-yellow-400 text-xs font-black uppercase px-3 py-1 rounded-full border border-yellow-500/40 shadow-[0_0_10px_rgba(250,204,21,0.2)]">
                            <Award size={12} /> VIP
                          </span>
                        ) : (
                          <span className="bg-gray-500/10 text-gray-400 text-xs font-bold uppercase px-3 py-1 rounded-full border border-gray-500/20">
                            Standard
                          </span>
                        )}
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default PageAdminUsers;