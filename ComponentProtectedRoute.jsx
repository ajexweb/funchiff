import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';
import toast from 'react-hot-toast';

const ComponentProtectedRoute = ({ requiredRole }) => {
  const { currentUser, role } = useAuth();
  
  // ❌ रूल 1: अगर इंसान ने लॉगिन ही नहीं किया है
  if (!currentUser) {
    toast.error("Please login to access this page!", { id: 'auth-error-1' });
    return <Navigate to="/login" replace />; // वापस लॉगिन पेज पर फेंक दो
  }
  
  // ❌ रूल 2: अगर पेज 'Admin' का है, लेकिन लॉगिन करने वाला नॉर्मल 'User' है
  if (requiredRole === 'admin' && role !== 'admin') {
    toast.error("Access Denied! You are not an Admin.", { id: 'auth-error-2' });
    return <Navigate to="/user/dashboard" replace />; // उसे यूज़र के होम पर फेंक दो
  }
  
  // ❌ रूल 3: अगर एडमिन गलती से नॉर्मल यूज़र वाले पेज पर आ जाए
  // (ताकि एडमिन हमेशा अपने प्रीमियम पैनल में ही रहे)
  if (requiredRole === 'user' && role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />; // वापस एडमिन पैनल ले जाओ
  }
  
  // ✅ रूल 4: अगर सब कुछ सही है (Security Passed)
  // <Outlet /> का मतलब है कि जो पेज यूज़र ने माँगा था, वो उसे दिखा दो
  return <Outlet />;
};

export default ComponentProtectedRoute;