import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api';
import SalesChat from '../../components/SalesChat';
import { Navigate } from 'react-router-dom';

export default function MessagesAdmin() {
  const { user } = useAuth();
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (user?.role === 'SALES') {
        try {
          const res = await api.get(`/reservations/user/${user.id}`);
          setSalesData(res.data);
        } catch (error) {
          console.error('Failed to fetch sales data for messages', error);
        } finally {
          setLoading(false);
        }
      }
    };
    if (user) fetchData();
  }, [user]);

  // Protect this route from non-SALES users (though the App.jsx might also protect it)
  if (user && user.role !== 'SALES') {
    return <Navigate to="/admin" replace />;
  }

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Extract unique customers from salesData
  const uniqueCustomersMap = new Map();
  salesData.forEach(r => {
    if (r.customer && !uniqueCustomersMap.has(r.customer.id)) {
      uniqueCustomersMap.set(r.customer.id, r.customer);
    }
  });
  const assignedCustomers = Array.from(uniqueCustomersMap.values());

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex flex-col">
      <h1 className="text-3xl font-bold mb-2">Live Concierge</h1>
      <p className="text-primary/60 text-sm mb-6 tracking-widest uppercase">Inbox & Messaging</p>
      
      <div className="flex-1 min-h-0">
        <SalesChat customers={assignedCustomers} currentUserId={user.id} />
      </div>
    </div>
  );
}
