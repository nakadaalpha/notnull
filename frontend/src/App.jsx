import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ReactLenis } from 'lenis/react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import ScrollToTop from './components/ScrollToTop';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ChatWidget from './components/ChatWidget';
import Home from './pages/Home';
import Warehouse from './pages/Warehouse';
import CarDetail from './pages/CarDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import CarsAdmin from './pages/admin/CarsAdmin';
import BrandsAdmin from './pages/admin/BrandsAdmin';
import CustomersAdmin from './pages/admin/CustomersAdmin';
import TransactionsAdmin from './pages/admin/TransactionsAdmin';
import ProtectedRoute from './components/ProtectedRoute';


function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ReactLenis root options={{ lerp: 0.2, wheelMultiplier: 1.5, smoothWheel: true }}>
          <Router>
            <ScrollToTop />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={
              <div className="min-h-screen flex flex-col font-sans selection:bg-primary selection:text-background">
                <Navbar />
                <main className="flex-grow">
                  <Home />
                </main>
                <Footer />
                <ChatWidget />
              </div>
            } />
            <Route path="/warehouse" element={
              <div className="min-h-screen flex flex-col font-sans selection:bg-primary selection:text-background">
                <Navbar />
                <main className="flex-grow">
                  <Warehouse />
                </main>
                <Footer />
                <ChatWidget />
              </div>
            } />
            <Route path="/car/:id" element={
              <div className="min-h-screen flex flex-col font-sans selection:bg-primary selection:text-background">
                <Navbar />
                <main className="flex-grow">
                  <CarDetail />
                </main>
                <Footer />
                <ChatWidget />
              </div>
            } />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route path="/profile" element={<ProtectedRoute />}>
              <Route index element={
                <div className="min-h-screen flex flex-col font-sans selection:bg-primary selection:text-background">
                  <Navbar />
                  <main className="flex-grow">
                    <Profile />
                  </main>
                  <Footer />
                  <ChatWidget />
                </div>
              } />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin" element={<ProtectedRoute allowedRoles={['ADMIN', 'SALES']} />}>
              <Route element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="brands" element={<BrandsAdmin />} />
                <Route path="cars" element={<CarsAdmin />} />
                <Route path="customers" element={<CustomersAdmin />} />
                <Route path="transactions" element={<TransactionsAdmin />} />
              </Route>
            </Route>

            {/* Redirects & Catch-All */}
            <Route path="/dashboard" element={<Navigate to="/profile" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </ReactLenis>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
