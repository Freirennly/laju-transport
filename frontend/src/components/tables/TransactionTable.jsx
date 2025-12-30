import React from 'react';

const getStatusBadge = (status) => {
    switch (status) {
        case 'PAID':
        case 'CHECKED_IN':
            return 'bg-green-100 text-green-700 border-green-200';
        case 'CANCELLED':
        case 'REFUNDED':
            return 'bg-red-100 text-red-700 border-red-200';
        case 'BOOKED':
            return 'bg-blue-100 text-blue-700 border-blue-200';
        default:
            return 'bg-gray-100 text-gray-700 border-gray-200';
    }
};

const TransactionTable = ({ data }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mt-6">
        <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-4">
            <h3 className="font-bold text-lg text-gray-800">Transaksi Terbaru</h3>
        </div>

        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50 rounded-lg">
                    <tr>
                        <th className="px-6 py-3 rounded-l-lg">Kode Booking</th>
                        <th className="px-6 py-3">User</th>
                        <th className="px-6 py-3">Total</th>
                        <th className="px-6 py-3 rounded-r-lg">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {!data || data.length === 0 ? (
                        <tr>
                            <td colSpan="4" className="px-6 py-8 text-center text-gray-400">
                                Tidak ada data transaksi.
                            </td>
                        </tr>
                    ) : (
                        data.map((item) => (
                            <tr key={item.id} className="bg-white border-b hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 font-mono font-medium text-[#1BA0E2]">
                                    {item.booking_code}
                                </td>
                                <td className="px-6 py-4 font-medium text-gray-700">
                                    {item.user?.name || "Guest"}
                                </td>
                                <td className="px-6 py-4 text-gray-600">
                                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(item.total_price)}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusBadge(item.status)}`}>
                                        {item.status}
                                    </span>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    </div>
);

export default TransactionTable;