import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, ShieldCheck, Settings, Users, 
  CreditCard, ShoppingBag, Gamepad2 
} from 'lucide-react';
import { useAuth } from './AuthContext.jsx';

const ComponentSidebar = () => {
  const { role } = useAuth();
  const location = useLocation();

  // 🚦 Role के हिसाब से मेन्यू लिंक्स सेट करना
  const adminLinks = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Approve Payments', path: '/admin/payments', icon: <CreditCard size={20} /> },
    { name: 'Manage Hacks', path: '/admin/hacks', icon: <Gamepad2 size={20} /> },
    { name: 'Users List', path: '/admin/users', icon: <Users size={20} /> },
    { name: 'Settings', path: '/admin/settings', icon: <Settings size={20} /> },
  ];

  const userLinks = [
    { name: 'My Dashboard', path: '/user/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'My Purchases', path: '/user/purchases', icon: <ShoppingBag size={20} /> },
  ];

  // चेक करो कि कौन सा लिंक दिखाना है
  const linksToShow = role === 'admin' ? adminLinks : userLinks;

  return (
    <aside className="hidden md:flex flex-col w-64 fixed left-0 top-16 h-[calc(100vh-4rem)] bg-[#001233]/90 backdrop-blur-xl border-r border-white/10 shadow-glass overflow-y-auto custom-scrollbar">
      <div className="p-6">
        <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-4">
          {role === 'admin' ? 'Admin Controls' : 'User Panel'}
        </p>
        
        <nav className="space-y-2">
          {linksToShow.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium ${
                  isActive 
                    ? 'bg-blue-600/20 text-pureWhite border border-blue-500/30 shadow-[0_0_15px_rgba(37,99,235,0.2)]' 
                    : 'text-gray-400 hover:bg-pureWhite/5 hover:text-pureWhite'
                }`}
              >
                <div className={`${isActive ? 'text-blue-400' : 'text-gray-500'}`}>
                  {link.icon}
                </div>
                {link.name}
                
                {/* Active Indicator Dot */}
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,1)]"></div>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* 🛡️ Security Badge at bottom */}
      <div className="mt-auto p-6 border-t border-white/5">
        <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
          <ShieldCheck size={14} className="text-green-500" />
          Secured by Funchi FF
        </div>
      </div>
    </aside>
  );
};

export default ComponentSidebar;