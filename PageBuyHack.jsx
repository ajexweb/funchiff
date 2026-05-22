import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ref, get, push, set, serverTimestamp } from 'firebase/database';
import { db } from './firebase.js';
import { uploadPaymentScreenshot } from './supabase.js'; // Supabase Image Uploader
import { useAuth } from './AuthContext.jsx';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Copy, UploadCloud, ShieldCheck, QrCode, ArrowLeft, Image as ImageIcon } from 'lucide-react';

const PageBuyHack = () => {
  const { hackId } = useParams(); // URL से हैक की ID निकालेगा
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [hack, setHack] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form States
  const [utrNumber, setUtrNumber] = useState('');
  const [proofFile, setProofFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  
  // आपकी Official Admin UPI ID
  const ADMIN_UPI_ID = "ajaybhai@ybl";
  
  // 1. Fetch Hack Details from Firebase
  useEffect(() => {
    const fetchHack = async () => {
      try {
        const hackSnapshot = await get(ref(db, `hacks/${hackId}`));
        if (hackSnapshot.exists()) {
          setHack(hackSnapshot.val());
        } else {
          toast.error("File not found!");
          navigate('/user/dashboard');
        }
      } catch (error) {
        toast.error("Error fetching details.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchHack();
  }, [hackId, navigate]);
  
  // 2. Copy UPI ID Function
  const handleCopyUpi = () => {
    navigator.clipboard.writeText(ADMIN_UPI_ID);
    toast.success("UPI ID Copied to clipboard!");
  };
  
  // 3. Handle File Selection (With Preview)
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB Limit
        toast.error("Image is too large! Maximum 5MB allowed.");
        return;
      }
      setProofFile(file);
      setPreviewUrl(URL.createObjectURL(file)); // Live Preview
    }
  };
  
  // 4. Submit Payment Request (Supabase + Firebase)
  const handleSubmitPayment = async (e) => {
    e.preventDefault();
    if (!utrNumber || utrNumber.length < 12) {
      toast.error("Please enter a valid 12-digit UTR/Reference Number.");
      return;
    }
    if (!proofFile) {
      toast.error("Please upload the payment screenshot.");
      return;
    }
    
    setIsSubmitting(true);
    const loadingId = toast.loading("Uploading securely to Supabase...");
    
    try {
      // Step A: Upload Image to Supabase
      const imageUrl = await uploadPaymentScreenshot(proofFile, currentUser.uid);
      
      if (!imageUrl) {
        throw new Error("Failed to upload image. Please try again.");
      }
      
      toast.loading("Saving request to Database...", { id: loadingId });
      
      // Step B: Save everything to Firebase 'payments' node
      const newPaymentRef = push(ref(db, 'payments')); // एक नई ID बनाएगा
      await set(newPaymentRef, {
        userId: currentUser.uid,
        userEmail: currentUser.email,
        hackId: hackId,
        hackTitle: hack.title,
        price: hack.price,
        utrNumber: utrNumber,
        proofImageUrl: imageUrl,
        status: 'pending', // एडमिन अप्रूव करेगा
        timestamp: serverTimestamp()
      });
      
      toast.success("Payment sent for verification! Admin will check it soon.", { id: loadingId });
      navigate('/user/purchases'); // पेंडिंग लिस्ट में भेज दो
      
    } catch (error) {
      toast.error(error.message, { id: loadingId });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) return <div className="min-h-screen bg-[#0A1428] flex items-center justify-center"><div className="w-12 h-12 border-4 border-t-blue-500 rounded-full animate-spin"></div></div>;
  
  return (
    <div className="min-h-screen bg-[#0A1428] py-10 px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Back Button */}
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors">
          <ArrowLeft size={20} /> Back to Dashboard
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* 💎 Left Side: Hack/Product Summary */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass-panel p-6 rounded-3xl h-fit">
            <div className="relative h-64 rounded-xl overflow-hidden mb-6 border border-white/10 shadow-lg">
              <img src={hack.imageUrl} alt="Hack Cover" className="w-full h-full object-cover opacity-80" />
              <div className="absolute top-4 right-4 bg-pureWhite/10 backdrop-blur-md px-4 py-2 rounded-lg border border-pureWhite/20">
                <p className="text-2xl font-black text-pureWhite">₹{hack.price}</p>
              </div>
            </div>
            <h2 className="text-3xl font-black text-pureWhite mb-2">{hack.title}</h2>
            <p className="text-gray-400 mb-6">{hack.description}</p>
            <div className="bg-[#001233] rounded-xl p-4 border border-white/5 flex items-start gap-3">
              <ShieldCheck className="text-green-500 flex-shrink-0 mt-1" />
              <p className="text-sm text-gray-300">
                You are purchasing a secure digital file. The download link and password will be unlocked in your "My Purchases" section once the admin verifies the payment.
              </p>
            </div>
          </motion.div>

          {/* 💳 Right Side: Payment Form */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-panel p-6 md:p-8 rounded-3xl border border-blue-500/20 shadow-[0_0_30px_rgba(37,99,235,0.1)]">
            <h3 className="text-2xl font-bold text-pureWhite mb-6 border-b border-white/10 pb-4 flex items-center gap-2">
              <QrCode className="text-blue-400" /> Complete Payment
            </h3>

            {/* UPI Details Box */}
            <div className="bg-gradient-to-br from-blue-900/40 to-[#001233] p-6 rounded-2xl border border-blue-500/30 mb-8 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/20 rounded-bl-full blur-xl"></div>
              <p className="text-gray-300 text-sm mb-2 font-medium">Scan QR or Pay to Official UPI ID</p>
              <div className="flex items-center justify-center gap-3 bg-[#0A1428] py-3 px-6 rounded-xl border border-white/10 mx-auto w-fit">
                <span className="text-xl font-black text-pureWhite tracking-widest">{ADMIN_UPI_ID}</span>
                <button onClick={handleCopyUpi} className="p-2 bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white rounded-lg transition-all active:scale-90">
                  <Copy size={18} />
                </button>
              </div>
              <p className="text-yellow-500 text-xs mt-3 font-bold flex items-center justify-center gap-1">
                ⚠️ Pay exactly ₹{hack.price} to avoid rejection.
              </p>
            </div>

            {/* Verification Form */}
            <form onSubmit={handleSubmitPayment} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">12-Digit UTR / Reference Number</label>
                <input 
                  type="number" 
                  required
                  value={utrNumber}
                  onChange={(e) => setUtrNumber(e.target.value)}
                  placeholder="e.g. 312345678901" 
                  className="w-full bg-[#001233]/80 border border-white/10 text-white rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">Upload Payment Screenshot</label>
                
                {/* Advanced Image Upload UI */}
                <div className="relative">
                  <input 
                    type="file" 
                    accept="image/*" 
                    required
                    onChange={handleFileChange}
                    className="hidden" 
                    id="file-upload" 
                  />
                  <label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-32 bg-[#001233]/80 border-2 border-dashed border-white/20 rounded-xl cursor-pointer hover:border-blue-500 hover:bg-blue-900/10 transition-all group overflow-hidden">
                    {previewUrl ? (
                      <img src={previewUrl} alt="Preview" className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity" />
                    ) : (
                      <div className="flex flex-col items-center text-gray-400 group-hover:text-blue-400 transition-colors">
                        <UploadCloud size={32} className="mb-2" />
                        <span className="text-sm font-medium">Click to select screenshot</span>
                      </div>
                    )}
                    {previewUrl && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <span className="bg-[#0A1428] px-3 py-1 rounded-md text-xs font-bold text-white shadow-lg flex items-center gap-1">
                          <ImageIcon size={12} /> Change Image
                        </span>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black text-lg py-4 rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : "SUBMIT FOR VERIFICATION"}
              </button>
            </form>

          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PageBuyHack;