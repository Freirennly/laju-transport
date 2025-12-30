import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import api from '../../api/axios';
import { useParams } from 'react-router-dom';
import { FaPrint, FaUsers, FaClock, FaMapMarkerAlt, FaCheckCircle, FaTimesCircle, FaArrowLeft } from 'react-icons/fa';

/**
 * Halaman Manifest Penumpang (Staff View)
 * Menampilkan daftar penumpang untuk jadwal tertentu
 */
const Manifest = () => {
    const { scheduleId } = useParams(); 
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchManifest = async () => {
            setLoading(true);
            try {
                // Pastikan endpoint backend ini mengembalikan struktur { schedule_info, total_passengers, manifest }
                const res = await api.get(`/staff/manifest/${scheduleId}`);
                setData(res.data);
            } catch (err) {
                console.error("Gagal memuat manifest", err);
                setError(err.response?.data?.message || "Gagal memuat data manifest.");
            } finally {
                setLoading(false);
            }
        };

        if (scheduleId) {
            fetchManifest();
        }
    }, [scheduleId]);

    // --- Loading State ---
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-gray-500 font-bold animate-pulse">Memuat Data Manifest...</div>
            </div>
        );
    }

    // --- Error State ---
    if (error || !data) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md w-full">
                    <div className="text-red-500 text-5xl mb-4"><FaTimesCircle /></div>
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Data Tidak Ditemukan</h2>
                    <p className="text-gray-500 mb-6">{error || "Data manifest tidak tersedia."}</p>
                    <button onClick={() => window.history.back()} className="bg-gray-800 text-white px-6 py-2 rounded-lg font-bold hover:bg-gray-700 transition">
                        Kembali
                    </button>
                </div>
            </div>
        );
    }

    // --- Data Destructuring (Safety Check) ---
    const { schedule_info, total_passengers, manifest = [] } = data;

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Navbar />
            
            <div className="max-w-5xl mx-auto p-4 md:p-8 bg-white mt-4 md:mt-10 shadow-lg rounded-xl print:shadow-none print:mt-0 print:p-0 print:w-full">
                
                {/* Header Manifest */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b pb-6 gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2 no-print">
                            <button onClick={() => window.history.back()} className="text-gray-400 hover:text-gray-600 transition">
                                <FaArrowLeft />
                            </button>
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Detail Perjalanan</span>
                        </div>
                        <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2 uppercase">
                            <FaUsers className="text-[#0056D2]" /> MANIFEST PENUMPANG
                        </h1>
                        <div className="flex items-center gap-2 text-gray-600 mt-2 font-medium">
                            <FaMapMarkerAlt className="text-red-500" /> 
                            {schedule_info?.route || "Rute Tidak Diketahui"}
                        </div>
                    </div>
                    
                    <div className="text-left md:text-right bg-blue-50 p-4 rounded-xl border border-blue-100 print:border-none print:bg-transparent print:p-0">
                        <div className="flex items-center gap-2 text-lg font-mono font-bold text-gray-700">
                            <FaClock className="text-[#0056D2]" /> 
                            {schedule_info?.departure_time 
                                ? new Date(schedule_info.departure_time).toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'short' })
                                : "-"
                            }
                        </div>
                        <p className="font-bold text-[#0056D2] mt-1 text-sm uppercase tracking-wider">
                            Total Penumpang: <span className="text-xl">{total_passengers || 0}</span> Pax
                        </p>
                    </div>
                </div>

                {/* Tabel Penumpang */}
                <div className="overflow-x-auto rounded-lg border border-gray-100">
                    <table className="w-full text-left text-sm border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b text-gray-500 uppercase tracking-wider text-xs">
                                <th className="p-4 font-bold text-center w-16">No</th>
                                <th className="p-4 font-bold">Nama Pemesan</th>
                                <th className="p-4 font-bold">Kode Booking</th>
                                <th className="p-4 font-bold text-center">Kursi</th>
                                <th className="p-4 font-bold text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {manifest.length > 0 ? (
                                manifest.map((m, i) => (
                                    <tr key={i} className="hover:bg-[#F8F9FC] transition-colors">
                                        <td className="p-4 text-center text-gray-500 font-mono">{i + 1}</td>
                                        <td className="p-4">
                                            <div className="font-bold text-gray-800">{m.user?.name || "Guest"}</div>
                                            <div className="text-xs text-gray-400">{m.user?.email || "-"}</div>
                                        </td>
                                        <td className="p-4 font-mono font-bold text-[#0056D2]">{m.booking_code}</td>
                                        <td className="p-4 text-center font-bold text-gray-700">{m.passengers_count}</td>
                                        <td className="p-4 text-center">
                                            {m.status === 'CHECKED_IN' ? (
                                                <span className="inline-flex items-center gap-1 text-green-700 font-bold bg-green-50 px-3 py-1 rounded-full text-[10px] border border-green-200">
                                                    <FaCheckCircle /> HADIR
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 text-gray-500 bg-gray-100 px-3 py-1 rounded-full text-[10px] border border-gray-200">
                                                    <FaTimesCircle /> BELUM
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-gray-400">
                                        Belum ada penumpang terdaftar untuk jadwal ini.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer Print & Info */}
                <div className="mt-8 flex justify-between items-center no-print pt-6 border-t border-gray-100">
                    <p className="text-xs text-gray-400 italic">
                        *Data manifest ini bersifat rahasia. Harap jaga kerahasiaan data penumpang.
                    </p>
                    <button 
                        onClick={() => window.print()} 
                        className="bg-gray-900 hover:bg-black text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    >
                        <FaPrint /> Cetak Dokumen
                    </button>
                </div>
            </div>
            
            {/* CSS Khusus Print */}
            <style>{`
                @media print { 
                    .no-print, nav { display: none !important; } 
                    body { background: white; -webkit-print-color-adjust: exact; }
                    .shadow-lg { box-shadow: none !important; border: 1px solid #000; }
                    table { width: 100%; }
                    th, td { border: 1px solid #ccc; padding: 8px; }
                    th { background-color: #f0f0f0 !important; }
                }
            `}</style>
        </div>
    );
};

export default Manifest;