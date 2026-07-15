import React, { useEffect, useState } from 'react';
import { Clock, CheckCircle, X, Search } from 'lucide-react';
import api from '../../api';

export default function TestDrivesAdmin() {
  const [testDrives, setTestDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchTestDrives();
  }, []);

  const fetchTestDrives = async () => {
    setLoading(true);
    try {
      const res = await api.get('/test-drives');
      setTestDrives(res.data);
    } catch (error) {
      console.error('Failed to fetch test drives:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (tdId) => {
    if (confirm('Are you sure the License matches and is valid?')) {
      try {
        await api.patch(`/test-drives/${tdId}/verify`);
        setTestDrives(prev => prev.map(t => t.id === tdId ? { ...t, status: 'SCHEDULED', customer: {...t.customer, is_sim_verified: true} } : t));
      } catch (e) { alert('Verification failed'); }
    }
  };

  const handleComplete = async (tdId) => {
    try {
      await api.patch(`/test-drives/${tdId}/complete`);
      setTestDrives(prev => prev.map(t => t.id === tdId ? { ...t, status: 'COMPLETED' } : t));
    } catch (e) { alert('Completion failed'); }
  };

  const filteredTestDrives = testDrives.filter(td => 
    td.customer?.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
    td.car?.brand?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    td.car?.model.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="p-8 text-center text-primary/50">Loading test drives...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Test Drives & KYC</h1>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input 
          type="text"
          placeholder="Search customer or car..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 bg-background border border-primary/20 px-4 py-2 rounded-lg focus:outline-none focus:border-primary text-primary"
        />
      </div>

      <div className="bg-background border border-primary/10 rounded-2xl overflow-x-auto shadow-sm">
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead>
            <tr className="bg-secondary/50 border-b border-primary/10">
              <th className="p-4 font-medium text-primary/60">Customer</th>
              <th className="p-4 font-medium text-primary/60">Vehicle</th>
              <th className="p-4 font-medium text-primary/60">Schedule</th>
              <th className="p-4 font-medium text-primary/60">KYC Status</th>
              <th className="p-4 font-medium text-primary/60">Drive Status</th>
              <th className="p-4 font-medium text-primary/60 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTestDrives.map(td => (
              <tr key={td.id} className="border-b border-primary/5 hover:bg-secondary/50 transition-colors">
                <td className="p-4">
                  <div className="font-bold">{td.customer?.username}</div>
                  <div className="text-xs text-primary/60">{td.customer?.phone || td.customer?.email}</div>
                  <div className="text-[10px] text-primary/40 font-mono mt-1">ID: {td.customer?.id}</div>
                </td>
                <td className="p-4">
                  <div className="font-medium">{td.car?.brand?.name} {td.car?.model}</div>
                  <div className="text-xs text-primary/50">{td.location_type}</div>
                  <div className="text-[10px] text-primary/40 font-mono mt-1">ID: {td.car?.id}</div>
                </td>
                <td className="p-4">
                  {new Date(td.schedule_date).toLocaleString()}
                </td>
                <td className="p-4">
                  {td.customer?.is_sim_verified ? (
                    <span className="text-xs px-2 py-1 rounded bg-green-500/10 text-green-500 font-bold">Verified</span>
                  ) : (
                    <div className="flex flex-col space-y-1 items-start">
                      <span className="text-xs px-2 py-1 rounded bg-yellow-500/10 text-yellow-500 font-bold">Pending Review</span>
                      <button 
                        onClick={async () => {
                          try {
                            const response = await api.get(`/users/kyc/sim/image/${td.customer?.id}`, { responseType: 'blob' });
                            const url = URL.createObjectURL(response.data);
                            window.open(url, '_blank');
                          } catch (error) {
                            alert('Failed to load license image.');
                          }
                        }}
                        className="text-[10px] text-blue-500 hover:underline"
                      >
                        View License
                      </button>
                    </div>
                  )}
                </td>
                <td className="p-4">
                  <span className={`text-xs font-bold uppercase tracking-widest px-2 py-1 rounded ${
                    td.status === 'COMPLETED' ? 'bg-blue-500/10 text-blue-500' : 
                    td.status === 'SCHEDULED' ? 'bg-green-500/10 text-green-500' : 
                    'bg-primary/10 text-primary'
                  }`}>
                    {td.status}
                  </span>
                </td>
                <td className="p-4 text-right space-x-2">
                  {td.status === 'REQUESTED' && !td.customer?.is_sim_verified && (
                    <button 
                      onClick={() => handleVerify(td.id)}
                      className="px-3 py-1 bg-green-500 text-white rounded text-xs font-bold hover:bg-green-600 transition-colors"
                    >
                      Verify KYC & Approve
                    </button>
                  )}
                  {td.status === 'SCHEDULED' && (
                    <button 
                      onClick={() => handleComplete(td.id)}
                      className="px-3 py-1 bg-blue-500 text-white rounded text-xs font-bold hover:bg-blue-600 transition-colors"
                    >
                      Mark Completed
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {filteredTestDrives.length === 0 && (
              <tr>
                <td colSpan="6" className="p-8 text-center text-primary/40">
                  {searchTerm ? 'No test drives match your search.' : 'No test drives scheduled.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
