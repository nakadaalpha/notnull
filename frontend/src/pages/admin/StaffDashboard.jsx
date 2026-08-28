import { useEffect, useState } from 'react';
import { Users, Briefcase, Wrench, CheckCircle2, Trophy, Clock, Edit, Trash2, Plus, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api';
import Modal from '../../components/Modal';

export default function StaffDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  // States
  const [salesLeaderboard, setSalesLeaderboard] = useState([]);
  const [mechanicStats, setMechanicStats] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [activeTab, setActiveTab] = useState('PERFORMANCE'); // 'PERFORMANCE' | 'MANAGEMENT'
  
  // Modal states for Staff
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedStaffId, setSelectedStaffId] = useState(null);
  const [formData, setFormData] = useState({
    username: '', password: '', email: '', phone: '', address: '', role: 'SALES'
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [custRes, transRes, reserRes] = await Promise.all([
        api.get('/customers').catch(e => ({ data: [] })),
        api.get('/transactions').catch(e => ({ data: [] })),
        api.get('/reservations').catch(e => ({ data: [] }))
      ]);
      
      const allUsers = custRes.data;
      setStaffList(allUsers.filter(u => ['ADMIN', 'MANAGER', 'SALES', 'MECHANIC'].includes(u.role)));

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

  useEffect(() => {
    if(user) fetchData();
  }, [user]);

  const openModal = (mode, staff = null) => {
    setModalMode(mode);
    if (staff) {
      setSelectedStaffId(staff.id);
      setFormData({
        username: staff.username,
        password: '', // Hidden
        email: staff.email,
        phone: staff.phone || '',
        address: staff.address || '',
        role: staff.role
      });
    } else {
      setSelectedStaffId(null);
      setFormData({ username: '', password: '', email: '', phone: '', address: '', role: 'SALES' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modalMode === 'create') {
        await api.post('/customers', formData);
      } else {
        const updateData = { ...formData };
        if (!updateData.password) delete updateData.password;
        await api.put(`/customers/${selectedStaffId}`, updateData);
        if (updateData.role) {
          await api.put(`/customers/${selectedStaffId}/role`, { role: updateData.role });
        }
      }
      closeModal();
      fetchData();
    } catch (error) {
      console.error('Save failed', error);
      alert('Failed to save staff member. Ensure you have Admin permissions.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this staff member?')) return;
    try {
      await api.delete(`/customers/${id}`);
      fetchData();
    } catch (error) {
      console.error('Delete failed', error);
      alert('Failed to delete user. They might have existing tied records.');
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-primary/50">Loading staff data...</div>;
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Staff Headquarters</h1>
          <p className="text-primary/60 text-sm tracking-widest uppercase">Performance Metrics & Employee Management</p>
        </div>
        
        {/* TABS */}
        <div className="flex bg-secondary/30 p-1 rounded-xl">
          <button 
            onClick={() => setActiveTab('PERFORMANCE')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'PERFORMANCE' ? 'bg-background shadow-sm text-primary' : 'text-primary/50 hover:text-primary'}`}
          >
            Performance Metrics
          </button>
          {['ADMIN', 'MANAGER'].includes(user?.role) && (
            <button 
              onClick={() => setActiveTab('MANAGEMENT')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'MANAGEMENT' ? 'bg-background shadow-sm text-primary' : 'text-primary/50 hover:text-primary'}`}
            >
              Staff Management
            </button>
          )}
        </div>
      </div>

      {activeTab === 'PERFORMANCE' && (
        <>
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
        </>
      )}

      {activeTab === 'MANAGEMENT' && ['ADMIN', 'MANAGER'].includes(user?.role) && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex justify-between items-center mb-6 border-b border-primary/10 pb-4">
            <h2 className="text-xl font-bold flex items-center space-x-2">
              <Shield size={24} className="text-primary/70" />
              <span>Employee Roster</span>
            </h2>
            <button 
              onClick={() => openModal('create')} 
              className="bg-primary text-background px-4 py-2 rounded-lg font-medium flex items-center space-x-2 hover:opacity-90 transition-opacity"
            >
              <Plus size={18} />
              <span>Add Staff</span>
            </button>
          </div>

          <div className="bg-background border border-primary/10 rounded-2xl overflow-x-auto shadow-sm">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-secondary/50 border-b border-primary/10">
                  <th className="p-4 font-medium text-primary/60">Staff ID</th>
                  <th className="p-4 font-medium text-primary/60">Name</th>
                  <th className="p-4 font-medium text-primary/60">Role</th>
                  <th className="p-4 font-medium text-primary/60">Contact</th>
                  <th className="p-4 font-medium text-primary/60 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {staffList.map(staff => (
                  <tr key={staff.id} className="border-b border-primary/5 hover:bg-secondary/50 transition-colors">
                    <td className="p-4 font-mono text-xs text-primary/50">{staff.id}</td>
                    <td className="p-4 font-bold">{staff.username}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wider ${
                        staff.role === 'ADMIN' ? 'bg-red-500/10 text-red-500' :
                        staff.role === 'MANAGER' ? 'bg-purple-500/10 text-purple-500' :
                        staff.role === 'MECHANIC' ? 'bg-blue-500/10 text-blue-500' :
                        'bg-green-500/10 text-green-500'
                      }`}>
                        {staff.role}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-primary/70">
                      <div>{staff.email}</div>
                      <div className="text-xs text-primary/40">{staff.phone || '-'}</div>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button onClick={() => openModal('edit', staff)} className="p-2 hover:bg-primary/10 rounded-lg transition-colors text-primary/70 hover:text-primary">
                        <Edit size={18} />
                      </button>
                      <button onClick={() => handleDelete(staff.id)} className="p-2 hover:bg-red-500/10 rounded-lg transition-colors text-red-500/70 hover:text-red-500">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* STAFF MODAL */}
      <Modal isOpen={isModalOpen} onClose={closeModal} title={modalMode === 'create' ? 'Add New Staff' : 'Edit Staff Member'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-primary/70">Username</label>
            <input required type="text" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} className="w-full bg-background border border-primary/20 px-4 py-2 rounded-lg focus:outline-none focus:border-primary" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-primary/70">
              Password {modalMode === 'edit' && <span className="text-primary/40 normal-case font-normal">(Leave blank to keep current)</span>}
            </label>
            <input required={modalMode === 'create'} type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full bg-background border border-primary/20 px-4 py-2 rounded-lg focus:outline-none focus:border-primary" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-primary/70">Email</label>
              <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-background border border-primary/20 px-4 py-2 rounded-lg focus:outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-primary/70">Phone</label>
              <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-background border border-primary/20 px-4 py-2 rounded-lg focus:outline-none focus:border-primary" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-primary/70">Role</label>
            <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full bg-background border border-primary/20 px-4 py-2 rounded-lg focus:outline-none focus:border-primary">
              <option value="SALES">SALES</option>
              <option value="MECHANIC">MECHANIC</option>
              <option value="MANAGER">MANAGER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </div>
          <div className="pt-4 flex justify-end space-x-3 border-t border-primary/10 mt-6">
            <button type="button" onClick={closeModal} className="px-4 py-2 rounded-lg font-medium text-primary/70 hover:bg-primary/5 transition-colors">Cancel</button>
            <button type="submit" className="bg-primary text-background px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity">
              {modalMode === 'create' ? 'Create Staff' : 'Save Changes'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
