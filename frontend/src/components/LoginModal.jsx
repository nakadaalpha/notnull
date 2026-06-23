import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function LoginModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
      <div className="bg-secondary/5 border border-primary/20 rounded-2xl w-full max-w-md p-8 relative animate-in fade-in zoom-in-95 duration-300">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 bg-background rounded-full hover:bg-primary/10 transition-colors"
        >
          <X size={20} />
        </button>
        
        <div className="text-center mb-8">
          <h2 className="text-2xl font-black uppercase tracking-tighter mb-2">Sign In Required</h2>
          <p className="text-sm text-primary/60 font-light">
            To proceed with your purchase, please secure your session by signing in or creating a new account.
          </p>
        </div>
        
        <div className="flex flex-col gap-4">
          <button 
            onClick={() => navigate('/login')}
            className="w-full py-4 bg-foreground text-background text-xs font-bold tracking-[0.2em] uppercase rounded-md hover:bg-primary transition-colors"
          >
            Sign In Now
          </button>
          <button 
            onClick={() => navigate('/register')}
            className="w-full py-4 bg-transparent border border-primary/20 text-foreground text-xs font-bold tracking-[0.2em] uppercase rounded-md hover:bg-primary/5 transition-colors"
          >
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
}
