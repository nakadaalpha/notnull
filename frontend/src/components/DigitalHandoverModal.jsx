import React, { useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import Modal from './Modal';
import api from '../api';

export default function DigitalHandoverModal({ isOpen, onClose, transaction, onSuccess }) {
  const sigCanvas = useRef({});
  const [checklist, setChecklist] = useState({
    keys: false,
    bpkb: false,
    stnk: false,
    faktur: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!transaction) return null;

  const isAllChecked = Object.values(checklist).every(Boolean);

  const handleClear = () => {
    sigCanvas.current.clear();
  };

  const handleSubmit = async () => {
    if (!isAllChecked) {
      alert("Tolong pastikan semua dokumen dan kelengkapan fisik telah diserahkan (dicentang).");
      return;
    }

    if (sigCanvas.current.isEmpty()) {
      alert("Tolong minta pelanggan untuk memberikan tanda tangan digital.");
      return;
    }

    const signatureData = sigCanvas.current.getTrimmedCanvas().toDataURL('image/png');

    setIsSubmitting(true);
    try {
      // API call to finalize transaction and generate PDF
      await api.post(`/transactions/${transaction.id}/handover`, {
        signature: signatureData,
        checklist
      });
      onSuccess();
    } catch (error) {
      console.error('Handover failed', error);
      alert('Gagal menyelesaikan proses serah terima.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Digital Handover & Settlement" maxWidth="max-w-2xl">
      <div className="space-y-6">
        <div className="bg-secondary/10 p-4 rounded-xl border border-primary/10">
          <h3 className="text-sm font-bold uppercase tracking-widest text-primary/80 mb-2">Customer Info</h3>
          <p className="text-xs"><strong>Name:</strong> {transaction.customer?.username}</p>
          <p className="text-xs"><strong>Car:</strong> {transaction.car?.brand?.name} {transaction.car?.model}</p>
          <p className="text-xs"><strong>Total Price:</strong> ${transaction.totalPrice?.toLocaleString()}</p>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-primary/80 mb-4 border-b border-primary/10 pb-2">Handover Checklist</h3>
          <p className="text-xs text-primary/60 mb-4">Pastikan Anda telah menyerahkan semua kelengkapan di bawah ini kepada pelanggan di lokasi.</p>
          <div className="space-y-3">
            <label className="flex items-center space-x-3 cursor-pointer p-3 bg-background border border-primary/10 rounded hover:border-primary/30 transition-colors">
              <input type="checkbox" checked={checklist.keys} onChange={(e) => setChecklist({...checklist, keys: e.target.checked})} className="w-5 h-5 rounded border-primary/30 text-primary focus:ring-primary" />
              <span className="text-sm font-medium">Kunci Fisik (Main & Spare)</span>
            </label>
            <label className="flex items-center space-x-3 cursor-pointer p-3 bg-background border border-primary/10 rounded hover:border-primary/30 transition-colors">
              <input type="checkbox" checked={checklist.bpkb} onChange={(e) => setChecklist({...checklist, bpkb: e.target.checked})} className="w-5 h-5 rounded border-primary/30 text-primary focus:ring-primary" />
              <span className="text-sm font-medium">BPKB (Buku Pemilik Kendaraan Bermotor)</span>
            </label>
            <label className="flex items-center space-x-3 cursor-pointer p-3 bg-background border border-primary/10 rounded hover:border-primary/30 transition-colors">
              <input type="checkbox" checked={checklist.stnk} onChange={(e) => setChecklist({...checklist, stnk: e.target.checked})} className="w-5 h-5 rounded border-primary/30 text-primary focus:ring-primary" />
              <span className="text-sm font-medium">STNK (Surat Tanda Nomor Kendaraan)</span>
            </label>
            <label className="flex items-center space-x-3 cursor-pointer p-3 bg-background border border-primary/10 rounded hover:border-primary/30 transition-colors">
              <input type="checkbox" checked={checklist.faktur} onChange={(e) => setChecklist({...checklist, faktur: e.target.checked})} className="w-5 h-5 rounded border-primary/30 text-primary focus:ring-primary" />
              <span className="text-sm font-medium">Faktur Pembelian Asli & Kwitansi Blanko</span>
            </label>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-primary/80 mb-4 border-b border-primary/10 pb-2">Customer Signature</h3>
          <p className="text-xs text-primary/60 mb-2">Pelanggan membubuhkan tanda tangan sebagai bukti sah penerimaan kendaraan dan kelengkapannya.</p>
          <div className="border-2 border-dashed border-primary/20 rounded-xl overflow-hidden bg-white relative">
            <SignatureCanvas 
              ref={sigCanvas} 
              penColor="black"
              canvasProps={{className: "w-full h-40 cursor-crosshair"}} 
            />
            <button 
              onClick={handleClear}
              className="absolute top-2 right-2 px-3 py-1 bg-secondary text-primary/70 text-xs font-bold rounded-lg hover:bg-secondary/50"
            >
              Clear
            </button>
          </div>
        </div>

        <div className="pt-6 flex justify-end space-x-4 border-t border-primary/10">
          <button 
            onClick={onClose} 
            className="px-6 py-3 font-bold text-xs uppercase tracking-widest hover:bg-primary/5 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit} 
            disabled={!isAllChecked || isSubmitting}
            className={`px-8 py-3 font-bold text-xs uppercase tracking-widest bg-foreground text-background rounded-xl transition-all ${
              isAllChecked && !isSubmitting ? 'hover:opacity-90' : 'opacity-50 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? 'Processing...' : 'Complete Handover'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
