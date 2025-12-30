import { useQuery } from "@tanstack/react-query";
import { fetchAdminDashboard } from "../api/dashboard";

export const useDashboard = () => {
    return useQuery({
        queryKey: ["admin-dashboard"],
        queryFn: fetchAdminDashboard,
        staleTime: 1000 * 60 * 5, 
    });
};