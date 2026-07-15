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
      try {
        if (user?.role === 'SALES') {
          const res = await api.get(`/reservations/user/${user.id}`);
          setSalesData(res.data);
        } else if (user?.role === 'ADMIN' || user?.role === 'MANAGER') {
          // Admins and Managers can view all customers who made reservations or all users.
          // For simplicity, let's fetch all customers to allow admin to monitor all chats.
          const res = await api.get('/customers');
          // For admin, the structure is just an array of users, we'll map them so it looks like reservations output
          const fakeReservations = res.data.map(c => ({ customer: c }));
          setSalesData(fakeReservations);
        }
      } catch (error) {
        console.error('Failed to fetch data for messages', error);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchData();
  }, [user]);

  // Protect this route from non-authorized users
  if (user && !['ADMIN', 'MANAGER', 'SALES'].includes(user.role)) {
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
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 absolute inset-0 flex flex-col">
      <div className="flex-1 min-h-0 bg-background">
        <SalesChat customers={assignedCustomers} currentUserId={user.id} />
      </div>
    </div>
  );
}
