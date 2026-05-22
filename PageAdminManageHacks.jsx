import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ref, push, set, onValue, remove } from 'firebase/database';
import { db } from './firebase.jsx';
import toast from 'react-hot-toast';
import { Settings, Plus, Trash2, Image as ImageIcon, Crosshair, Package } from 'lucide-react';

const PageAdminManageHacks = () => {
  const [hacks, setHacks] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    imageUrl: '',
    features: '' // कॉमा (,) से अलग किए हुए फीचर्स
  });
  
  // 🚀 Fetch Existing Hacks
  useEffect(() => {
    const hacksRef = ref(db, 'hacks');
    const unsubscribe = onValue(hacksRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const hacksArray = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        setHacks(hacksArray.reverse());
      } else {
        setHacks([]);
      }
    });
    return () => unsubscribe();
  }, []);
  
  // 📝 Handle Form Input Changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  // 📤 Upload New Hack to Firebase
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.price || !formData.imageUrl) {
      toast.error("Please fill all the required fields!");
      return;
    }
    
    setIsUploading(true);
    const loadingToast = toast.loading("Deploying new VIP settings...");
    
    try {
      // Features को Array में बदलना (ताकि डिज़ाइन में बुलेट्स दिखें)
      const featuresArray = formData.features.split(',').map(f => f.trim()).filter(f => f !== "");
      
      const newHackRef = push(ref(db, 'hacks'));
      await set(newHackRef, {
        title: formData.title,
        description: formData.description,
        price: Number(formData.price),
        imageUrl: formData.imageUrl,
        features: featuresArray,
        createdAt: Date.now()
      });
      
      toast.success("VIP Hack uploaded successfully!", { id: loadingToast });
      
      // फॉर्म को खाली कर दो
      setFormData({ title: '', description: '', price: '', imageUrl: '', features: '' });
    } catch (error) {
      toast.error("Error uploading hack: " + error.message, { id: loadingToast });
    } finally {
      setIsUploading(false);
    }
  };
  
  // 🗑️ Delete Hack
  const handleDelete = async (hackId, hackTitle) => {
    if (window.confirm(`Are you sure you want to delete "${hackTitle}"? Users won't be able to buy it anymore.`)) {
      const loadingToast = toast.loading("Deleting from servers...");
      try {
        await remove(ref(db, `hacks/${hackId}`));
        toast.success("Hack deleted successfully!", { id: loadingToast });
      } catch (error) {
        toast.error("Error deleting hack.", { id: loadingToast });
      }
    }
  };
  
  return (
    <div className="p-4 sm:p-8 w-full max-w-7xl mx-auto">
      
      <div className="mb-8">
        <h1 className="text-3xl font-black text-pureWhite flex items-center gap-3">
          <Settings className="text-blue-500" size={32} /> MANAGE VIP FILES
        </h1>
        <p className="text-gray-400 mt-1">Upload new settings to the store or remove old ones.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 🛠️ LEFT: Upload Form */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-1 glass-panel p-6 rounded-3xl h-fit border border-blue-500/20">
          <h2 className="text-xl font-bold text-pureWhite mb-6 border-b border-white/10 pb-4 flex items-center gap-2">
            <Plus className="text-blue-400" /> Add New Hack
          </h2>
          
          <form onSubmit={handleUpload} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Title Name</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="e.g. Funchi V4 Max" required className="w-full bg-[#001233] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Price (₹)</label>
              <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="e.g. 299" required className="w-full bg-[#001233] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Cover Image URL</label>
              <div className="relative">
                <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                <input type="url" name="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="https://..." required className="w-full bg-[#001233] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-sm" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Short Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} placeholder="What does this hack do?" rows="2" className="w-full bg-[#001233] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-none text-sm"></textarea>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Features (Comma Separated)</label>
              <textarea name="features" value={formData.features} onChange={handleChange} placeholder="Aimbot, No Recoil, High Damage..." rows="2" className="w-full bg-[#001233] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-none text-sm"></textarea>
            </div>

            <button type="submit" disabled={isUploading} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-3 rounded-xl shadow-[0_0_15px_rgba(37,99,235,0.4)] transition-all active:scale-95 flex items-center justify-center gap-2 mt-4">
              {isUploading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <><Plus size={18} /> DEPLOY HACK</>}
            </button>
          </form>
        </motion.div>

        {/* 📦 RIGHT: Current Live Hacks */}
        <div className="lg:col-span-2">
          <div className="glass-panel p-6 rounded-3xl min-h-full">
            <h2 className="text-xl font-bold text-pureWhite mb-6 border-b border-white/10 pb-4 flex items-center gap-2">
              <Package className="text-blue-400" /> Active Files on Store
            </h2>

            {hacks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Crosshair size={48} className="text-gray-600 mb-4" />
                <p className="text-gray-400">Your store is empty. Upload a hack to start selling!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AnimatePresence>
                  {hacks.map((hack) => (
                    <motion.div 
                      key={hack.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="bg-[#001233] rounded-2xl border border-white/5 overflow-hidden flex flex-col group hover:border-white/20 transition-all"
                    >
                      <div className="h-32 w-full relative overflow-hidden">
                        <img src={hack.imageUrl} alt="Hack Cover" className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md text-xs font-bold text-white border border-white/10">
                          ₹{hack.price}
                        </div>
                      </div>
                      
                      <div className="p-4 flex-grow flex flex-col justify-between">
                        <div>
                          <h3 className="font-bold text-pureWhite text-lg leading-tight mb-1">{hack.title}</h3>
                          <p className="text-xs text-gray-400 line-clamp-2">{hack.description}</p>
                        </div>
                        
                        <button 
                          onClick={() => handleDelete(hack.id, hack.title)}
                          className="mt-4 w-full bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/20 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all"
                        >
                          <Trash2 size={16} /> Remove Listing
                        </button>
                      </div>
                    </motion.div>
                  ))}
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