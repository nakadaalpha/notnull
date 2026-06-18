import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { LogOut, ExternalLink, Calendar, Car } from 'lucide-react';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchReservations = async () => {
      try {
        const response = await api.get(`/reservations/user/${user.id}`);
        setReservations(response.data);
      } catch (error) {
        console.error("Failed to fetch reservations", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen pt-32 pb-32 max-w-[1600px] mx-auto px-6 md:px-12 bg-background">
      <div className="flex justify-between items-end mb-12 border-b border-primary/10 pb-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-2">My Garage</h1>
          <p className="text-sm font-light text-primary/60 tracking-widest uppercase">
            Welcome back, {user.username}
          </p>
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center space-x-2 text-[10px] tracking-widest uppercase font-bold text-red-500 hover:opacity-70 transition-opacity"
        >
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>

      <div className="space-y-8">
        <h2 className="text-sm font-bold uppercase tracking-[0.2em]">Active Reservations</h2>
        
        {loading ? (
          <p className="text-xs font-light tracking-widest uppercase animate-pulse">Loading data...</p>
        ) : reservations.length === 0 ? (
          <div className="bg-secondary/5 border border-primary/10 rounded-xl p-12 text-center">
            <Car size={48} strokeWidth={1} className="mx-auto mb-6 text-primary/20" />
            <p className="text-sm font-light text-primary/60 tracking-widest uppercase mb-6">You have no active reservations.</p>
            <Link to="/warehouse" className="inline-block px-8 py-3 bg-foreground text-background text-xs font-bold tracking-widest uppercase rounded-md hover:bg-primary transition-colors">
              Browse Collection
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {reservations.map(res => (
              <div key={res.id} className="bg-secondary/5 border border-primary/10 rounded-xl p-6 flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/3 aspect-[4/3] bg-white rounded-lg flex items-center justify-center p-4">
                  <img 
                    src={res.car?.imageUrl ? `/images/cars/${res.car.imageUrl}` : '/images/cars/default.png'} 
                    alt={res.car?.model} 
                    className="w-full h-full object-contain"
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
                    <button className="w-full py-3 border border-primary/20 text-[10px] font-bold uppercase tracking-widest hover:bg-primary/5 transition-colors rounded-md flex items-center justify-center space-x-2">
                      <span>Complete Payment</span>
                      <ExternalLink size={14} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
