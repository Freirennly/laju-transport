import React, { useState, useEffect, useCallback } from 'react';
import { FaBell } from 'react-icons/fa';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext'; 

const NotificationBell = () => {
    const { user, logout } = useAuth(); 
    const [notifs, setNotifs] = useState([]);
    const [show, setShow] = useState(false);

    // Gunakan useCallback untuk menstabilkan referensi fungsi
    const fetchNotifs = useCallback(async () => {
        if (!user) return; 

        try {
            const { data } = await api.get('/notifications');
            // Pastikan data selalu array
            setNotifs(Array.isArray(data) ? data : (data.data || []));
        } catch (error) {
            // Jika Unauthorized (Token Expired), logout otomatis via AuthContext
            if (error.response && error.response.status === 401) {
                console.error("Session expired, logging out...");
                logout(); 
            }
        }
    }, [user, logout]);

    // Setup Polling
    useEffect(() => {
        if (user) {
            fetchNotifs();
            // Polling setiap 60 detik
            const interval = setInterval(fetchNotifs, 60000); 
            return () => clearInterval(interval);
        }
    }, [user, fetchNotifs]);

    const handleRead = async (id) => {
        try {
            // Optimistic update: Update UI duluan biar cepat
            setNotifs(prev => prev.map(n => n.id === id ? { ...n, is_read: 1 } : n));
            await api.post(`/notifications/${id}/read`);
        } catch (error) {
            console.error("Gagal update status notifikasi", error);
            // Revert state jika perlu, tapi untuk 'read' biasanya tidak kritis
        }
    };

    // Pastikan tidak render apa-apa jika user belum login
    if (!user) return null;

    // Hitung unread (pastikan n.is_read diperlakukan sebagai boolean/integer)
    const unreadCount = notifs.filter(n => !n.is_read || n.is_read == 0).length;

    return (
        <div className="relative">
            <button 
                onClick={() => setShow(!show)} 
                className="relative text-gray-500 hover:text-[#0056D2] transition p-2 focus:outline-none"
            >
                <FaBell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full animate-pulse border-2 border-white">
                        {unreadCount}
                    </span>
                )}
            </button>

            {show && (
                <>
                    {/* Overlay transparan untuk menutup dropdown saat klik di luar */}
                    <div className="fixed inset-0 z-40 cursor-default" onClick={() => setShow(false)}></div>
                    
                    <div className="absolute right-0 mt-3 w-80 bg-white shadow-xl rounded-xl border border-gray-100 overflow-hidden z-50 animate-fade-in-up">
                        <div className="p-3 bg-gray-50 border-b font-bold text-sm text-gray-700 flex justify-between items-center">
                            <span>Notifikasi</span>
                            <button 
                                onClick={fetchNotifs} 
                                className="text-[#0056D2] text-xs hover:underline cursor-pointer"
                            >
                                Refresh
                            </button>
                        </div>
                        
                        <div className="max-h-80 overflow-y-auto custom-scrollbar">
                            {notifs.length === 0 ? (
                                <div className="p-8 text-center text-xs text-gray-400">
                                    Tidak ada notifikasi baru
                                </div>
                            ) : (
                                notifs.map(n => (
                                    <div 
                                        key={n.id} 
                                        onClick={() => handleRead(n.id)}
                                        className={`p-4 border-b text-sm cursor-pointer transition-colors hover:bg-gray-50 ${
                                            !n.is_read ? 'bg-blue-50/50 border-l-4 border-l-[#0056D2]' : 'text-gray-600 border-l-4 border-l-transparent'
                                        }`}
                                    >
                                        <div className="font-bold text-gray-800 mb-1">{n.title}</div>
                                        <div className="text-xs leading-relaxed mb-2 text-gray-600">{n.message}</div>
                                        <div className="text-[10px] text-gray-400 text-right">
                                            {new Date(n.created_at).toLocaleString('id-ID', { 
                                                day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' 
                                            })}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default NotificationBell;