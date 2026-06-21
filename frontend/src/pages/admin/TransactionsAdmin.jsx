import { useEffect, useState } from 'react';
import { FileText } from 'lucide-react';
import api from '../../api';

export default function TransactionsAdmin() {
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

      <div className="bg-background border border-primary/10 rounded-2xl overflow-hidden">
        <table className="w-full text-left border-collapse">
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
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      trx.status === 'COMPLETED' ? 'bg-green-500/10 text-green-500' :
                      trx.status === 'PENDING' ? 'bg-orange-500/10 text-orange-500' :
                      'bg-red-500/10 text-red-500'
                    }`}>
                      {trx.status}
                    </span>
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
