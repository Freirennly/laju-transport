import api from "./axios";

// Ambil daftar booking untuk hari ini (Staff)
export const getTodayBookings = async () => {
    const { data } = await api.get('/staff/bookings/today');
    return data.data; // Sesuaikan dengan format response backend
};

// Proses Check-in oleh Staff
export const staffCheckIn = async (code) => {
    const { data } = await api.post('/staff/checkin', { booking_code: code });
    return data;
};

// Batalkan Check-in
export const undoCheckIn = async (id) => {
    const { data } = await api.post(`/staff/undo-checkin/${id}`);
    return data;
};