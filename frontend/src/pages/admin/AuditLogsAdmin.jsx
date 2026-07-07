import { useState, useEffect } from 'react';
import { ShieldAlert, Activity, User, Globe, FileJson, Clock } from 'lucide-react';
import api from '../../api';

export default function AuditLogsAdmin() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayload, setSelectedPayload] = useState(null);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const response = await api.get('/audit');
      setLogs(response.data);
    } catch (error) {
      console.error('Failed to fetch audit logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMethodColor = (action) => {
    if (action.startsWith('POST')) return 'text-green-500 bg-green-500/10 border-green-500/20';
    if (action.startsWith('PUT')) return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
    if (action.startsWith('DELETE')) return 'text-red-500 bg-red-500/10 border-red-500/20';
    return 'text-gray-500 bg-gray-500/10 border-gray-500/20';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center space-x-3 mb-2">
        <ShieldAlert size={28} className="text-red-500" />
        <h1 className="text-3xl font-bold">System Audit Trail</h1>
      </div>
      <p className="text-primary/60 text-sm mb-8 tracking-widest uppercase">Immutable Security Logs (Read-Only)</p>

      <div className="bg-background border border-red-500/20 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-red-500/5 text-primary border-b border-red-500/10">
              <tr>
                <th className="px-6 py-4">Timestamp</th>
                <th className="px-6 py-4">Actor</th>
                <th className="px-6 py-4">Action</th>
                <th className="px-6 py-4">IP Address</th>
                <th className="px-6 py-4 text-center">Payload</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-b border-primary/5 hover:bg-primary/5 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-primary/60">
                    <div className="flex items-center space-x-2">
                      <Clock size={14} />
                      <span>{new Date(log.createdAt).toLocaleString()}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <User size={14} className="text-primary/60" />
                      <span className="font-bold">{log.user?.username || 'Unknown'}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 tracking-widest uppercase">{log.user?.role}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded border text-xs font-bold font-mono ${getMethodColor(log.action)}`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-primary/60 font-mono text-xs">
                    <div className="flex items-center space-x-2">
                      <Globe size={14} />
                      <span>{log.ipAddress || 'N/A'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {log.payload ? (
                      <button 
                        onClick={() => setSelectedPayload(log)}
                        className="p-2 bg-primary/5 hover:bg-primary/10 rounded-lg transition-colors text-primary"
                        title="View Payload"
                      >
                        <FileJson size={18} />
                      </button>
                    ) : (
                      <span className="text-primary/30 italic text-xs">Empty</span>
                    )}
                  </td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-primary/50">
                    No audit logs found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payload Modal */}
      {selectedPayload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-background rounded-2xl p-6 w-full max-w-2xl shadow-2xl border border-primary/20">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold flex items-center space-x-2">
                <Activity size={24} className="text-red-500" />
                <span>Payload Details</span>
              </h3>
              <button 
                onClick={() => setSelectedPayload(null)}
                className="text-primary/60 hover:text-primary p-2"
              >
                ✕
              </button>
            </div>
            
            <div className="mb-4">
              <span className={`px-2 py-1 rounded border text-xs font-bold font-mono ${getMethodColor(selectedPayload.action)}`}>
                {selectedPayload.action}
              </span>
            </div>

            <div className="bg-black text-green-400 p-4 rounded-xl overflow-auto max-h-[50vh] font-mono text-sm border border-primary/20">
              <pre>{JSON.stringify(selectedPayload.payload, null, 2)}</pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
