// ComponentHackCard.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Zap, Shield, Crosshair, Percent, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ComponentHackCard = ({ hack }) => {
  const navigate = useNavigate();
  
  // 🛒 Buy Button Handler (User ko dynamic detail and payment screen par bhejege)
  const handleBuyClick = () => {
    navigate(`/user/buy/${hack.id}`); //
  };
  
  // 📸 Advanced Flipkart Media Fallback Selector Engine
  const targetCoverImage = hack.images && hack.images.length > 0 
    ? hack.images[0] 
    : (hack.imageUrl || "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070");

  // 📊 Dynamic Pricing and Discount Matrix Engine
  const coreMRP = Number(hack.originalPrice || hack.price || 499);
  const livePrice = Number(hack.sellingPrice || hack.price || 149);
  const standardDiscountRate = Math.round(((coreMRP - livePrice) / coreMRP) * 100);
  const displayDiscountBadge = standardDiscountRate > 0;

  return (
    <motion.div
      // 🚀 Advanced Motion Mechanics on Layout Mount & Mouse Hover
      initial={{ opacity: 0, scale: 0.95 }} //
      animate={{ opacity: 1, scale: 1 }} //
      whileHover={{ y: -8, scale: 1.02 }} //
      transition={{ duration: 0.3, type: 'spring', stiffness: 200 }} //
      className="relative flex flex-col bg-[#001233] rounded-2xl border border-white/10 overflow-hidden shadow-glass group select-none h-full" //
    >
      {/* 🔴 Premium Linear Glowing Top Border Effect */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-pureWhite to-blue-600 opacity-50 group-hover:opacity-100 transition-opacity duration-300"></div> {/* */}
    
      {/* 🖼️ Cover Image Viewport Layer */}
      <div className="relative h-48 w-full bg-navy-900 overflow-hidden border-b border-white/5"> {/* */}
        <img 
          src={targetCoverImage} 
          alt={hack.title} //
          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-500 group-hover:scale-110" //
        />
        
        {/* Dynamic Trust Factor badges */}
        <div className="absolute top-3 right-3 flex flex-col items-end gap-1.5">
          <span className="bg-green-500/20 border border-green-500/50 text-green-400 text-[10px] font-black uppercase px-2.5 py-1 rounded-full flex items-center gap-1 backdrop-blur-md shadow-md">
            <Shield size={10} /> SECURE 100% {/* */}
          </span>
          {displayDiscountBadge && (
            <span className="bg-blue-600 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded shadow-lg flex items-center font-mono">
              -{standardDiscountRate}%
            </span>
          )}
        </div>
      </div>
    
      {/* 📝 Card Core Content Body */}
      <div className="p-5 flex flex-col flex-grow justify-between space-y-4"> {/* */}
        
        {/* Title & Complex Price Matrix Header Layout */}
        <div className="space-y-2">
          <div className="flex justify-between items-start gap-2">
            <h3 className="text-lg font-black text-pureWhite flex items-center gap-2 uppercase tracking-wide truncate"> {/* */}
              <Crosshair size={18} className="text-blue-400 flex-shrink-0" /> {/* */}
              {hack.title} {/* */}
            </h3>
          </div>
          
          <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed font-medium"> {/* */}
            {hack.description} {/* */}
          </p>

          {/* Flipkart Embedded Pricing Scheme Row */}
          <div className="bg-[#0A1428]/60 p-2 rounded-xl border border-white/5 flex items-baseline justify-between px-3">
            <span className="text-[10px] font-bold text-gray-500 uppercase">Premium Value</span>
            <div className="flex items-center gap-2">
              {displayDiscountBadge && (
                <span className="text-gray-500 line-through text-xs font-mono font-bold">₹{coreMRP}</span>
              )}
              <span className="text-emerald-400 font-black text-xl font-mono">₹{livePrice}</span> {/* */}
            </div>
          </div>
        </div>

        {/* ⚙️ Core Deliverables Feature Grid Items */}
        <div className="space-y-1.5 flex-grow"> {/* */}
          {hack.features && hack.features.slice(0, 3).map((feature, index) => ( // Show safe layout constraints up to 3 parameters
            <div key={index} className="flex items-center gap-2 text-xs text-gray-300 font-medium"> {/* */}
              <CheckCircle size={14} className="text-blue-500 flex-shrink-0" /> {/* */}
              <span className="truncate">{feature}</span> {/* */}
            </div>
          ))}
        </div>

        {/* 🛒 Operational Action Click Gateway */}
        <button 
          onClick={handleBuyClick} //
          className="w-full mt-auto relative overflow-hidden bg-white text-[#0A1428] font-black text-sm py-3 rounded-xl transition-all duration-300 hover:bg-gray-100 hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] active:scale-95 flex items-center justify-center gap-2 uppercase tracking-wider" //
        >
          <Zap size={16} className="fill-current" /> {/* */}
          GET VIP TERMINAL ACCESS
        </button>

      </div> 
    </motion.div>
  );
};

export default ComponentHackCard;
