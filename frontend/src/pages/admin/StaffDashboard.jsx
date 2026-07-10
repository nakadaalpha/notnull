import { useEffect, useState } from 'react';
import { Users, Briefcase, Wrench, CheckCircle2, Trophy, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api';

export default function StaffDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  // States
  const [salesLeaderboard, setSalesLeaderboard] = useState([]);
  const [mechanicStats, setMechanicStats] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [custRes, transRes, reserRes] = await Promise.all([
          api.get('/customers').catch(e => ({ data: [] })),
          api.get('/transactions').catch(e => ({ data: [] })),
          api.get('/reservations').catch(e => ({ data: [] }))
        ]);
        
        const allUsers = custRes.data;
        const transactions = transRes.data;
        const reservations = reserRes.data;

        // --- 1. Process Sales Leaderboard ---
        const salesTeam = allUsers.filter(u => u.role === 'SALES');
        const sLeaderboard = salesTeam.map(salesRep => {
          const assignedLeads = reservations.filter(r => r.salesId === salesRep.id);
          const closedDeals = transactions.filter(t => t.salesId === salesRep.id && (t.status === 'COMPLETED' || t.status === 'PAID'));
          const totalLeads = assignedLeads.length;
          const unitsSold = closedDeals.length;
          const conversionRate = totalLeads > 0 ? ((unitsSold / totalLeads) * 100).toFixed(1) : 0;
          const revenue = closedDeals.reduce((acc, t) => acc + (t.totalPrice || 0), 0);
          
          return {
            id: salesRep.id,
            username: salesRep.username,
            totalLeads,
            unitsSold,
            conversionRate,
            revenue
          };
        }).sort((a, b) => b.unitsSold - a.unitsSold || b.revenue - a.revenue);

        setSalesLeaderboard(sLeaderboard);

        // --- 2. Process Mechanic Stats (Preview) ---
        const mechanicTeam = allUsers.filter(u => u.role === 'MECHANIC');
        const mStats = mechanicTeam.map(mechanic => {
          return {
            id: mechanic.id,
            username: mechanic.username,
            inspectionsCompleted: 0,
            pendingInspections: 0
          };
        });
        setMechanicStats(mStats);

      } catch (error) {
        console.error('Failed to fetch staff stats', error);
      } finally {
        setLoading(false);
      }
    };
    if(user) fetchData();
  }, [user]);

  if (loading) {
    return <div className="p-8 text-center text-primary/50">Loading staff data...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Staff Analytics</h1>
      <p className="text-primary/60 text-sm mb-8 tracking-widest uppercase">Employee Performance & KPI Dashboard</p>

      {/* TIER 1: SALES LEADERBOARD */}
      <div className="mb-12">
        <h2 className="text-sm font-bold uppercase tracking-widest text-primary/80 mb-4 border-b border-primary/10 pb-2 flex items-center justify-between">
          <span className="flex items-center space-x-2"><Briefcase size={16} /> <span>Sales Performance Leaderboard</span></span>
          <span className="text-[10px] bg-primary/10 px-2 py-1 rounded text-primary/60">Target: 5 Units / Month</span>
        </h2>
        
        <div className="bg-background border border-primary/10 rounded-2xl overflow-x-auto shadow-sm">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-secondary/50 border-b border-primary/10">
                <th className="p-4 font-medium text-primary/60">Rank</th>
                <th className="p-4 font-medium text-primary/60">Sales Representative</th>
                <th className="p-4 font-medium text-primary/60 text-center">Assigned Leads</th>
                <th className="p-4 font-medium text-primary/60 text-center">Units Sold</th>
                <th className="p-4 font-medium text-primary/60">Conversion Rate</th>
                <th className="p-4 font-medium text-primary/60 text-right">Revenue Generated</th>
              </tr>
            </thead>
            <tbody>
              {salesLeaderboard.map((sales, index) => {
                const targetProgress = Math.min((sales.unitsSold / 5) * 100, 100);
                const isTopSeller = index === 0 && sales.unitsSold > 0;
                return (
                  <tr key={sales.id} className={`border-b border-primary/5 hover:bg-secondary/50 transition-colors ${isTopSeller ? 'bg-amber-500/5' : ''}`}>
                    <td className="p-4 font-bold text-primary/40">#{index + 1}</td>
                    <td className="p-4 font-medium flex items-center space-x-2">
                      {isTopSeller && <span title="Top Seller">🏆</span>}
                      <span>{sales.username}</span>
                    </td>
                    <td className="p-4 text-center">{sales.totalLeads}</td>
                    <td className="p-4 text-center">
                      <span className="font-bold">{sales.unitsSold}</span>
                      <div className="w-full max-w-[80px] mx-auto bg-primary/10 h-1.5 rounded-full mt-1 overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${targetProgress >= 100 ? 'bg-green-500' : 'bg-primary/50'}`} 
                          style={{ width: `${targetProgress}%` }}
                        />
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        sales.conversionRate >= 20 ? 'bg-green-500/10 text-green-500' : 
                        sales.conversionRate >= 10 ? 'bg-yellow-500/10 text-yellow-500' : 
                        'bg-primary/10 text-primary/60'
                      }`}>
                        {sales.conversionRate}%
                      </span>
                    </td>
                    <td className="p-4 text-right">${sales.revenue.toLocaleString()}</td>
                  </tr>
                );
              })}
              {salesLeaderboard.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-primary/40">No sales representatives found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* TIER 2: MECHANIC STATS */}
      <div>
        <h2 className="text-sm font-bold uppercase tracking-widest text-primary/80 mb-4 border-b border-primary/10 pb-2 flex items-center space-x-2">
          <Wrench size={16} />
          <span>Mechanic & Inspection KPIs</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mechanicStats.map(mechanic => (
            <div key={mechanic.id} className="bg-background border border-primary/10 rounded-2xl p-6 hover:border-primary/30 transition-colors shadow-sm">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 bg-primary/5 rounded-full flex items-center justify-center text-primary">
                  <Wrench size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{mechanic.username}</h3>
                  <p className="text-xs text-primary/50 uppercase tracking-widest">Master Mechanic</p>
                </div>
              </div>

              <div className="flex justify-between items-center bg-secondary/30 p-4 rounded-xl border border-primary/5 mb-3">
                <div className="flex items-center space-x-3">
                  <CheckCircle2 size={18} className="text-green-500" />
                  <span className="text-sm font-medium">Completed</span>
                </div>
                <span className="font-bold">{mechanic.inspectionsCompleted}</span>
              </div>
              
              <div className="flex justify-between items-center bg-secondary/30 p-4 rounded-xl border border-primary/5">
                <div className="flex items-center space-x-3">
                  <Clock size={18} className="text-yellow-500" />
                  <span className="text-sm font-medium">Pending Queue</span>
                </div>
                <span className="font-bold text-yellow-600">{mechanic.pendingInspections}</span>
              </div>
            </div>
          ))}
          
          {mechanicStats.length === 0 && (
            <div className="col-span-full p-8 text-center border border-dashed border-primary/20 rounded-2xl text-primary/40">
              No mechanics found in the system.
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
