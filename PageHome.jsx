import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Crosshair, Zap, Shield, ChevronRight } from 'lucide-react';
import { useAuth } from './AuthContext.jsx';

const PageHome = () => {
  const { currentUser, role } = useAuth();
  
  return (
    <div className="min-h-screen bg-[#0A1428] flex flex-col items-center relative overflow-hidden">
      
      {/* 🌌 Background Glow Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none"></div>

      {/* 🚀 Hero Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center flex flex-col items-center mt-10">
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-bold mb-8 backdrop-blur-md"
        >
          <Zap size={16} className="text-yellow-400" />
          The Ultimate Free Fire Max Setup
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl font-black text-pureWhite tracking-tight mb-6"
        >
          DOMINATE WITH <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300 drop-shadow-[0_0_20px_rgba(96,165,250,0.3)]">
            FUNCHI FF
          </span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl text-lg md:text-xl text-gray-400 mb-10 leading-relaxed"
        >
          Get premium VIP sensitivity settings, custom HUD layouts, and drag headshot files specifically optimized for your device. 100% Safe & Secure.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 w-full justify-center"
        >
          {!currentUser ? (
            <Link 
              to="/login" 
              className="group relative flex items-center justify-center gap-2 px-8 py-4 bg-pureWhite text-[#0A1428] rounded-xl font-black text-lg overflow-hidden transition-all hover:scale-105 shadow-[0_0_30px_rgba(255,255,255,0.2)]"
            >
              GET STARTED
              <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          ) : (
            <Link 
              to={role === 'admin' ? "/admin/dashboard" : "/user/dashboard"} 
              className="group relative flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 text-pureWhite rounded-xl font-black text-lg hover:bg-blue-500 transition-all hover:scale-105 shadow-[0_0_30px_rgba(37,99,235,0.4)]"
            >
              GO TO DASHBOARD
              <LayoutDashboard size={20} />
            </Link>
          )}
        </motion.div>
      </div>

      {/* 🎯 Features Grid */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: <Crosshair size={32} className="text-blue-400" />, title: "Auto Drag Headshot", desc: "Perfect sensitivity settings for guaranteed red numbers." },
            { icon: <Shield size={32} className="text-green-400" />, title: "100% Anti-Ban", desc: "Our files are tested and secure. Your main ID is completely safe." },
            { icon: <Zap size={32} className="text-yellow-400" />, title: "Zero Lag Config", desc: "Optimized configurations for smooth 60fps/90fps gameplay." }
          ].map((feature, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 + (idx * 0.1) }}
              className="glass-panel p-8 rounded-2xl border border-white/5 hover:border-blue-500/30 transition-colors group"
            >
              <div className="mb-4 p-4 bg-[#001233] inline-block rounded-xl group-hover:scale-110 transition-transform shadow-inner">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-pureWhite mb-2">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default PageHome;