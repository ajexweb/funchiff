import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ref, onValue, update } from 'firebase/database';
import { db } from './firebase.js';
import toast from 'react-hot-toast';
import { CreditCard, CheckCircle, XCircle, ExternalLink, Image as ImageIcon } from 'lucide-react';

const PageAdminPayments = () => {
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // 🚀 Real-time fetch of ALL payments
  useEffect(() => {
    const paymentsRef = ref(db, 'payments');
    const unsubscribe = onValue(paymentsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const paymentsArray = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        
        // Sorting: Pending सबसे ऊपर, फिर लेटेस्ट
        paymentsArray.sort((a, b) => {
          if (a.status === 'pending' && b.status !== 'pending') return -1;
          if (a.status !== 'pending' && b.status === 'pending') return 1;
          return b.timestamp - a.timestamp;
        });
        
        setPayments(paymentsArray);
      } else {
        setPayments([]);
      }
      setIsLoading(false);
    });
    
    return () => unsubscribe();
  }, []);
  
  // ⚡ The 1-Click Action Function (Approve/Reject)
  const handleAction = async (paymentId, newStatus) => {
    const loadingToast = toast.loading(`Marking as ${newStatus}...`);
    try {
      const paymentRef = ref(db, `payments/${paymentId}`);
      await update(paymentRef, { status: newStatus });
      toast.success(`Payment ${newStatus} successfully!`, { id: loadingToast });
    } catch (error) {
      toast.error("Failed to update status", { id: loadingToast });
    }
  };
  
  return (
    <div className="p-4 sm:p-8 w-full">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-pureWhite flex items-center gap-3">
            <CreditCard className="text-blue-500" size={32} /> MANAGE PAYMENTS
          </h1>
          <p className="text-gray-400 mt-1 text-sm">Approve or reject user payment proofs in real-time.</p>
        </div>
        <div className="bg-[#001233] px-4 py-2 rounded-lg border border-white/10 font-mono text-sm shadow-glass">
          Total Requests: <span className="text-blue-400 font-bold">{payments.length}</span>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-white/10 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="overflow-x-auto bg-[#001233]/80 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 text-gray-300 text-xs uppercase tracking-wider">
                <th className="p-4 border-b border-white/10">User Email</th>
                <th className="p-4 border-b border-white/10">Hack / Price</th>
                <th className="p-4 border-b border-white/10">UTR Number</th>
                <th className="p-4 border-b border-white/10">Screenshot</th>
                <th className="p-4 border-b border-white/10 text-center">Status</th>
                <th className="p-4 border-b border-white/10 text-right">Admin Action</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {payments.map((payment) => (
                <motion.tr 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  key={payment.id} 
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td className="p-4 text-blue-400 font-medium">{payment.userEmail}</td>
                  <td className="p-4 text-pureWhite">
                    {payment.hackTitle} <br/>
                    <span className="text-gray-500 text-xs font-mono">₹{payment.price}</span>
                  </td>
                  <td className="p-4 font-mono text-gray-300">{payment.utrNumber}</td>
                  <td className="p-4">
                    <a 
                      href={payment.proofImageUrl} 
                      target="_blank" 
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs bg-blue-600/20 text-blue-400 px-3 py-1.5 rounded hover:bg-blue-600 hover:text-white transition-colors border border-blue-500/30"
                    >
                      <ImageIcon size={14} /> View Proof <ExternalLink size={12} />
                    </a>
                  </td>
                  <td className="p-4 text-center">
                    {payment.status === 'pending' && <span className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded text-xs font-bold border border-yellow-500/30 uppercase">Pending</span>}
                    {payment.status === 'approved' && <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs font-bold border border-green-500/30 uppercase">Approved</span>}
                    {payment.status === 'rejected' && <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded text-xs font-bold border border-red-500/30 uppercase">Rejected</span>}
                  </td>
                  <td className="p-4 text-right">
                    {payment.status === 'pending' ? (
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleAction(payment.id, 'approved')}
                          className="bg-green-600 hover:bg-green-500 text-white p-2 rounded-lg shadow-lg active:scale-90 transition-all"
                          title="Approve Payment"
                        >
                          <CheckCircle size={18} />
                        </button>
                        <button 
                          onClick={() => handleAction(payment.id, 'rejected')}
                          className="bg-red-600 hover:bg-red-500 text-white p-2 rounded-lg shadow-lg active:scale-90 transition-all"
                          title="Reject Payment"
                        >
                          <XCircle size={18} />
                        </button>
                      </div>
                    ) : (
                      <span className="text-gray-600 text-xs italic">Action Completed</span>
                    )}
                  </td>
                </motion.tr>
              ))}
              {payments.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-500">No payment requests found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PageAdminPayments;