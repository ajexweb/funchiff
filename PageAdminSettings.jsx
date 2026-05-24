// PageAdminSettings.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ref, update, onValue } from 'firebase/database';
import { db } from './firebase.jsx'; //
import { supabase } from './supabase.js'; // Securely bound to dynamic QR streaming paths
import toast from 'react-hot-toast';
import { Settings, Save, Link as LinkIcon, Power, CreditCard, UploadCloud, Image as ImageIcon, QrCode } from 'lucide-react';

const PageAdminSettings = () => {
  const [settings, setSettings] = useState({
    upiId: '', //
    upiQrCodeUrl: '', // Live cloud structural URL pointer anchor
    maintenanceMode: false, //
    instagramLink: '', //
    telegramLink: '' //
  });
  const [isLoading, setIsLoading] = useState(true); //
  const [isSaving, setIsSaving] = useState(false); //
  const [isUploadingQr, setIsUploadingQr] = useState(false);

  // 🚀 Fetch Global Configuration Nodes
  useEffect(() => {
    const settingsRef = ref(db, 'globalSettings'); //
    const unsubscribe = onValue(settingsRef, (snapshot) => { //
      const data = snapshot.val(); //
      if (data) { //
        setSettings(prev => ({ ...prev, ...data })); // Merge structural node defaults safely
      }
      setIsLoading(false); //
    });
    return () => unsubscribe(); //
  }, []);

  // 📸 Direct Supabase Storage Stream Engine for Master QR Code Image
  const handleQrImageUploadGate = async (e) => {
    const targetFileNode = e.target.files[0];
    if (!targetFileNode) return;

    if (targetFileNode.size > 4 * 1024 * 1024) { // Absolute 4MB constraint checker boundary
      toast.error("Asset validation failure: Master QR footprint cannot exceed 4MB threshold size!");
      return;
    }

    setIsUploadingQr(true);
    const trackingToastToken = toast.loading("Streaming master QR vector asset to Supabase cloud storage...");

    try {
      const fileExtension = targetFileNode.name.split('.').pop();
      const randomizedUniqueToken = Math.floor(1000 + Math.random() * 9000);
      const structuralFileName = `merchant_qr_master_${Date.now()}_${randomizedUniqueToken}.${fileExtension}`;
      const destinationBucketPath = `admin_config/${structuralFileName}`;

      // Upload file directly to Supabase storage core
      const { data, error } = await supabase.storage
        .from('hack')
        .upload(destinationBucketPath, targetFileNode, {
          cacheControl: '3600',
          upsert: true // Overwrites layout safely on exact tracking tokens
        });

      if (error) throw error;

      // Extract permanent live link address channel mapping
      const { data: publicUrlResult } = supabase.storage
        .from('hack')
        .getPublicUrl(destinationBucketPath);

      // Local state update matrix
      setSettings(prev => ({ ...prev, upiQrCodeUrl: publicUrlResult.publicUrl }));
      toast.success("Merchant QR signature verified and bound to active system cache memory layers!", { id: trackingToastToken });
    } catch (err) {
      toast.error(`Supabase pipeline rejection: ${err.message}`, { id: trackingToastToken });
    } finally {
      setIsUploadingQr(false);
    }
  };
  
  // 💾 Save Integrated Configuration Matrix straight to Firebase Database
  const handleSave = async () => {
    setIsSaving(true); //
    const loadingToast = toast.loading("Committing changes across all global server array branches..."); //
    try {
      const settingsRef = ref(db, 'globalSettings'); //
      await update(settingsRef, settings); //
      toast.success("All master system node settings propagated instantly to users global grid!", { id: loadingToast }); //
    } catch (error) {
      toast.error("Database structural access exception: " + error.message, { id: loadingToast }); //
    } finally {
      setIsSaving(false); //
    }
  };
  
  if (isLoading) return <div className="min-h-[60vh] flex items-center justify-center"><div className="w-12 h-12 border-4 border-navy-700 border-t-blue-500 rounded-full animate-spin shadow-glass"></div></div>; //
  
  return (
    <div className="p-4 sm:p-8 w-full max-w-4xl mx-auto select-none">
      
      {/* Page Title Header block */}
      <div className="mb-8 border-b border-white/5 pb-6"> {/* */}
        <h1 className="text-3xl font-black text-pureWhite flex items-center gap-3 uppercase tracking-wider"> {/* */}
          <Settings className="text-blue-500" size={32} /> MASTER ARCHITECTURE CONTROL STUDIO {/* */}
        </h1>
        <p className="text-gray-400 mt-1 text-sm font-medium">Configure global transaction variables, merchant nodes, and operational configurations live.</p> {/* */}
      </div>

      <div className="glass-panel p-6 md:p-8 rounded-3xl border border-white/10 space-y-6 shadow-2xl"> {/* */}
        
        {/* ==================== SECTION A: RE-ENGINEERED DYNAMIC UPI AND QR ROUTING MODULE ==================== */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start bg-[#001233]/40 p-5 rounded-2xl border border-white/5">
          
          <div className="md:col-span-8 space-y-4">
            <h3 className="text-md font-black text-white uppercase tracking-wide flex items-center gap-2 border-b border-white/5 pb-2">
              <CreditCard size={18} className="text-blue-400" /> Payment Node Setup Parameter
            </h3>
            
            <div className="space-y-1.5">
              <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest">Official Master UPI Destination ID</label>
              <input 
                type="text" 
                value={settings.upiId} //
                onChange={(e) => setSettings({...settings, upiId: e.target.value})} //
                placeholder="ajaybhai@ybl"
                className="w-full bg-[#001233] border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white font-mono font-black focus:border-blue-500 outline-none transition-all" //
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest">Deploy Authorized Merchant QR Code Vector File</label>
              <div className="relative">
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleQrImageUploadGate}
                  className="hidden" 
                  id="master-merchant-qr-file-hook" 
                  disabled={isUploadingQr}
                />
                <label 
                  htmlFor="master-merchant-qr-file-hook" 
                  className="flex flex-col items-center justify-center w-full h-24 bg-[#001233] border border-dashed border-white/10 hover:border-blue-500 hover:bg-blue-950/20 rounded-xl cursor-pointer transition-all p-4 group/upload"
                >
                  {isUploadingQr ? (
                    <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <UploadCloud size={24} className="text-gray-500 group-hover/upload:text-blue-400 mb-1" />
                      <span className="text-xs font-bold text-gray-400 group-hover/upload:text-white">Choose New QR Screenshot Matrix</span>
                    </>
                  )}
                </label>
              </div>
            </div>
          </div>

          {/* Interactive QR Live Preview Engine visualization layout mapping box */}
          <div className="md:col-span-4 flex flex-col items-center justify-center h-full text-center p-2 space-y-2 bg-[#0A1428] rounded-xl border border-white/5 self-center">
            <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Active QR Matrix</span>
            <div className="w-32 h-32 bg-white rounded-lg p-1.5 flex items-center justify-center shadow-inner relative group/preview">
              {settings.upiQrCodeUrl ? (
                <img src={settings.upiQrCodeUrl} alt="Live QR Preview Stream" className="w-full h-full object-contain" />
              ) : (
                <div className="text-[#0A1428] font-bold text-xs space-y-1">
                  <QrCode size={32} className="mx-auto text-gray-400 animate-pulse" />
                  <p className="text-[10px] text-gray-400">No Image</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 2. Social Navigation Links Modules */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> {/* */}
          <section className="space-y-1.5"> {/* */}
            <label className="block text-[11px] font-black text-pink-400 uppercase tracking-widest flex items-center gap-2"> {/* */}
              <LinkIcon size={14} className="text-pink-400"/> Community Outreach Portal: Instagram Link {/* */}
            </label>
            <input 
              type="url" 
              value={settings.instagramLink} //
              onChange={(e) => setSettings({...settings, instagramLink: e.target.value})} //
              placeholder="https://instagram.com/ajay_saini_funchi"
              className="w-full bg-[#001233] border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-300 focus:border-blue-500 outline-none" //
            />
          </section>
          
          <section className="space-y-1.5"> {/* */}
            <label className="block text-[11px] font-black text-blue-400 uppercase tracking-widest flex items-center gap-2"> {/* */}
              <LinkIcon size={14} className="text-blue-400"/> Core Announcements Command: Telegram Link {/* */}
            </label>
            <input 
              type="url" 
              value={settings.telegramLink} //
              onChange={(e) => setSettings({...settings, telegramLink: e.target.value})} //
              placeholder="https://t.me/funchi_ff_official"
              className="w-full bg-[#001233] border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-300 focus:border-blue-500 outline-none" //
            />
          </section>
        </div>

        {/* 3. Emergency Operations Maintenance Toggle Module */}
        <section className="bg-red-900/10 p-5 rounded-2xl border border-red-500/20"> {/* */}
          <div className="flex items-center justify-between gap-4"> {/* */}
            <div>
              <h4 className="text-md font-black text-white flex items-center gap-2 uppercase tracking-wide"> {/* */}
                <Power className={settings.maintenanceMode ? "text-red-500 animate-pulse" : "text-gray-500"} size={18} /> {/* */}
                Ecosystem Maintenance Isolation Mode {/* */}
              </h4>
              <p className="text-xs text-gray-400 mt-1 font-medium">When active, purchase terminals are hard-locked across all user nodes to prevent sync leaks.</p> {/* */}
            </div>
            <button 
              type="button"
              onClick={() => setSettings({...settings, maintenanceMode: !settings.maintenanceMode})} //
              className={`w-14 h-8 rounded-full transition-all relative flex items-center border ${settings.maintenanceMode ? 'bg-red-600 border-red-400/30' : 'bg-navy-700 border-white/10'}`} //
            >
              <div className={`absolute w-6 h-6 bg-white rounded-full transition-all shadow-md ${settings.maintenanceMode ? 'left-7' : 'left-1'}`}></div> {/* */}
            </button>
          </div>
        </section>

        {/* 🚀 Master Update Execution trigger action */}
        <button 
          onClick={handleSave} //
          disabled={isSaving || isUploadingQr} //
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg uppercase tracking-wider text-sm border border-blue-400/20 disabled:opacity-50" //
        >
          {isSaving ? "SAVING..." : <><Save size={18} /> COMMIT ARCHITECTURE OVERWRITE</>} {/* */}
        </button>

      </div>
    </div>
  );
};

export default PageAdminSettings;
