import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../api';
import { User, Mail, Phone, MapPin, Shield, Edit2, Check, X, KeyRound, Car, ExternalLink, Calendar } from 'lucide-react';
import ScheduleInspectionModal from '../components/ScheduleInspectionModal';
import TransactionDetailModal from '../components/TransactionDetailModal';
import TradeInDetailModal from '../components/TradeInDetailModal';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [tradeIns, setTradeIns] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'identity';
  const setActiveTab = (tab) => setSearchParams({ tab }, { replace: true });

  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [selectedTradeIn, setSelectedTradeIn] = useState(null);

  const [selectedTransactionDetail, setSelectedTransactionDetail] = useState(null);
  const [selectedTradeInDetail, setSelectedTradeInDetail] = useState(null);

  useEffect(() => {
    if (scheduleModalOpen || selectedTransactionDetail || selectedTradeInDetail) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [scheduleModalOpen, selectedTransactionDetail, selectedTradeInDetail]);

  const [editingField, setEditingField] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [profileRes, reservationsRes, transactionsRes, tradeInsRes] = await Promise.all([
        api.get('/auth/me'),
        api.get(`/reservations/user/${user.id}`),
        api.get(`/transactions/user/${user.id}`),
        api.get('/trade-in/me')
      ]);
      setProfile(profileRes.data);
      setReservations(reservationsRes.data);
      setTransactions(transactionsRes.data);
      setTradeIns(tradeInsRes.data);
    } catch (err) {
      console.error('Failed to load account data', err);
      setError('Failed to load some account details.');
    } finally {
      setLoading(false);
    }
  };

  const cancelTransaction = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this purchase?')) return;
    try {
      await api.put(`/transactions/${id}/cancel`);
      fetchData();
    } catch (error) {
      console.error(error);
      alert('Failed to cancel payment');
    }
  };

  const cancelTradeIn = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this trade-in?')) return;
    try {
      await api.put(`/trade-in/${id}/cancel`);
      fetchData();
    } catch (error) {
      console.error(error);
      alert('Failed to cancel trade-in');
    }
  };

  const handleEditClick = (field, currentValue) => {
    setEditingField(field);
    setEditValue(field === 'password' ? '' : currentValue || '');
  };

  const handleCancelEdit = () => {
    setEditingField(null);
    setEditValue('');
  };

  const handleSave = async (field) => {
    setError('');
    setSuccess('');
    
    if (field === 'password' && editValue.trim() === '') {
      handleCancelEdit();
      return;
    }

    try {
      setSaving(true);
      const payload = {
        username: profile.username,
        email: profile.email,
        phone: profile.phone || '',
        address: profile.address || '',
        password: ''
      };
      
      payload[field] = editValue;

      const res = await api.put('/auth/me', payload);
      setProfile(res.data);
      
      if (field === 'username') {
        updateUser({ username: res.data.username });
      }
      
      setSuccess('Profile updated successfully!');
      setEditingField(null);
      setEditValue('');
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Update failed', err);
      setError(err.response?.data?.error || 'Failed to update profile');
      setTimeout(() => setError(''), 3000);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex justify-center items-center bg-background">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex justify-center items-center bg-background text-primary">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Account Not Found</h2>
          <p className="text-primary/60">We could not load your account details.</p>
        </div>
      </div>
    );
  }

  const renderEditableField = (field, label, icon, type = "text", displayValue = null) => {
    const isEditing = editingField === field;
    const value = displayValue !== null ? displayValue : profile[field];
    
    return (
      <div className="flex flex-col md:flex-row md:items-start justify-between group py-4 border-b border-primary/5 last:border-0 relative">
        <div className="flex items-start space-x-4 w-full">
          <div className="p-3 rounded-full bg-primary/5 text-primary shrink-0">
            {icon}
          </div>
          <div className="flex-1 min-w-0 pr-12">
            <p className="text-xs font-bold tracking-widest uppercase text-primary/40 mb-1">{label}</p>
            {isEditing ? (
              <div className="flex items-center space-x-2 mt-2">
                {type === 'textarea' ? (
                  <textarea
                    autoFocus
                    className="flex-1 bg-background text-primary px-3 py-2 rounded-lg border border-primary/20 focus:outline-none focus:border-primary transition-colors font-medium resize-none min-h-[80px]"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                  />
                ) : (
                  <input
                    type={type}
                    autoFocus
                    className="flex-1 bg-background text-primary px-3 py-2 rounded-lg border border-primary/20 focus:outline-none focus:border-primary transition-colors font-medium"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    placeholder={field === 'password' ? 'Enter new password' : ''}
                  />
                )}
                <div className="flex flex-col space-y-1 shrink-0">
                  <button 
                    onClick={() => handleSave(field)} 
                    disabled={saving}
                    className="p-2 bg-foreground text-background hover:opacity-80 rounded-md transition-opacity flex items-center justify-center disabled:opacity-50"
                  >
                    <Check size={16} />
                  </button>
                  <button 
                    onClick={handleCancelEdit} 
                    disabled={saving}
                    className="p-2 bg-secondary text-primary hover:bg-primary/10 rounded-md transition-colors flex items-center justify-center disabled:opacity-50"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <p className="font-medium text-lg truncate whitespace-pre-wrap">
                {field === 'password' ? '••••••••' : (value || <span className="text-primary/30 italic">Not provided</span>)}
              </p>
            )}
          </div>
        </div>
        {!isEditing && (
          <button 
            onClick={() => handleEditClick(field, profile[field])} 
            className="absolute right-0 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-2 text-primary/40 hover:text-primary transition-all md:relative md:top-0 md:translate-y-0"
          >
            <Edit2 size={16} />
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen pt-32 pb-20 bg-background text-foreground">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4">
              My <span className="text-primary/50 font-light">Account</span>
            </h1>
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-widest uppercase">
                <Shield size={14} className="mr-2" />
                {profile.role}
              </span>
            </div>
          </div>
        </div>

        <div className="flex space-x-8 border-b border-primary/10 mb-10 overflow-x-auto scrollbar-hide">
          <button
            onClick={() => setActiveTab('identity')}
            className={`pb-4 text-xs font-bold tracking-[0.2em] uppercase transition-colors relative whitespace-nowrap ${
              activeTab === 'identity' ? 'text-primary' : 'text-primary/40 hover:text-primary/70'
            }`}
          >
            My Profile
            {activeTab === 'identity' && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-primary"></span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('garage')}
            className={`pb-4 text-xs font-bold tracking-[0.2em] uppercase transition-colors relative whitespace-nowrap flex items-center ${
              activeTab === 'garage' ? 'text-primary' : 'text-primary/40 hover:text-primary/70'
            }`}
          >
            My Garage
            <span className="ml-2 bg-primary/10 text-primary px-2 py-0.5 rounded-full text-[10px]">
              {reservations.length + transactions.length + tradeIns.length}
            </span>
            {activeTab === 'garage' && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-primary"></span>
            )}
          </button>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-sm flex items-center transition-all">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-8 p-4 bg-green-500/10 border border-green-500/20 text-green-500 rounded-lg text-sm flex items-center transition-all">
            {success}
          </div>
        )}

        {activeTab === 'identity' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="md:col-span-1">
              <div className="bg-secondary/20 border border-primary/10 rounded-2xl p-8 flex flex-col items-center text-center">
                <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center mb-6 relative group overflow-hidden">
                  <User size={64} className="text-primary/40 group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-white text-xs font-bold tracking-widest uppercase">ID: {profile.id.slice(-6)}</span>
                  </div>
                </div>
                <h2 className="text-2xl font-bold mb-1">{profile.username}</h2>
                <p className="text-primary/60 text-sm">{profile.email}</p>
              </div>
            </div>

            <div className="md:col-span-2">
              <div className="bg-secondary/10 border border-primary/10 rounded-2xl p-6 md:p-10">
                <h3 className="text-xs font-bold uppercase tracking-widest text-primary/40 mb-6 border-b border-primary/10 pb-4">Personal Details</h3>
                <div className="flex flex-col">
                  {renderEditableField('username', 'Username', <User size={20} />)}
                  {renderEditableField('email', 'Email Address', <Mail size={20} />, 'email')}
                  {renderEditableField('phone', 'Phone Number', <Phone size={20} />)}
                  {renderEditableField('address', 'Physical Address', <MapPin size={20} />, 'textarea')}
                  {renderEditableField('password', 'Password', <KeyRound size={20} />, 'password')}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'garage' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {reservations.length === 0 && transactions.length === 0 && tradeIns.length === 0 ? (
              <div className="bg-secondary/5 border border-primary/10 rounded-xl p-16 text-center max-w-2xl mx-auto">
                <Car size={48} strokeWidth={1} className="mx-auto mb-6 text-primary/20" />
                <p className="text-sm font-light text-primary/60 tracking-widest uppercase mb-8">Your garage is currently empty.</p>
                <Link to="/warehouse" className="inline-block px-8 py-3 bg-foreground text-background text-xs font-bold tracking-widest uppercase rounded-full hover:opacity-90 transition-opacity">
                  Browse The Collection
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {transactions.map(tx => (
                  <div key={`tx-${tx.id}`} className="group relative">
                    <div 
                      onClick={() => setSelectedTransactionDetail(tx)}
                      className="absolute inset-0 bg-primary/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-0"
                    />
                    <div className="bg-secondary/5 border border-primary/10 rounded-xl p-6 flex flex-col md:flex-row gap-6 group hover:border-primary/20 transition-colors pointer-events-none">
                      <div className="w-full md:w-1/3 aspect-[4/3] bg-white rounded-lg flex items-center justify-center p-4 overflow-hidden relative pointer-events-auto">
                        <div className="absolute top-2 left-2 px-2 py-1 bg-foreground text-background text-[8px] font-bold tracking-widest uppercase rounded z-10">PURCHASE</div>
                        <img loading="lazy" 
                          src={tx.car?.imageUrl ? `/images/cars/${tx.car.imageUrl}` : '/images/cars/default.png'} 
                          alt={tx.car?.model} 
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-primary/50">{tx.car?.brand?.name}</span>
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                              tx.status === 'COMPLETED' ? 'bg-green-500/10 text-green-600 border-green-500/20' : 'bg-blue-500/10 text-blue-600 border-blue-500/20'
                            }`}>
                              {tx.status}
                            </span>
                          </div>
                          <h3 className="text-2xl font-black uppercase tracking-tight mb-4">{tx.car?.model}</h3>
                          <div className="space-y-2 mb-6">
                            <div className="flex items-center text-xs font-light text-primary/70">
                              <Calendar size={14} className="mr-3 text-primary/40" />
                              <span>Purchased: {new Date(tx.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                        {tx.status === 'PENDING_PAYMENT' && (
                          <div className="flex space-x-2 mt-auto pointer-events-auto">
                            <button onClick={(e) => { e.stopPropagation(); window.location.href = tx.invoiceUrl; }} className="flex-1 py-3 bg-primary text-background text-[10px] font-bold uppercase tracking-widest hover:opacity-90 transition-opacity rounded-lg flex items-center justify-center space-x-2">
                              <span>Pay</span>
                              <ExternalLink size={14} />
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); cancelTransaction(tx.id); }} className="flex-1 py-3 border border-red-500/50 text-red-500 text-[10px] font-bold uppercase tracking-widest hover:bg-red-500/10 transition-colors rounded-lg flex items-center justify-center space-x-2">
                              <span>Cancel</span>
                              <X size={14} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {reservations.map(res => (
                  <div key={`res-${res.id}`} className="bg-secondary/5 border border-primary/10 rounded-xl p-6 flex flex-col md:flex-row gap-6 group hover:border-primary/20 transition-colors">
                    <div className="w-full md:w-1/3 aspect-[4/3] bg-white rounded-lg flex items-center justify-center p-4 overflow-hidden relative">
                      <div className="absolute top-2 left-2 px-2 py-1 bg-primary/10 text-primary text-[8px] font-bold tracking-widest uppercase rounded z-10">INSPECTION</div>
                      <img loading="lazy" 
                        src={res.car?.imageUrl ? `/images/cars/${res.car.imageUrl}` : '/images/cars/default.png'} 
                        alt={res.car?.model} 
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-primary/50">{res.car?.brand?.name}</span>
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                            res.status === 'PAID' ? 'bg-green-500/10 text-green-600 border-green-500/20' : 'bg-orange-500/10 text-orange-600 border-orange-500/20'
                          }`}>
                            {res.status}
                          </span>
                        </div>
                        <h3 className="text-2xl font-black uppercase tracking-tight mb-4">{res.car?.model}</h3>
                        <div className="space-y-2 mb-6">
                          <div className="flex items-center text-xs font-light text-primary/70">
                            <Calendar size={14} className="mr-3 text-primary/40" />
                            <span>Inspection: {new Date(res.inspectionDate).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                      {res.status === 'PENDING' && (
                        <button className="w-full py-3 border border-primary/20 text-[10px] font-bold uppercase tracking-widest hover:bg-primary/5 transition-colors rounded-lg flex items-center justify-center space-x-2">
                          <span>Complete Payment</span>
                          <ExternalLink size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                {tradeIns.map(trade => (
                  <div key={`trade-${trade.id}`} className="group relative">
                    <div 
                      onClick={() => setSelectedTradeInDetail(trade)}
                      className="absolute inset-0 bg-primary/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-0"
                    />
                    <div className="bg-secondary/5 border border-primary/10 rounded-xl p-6 flex flex-col md:flex-row gap-6 group hover:border-primary/20 transition-colors pointer-events-none">
                      <div className="w-full md:w-1/3 aspect-[4/3] bg-white rounded-lg flex items-center justify-center p-4 overflow-hidden relative pointer-events-auto">
                        <div className="absolute top-2 left-2 px-2 py-1 bg-purple-500/10 text-purple-600 border border-purple-500/20 text-[8px] font-bold tracking-widest uppercase rounded z-10">TRADE-IN</div>
                        {trade.photoUrl ? (
                          <img loading="lazy" 
                            src={`/images/tradeins/${trade.photoUrl}`} 
                            alt={trade.model} 
                            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 drop-shadow-xl"
                          />
                        ) : (
                          <img loading="lazy" 
                            src="/images/cars/default.png" 
                            alt="Trade-In" 
                            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 opacity-50 grayscale"
                          />
                        )}
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-primary/50">{trade.brand}</span>
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                              trade.status === 'APPROVED' ? 'bg-green-500/10 text-green-600 border-green-500/20' : 
                              trade.status === 'SCHEDULE_REQUESTED' ? 'bg-blue-500/10 text-blue-600 border-blue-500/20' :
                              'bg-orange-500/10 text-orange-600 border-orange-500/20'
                            }`}>
                              {trade.status.replace(/_/g, ' ')}
                            </span>
                          </div>
                          <h3 className="text-2xl font-black uppercase tracking-tight mb-4">{trade.model} ({trade.year})</h3>
                          <div className="space-y-2 mb-6">
                            <div className="flex items-center text-xs font-light text-primary/70">
                              <Car size={14} className="mr-3 text-primary/40" />
                              <span>Plate: {trade.licensePlate}</span>
                            </div>
                            {trade.inspectionDate && (
                              <div className="flex items-center text-xs font-bold text-primary">
                                <Calendar size={14} className="mr-3" />
                                <span>{trade.status === 'SCHEDULE_REQUESTED' ? 'Requested' : 'Scheduled'}: {new Date(trade.inspectionDate).toLocaleString()}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex space-x-2 mt-auto pointer-events-auto">
                          {trade.status === 'TRADE_IN_PENDING' && (
                            <button 
                              onClick={(e) => { e.stopPropagation(); setSelectedTradeIn(trade); setScheduleModalOpen(true); }}
                              className="flex-1 py-3 bg-primary text-background text-[10px] font-bold uppercase tracking-widest hover:opacity-90 transition-opacity rounded-lg flex items-center justify-center space-x-2"
                            >
                              <span>Schedule</span>
                              <Calendar size={14} />
                            </button>
                          )}
                          {['TRADE_IN_PENDING', 'SCHEDULE_REQUESTED'].includes(trade.status) && (
                            <button 
                              onClick={(e) => { e.stopPropagation(); cancelTradeIn(trade.id); }}
                              className="flex-1 py-3 border border-red-500/50 text-red-500 text-[10px] font-bold uppercase tracking-widest hover:bg-red-500/10 transition-colors rounded-lg flex items-center justify-center space-x-2"
                            >
                              <span>Cancel</span>
                              <X size={14} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      
      {scheduleModalOpen && selectedTradeIn && (
        <ScheduleInspectionModal 
          tradeIn={selectedTradeIn}
          onClose={() => { setScheduleModalOpen(false); setSelectedTradeIn(null); }}
          onScheduled={() => {
            setScheduleModalOpen(false);
            setSelectedTradeIn(null);
            fetchData();
          }}
        />
      )}

      {selectedTransactionDetail && (
        <TransactionDetailModal 
          transaction={selectedTransactionDetail}
          onClose={() => setSelectedTransactionDetail(null)}
          onCancel={cancelTransaction}
        />
      )}

      {selectedTradeInDetail && (
        <TradeInDetailModal 
          tradeIn={selectedTradeInDetail}
          onClose={() => setSelectedTradeInDetail(null)}
          onCancel={cancelTradeIn}
        />
      )}
    </div>
  );
}
