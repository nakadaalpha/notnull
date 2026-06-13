import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import api from '../../api';

export default function CarsAdmin() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await api.get('/cars');
        setCars(response.data);
      } catch (error) {
        console.error('Failed to fetch cars', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Warehouse (Cars)</h1>
        <button className="bg-foreground text-background px-4 py-2 rounded-lg font-medium flex items-center space-x-2 hover:opacity-90 transition-opacity">
          <Plus size={18} />
          <span>Add New Car</span>
        </button>
      </div>

      <div className="bg-background border border-primary/10 rounded-2xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-secondary/50 border-b border-primary/10">
              <th className="p-4 font-medium text-primary/60">ID</th>
              <th className="p-4 font-medium text-primary/60">Brand</th>
              <th className="p-4 font-medium text-primary/60">Model</th>
              <th className="p-4 font-medium text-primary/60">Year</th>
              <th className="p-4 font-medium text-primary/60">Price/Day</th>
              <th className="p-4 font-medium text-primary/60">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" className="p-4 text-center">Loading...</td></tr>
            ) : cars.length === 0 ? (
              <tr><td colSpan="6" className="p-4 text-center">No cars found in database.</td></tr>
            ) : (
              cars.map((car) => (
                <tr key={car.id} className="border-b border-primary/5 hover:bg-secondary/30 transition-colors">
                  <td className="p-4">#{car.id}</td>
                  <td className="p-4 font-medium">{car.brand?.name || 'Unknown'}</td>
                  <td className="p-4">{car.model}</td>
                  <td className="p-4">{car.yearMade}</td>
                  <td className="p-4">${car.price}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      car.status === 'AVAILABLE' ? 'bg-green-500/10 text-green-500' :
                      car.status === 'RENTED' ? 'bg-orange-500/10 text-orange-500' :
                      'bg-red-500/10 text-red-500'
                    }`}>
                      {car.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
