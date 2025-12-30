import api from "./axios";

// API Check-in Publik (Tanpa Token)
export const publicCheckIn = async (bookingCode, email) => {
    const { data } = await api.post("/check-in", {
        booking_code: bookingCode,
        email: email
    });
    return data;
};