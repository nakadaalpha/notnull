import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Save, Map, Info } from 'lucide-react';
import api from '../../api';

export default function SettingsAdmin() {
  const { user } = useAuth();
  const [mapUrl, setMapUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setFetching(true);
      const res = await api.get('/settings/showroom_map');
      if (res.data && res.data.value) {
        setMapUrl(res.data.value);
      }
    } catch (error) {
      if (error.response && error.response.status !== 404) {
        console.error('Failed to fetch settings:', error);
      }
    } finally {
      setFetching(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setMessage({ text: '', type: '' });
      await api.put('/settings/showroom_map', { value: mapUrl });
      setMessage({ text: 'Settings updated successfully!', type: 'success' });
    } catch (error) {
      console.error('Failed to update settings:', error);
      setMessage({ text: 'Failed to update settings.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  if (user?.role !== 'ADMIN') {
    return <div className="p-8">Access Denied. Only Administrators can view this page.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-light tracking-widest uppercase mb-2">System <span className="font-bold">Settings</span></h1>
        <p className="text-primary/60 font-light tracking-wide">Manage application-wide configurations and display elements.</p>
      </div>

      <div className="bg-background border border-primary/10 rounded-2xl p-8 shadow-sm">
        <h2 className="text-xl font-bold tracking-widest uppercase mb-6 flex items-center">
          <Map className="mr-3 text-primary/70" size={24} />
          Showroom Location
        </h2>
        
        <div className="bg-primary/5 border border-primary/10 rounded-xl p-4 mb-8 flex items-start space-x-3">
          <Info className="text-primary/70 shrink-0 mt-0.5" size={18} />
          <div className="text-sm font-light leading-relaxed">
            <p className="font-bold mb-1">How to get the Google Maps Embed URL:</p>
            <ol className="list-decimal ml-4 space-y-1 text-primary/80">
              <li>Open Google Maps and search for your showroom location.</li>
              <li>Click the <strong>"Share"</strong> button, then select the <strong>"Embed a map"</strong> tab.</li>
              <li>Click <strong>"Copy HTML"</strong>.</li>
              <li>Paste the code somewhere temporarily and copy <strong>only the URL</strong> found inside the <code>src="..."</code> attribute.</li>
              <li>Paste that URL into the input field below.</li>
            </ol>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <label className="block text-xs font-bold tracking-widest uppercase text-primary/60 mb-3">Google Maps Embed URL</label>
            {fetching ? (
              <div className="h-12 bg-primary/5 animate-pulse rounded-lg w-full"></div>
            ) : (
              <input
                type="text"
                value={mapUrl}
                onChange={(e) => setMapUrl(e.target.value)}
                placeholder="https://www.google.com/maps/embed?pb=..."
                className="w-full p-4 bg-transparent border border-primary/20 focus:outline-none focus:border-primary transition-colors text-sm rounded-lg"
              />
            )}
          </div>

          {message.text && (
            <div className={`p-4 rounded-lg text-sm font-medium ${message.type === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
              {message.text}
            </div>
          )}

          <div className="flex justify-end pt-4 border-t border-primary/10">
            <button
              type="submit"
              disabled={loading || fetching}
              className="bg-foreground text-background px-8 py-3 rounded-full font-bold text-sm tracking-widest uppercase hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <Save size={18} />
              <span>{loading ? 'Saving...' : 'Save Settings'}</span>
            </button>
          </div>
        </form>

        {/* Map Preview */}
        {mapUrl && (
          <div className="mt-10 border-t border-primary/10 pt-8">
            <h3 className="text-xs font-bold tracking-widest uppercase text-primary/60 mb-4">Live Preview</h3>
            <div className="w-full h-64 bg-secondary/10 rounded-xl overflow-hidden">
              <iframe 
                src={mapUrl}
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
