import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Zap, Shield, Crosshair } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ComponentHackCard = ({ hack }) => {
  const navigate = useNavigate();
  
  // 🛒 Buy Button Handler (यूज़र को पेमेंट पेज पर ले जाएगा)
  const handleBuyClick = () => {
    navigate(`/user/buy/${hack.id}`);
  };
  
  return (
    <motion.div
      // 🚀 Advanced Framer Motion Animation on Mount & Hover
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3, type: 'spring', stiffness: 200 }}
      className="relative flex flex-col bg-[#001233] rounded-2xl border border-white/10 overflow-hidden shadow-glass group"
    >
      {/* 🔴 Glowing Top Border Effect */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-pureWhite to-blue-600 opacity-50 group-hover:opacity-100 transition-opacity duration-300"></div>
    
    { /* 🖼️ Cover Image */ }
    <div className="relative h-48 w-full bg-navy-900 overflow-hidden border-b border-white/5">
        <img 
          src={hack.imageUrl || "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop"} 
          alt={hack.title} 
          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-500 group-hover:scale-110"
        />
        {/* Status Badge */}
        <div className="absolute top-3 right-3 bg-green-500/20 border border-green-500/50 text-green-400 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 backdrop-blur-sm">
          <Shield size={12} /> Safe 100%
        </div>
      </div>
    
    { /* 📝 Card Content */ }
    <div className="p-6 flex flex-col flex-grow">
        
        {/* Title & Price Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-pureWhite flex items-center gap-2">
              <Crosshair size={20} className="text-blue-400" />
              {hack.title}
            </h3>
            <p className="text-sm text-gray-400 mt-1 line-clamp-2">
              {hack.description}
            </p>
          </div>
          <div className="bg-pureWhite/10 border border-pureWhite/20 px-3 py-1.5 rounded-lg text-pureWhite font-black text-lg">
            ₹{hack.price}
          </div>
        </div>

        {/* ⚙️ Features List */}
        <div className="space-y-2 mb-6 flex-grow">
          {hack.features && hack.features.map((feature, index) => (
            <div key={index} className="flex items-center gap-2 text-sm text-gray-300">
              <CheckCircle size={16} className="text-blue-500" />
              <span>{feature}</span>
            </div>
          ))}
        </div>

        {/* 🛒 Action Button */}
        <button 
          onClick={handleBuyClick}
          className="w-full mt-auto relative overflow-hidden bg-pureWhite text-[#0A1428] font-black text-lg py-3 rounded-xl transition-all duration-300 hover:bg-gray-200 hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] active:scale-95 flex items-center justify-center gap-2"
        >
          <Zap size={20} />
          BUY NOW
        </button>

      </div> <
    /motion.div>
  );
};

export default ComponentHackCard;