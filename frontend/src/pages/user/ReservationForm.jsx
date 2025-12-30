import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Navbar from "../../components/Navbar";
import { fetchSchedules, createReservation } from "../../api/reservation"; 
import { FaBus, FaUsers, FaTicketAlt } from "react-icons/fa";

const ReservationForm = () => {
    const navigate = useNavigate();
    
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [scheduleId, setScheduleId] = useState("");
    const [selectedSchedule, setSelectedSchedule] = useState(null);
    const [passengers, setPassengers] = useState(1);

    useEffect(() => {
        fetchSchedules().then((data) => {
            setSchedules(data || []); // Safety check
            setLoading(false);
        });
    }, []);

    const handleScheduleChange = (id) => {
        const selectedId = Number(id);
        setScheduleId(selectedId);
        const found = schedules.find((s) => s.id === selectedId);
        setSelectedSchedule(found);
        setPassengers(1); 
    };

    const handlePassengerChange = (e) => {
        let val = parseInt(e.target.value);
        if (isNaN(val) || val < 1) val = 1;
        if (selectedSchedule && val > selectedSchedule.capacity) val = selectedSchedule.capacity;
        setPassengers(val);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!scheduleId) {
            Swal.fire("Error", "Pilih jadwal dulu.", "error");
            return;
        }

        setSubmitting(true);

        try {
            await createReservation({
                transport_schedule_id: scheduleId, 
                passengers_count: passengers,      
            });

            await Swal.fire({
                title: "Berhasil!",
                text: "Tiket berhasil dipesan. Cek menu Tiket Saya.",
                icon: "success",
                confirmButtonColor: "#1BA0E2",
            });

            navigate("/reservasi-saya"); 

        } catch (err) {
            console.error(err);
            Swal.fire("Gagal", err.response?.data?.message || "Terjadi kesalahan.", "error");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="bg-[#F7F9FA] min-h-screen font-sans">
            <Navbar />

            <div className="max-w-4xl mx-auto p-6 py-10">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="bg-gradient-to-r from-[#1BA0E2] to-[#007EA7] p-8 text-white">
                        <h1 className="text-2xl font-bold flex items-center gap-3">
                            <FaTicketAlt /> Pesan Tiket Baru
                        </h1>
                        <p className="text-blue-100 text-sm mt-1 ml-8">Pilih rute perjalanan Anda dari database yang tersedia.</p>
                    </div>

                    <div className="p-8">
                        {loading ? (
                            <div className="text-center py-10 text-gray-500 animate-pulse">Mengambil data jadwal...</div>
                        ) : (
                            <form onSubmit={handleSubmit} className="grid md:grid-cols-3 gap-8">
                                <div className="md:col-span-2 space-y-6">
                                    <div>
                                        <label className=" text-gray-700 font-bold mb-2 flex items-center gap-2">
                                            <FaBus className="text-gray-400" /> Pilih Jadwal
                                        </label>
                                        <select
                                            className="w-full border border-gray-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#1BA0E2] transition"
                                            value={scheduleId}
                                            onChange={(e) => handleScheduleChange(e.target.value)}
                                            required
                                        >
                                            <option value="">-- Pilih Rute --</option>
                                            {schedules.map((s) => (
                                                <option key={s.id} value={s.id} disabled={s.capacity <= 0}>
                                                    {s.route} | {new Date(s.departure_time).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' })} {s.capacity <= 0 ? '(Penuh)' : ''}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className=" text-gray-700 font-bold mb-2 flex items-center gap-2">
                                            <FaUsers className="text-gray-400" /> Jumlah Penumpang
                                        </label>
                                        <input
                                            type="number"
                                            min="1"
                                            max={selectedSchedule?.capacity || 10}
                                            className="w-full border border-gray-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#1BA0E2] transition"
                                            value={passengers}
                                            onChange={handlePassengerChange}
                                            disabled={!selectedSchedule}
                                            required
                                        />
                                        {selectedSchedule && (
                                            <p className="text-xs text-gray-500 mt-2 ml-1">
                                                Sisa kursi tersedia: <span className="font-bold text-orange-500">{selectedSchedule.capacity}</span>
                                            </p>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={submitting || !selectedSchedule}
                                        className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition transform hover:-translate-y-1 ${
                                            submitting || !selectedSchedule ? "bg-gray-300 cursor-not-allowed" : "bg-[#FF5E1F] hover:bg-orange-600 shadow-orange-500/30"
                                        }`}
                                    >
                                        {submitting ? "Memproses..." : "Pesan Sekarang"}
                                    </button>
                                </div>

                                {/* Ringkasan Harga */}
                                <div className="md:col-span-1">
                                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 h-full">
                                        <h3 className="font-bold text-gray-800 mb-4 border-b pb-2">Rincian Biaya</h3>
                                        <div className="space-y-3 text-sm text-gray-600">
                                            <div className="flex justify-between">
                                                <span>Harga Tiket</span>
                                                <span className="font-medium">{selectedSchedule ? `Rp ${parseFloat(selectedSchedule.price).toLocaleString('id-ID')}` : '-'}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Jumlah</span>
                                                <span className="font-medium">{passengers}x</span>
                                            </div>
                                        </div>
                                        <div className="mt-6 pt-4 border-t border-gray-200">
                                            <span className="block text-xs text-gray-500 mb-1">Total Pembayaran</span>
                                            <span className="text-3xl font-black text-[#1BA0E2]">
                                                {selectedSchedule ? `Rp ${(selectedSchedule.price * passengers).toLocaleString('id-ID')}` : 'Rp 0'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReservationForm;