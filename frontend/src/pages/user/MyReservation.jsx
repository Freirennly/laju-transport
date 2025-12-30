import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Navbar from "../../components/Navbar";
import { fetchMyReservations, payReservation, cancelReservation } from "../../api/reservation";
import { QRCodeCanvas } from "qrcode.react";
import api from "../../api/axios";
import { FaTicketAlt, FaQrcode, FaStar, FaMapMarkerAlt, FaUsers, FaMoneyBillWave } from "react-icons/fa";

const MyReservation = ({ isEmbedded = false }) => {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadData = () => {
        setLoading(true);
        fetchMyReservations()
            .then((data) => {
                setReservations(data || []); // Pastikan selalu array
            })
            .catch((error) => {
                console.error("Error:", error);
                Swal.fire("Error", "Gagal memuat data", "error");
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        loadData();
    }, []);

    const handlePay = async (id, code) => {
        const result = await Swal.fire({
            title: "Konfirmasi Pembayaran",
            text: `Bayar tiket ${code} sekarang?`,
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Ya, Bayar!",
            confirmButtonColor: "#1BA0E2",
        });

        if (result.isConfirmed) {
            try {
                await payReservation(id);
                Swal.fire("Berhasil", "Pembayaran sukses!", "success");
                loadData();
            } catch (error) {
                Swal.fire("Gagal", error.response?.data?.message || "Error", "error");
            }
        }
    };

    const handleCancel = async (id) => {
        const { value: reason } = await Swal.fire({
            title: "Ajukan Pembatalan",
            input: "text",
            inputLabel: "Alasan Pembatalan",
            inputPlaceholder: "Contoh: Salah jadwal, sakit, dll...",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            confirmButtonText: "Kirim Pengajuan",
            inputValidator: (value) => {
                if (!value) return "Alasan wajib diisi!";
                if (value.length < 5) return "Alasan minimal 5 karakter.";
            },
        });

        if (reason) {
            try {
                await cancelReservation(id, reason);
                Swal.fire("Terkirim", "Pengajuan pembatalan dikirim ke admin.", "success");
                loadData(); 
            } catch (error) {
                const msg = error.response?.data?.message || "Gagal mengajukan pembatalan.";
                Swal.fire("Gagal", msg, "error");
            }
        }
    };
    
    const handleReview = async (id) => {
        const { value: rating } = await Swal.fire({
            title: 'Beri Rating Layanan',
            input: 'range',
            inputLabel: 'Geser untuk memberi bintang (1-5)',
            inputAttributes: { min: 1, max: 5, step: 1 },
            inputValue: 5
        });
        
        if (rating) {
            const { value: comment } = await Swal.fire({
                input: 'textarea',
                inputLabel: 'Komentar Anda',
                inputPlaceholder: 'Tulis pengalaman Anda...'
            });
            
            try {
                await api.post('/reviews', { reservation_id: id, rating, comment });
                Swal.fire('Terima Kasih!', 'Ulasan Anda membantu kami berkembang.', 'success');
            } catch (error) {
                Swal.fire('Gagal', 'Gagal mengirim ulasan.', 'error');
            }
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'BOOKED': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'PAID': return 'bg-green-100 text-green-700 border-green-200';
            case 'CHECKED_IN': return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'CANCELLED': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    return (
        <div className={isEmbedded ? "" : "bg-[#F7F9FA] min-h-screen font-sans"}>
            {!isEmbedded && <Navbar />}

            <div className={isEmbedded ? "" : "max-w-4xl mx-auto p-6 py-10"}>
                {!isEmbedded && (
                    <h1 className="text-2xl font-bold text-gray-800 mb-6 border-l-4 border-[#1BA0E2] pl-4 flex items-center gap-2">
                        <FaTicketAlt /> Tiket Saya
                    </h1>
                )}

                {loading ? (
                    <p className="text-center text-gray-500 py-10 animate-pulse">Memuat tiket...</p>
                ) : reservations.length === 0 ? (
                    <div className="bg-white p-10 rounded-2xl shadow-sm text-center border border-gray-200 border-dashed">
                        <p className="text-gray-400 mb-4">Anda belum memiliki riwayat pemesanan.</p>
                        <a href="/reservasi" className="text-[#1BA0E2] font-bold hover:underline">Pesan Tiket Baru</a>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {reservations.map((item) => (
                            <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition">
                                
                                <div className="bg-gray-50 px-6 py-4 flex justify-between items-center border-b border-gray-100">
                                    <div>
                                        <span className="text-xs text-gray-500 block font-bold tracking-wide">KODE BOOKING</span>
                                        <span className="font-mono font-bold text-lg text-gray-800">{item.booking_code}</span>
                                    </div>
                                    <div className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyle(item.status)}`}>
                                        {item.status}
                                    </div>
                                </div>

                                <div className="p-6 grid md:grid-cols-3 gap-6">
                                    <div className="md:col-span-2">
                                        <h3 className="font-bold text-xl text-gray-800 mb-1 flex items-center gap-2">
                                            <FaMapMarkerAlt className="text-[#1BA0E2]" />
                                            {/* SAFETY CHECK */}
                                            {item.schedule?.route || item.transport_schedule?.route || "Rute Tidak Dikenal"}
                                        </h3>
                                        
                                        <p className="text-gray-500 text-sm mb-4 ml-6">
                                            {(item.schedule?.departure_time || item.transport_schedule?.departure_time)
                                                ? new Date(item.schedule?.departure_time || item.transport_schedule?.departure_time).toLocaleString('id-ID', { 
                                                    dateStyle: 'full', 
                                                    timeStyle: 'short' 
                                                }) 
                                                : 'Waktu tidak tersedia'}
                                        </p>
                                        
                                        <div className="flex gap-8 text-sm text-gray-600 bg-gray-50 p-4 rounded-lg border border-gray-100">
                                            <div>
                                                <span className="text-xs text-gray-400 font-bold mb-1 flex items-center gap-1">
                                                    <FaUsers/> PENUMPANG
                                                </span>
                                                <span className="font-semibold">{item.passengers_count} Orang</span>
                                            </div>
                                            <div>
                                                <span className="text-xs text-gray-400 font-bold mb-1 flex items-center gap-1">
                                                    <FaMoneyBillWave/> TOTAL HARGA
                                                </span>
                                                <span className="font-semibold text-orange-600">
                                                    Rp {parseFloat(item.total_price).toLocaleString('id-ID')}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="text-xs text-gray-400 font-bold mb-1 block">STATUS BAYAR</span>
                                                <span className={`font-semibold ${item.payment_status === 'paid' ? 'text-green-600' : 'text-orange-600'}`}>
                                                    {item.payment_status === 'paid' ? 'LUNAS' : 'BELUM LUNAS'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-center justify-center border-l border-gray-100 pl-0 md:pl-6 pt-6 md:pt-0 border-t md:border-t-0">
                                        {item.qr_token && (
                                            <>
                                                <div className="bg-white p-2 rounded border border-gray-200 shadow-sm">
                                                    <QRCodeCanvas value={item.qr_token} size={90} />
                                                </div>
                                                <span className="text-[10px] text-gray-400 mt-2 font-medium flex items-center gap-1">
                                                    <FaQrcode /> Scan Check-in
                                                </span>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 flex justify-end gap-3">
                                    {item.payment_status === 'unpaid' && item.status === 'BOOKED' && (
                                        <button 
                                            onClick={() => handlePay(item.id, item.booking_code)}
                                            className="bg-[#FF5E1F] text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-orange-600 transition shadow-sm"
                                        >
                                            Bayar Sekarang
                                        </button>
                                    )}

                                    {['BOOKED', 'PAID'].includes(item.status) && (
                                        <button 
                                            onClick={() => handleCancel(item.id)}
                                            className="text-red-500 hover:text-red-700 font-bold text-sm px-3 py-2"
                                        >
                                            Batalkan
                                        </button>
                                    )}
                                    
                                    {item.status === 'CHECKED_IN' && (
                                        <button 
                                            onClick={() => handleReview(item.id)}
                                            className="bg-yellow-400 text-yellow-900 px-4 py-2 rounded-lg font-bold text-sm hover:bg-yellow-500 transition shadow-sm flex items-center gap-2"
                                        >
                                            <FaStar /> Beri Ulasan
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyReservation;