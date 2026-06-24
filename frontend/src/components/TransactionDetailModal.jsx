import { X, Calendar, DollarSign, Tag, CheckCircle } from 'lucide-react';

export default function TransactionDetailModal({ transaction, onClose, onCancel }) {
  if (!transaction) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="min-h-full flex items-center justify-center p-4">
        <div className="bg-background border border-primary/20 w-full max-w-lg rounded-3xl shadow-2xl relative flex flex-col my-4 overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b border-primary/10 flex justify-between items-center bg-secondary/5 shrink-0">
          <div>
            <h2 className="text-lg font-black uppercase tracking-tighter">Purchase Details</h2>
            <p className="text-[10px] font-bold tracking-widest text-primary/50 mt-0.5 uppercase">Transaction #{transaction.id}</p>
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
               {transaction.car?.imageUrl ? (
                 <img loading="lazy" src={`/images/cars/${transaction.car.imageUrl}`} alt={transaction.car.model} className="w-full h-full object-cover object-center" />
               ) : (
                 <img loading="lazy" src="/images/cars/default.png" alt="Default Car" className="w-full h-full object-cover object-center opacity-50 grayscale" />
               )}
               {/* Optional gradient overlay to blend the bottom edge */}
               <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-background to-transparent" />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-bold uppercase tracking-tighter">{transaction.car?.brand?.name} {transaction.car?.model}</h3>
              <p className="text-xs text-primary/50 uppercase tracking-widest font-bold mt-1">Status: <span className="text-primary">{transaction.status.replace(/_/g, ' ')}</span></p>
            </div>

            <div className="space-y-3 border-t border-primary/10 pt-4">
              <div className="flex justify-between items-center text-sm">
                <span className="flex items-center text-primary/60"><Calendar size={14} className="mr-2" /> Date</span>
                <span className="font-bold">{new Date(transaction.createdAt).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="flex items-center text-primary/60"><Tag size={14} className="mr-2" /> Quantity</span>
                <span className="font-bold">{transaction.amount} Unit(s)</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="flex items-center text-primary/60"><DollarSign size={14} className="mr-2" /> Total Price</span>
                <span className="font-bold">${transaction.totalPrice?.toLocaleString()}</span>
              </div>
              {transaction.bookingFee && (
                <div className="flex justify-between items-center text-sm">
                  <span className="flex items-center text-primary/60"><CheckCircle size={14} className="mr-2" /> Booking Fee</span>
                  <span className="font-bold">${transaction.bookingFee?.toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sticky Footer */}
        {transaction.invoiceUrl && transaction.status === 'PENDING_PAYMENT' && (
          <div className="p-5 border-t border-primary/10 bg-background shrink-0 flex space-x-3">
            <button onClick={() => window.location.href = transaction.invoiceUrl} className="flex-[2] py-3 bg-primary text-background text-xs font-bold tracking-[0.15em] uppercase rounded-xl hover:opacity-90 transition-opacity flex justify-center items-center shadow-xl">
              Proceed to Payment
            </button>
            {onCancel && (
              <button 
                onClick={() => { 
                  if(window.confirm('Are you sure you want to cancel this transaction?')) {
                    onCancel(transaction.id); 
                    onClose(); 
                  }
                }} 
                className="flex-1 py-3 border border-red-500/50 text-red-500 text-xs font-bold tracking-[0.2em] uppercase rounded-xl hover:bg-red-500/10 transition-colors flex justify-center items-center"
              >
                Cancel
              </button>
            )}
          </div>
        )}

        </div>
      </div>
    </div>
  );
}
