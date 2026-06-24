import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Clock, Loader2, Car, Calendar as CalendarIcon } from 'lucide-react';
import api from '../api';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export default function ScheduleInspectionModal({ tradeIn, onClose, onScheduled }) {
  const [date, setDate] = useState('');
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Calendar State
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize today for comparisons

  const [currentMonth, setCurrentMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  useEffect(() => {
    if (date) {
      fetchSlots(date);
    }
  }, [date]);

  const fetchSlots = async (selectedDate) => {
    setLoadingSlots(true);
    setSelectedSlot(null);
    try {
      const res = await api.get(`/trade-in/availability?date=${selectedDate}`);
      setSlots(res.data);
    } catch (err) {
      console.error(err);
      alert('Failed to load availability');
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!date || !selectedSlot) return;

    setSubmitting(true);
    try {
      // Construct exact datetime string
      const inspectionDate = new Date(`${date}T${selectedSlot.time}:00.000Z`).toISOString();
      await api.put(`/trade-in/${tradeIn.id}/schedule`, { inspectionDate });
      onScheduled();
    } catch (err) {
      console.error(err);
      alert('Failed to submit schedule');
    } finally {
      setSubmitting(false);
    }
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    // Prevent going to past months
    const currentViewMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const todayMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    
    if (currentViewMonth > todayMonth) {
      setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    }
  };

  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  const handleDateSelect = (day) => {
    if (!day) return;
    const selectedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    if (selectedDate < today) return; // Cannot select past dates
    
    // Format to YYYY-MM-DD
    const yyyy = selectedDate.getFullYear();
    const mm = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const dd = String(selectedDate.getDate()).padStart(2, '0');
    setDate(`${yyyy}-${mm}-${dd}`);
  };

  const formatDateDisplay = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-background border border-primary/20 w-full max-w-5xl rounded-3xl shadow-2xl relative flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="p-6 md:px-10 md:py-8 border-b border-primary/10 flex justify-between items-center bg-secondary/5">
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tighter">Select a Time</h2>
            <p className="text-xs font-bold tracking-widest text-primary/50 mt-1 uppercase">Inspections by Technical Team</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-primary/10 rounded-full transition-colors text-primary/50 hover:text-primary">
            <X size={24} />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto flex flex-col md:flex-row p-6 md:p-10 gap-10">
          
          {/* Left Column: Calendar */}
          <div className="md:w-1/2 flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-bold">{MONTHS[currentMonth.getMonth()]} {currentMonth.getFullYear()}</h3>
              <div className="flex space-x-2">
                <button 
                  onClick={prevMonth} 
                  disabled={new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1) <= new Date(today.getFullYear(), today.getMonth(), 1)}
                  className="p-2 border border-primary/20 rounded-full hover:bg-primary/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
                <button 
                  onClick={nextMonth} 
                  className="p-2 border border-primary/20 rounded-full hover:bg-primary/5 transition-colors"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-y-6 gap-x-2 text-center text-sm mb-6">
              {DAYS.map((d, i) => (
                <div key={i} className="font-bold text-primary/40 text-[10px] tracking-widest">{d}</div>
              ))}
              
              {generateCalendarDays().map((day, i) => {
                if (!day) return <div key={i} />;
                
                const thisDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                const isPast = thisDate < today;
                
                const yyyy = thisDate.getFullYear();
                const mm = String(thisDate.getMonth() + 1).padStart(2, '0');
                const dd = String(thisDate.getDate()).padStart(2, '0');
                const dateStr = `${yyyy}-${mm}-${dd}`;
                
                const isSelected = dateStr === date;
                
                return (
                  <div key={i} className="flex justify-center">
                    <button
                      disabled={isPast}
                      onClick={() => handleDateSelect(day)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-medium transition-all ${
                        isPast 
                          ? 'opacity-20 line-through cursor-not-allowed' 
                          : isSelected
                            ? 'bg-primary text-background shadow-lg scale-110 font-bold'
                            : 'hover:bg-primary/10 text-primary hover:scale-110 cursor-pointer'
                      }`}
                    >
                      {day}
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="mt-auto pt-6 border-t border-primary/10">
              <label className="block text-[10px] font-bold tracking-widest uppercase text-primary/40 mb-2">Location</label>
              <select className="w-full bg-secondary/10 border border-primary/20 p-3 text-sm font-medium focus:outline-none focus:border-primary transition-colors rounded-lg appearance-none cursor-not-allowed text-primary/70" disabled>
                <option>NotNull Headquarters - Jakarta</option>
              </select>
            </div>
          </div>

          {/* Right Column: Time Slots & Summary */}
          <div className="md:w-1/2 flex flex-col gap-8">
            
            {/* Time Slots Area */}
            <div className="flex-1 bg-secondary/5 rounded-2xl p-8 border border-primary/10">
              {date ? (
                <>
                  <h3 className="text-sm font-bold tracking-widest uppercase mb-6 text-primary">{formatDateDisplay(date)}</h3>
                  
                  {loadingSlots ? (
                    <div className="flex flex-col items-center justify-center h-40 text-primary/50 space-y-4">
                      <Loader2 size={32} className="animate-spin" />
                      <span className="text-xs font-bold tracking-widest uppercase">Checking availability...</span>
                    </div>
                  ) : slots.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-40 text-primary/50 text-center">
                      <CalendarIcon size={32} className="mb-4 opacity-50" />
                      <p className="text-sm">No time slots available for this date.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      {slots.map(slot => (
                        <button
                          key={slot.time}
                          type="button"
                          disabled={!slot.available}
                          onClick={() => setSelectedSlot(slot)}
                          className={`flex items-center justify-center p-4 rounded-xl border text-sm font-bold tracking-widest transition-all ${
                            !slot.available 
                              ? 'opacity-30 border-transparent bg-primary/10 line-through cursor-not-allowed'
                              : selectedSlot?.time === slot.time
                                ? 'border-primary bg-primary text-background shadow-[0_0_20px_rgba(var(--color-primary),0.3)] scale-[1.02]'
                                : 'border-primary/20 hover:border-primary/50 hover:bg-primary/5 text-primary'
                          }`}
                        >
                          <Clock size={14} className="mr-3 opacity-70" />
                          {slot.time}
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-primary/30 text-center min-h-[200px]">
                  <CalendarIcon size={48} className="mb-4 opacity-50" />
                  <p className="text-xs font-bold tracking-[0.2em] uppercase">Select a date from the calendar<br/>to view available times</p>
                </div>
              )}
            </div>

            {/* Summary Card */}
            <div className="bg-secondary/10 rounded-2xl p-6 border border-primary/10">
              <h3 className="text-[10px] font-bold tracking-widest uppercase text-primary/50 mb-4 border-b border-primary/10 pb-2">Inspection Summary</h3>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-4 text-primary">
                    <Car size={20} />
                  </div>
                  <div>
                    <p className="font-bold">{tradeIn.brand} {tradeIn.model} ({tradeIn.year})</p>
                    <p className="text-xs text-primary/60">Plate: {tradeIn.licensePlate}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm mb-6 pb-4 border-b border-primary/10">
                <span className="text-primary/60">Service</span>
                <span className="font-bold">Trade-In Inspection</span>
              </div>
              
              <button 
                onClick={handleSubmit}
                disabled={!date || !selectedSlot || submitting}
                className="w-full py-4 bg-foreground text-background text-xs font-bold tracking-[0.2em] uppercase rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center shadow-xl"
              >
                {submitting ? <Loader2 size={16} className="animate-spin" /> : 'Confirm Booking'}
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
