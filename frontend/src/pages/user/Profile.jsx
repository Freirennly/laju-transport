import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Navbar from "../../components/Navbar";
import { getProfile, updateProfile, changePassword } from "../../api/user";
import MyReservation from "./MyReservation"; 
import { FaUser, FaLock, FaHistory, FaSave } from "react-icons/fa";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [user, setUser] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProfile()
      .then((data) => {
        setUser(data.user || data); 
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await updateProfile({ name: user.name, email: user.email });
      Swal.fire("Berhasil", "Data profil diperbarui.", "success");
    } catch (error) {
      Swal.fire("Gagal", error.response?.data?.message || "Error update profil", "error");
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const payload = Object.fromEntries(formData);

    if (payload.new_password !== payload.new_password_confirmation) {
        Swal.fire("Error", "Konfirmasi password tidak cocok.", "error");
        return;
    }

    try {
      await changePassword(payload);
      Swal.fire("Sukses", "Password berhasil diganti.", "success");
      e.target.reset();
    } catch (error) {
      Swal.fire("Gagal", error.response?.data?.message || "Password lama salah.", "error");
    }
  };

  const TabButton = ({ id, label, icon: Icon }) => (
    <button 
        onClick={() => setActiveTab(id)}
        className={`w-full text-left px-4 py-3 rounded-xl font-bold transition flex items-center gap-3 ${
            activeTab === id ? "bg-[#1BA0E2] text-white shadow-lg shadow-blue-200" : "bg-white text-gray-600 hover:bg-gray-50 border border-transparent hover:border-gray-200"
        }`}
    >
        <Icon className={activeTab === id ? "text-white" : "text-gray-400"} /> {label}
    </button>
  );

  return (
    <div className="bg-[#F7F9FA] min-h-screen font-sans">
      <Navbar />

      <div className="max-w-5xl mx-auto p-6 py-10">
        <h1 className="text-3xl font-black text-gray-800 mb-8 pl-4 border-l-4 border-[#1BA0E2]">Akun Saya</h1>

        <div className="grid md:grid-cols-4 gap-6">
            
            {/* SIDEBAR MENU */}
            <div className="md:col-span-1 space-y-2">
                <TabButton id="profile" label="Data Diri" icon={FaUser} />
                <TabButton id="password" label="Ganti Password" icon={FaLock} />
                <TabButton id="history" label="Riwayat Pesanan" icon={FaHistory} />
            </div>

            {/* CONTENT AREA */}
            <div className="md:col-span-3">
                
                {/* 1. TAB PROFIL */}
                {activeTab === "profile" && (
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 animate-fade-in">
                        <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-4 flex items-center gap-2">
                            <FaUser className="text-[#1BA0E2]" /> Edit Data Diri
                        </h2>
                        {loading ? <p className="text-gray-500 animate-pulse">Memuat data...</p> : (
                            <form onSubmit={handleUpdateProfile} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Nama Lengkap</label>
                                    <input 
                                        type="text" 
                                        className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-[#1BA0E2] outline-none transition"
                                        value={user.name}
                                        onChange={(e) => setUser({...user, name: e.target.value})}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Alamat Email</label>
                                    <input 
                                        type="email" 
                                        className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-[#1BA0E2] outline-none transition"
                                        value={user.email}
                                        onChange={(e) => setUser({...user, email: e.target.value})}
                                        required
                                    />
                                </div>
                                <button className="bg-[#1BA0E2] text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-600 transition shadow-lg shadow-blue-500/30 flex items-center gap-2">
                                    <FaSave /> Simpan Perubahan
                                </button>
                            </form>
                        )}
                    </div>
                )}

                {/* 2. TAB PASSWORD */}
                {activeTab === "password" && (
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 animate-fade-in">
                        <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-4 flex items-center gap-2">
                            <FaLock className="text-red-500" /> Ganti Password
                        </h2>
                        <form onSubmit={handleChangePassword} className="space-y-5">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Password Lama</label>
                                <input type="password" name="current_password" className="w-full border border-gray-300 p-3 rounded-xl outline-none focus:ring-2 focus:ring-red-200 focus:border-red-500 transition" required />
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Password Baru</label>
                                    <input type="password" name="new_password" className="w-full border border-gray-300 p-3 rounded-xl outline-none focus:ring-2 focus:ring-red-200 focus:border-red-500 transition" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Konfirmasi Password</label>
                                    <input type="password" name="new_password_confirmation" className="w-full border border-gray-300 p-3 rounded-xl outline-none focus:ring-2 focus:ring-red-200 focus:border-red-500 transition" required />
                                </div>
                            </div>
                            <button className="bg-red-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-red-600 transition shadow-lg shadow-red-500/30 flex items-center gap-2">
                                <FaSave /> Update Password
                            </button>
                        </form>
                    </div>
                )}

                {/* 3. TAB HISTORY */}
                {activeTab === "history" && (
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-fade-in">
                        <MyReservation isEmbedded={true} /> 
                    </div>
                )}
            </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;