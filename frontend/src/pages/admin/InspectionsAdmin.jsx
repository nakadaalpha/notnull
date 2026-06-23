import { useEffect, useState } from 'react';
import { Wrench, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api';

export default function InspectionsAdmin() {
  const { user } = useAuth();
  const [tradeIns, setTradeIns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTradeIns();
  }, []);

  const fetchTradeIns = async () => {
    try {
      const response = await api.get('/trade-in');
      setTradeIns(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus, value = undefined) => {
    try {
      await api.put(`/trade-in/${id}/status`, { status: newStatus, appraisedValue: value });
      fetchTradeIns();
    } catch (error) {
      alert('Failed to update status');
    }
  };

  if (loading) return <div>Loading queue...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter">Inspection Queue</h1>
          <p className="text-sm text-primary/50 tracking-widest uppercase mt-1">Manage Trade-In Vehicles</p>
        </div>
      </div>

      <div className="bg-secondary/5 rounded-xl border border-primary/10 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-primary/5 text-[10px] font-bold tracking-widest uppercase text-primary/50">
            <tr>
              <th className="p-4">Customer</th>
              <th className="p-4">Vehicle</th>
              <th className="p-4">Plate</th>
              <th className="p-4">Status</th>
              <th className="p-4">Appraised Value</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {tradeIns.map(trade => (
              <tr key={trade.id} className="border-b border-primary/5 hover:bg-primary/5 transition-colors">
                <td className="p-4">
                  <p className="font-bold">{trade.customer.username}</p>
                  <p className="text-xs text-primary/50">{trade.customer.phone}</p>
                </td>
                <td className="p-4 font-bold">{trade.brand} {trade.model} ({trade.year})</td>
                <td className="p-4">{trade.licensePlate}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border ${
                    trade.status === 'APPROVED' ? 'bg-green-500/10 text-green-600 border-green-500/20' :
                    trade.status === 'WAITING_APPROVAL' ? 'bg-purple-500/10 text-purple-600 border-purple-500/20' :
                    'bg-orange-500/10 text-orange-600 border-orange-500/20'
                  }`}>
                    {trade.status}
                  </span>
                </td>
                <td className="p-4">
                  {trade.appraisedValue ? `$${trade.appraisedValue.toLocaleString()}` : '-'}
                </td>
                <td className="p-4 text-right space-x-2">
                  {(user?.role === 'SALES' || user?.role === 'MANAGER' || user?.role === 'ADMIN') && trade.status === 'TRADE_IN_PENDING' && (
                    <button onClick={() => updateStatus(trade.id, 'INSPECTION_SCHEDULED')} className="px-3 py-1 bg-primary text-background text-xs rounded uppercase font-bold">
                      Schedule
                    </button>
                  )}
                  {(user?.role === 'MECHANIC' || user?.role === 'MANAGER' || user?.role === 'ADMIN') && trade.status === 'INSPECTION_SCHEDULED' && (
                    <button onClick={() => {
                      const val = prompt('Enter Appraised Value ($):');
                      if (val) updateStatus(trade.id, 'WAITING_APPROVAL', val);
                    }} className="px-3 py-1 bg-purple-600 text-white text-xs rounded uppercase font-bold">
                      Appraise
                    </button>
                  )}
                  {(user?.role === 'MANAGER' || user?.role === 'ADMIN') && trade.status === 'WAITING_APPROVAL' && (
                    <button onClick={() => updateStatus(trade.id, 'APPROVED')} className="px-3 py-1 bg-green-600 text-white text-xs rounded uppercase font-bold">
                      Approve
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {tradeIns.length === 0 && (
              <tr>
                <td colSpan="6" className="p-8 text-center text-primary/50 text-sm uppercase tracking-widest">
                  No trade-in requests found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
