import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, ArrowRight } from 'lucide-react';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const txId = searchParams.get('txId');

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-background px-6 pt-32 pb-20">
      <div className="max-w-md w-full text-center">
        <div className="flex justify-center mb-8">
          <CheckCircle2 className="w-24 h-24 text-green-500 animate-in zoom-in duration-500" strokeWidth={1} />
        </div>
        <h1 className="text-4xl font-black uppercase tracking-tighter mb-4">Payment Successful</h1>
        <p className="text-sm font-light text-primary/60 mb-10 leading-relaxed">
          Thank you! Your booking fee has been successfully processed and your vehicle is now secured. 
          {txId && <span className="block mt-2 text-xs tracking-widest uppercase">Transaction Ref: <strong>{txId}</strong></span>}
        </p>
        
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <Link 
            to="/profile?tab=garage" 
            className="flex-1 inline-flex items-center justify-center space-x-3 py-4 bg-foreground text-background text-xs font-bold tracking-[0.2em] uppercase rounded-md hover:bg-primary transition-all"
          >
            <span>View My Garage</span>
            <ArrowRight size={14} />
          </Link>
          <Link 
            to="/" 
            className="flex-1 inline-flex items-center justify-center space-x-3 py-4 border border-primary/20 text-foreground text-xs font-bold tracking-[0.2em] uppercase rounded-md hover:bg-secondary/5 transition-all"
          >
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
