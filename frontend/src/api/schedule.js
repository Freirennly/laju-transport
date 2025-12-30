import api from "./axios";

// 1. Buat Reservasi Baru
export const createReservation = async (payload) => {
    const { data } = await api.post("/reservations", payload);
    return data;
};

// 2. Ambil Riwayat Reservasi Saya
export const fetchMyReservations = async () => {
    try {
        const { data } = await api.get("/my-reservations");
        return Array.isArray(data) ? data : (data.data || []);
    } catch (error) {
        console.error("Gagal ambil riwayat", error);
        return [];
    }
};

// 3. Bayar (Sandbox)
export const payReservation = async (id) => {
    const { data } = await api.post(`/reservations/${id}/pay`);
    return data;
};

// 4. Ajukan Pembatalan
export const cancelReservation = async (id, reason) => {
    const { data } = await api.post(`/reservations/${id}/cancel`, { reason });
    return data;
};

export const fetchSchedules = async () => {
    try {
        const { data } = await api.get("/schedules");
        return Array.isArray(data) ? data : (data.data || []);
    } catch (error) {
        console.error("Gagal ambil jadwal", error);
        return [];
    }
};