import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, X, Instagram, LogOut, Home, LayoutDashboard, 
  ShoppingBag, ShieldCheck, Settings, LogIn 
} from 'lucide-react';
import { useAuth } from './AuthContext.jsx';

const ComponentNavbar = () => {
  const { currentUser, role, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // 🚪 सुरक्षित लॉगआउट और रीडायरेक्ट
  const handleLogout = async () => {
    await logout();
    setIsOpen(false);
    navigate('/');
  };

  // 🚦 डायनेमिक लिंक्स (Role के हिसाब से)
  const getNavLinks = () => {
    if (!currentUser) {
      return [
        { name: 'Home', path: '/', icon: <Home size={18} /> },
        { name: 'Login', path: '/login', icon: <LogIn size={18} /> },
      ];
    }
    if (role === 'admin') {
      return [
        { name: 'Admin Panel', path: '/admin/dashboard', icon: <ShieldCheck size={18} /> },
        { name: 'Manage Hacks', path: '/admin/hacks', icon: <Settings size={18} /> },
      ];
    }
    // Normal User Links
    return [
      { name: 'Dashboard', path: '/user/dashboard', icon: <LayoutDashboard size={18} /> },
      { name: 'My Purchases', path: '/user/purchases', icon: <ShoppingBag size={18} /> },
    ];
  };

  const navLinks = getNavLinks();

  return (
    <>
      {/* 🌌 Top Sticky Navbar (Glassmorphism) */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-[#001233]/80 backdrop-blur-md border-b border-white/10 shadow-glass">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* 🛡️ Logo Branding */}
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-pureWhite rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                  <span className="text-[#0A1428] font-black text-xl">F</span>
                </div>
                <span className="text-pureWhite font-black text-xl tracking-widest uppercase drop-shadow-md">
                  Funchi FF
                </span>
              </Link>
            </div>

            {/* 💻 Desktop Menu */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-center space-x-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                      location.pathname === link.path 
                        ? 'bg-pureWhite/10 text-pureWhite border border-pureWhite/20 shadow-inner' 
                        : 'text-gray-300 hover:bg-pureWhite/5 hover:text-pureWhite'
                    }`}
                  >
                    {link.icon}
                    {link.name}
                  </Link>
                ))}

                {/* 🔴 Logout Button (Only if logged in) */}
                {currentUser && (
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white rounded-md text-sm font-bold transition-all duration-300 border border-red-500/30"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                )}

                {/* 📸 Instagram Link */}
                <a 
                  href="https://instagram.com/funchiff" 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-gray-400 hover:text-pink-500 transition-colors duration-300"
                >
                  <Instagram size={22} />
                </a>
              </div>
            </div>

            {/* 📱 Mobile Hamburger Button */}
            <div className="md:hidden flex items-center gap-4">
              <a href="https://instagram.com/funchiff" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-pink-500">
                <Instagram size={22} />
              </a>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-300 hover:text-white focus:outline-none p-1 rounded-md bg-white/5 border border-white/10"
              >
                {isOpen ? <X size={26} /> : <Menu size={26} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* 📱 Mobile Menu Dropdown (Animated with Framer Motion) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="md:hidden fixed top-16 left-0 w-full z-40 bg-[#001233]/95 backdrop-blur-xl border-b border-white/10 shadow-2xl"
          >
            <div className="px-4 pt-2 pb-6 flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-all ${
                    location.pathname === link.path
                      ? 'bg-pureWhite/10 text-pureWhite border border-pureWhite/20'
                      : 'text-gray-300 hover:bg-pureWhite/5'
                  }`}
                >
                  {link.icon}
                  {link.name}
                </Link>
              ))}

              {currentUser && (
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-3 mt-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg text-base font-bold transition-all border border-red-500/20"
                >
                  <LogOut size={20} />
                  Logout
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ComponentNavbar;