import React, { useMemo } from 'react';
import {
    Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend,
} from "chart.js";
import { Chart } from "react-chartjs-2"; 
import { useDashboardChart } from "../../hooks/useDashboardChart";

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

const ReservationChart = () => {
    const { data, isLoading } = useDashboardChart();

    const chartData = useMemo(() => {
        return {
            labels: data?.map((item) => {
                const date = new Date(item.date);
                return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
            }) || [],
            datasets: [
                {
                    type: 'bar',
                    label: "Jumlah Reservasi",
                    data: data?.map((item) => item.total) || [],
                    backgroundColor: "#1BA0E2",
                    borderRadius: 4,
                    order: 2,
                    yAxisID: 'y',
                },
                {
                    type: 'line',
                    label: "Pendapatan (Rp)",
                    data: data?.map((item) => item.revenue) || [],
                    borderColor: "#FF5E1F",
                    backgroundColor: "rgba(255, 94, 31, 0.2)",
                    borderWidth: 2,
                    pointRadius: 4,
                    tension: 0.3,
                    order: 1,
                    yAxisID: 'y1',
                },
            ],
        };
    }, [data]);

    const options = {
        responsive: true,
        interaction: { mode: 'index', intersect: false },
        plugins: { legend: { position: "top" } },
        scales: {
            y: { type: 'linear', display: true, position: 'left', title: { display: true, text: 'Transaksi' } },
            y1: { type: 'linear', display: true, position: 'right', grid: { drawOnChartArea: false }, title: { display: true, text: 'Pendapatan' } },
        },
    };

    if (isLoading) return <div className="p-5 text-gray-500 text-sm animate-pulse">Memuat grafik statistik...</div>;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mt-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg text-gray-800">Statistik Mingguan</h3>
                <span className="text-xs font-medium text-gray-500 bg-gray-50 px-3 py-1 rounded-full border border-gray-200">
                    7 Hari Terakhir
                </span>
            </div>
            <Chart type='bar' data={chartData} options={options} />
        </div>
    );
};

export default ReservationChart;