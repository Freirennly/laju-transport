import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import api from "../../api/axios";
import Swal from "sweetalert2";
import { FaCheckCircle, FaQrcode, FaSearch, FaEnvelope, FaTicketAlt } from "react-icons/fa";

const CheckIn = () => {
    const [code, setCode] = useState("");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [successData, setSuccessData] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccessData(null);

        try {
            // Kirim request ke backend
            const { data } = await api.post('/check-in', {
                booking_code: code,
                email: email
            });

            // Set data sukses
            setSuccessData(data.data);

            Swal.fire({
                icon: "success",
                title: "Check-in Berhasil!",
                text: `Selamat jalan, ${data.data.passenger_name}!`,
                timer: 3000,
                showConfirmButton: false
            });

        } catch (err) {
            console.error("Checkin Error:", err);
            
            // Ambil pesan error spesifik dari backend
            const errorMessage = err.response?.data?.message || "Terjadi kesalahan sistem.";

            Swal.fire({
                icon: "error",
                title: "Gagal Check-in",
                text: errorMessage, // Tampilkan alasan kenapa gagal (Email salah / Status salah)
                confirmButtonColor: "#d33"
            });
        } finally {
            setLoading(false);
        }
    };

    // ... (Sisa kode UI return sama seperti sebelumnya)
    return (
        <div className="bg-[#F7F9FA] min-h-screen font-sans">
            <Navbar />

            <div className="flex items-center justify-center py-20 px-6">
                <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-gray-100">
                    
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-blue-50 text-[#0056D2] rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                            <FaQrcode />
                        </div>
                        <h1 className="text-2xl font-black text-gray-800">Check-in Online</h1>
                        <p className="text-gray-500 mt-2 text-sm">Validasi tiket Anda sebelum keberangkatan.</p>
                    </div>

                    {!successData ? (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-xs font-bold text-gray-600 uppercase mb-2">Kode Booking</label>
                                <div className="relative">
                                    <FaTicketAlt className="absolute left-4 top-3.5 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="TRX-..."
                                        className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1BA0E2] outline-none transition font-mono uppercase font-bold"
                                        value={code}
                                        onChange={(e) => setCode(e.target.value.toUpperCase())}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-600 uppercase mb-2">Email Pemesan</label>
                                <div className="relative">
                                    <FaEnvelope className="absolute left-4 top-3.5 text-gray-400" />
                                    <input
                                        type="email"
                                        placeholder="email@anda.com"
                                        className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1BA0E2] outline-none transition"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <p className="text-[10px] text-gray-400 mt-1 ml-1">*Email harus sesuai dengan saat pemesanan.</p>
                            </div>

                            <button 
                                type="submit" 
                                disabled={loading}
                                className={`w-full py-3.5 rounded-xl font-bold text-white shadow-lg transition transform hover:-translate-y-1 flex justify-center items-center gap-2 ${
                                    loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#1BA0E2] hover:bg-[#008AC9] shadow-blue-500/30"
                                }`}
                            >
                                {loading ? "Memproses..." : <><FaSearch /> Cek Tiket Saya</>}
                            </button>
                        </form>
                    ) : (
                        // SUCCESS STATE
                        <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center animate-fade-in">
                            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                                <FaCheckCircle />
                            </div>
                            <h2 className="text-xl font-bold text-green-800 mb-1">Check-in Sukses!</h2>
                            <p className="text-green-600 text-sm mb-6">Silakan tunjukkan layar ini kepada petugas.</p>
                            
                            <div className="bg-white rounded-xl p-4 shadow-sm text-left space-y-3 border border-gray-200 border-dashed relative overflow-hidden">
                                <div className="flex justify-between border-b pb-2 border-dashed border-gray-200">
                                    <span className="text-xs text-gray-500 font-bold">KODE BOOKING</span>
                                    <span className="font-mono font-bold text-gray-800">{successData.booking_code}</span>
                                </div>
                                <div className="flex justify-between border-b pb-2 border-dashed border-gray-200">
                                    <span className="text-xs text-gray-500 font-bold">PENUMPANG</span>
                                    <span className="font-bold text-gray-800 text-right">{successData.passenger_name}</span>
                                </div>
                                <div className="flex justify-between items-center pt-1">
                                    <span className="text-xs text-gray-500 font-bold">RUTE</span>
                                    <span className="text-sm font-bold text-gray-700 text-right">{successData.route}</span>
                                </div>
                                <div className="mt-4 pt-2 text-center">
                                    <span className="text-xs font-bold bg-green-100 text-green-700 px-3 py-1 rounded-full uppercase tracking-wider">
                                        {successData.status}
                                    </span>
                                </div>
                            </div>

                            <button 
                                onClick={() => { setSuccessData(null); setCode(""); setEmail(""); }}
                                className="mt-6 text-sm text-gray-500 hover:text-[#1BA0E2] font-bold underline transition-colors"
                            >
                                Check-in tiket lain
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CheckIn;