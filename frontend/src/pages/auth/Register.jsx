import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; 
import Navbar from "../../components/Navbar";
import Swal from "sweetalert2";
import { FaUser, FaEnvelope, FaLock, FaUserPlus, FaSpinner } from "react-icons/fa";

const Register = () => {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    
    const [form, setForm] = useState({ name: "", email: "", password: "" });

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const submit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await register(form.name, form.email, form.password);
            
            await Swal.fire({
                icon: "success",
                title: "Registrasi Berhasil!",
                text: "Akun Anda telah dibuat. Silakan login.",
                confirmButtonColor: "#0056D2",
            });
            
            navigate("/login");

        } catch (err) {
            console.error("Register Error:", err);
            const msg = err.response?.data?.message || "Gagal membuat akun.";
            Swal.fire({
                icon: "error",
                title: "Gagal Daftar",
                text: msg,
                confirmButtonColor: "#d33",
            });
        } finally {
            setLoading(false);
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
                        <h1 className="text-3xl font-black text-white mb-2 relative z-10">Buat Akun Baru</h1>
                        <p className="text-blue-100 text-sm relative z-10">Bergabunglah dengan ribuan penumpang lainnya.</p>
                    </div>

                    <div className="p-10">
                        <form onSubmit={submit} className="space-y-5">
                            
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Nama Lengkap</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#0056D2] transition-colors">
                                        <FaUser />
                                    </div>
                                    <input 
                                        type="text"
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#0056D2] focus:border-transparent outline-none transition-all font-medium text-gray-700"
                                        placeholder="Nama Lengkap Anda" 
                                        required 
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Email</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#0056D2] transition-colors">
                                        <FaEnvelope />
                                    </div>
                                    <input 
                                        type="email"
                                        name="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#0056D2] focus:border-transparent outline-none transition-all font-medium text-gray-700"
                                        placeholder="nama@email.com" 
                                        required 
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
                                        value={form.password}
                                        onChange={handleChange}
                                        className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#0056D2] focus:border-transparent outline-none transition-all font-medium text-gray-700"
                                        placeholder="Min. 6 karakter" 
                                        required 
                                    />
                                </div>
                            </div>
                            
                            <button 
                                type="submit"
                                disabled={loading} 
                                className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-white text-lg shadow-lg transition-all transform active:scale-95 ${
                                    loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#0056D2] hover:bg-blue-700 shadow-blue-200 hover:shadow-blue-300"
                                }`}
                            >
                                {loading ? (
                                    <><FaSpinner className="animate-spin" /> Mendaftar...</>
                                ) : (
                                    <>Daftar Sekarang <FaUserPlus /></>
                                )}
                            </button>
                        </form>

                        <div className="mt-8 text-center text-sm text-gray-500">
                            Sudah punya akun? 
                            <Link to="/login" className="text-[#0056D2] font-bold hover:underline ml-1">
                                Masuk disini
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;