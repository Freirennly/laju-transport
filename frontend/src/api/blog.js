import api from "./axios";

// Ambil daftar blog
export const fetchBlogs = async () => {
    try {
        const { data } = await api.get("/blogs");
        return Array.isArray(data) ? data : (data.data || []);
    } catch (error) {
        console.error("Gagal ambil blog", error);
        return [];
    }
};

// Ambil detail artikel berdasarkan Slug
export const fetchBlogDetail = async (slug) => {
    const { data } = await api.get(`/blogs/${slug}`);
    return data;
};