import { X, Calendar, Tag, Car, Clock } from 'lucide-react';

export default function TradeInDetailModal({ tradeIn, onClose, onCancel }) {
  if (!tradeIn) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="min-h-full flex items-center justify-center p-4">
        <div className="bg-background border border-primary/20 w-full max-w-lg rounded-3xl shadow-2xl relative flex flex-col my-4 overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b border-primary/10 flex justify-between items-center bg-secondary/5">
          <div>
            <h2 className="text-lg font-black uppercase tracking-tighter">Inspection Details</h2>
            <p className="text-[10px] font-bold tracking-widest text-primary/50 mt-0.5 uppercase">Trade-In Request</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-primary/10 rounded-full transition-colors text-primary/50 hover:text-primary">
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-5 md:p-6 pt-0">
          
          <div className="flex justify-center -mx-5 md:-mx-6 bg-gradient-to-b from-secondary/5 to-transparent mb-5">
            <div className="w-full h-32 sm:h-48 overflow-hidden relative">
               {/* Display car image if available, else a placeholder */}
               {tradeIn.photoUrl ? (
                 <img loading="lazy" src={`/images/tradeins/${tradeIn.photoUrl}`} alt={tradeIn.model} className="w-full h-full object-cover object-center" />
               ) : (
                 <img loading="lazy" src="/images/cars/default.png" alt="Default Car" className="w-full h-full object-cover object-center opacity-50 grayscale" />
               )}
               {/* Optional gradient overlay to blend the bottom edge */}
               <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-background to-transparent" />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-bold uppercase tracking-tighter">{tradeIn.brand} {tradeIn.model}</h3>
              <p className="text-xs text-primary/50 uppercase tracking-widest font-bold mt-1">Year: {tradeIn.year}</p>
            </div>

            <div className="space-y-3 border-t border-primary/10 pt-4">
            <div className="flex justify-between items-center text-sm">
              <span className="flex items-center text-primary/60"><Tag size={14} className="mr-2" /> License Plate</span>
              <span className="font-bold bg-primary/10 px-2 py-1 rounded uppercase tracking-widest text-xs">{tradeIn.licensePlate}</span>
            </div>
            
            <div className="flex justify-between items-center text-sm">
              <span className="flex items-center text-primary/60"><Clock size={14} className="mr-2" /> Status</span>
              <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                tradeIn.status === 'APPROVED' ? 'bg-green-500/10 text-green-600 border-green-500/20' :
                tradeIn.status === 'REJECTED' ? 'bg-red-500/10 text-red-600 border-red-500/20' :
                ['SCHEDULE_REQUESTED', 'INSPECTION_SCHEDULED'].includes(tradeIn.status) ? 'bg-blue-500/10 text-blue-600 border-blue-500/20' :
                'bg-orange-500/10 text-orange-600 border-orange-500/20'
              }`}>
                {tradeIn.status.replace(/_/g, ' ')}
              </span>
            </div>

            {tradeIn.inspectionDate && (
              <div className="flex justify-between items-center text-sm">
                <span className="flex items-center text-primary/60"><Calendar size={14} className="mr-2" /> Inspection Date</span>
                <span className="font-bold">{new Date(tradeIn.inspectionDate).toLocaleString()}</span>
              </div>
            )}

            {tradeIn.appraisedValue && (
              <div className="flex justify-between items-center text-sm border-t border-primary/10 pt-4 mt-2">
                <span className="flex items-center text-primary/60 font-bold uppercase tracking-widest">Appraised Value</span>
                <span className="font-black text-lg">${tradeIn.appraisedValue?.toLocaleString()}</span>
              </div>
            )}
          </div>
        </div>
        </div>

        {/* Sticky Footer */}
        {['TRADE_IN_PENDING', 'SCHEDULE_REQUESTED'].includes(tradeIn.status) && onCancel && (
          <div className="p-5 border-t border-primary/10 bg-background shrink-0 flex">
            <button 
              onClick={() => { 
                if(window.confirm('Are you sure you want to cancel this trade-in request?')) {
                  onCancel(tradeIn.id); 
                  onClose(); 
                }
              }} 
              className="w-full py-3 border border-red-500/50 text-red-500 text-xs font-bold tracking-[0.2em] uppercase rounded-xl hover:bg-red-500/10 transition-colors flex justify-center items-center"
            >
              Cancel Request
            </button>
          </div>
        )}

        </div>
      </div>
    </div>
  );
}
