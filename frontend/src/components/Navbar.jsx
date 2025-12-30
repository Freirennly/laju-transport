import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
    FaBars, FaTimes, FaSignInAlt, FaSignOutAlt, 
    FaHome, FaBlog, FaQrcode, FaChartPie, 
    FaUsersCog, FaCalendarAlt, FaMoneyCheckAlt, FaNewspaper,
    FaTicketAlt, FaHistory, FaUser
} from 'react-icons/fa';
import NotificationBell from './NotificationBell'; 
import LogoImage from '../assets/2.png'; 

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        setIsOpen(false);
        navigate('/login');
    };

    // Helper untuk mengecek link aktif
    const isActive = (path) => location.pathname === path;

    // Style Class untuk Link
    const linkBase = "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300";
    const linkInactive = "text-gray-500 hover:text-[#0056D2] hover:bg-blue-50";
    const linkActive = "bg-[#0056D2] text-white shadow-md shadow-blue-200";

    const NavLink = ({ to, icon: Icon, label }) => (
        <Link to={to} className={`${linkBase} ${isActive(to) ? linkActive : linkInactive}`} onClick={() => setIsOpen(false)}>
            <Icon className={isActive(to) ? "text-white" : "text-gray-400 group-hover:text-[#0056D2]"} />
            {label}
        </Link>
    );

    return (
        <nav className="bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 shadow-sm font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    
                    {/* === LOGO === */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <img src={LogoImage} alt="Laju Transport" className="h-10 w-auto object-contain rounded-md" />
                        <div className="flex flex-col">
                            <span className="text-[#0056D2] font-black text-xl tracking-tight leading-none group-hover:text-blue-700 transition">LAJU</span>
                            <span className="text-gray-400 text-[10px] font-bold tracking-[0.3em]">TRANSPORT</span>
                        </div>
                    </Link>

                    {/* === DESKTOP MENU (TENGAH) === */}
                    <div className="hidden lg:flex items-center space-x-1">
                        
                        {/* 1. MENU ADMIN (Lengkap) */}
                        {user?.role === 'admin' && (
                            <div className="flex items-center bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
                                <NavLink to="/admin/dashboard" icon={FaChartPie} label="Dash" />
                                <NavLink to="/admin/users" icon={FaUsersCog} label="Users" />
                                <NavLink to="/admin/schedules" icon={FaCalendarAlt} label="Jadwal" />
                                <NavLink to="/admin/refunds" icon={FaMoneyCheckAlt} label="Refund" />
                                <NavLink to="/admin/blogs" icon={FaNewspaper} label="Blog" />
                            </div>
                        )}

                        {/* 2. MENU STAFF (Fokus Operasional) */}
                        {user?.role === 'staff' && (
                            <div className="flex items-center bg-blue-50 p-1.5 rounded-2xl border border-blue-100">
                                <NavLink to="/staff/dashboard" icon={FaQrcode} label="Dashboard Operasional" />
                            </div>
                        )}

                        {/* 3. MENU USER (Booking & History) */}
                        {user?.role === 'user' && (
                            <>
                                <NavLink to="/" icon={FaHome} label="Beranda" />
                                <NavLink to="/reservasi" icon={FaTicketAlt} label="Pesan Tiket" />
                                <NavLink to="/reservasi-saya" icon={FaHistory} label="Tiket Saya" />
                            </>
                        )}

                        {/* 4. MENU GUEST (Public) */}
                        {!user && (
                            <>
                                <NavLink to="/" icon={FaHome} label="Beranda" />
                                <NavLink to="/checkin" icon={FaQrcode} label="Check-in Online" />
                                <NavLink to="/blog" icon={FaBlog} label="Blog" />
                            </>
                        )}
                    </div>

                    {/* === RIGHT SIDE (Profile / Login) === */}
                    <div className="hidden lg:flex items-center gap-4">
                        {user && <NotificationBell />}
                        
                        {user ? (
                            <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                                <Link to={user.role === 'user' ? "/profil" : "#"} className="text-right group">
                                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wide group-hover:text-[#0056D2] transition">{user.role}</div>
                                    <div className="text-sm font-bold text-gray-800 group-hover:text-[#0056D2] transition">{user.name?.split(' ')[0]}</div>
                                </Link>
                                <button 
                                    onClick={handleLogout} 
                                    className="bg-red-50 text-red-500 p-2.5 rounded-xl hover:bg-red-500 hover:text-white transition shadow-sm"
                                    title="Keluar"
                                >
                                    <FaSignOutAlt />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link to="/login" className="text-gray-600 font-bold text-sm hover:text-[#0056D2] px-4 py-2 transition">
                                    Masuk
                                </Link>
                                <Link to="/register" className="bg-[#0056D2] hover:bg-blue-700 text-white px-6 py-2.5 rounded-full font-bold text-sm shadow-lg shadow-blue-200 transition transform hover:-translate-y-0.5 flex items-center gap-2">
                                    Daftar <FaSignInAlt />
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* === MOBILE TOGGLE === */}
                    <div className="lg:hidden flex items-center gap-4">
                        {user && <NotificationBell />}
                        <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 hover:text-[#0056D2] text-2xl focus:outline-none transition p-2 bg-gray-50 rounded-lg">
                            {isOpen ? <FaTimes /> : <FaBars />}
                        </button>
                    </div>
                </div>
            </div>

            {/* === MOBILE MENU DROPDOWN === */}
            {isOpen && (
                <div className="lg:hidden bg-white border-t border-gray-100 absolute w-full left-0 top-20 shadow-xl p-4 flex flex-col gap-2 z-50 animate-fade-in-down h-screen">
                    
                    {/* ADMIN MOBILE */}
                    {user?.role === 'admin' && (
                        <>
                            <div className="text-xs font-bold text-gray-400 uppercase mb-2">Admin Tools</div>
                            <NavLink to="/admin/dashboard" icon={FaChartPie} label="Dashboard" />
                            <NavLink to="/admin/users" icon={FaUsersCog} label="Manajemen User" />
                            <NavLink to="/admin/schedules" icon={FaCalendarAlt} label="Atur Jadwal" />
                            <NavLink to="/admin/refunds" icon={FaMoneyCheckAlt} label="Cek Refund" />
                            <NavLink to="/admin/blogs" icon={FaNewspaper} label="Tulis Blog" />
                        </>
                    )}

                    {/* STAFF MOBILE */}
                    {user?.role === 'staff' && (
                        <>
                            <div className="text-xs font-bold text-gray-400 uppercase mb-2">Staff Area</div>
                            <NavLink to="/staff/dashboard" icon={FaQrcode} label="Dashboard Operasional" />
                        </>
                    )}

                    {/* USER MOBILE */}
                    {user?.role === 'user' && (
                        <>
                            <NavLink to="/" icon={FaHome} label="Beranda" />
                            <NavLink to="/reservasi" icon={FaTicketAlt} label="Pesan Tiket" />
                            <NavLink to="/reservasi-saya" icon={FaHistory} label="Tiket Saya" />
                            <NavLink to="/profil" icon={FaUser} label="Profil Saya" />
                        </>
                    )}

                    {/* GUEST MOBILE */}
                    {!user && (
                        <>
                            <NavLink to="/" icon={FaHome} label="Beranda" />
                            <NavLink to="/checkin" icon={FaQrcode} label="Check-in Online" />
                            <NavLink to="/blog" icon={FaBlog} label="Blog & Berita" />
                            <div className="h-px bg-gray-100 my-2"></div>
                            <Link to="/login" onClick={() => setIsOpen(false)} className="w-full text-center py-3 rounded-xl border border-gray-200 font-bold text-gray-600 hover:bg-gray-50 transition">
                                Masuk
                            </Link>
                            <Link to="/register" onClick={() => setIsOpen(false)} className="w-full text-center py-3 rounded-xl bg-[#0056D2] text-white font-bold hover:bg-blue-700 transition shadow-lg">
                                Daftar Akun
                            </Link>
                        </>
                    )}

                    {/* LOGOUT BUTTON MOBILE */}
                    {user && (
                        <div className="mt-auto pb-24">
                             <div className="h-px bg-gray-100 my-4"></div>
                             <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 text-red-500 font-bold py-3 bg-red-50 rounded-xl hover:bg-red-100 transition">
                                <FaSignOutAlt /> Keluar
                             </button>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;