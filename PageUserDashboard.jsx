import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Zap, PackageOpen, AlertCircle } from 'lucide-react';
import { ref, onValue } from 'firebase/database';
import { db } from './firebase.jsx'; // Flat Structure
import { useAuth } from './AuthContext.jsx';
import ComponentHackCard from './ComponentHackCard.jsx';

const PageUserDashboard = () => {
  const { currentUser } = useAuth();
  const [hacks, setHacks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // 🚀 ADVANCED: Real-time Firebase Listener
  useEffect(() => {
    const hacksRef = ref(db, 'hacks'); // 'hacks' नाम के फोल्डर से डेटा लाएगा
    
    // onValue 24/7 सुनता रहता है कि डेटाबेस में कुछ बदला क्या?
    const unsubscribe = onValue(hacksRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Firebase के Object डेटा को Array में बदल रहे हैं ताकि Map लगा सकें
        const hacksArray = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        setHacks(hacksArray);
      } else {
        setHacks([]); // अगर एडमिन ने सब डिलीट कर दिया
      }
      setIsLoading(false);
    });
    
    // क्लीनअप: जब यूज़र पेज बंद करेगा तो लिसनर बंद कर दो (Performance के लिए)
    return () => unsubscribe();
  }, []);
  
  // 🔍 Live Search Logic
  const filteredHacks = hacks.filter(hack =>
    hack.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    hack.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="min-h-screen bg-[#0A1428] pt-8 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* 🌌 Personalized Welcome Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-pureWhite flex items-center gap-2">
              VIP DASHBOARD <Zap className="text-yellow-400" size={32} />
            </h1>
            <p className="text-gray-400 mt-2 font-medium">
              Welcome back, <span className="text-blue-400">{currentUser?.email}</span>! Ready to dominate?
            </p>
          </div>

          {/* 🔍 Search Bar (Glassmorphism) */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search hacks..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#001233]/60 border border-white/10 text-white rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-inner"
            />
          </div>
        </motion.div>

        {/* 🔄 Loading State */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-[#001233] border-t-blue-500 rounded-full animate-spin shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>
            <p className="text-gray-400 mt-4 animate-pulse">Syncing with Funchi Servers...</p>
          </div>
        ) : (
          <>
            {/* ❌ Empty State (अगर कोई हैक नहीं मिला) */}
            {filteredHacks.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-panel p-12 flex flex-col items-center justify-center rounded-2xl text-center border border-dashed border-white/20"
              >
                <PackageOpen size={64} className="text-gray-500 mb-4" />
                <h3 className="text-2xl font-bold text-pureWhite mb-2">No Files Found</h3>
                <p className="text-gray-400 max-w-md">
                  {searchQuery ? "No settings match your search. Try a different name." : "Admin hasn't uploaded any VIP settings yet. Check back soon!"}
                </p>
              </motion.div>
            ) : (
              /* 📦 Grid of Hacks (Cards) */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredHacks.map((hack, index) => (
                  <motion.div
                    key={hack.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }} // एक-एक करके कार्ड आएंगे (Staggered Animation)
                  >
                    <ComponentHackCard hack={hack} />
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PageUserDashboard;