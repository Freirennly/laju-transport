import api from "./axios";

// === 1. KONFIGURASI ===
export const exportURL = "http://127.0.0.1:8000/api/admin/export/bookings";

export const downloadExportData = async () => {
    try {
        const response = await api.get('/admin/export/bookings', {
            responseType: 'blob',
        });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `Laporan_Reservasi_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        link.remove();
    } catch (error) {
        console.error("Gagal download", error);
        throw error;
    }
};

// === 2. DASHBOARD ===
export const getDashboardStats = () => api.get('/admin/dashboard');

// === 3. MANAJEMEN USER (LENGKAP) ===
export const getUsers = () => api.get("/admin/users");
export const getUserDetail = (id) => api.get(`/admin/users/${id}`);
export const createUser = (data) => api.post("/admin/users", data);
export const updateUser = (id, data) => api.put(`/admin/users/${id}`, data);
export const deleteUser = (id) => api.delete(`/admin/users/${id}`);

// === 4. MANAJEMEN JADWAL (SCHEDULE - LENGKAP) ===
export const getSchedules = () => api.get("/schedules"); // Bisa pakai endpoint public atau admin khusus
export const createSchedule = (data) => api.post("/admin/schedules", data);
export const updateSchedule = (id, data) => api.put(`/admin/schedules/${id}`, data);
export const deleteSchedule = (id) => api.delete(`/admin/schedules/${id}`);

// === 5. MANAJEMEN BLOG ===
export const getAdminBlogs = () => api.get("/admin/blogs");
export const createBlog = (data) => api.post("/admin/blogs", data);
export const updateBlog = (id, data) => api.put(`/admin/blogs/${id}`, data);
export const deleteBlog = (id) => api.delete(`/admin/blogs/${id}`);

// === 6. MANAJEMEN REFUND ===
export const getCancellationRequests = async () => {
    const { data } = await api.get('/admin/cancellations');
    return data;
};

export const processRefund = async (id, payload) => {
    const { data } = await api.post(`/admin/cancellations/${id}`, payload);
    return data;
};

// === 7. SYSTEM UTILITIES ===
export const toggleMaintenance = () => api.post('/admin/maintenance');
export const triggerReminders = () => api.post('/admin/trigger-reminders');