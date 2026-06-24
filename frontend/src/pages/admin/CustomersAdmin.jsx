import { useEffect, useState } from 'react';
import { Users, Edit, Trash2 } from 'lucide-react';
import api from '../../api';
import { useAuth } from '../../context/AuthContext';
import Modal from '../../components/Modal';

export default function CustomersAdmin() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Search and Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('ALL');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedCustId, setSelectedCustId] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    phone: '',
    address: ''
  });

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/customers');
      setCustomers(response.data);
    } catch (error) {
      console.error('Failed to fetch customers', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleRoleChange = async (id, newRole) => {
    if (!window.confirm("Are you sure you want to change this user's role?")) return;
    try {
      await api.put(`/customers/${id}/role`, { role: newRole });
      setCustomers(customers.map(c => c.id === id ? { ...c, role: newRole } : c));
    } catch (error) {
      console.error('Failed to update role', error);
      alert('Failed to update role. You might not have permission.');
    }
  };

  const openModal = (mode, cust = null) => {
    setModalMode(mode);
    if (cust) {
      setSelectedCustId(cust.id);
      setFormData({
        username: cust.username,
        password: '', // Don't show existing password
        email: cust.email,
        phone: cust.phone || '',
        address: cust.address || ''
      });
    } else {
      setSelectedCustId(null);
      setFormData({ username: '', password: '', email: '', phone: '', address: '' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (modalMode === 'edit' && !window.confirm('Are you sure you want to save these changes?')) return;
    try {
      if (modalMode === 'create') {
        await api.post('/customers', formData);
      } else {
        // Exclude password if empty on edit
        const updateData = { ...formData };
        if (!updateData.password) delete updateData.password;
        await api.put(`/customers/${selectedCustId}`, updateData);
      }
      closeModal();
      fetchCustomers();
    } catch (error) {
      console.error('Save failed', error);
      alert('Failed to save customer. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await api.delete(`/customers/${id}`);
      if (isModalOpen && selectedCustId === id) closeModal();
      fetchCustomers();
    } catch (error) {
      console.error('Delete failed', error);
      alert(error.response?.data?.error || 'Failed to delete user.');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{user?.role === 'ADMIN' ? 'Users' : 'Customers'}</h1>
        {user?.role === 'ADMIN' && (
          <button onClick={() => openModal('create')} className="bg-foreground text-background px-4 py-2 rounded-lg font-medium flex items-center space-x-2 hover:opacity-90 transition-opacity">
            <Users size={18} />
            <span>Add User</span>
          </button>
        )}
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input 
          type="text" 
          placeholder="Search by username or email..." 
          className="flex-1 bg-background border border-primary/20 px-4 py-2 rounded-lg focus:outline-none focus:border-primary text-primary"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {user?.role === 'ADMIN' && (
          <select 
            className="bg-background border border-primary/20 px-4 py-2 rounded-lg focus:outline-none focus:border-primary text-primary"
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
          >
            <option value="ALL">All Roles</option>
            <option value="CUSTOMER">Customer</option>
            <option value="SALES">Sales</option>
            <option value="ADMIN">Admin</option>
          </select>
        )}
      </div>

      <div className="bg-background border border-primary/10 rounded-2xl overflow-x-auto" data-lenis-prevent>
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead>
            <tr className="bg-secondary/50 border-b border-primary/10">
              <th className="p-4 font-medium text-primary/60">ID</th>
              <th className="p-4 font-medium text-primary/60">Username</th>
              <th className="p-4 font-medium text-primary/60">Email</th>
              <th className="p-4 font-medium text-primary/60">Phone</th>
              {user?.role === 'ADMIN' && <th className="p-4 font-medium text-primary/60">Role</th>}
              <th className="p-4 font-medium text-primary/60">Registered</th>
              <th className="p-4 font-medium text-primary/60">Transactions</th>
              {user?.role === 'ADMIN' && <th className="p-4 font-medium text-primary/60 text-right">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="8" className="p-4 text-center">Loading...</td></tr>
            ) : customers.filter(cust => {
              const matchesSearch = cust.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                    cust.email.toLowerCase().includes(searchTerm.toLowerCase());
              const matchesRole = user?.role === 'ADMIN' ? (filterRole === 'ALL' || cust.role === filterRole) : cust.role === 'CUSTOMER';
              return matchesSearch && matchesRole;
            }).length === 0 ? (
              <tr><td colSpan={user?.role === 'ADMIN' ? "8" : "6"} className="p-4 text-center">No {user?.role === 'ADMIN' ? 'users' : 'customers'} found matching filters.</td></tr>
            ) : (
              customers.filter(cust => {
                const matchesSearch = cust.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                      cust.email.toLowerCase().includes(searchTerm.toLowerCase());
                const matchesRole = user?.role === 'ADMIN' ? (filterRole === 'ALL' || cust.role === filterRole) : cust.role === 'CUSTOMER';
                return matchesSearch && matchesRole;
              }).map((cust) => (
                <tr key={cust.id} onClick={() => user?.role === 'ADMIN' && openModal('edit', cust)} className={`border-b border-primary/5 transition-colors ${user?.role === 'ADMIN' ? 'cursor-pointer hover:bg-secondary/50' : 'hover:bg-secondary/10'}`}>
                  <td className="p-4">#{cust.id}</td>
                  <td className="p-4 font-medium">{cust.username}</td>
                  <td className="p-4">{cust.email}</td>
                  <td className="p-4">{cust.phone || '-'}</td>
                  {user?.role === 'ADMIN' && (
                    <td className="p-4" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={cust.role}
                        onChange={(e) => handleRoleChange(cust.id, e.target.value)}
                        className="bg-secondary text-primary px-2 py-1 rounded border border-primary/20 focus:outline-none"
                      >
                        <option value="CUSTOMER">CUSTOMER</option>
                        <option value="SALES">SALES</option>
                        <option value="MANAGER">MANAGER</option>
                        <option value="MECHANIC">MECHANIC</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    </td>
                  )}
                  <td className="p-4">{new Date(cust.createdAt).toLocaleDateString()}</td>
                  <td className="p-4">
                    <span className="bg-primary/5 px-3 py-1 rounded-full text-sm font-medium">
                      {cust._count?.transactions || 0}
                    </span>
                  </td>
                  {user?.role === 'ADMIN' && (
                    <td className="p-4 text-right">
                      <button onClick={(e) => { e.stopPropagation(); openModal('edit', cust); }} className="p-2 hover:bg-primary/10 rounded-full transition-colors mr-2">
                        <Edit size={18} />
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); handleDelete(cust.id); }} className="p-2 hover:bg-red-500/10 text-red-500 rounded-full transition-colors disabled:opacity-50">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} title={modalMode === 'create' ? `Add New ${user?.role === 'ADMIN' ? 'User' : 'Customer'}` : `Edit ${user?.role === 'ADMIN' ? 'User' : 'Customer'}`}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <input
              type="text"
              required
              className="w-full bg-secondary text-primary px-4 py-2 rounded-lg border border-primary/20 focus:outline-none focus:border-primary"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              required
              className="w-full bg-secondary text-primary px-4 py-2 rounded-lg border border-primary/20 focus:outline-none focus:border-primary"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Password {modalMode === 'edit' && <span className="text-primary/50 text-xs">(Leave blank to keep unchanged)</span>}
            </label>
            <input
              type="password"
              required={modalMode === 'create'}
              className="w-full bg-secondary text-primary px-4 py-2 rounded-lg border border-primary/20 focus:outline-none focus:border-primary"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Role</label>
            <select
              className="w-full bg-secondary text-primary px-4 py-2 rounded-lg border border-primary/20 focus:outline-none focus:border-primary"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            >
              <option value="CUSTOMER">CUSTOMER</option>
              <option value="SALES">SALES</option>
              <option value="MANAGER">MANAGER</option>
              <option value="MECHANIC">MECHANIC</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input
              type="text"
              className="w-full bg-secondary text-primary px-4 py-2 rounded-lg border border-primary/20 focus:outline-none focus:border-primary"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Address</label>
            <textarea
              className="w-full bg-secondary text-primary px-4 py-2 rounded-lg border border-primary/20 focus:outline-none focus:border-primary"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              rows="3"
            ></textarea>
          </div>
          <div className="flex space-x-4 mt-4">
            {modalMode === 'edit' && user?.role === 'ADMIN' && (
              <button 
                type="button" 
                onClick={() => handleDelete(selectedCustId)} 
                className="w-1/3 bg-red-500/10 text-red-500 py-3 rounded-lg font-bold hover:bg-red-500/20 transition-colors"
              >
                Delete
              </button>
            )}
            <button type="submit" className={`bg-foreground text-background py-3 rounded-lg font-bold hover:opacity-90 transition-opacity ${(modalMode === 'edit' && user?.role === 'ADMIN') ? 'w-2/3' : 'w-full'}`}>
              {modalMode === 'create' ? `Add ${user?.role === 'ADMIN' ? 'User' : 'Customer'}` : 'Save Changes'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
