import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ReactLenis } from 'lenis/react';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import ChatWidget from './components/ChatWidget';
import Home from './pages/Home';
import Warehouse from './pages/Warehouse';
import CarDetail from './pages/CarDetail';
import AdminLayout from './components/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import CarsAdmin from './pages/admin/CarsAdmin';

function App() {
  return (
    <ThemeProvider>
      <ReactLenis root options={{ lerp: 0.2, wheelMultiplier: 1.5, smoothWheel: true }}>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={
              <div className="min-h-screen flex flex-col font-sans selection:bg-primary selection:text-background">
                <Navbar />
                <main className="flex-grow">
                  <Home />
                </main>
                <ChatWidget />
              </div>
            } />
            <Route path="/warehouse" element={
              <div className="min-h-screen flex flex-col font-sans selection:bg-primary selection:text-background">
                <Navbar />
                <main className="flex-grow">
                  <Warehouse />
                </main>
                <ChatWidget />
              </div>
            } />
            <Route path="/car/:id" element={
              <div className="min-h-screen flex flex-col font-sans selection:bg-primary selection:text-background">
                <Navbar />
                <main className="flex-grow">
                  <CarDetail />
                </main>
                <ChatWidget />
              </div>
            } />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="cars" element={<CarsAdmin />} />
              <Route path="customers" element={<div className="p-4">Customers Coming Soon</div>} />
              <Route path="transactions" element={<div className="p-4">Transactions Coming Soon</div>} />
            </Route>
          </Routes>
        </Router>
      </ReactLenis>
    </ThemeProvider>
  );
}

export default App;
