import { useEffect, useState } from 'react';
import { FileText } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api';

export default function TransactionsAdmin() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search and Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await api.get('/transactions');
        setTransactions(response.data);
      } catch (error) {
        console.error('Failed to fetch transactions', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await api.put(`/transactions/${id}/status`, { status: newStatus });
      setTransactions(transactions.map(trx => 
        trx.id === id ? { ...trx, status: newStatus } : trx
      ));
    } catch (error) {
      console.error('Failed to update status', error);
      alert(error.response?.data?.error || 'Failed to update transaction status');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Transactions</h1>
        <button className="bg-foreground text-background px-4 py-2 rounded-lg font-medium flex items-center space-x-2 hover:opacity-90 transition-opacity">
          <FileText size={18} />
          <span>Export Report</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input 
          type="text" 
          placeholder="Search by customer or car model..." 
          className="flex-1 bg-background border border-primary/20 px-4 py-2 rounded-lg focus:outline-none focus:border-primary text-primary"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select 
          className="bg-background border border-primary/20 px-4 py-2 rounded-lg focus:outline-none focus:border-primary text-primary"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="ALL">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      <div className="bg-background border border-primary/10 rounded-2xl overflow-x-auto" data-lenis-prevent>
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead>
            <tr className="bg-secondary/50 border-b border-primary/10">
              <th className="p-4 font-medium text-primary/60">ID</th>
              <th className="p-4 font-medium text-primary/60">Customer</th>
              <th className="p-4 font-medium text-primary/60">Car</th>
              <th className="p-4 font-medium text-primary/60">Date</th>
              <th className="p-4 font-medium text-primary/60">Total Price</th>
              <th className="p-4 font-medium text-primary/60">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" className="p-4 text-center">Loading...</td></tr>
            ) : transactions.filter(trx => {
              const matchesSearch = trx.customer?.username?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                    trx.car?.model?.toLowerCase().includes(searchTerm.toLowerCase());
              const matchesStatus = filterStatus === 'ALL' || trx.status === filterStatus;
              return matchesSearch && matchesStatus;
            }).length === 0 ? (
              <tr><td colSpan="6" className="p-4 text-center">No transactions found matching filters.</td></tr>
            ) : (
              transactions.filter(trx => {
                const matchesSearch = trx.customer?.username?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                      trx.car?.model?.toLowerCase().includes(searchTerm.toLowerCase());
                const matchesStatus = filterStatus === 'ALL' || trx.status === filterStatus;
                return matchesSearch && matchesStatus;
              }).map((trx) => (
                <tr key={trx.id} className="border-b border-primary/5 hover:bg-secondary/30 transition-colors">
                  <td className="p-4">#{trx.id}</td>
                  <td className="p-4 font-medium">{trx.customer?.username || 'Unknown'}</td>
                  <td className="p-4">{trx.car?.brand?.name} {trx.car?.model}</td>
                  <td className="p-4">{new Date(trx.createdAt).toLocaleDateString()}</td>
                  <td className="p-4">${trx.totalPrice?.toLocaleString()}</td>
                  <td className="p-4">
                    <select 
                      value={trx.status}
                      onChange={(e) => handleUpdateStatus(trx.id, e.target.value)}
                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border focus:outline-none cursor-pointer appearance-none ${
                        trx.status === 'COMPLETED' ? 'bg-green-500/10 text-green-600 border-green-500/20' :
                        trx.status === 'PENDING_PAYMENT' ? 'bg-orange-500/10 text-orange-600 border-orange-500/20' :
                        trx.status === 'AWAITING_PAYMENT' ? 'bg-purple-500/10 text-purple-600 border-purple-500/20' :
                        trx.status === 'BOOKED' ? 'bg-blue-500/10 text-blue-600 border-blue-500/20' :
                        'bg-red-500/10 text-red-600 border-red-500/20'
                      }`}
                    >
                      <option value="PENDING_PAYMENT">PENDING_PAYMENT</option>
                      <option value="BOOKED">BOOKED</option>
                      <option value="AWAITING_PAYMENT">AWAITING_PAYMENT</option>
                      {/* SALES role cannot mark as COMPLETED */}
                      {(user?.role === 'ADMIN' || user?.role === 'MANAGER' || trx.status === 'COMPLETED') && (
                        <option value="COMPLETED" disabled={user?.role === 'SALES'}>COMPLETED</option>
                      )}
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
