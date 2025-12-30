import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import Pagination from "../../components/Pagination"; 
import useFetch from "../../hooks/useFetch"; 
import { deleteUser, createUser, updateUser } from "../../api/admin"; 
import Swal from "sweetalert2";
import { FaTrash, FaSearch, FaUserPlus, FaUserShield, FaEdit, FaSpinner } from "react-icons/fa";

const UserManagement = () => {
    const { data: users, loading, error, refetch } = useFetch("/admin/users");
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5); 

    // Handle Delete
    const handleDelete = (id) => {
        Swal.fire({ title: 'Hapus User?', icon: 'warning', showCancelButton: true, confirmButtonText: 'Ya', confirmButtonColor: '#d33' })
        .then(async (res) => {
            if(res.isConfirmed) {
                try {
                    await deleteUser(id);
                    Swal.fire('Terhapus', '', 'success');
                    refetch(); 
                } catch (err) {
                    Swal.fire('Gagal', 'Gagal menghapus user', 'error');
                }
            }
        });
    };

    // Handle Create & Update
    const handleForm = async (user = null) => {
        const { value: formValues } = await Swal.fire({
            title: user ? 'Edit User' : 'Tambah User',
            html: `
                <input id="swal-name" class="swal2-input" placeholder="Nama Lengkap" value="${user?.name || ''}">
                <input id="swal-email" class="swal2-input" placeholder="Email" value="${user?.email || ''}">
                ${!user ? '<input id="swal-password" type="password" class="swal2-input" placeholder="Password">' : ''}
                <select id="swal-role" class="swal2-input">
                    <option value="user" ${user?.role === 'user' ? 'selected' : ''}>User</option>
                    <option value="staff" ${user?.role === 'staff' ? 'selected' : ''}>Staff</option>
                    <option value="admin" ${user?.role === 'admin' ? 'selected' : ''}>Administrator</option>
                </select>
            `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'Simpan',
            confirmButtonColor: '#0056D2',
            preConfirm: () => {
                const name = document.getElementById('swal-name').value;
                const email = document.getElementById('swal-email').value;
                const role = document.getElementById('swal-role').value;
                const password = !user ? document.getElementById('swal-password').value : undefined;

                if (!name || !email || (!user && !password)) {
                    Swal.showValidationMessage('Semua data wajib diisi');
                    return false;
                }
                return { name, email, role, ...(password && { password }) };
            }
        });

        if (formValues) {
            try {
                if (user) {
                    await updateUser(user.id, formValues);
                    Swal.fire('Sukses', 'Data user diperbarui', 'success');
                } else {
                    await createUser(formValues);
                    Swal.fire('Sukses', 'User berhasil ditambahkan', 'success');
                }
                refetch();
            } catch (error) {
                Swal.fire('Gagal', error.response?.data?.message || 'Terjadi kesalahan', 'error');
            }
        }
    };

    // Filter Logic
    const userList = Array.isArray(users) ? users : [];
    const filteredUsers = userList.filter(u => 
        u.name.toLowerCase().includes(search.toLowerCase()) || 
        u.email.toLowerCase().includes(search.toLowerCase())
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="bg-[#F8F9FC] min-h-screen font-sans">
            <Navbar />
            <div className="max-w-6xl mx-auto p-8">
                
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-2xl font-black text-gray-800 flex items-center gap-2">
                            <FaUserShield className="text-[#0056D2]" /> Manajemen User
                        </h1>
                        <p className="text-gray-500 text-sm mt-1">Kelola akun pengguna, staff, dan admin.</p>
                    </div>
                    <button 
                        onClick={() => handleForm()}
                        className="bg-[#0056D2] hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg transition transform hover:-translate-y-1 text-sm"
                    >
                        <FaUserPlus /> Tambah User
                    </button>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-sm mb-6 flex items-center gap-3 border border-gray-100">
                    <FaSearch className="text-gray-400 ml-2" />
                    <input 
                        type="text" 
                        placeholder="Cari nama atau email..." 
                        className="w-full outline-none text-sm p-1 font-medium text-gray-700"
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                    />
                </div>

                <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
                    {loading ? (
                        <div className="p-10 flex justify-center text-gray-500 gap-2 items-center">
                            <FaSpinner className="animate-spin" /> Mengambil data user...
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-gray-50 uppercase text-gray-500 font-bold text-xs tracking-wider">
                                        <tr>
                                            <th className="p-5">Nama</th>
                                            <th className="p-5">Email</th>
                                            <th className="p-5 text-center">Role</th>
                                            <th className="p-5 text-center">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {currentUsers.length > 0 ? currentUsers.map(u => (
                                            <tr key={u.id} className="hover:bg-[#F8F9FC] transition-colors">
                                                <td className="p-5 font-bold text-gray-800">{u.name}</td>
                                                <td className="p-5 text-gray-500">{u.email}</td>
                                                <td className="p-5 text-center">
                                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                                        u.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                                                        u.role === 'staff' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                                                    }`}>
                                                        {u.role}
                                                    </span>
                                                </td>
                                                <td className="p-5 flex justify-center gap-2">
                                                    <button onClick={() => handleForm(u)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition" title="Edit">
                                                        <FaEdit />
                                                    </button>
                                                    {u.role !== 'admin' && (
                                                        <button onClick={() => handleDelete(u.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition" title="Hapus">
                                                            <FaTrash />
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr><td colSpan="4" className="p-8 text-center text-gray-400">User tidak ditemukan.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            
                            {filteredUsers.length > itemsPerPage && (
                                <div className="p-4 border-t border-gray-100">
                                    <Pagination 
                                        itemsPerPage={itemsPerPage} 
                                        totalItems={filteredUsers.length} 
                                        paginate={paginate} 
                                        currentPage={currentPage} 
                                    />
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
export default UserManagement;