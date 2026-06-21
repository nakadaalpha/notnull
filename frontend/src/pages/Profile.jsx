import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import { User, Mail, Phone, MapPin, Shield, Edit2, Check, X, KeyRound } from 'lucide-react';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Inline edit state
  const [editingField, setEditingField] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await api.get('/auth/me');
      setProfile(res.data);
    } catch (err) {
      console.error('Failed to load profile', err);
      setError('Failed to load profile details.');
    } finally {
      setLoading(false);
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
      
      // Build the payload with all current profile data
      const payload = {
        username: profile.username,
        email: profile.email,
        phone: profile.phone || '',
        address: profile.address || '',
        password: '' // Always empty unless changing password
      };
      
      // Override the specific field being edited
      payload[field] = editValue;

      const res = await api.put('/auth/me', payload);
      setProfile(res.data);
      
      if (field === 'username') {
        updateUser({ username: res.data.username });
      }
      
      setSuccess('Profile updated successfully!');
      setEditingField(null);
      setEditValue('');
      
      // Clear success message after 3 seconds
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
          <h2 className="text-2xl font-bold mb-2">Profile Not Found</h2>
          <p className="text-primary/60">We could not load your profile details.</p>
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
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Header Section */}
        <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4">
              My <span className="text-primary/50 font-light">Profile</span>
            </h1>
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-widest uppercase">
                <Shield size={14} className="mr-2" />
                {profile.role}
              </span>
            </div>
          </div>
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Avatar / Quick Info Card */}
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

          {/* Details / Inline Edit Form */}
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

      </div>
    </div>
  );
}
