import { useQuery } from "@tanstack/react-query";
import { fetchDashboardChart } from "../api/dashboard";

export const useDashboardChart = () => {
    return useQuery({
        queryKey: ["dashboard-chart"],
        queryFn: fetchDashboardChart,
        staleTime: 1000 * 60 * 10, 
    });
};