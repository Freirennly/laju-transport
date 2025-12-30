import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Swal from "sweetalert2";
import { FaEnvelope, FaLock, FaSignInAlt, FaSpinner } from "react-icons/fa";
import Navbar from "../../components/Navbar";

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;

        setIsLoading(true);

        try {
            const userData = await login(email, password);

            await Swal.fire({
                icon: "success",
                title: "Login Berhasil!",
                text: `Selamat datang kembali, ${userData.name}!`,
                timer: 1500,
                showConfirmButton: false,
            });

            // Redirect berdasarkan role
            if (userData.role === 'admin') navigate('/admin/dashboard');
            else if (userData.role === 'staff') navigate('/staff/dashboard');
            else navigate('/');

            // Reload ringan untuk memastikan state navbar terupdate
            setTimeout(() => window.location.reload(), 100);

        } catch (error) {
            console.error("Login Error:", error);
            const msg = error.response?.data?.message || "Email atau kata sandi salah.";
            Swal.fire({
                icon: "error",
                title: "Gagal Masuk",
                text: msg,
                confirmButtonColor: "#d33",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F0F2F5] font-sans">
            <Navbar />
            
            <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4 py-12">
                <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden transform transition-all hover:scale-[1.01]">
                    
                    <div className="bg-gradient-to-r from-[#0056D2] to-[#0048B3] p-10 text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full bg-white opacity-5 pointer-events-none">
                            <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-white blur-2xl"></div>
                            <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-white blur-xl"></div>
                        </div>
                        <h2 className="text-3xl font-black text-white mb-2 relative z-10">Selamat Datang</h2>
                        <p className="text-blue-100 text-sm relative z-10">Masuk untuk mengelola perjalanan Anda.</p>
                    </div>

                    <div className="p-10">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Email</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#0056D2] transition-colors">
                                        <FaEnvelope />
                                    </div>
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#0056D2] focus:border-transparent outline-none transition-all font-medium text-gray-700"
                                        placeholder="nama@email.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Password</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#0056D2] transition-colors">
                                        <FaLock />
                                    </div>
                                    <input
                                        type="password"
                                        name="password"
                                        required
                                        className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#0056D2] focus:border-transparent outline-none transition-all font-medium text-gray-700"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-white text-lg shadow-lg transition-all transform active:scale-95 ${
                                    isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-[#0056D2] hover:bg-blue-700 shadow-blue-200 hover:shadow-blue-300"
                                }`}
                            >
                                {isLoading ? (
                                    <><FaSpinner className="animate-spin" /> Memproses...</>
                                ) : (
                                    <>Masuk Sekarang <FaSignInAlt /></>
                                )}
                            </button>

                        </form>

                        <div className="mt-8 text-center text-sm text-gray-500">
                            Belum punya akun?{" "}
                            <Link to="/register" className="text-[#0056D2] font-bold hover:underline ml-1">
                                Daftar disini
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;