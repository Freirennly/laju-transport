import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fungsi untuk memverifikasi token saat aplikasi dimuat
  const checkLogin = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      // Endpoint /me akan melewati interceptor axios.
      // Jika token expired/invalid (401), interceptor akan trigger logout.
      const { data } = await api.get("/me");
      setUser(data.user);
    } catch (error) {
      console.error("Session invalid", error);
      // Jika gagal verifikasi, bersihkan sesi lokal
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    if (!email || !password) throw new Error("Email dan Password wajib diisi");

    const { data } = await api.post("/login", { email, password });
    
    // Simpan token & role
    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.user.role);
    
    // Set user state
    setUser(data.user);
    
    return data.user;
  };

  const register = async (name, email, password) => {
    const { data } = await api.post("/register", { name, email, password });
    return data;
  };

  const logout = async () => {
    try {
      await api.post("/logout");
    } catch (e) {
      // Abaikan error dari server (misal token sudah expired duluan)
      console.warn("Logout API failed (token might be expired), forcing client logout.");
    } finally {
      // Hapus sesi di client side
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      setUser(null);
      // Redirect ke login page bisa ditangani di komponen Navbar atau Route Guard
      window.location.href = "/login"; 
    }
  };

  // Jalankan checkLogin sekali saat mount
  useEffect(() => {
    checkLogin();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);