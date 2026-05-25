// App.jsx
import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// UI Components (Flat Structure)
import ComponentNavbar from './ComponentNavbar.jsx';
import ComponentSidebar from './ComponentSidebar.jsx'; // Sidebar loaded
import ComponentProtectedRoute from './ComponentProtectedRoute.jsx'; // 👈 FIXED: Missing import line added back!
import { useAuth } from './AuthContext.jsx'; // Auth check connection

// 🚀 ADVANCED FEATURE: Lazy Loading Pages (Makes website 10x Faster)
const PageHome = React.lazy(() => import('./PageHome.jsx')); //
const PageLogin = React.lazy(() => import('./PageLogin.jsx')); //

// User Dashboard Pages
const PageUserDashboard = React.lazy(() => import('./PageUserDashboard.jsx')); //
const PageBuyHack = React.lazy(() => import('./PageBuyHack.jsx')); //
const PageUserPurchases = React.lazy(() => import('./PageUserPurchases.jsx')); //

// 👑 Admin Dashboard Pages
const PageAdminDashboard = React.lazy(() => import('./PageAdminDashboard.jsx')); //
const PageAdminPayments = React.lazy(() => import('./PageAdminPayments.jsx')); //
const PageAdminManageHacks = React.lazy(() => import('./PageAdminManageHacks.jsx')); //
const PageAdminUsers = React.lazy(() => import('./PageAdminUsers.jsx')); //
const PageAdminSettings = React.lazy(() => import('./PageAdminSettings.jsx')); //

// 🔄 Premium Loading Spinner
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-navy-900">
    <div className="w-12 h-12 border-4 border-navy-700 border-t-pureWhite rounded-full animate-spin"></div>
  </div>
);

export default function App() {
  const { currentUser } = useAuth(); // Active session query route check

  return (
    <div className="min-h-screen bg-navy-900 text-pureWhite flex flex-col font-sans">
      
      {/* Navbar top grid element */}
      <ComponentNavbar />

      {/* Main Layout Grid */}
      <div className="flex flex-1 w-full relative">
        
        {/* Render Sidebar only when user session exists */}
        {currentUser && <ComponentSidebar />}

        {/* Main Content Viewport Area */}
        <main className={`flex-grow pt-16 transition-all duration-300 w-full ${currentUser ? 'md:pl-64' : ''}`}>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              
              {/* 🌐 PUBLIC ROUTES */}
              <Route path="/" element={<PageHome />} />
              <Route path="/login" element={<PageLogin />} />

              {/* 👤 USER PROTECTED ROUTES */}
              <Route element={<ComponentProtectedRoute requiredRole="user" />}>
                <Route path="/user/dashboard" element={<PageUserDashboard />} />
                <Route path="/user/buy/:hackId" element={<PageBuyHack />} />
                <Route path="/user/purchases" element={<PageUserPurchases />} />
              </Route>

              {/* 👑 ADMIN PROTECTED ROUTES */}
              <Route element={<ComponentProtectedRoute requiredRole="admin" />}>
                <Route path="/admin/dashboard" element={<PageAdminDashboard />} />
                <Route path="/admin/payments" element={<PageAdminPayments />} />
                <Route path="/admin/hacks" element={<PageAdminManageHacks />} />
                <Route path="/admin/users" element={<PageAdminUsers />} />
                <Route path="/admin/settings" element={<PageAdminSettings />} />
              </Route>

              {/* ❌ 404 FALLBACK ROUTER */}
              <Route path="*" element={<Navigate to="/" replace />} />

            </Routes>
          </Suspense>
        </main>

      </div>
      
    </div>
  );
}
