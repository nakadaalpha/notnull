import { AlertTriangle, MapPinOff, RefreshCcw, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function ErrorPage({ code = 404, message }) {
  const navigate = useNavigate();

  let title = "Page Not Found";
  let description = "The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.";
  let Icon = MapPinOff;
  let actionButton = (
    <Link to="/" className="inline-flex items-center space-x-2 bg-foreground text-background px-6 py-3 rounded-full font-bold hover:scale-105 transition-transform">
      <ArrowLeft size={18} />
      <span>Return Home</span>
    </Link>
  );

  if (code === 500) {
    title = "Application Error";
    description = message || "An unexpected error occurred in the application. Our engineers have been notified. Please try reloading the page.";
    Icon = AlertTriangle;
    actionButton = (
      <button 
        onClick={() => window.location.reload()}
        className="inline-flex items-center space-x-2 bg-foreground text-background px-6 py-3 rounded-full font-bold hover:scale-105 transition-transform"
      >
        <RefreshCcw size={18} />
        <span>Reload Page</span>
      </button>
    );
  }

  return (
    <div className="w-full flex flex-col items-center justify-center p-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="relative mb-8 group">
        <div className="absolute -inset-4 bg-primary/5 rounded-full blur-xl group-hover:bg-primary/10 transition-colors"></div>
        <div className="relative bg-background border border-primary/10 p-6 rounded-full shadow-2xl text-primary">
          <Icon size={64} strokeWidth={1} />
        </div>
      </div>
      
      <h1 className="text-8xl font-black tracking-tighter mb-4 text-primary/10 select-none">
        {code}
      </h1>
      
      <h2 className="text-3xl font-bold tracking-tight mb-4">
        {title}
      </h2>
      
      <p className="max-w-md text-primary/60 text-lg font-light leading-relaxed mb-10">
        {description}
      </p>

      {actionButton}
    </div>
  );
}
