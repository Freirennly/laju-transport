import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Swal from "sweetalert2";
import { getCancellationRequests, processRefund } from "../../api/admin";
import { FaClipboardList, FaCheckCircle, FaTimesCircle, FaSpinner } from "react-icons/fa";

/**
 * Halaman Manajemen Refund Admin
 */
const RefundManager = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await getCancellationRequests();
            // Sort: PENDING di atas
            const sorted = data.sort((a, b) => (a.status === 'PENDING' ? -1 : 1));
            setRequests(sorted);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleProcess = async (id, amount, action) => {
        const isApprove = action === 'approve';
        
        const result = await Swal.fire({
            title: isApprove ? 'Setujui Refund?' : 'Tolak Permintaan?',
            text: isApprove 
                ? `Dana Rp ${parseInt(amount).toLocaleString('id-ID')} akan dikembalikan.` 
                : 'Permintaan akan ditolak.',
            icon: isApprove ? 'warning' : 'error',
            showCancelButton: true,
            confirmButtonColor: isApprove ? '#10B981' : '#EF4444',
            confirmButtonText: isApprove ? 'Ya, Setujui' : 'Ya, Tolak',
            input: isApprove ? null : 'text',
            inputPlaceholder: 'Alasan penolakan...'
        });

        if (result.isConfirmed) {
            try {
                await processRefund(id, { action, note: result.value });
                await Swal.fire('Berhasil!', 'Status berhasil diperbarui.', 'success');
                loadData(); // Refresh data agar UI update
            } catch (error) {
                Swal.fire('Gagal', error.response?.data?.message || 'Error', 'error');
                loadData();
            }
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen font-sans">
            <Navbar />
            <div className="max-w-7xl mx-auto p-8">
                <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <FaClipboardList className="text-red-600"/> Manajemen Refund
                </h1>

                <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-700 uppercase font-bold border-b">
                            <tr>
                                <th className="p-4">Kode Booking</th>
                                <th className="p-4">User</th>
                                <th className="p-4">Alasan</th>
                                <th className="p-4">Refund</th>
                                <th className="p-4 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {loading ? (
                                <tr><td colSpan="5" className="p-8 text-center"><FaSpinner className="animate-spin inline"/></td></tr>
                            ) : requests.length === 0 ? (
                                <tr><td colSpan="5" className="p-8 text-center text-gray-400">Tidak ada data.</td></tr>
                            ) : (
                                requests.map((req) => (
                                    <tr key={req.id} className="hover:bg-gray-50">
                                        <td className="p-4 font-mono font-bold text-blue-600">{req.reservation?.booking_code}</td>
                                        <td className="p-4">
                                            <div className="font-bold">{req.reservation?.user?.name}</div>
                                            <div className="text-xs text-gray-500">{req.reservation?.user?.email}</div>
                                        </td>
                                        <td className="p-4 italic text-gray-600">"{req.reason}"</td>
                                        <td className="p-4 font-bold text-red-600">
                                            Rp {parseInt(req.reservation?.total_price).toLocaleString('id-ID')}
                                        </td>
                                        <td className="p-4 text-center">
                                            {req.status === 'PENDING' ? (
                                                <div className="flex justify-center gap-2">
                                                    <button onClick={() => handleProcess(req.id, req.reservation?.total_price, 'approve')} className="bg-green-100 text-green-700 px-3 py-1 rounded hover:bg-green-200 font-bold text-xs">Approve</button>
                                                    <button onClick={() => handleProcess(req.id, 0, 'reject')} className="bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200 font-bold text-xs">Tolak</button>
                                                </div>
                                            ) : (
                                                <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${req.status === 'APPROVED' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                                    {req.status}
                                                </span>
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
    );
};

export default RefundManager;