import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase.jsx'; // Flat Structure Import
import toast from 'react-hot-toast';

// 1. Context बनाना (सिक्योरिटी का खाली डब्बा)
const AuthContext = createContext();

// 2. Custom Hook (वेबसाइट में कहीं भी सिक्योरिटी डेटा मंगाने का शॉर्टकट)
export function useAuth() {
  return useContext(AuthContext);
}

// 3. Global Provider Component (पूरी साइट को लपेटने वाला गार्ड)
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [role, setRole] = useState(null); // 'admin' या 'user'
  const [loading, setLoading] = useState(true);
  
  // 🚀 ADVANCED FEATURE: 24/7 Firebase Listener
  useEffect(() => {
    // यह रडार चेक करता रहेगा कि कौन वेबसाइट पर एक्टिव है
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // यूज़र मिल गया! अब चेक करो कि क्या यह असली एडमिन (अजय भाई) है?
        setCurrentUser(user);
        
        // .env फाइल से आपकी टॉप-सीक्रेट UID मैच कर रहे हैं
        if (user.uid === import.meta.env.VITE_ADMIN_UID) {
          setRole('admin');
        } else {
          setRole('user');
        }
      } else {
        // कोई लॉगिन नहीं है
        setCurrentUser(null);
        setRole(null);
      }
      
      // सिक्योरिटी चेकिंग पूरी हो गई, अब लोडिंग बंद करो
      setLoading(false);
    });
    
    // जब कंपोनेंट हटेगा तो मेमोरी बचाने के लिए रडार बंद कर दो
    return unsubscribe;
  }, []);
  
  // 🚪 ग्लोबल लॉगआउट फंक्शन (किसी भी पेज से लॉगआउट करने के लिए)
  const logout = async () => {
    try {
      await signOut(auth);
      toast.success("Successfully Logged Out!");
    } catch (error) {
      toast.error("Logout Failed: " + error.message);
    }
  };
  
  // यह सारा डेटा हम वेबसाइट के हर पेज को सप्लाई करेंगे
  const value = {
    currentUser,
    role,
    loading,
    logout
  };
  
  // 🔄 PREMIUM FEATURE: Initial Security Checking Screen
  // जब तक Firebase से जवाब नहीं आता, तब तक यह डार्क गेमिंग लोडर दिखेगा
  if (loading) {
    return (
      <div className="min-h-screen bg-navy-900 flex flex-col items-center justify-center">
        {/* Glassmorphism Loader Box */}
        <div className="glass-panel p-8 rounded-2xl flex flex-col items-center shadow-glass">
          <div className="w-16 h-16 border-4 border-navy-700 border-t-pureWhite rounded-full animate-spin mb-4"></div>
          <h2 className="text-xl font-bold text-pureWhite tracking-widest uppercase shadow-sm">
            Funchi FF
          </h2>
          <p className="text-sm text-gray-400 mt-2 animate-pulse">
            Verifying Security Clearance...
          </p>
        </div>
      </div>
    );
  }
  
  // चेकिंग पूरी होने के बाद वेबसाइट दिखा दो
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};