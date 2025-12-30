import React from 'react';
import Navbar from "../../components/Navbar";

const PageLayout = ({ title, children }) => (
    <div className="bg-[#F8F9FC] min-h-screen font-sans">
        <Navbar />
        <div className="max-w-4xl mx-auto p-8 py-16">
            <h1 className="text-3xl font-black text-gray-800 mb-8 border-l-4 border-[#0056D2] pl-4">{title}</h1>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-gray-600 leading-relaxed space-y-4">
                {children}
            </div>
        </div>
    </div>
);

export const About = () => (
    <PageLayout title="Tentang Laju Transport">
        <p><strong>Founder & Owner:</strong> Muhammad Fahry Ali</p>
        <p><strong>Identitas Akademik:</strong> K3523047</p>
        <p><strong>Latar Belakang Pendidikan:</strong> Pendidikan Teknik Informatika dan Komputer</p>
        <p className="mt-4">
            Laju Transport adalah perusahaan rintisan di bidang transportasi darat yang dikembangkan dengan visi
            menghadirkan layanan perjalanan antar kota yang terstruktur, profesional, dan berbasis teknologi digital.
            Kami berfokus pada pengembangan sistem reservasi tiket yang terintegrasi untuk meningkatkan efisiensi,
            transparansi, serta kenyamanan pengguna.
        </p>
        <p>
            Sebagai perusahaan yang tumbuh di era transformasi digital, Laju Transport memandang teknologi bukan
            sekadar alat, melainkan fondasi utama dalam membangun sistem transportasi yang andal, aman, dan
            berorientasi pada pengalaman pelanggan.
        </p>
    </PageLayout>
);

export const Career = () => (
    <PageLayout title="Karir di Laju Transport">
        <h3 className="font-bold text-lg text-gray-800">Budaya Kerja Perusahaan (5W Values)</h3>
        <ul className="list-disc pl-5 space-y-2">
            <li><strong>Work with Heart:</strong> Mengedepankan empati, tanggung jawab, dan pelayanan prima kepada pelanggan.</li>
            <li><strong>Work Smart:</strong> Menggunakan pendekatan strategis, teknologi, dan data dalam setiap pengambilan keputusan.</li>
            <li><strong>Work Team:</strong> Membangun sinergi lintas peran dengan komunikasi yang terbuka dan kolaboratif.</li>
            <li><strong>Work Hard:</strong> Menjaga etos kerja tinggi demi keberlanjutan dan kualitas layanan.</li>
            <li><strong>Work Integrity:</strong> Menjunjung tinggi kejujuran, profesionalisme, dan kepatuhan terhadap standar operasional.</li>
        </ul>
        <p className="mt-4 text-sm text-gray-500">
            Laju Transport membuka kesempatan bagi talenta yang ingin bertumbuh bersama perusahaan.
            Kirimkan CV dan portofolio Anda ke: hr@lajutransport.id
        </p>
    </PageLayout>
);

export const Partners = () => (
    <PageLayout title="Mitra Strategis">
        <p>
            Dalam upaya menghadirkan layanan transportasi yang aman dan terpercaya,
            Laju Transport menjalin kerja sama strategis dengan berbagai institusi nasional,
            mitra teknologi, serta penyedia layanan pendukung.
        </p>
        <p>
            Kemitraan ini memungkinkan kami untuk menjaga standar keselamatan, kepatuhan regulasi,
            serta kualitas layanan yang berkelanjutan.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6">
            {['Pertamina', 'Jasa Raharja', 'Bank Mandiri', 'Gopay', 'Ovo', 'Traveloka', 'Kemenhub', 'Dishub'].map(p => (
                <div key={p} className="bg-gray-50 p-4 rounded-xl text-center font-bold text-gray-500 border border-gray-200">
                    {p}
                </div>
            ))}
        </div>
    </PageLayout>
);

export const HelpCenter = () => (
    <PageLayout title="Pusat Bantuan & Layanan Pelanggan">
        <h3 className="font-bold">Bagaimana proses pemesanan tiket?</h3>
        <p>
            Pemesanan tiket dapat dilakukan melalui menu "Pesan Tiket" setelah pengguna masuk ke akun resmi
            Laju Transport. Sistem kami dirancang untuk memastikan transparansi jadwal, harga, dan ketersediaan kursi.
        </p>
        
        <h3 className="font-bold mt-4">Bagaimana kebijakan pembatalan dan pengembalian dana?</h3>
        <p>
            Pembatalan tiket dapat dilakukan melalui menu "Tiket Saya".
            Pengembalian dana akan diproses sesuai kebijakan perusahaan dan diselesaikan maksimal dalam waktu 3 x 24 jam.
        </p>

        <h3 className="font-bold mt-4">Mengalami kendala akses akun?</h3>
        <p>
            Tim layanan pelanggan kami siap membantu proses pemulihan akun melalui prosedur verifikasi
            demi menjaga keamanan data pengguna.
        </p>
    </PageLayout>
);

export const Terms = () => (
    <PageLayout title="Syarat & Ketentuan Layanan">
        <p>1. Tiket dapat dibatalkan paling lambat 24 jam sebelum waktu keberangkatan sesuai jadwal.</p>
        <p>2. Penumpang wajib hadir di titik keberangkatan minimal 30 menit sebelum jadwal yang ditentukan.</p>
        <p>3. Penumpang dilarang membawa barang berbahaya, zat terlarang, atau hewan tanpa izin resmi.</p>
        <p>4. Perusahaan tidak bertanggung jawab atas kehilangan barang pribadi selama perjalanan berlangsung.</p>
    </PageLayout>
);

export const Privacy = () => (
    <PageLayout title="Kebijakan Privasi & Perlindungan Data">
        <p>
            Laju Transport berkomitmen penuh dalam menjaga keamanan dan kerahasiaan data pribadi pengguna.
            Data seperti nama, alamat email, dan nomor telepon hanya digunakan untuk keperluan operasional,
            verifikasi transaksi, serta komunikasi layanan resmi.
        </p>
        <p>
            Kami tidak akan membagikan, menjual, atau memanfaatkan data pribadi pengguna kepada pihak ketiga
            tanpa persetujuan yang sah sesuai dengan peraturan perundang-undangan yang berlaku.
        </p>
    </PageLayout>
);
