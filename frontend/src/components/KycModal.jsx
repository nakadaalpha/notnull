import React, { useState } from 'react';
import { Upload, X, AlertTriangle, CheckCircle } from 'lucide-react';
import api from '../api';

export default function KycModal({ isOpen, onClose, onSuccess }) {
  const [simNumber, setSimNumber] = useState('');
  const [simExpiry, setSimExpiry] = useState('');
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please upload a photo of your Driver License.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    const formData = new FormData();
    formData.append('simNumber', simNumber);
    formData.append('simExpiry', simExpiry);
    formData.append('simFile', file);

    try {
      const res = await api.post('/users/kyc/sim', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setIsSubmitting(false);
      onSuccess(res.data.user);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to upload documents.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-background border border-primary/20 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-primary/60 hover:text-primary transition-colors">
          <X size={24} />
        </button>
        
        <div className="p-8">
          <h2 className="text-2xl font-black uppercase tracking-tighter mb-2">Driver License Verification</h2>
          <p className="text-sm text-primary/60 mb-6">For test drives, we are legally required to verify your driver's license (SIM A). Your data is securely encrypted.</p>
          
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-sm flex items-start rounded-lg">
              <AlertTriangle size={16} className="mr-2 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[10px] font-bold tracking-widest uppercase text-primary/70 mb-2">SIM Number</label>
              <input 
                type="text" 
                required
                value={simNumber}
                onChange={(e) => setSimNumber(e.target.value)}
                className="w-full bg-secondary/50 border border-primary/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary"
                placeholder="e.g. 1234-5678-9012"
              />
            </div>
            
            <div>
              <label className="block text-[10px] font-bold tracking-widest uppercase text-primary/70 mb-2">Expiry Date</label>
              <input 
                type="date" 
                required
                value={simExpiry}
                onChange={(e) => setSimExpiry(e.target.value)}
                className="w-full bg-secondary/50 border border-primary/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold tracking-widest uppercase text-primary/70 mb-2">Upload Photo of SIM</label>
              <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-primary/20 rounded-xl cursor-pointer bg-secondary/20 hover:bg-secondary/40 transition-colors overflow-hidden relative">
                {file ? (
                  <div className="w-full h-full relative group">
                    <img 
                      src={URL.createObjectURL(file)} 
                      alt="SIM Preview" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <span className="text-white text-xs font-bold uppercase tracking-widest flex items-center">
                        <Upload size={14} className="mr-2" /> Change Photo
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-3 text-primary/40" />
                    <p className="mb-2 text-sm text-primary/60">
                      <span className="font-bold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-primary/40">PNG, JPG up to 5MB</p>
                  </div>
                )}
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files[0])}
                />
              </label>
              {file && (
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-green-500 font-bold uppercase tracking-widest flex items-center">
                    <CheckCircle size={12} className="mr-1" /> Document Attached
                  </p>
                  <button 
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setFile(null);
                    }}
                    className="text-xs text-red-500 font-bold uppercase tracking-widest flex items-center hover:text-red-600 transition-colors"
                  >
                    <X size={12} className="mr-1" /> Remove
                  </button>
                </div>
              )}
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-primary text-background font-bold uppercase tracking-widest text-xs py-4 px-6 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isSubmitting ? 'Uploading...' : 'Submit Verification'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
