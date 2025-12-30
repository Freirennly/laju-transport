import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import api from "../../api/axios";
import Swal from "sweetalert2";
import { FaPlus, FaTrash, FaNewspaper, FaEdit, FaPenNib } from "react-icons/fa";

const AdminBlog = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchBlogs = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/admin/blogs'); 
            setBlogs(data);
        } catch (error) {
            console.error("Error", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchBlogs(); }, []);

    const handleForm = async (blog = null) => {
        const { value: formValues } = await Swal.fire({
            title: blog ? 'Edit Artikel' : 'Tulis Artikel Baru',
            html: `
                <input id="swal-title" class="swal2-input" placeholder="Judul Artikel" value="${blog?.title || ''}">
                <input id="swal-cat" class="swal2-input" placeholder="Kategori (Misal: Tips)" value="${blog?.category || ''}">
                <select id="swal-status" class="swal2-input">
                    <option value="published" ${blog?.status === 'published' ? 'selected' : ''}>Published</option>
                    <option value="draft" ${blog?.status === 'draft' ? 'selected' : ''}>Draft</option>
                </select>
                <textarea id="swal-content" class="swal2-textarea" placeholder="Isi konten disini..." style="height: 150px;">${blog?.content || ''}</textarea>
            `,
            focusConfirm: false,
            width: '600px',
            showCancelButton: true,
            confirmButtonText: 'Simpan',
            confirmButtonColor: '#0056D2',
            preConfirm: () => {
                const title = document.getElementById('swal-title').value;
                const category = document.getElementById('swal-cat').value;
                const status = document.getElementById('swal-status').value;
                const content = document.getElementById('swal-content').value;

                if (!title || !category || !content) {
                    Swal.showValidationMessage('Semua kolom wajib diisi!');
                    return false;
                }
                return { title, category, status, content };
            }
        });

        if (formValues) {
            try {
                if (blog) {
                    await api.put(`/admin/blogs/${blog.id}`, formValues);
                    Swal.fire('Sukses', 'Artikel diperbarui', 'success');
                } else {
                    await api.post('/admin/blogs', formValues);
                    Swal.fire('Sukses', 'Artikel diterbitkan', 'success');
                }
                fetchBlogs();
            } catch (error) {
                Swal.fire('Gagal', error.response?.data?.message || 'Error', 'error');
            }
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({ 
            title: 'Hapus Artikel?', 
            text: 'Tindakan ini tidak dapat dibatalkan.',
            icon: 'warning', 
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Ya, Hapus'
        });

        if (result.isConfirmed) {
            try {
                await api.delete(`/admin/blogs/${id}`);
                Swal.fire('Terhapus', '', 'success');
                fetchBlogs();
            } catch (error) {
                Swal.fire('Gagal', 'Gagal menghapus artikel', 'error');
            }
        }
    };

    return (
        <div className="bg-[#F8F9FC] min-h-screen font-sans">
            <Navbar />
            <div className="max-w-7xl mx-auto p-8">
                
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-2xl font-black text-gray-800 flex items-center gap-2">
                            <FaNewspaper className="text-[#0056D2]" /> Manajemen Blog
                        </h1>
                        <p className="text-gray-500 text-sm mt-1">Bagikan informasi menarik seputar perjalanan.</p>
                    </div>
                    <button onClick={() => handleForm()} className="bg-[#0056D2] text-white px-5 py-2.5 rounded-xl font-bold shadow-lg hover:bg-blue-700 transition transform hover:-translate-y-1 flex items-center gap-2 text-sm">
                        <FaPenNib /> Tulis Artikel
                    </button>
                </div>

                {loading ? (
                    <p className="text-center text-gray-500 py-10 animate-pulse">Memuat artikel...</p>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {blogs.map(blog => (
                            <div key={blog.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition h-full">
                                <div className="flex justify-between items-start mb-3">
                                    <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-full ${blog.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                        {blog.status}
                                    </span>
                                    <span className="text-xs font-bold text-[#0056D2] bg-blue-50 px-2 py-1 rounded-full">
                                        {blog.category}
                                    </span>
                                </div>
                                
                                <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-2">{blog.title}</h3>
                                <p className="text-sm text-gray-500 line-clamp-3 mb-6 flex-1">{blog.content}</p>
                                
                                <div className="flex gap-2 border-t pt-4 border-gray-100 mt-auto">
                                    <button onClick={() => handleForm(blog)} className="flex-1 bg-gray-50 text-gray-600 py-2 rounded-lg font-bold text-sm hover:bg-gray-100 transition flex items-center justify-center gap-2">
                                        <FaEdit/> Edit
                                    </button>
                                    <button onClick={() => handleDelete(blog.id)} className="flex-1 bg-red-50 text-red-500 py-2 rounded-lg font-bold text-sm hover:bg-red-100 transition flex items-center justify-center gap-2">
                                        <FaTrash/> Hapus
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {!loading && blogs.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                        <p className="text-gray-400">Belum ada artikel yang diterbitkan.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminBlog;