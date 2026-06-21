import { useEffect, useState } from 'react';
import { Car, Users, ClipboardList, Clock, CheckCircle, TrendingUp, Calendar, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../../api';

export default function Dashboard() {
  const { user } = useAuth();
  
  // Admin stats
  const [adminStats, setAdminStats] = useState({ cars: 0, customers: 0, transactions: 0 });
  
  // Sales stats
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (user?.role === 'ADMIN') {
          const [carsRes, custRes, transRes] = await Promise.all([
            api.get('/cars').catch(e => ({ data: [] })),
            api.get('/customers').catch(e => ({ data: [] })),
            api.get('/transactions').catch(e => ({ data: [] }))
          ]);
          setAdminStats({
            cars: carsRes.data.length,
            customers: custRes.data.length,
            transactions: transRes.data.length
          });
        } else if (user?.role === 'SALES') {
          const res = await api.get(`/reservations/user/${user.id}`).catch(e => ({ data: [] }));
          setSalesData(res.data);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard stats', error);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // --- ADMIN VIEW ---
  if (user?.role === 'ADMIN') {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h1 className="text-3xl font-bold mb-2">Admin Overview</h1>
        <p className="text-primary/60 text-sm mb-8 tracking-widest uppercase">Global Platform Statistics</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-background border border-primary/10 rounded-2xl p-6 flex items-center space-x-6 hover:border-primary/30 transition-colors">
            <div className="p-4 bg-blue-500/10 text-blue-500 rounded-xl">
              <Car size={32} />
            </div>
            <div>
              <p className="text-primary/60 text-xs font-bold tracking-widest uppercase mb-1">Total Cars</p>
              <h3 className="text-4xl font-black">{adminStats.cars}</h3>
            </div>
          </div>

          <div className="bg-background border border-primary/10 rounded-2xl p-6 flex items-center space-x-6 hover:border-primary/30 transition-colors">
            <div className="p-4 bg-green-500/10 text-green-500 rounded-xl">
              <Users size={32} />
            </div>
            <div>
              <p className="text-primary/60 text-xs font-bold tracking-widest uppercase mb-1">Total Customers</p>
              <h3 className="text-4xl font-black">{adminStats.customers}</h3>
            </div>
          </div>

          <div className="bg-background border border-primary/10 rounded-2xl p-6 flex items-center space-x-6 hover:border-primary/30 transition-colors">
            <div className="p-4 bg-purple-500/10 text-purple-500 rounded-xl">
              <ClipboardList size={32} />
            </div>
            <div>
              <p className="text-primary/60 text-xs font-bold tracking-widest uppercase mb-1">Transactions</p>
              <h3 className="text-4xl font-black">{adminStats.transactions}</h3>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- SALES VIEW ---
  const pendingCount = salesData.filter(r => r.status === 'PENDING').length;
  const completedCount = salesData.filter(r => r.status === 'PAID' || r.status === 'COMPLETED').length;
  const recentReservations = [...salesData].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-3xl font-bold mb-2">Sales Analytics</h1>
      <p className="text-primary/60 text-sm mb-8 tracking-widest uppercase">Your Performance & Pipeline</p>
      
      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-background border border-primary/10 rounded-2xl p-6 flex items-center space-x-6 hover:border-primary/30 transition-colors">
          <div className="p-4 bg-primary/10 text-primary rounded-xl">
            <Users size={32} strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-primary/60 text-[10px] font-bold tracking-[0.2em] uppercase mb-1">Total Assigned</p>
            <h3 className="text-4xl font-black">{salesData.length}</h3>
          </div>
        </div>

        <div className="bg-background border border-orange-500/20 rounded-2xl p-6 flex items-center space-x-6 hover:border-orange-500/40 transition-colors relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 opacity-5 group-hover:scale-110 transition-transform duration-500">
            <Clock size={120} strokeWidth={1} />
          </div>
          <div className="p-4 bg-orange-500/10 text-orange-500 rounded-xl relative z-10">
            <Clock size={32} strokeWidth={1.5} />
          </div>
          <div className="relative z-10">
            <p className="text-orange-500/80 text-[10px] font-bold tracking-[0.2em] uppercase mb-1">Pending Actions</p>
            <h3 className="text-4xl font-black text-orange-500">{pendingCount}</h3>
          </div>
        </div>

        <div className="bg-background border border-green-500/20 rounded-2xl p-6 flex items-center space-x-6 hover:border-green-500/40 transition-colors relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 opacity-5 group-hover:scale-110 transition-transform duration-500">
            <TrendingUp size={120} strokeWidth={1} />
          </div>
          <div className="p-4 bg-green-500/10 text-green-600 rounded-xl relative z-10">
            <CheckCircle size={32} strokeWidth={1.5} />
          </div>
          <div className="relative z-10">
            <p className="text-green-600/80 text-[10px] font-bold tracking-[0.2em] uppercase mb-1">Successful Deals</p>
            <h3 className="text-4xl font-black text-green-600">{completedCount}</h3>
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="bg-background border border-primary/10 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-primary/10 flex justify-between items-center bg-secondary/5">
          <h3 className="text-sm font-bold tracking-[0.2em] uppercase">Recent Assignments</h3>
        </div>
        
        {recentReservations.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-primary/40 text-xs font-bold tracking-widest uppercase">No recent activity</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-secondary/5 text-primary/60 text-[10px] font-bold uppercase tracking-[0.2em]">
                <tr>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Car Model</th>
                  <th className="px-6 py-4">Inspection Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary/5">
                {recentReservations.map((res) => (
                  <tr key={res.id} className="hover:bg-secondary/5 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-bold">{res.customer?.username || 'Unknown'}</div>
                      <div className="text-xs text-primary/50">{res.customer?.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-primary/80">
                      {res.car?.model || `Car #${res.carId}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-primary/60 flex items-center">
                      <Calendar size={12} className="mr-2" />
                      {new Date(res.inspectionDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase border ${
                        res.status === 'PAID' ? 'bg-green-500/10 text-green-600 border-green-500/20' : 
                        res.status === 'PENDING' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' : 
                        'bg-primary/10 text-primary border-primary/20'
                      }`}>
                        {res.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button className="p-2 bg-secondary text-primary rounded hover:bg-primary/10 transition-colors" title="View details">
                        <ArrowRight size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
