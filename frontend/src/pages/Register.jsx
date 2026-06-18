import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(username, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-32 flex flex-col items-center justify-center bg-background px-6">
      <div className="w-full max-w-md">
        <Link to="/" className="inline-flex items-center space-x-2 mb-8 group hover:opacity-60 transition-opacity">
          <ArrowLeft size={16} strokeWidth={1} className="transform group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase">Back to Home</span>
        </Link>
        
        <div className="bg-secondary/5 border border-primary/10 rounded-xl p-8 md:p-10">
          <h1 className="text-3xl font-black uppercase tracking-tighter mb-2">Create Account</h1>
          <p className="text-xs font-light text-primary/60 tracking-wide mb-8">
            Join NOTNULL for a premium digital showroom experience.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[10px] font-bold tracking-[0.2em] uppercase text-primary/70 mb-2">Username</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-transparent border border-primary/20 p-3 text-sm font-light focus:outline-none focus:border-primary transition-colors rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold tracking-[0.2em] uppercase text-primary/70 mb-2">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent border border-primary/20 p-3 text-sm font-light focus:outline-none focus:border-primary transition-colors rounded-md"
                required
              />
            </div>
            
            <div>
              <label className="block text-[10px] font-bold tracking-[0.2em] uppercase text-primary/70 mb-2">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent border border-primary/20 p-3 text-sm font-light focus:outline-none focus:border-primary transition-colors rounded-md"
                required
              />
            </div>

            {error && (
              <p className="text-[10px] tracking-widest uppercase font-bold text-red-500">
                {error}
              </p>
            )}

            <button 
              type="submit"
              className="w-full py-4 bg-foreground text-background text-xs font-bold tracking-[0.2em] uppercase hover:bg-primary transition-colors rounded-md"
            >
              Sign Up
            </button>
          </form>

          <p className="mt-8 text-center text-xs font-light text-primary/60">
            Already have an account? <Link to="/login" className="font-bold uppercase tracking-widest text-primary hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
