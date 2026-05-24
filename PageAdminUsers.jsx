// PageAdminUsers.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ref, onValue, update } from 'firebase/database';
import { db } from './firebase.jsx'; //
import { Users, Search, Award, TrendingUp, ShieldAlert, ShieldCheck, Ban, UserCheck } from 'lucide-react';
import toast from 'react-hot-toast';

const PageAdminUsers = () => {
  const [userStats, setUserStats] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); //
  const [isLoading, setIsLoading] = useState(true); //
  
  // 🚀 ADVANCED: Data Aggregation & User Profile Joining Engine
  useEffect(() => {
    const paymentsRef = ref(db, 'payments'); //
    const accountsRef = ref(db, 'users'); // Reference metadata configurations mapping node

    // Bind onValue to handle reactive joins across database clusters
    const unsubscribePayments = onValue(paymentsRef, (paymentsSnapshot) => {
      const paymentsData = paymentsSnapshot.val() || {};
      
      const unsubscribeUsers = onValue(accountsRef, (usersSnapshot) => {
        const usersData = usersSnapshot.val() || {};
        const usersMap = {}; //
        
        // Loop through all database-registered authorization user node profiles
        Object.keys(usersData).forEach(uidKey => {
          const profileNode = usersData[uidKey];
          usersMap[uidKey] = {
            uid: uidKey,
            email: profileNode.email || 'unknown@gamer.com',
            role: profileNode.role || 'user',
            status: profileNode.status || 'active',
            totalOrders: 0, //
            totalSpent: 0, //
            approvedOrders: 0, //
            lastActive: profileNode.createdAt || Date.now() //
          };
        });

        // Loop through metrics to calculate aggregation variables matching transactional logs
        Object.keys(paymentsData).forEach(key => {
          const payment = paymentsData[key]; //
          const uid = payment.userId; //
          
          // Fallback context instantiation if user record has incomplete account logs
          if (!usersMap[uid]) {
            usersMap[uid] = {
              uid: uid, //
              email: payment.userEmail, //
              role: 'user',
              status: 'active',
              totalOrders: 0, //
              totalSpent: 0, //
              approvedOrders: 0, //
              lastActive: payment.timestamp //
            };
          }
          
          usersMap[uid].totalOrders += 1; //
          
          if (payment.status === 'approved') { //
            usersMap[uid].approvedOrders += 1; //
            usersMap[uid].totalSpent += Number(payment.price || 0); //
          }
          
          if (payment.timestamp > usersMap[uid].lastActive) { //
            usersMap[uid].lastActive = payment.timestamp; //
          }
        });
        
        const usersArray = Object.values(usersMap); //
        usersArray.sort((a, b) => b.totalSpent - a.totalSpent); // Sort array context matching expenditure curves
        setUserStats(usersArray);
        setIsLoading(false); //
      });

      return () => unsubscribeUsers();
    });
    
    return () => unsubscribePayments(); //
  }, []);

  // 🔐 Full-Stack Interceptor: Account Banning/Blocking Core Trigger Switch
  const toggleUserAccessState = async (targetUid, currentStatusString, targetEmail) => {
    if(targetUid === import.meta.env.VITE_ADMIN_UID) {
      toast.error("Operation Denied: The primary master admin shield cannot be deactivated!");
      return;
    }

    const nextStatus = currentStatusString === 'banned' ? 'active' : 'banned';
    const confirmationPrompt = `Are you absolutely sure you want to change the access credentials for ${targetEmail} to ${nextStatus.toUpperCase()} status?`;
    
    if(window.confirm(confirmationPrompt)) {
      const operationsToast = toast.loading(`Altering user authentication matrix hooks...`);
      try {
        await update(ref(db, `users/${targetUid}`), { status: nextStatus });
        toast.success(`User access configuration successfully shifted to ${nextStatus}!`, { id: operationsToast });
      } catch (err) {
        toast.error("Database structural override failed: " + err.message, { id: operationsToast });
      }
    }
  };

  // 👑 Full-Stack Interceptor: Role Promotion / Demotion (Make Admin Feature Matrix)
  const toggleUserRolePrivileges = async (targetUid, currentRoleString, targetEmail) => {
    if(targetUid === import.meta.env.VITE_ADMIN_UID) {
      toast.error("Constraint Violation: Master root authorization configuration parameters are persistent!");
      return;
    }

    const nextRole = currentRoleString === 'admin' ? 'user' : 'admin';
    const confirmationPrompt = `CRITICAL CLEARANCE INSTRUCTION:\nDo you intend to modify roles for ${targetEmail} to structural ${nextRole.toUpperCase()} privilege parameters?`;

    if(window.confirm(confirmationPrompt)) {
      const roleToastId = toast.loading("Altering authorization level index hashes...");
      try {
        await update(ref(db, `users/${targetUid}`), { role: nextRole });
        toast.success(`Authorization mapping assigned successfully as ${nextRole.toUpperCase()}!`, { id: roleToastId });
      } catch (err) {
        toast.error("Authorization update dropped by cluster: " + err.message, { id: roleToastId });
      }
    }
  };
  
  // 🔍 Smart Search filter interface matching emails or explicit UID patterns
  const filteredUsers = userStats.filter(user =>
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) || //
    user.uid.toLowerCase().includes(searchQuery.toLowerCase()) //
  );
  
  const VIP_THRESHOLD = 500; //
  
  return (
    <div className="p-4 sm:p-8 w-full max-w-7xl mx-auto select-none">
      
      {/* Header section interface */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-white/5 pb-6"> {/* */}
        <div>
          <h1 className="text-3xl font-black text-pureWhite flex items-center gap-3 uppercase tracking-wider"> {/* */}
            <Users className="text-blue-500" size={32} /> INTEL SYSTEM REGISTRY DATABASE {/* */}
          </h1>
          <p className="text-gray-400 mt-1 text-sm font-medium">Monitor active gamer profile vectors, transaction values, and access parameters.</p> {/* */}
        </div>

        {/* 🔍 Smart Search Bar controller field */}
        <div className="relative w-full md:w-80"> {/* */}
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} /> {/* */}
          <input 
            type="text" 
            placeholder="Filter profiles by Email or Unique UID..." 
            value={searchQuery} //
            onChange={(e) => setSearchQuery(e.target.value)} //
            className="w-full bg-[#001233]/80 border border-white/10 text-white rounded-xl pl-10 pr-4 py-3.5 focus:outline-none focus:border-blue-500 text-xs font-semibold font-mono tracking-wide shadow-glass" //
          />
        </div>
      </div>

      {/* 📊 High-Capacity Analytics Card Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"> {/* */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-panel p-6 rounded-2xl border-l-4 border-blue-500 shadow-xl"> {/* */}
          <p className="text-gray-400 text-xs font-black uppercase tracking-wider mb-2 flex items-center gap-2"><Users size={14}/> Unique Registered Accounts</p> {/* */}
          <h3 className="text-3xl font-black text-pureWhite font-mono">{userStats.length}</h3> {/* */}
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-panel p-6 rounded-2xl border-l-4 border-yellow-500 shadow-xl"> {/* */}
          <p className="text-gray-400 text-xs font-black uppercase tracking-wider mb-2 flex items-center gap-2"><Award size={14}/> Verified Whitelisted VIP Assets</p> {/* */}
          <h3 className="text-3xl font-black text-pureWhite font-mono"> {/* */}
            {userStats.filter(u => u.totalSpent >= VIP_THRESHOLD).length} {/* */}
          </h3>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-panel p-6 rounded-2xl border-l-4 border-green-500 shadow-xl"> {/* */}
          <p className="text-gray-400 text-xs font-black uppercase tracking-wider mb-2 flex items-center gap-2"><TrendingUp size={14}/> Maximum Liquidity Yield (Top Spender)</p> {/* */}
          <h3 className="text-3xl font-black text-emerald-400 font-mono flex items-center gap-1"> {/* */}
            ₹{userStats.length > 0 ? userStats[0].totalSpent : 0} {/* */}
          </h3>
        </motion.div>
      </div>

      {/* 📋 Re-Architected Master Data Table System */}
      {isLoading ? ( //
        <div className="flex justify-center py-20"> {/* */}
          <div className="w-12 h-12 border-4 border-[#001233] border-t-blue-500 rounded-full animate-spin"></div> {/* */}
        </div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-panel rounded-3xl border border-white/10 overflow-hidden shadow-2xl"> {/* */}
          <div className="overflow-x-auto custom-scrollbar"> {/* */}
            <table className="w-full text-left border-collapse min-w-[1000px]"> {/* */}
              <thead>
                <tr className="bg-[#001233] text-gray-400 text-xs uppercase tracking-widest border-b border-white/10"> {/* */}
                  <th className="p-5 font-black">Gamer Profiler Identifiers</th> {/* */}
                  <th className="p-5 font-black text-center">Requests Sync Count</th> {/* */}
                  <th className="p-5 font-black text-center">Approved Access Logs</th> {/* */}
                  <th className="p-5 font-black text-right">Aggregated Investment</th> {/* */}
                  <th className="p-5 font-black text-center">Privilege Tag</th> {/* */}
                  <th className="p-5 font-black text-right">Ecosystem Shield Access Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm"> {/* */}
                {filteredUsers.length === 0 ? ( //
                  <tr>
                    <td colSpan="6" className="p-12 text-center text-gray-500 font-bold uppercase tracking-wider"> {/* */}
                      <ShieldAlert size={40} className="mx-auto mb-3 opacity-30 animate-bounce" /> {/* */}
                      Zero security matrix maps match query: "{searchQuery}" {/* */}
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user, index) => { //
                    const isAccountBanned = user.status === 'banned';
                    const isAccountAdmin = user.role === 'admin';
                    
                    return (
                      <motion.tr //
                        initial={{ opacity: 0, y: 10 }} //
                        animate={{ opacity: 1, y: 0 }} //
                        transition={{ delay: index * 0.03 }} //
                        key={user.uid} //
                        className={`border-b border-white/5 hover:bg-white/5 transition-colors group ${isAccountBanned ? 'bg-red-950/10 opacity-60' : ''}`} //
                      >
                        {/* Profile Block Column */}
                        <td className="p-5"> {/* */}
                          <div className="flex items-center gap-3"> {/* */}
                            <div className={`w-10 h-10 rounded-full border flex items-center justify-center font-black uppercase shadow-inner ${
                              isAccountAdmin 
                                ? 'bg-red-600/10 border-red-500/30 text-red-400' 
                                : isAccountBanned 
                                ? 'bg-gray-800 border-red-600/30 text-red-600' 
                                : 'bg-blue-600/20 border-blue-500/30 text-blue-400'
                            }`}>
                              {user.email.charAt(0)} {/* */}
                            </div>
                            <div>
                              <p className="text-pureWhite font-black flex items-center gap-1.5 text-xs sm:text-sm"> {/* */}
                                {user.email} {/* */}
                                {user.totalSpent >= VIP_THRESHOLD && <Award size={14} className="text-yellow-400 fill-yellow-400/10" title="VIP Status Verified" />} {/* */}
                              </p>
                              <p className="text-[10px] text-gray-500 font-mono font-bold mt-0.5 tracking-wider">UID: {user.uid}</p> {/* */}
                            </div>
                          </div>
                        </td>
                        
                        <td className="p-5 text-center text-gray-400 font-black font-mono">{user.totalOrders}</td> {/* */}
                        <td className="p-5 text-center text-green-400 font-black font-mono">{user.approvedOrders}</td> {/* */}
                        
                        <td className="p-5 text-right"> {/* */}
                          <span className="bg-green-500/10 text-green-400 px-3 py-1.5 rounded-xl font-mono font-black border border-green-500/20 shadow-md"> {/* */}
                            ₹{user.totalSpent} {/* */}
                          </span>
                        </td>
                        
                        <td className="p-5 text-center"> {/* */}
                          {isAccountAdmin ? (
                            <span className="inline-flex items-center gap-1 bg-red-500/10 text-red-400 text-[10px] font-black uppercase px-3 py-1 rounded-full border border-red-500/30 shadow-md">
                              <ShieldCheck size={12} /> Master Admin
                            </span>
                          ) : user.totalSpent >= VIP_THRESHOLD ? ( //
                            <span className="inline-flex items-center gap-1 bg-gradient-to-r from-yellow-600/20 to-yellow-400/20 text-yellow-400 text-[10px] font-black uppercase px-3 py-1 rounded-full border border-yellow-500/40 shadow-[0_0_10px_rgba(250,204,21,0.2)]"> {/* */}
                              <Award size={12} /> VIP Gamer {/* */}
                            </span>
                          ) : (
                            <span className="bg-gray-500/10 text-gray-400 text-[10px] font-black uppercase px-3 py-1 rounded-full border border-gray-500/20"> {/* */}
                              Standard Node {/* */}
                            </span>
                          )}
                        </td>

                        {/* ==================== FULL-STACK ACTION TOGGLE CONTROLLERS ==================== */}
                        <td className="p-5 text-right">
                          <div className="flex justify-end gap-2">
                            {/* Toggle Access Authority: Make Admin button */}
                            <button
                              type="button"
                              onClick={() => toggleUserRolePrivileges(user.uid, user.role, user.email)}
                              className={`p-2.5 rounded-xl border font-bold text-xs transition-all active:scale-90 shadow-md flex items-center justify-center ${
                                isAccountAdmin
                                  ? 'bg-amber-600/10 border-amber-500/30 text-amber-400 hover:bg-amber-600 hover:text-white'
                                  : 'bg-blue-600/10 border-blue-500/20 text-blue-400 hover:bg-blue-600 hover:text-white'
                              }`}
                              title={isAccountAdmin ? "Demote Access Level" : "Promote to Admin Role"}
                            >
                              {isAccountAdmin ? <UserCheck size={14} /> : <ShieldCheck size={14} />}
                            </button>

                            {/* Toggle Ban Shield State Account Button */}
                            <button
                              type="button"
                              onClick={() => toggleUserAccessState(user.uid, user.status, user.email)}
                              className={`p-2.5 rounded-xl border font-bold text-xs transition-all active:scale-90 shadow-md flex items-center justify-center ${
                                isAccountBanned
                                  ? 'bg-green-600 hover:bg-green-500 text-white border-green-500/20'
                                  : 'bg-red-500/5 border-red-500/20 text-red-400 hover:bg-red-600 hover:text-white'
                              }`}
                              title={isAccountBanned ? "Unban Profile Node" : "Ban Account Network Entry"}
                            >
                              <Ban size={14} />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default PageAdminUsers;
