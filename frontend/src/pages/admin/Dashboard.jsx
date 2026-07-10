import { useEffect, useState } from 'react';
import { Car, Users, ClipboardList, Clock, CheckCircle, TrendingUp, Calendar, ArrowRight, DollarSign, Wallet, PieChart, BarChart3, Activity, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../../api';

export default function Dashboard() {
  const { user } = useAuth();
  
  // Admin stats
  const [adminStats, setAdminStats] = useState({ 
    totalCars: 0, availableCars: 0, inventoryValue: 0,
    totalCustomers: 0,
    totalTransactions: 0, completedTransactions: 0,
    totalRevenue: 0, pendingReceivables: 0,
    agingStock: { fresh: 0, warning: 0, critical: 0 }
  });
  
  // Sales stats
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (user?.role === 'ADMIN' || user?.role === 'MANAGER') {
          const [carsRes, custRes, transRes, reserRes] = await Promise.all([
            api.get('/cars').catch(e => ({ data: [] })),
            api.get('/customers').catch(e => ({ data: [] })),
            api.get('/transactions').catch(e => ({ data: [] })),
            api.get('/reservations').catch(e => ({ data: [] }))
          ]);
          const cars = carsRes.data;
          const transactions = transRes.data;
          const reservations = reserRes.data;
          
          const completedTx = transactions.filter(t => t.status === 'COMPLETED');
          const revenue = completedTx.reduce((acc, t) => acc + (t.totalPrice || 0), 0);
          
          const pendingTx = transactions.filter(t => t.status !== 'COMPLETED' && t.status !== 'CANCELLED');
          const receivables = pendingTx.reduce((acc, t) => acc + (t.totalPrice || 0), 0);
          
          const activeInventory = cars.filter(c => c.stock > 0);
          const inventoryValue = activeInventory.reduce((acc, c) => acc + (c.price || 0), 0);

          const now = new Date();
          let fresh = 0; let warning = 0; let critical = 0;
          activeInventory.forEach(c => {
            const daysOld = Math.floor((now - new Date(c.createdAt)) / (1000 * 60 * 60 * 24));
            if (daysOld > 60) critical++;
            else if (daysOld > 30) warning++;
            else fresh++;
          });

          setAdminStats({
            totalCars: cars.length,
            availableCars: activeInventory.length,
            inventoryValue,
            totalCustomers: custRes.data.length,
            totalTransactions: transactions.length,
            completedTransactions: completedTx.length,
            totalRevenue: revenue,
            pendingReceivables: receivables,
            agingStock: { fresh, warning, critical }
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

  // --- ADMIN & MANAGER VIEW ---
  if (user?.role === 'ADMIN' || user?.role === 'MANAGER') {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h1 className="text-3xl font-bold mb-2">Financial & Sales Analytics</h1>
        <p className="text-primary/60 text-sm mb-8 tracking-widest uppercase">Restricted Admin & Manager Dashboard</p>
        
        {/* TIER 1: FINANCIAL PERFORMANCE */}
        <h2 className="text-sm font-bold uppercase tracking-widest text-primary/80 mb-4 border-b border-primary/10 pb-2">Financial Performance</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-900/10 border border-emerald-500/20 rounded-2xl p-6 flex flex-col justify-between hover:border-emerald-500/40 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-emerald-500/20 text-emerald-500 rounded-xl">
                <DollarSign size={24} />
              </div>
              <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest">Revenue</span>
            </div>
            <div>
              <h3 className="text-3xl font-black text-emerald-500 mb-1">${adminStats.totalRevenue.toLocaleString()}</h3>
              <p className="text-emerald-500/70 text-xs font-medium">From {adminStats.completedTransactions} completed sales</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-500/10 to-amber-900/10 border border-amber-500/20 rounded-2xl p-6 flex flex-col justify-between hover:border-amber-500/40 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-amber-500/20 text-amber-500 rounded-xl">
                <Clock size={24} />
              </div>
              <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">Receivables</span>
            </div>
            <div>
              <h3 className="text-3xl font-black text-amber-500 mb-1">${adminStats.pendingReceivables.toLocaleString()}</h3>
              <p className="text-amber-500/70 text-xs font-medium">Pending payments</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500/10 to-blue-900/10 border border-blue-500/20 rounded-2xl p-6 flex flex-col justify-between hover:border-blue-500/40 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-blue-500/20 text-blue-500 rounded-xl">
                <Wallet size={24} />
              </div>
              <span className="text-xs font-bold text-blue-500 uppercase tracking-widest">Inventory Assets</span>
            </div>
            <div>
              <h3 className="text-3xl font-black text-blue-500 mb-1">${adminStats.inventoryValue.toLocaleString()}</h3>
              <p className="text-blue-500/70 text-xs font-medium">Across {adminStats.availableCars} available units</p>
            </div>
          </div>
        </div>

        {/* TIER 2: OPERATIONAL METRICS */}
        <h2 className="text-sm font-bold uppercase tracking-widest text-primary/80 mb-4 border-b border-primary/10 pb-2">Operational Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-background border border-primary/10 rounded-2xl p-6 flex items-center space-x-6 hover:border-primary/30 transition-colors shadow-sm">
            <div className="p-4 bg-primary/5 text-primary rounded-xl">
              <Car size={24} />
            </div>
            <div>
              <p className="text-primary/60 text-xs font-bold tracking-widest uppercase mb-1">Total Fleet</p>
              <h3 className="text-2xl font-black">{adminStats.totalCars} <span className="text-sm font-medium text-primary/50 font-normal">units</span></h3>
            </div>
          </div>

          <div className="bg-background border border-primary/10 rounded-2xl p-6 flex items-center space-x-6 hover:border-primary/30 transition-colors shadow-sm">
            <div className="p-4 bg-primary/5 text-primary rounded-xl">
              <Users size={24} />
            </div>
            <div>
              <p className="text-primary/60 text-xs font-bold tracking-widest uppercase mb-1">Total Customers</p>
              <h3 className="text-2xl font-black">{adminStats.totalCustomers} <span className="text-sm font-medium text-primary/50 font-normal">clients</span></h3>
            </div>
          </div>

          <div className="bg-background border border-primary/10 rounded-2xl p-6 flex items-center space-x-6 hover:border-primary/30 transition-colors shadow-sm">
            <div className="p-4 bg-primary/5 text-primary rounded-xl">
              <Activity size={24} />
            </div>
            <div>
              <p className="text-primary/60 text-xs font-bold tracking-widest uppercase mb-1">Total Orders</p>
              <h3 className="text-2xl font-black">{adminStats.totalTransactions} <span className="text-sm font-medium text-primary/50 font-normal">txs</span></h3>
            </div>
          </div>
        </div>

        {/* TIER 3: INVENTORY HEALTH */}
        <h2 className="text-sm font-bold uppercase tracking-widest text-primary/80 mb-4 mt-10 border-b border-primary/10 pb-2">Inventory Health (Aging Stock)</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-green-500/5 to-green-900/5 border border-green-500/20 rounded-2xl p-6 flex items-center space-x-6 hover:border-green-500/40 transition-colors shadow-sm">
            <div className="p-4 bg-green-500/10 text-green-500 rounded-xl">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <p className="text-green-500/80 text-xs font-bold tracking-widest uppercase mb-1">Fresh (&lt;30 Days)</p>
              <h3 className="text-2xl font-black">{adminStats.agingStock.fresh} <span className="text-sm font-medium text-green-500/50 font-normal">units</span></h3>
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-500/5 to-yellow-900/5 border border-yellow-500/20 rounded-2xl p-6 flex items-center space-x-6 hover:border-yellow-500/40 transition-colors shadow-sm">
            <div className="p-4 bg-yellow-500/10 text-yellow-500 rounded-xl">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-yellow-500/80 text-xs font-bold tracking-widest uppercase mb-1">Warning (31-60 Days)</p>
              <h3 className="text-2xl font-black">{adminStats.agingStock.warning} <span className="text-sm font-medium text-yellow-500/50 font-normal">units</span></h3>
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-500/5 to-red-900/5 border border-red-500/20 rounded-2xl p-6 flex items-center space-x-6 hover:border-red-500/40 transition-colors shadow-sm">
            <div className="p-4 bg-red-500/10 text-red-500 rounded-xl">
              <AlertTriangle size={24} />
            </div>
            <div>
              <p className="text-red-500/80 text-xs font-bold tracking-widest uppercase mb-1">Critical (&gt;60 Days)</p>
              <h3 className="text-2xl font-black">{adminStats.agingStock.critical} <span className="text-sm font-medium text-red-500/50 font-normal">units</span></h3>
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
