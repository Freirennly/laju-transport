import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchBlogDetail } from "../../api/blog";
import Navbar from "../../components/Navbar";
import { FaArrowLeft, FaUserCircle, FaCalendarAlt } from "react-icons/fa";

/**
 * Halaman Detail Artikel Blog
 */
const BlogDetail = () => {
    const { slug } = useParams(); 
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBlogDetail(slug).then((data) => {
            setBlog(data);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, [slug]);

    if (loading) return <div className="text-center py-20 text-gray-500">Memuat artikel...</div>;
    if (!blog) return <div className="text-center py-20 text-red-500">Artikel tidak ditemukan.</div>;

    return (
        <div className="bg-white min-h-screen font-sans">
            <Navbar />
            
            <div className="max-w-3xl mx-auto p-6 py-12">
                <Link to="/blog" className="flex items-center gap-2 text-gray-500 text-sm hover:text-[#1BA0E2] mb-6 transition-colors">
                    <FaArrowLeft /> Kembali ke Blog
                </Link>
                
                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6 leading-tight">
                    {blog.title}
                </h1>

                <div className="flex items-center gap-6 text-sm text-gray-500 mb-8 border-b border-gray-100 pb-8">
                    <div className="flex items-center gap-2">
                        <FaUserCircle className="text-gray-400" />
                        <span>By <b>Admin Laju</b></span>
                    </div>
                    <div className="flex items-center gap-2">
                        <FaCalendarAlt className="text-gray-400" />
                        <span>{new Date(blog.created_at).toLocaleDateString('id-ID', { dateStyle: 'long' })}</span>
                    </div>
                </div>

                <article className="prose prose-lg text-gray-700 whitespace-pre-line leading-relaxed">
                    {blog.content}
                </article>
            </div>
        </div>
    );
};

export default BlogDetail;