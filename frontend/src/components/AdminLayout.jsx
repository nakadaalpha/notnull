import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Home, Car, Users, ClipboardList, LogOut, Sun, Moon, Tag, Settings } from 'lucide-react';

export default function AdminLayout() {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex bg-secondary/30 dark:bg-primary/5">
      {/* Sidebar */}
      <aside className="w-64 bg-background border-r border-primary/10 flex flex-col hidden md:flex">
        <div className="p-6">
          <Link to="/" className="text-2xl font-bold tracking-tighter">
            NOT<span className="text-gray-500">ADMIN</span>
          </Link>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <Link to="/admin" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-secondary transition-colors text-primary/80 hover:text-primary">
            <Home size={20} />
            <span className="font-medium">Dashboard</span>
          </Link>
          {user?.role === 'ADMIN' && (
            <>
              <Link to="/admin/brands" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-secondary transition-colors text-primary/80 hover:text-primary">
                <Tag size={20} />
                <span className="font-medium">Brands</span>
              </Link>
              <Link to="/admin/cars" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-secondary transition-colors text-primary/80 hover:text-primary">
                <Car size={20} />
                <span className="font-medium">Warehouse (Cars)</span>
              </Link>
            </>
          )}
          <Link to="/admin/customers" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-secondary transition-colors text-primary/80 hover:text-primary">
            <Users size={20} />
            <span className="font-medium">Customers</span>
          </Link>
          <Link to="/admin/transactions" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-secondary transition-colors text-primary/80 hover:text-primary">
            <ClipboardList size={20} />
            <span className="font-medium">Transactions</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-primary/10 space-y-2">
          <Link to="/profile" className="flex items-center space-x-3 p-3 w-full rounded-lg hover:bg-secondary text-primary transition-colors">
            <Settings size={20} />
            <span className="font-medium">My Profile</span>
          </Link>
          <button onClick={handleLogout} className="flex items-center space-x-3 p-3 w-full rounded-lg hover:bg-red-500/10 text-red-500 transition-colors">
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-20 bg-background border-b border-primary/10 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center">
            <h2 className="text-xl font-bold">Admin Panel</h2>
            {user?.role && (
              <span className="ml-4 text-xs font-semibold px-2.5 py-1 bg-primary/10 text-primary rounded-full tracking-wider">
                {user.role}
              </span>
            )}
          </div>
          <button 
            onClick={toggleTheme} 
            className="p-2 rounded-full bg-secondary hover:bg-primary/10 transition-colors"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-auto p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
