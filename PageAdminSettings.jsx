import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ref, get, update, onValue } from 'firebase/database';
import { db } from './firebase.jsx';
import toast from 'react-hot-toast';
import { Settings, Save, AlertTriangle, Link as LinkIcon, Power } from 'lucide-react';

const PageAdminSettings = () => {
  const [settings, setSettings] = useState({
    upiId: '',
    maintenanceMode: false,
    instagramLink: '',
    telegramLink: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // 🚀 Fetch Global Settings
  useEffect(() => {
    const settingsRef = ref(db, 'globalSettings');
    const unsubscribe = onValue(settingsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setSettings(data);
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);
  
  // 💾 Save Settings to Firebase
  const handleSave = async () => {
    setIsSaving(true);
    const loadingToast = toast.loading("Updating global settings...");
    try {
      const settingsRef = ref(db, 'globalSettings');
      await update(settingsRef, settings);
      toast.success("All settings updated successfully!", { id: loadingToast });
    } catch (error) {
      toast.error("Failed to update settings.", { id: loadingToast });
    } finally {
      setIsSaving(false);
    }
  };
  
  if (isLoading) return <div className="min-h-[50vh] flex items-center justify-center"><div className="w-10 h-10 border-4 border-t-blue-500 rounded-full animate-spin"></div></div>;
  
  return (
    <div className="p-4 sm:p-8 w-full max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-pureWhite flex items-center gap-3">
          <Settings className="text-blue-500" size={32} /> MASTER CONFIGURATION
        </h1>
        <p className="text-gray-400 mt-1">Global site controls. Changes apply instantly to all users.</p>
      </div>

      <div className="glass-panel p-8 rounded-3xl border border-white/10 space-y-8">
        
        {/* 1. UPI Payment Settings */}
        <section>
          <label className="block text-sm font-bold text-gray-300 mb-2 flex items-center gap-2">
            <CreditCard size={18} className="text-blue-400"/> Official Admin UPI ID
          </label>
          <input 
            type="text" 
            value={settings.upiId}
            onChange={(e) => setSettings({...settings, upiId: e.target.value})}
            className="w-full bg-[#001233] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none"
          />
        </section>

        {/* 2. Social Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section>
            <label className="block text-sm font-bold text-gray-300 mb-2 flex items-center gap-2">
              <LinkIcon size={18} className="text-pink-400"/> Instagram URL
            </label>
            <input 
              type="url" 
              value={settings.instagramLink}
              onChange={(e) => setSettings({...settings, instagramLink: e.target.value})}
              className="w-full bg-[#001233] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none"
            />
          </section>
          <section>
            <label className="block text-sm font-bold text-gray-300 mb-2 flex items-center gap-2">
              <LinkIcon size={18} className="text-blue-400"/> Telegram Channel URL
            </label>
            <input 
              type="url" 
              value={settings.telegramLink}
              onChange={(e) => setSettings({...settings, telegramLink: e.target.value})}
              className="w-full bg-[#001233] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none"
            />
          </section>
        </div>

        {/* 3. Emergency Maintenance Switch */}
        <section className="bg-red-900/10 p-6 rounded-2xl border border-red-500/20">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-lg font-bold text-white flex items-center gap-2">
                <Power className={settings.maintenanceMode ? "text-red-500" : "text-gray-500"} /> 
                Maintenance Mode
              </h4>
              <p className="text-xs text-gray-400 mt-1">Enable this to disable store purchases for all users.</p>
            </div>
            <button 
              onClick={() => setSettings({...settings, maintenanceMode: !settings.maintenanceMode})}
              className={`w-14 h-8 rounded-full transition-all relative ${settings.maintenanceMode ? 'bg-red-600' : 'bg-gray-600'}`}
            >
              <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${settings.maintenanceMode ? 'left-7' : 'left-1'}`}></div>
            </button>
          </div>
        </section>

        {/* 🚀 Save Button */}
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-[0_0_20px_rgba(37,99,235,0.3)]"
        >
          {isSaving ? "SAVING..." : <><Save size={20} /> SAVE GLOBAL SETTINGS</>}
        </button>

      </div>
    </div>
  );
};

export default PageAdminSettings;