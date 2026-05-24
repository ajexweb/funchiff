// PageAdminPayments.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ref, onValue, update } from 'firebase/database';
import { db } from './firebase.jsx'; //
import toast from 'react-hot-toast';
import { CreditCard, CheckCircle, XCircle, ExternalLink, Image as ImageIcon, X, AlertTriangle, ShieldCheck } from 'lucide-react';

const PageAdminPayments = () => {
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 📝 Rejection Modal Pipeline States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activePaymentId, setActivePaymentId] = useState(null);
  const [selectedReason, setSelectedReason] = useState('Wrong UTR Number / Digit Mismatch');
  const [customReason, setCustomReason] = useState('');
  
  // 🚀 Real-time fetch of ALL payments
  useEffect(() => {
    const paymentsRef = ref(db, 'payments'); //
    const unsubscribe = onValue(paymentsRef, (snapshot) => { //
      const data = snapshot.val(); //
      if (data) { //
        const paymentsArray = Object.keys(data).map(key => ({ //
          id: key, //
          ...data[key] //
        }));
        
        // Sorting Logic: Pending values on top layer, followed by reverse timestamps
        paymentsArray.sort((a, b) => { //
          if (a.status === 'pending' && b.status !== 'pending') return -1; //
          if (a.status !== 'pending' && b.status === 'pending') return 1; //
          return b.timestamp - a.timestamp; //
        }); //
        
        setPayments(paymentsArray); //
      } else {
        setPayments([]); //
      }
      setIsLoading(false); //
    });
    
    return () => unsubscribe(); //
  }, []);
  
  // ⚡ The Advanced Audit Process Router (Approve/Reject Handler)
  const handleProcessApproval = async (paymentId, decisionStatus, rejectionText = '') => {
    const processingMessage = decisionStatus === 'approved' ? "Verifying bank logs & unlocking files..." : "Rejecting entry node and log reason...";
    const loadingToast = toast.loading(processingMessage);
    
    try {
      const targetPaymentRef = ref(db, `payments/${paymentId}`); //
      
      const payloadUpdate = { 
        status: decisionStatus //
      };

      if(decisionStatus === 'rejected') {
        payloadUpdate.rejectionReason = rejectionText || "Invalid submission parameters verified.";
      }

      await update(targetPaymentRef, payloadUpdate); //
      toast.success(`Transaction register finalized as ${decisionStatus.toUpperCase()}!`, { id: loadingToast }); //
      
      // Clear Modal context flags if open
      setIsModalOpen(false);
      setActivePaymentId(null);
      setCustomReason('');
    } catch (error) {
      toast.error("Database tracking write anomaly: " + error.message, { id: loadingToast }); //
    }
  };

  // Open Rejection Prompt Panel
  const initiateRejectionFlow = (id) => {
    setActivePaymentId(id);
    setIsModalOpen(true);
  };
  
  return (
    <div className="p-4 sm:p-8 w-full max-w-7xl mx-auto select-none">
      
      {/* Header section structure */}
      <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/5 pb-6"> {/* */}
        <div>
          <h1 className="text-3xl font-black text-pureWhite flex items-center gap-3 uppercase tracking-wider"> {/* */}
            <CreditCard className="text-blue-500" size={32} /> ACCOUNTS AUDIT & APPROVALS {/* */}
          </h1>
          <p className="text-gray-400 mt-1 text-sm font-medium">Verify blockchain/bank UTR telemetry and stream dynamic lockers real-time.</p> {/* */}
        </div>
        <div className="bg-[#001233] px-5 py-3 rounded-xl border border-white/10 font-mono text-xs shadow-inner"> {/* */}
          TOTAL REQUEST SCHEMAS: <span className="text-blue-400 font-black text-sm">{payments.length}</span> {/* */}
        </div>
      </div>

      {isLoading ? ( //
        <div className="flex justify-center py-20"> {/* */}
          <div className="w-12 h-12 border-4 border-white/5 border-t-blue-500 rounded-full animate-spin"></div> {/* */}
        </div>
      ) : (
        <div className="overflow-x-auto bg-[#001233]/80 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl custom-scrollbar"> {/* */}
          <table className="w-full text-left border-collapse min-w-[900px]"> {/* */}
            <thead>
              <tr className="bg-white/5 text-gray-400 text-xs uppercase tracking-widest border-b border-white/10"> {/* */}
                <th className="p-5 font-black">Gamer Destination</th> {/* */}
                <th className="p-5 font-black">Config Package / Price</th> {/* */}
                <th className="p-5 font-black">UTR Signature Code</th> {/* */}
                <th className="p-5 font-black">Media Stream Proof</th> {/* */}
                <th className="p-5 font-black text-center">Audit Status</th> {/* */}
                <th className="p-5 font-black text-right">Master Command Actions</th> {/* */}
              </tr>
            </thead>
            <tbody className="text-sm"> {/* */}
              {payments.map((payment) => { //
                const isPendingNode = payment.status === 'pending'; //
                return (
                  <motion.tr //
                    initial={{ opacity: 0 }} //
                    animate={{ opacity: 1 }} //
                    key={payment.id} //
                    className="border-b border-white/5 hover:bg-white/5 transition-colors" //
                  >
                    <td className="p-5 text-blue-400 font-black font-mono text-xs max-w-[200px] truncate">{payment.userEmail}</td> {/* */}
                    <td className="p-5 text-pureWhite font-bold"> {/* */}
                      {payment.hackTitle} <br/> {/* */}
                      <span className="text-emerald-400 text-xs font-mono font-black">Subtotal: ₹{payment.price}</span> {/* */}
                    </td>
                    <td className="p-5 font-mono text-gray-300 font-bold tracking-wider">{payment.utrNumber}</td> {/* */}
                    <td className="p-5"> {/* */}
                      <a //
                        href={payment.proofImageUrl} //
                        target="_blank" //
                        rel="noreferrer" //
                        className="inline-flex items-center gap-1.5 text-xs bg-blue-600/10 text-blue-400 px-3 py-2 rounded-xl hover:bg-blue-600 hover:text-white transition-all border border-blue-500/20 font-bold shadow-md" //
                      >
                        <ImageIcon size={14} /> Examine Image <ExternalLink size={12} /> {/* */}
                      </a>
                    </td>
                    <td className="p-5 text-center"> {/* */}
                      {payment.status === 'pending' && <span className="bg-yellow-500/10 text-yellow-400 px-3 py-1 rounded-full text-xs font-black border border-yellow-500/20 uppercase tracking-wider">Pending</span>} {/* */}
                      {payment.status === 'approved' && <span className="bg-green-500/10 text-green-400 px-3 py-1 rounded-full text-xs font-black border border-green-500/20 uppercase tracking-wider">Approved</span>} {/* */}
                      {payment.status === 'rejected' && <span className="bg-red-500/10 text-red-400 px-3 py-1 rounded-full text-xs font-black border border-red-500/20 uppercase tracking-wider" title={payment.rejectionReason}>Rejected</span>} {/* */}
                    </td>
                    <td className="p-5 text-right"> {/* */}
                      {isPendingNode ? ( //
                        <div className="flex justify-end gap-2"> {/* */}
                          <button 
                            onClick={() => handleProcessApproval(payment.id, 'approved')} //
                            className="bg-green-600 hover:bg-green-500 text-white p-2.5 rounded-xl shadow-md active:scale-90 transition-all border border-green-400/20" //
                            title="Approve Transaction"
                          >
                            <CheckCircle size={16} /> {/* */}
                          </button>
                          <button 
                            onClick={() => initiateRejectionFlow(payment.id)} // Launch multi-reason modal
                            className="bg-red-600 hover:bg-red-500 text-white p-2.5 rounded-xl shadow-md active:scale-90 transition-all border border-red-400/20" //
                            title="Reject Transaction"
                          >
                            <XCircle size={16} /> {/* */}
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-end">
                          <span className="text-gray-500 text-xs font-bold uppercase tracking-wider">Audited Node</span>
                          {payment.rejectionReason && (
                            <span className="text-[10px] text-red-400/70 font-medium truncate max-w-[150px]" title={payment.rejectionReason}>
                              Reason: {payment.rejectionReason}
                            </span>
                          )}
                        </div>
                      )}
                    </td>
                  </motion.tr>
                );
              })}
              {payments.length === 0 && ( //
                <tr>
                  <td colSpan="6" className="p-10 text-center text-gray-500 font-bold uppercase tracking-wider">No transactional records detected on cloud buffers.</td> {/* */}
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ==================== AUDIT REJECTION DROP-DOWN REASON INTERACTIVE MODAL ==================== */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.92, y: 15 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.92, y: 15 }} 
              className="glass-panel w-full max-w-md rounded-2xl border border-red-500/30 overflow-hidden shadow-2xl relative z-10 p-6 space-y-5"
            >
              <div className="flex justify-between items-center border-b border-white/5 pb-3">
                <h3 className="text-lg font-black text-white uppercase flex items-center gap-2 tracking-wide">
                  <AlertTriangle className="text-red-400" size={20} /> Operational Disapproval Audit
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white"><X size={18} /></button>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest">Select Certified Rejection Parameter</label>
                  <select 
                    value={selectedReason} 
                    onChange={(e) => setSelectedReason(e.target.value)}
                    className="w-full bg-[#001233] border border-white/10 text-white rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:border-red-500"
                  >
                    <option value="Wrong UTR Number / Digit Mismatch">Wrong UTR Number / Digit Mismatch</option>
                    <option value="Fake / Photoshop Edited Screenshot Proof">Fake / Photoshop Edited Screenshot Proof</option>
                    <option value="Incomplete Transaction / Insufficient Amount Deposited">Incomplete Transaction / Insufficient Amount Deposited</option>
                    <option value="Custom Processing Reason Block">Custom Processing Reason Block</option>
                  </select>
                </div>

                {selectedReason === 'Custom Processing Reason Block' && (
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest">Specify Detailed Custom Reason Code</label>
                    <textarea 
                      value={customReason}
                      onChange={(e) => setCustomReason(e.target.value)}
                      placeholder="Specify clear compliance instructions for the gamer..."
                      rows="3"
                      className="w-full bg-[#001233] border border-white/10 text-gray-300 rounded-xl px-4 py-3 text-sm font-medium outline-none resize-none focus:border-red-500"
                    />
                  </div>
                )}
              </div>

              <button
                onClick={() => {
                  const finalCompiledReason = selectedReason === 'Custom Processing Reason Block' ? customReason : selectedReason;
                  handleProcessApproval(activePaymentId, 'rejected', finalCompiledReason);
                }}
                className="w-full bg-red-600 hover:bg-red-500 text-white font-black text-sm py-3.5 rounded-xl uppercase tracking-widest shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 border border-red-400/20"
              >
                <XCircle size={16} /> Finalize Audit Disapproval
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default PageAdminPayments;
