import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Swal from "sweetalert2";
import { staffCheckIn, getTodayBookings, undoCheckIn } from "../../api/staff"; 
import { 
    FaQrcode, FaSearch, FaSyncAlt, FaUserCheck, FaBus, FaClock, 
    FaPrint, FaUndo, FaCheck, FaTimes, FaFilter, FaUsers
} from "react-icons/fa";

const StaffDashboard = () => {
    const [code, setCode] = useState("");
    const [bookings, setBookings] = useState([]);
    const [filteredBookings, setFilteredBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // State Filter
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL"); 

    // --- 1. FETCH DATA & STATISTIK ---
    const fetchBookings = async () => {
        setLoading(true);
        try {
            const data = await getTodayBookings();
            setBookings(data || []);
            setFilteredBookings(data || []);
        } catch (error) {
            console.error("Gagal load booking:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchBookings(); }, []);

    // --- 2. LOGIC FILTER JADWAL ---
    useEffect(() => {
        let result = bookings;

        // Filter by Search (Nama/Kode/Rute)
        if (searchTerm) {
            const lower = searchTerm.toLowerCase();
            result = result.filter(b => 
                b.booking_code.toLowerCase().includes(lower) ||
                (b.user?.name || "Guest").toLowerCase().includes(lower) ||
                (b.transport_schedule?.route || "").toLowerCase().includes(lower)
            );
        }

        // Filter by Status
        if (statusFilter === "CHECKED_IN") {
            result = result.filter(b => b.status === 'CHECKED_IN');
        } else if (statusFilter === "PENDING") {
            result = result.filter(b => b.status !== 'CHECKED_IN');
        }

        setFilteredBookings(result);
    }, [searchTerm, statusFilter, bookings]);

    // --- 3. HANDLE CHECK-IN ---
    const handleCheckIn = async (e) => {
        e.preventDefault();
        if(!code) return;
        
        try {
            await staffCheckIn(code);
            await Swal.fire({
                icon: 'success',
                title: 'Validasi Sukses',
                text: `Tiket ${code} berhasil Check-in.`,
                timer: 1500,
                showConfirmButton: false
            });
            setCode("");
            fetchBookings();
        } catch (error) {
            Swal.fire('Gagal', error.response?.data?.message || "Tiket invalid", 'error');
        }
    };

    // --- 4. HANDLE UNDO CHECK-IN ---
    const handleUndo = async (id, name) => {
        const result = await Swal.fire({
            title: 'Batalkan Check-in?',
            text: `Penumpang ${name} akan dikembalikan statusnya menjadi belum check-in.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Ya, Batalkan'
        });

        if (result.isConfirmed) {
            try {
                await undoCheckIn(id);
                Swal.fire('Dibatalkan', 'Status penumpang dikembalikan.', 'success');
                fetchBookings();
            } catch (error) {
                Swal.fire('Error', 'Gagal membatalkan check-in', 'error');
            }
        }
    };

    // --- 5. LOGIC STATISTIK HARIAN ---
    const stats = {
        total: bookings.length,
        checkedIn: bookings.filter(b => b.status === 'CHECKED_IN').length,
        pending: bookings.filter(b => b.status !== 'CHECKED_IN').length,
    };

    return (
        <div className="bg-[#F0F2F5] min-h-screen font-sans text-gray-800">
            <Navbar />
            
            <div className="max-w-7xl mx-auto p-6 py-10">
                
                {/* HEADER & PRINT BUTTON */}
                <div className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4 no-print">
                    <div>
                        <h1 className="text-3xl font-black text-gray-800 flex items-center gap-3">
                            <FaUserCheck className="text-[#0056D2]" /> Staff Dashboard
                        </h1>
                        <p className="text-gray-500 text-sm ml-1">Halo Staff, selamat bertugas.</p>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={fetchBookings} className="bg-white text-gray-600 px-4 py-2 rounded-xl shadow-sm font-bold flex items-center gap-2 hover:bg-gray-50 transition border border-gray-200">
                            <FaSyncAlt className={loading ? "animate-spin" : ""} /> Refresh
                        </button>
                        <button onClick={() => window.print()} className="bg-gray-800 text-white px-4 py-2 rounded-xl shadow-sm font-bold flex items-center gap-2 hover:bg-gray-900 transition">
                            <FaPrint /> Cetak Manifest
                        </button>
                    </div>
                </div>

                {/* STATISTIK HARIAN */}
                <div className="grid grid-cols-3 gap-4 mb-8 no-print">
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-blue-100 flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-500 font-bold uppercase">Total Penumpang</p>
                            <h3 className="text-2xl font-black text-[#0056D2]">{stats.total}</h3>
                        </div>
                        <FaUsers className="text-blue-200 text-3xl"/>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-green-100 flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-500 font-bold uppercase">Sudah Check-in</p>
                            <h3 className="text-2xl font-black text-green-600">{stats.checkedIn}</h3>
                        </div>
                        <FaCheck className="text-green-200 text-3xl"/>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-orange-100 flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-500 font-bold uppercase">Belum Hadir</p>
                            <h3 className="text-2xl font-black text-orange-600">{stats.pending}</h3>
                        </div>
                        <FaTimes className="text-orange-200 text-3xl"/>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    
                    {/* KIRI: SCANNER (Sembunyi saat Print) */}
                    <div className="lg:col-span-1 no-print h-fit sticky top-24">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-blue-100">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-blue-50 text-[#0056D2] rounded-xl"><FaQrcode size={24} /></div>
                                <div>
                                    <h2 className="font-bold text-lg text-gray-800">Scan Tiket</h2>
                                    <p className="text-xs text-gray-500">Validasi kedatangan.</p>
                                </div>
                            </div>
                            <form onSubmit={handleCheckIn} className="space-y-4">
                                <div>
                                    <div className="relative">
                                        <FaSearch className="absolute left-3 top-3.5 text-gray-400" />
                                        <input 
                                            className="w-full border-2 border-gray-200 p-3 pl-10 rounded-xl uppercase font-mono tracking-widest font-bold text-lg focus:border-[#0056D2] focus:outline-none transition"
                                            placeholder="TRX-..."
                                            value={code}
                                            onChange={(e) => setCode(e.target.value.toUpperCase())}
                                        />
                                    </div>
                                </div>
                                <button className="w-full bg-[#0056D2] hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition shadow-lg shadow-blue-200 flex justify-center items-center gap-2">
                                    <FaQrcode /> Proses Check-in
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* KANAN: MANIFEST & FILTER (Print Friendly) */}
                    <div className="lg:col-span-2">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            
                            {/* FILTER TOOLS */}
                            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 no-print">
                                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                    <FaBus className="text-orange-500"/> Manifest Penumpang
                                </h2>
                                <div className="flex gap-2 w-full sm:w-auto">
                                    <select 
                                        className="bg-gray-50 border border-gray-200 text-sm rounded-lg p-2.5 focus:ring-[#0056D2] focus:border-[#0056D2] outline-none"
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                    >
                                        <option value="ALL">Semua Status</option>
                                        <option value="CHECKED_IN">Sudah Check-in</option>
                                        <option value="PENDING">Belum Hadir</option>
                                    </select>
                                    <div className="relative w-full sm:w-48">
                                        <FaFilter className="absolute left-3 top-3 text-gray-400" size={12}/>
                                        <input 
                                            type="text" 
                                            placeholder="Filter Nama / Rute..." 
                                            className="w-full pl-8 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#0056D2]"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Judul Khusus Print */}
                            <div className="hidden print:block mb-6 text-center">
                                <h1 className="text-2xl font-bold">MANIFEST KEBERANGKATAN</h1>
                                <p>Tanggal: {new Date().toLocaleDateString('id-ID', {weekday:'long', year:'numeric', month:'long', day:'numeric'})}</p>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left border-collapse">
                                    <thead className="bg-gray-50 text-gray-500 font-bold uppercase text-[10px] tracking-wider">
                                        <tr>
                                            <th className="p-3 rounded-l-lg border-b">Kode</th>
                                            <th className="p-3 border-b">Penumpang</th>
                                            <th className="p-3 border-b">Rute</th>
                                            <th className="p-3 border-b text-center">Pembayaran</th>
                                            <th className="p-3 border-b text-center">Status</th>
                                            <th className="p-3 rounded-r-lg border-b text-center no-print">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {loading ? (
                                            <tr><td colSpan="6" className="p-8 text-center text-gray-400">Memuat data...</td></tr>
                                        ) : filteredBookings.length === 0 ? (
                                            <tr><td colSpan="6" className="p-8 text-center text-gray-400">Data tidak ditemukan.</td></tr>
                                        ) : (
                                            filteredBookings.map((b) => (
                                                <tr key={b.id} className="hover:bg-[#F8F9FC] transition-colors">
                                                    <td className="p-3 font-mono font-bold text-[#0056D2]">{b.booking_code}</td>
                                                    <td className="p-3">
                                                        <div className="font-bold text-gray-800">{b.user?.name || "Guest"}</div>
                                                        <div className="text-xs text-gray-400">{b.user?.email}</div>
                                                    </td>
                                                    <td className="p-3">
                                                        <div className="font-medium text-gray-700">{b.transport_schedule?.route}</div>
                                                        <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                                            <FaClock size={10}/> 
                                                            {b.transport_schedule?.departure_time ? new Date(b.transport_schedule.departure_time).toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'}) : '-'}
                                                        </div>
                                                    </td>
                                                    
                                                    {/* Validasi Pembayaran */}
                                                    <td className="p-3 text-center">
                                                        {b.payment_status === 'paid' ? (
                                                            <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded border border-green-100">LUNAS</span>
                                                        ) : (
                                                            <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded border border-red-100">BELUM</span>
                                                        )}
                                                    </td>

                                                    {/* Status Check-in */}
                                                    <td className="p-3 text-center">
                                                        {b.status === 'CHECKED_IN' ? (
                                                            <span className="inline-flex items-center gap-1 text-white bg-green-500 px-2 py-1 rounded text-[10px] shadow-sm">
                                                                <FaCheck/> HADIR
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center gap-1 text-gray-400 bg-gray-100 px-2 py-1 rounded text-[10px]">
                                                                <FaTimes/> ABSEN
                                                            </span>
                                                        )}
                                                    </td>

                                                    {/* Fitur Undo Check-in */}
                                                    <td className="p-3 text-center no-print">
                                                        {b.status === 'CHECKED_IN' && (
                                                            <button 
                                                                onClick={() => handleUndo(b.id, b.user?.name)}
                                                                className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded transition"
                                                                title="Batalkan Check-in"
                                                            >
                                                                <FaUndo />
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* CSS CSS Print Styles */}
                <style>{`
                    @media print { 
                        .no-print, nav { display: none !important; } 
                        body { background: white; -webkit-print-color-adjust: exact; }
                        .shadow-sm { box-shadow: none !important; border: 1px solid #ccc; }
                        /* Pastikan tabel tercetak rapi */
                        table { width: 100%; border-collapse: collapse; }
                        th, td { border: 1px solid #ddd; padding: 8px; }
                        th { background-color: #f3f4f6 !important; }
                    }
                `}</style>
            </div>
        </div>
    );
};

export default StaffDashboard;