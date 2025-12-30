import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import api from '../../api/axios';
import { exportURL, downloadExportData } from '../../api/admin'; 
import { 
    FaUsers, FaTicketAlt, FaMoneyBillWave, FaFileCsv, 
    FaArrowUp, FaCalendarCheck, FaWrench, FaBell, 
    FaTimesCircle, FaSpinner 
} from 'react-icons/fa';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, 
    Tooltip, ResponsiveContainer 
} from 'recharts';

const Dashboard = () => {
    const [stats, setStats] = useState({
        total_reservasi: 0,
        pendapatan: 0,
        user_count: 0,
        chart_data: [],
        recent_bookings: []
    });
    const [loading, setLoading] = useState(true);
    const [isDownloading, setIsDownloading] = useState(false);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const res = await api.get('/admin/dashboard');
                setStats(res.data);
            } catch (error) {
                console.error("Gagal memuat dashboard", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    const handleDownload = async () => {
        setIsDownloading(true);
        try {
            await downloadExportData();
        } catch (error) {
            alert("Gagal mengunduh laporan.");
        } finally {
            setIsDownloading(false);
        }
    };

    const StatCard = ({ title, value, icon: Icon, color, subText }) => (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 transition hover:shadow-md flex justify-between items-start">
            <div>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">{title}</p>
                <h3 className="text-2xl font-black text-gray-800 mt-2">{value}</h3>
                {subText && <p className="text-xs text-green-600 flex items-center gap-1 mt-2 font-medium"><FaArrowUp /> {subText}</p>}
            </div>
            <div className={`p-3 rounded-xl ${color} text-white shadow-lg`}>
                <Icon size={20} />
            </div>
        </div>
    );

    return (
        <div className="bg-[#F8F9FC] min-h-screen font-sans">
            <Navbar />
            
            <div className="max-w-7xl mx-auto p-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-gray-800">Admin Dashboard</h1>
                        <p className="text-gray-500 text-sm mt-1">Ringkasan performa bisnis Laju Transport.</p>
                    </div>
                    <button 
                        onClick={handleDownload}
                        disabled={isDownloading}
                        className="bg-[#0056D2] hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-blue-200 transition transform hover:-translate-y-1 text-sm disabled:opacity-70"
                    >
                        {isDownloading ? <FaSpinner className="animate-spin"/> : <FaFileCsv />} 
                        {isDownloading ? 'Downloading...' : 'Download Laporan'}
                    </button>
                </div>

                {/* Statistik Utama */}
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <StatCard 
                        title="Total Pendapatan" 
                        value={`Rp ${(stats.pendapatan || 0).toLocaleString('id-ID')}`} 
                        icon={FaMoneyBillWave} 
                        color="bg-gradient-to-br from-green-400 to-green-600"
                        subText="Verified Payments"
                    />
                    <StatCard 
                        title="Total Reservasi" 
                        value={`${stats.total_reservasi || 0} Tiket`} 
                        icon={FaTicketAlt} 
                        color="bg-gradient-to-br from-blue-400 to-blue-600"
                        subText="All Time"
                    />
                    <StatCard 
                        title="Pengguna Terdaftar" 
                        value={`${stats.user_count || 0} User`} 
                        icon={FaUsers} 
                        color="bg-gradient-to-br from-purple-400 to-purple-600"
                        subText="Active Accounts"
                    />
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    
                    {/* Grafik Pendapatan */}
                    <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <FaArrowUp className="text-green-500" /> Tren Pendapatan Bulanan
                        </h3>
                        
                        <div style={{ width: '100%', height: 300 }}>
                            {stats.chart_data && stats.chart_data.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={stats.chart_data}>
                                        <defs>
                                            <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#0056D2" stopOpacity={0.8}/>
                                                <stop offset="95%" stopColor="#0056D2" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} dy={10} />
                                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} tickFormatter={(val) => `${val/1000}k`} />
                                        <Tooltip contentStyle={{borderRadius: '10px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'}} formatter={(value) => `Rp ${value.toLocaleString('id-ID')}`} />
                                        <Area type="monotone" dataKey="total" stroke="#0056D2" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                                    Belum ada data transaksi.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Transaksi Terakhir */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-[400px]">
                        <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <FaCalendarCheck className="text-orange-500" /> Reservasi Terbaru
                        </h3>
                        <div className="space-y-4 overflow-y-auto flex-1 pr-2 custom-scrollbar">
                            {stats.recent_bookings && stats.recent_bookings.length > 0 ? (
                                stats.recent_bookings.map((booking) => (
                                    <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                                        <div>
                                            <p className="font-bold text-sm text-gray-800 font-mono">{booking.booking_code}</p>
                                            <p className="text-[10px] text-gray-500">{booking.user?.name || 'Guest'}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-sm text-[#0056D2]">
                                                Rp {parseInt(booking.total_price).toLocaleString('id-ID')}
                                            </p>
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                                                booking.status === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                            }`}>
                                                {booking.status}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-gray-400 text-sm py-10">Belum ada data transaksi.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Kontrol Sistem */}
                <div className="mt-8">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div>
                            <h3 className="font-bold text-gray-800 flex items-center gap-2"><FaWrench className="text-gray-400"/> System Utilities</h3>
                            <p className="text-sm text-gray-500">Fitur teknis untuk maintenance dan notifikasi sistem.</p>
                        </div>
                        <div className="flex gap-3">
                            <button onClick={() => api.post('/admin/maintenance').then(res => alert(res.data.message))} className="bg-red-50 text-red-600 px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-red-100 transition border border-red-100 flex items-center gap-2">
                                <FaTimesCircle/> Maintenance Mode
                            </button>
                            <button onClick={() => api.post('/admin/trigger-reminders').then(res => alert(res.data.message))} className="bg-blue-50 text-blue-600 px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-100 transition border border-blue-100 flex items-center gap-2">
                                <FaBell/> Kirim Reminder (H-1)
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Dashboard;