import api from "./axios";

export const fetchAdminDashboard = async () => {
    const { data } = await api.get("/admin/dashboard");
    return data.data;
};

export const fetchDashboardChart = async () => {
    const { data } = await api.get("/admin/dashboard/chart");
    return data.data;
};