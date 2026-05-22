import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase.jsx';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { ShieldAlert, User, Mail, Lock, LogIn } from 'lucide-react';

// 🛡️ Zod Validation Schema (हैकर्स से बचने के लिए सख्त रूल्स)
const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

const PageLogin = () => {
  const [authMode, setAuthMode] = useState('login'); // 'login', 'register', 'admin'
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(loginSchema)
  });
  
  // 🚀 Form Submit Handler
  const onSubmit = async (data) => {
    setIsLoading(true);
    const loadingToast = toast.loading("Verifying credentials...");
    
    try {
      if (authMode === 'register') {
        // नया यूज़र बनाना
        await createUserWithEmailAndPassword(auth, data.email, data.password);
        toast.success("Account created successfully!", { id: loadingToast });
        navigate('/user/dashboard');
      } else {
        // यूज़र या एडमिन लॉगिन
        await signInWithEmailAndPassword(auth, data.email, data.password);
        toast.success("Login successful!", { id: loadingToast });
        
        // AuthContext बैकग्राउंड में अपने आप तय कर लेगा कि इसे Admin Panel भेजना है या User Dashboard
        // हम बस इसे एक बार होम पर भेज रहे हैं, राउटर इसे सही जगह भेज देगा
        navigate('/');
      }
    } catch (error) {
      toast.error(error.message.replace("Firebase: ", ""), { id: loadingToast });
    } finally {
      setIsLoading(false);
    }
  };
  
  // मोड बदलने पर फॉर्म खाली करना
  const handleModeSwitch = (mode) => {
    setAuthMode(mode);
    reset();
  };
  
  return (
    <div className="min-h-screen bg-[#0A1428] flex items-center justify-center px-4 relative overflow-hidden">
      
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md z-10"
      >
        <div className="glass-panel p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
          
          {/* Admin Red Glow Effect */}
          {authMode === 'admin' && (
            <div className="absolute top-0 left-0 w-full h-1 bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.8)]"></div>
          )}

          <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-pureWhite uppercase tracking-wider mb-2 flex items-center justify-center gap-2">
              {authMode === 'admin' ? <ShieldAlert className="text-red-500" /> : <User className="text-blue-400" />}
              {authMode === 'login' ? 'User Login' : authMode === 'register' ? 'Sign Up' : 'Admin Portal'}
            </h2>
            <p className="text-gray-400 text-sm">
              {authMode === 'admin' ? 'Authorized personnel only.' : 'Access premium Funchi FF settings.'}
            </p>
          </div>

          {/* 🔄 Mode Switcher */}
          <div className="flex bg-[#001233] rounded-xl p-1 mb-6 border border-white/5">
            <button
              type="button"
              onClick={() => handleModeSwitch('login')}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${authMode === 'login' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => handleModeSwitch('register')}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${authMode === 'register' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
            >
              Register
            </button>
            <button
              type="button"
              onClick={() => handleModeSwitch('admin')}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${authMode === 'admin' ? 'bg-red-600 text-white shadow-[0_0_10px_rgba(239,68,68,0.4)]' : 'text-gray-400 hover:text-red-400'}`}
            >
              Admin
            </button>
          </div>

          {/* 📝 Smart Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                {authMode === 'admin' ? 'Admin Email' : 'Email Address'}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  {...register('email')}
                  type="email"
                  className="w-full bg-[#001233]/50 border border-white/10 text-white rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder-gray-600"
                  placeholder={authMode === 'admin' ? 'admin@funchiff.com' : 'gamer@funchi.com'}
                />
              </div>
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                {authMode === 'admin' ? 'Secret Passcode' : 'Password'}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  {...register('password')}
                  type="password"
                  className="w-full bg-[#001233]/50 border border-white/10 text-white rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder-gray-600"
                  placeholder="••••••••"
                />
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 rounded-xl font-black text-lg flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 mt-4 ${
                authMode === 'admin' 
                  ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-500/20' 
                  : 'bg-pureWhite hover:bg-gray-200 text-[#0A1428] shadow-white/10'
              }`}
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <LogIn size={20} />
                  {authMode === 'register' ? 'CREATE ACCOUNT' : 'SECURE LOGIN'}
                </>
              )}
            </button>
          </form>

        </div>
      </motion.div>
    </div>
  );
};

export default PageLogin;