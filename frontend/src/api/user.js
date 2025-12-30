import api from "./axios";

// Ambil Data Profil (Pakai /me yang sudah ada)
export const getProfile = async () => {
    const { data } = await api.get("/me");
    return data;
};

// Update Profil
export const updateProfile = async (payload) => {
    const { data } = await api.put("/profile", payload);
    return data;
};

// Ganti Password
export const changePassword = async (payload) => {
    const { data } = await api.put("/password", payload);
    return data;
};

export const getMyReservations = () => api.get("/reservations");
