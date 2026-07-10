import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShieldCheck, CheckCircle2, CreditCard } from 'lucide-react';
import api from '../api';

export default function MockPayment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSimulatePayment = async () => {
    setIsProcessing(true);
    try {
      // We simulate Xendit's backend calling our webhook
      const webhookPayload = {
        external_id: `invoice-${id}-mocked`,
        status: 'PAID'
      };

      await api.post('/webhooks/xendit', webhookPayload);
      
      // Redirect to the actual success page, just like Xendit would
      window.location.href = '/payment-success?txId=' + id;
    } catch (error) {
      console.error('Webhook simulation failed', error);
      alert('Failed to simulate payment.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-gray-900 font-sans">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-8 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-2 bg-blue-600"></div>
        
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="text-blue-600" size={24} />
            <span className="font-bold tracking-widest text-sm text-gray-500 uppercase">Secure Payment</span>
          </div>
          <span className="text-xl font-black italic tracking-tighter text-blue-600">XENDIT (SANDBOX)</span>
        </div>

        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <CreditCard size={40} className="text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Simulate Payment</h2>
          <p className="text-gray-500 text-sm">
            You are in development mode. No real money will be charged. Click the button below to simulate a successful payment for Transaction #{id}.
          </p>
        </div>

        <button 
          onClick={handleSimulatePayment} 
          disabled={isProcessing}
          className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-600/30 hover:bg-blue-700 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          {isProcessing ? (
            <span>Processing...</span>
          ) : (
            <>
              <CheckCircle2 size={20} />
              <span>Pay Now (Mock)</span>
            </>
          )}
        </button>

        <div className="mt-6 text-center">
          <button 
            onClick={() => navigate('/checkout')}
            className="text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors uppercase tracking-widest"
          >
            Cancel Payment
          </button>
        </div>
      </div>
    </div>
  );
}
