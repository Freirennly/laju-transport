import axios from "axios";
import Swal from "sweetalert2";

// 1. Create Instance dengan Base URL Dinamis
// Ini akan membaca dari .env (jika ada) atau fallback ke localhost
const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api",
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json", // Penting untuk Laravel agar return JSON saat error
    },
    // Optional: timeout 10 detik agar tidak hanging selamanya
    timeout: 10000, 
});

// 2. Request Interceptor: Tempel Token Otomatis
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// 3. Response Interceptor: Global Error Handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const { response } = error;

        // --- Handle 401 (Unauthorized) -> Token Expired / Invalid ---
        if (response && response.status === 401) {
            // Cek apakah bukan halaman login (biar gak loop warning di halaman login)
            if (!window.location.pathname.includes("/login")) {
                
                // Hapus sesi lokal
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                localStorage.removeItem("role");

                // Tampilkan pesan sesi habis (Opsional, bisa dimatikan jika mengganggu)
                // Swal.fire({
                //     icon: "warning",
                //     title: "Sesi Berakhir",
                //     text: "Silakan login kembali untuk melanjutkan.",
                //     timer: 2000,
                //     showConfirmButton: false,
                // });

                // Redirect ke login
                window.location.href = "/login";
            }
        }
        
        // --- Handle 403 (Forbidden) -> Akses Ditolak ---
        else if (response && response.status === 403) {
            Swal.fire({
                icon: "error",
                title: "Akses Ditolak",
                text: "Anda tidak memiliki izin untuk mengakses halaman ini.",
            });
        }

        // --- Handle 500 (Server Error) ---
        else if (response && response.status >= 500) {
            console.error("Server Error:", response.data);
            // Swal.fire("Server Error", "Terjadi kesalahan pada server. Coba lagi nanti.", "error");
        }

        return Promise.reject(error);
    }
);

export default api;