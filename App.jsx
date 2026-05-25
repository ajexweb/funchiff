// App.jsx
import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// UI Components (Flat Structure)
import ComponentNavbar from './ComponentNavbar.jsx';
import ComponentSidebar from './ComponentSidebar.jsx'; // 👈 साइडबार को इम्पोर्ट किया
import { useAuth } from './AuthContext.jsx'; // 👈 लॉगिन स्टेटस चेक करने के लिए

// 🚀 ADVANCED FEATURE: Lazy Loading Pages (Makes website 10x Faster)
// पब्लिक पेजेस
const PageHome = React.lazy(() => import('./PageHome.jsx')); //
const PageLogin = React.lazy(() => import('./PageLogin.jsx')); //

// यूज़र डैशबोर्ड पेजेस
const PageUserDashboard = React.lazy(() => import('./PageUserDashboard.jsx')); //
const PageBuyHack = React.lazy(() => import('./PageBuyHack.jsx')); //
const PageUserPurchases = React.lazy(() => import('./PageUserPurchases.jsx')); //

// 👑 एडमिन पेजेस
const PageAdminDashboard = React.lazy(() => import('./PageAdminDashboard.jsx')); //
const PageAdminPayments = React.lazy(() => import('./PageAdminPayments.jsx')); //
const PageAdminManageHacks = React.lazy(() => import('./PageAdminManageHacks.jsx')); //
const PageAdminUsers = React.lazy(() => import('./PageAdminUsers.jsx')); //
const PageAdminSettings = React.lazy(() => import('./PageAdminSettings.jsx')); //

// 🔄 Premium Loading Spinner (जब तक पेज लोड हो रहा हो)
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-navy-900">
    <div className="w-12 h-12 border-4 border-navy-700 border-t-pureWhite rounded-full animate-spin"></div>
  </div>
);

export default function App() {
  const { currentUser } = useAuth(); // 👈 एक्टिव लॉगिन सेशन चेक कर रहे हैं

  return (
    <div className="min-h-screen bg-navy-900 text-pureWhite flex flex-col font-sans">
      
      {/* Navbar पूरी वेबसाइट में सबसे ऊपर दिखेगा */}
      <ComponentNavbar />

      {/* ⚡ मुख्य लेआउट ग्रिड: साइडबार और पेजेस को अगल-बगल सेट करने के लिए */}
      <div className="flex flex-1 w-full relative">
        
        {/* अगर यूजर लॉगिन है, तभी साइडबार दिखेगा (ताकि होमपेज और लॉगिन पेज का लुक न बिगड़े) */}
        {currentUser && <ComponentSidebar />}

        {/* Main Content Area: साइडबार दिखने पर कंप्यूटर स्क्रीन पर बाईं तरफ pl-64 (256px) की जगह छूट जाएगी */}
        <main className={`flex-grow pt-16 transition-all duration-300 w-full ${currentUser ? 'md:pl-64' : ''}`}>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              
              {/* 🌐 PUBLIC ROUTES */}
              <Route path="/" element={<PageHome />} />
              <Route path="/login" element={<PageLogin />} />

              {/* 👤 USER PROTECTED ROUTES (सिर्फ लॉगिन यूज़र्स के लिए) */}
              <Route element={<ComponentProtectedRoute requiredRole="user" />}>
                <Route path="/user/dashboard" element={<PageUserDashboard />} />
                <Route path="/user/buy/:hackId" element={<PageBuyHack />} />
                <Route path="/user/purchases" element={<PageUserPurchases />} />
              </Route>

              {/* 👑 ADMIN PROTECTED ROUTES (सिर्फ आपकी UID के लिए) */}
              <Route element={<ComponentProtectedRoute requiredRole="admin" />}>
                <Route path="/admin/dashboard" element={<PageAdminDashboard />} />
                <Route path="/admin/payments" element={<PageAdminPayments />} />
                <Route path="/admin/hacks" element={<PageAdminManageHacks />} />
                <Route path="/admin/users" element={<PageAdminUsers />} />
                <Route path="/admin/settings" element={<PageAdminSettings />} />
              </Route>

              {/* ❌ 404 NOT FOUND ROUTE (अगर कोई गलत लिंक डाले तो वापस Home पर भेज दो) */}
              <Route path="*" element={<Navigate to="/" replace />} />

            </Routes>
          </Suspense>
        </main>

      </div>
      
    </div>
  );
}
