import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchBlogs } from "../../api/blog";
import Navbar from "../../components/Navbar";
import { FaImage, FaArrowRight, FaInfoCircle } from "react-icons/fa";

/**
 * Halaman List Blog Public
 */
const Blog = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBlogs().then((data) => {
            setBlogs(Array.isArray(data) ? data : []);
            setLoading(false);
        }).catch((err) => {
            console.error(err);
            setLoading(false);
        });
    }, []);

    return (
        <div className="bg-gray-50 min-h-screen font-sans">
            <Navbar />
            
            {/* Header Section */}
            <div className="bg-[#0056D2] py-20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange-400 opacity-10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl"></div>
                
                <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
                    <h1 className="text-3xl md:text-5xl font-black text-white mb-4">Jelajah & Informasi</h1>
                    <p className="text-blue-100 text-lg max-w-2xl mx-auto">
                        Dapatkan tips perjalanan terbaik, info rute terbaru, dan promo eksklusif hanya untuk Anda.
                    </p>
                </div>
            </div>
            
            <div className="max-w-6xl mx-auto p-6 -mt-10 relative z-20">
                {loading ? (
                    <div className="flex justify-center items-center h-64 bg-white rounded-3xl shadow-sm">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0056D2]"></div>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-3 gap-8">
                        {blogs && blogs.length > 0 ? (
                            blogs.map((blog) => (
                                <div key={blog.id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col h-full group">
                                    {/* Placeholder Gambar dengan Icon */}
                                    <div className="h-48 bg-gray-100 relative overflow-hidden flex items-center justify-center">
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                                        <FaImage className="text-4xl text-gray-300 group-hover:scale-110 transition-transform duration-500" />
                                    </div>
                                    
                                    <div className="p-6 flex flex-col flex-grow">
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className="bg-blue-50 text-[#0056D2] text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wide">
                                                {blog.category || 'Info Travel'}
                                            </span>
                                            <span className="text-gray-400 text-xs">
                                                • {new Date(blog.created_at).toLocaleDateString('id-ID')}
                                            </span>
                                        </div>
                                        
                                        <h3 className="font-bold text-xl text-gray-800 mb-3 leading-snug group-hover:text-[#0056D2] transition-colors line-clamp-2">
                                            {blog.title}
                                        </h3>
                                        
                                        <p className="text-sm text-gray-500 mb-6 flex-grow line-clamp-3 leading-relaxed">
                                            {blog.content}
                                        </p>
                                        
                                        <Link
                                            to={`/blog/${blog.slug}`} 
                                            className="inline-flex items-center text-[#0056D2] font-bold text-sm hover:text-orange-500 transition-colors gap-2"
                                        >
                                            Baca Selengkapnya 
                                            <FaArrowRight className="text-xs transform group-hover:translate-x-1 transition-transform" />
                                        </Link>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-3 text-center py-20 bg-white rounded-3xl shadow-sm border border-dashed border-gray-300">
                                <div className="inline-block p-4 bg-gray-50 rounded-full mb-4 text-gray-400">
                                    <FaInfoCircle size={32} />
                                </div>
                                <p className="text-gray-500 text-lg font-medium">Belum ada artikel yang diterbitkan.</p>
                                <p className="text-gray-400 text-sm">Cek kembali nanti untuk update terbaru.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Blog;