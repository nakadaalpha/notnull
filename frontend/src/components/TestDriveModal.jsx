import React, { useState } from 'react';
import { X, AlertTriangle, Calendar, MapPin } from 'lucide-react';
import api from '../api';

export default function TestDriveModal({ isOpen, onClose, carId, onSuccess }) {
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [locationType, setLocationType] = useState('SHOWROOM');
  const [liabilityAgreed, setLiabilityAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!scheduleDate || !scheduleTime) {
      setError('Please select a valid date and time.');
      return;
    }

    if (!liabilityAgreed) {
      setError('You must agree to the liability terms.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // combine date and time
      const datetime = new Date(`${scheduleDate}T${scheduleTime}:00`);
      
      const res = await api.post('/test-drives', {
        carId,
        scheduleDate: datetime.toISOString(),
        locationType,
        liabilityAgreed
      });
      
      setIsSubmitting(false);
      onSuccess(res.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to schedule test drive. This time slot might be booked.');
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
          <h2 className="text-2xl font-black uppercase tracking-tighter mb-2">Schedule Test Drive</h2>
          <p className="text-sm text-primary/60 mb-6">Select your preferred time and location. Our system will ensure no conflicts.</p>
          
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-sm flex items-start rounded-lg">
              <AlertTriangle size={16} className="mr-2 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full md:w-1/2">
                <label className="block text-[10px] font-bold tracking-widest uppercase text-primary/70 mb-2 flex items-center">
                  <Calendar size={12} className="mr-1" /> Date
                </label>
                <input 
                  type="date" 
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  className="w-full bg-secondary/50 border border-primary/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary"
                />
              </div>
              <div className="w-full md:w-1/2">
                <label className="block text-[10px] font-bold tracking-widest uppercase text-primary/70 mb-2 flex items-center">
                  <Calendar size={12} className="mr-1" /> Time
                </label>
                <input 
                  type="time" 
                  required
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                  className="w-full bg-secondary/50 border border-primary/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold tracking-widest uppercase text-primary/70 mb-2 flex items-center">
                <MapPin size={12} className="mr-1" /> Location
              </label>
              <select 
                value={locationType}
                onChange={(e) => setLocationType(e.target.value)}
                className="w-full bg-secondary/50 border border-primary/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary appearance-none"
              >
                <option value="SHOWROOM">NOTNULL Showroom HQ</option>
                <option value="HOME_SERVICE">Home Service (VIP Delivery)</option>
              </select>
            </div>

            <div className="bg-secondary/20 p-4 border border-primary/10 rounded-xl flex items-start space-x-3">
              <input 
                type="checkbox" 
                id="liability"
                checked={liabilityAgreed}
                onChange={(e) => setLiabilityAgreed(e.target.checked)}
                className="mt-1 accent-primary"
              />
              <label htmlFor="liability" className="text-xs text-primary/70 leading-relaxed cursor-pointer">
                <span className="font-bold text-primary block mb-1">Legal Liability Agreement (Own Risk)</span>
                I acknowledge that I am holding a valid Driver's License. In the event of an accident or damage caused by negligence during this test drive, I agree to bear a maximum liability deductible of $500 as per company policy.
              </label>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting || !liabilityAgreed}
              className="w-full bg-primary text-background font-bold uppercase tracking-widest text-xs py-4 px-6 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Scheduling...' : 'Confirm Booking'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
