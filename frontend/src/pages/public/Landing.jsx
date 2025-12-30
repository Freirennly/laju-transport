import React from 'react';
import { Link, Navigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../context/AuthContext";
import { 
    FaTicketAlt, FaCheckCircle, FaCreditCard, FaBus, 
    FaUsers, FaShieldAlt, FaQrcode, FaMapMarkedAlt, 
    FaHeadset, FaInstagram, FaFacebook, FaTwitter, FaArrowRight 
} from "react-icons/fa";

const Landing = () => {
    const { user, loading } = useAuth(); 

    if (loading) return null;

    // Redirect Staff & Admin ke Dashboard
    if (user?.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    if (user?.role === 'staff') return <Navigate to="/staff/dashboard" replace />;

    return (
        <div className="bg-white min-h-screen font-sans text-gray-800">
            <Navbar />

            {/* === HERO SECTION === */}
                <header className="relative bg-[#0056D2] overflow-hidden pt-32 pb-48 rounded-b-[4rem]">
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
                    <div className="absolute -top-20 -left-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-white rounded-full blur-3xl"></div>
                </div>

                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm mb-8 animate-fade-in-down">
                        <span className="text-blue-50 text-xs font-bold tracking-widest uppercase">Standar Baru Perjalanan</span>
                    </div>

                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight tracking-tight">
                        Jelajahi Nusantara <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">Dengan Nyaman</span>
                    </h1>

                    <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
                        Platform reservasi tiket bus premium antar kota. Keamanan terjamin, armada nyaman, dan teknologi check-in paperless.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link to="/reservasi" className="bg-white text-[#0056D2] px-8 py-4 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl hover:bg-gray-50 transition transform hover:-translate-y-1 flex items-center gap-2">
                            <FaTicketAlt /> Pesan Tiket
                        </Link>
                        {
                            <Link to="/checkin" className="px-8 py-4 rounded-full font-bold text-lg text-white border-2 border-white/30 hover:bg-white/10 transition flex items-center gap-2">
                                <FaQrcode /> Check-in Online
                            </Link>
                        }
                    </div>
                </div>
            </header>

            {/* === STATS BAR === */}
            <div className="max-w-5xl mx-auto px-6 relative z-20 -mt-16">
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-gray-100">
                    {[
                        { label: "Kota Tujuan", val: "50+" },
                        { label: "Penumpang", val: "10k+" },
                        { label: "Armada", val: "Premium" },
                        { label: "Kepuasan", val: "4.9/5" },
                    ].map((stat, i) => (
                        <div key={i}>
                            <h3 className="text-3xl font-black text-[#0056D2]">{stat.val}</h3>
                            <p className="text-xs text-gray-400 font-bold uppercase mt-1 tracking-wider">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* === VALUE PROPOSITION === */}
            <section className="py-24">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-black text-gray-800 mb-4">Mengapa Laju Transport?</h2>
                        <p className="text-gray-500 max-w-2xl mx-auto">Kami mengerti kebutuhan perjalanan Anda, baik untuk petualangan solo maupun liburan keluarga.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100 hover:bg-white hover:shadow-xl transition duration-300 group">
                            <div className="w-14 h-14 bg-blue-100 text-[#0056D2] rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition">
                                <FaShieldAlt />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-gray-800">Smart Safety</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                Armada dilengkapi GPS tracking realtime dan CCTV. Pengemudi tersertifikasi untuk keamanan maksimal keluarga Anda.
                            </p>
                        </div>

                        <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100 hover:bg-white hover:shadow-xl transition duration-300 group">
                            <div className="w-14 h-14 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition">
                                <FaQrcode />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-gray-800">100% Paperless</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                Lupakan tiket hilang. Cukup tunjukkan QR Code dari HP Anda saat boarding. Ramah lingkungan dan praktis.
                            </p>
                        </div>

                        <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100 hover:bg-white hover:shadow-xl transition duration-300 group">
                            <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition">
                                <FaBus />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-gray-800">Executive Class</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                Nikmati legrest luas, USB charging port di setiap kursi, dan WiFi gratis sepanjang perjalanan.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* === HOW IT WORKS === */}
            <section className="py-24 bg-[#0f172a] text-white overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-3xl md:text-5xl font-black mb-6 leading-tight">
                                Pesan Tiket <br/> <span className="text-[#0056D2]">Semudah 1-2-3</span>
                            </h2>
                            <p className="text-slate-400 mb-8 text-lg">
                                Tidak perlu lagi antre di terminal. Rencanakan perjalanan Anda dari rumah atau kantor.
                            </p>
                            
                            <div className="space-y-8">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-full bg-[#0056D2] flex items-center justify-center font-bold text-xl flex-shrink-0">1</div>
                                    <div>
                                        <h4 className="text-xl font-bold mb-1">Pilih Rute & Jadwal</h4>
                                        <p className="text-slate-400 text-sm">Tentukan tujuan dan waktu keberangkatan sesuai kebutuhan.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-full bg-[#0056D2] flex items-center justify-center font-bold text-xl flex-shrink-0">2</div>
                                    <div>
                                        <h4 className="text-xl font-bold mb-1">Bayar Instan</h4>
                                        <p className="text-slate-400 text-sm">Mendukung Transfer Bank, E-Wallet, dan QRIS.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-full bg-[#0056D2] flex items-center justify-center font-bold text-xl flex-shrink-0">3</div>
                                    <div>
                                        <h4 className="text-xl font-bold mb-1">Dapatkan E-Ticket</h4>
                                        <p className="text-slate-400 text-sm">Tiket digital langsung dikirim ke akun dan email Anda.</p>
                                    </div>
                                </div>
                            </div>

                            {!user && (
                                <div className="mt-12">
                                    <Link to="/register" className="inline-flex items-center gap-2 text-[#0056D2] font-bold text-lg hover:text-blue-400 transition">
                                        Buat Akun Sekarang <FaArrowRight />
                                    </Link>
                                </div>
                            )}
                        </div>
                        
                        {/* Illustration Area */}
                        <div className="hidden md:flex justify-center items-center">
                            <div className="relative w-full max-w-sm aspect-square bg-slate-800 rounded-3xl p-8 border border-slate-700 shadow-2xl rotate-3 hover:rotate-0 transition duration-500">
                                <div className="absolute -top-10 -right-10 w-24 h-24 bg-[#0056D2] rounded-full blur-2xl opacity-50"></div>
                                <div className="h-full flex flex-col justify-center items-center text-center">
                                    <FaMapMarkedAlt className="text-8xl text-slate-600 mb-6" />
                                    <h3 className="text-2xl font-bold mb-2">Siap Berangkat?</h3>
                                    <p className="text-slate-400 text-sm">Ribuan kursi tersedia setiap hari untuk berbagai destinasi.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* === FOOTER === */}
            <footer className="bg-white pt-20 pb-10 border-t border-gray-100">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-4 gap-12 mb-16">
                        <div className="col-span-1 md:col-span-1">
                            <div className="flex items-center gap-2 mb-6">
                                <span className="text-2xl font-black text-[#0056D2]">LAJU</span>
                                <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-600 text-[10px] font-bold tracking-widest">TRANSPORT</span>
                            </div>
                            <p className="text-gray-500 text-sm leading-relaxed mb-6">
                                PT Laju Transportasi Indonesia. Menghubungkan nusantara dengan layanan transportasi darat modern, aman, dan terpercaya.
                            </p>
                            <div className="flex gap-4 text-gray-400">
                                <a href="#" className="hover:text-[#0056D2] transition"><FaInstagram size={20}/></a>
                                <a href="#" className="hover:text-[#0056D2] transition"><FaFacebook size={20}/></a>
                                <a href="#" className="hover:text-[#0056D2] transition"><FaTwitter size={20}/></a>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-bold text-gray-800 text-lg mb-6">Perusahaan</h4>
                            <ul className="space-y-3 text-gray-500 text-sm">
                                <li><Link to="/about" className="hover:text-[#0056D2]">Tentang Kami</Link></li>
                                <li><Link to="/blog" className="hover:text-[#0056D2]">Berita & Blog</Link></li>
                                <li><Link to="/karir" className="hover:text-[#0056D2]">Karir</Link></li>
                                <li><Link to="/mitra" className="hover:text-[#0056D2]">Mitra Kerjasama</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold text-gray-800 text-lg mb-6">Dukungan</h4>
                            <ul className="space-y-3 text-gray-500 text-sm">
                                <li><Link to="/help" className="hover:text-[#0056D2]">Pusat Bantuan</Link></li>
                                <li><Link to="/syarat" className="hover:text-[#0056D2]">Syarat & Ketentuan</Link></li>
                                <li><Link to="/privasi" className="hover:text-[#0056D2]">Kebijakan Privasi</Link></li>
                                {!user && <li><Link to="/checkin" className="hover:text-[#0056D2]">Cek Status Tiket</Link></li>}
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold text-gray-800 text-lg mb-6">Kontak</h4>
                            <ul className="space-y-3 text-gray-500 text-sm">
                                <li className="flex gap-3">
                                    <FaMapMarkedAlt className="text-[#0056D2] flex-shrink-0 mt-1"/>
                                    <span>Dusun II, Makamhaji, Kec. Kartasura, Kabupaten Sukoharjo, Jawa Tengah, 57161</span>
                                </li>
                                <li className="flex gap-3">
                                    <FaHeadset className="text-[#0056D2] flex-shrink-0 mt-1"/>
                                    <span>cs@lajutransport.id<br/>021-555-0199</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-gray-400 text-sm">© 2025 Laju Transport. All rights reserved.</p>
                        <div className="flex gap-6 text-gray-400 text-sm font-medium">
                            <span>Made with passion in Indonesia 🇮🇩</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Landing;