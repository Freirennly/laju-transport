import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import api from "../../api/axios";
import Swal from "sweetalert2";
import { FaPlus, FaTrash, FaBus, FaCalendarAlt, FaEdit, FaUsers, FaMoneyBillWave, FaArrowRight, FaMapMarkerAlt } from "react-icons/fa";

const AdminSchedule = () => {
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);

    const CITIES = [
        "Jakarta", "Bandung", "Semarang", "Yogyakarta", 
        "Solo", "Surabaya", "Malang", "Bali", "Medan", "Jepara"
    ];

    const fetchSchedules = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/schedules');
            setSchedules(Array.isArray(data) ? data : data.data || []);
        } catch (error) { 
            console.error(error); 
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchSchedules(); }, []);

    const handleForm = async (schedule = null) => {
        // Parsing rute jika formatnya "Asal - Tujuan"
        let defaultOrigin = "";
        let defaultDestination = "";
        
        if (schedule?.route) {
            const parts = schedule.route.split(" - ");
            if (parts.length === 2) {
                defaultOrigin = parts[0];
                defaultDestination = parts[1];
            }
        }

        // Generate options HTML
        const cityOptions = CITIES.map(city => `<option value="${city}">${city}</option>`).join('');

        const { value: form } = await Swal.fire({
            title: schedule ? 'Edit Jadwal Perjalanan' : 'Tambah Jadwal Baru',
            html: `
                <div class="space-y-4 text-left">
                    <div>
                        <label class="text-sm font-bold text-gray-700 block mb-1">Rute Perjalanan</label>
                        <div class="flex gap-2 items-center">
                            <select id="origin" class="swal2-input m-0 w-full" style="height: 45px;">
                                <option value="" disabled ${!defaultOrigin ? 'selected' : ''}>Pilih Asal</option>
                                ${CITIES.map(c => `<option value="${c}" ${c === defaultOrigin ? 'selected' : ''}>${c}</option>`).join('')}
                            </select>
                            <span class="text-gray-400 font-bold">➜</span>
                            <select id="destination" class="swal2-input m-0 w-full" style="height: 45px;">
                                <option value="" disabled ${!defaultDestination ? 'selected' : ''}>Pilih Tujuan</option>
                                ${CITIES.map(c => `<option value="${c}" ${c === defaultDestination ? 'selected' : ''}>${c}</option>`).join('')}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label class="text-sm font-bold text-gray-700 block mb-1">Waktu Keberangkatan</label>
                        <input id="time" type="datetime-local" class="swal2-input m-0 w-full" style="height: 45px;" 
                            value="${schedule?.departure_time ? new Date(schedule.departure_time).toISOString().slice(0, 16) : ''}">
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="text-sm font-bold text-gray-700 block mb-1">Harga Tiket (Rp)</label>
                            <input id="price" type="number" class="swal2-input m-0 w-full" style="height: 45px;" placeholder="0" 
                                value="${schedule?.price || ''}">
                        </div>
                        <div>
                            <label class="text-sm font-bold text-gray-700 block mb-1">Kapasitas Kursi</label>
                            <input id="cap" type="number" class="swal2-input m-0 w-full" style="height: 45px;" placeholder="Jumlah Kursi" 
                                value="${schedule?.capacity || ''}">
                        </div>
                    </div>
                </div>
            `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'Simpan Jadwal',
            confirmButtonColor: '#0056D2',
            cancelButtonText: 'Batal',
            width: '600px',
            preConfirm: () => {
                const origin = document.getElementById('origin').value;
                const destination = document.getElementById('destination').value;
                const departure_time = document.getElementById('time').value;
                const price = document.getElementById('price').value;
                const capacity = document.getElementById('cap').value;

                if (!origin || !destination || !departure_time || !price || !capacity) {
                    Swal.showValidationMessage('Semua data wajib diisi!');
                    return false;
                }

                if (origin === destination) {
                    Swal.showValidationMessage('Kota Asal dan Tujuan tidak boleh sama!');
                    return false;
                }

                // Format Rute: "Jakarta - Bandung"
                const route = `${origin} - ${destination}`;

                return { route, departure_time, price, capacity };
            }
        });

        if (form) {
            try {
                if (schedule) {
                    await api.put(`/admin/schedules/${schedule.id}`, form);
                    Swal.fire('Sukses', 'Jadwal berhasil diperbarui', 'success');
                } else {
                    await api.post('/admin/schedules', form);
                    Swal.fire('Sukses', 'Jadwal baru berhasil ditambahkan', 'success');
                }
                fetchSchedules();
            } catch (err) {
                Swal.fire('Gagal', err.response?.data?.message || 'Terjadi kesalahan saat menyimpan', 'error');
            }
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({ 
            title: 'Hapus Jadwal?', 
            text: "Data yang dihapus tidak bisa dikembalikan.",
            icon: 'warning', 
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Ya, Hapus',
            cancelButtonText: 'Batal'
        });

        if (result.isConfirmed) {
            try {
                await api.delete(`/admin/schedules/${id}`);
                fetchSchedules();
                Swal.fire('Terhapus', 'Jadwal telah dihapus.', 'success');
            } catch (error) {
                Swal.fire('Gagal', 'Gagal menghapus jadwal.', 'error');
            }
        }
    };

    return (
        <div className="bg-[#F8F9FC] min-h-screen font-sans">
            <Navbar />
            <div className="max-w-7xl mx-auto p-8">
                
                <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-gray-800 flex gap-3 items-center">
                            <FaBus className="text-[#0056D2]"/> Manajemen Jadwal
                        </h1>
                        <p className="text-gray-500 text-sm mt-1">Atur rute, harga, dan waktu keberangkatan armada.</p>
                    </div>
                    <button 
                        onClick={() => handleForm()} 
                        className="bg-[#0056D2] hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold flex gap-2 items-center shadow-lg transition transform hover:-translate-y-1"
                    >
                        <FaPlus /> Tambah Jadwal
                    </button>
                </div>

                {loading ? (
                    <div className="grid md:grid-cols-3 gap-6">
                        {[1,2,3].map(i => (
                            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm h-48 animate-pulse">
                                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {schedules.map(item => (
                            <div key={item.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition group relative overflow-hidden">
                                {/* Decorative circle */}
                                <div className="absolute -right-4 -top-4 w-16 h-16 bg-blue-50 rounded-full opacity-50 group-hover:bg-blue-100 transition"></div>

                                <div className="flex justify-between items-start mb-4 relative z-10">
                                    <div>
                                        <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                                            <FaMapMarkerAlt className="text-red-500"/> {item.route}
                                        </h3>
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                            ID: {item.id}
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="space-y-3 mb-6 relative z-10 bg-gray-50 p-4 rounded-xl border border-gray-100">
                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <FaCalendarAlt className="text-[#0056D2]"/> 
                                            <div className="flex flex-col">
                                                <span className="text-xs text-gray-400 font-bold uppercase">Berangkat</span>
                                                <span className="font-bold">
                                                    {new Date(item.departure_time).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-xs text-gray-400 font-bold uppercase block">Jam</span>
                                            <span className="font-bold text-gray-800">
                                                {new Date(item.departure_time).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="w-full h-px bg-gray-200"></div>

                                    <div className="flex justify-between items-center text-sm">
                                        <div className="flex items-center gap-2">
                                            <FaUsers className="text-gray-400"/> 
                                            <span className="font-medium">{item.capacity} Kursi</span>
                                        </div>
                                        <div className="font-black text-[#0056D2] text-lg">
                                            Rp {parseInt(item.price).toLocaleString('id-ID')}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3 relative z-10">
                                    <button 
                                        onClick={() => handleForm(item)} 
                                        className="flex-1 bg-white border-2 border-gray-100 text-gray-600 py-2.5 rounded-xl font-bold text-sm hover:border-blue-200 hover:text-blue-600 transition flex items-center justify-center gap-2"
                                    >
                                        <FaEdit/> Edit
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(item.id)} 
                                        className="flex-1 bg-red-50 text-red-600 py-2.5 rounded-xl font-bold text-sm hover:bg-red-100 transition flex items-center justify-center gap-2"
                                    >
                                        <FaTrash/> Hapus
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {!loading && schedules.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
                        <FaBus className="text-6xl text-gray-200 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-400">Belum ada jadwal tersedia</h3>
                        <p className="text-gray-400 text-sm mt-1">Silakan tambahkan jadwal baru.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminSchedule;