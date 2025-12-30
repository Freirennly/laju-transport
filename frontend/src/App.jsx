import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';

// Pages
import Dashboard from './pages/admin/Dashboard';
import Landing from './pages/public/Landing';
import Blog from './pages/public/Blog';
import BlogDetail from './pages/public/BlogDetail';
import CheckIn from './pages/public/CheckIn';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ReservationForm from './pages/user/ReservationForm';
import MyReservation from './pages/user/MyReservation';
import Profile from './pages/user/Profile';
import StaffDashboard from './pages/staff/Dashboard';
import RefundManager from './pages/admin/RefundManager';
import UserManagement from './pages/admin/UserManagement';
import AdminSchedule from './pages/admin/AdminSchedule'; 
import AdminBlog from './pages/admin/AdminBlog'; 
import { About, Career, Partners, HelpCenter, Terms, Privacy } from './pages/public/StaticPages';

const queryClient = new QueryClient();

const ProtectedRoute = ({ children, roles }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');
  if (!token) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(userRole)) return <Navigate to="/" replace />;
  return children;
};

const AdminRoute = ({ children }) => <ProtectedRoute roles={['admin']}>{children}</ProtectedRoute>;
const StaffRoute = ({ children }) => <ProtectedRoute roles={['staff']}>{children}</ProtectedRoute>;
const UserRoute = ({ children }) => <ProtectedRoute roles={['user']}>{children}</ProtectedRoute>;

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
            <Routes>
                {/* PUBLIC */}
                <Route path="/" element={<Landing />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogDetail />} />
                <Route path="/checkin" element={<CheckIn />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/about" element={<About />} />
                <Route path="/karir" element={<Career />} />
                <Route path="/mitra" element={<Partners />} />
                <Route path="/help" element={<HelpCenter />} />
                <Route path="/syarat" element={<Terms />} />
                <Route path="/privasi" element={<Privacy />} />

                {/* USER */}
                <Route path="/reservasi" element={<UserRoute><ReservationForm /></UserRoute>} />
                <Route path="/reservasi-saya" element={<UserRoute><MyReservation /></UserRoute>} />
                <Route path="/profil" element={<UserRoute><Profile /></UserRoute>} />

                {/* STAFF */}
                <Route path="/staff/dashboard" element={<StaffRoute><StaffDashboard /></StaffRoute>} />

                {/* ADMIN */}
                <Route path="/admin/dashboard" element={<AdminRoute><Dashboard /></AdminRoute>} />
                <Route path="/admin/refunds" element={<AdminRoute><RefundManager /></AdminRoute>} /> 
                <Route path="/admin/users" element={<AdminRoute><UserManagement /></AdminRoute>} />
                <Route path="/admin/schedules" element={<AdminRoute><AdminSchedule /></AdminRoute>} /> {/* NEW */}
                <Route path="/admin/blogs" element={<AdminRoute><AdminBlog /></AdminRoute>} /> {/* NEW */}
            </Routes>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;