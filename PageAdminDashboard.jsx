import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ref, onValue } from 'firebase/database';
import { db } from './firebase.js';
import { 
  IndianRupee, Users, Clock, Gamepad2, 
  TrendingUp, Activity, PlusCircle, CreditCard 
} from 'lucide-react';

const PageAdminDashboard = () => {
  // 📊 Analytics States
  const [stats, setStats] = useState({
    totalRevenue: 0,
    uniqueUsers: 0,
    pendingRequests: 0,
    totalHacks: 0
  });
  
  const [recentActivity, setRecentActivity] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 🚀 ADVANCED: Multi-Node Data Fetching (दिमाग का काम)
  useEffect(() => {
    const paymentsRef = ref(db, 'payments');
    const hacksRef = ref(db, 'hacks');

    // 1. Fetching Payments Data
    const unsubPayments = onValue(paymentsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const paymentsArray = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        
        let revenue = 0;
        let pending = 0;
        const usersSet = new Set(); // Unique Users ढूँढने के लिए Set का यूज़

        paymentsArray.forEach(payment => {
          if (payment.status === 'approved') {
            revenue += Number(payment.price || 0);
          }
          if (payment.status === 'pending') {
            pending += 1;
          }
          usersSet.add(payment.userId); // सिर्फ यूनिक यूज़र्स को गिनेगा
        });

        // Recent 5 Activities (लेटेस्ट सबसे ऊपर)
        const sortedActivity = paymentsArray.sort((a, b) => b.timestamp - a.timestamp).slice(0, 5);

        setStats(prev => ({ ...prev, totalRevenue: revenue, pendingRequests: pending, uniqueUsers: usersSet.size }));
        setRecentActivity(sortedActivity);
      }
    });

    // 2. Fetching Hacks Data
    const unsubHacks = onValue(hacksRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setStats(prev => ({ ...prev, totalHacks: Object.keys(data).length }));
      }
      setIsLoading(false);
    });

    // Cleanup
    return () => {
      unsubPayments();
      unsubHacks();
    };
  }, []);

  // 🃏 Stat Card Component
  const StatCard = ({ title, value, icon, color, delay }) => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
      className={`glass-panel p-6 rounded-2xl border-l-4 ${color} relative overflow-hidden group`}
    >
      <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity group-hover:scale-110 duration-500">
        {icon}
      </div>
      <p className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-2">{title}</p>
      <h3 className="text-3xl font-black text-pureWhite">{value}</h3>
    </motion.div>
  );

  if (isLoading) return <div className="min-h-screen bg-[#0A1428] flex items-center justify-center"><div className="w-12 h-12 border-4 border-t-blue-500 rounded-full animate-spin"></div></div>;

  return (
    <div className="p-4 sm:p-8 w-full max-w-7xl mx-auto">
      
      {/* 👑 Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-pureWhite flex items-center gap-3">
            <Activity className="text-blue-500" size={32} /> ADMIN HEADQUARTERS
          </h1>
          <p className="text-gray-400 mt-1">Live overview of your Funchi FF Empire.</p>
        </div>
        
        {/* Quick Action Buttons */}
        <div className="flex gap-3">
          <Link to="/admin/hacks" className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all shadow-lg active:scale-95">
            <PlusCircle size={18} /> Upload Hack
          </Link>
          <Link to="/admin/payments" className="bg-[#001233] border border-white/10 hover:bg-white/5 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all shadow-lg active:scale-95">
            <CreditCard size={18} /> Approvals
            {stats.pendingRequests > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full animate-pulse">{stats.pendingRequests}</span>
            )}
          </Link>
        </div>
      </div>

      {/* 📊 The 4 Power Cards (Grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard delay={0.1} title="Total Revenue" value={`₹${stats.totalRevenue}`} icon={<IndianRupee size={64} />} color="border-green-500" />
        <StatCard delay={0.2} title="Active Gamers" value={stats.uniqueUsers} icon={<Users size={64} />} color="border-blue-500" />
        <StatCard delay={0.3} title="Pending Approvals" value={stats.pendingRequests} icon={<Clock size={64} />} color="border-yellow-500" />
        <StatCard delay={0.4} title="VIP Files Online" value={stats.totalHacks} icon={<Gamepad2 size={64} />} color="border-purple-500" />
      </div>

      {/* 📡 Live Radar (Recent Activity) */}
      <div className="glass-panel p-6 rounded-3xl border border-white/5 shadow-2xl">
        <h3 className="text-xl font-bold text-pureWhite mb-6 flex items-center gap-2 border-b border-white/10 pb-4">
          <TrendingUp className="text-blue-400" /> Live Radar (Recent Activity)
        </h3>
        
        <div className="space-y-4">
          {recentActivity.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No recent activity detected.</p>
          ) : (
            recentActivity.map((activity, index) => (
              <motion.div 
                key={activity.id} 
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 bg-[#001233]/50 rounded-xl border border-white/5 hover:border-white/10 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-full ${activity.status === 'approved' ? 'bg-green-500/20 text-green-400' : activity.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>
                    <IndianRupee size={20} />
                  </div>
                  <div>
                    <p className="text-pureWhite font-bold">{activity.userEmail}</p>
                    <p className="text-sm text-gray-400">Purchased: <span className="text-blue-400">{activity.hackTitle}</span> (₹{activity.price})</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-xs font-bold uppercase tracking-wider ${activity.status === 'approved' ? 'text-green-400' : activity.status === 'pending' ? 'text-yellow-400' : 'text-red-400'}`}>
                    {activity.status}
                  </span>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PageAdminDashboard;