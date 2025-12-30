import { useState, useEffect, useCallback } from "react";
import api from "../api/axios";

const useFetch = (url) => {
    const [data, setData] = useState(null); 
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null); 
    
    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
        const response = await api.get(url);
        // Handle jika response dibungkus wrapper data atau array langsung
        setData(response.data.data ? response.data.data : response.data);
        } catch (err) {
        setError(err.response?.data?.message || "Terjadi kesalahan server.");
        } finally {
        setLoading(false);
        }
    }, [url]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Return refetch agar bisa refresh data manual (misal setelah delete)
    return { data, loading, error, refetch: fetchData };
};

export default useFetch;