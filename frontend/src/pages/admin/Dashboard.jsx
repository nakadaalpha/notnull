import { useEffect, useState } from 'react';
import { Car, Users, ClipboardList } from 'lucide-react';
import api from '../../api';

export default function Dashboard() {
  const [stats, setStats] = useState({ cars: 0, customers: 0, transactions: 0 });

  useEffect(() => {
    // In a real app, you might have a dedicated /api/stats endpoint
    // Here we just fetch all and count them as a simple example
    const fetchData = async () => {
      try {
        const [carsRes, custRes, transRes] = await Promise.all([
          api.get('/cars').catch(e => { console.error(e); return { data: [] }; }),
          api.get('/customers').catch(e => { console.error(e); return { data: [] }; }),
          api.get('/transactions').catch(e => { console.error(e); return { data: [] }; })
        ]);
        setStats({
          cars: carsRes.data.length,
          customers: custRes.data.length,
          transactions: transRes.data.length
        });
      } catch (error) {
        console.error('Failed to fetch stats', error);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-background border border-primary/10 rounded-2xl p-6 flex items-center space-x-6">
          <div className="p-4 bg-blue-500/10 text-blue-500 rounded-xl">
            <Car size={32} />
          </div>
          <div>
            <p className="text-primary/60 text-sm font-medium">Total Cars</p>
            <h3 className="text-3xl font-bold">{stats.cars}</h3>
          </div>
        </div>

        <div className="bg-background border border-primary/10 rounded-2xl p-6 flex items-center space-x-6">
          <div className="p-4 bg-green-500/10 text-green-500 rounded-xl">
            <Users size={32} />
          </div>
          <div>
            <p className="text-primary/60 text-sm font-medium">Total Customers</p>
            <h3 className="text-3xl font-bold">{stats.customers}</h3>
          </div>
        </div>

        <div className="bg-background border border-primary/10 rounded-2xl p-6 flex items-center space-x-6">
          <div className="p-4 bg-purple-500/10 text-purple-500 rounded-xl">
            <ClipboardList size={32} />
          </div>
          <div>
            <p className="text-primary/60 text-sm font-medium">Transactions</p>
            <h3 className="text-3xl font-bold">{stats.transactions}</h3>
          </div>
        </div>
      </div>
    </div>
  );
}
