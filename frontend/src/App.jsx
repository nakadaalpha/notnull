import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ReactLenis } from 'lenis/react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import ScrollToTop from './components/ScrollToTop';
import PageTitleSetter from './components/PageTitleSetter';
import ErrorBoundary from './components/ErrorBoundary';
import ErrorPage from './components/ErrorPage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ChatWidget from './components/ChatWidget';
import Home from './pages/Home';
import Warehouse from './pages/Warehouse';
import CarDetail from './pages/CarDetail';
import Checkout from './pages/Checkout';
import PaymentSuccess from './pages/PaymentSuccess';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import BrandsAdmin from './pages/admin/BrandsAdmin';
import CarsAdmin from './pages/admin/CarsAdmin';
import CustomersAdmin from './pages/admin/CustomersAdmin';
import TransactionsAdmin from './pages/admin/TransactionsAdmin';
import MessagesAdmin from './pages/admin/MessagesAdmin';
import SettingsAdmin from './pages/admin/SettingsAdmin';
import InspectionsAdmin from './pages/admin/InspectionsAdmin';
import ProtectedRoute from './components/ProtectedRoute';


function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ReactLenis root options={{ lerp: 0.2, wheelMultiplier: 1.5, smoothWheel: true }}>
          <Router>
            <ErrorBoundary>
              <PageTitleSetter />
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

                <Route path="/checkout" element={
                  <ProtectedRoute>
                    <div className="min-h-screen flex flex-col font-sans selection:bg-primary selection:text-background">
                      <Navbar />
                      <main className="flex-grow">
                        <Checkout />
                      </main>
                      <Footer />
                      <ChatWidget />
                    </div>
                  </ProtectedRoute>
                } />

                <Route path="/payment-success" element={
                  <ProtectedRoute>
                    <div className="min-h-screen flex flex-col font-sans selection:bg-primary selection:text-background">
                      <Navbar />
                      <main className="flex-grow">
                        <PaymentSuccess />
                      </main>
                      <Footer />
                      <ChatWidget />
                    </div>
                  </ProtectedRoute>
                } />

                {/* Admin Routes */}
                <Route path="/admin" element={<ProtectedRoute allowedRoles={['ADMIN', 'MANAGER', 'SALES', 'MECHANIC']} />}>
                  <Route element={<AdminLayout />}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="brands" element={<BrandsAdmin />} />
                    <Route path="cars" element={<CarsAdmin />} />
                    <Route path="customers" element={<CustomersAdmin />} />
                    <Route path="transactions" element={<TransactionsAdmin />} />
                    <Route path="messages" element={<MessagesAdmin />} />
                    <Route path="inspections" element={<InspectionsAdmin />} />
                    <Route path="settings" element={<SettingsAdmin />} />
                  </Route>
                </Route>

                {/* Redirects & Catch-All */}
                <Route path="/dashboard" element={<Navigate to="/profile" replace />} />
                <Route path="*" element={
                  <div className="min-h-screen flex flex-col font-sans selection:bg-primary selection:text-background">
                    <Navbar />
                    <main className="flex-grow flex items-center justify-center pt-28 pb-12">
                      <ErrorPage code={404} />
                    </main>
                    <Footer />
                    <ChatWidget />
                  </div>
                } />
              </Routes>
            </ErrorBoundary>
          </Router>
        </ReactLenis>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
