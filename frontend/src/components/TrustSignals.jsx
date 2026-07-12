import { CheckCircle, Shield, DropletOff, Wrench } from 'lucide-react';

export default function TrustSignals() {
  const testimonials = [
    {
      id: 1,
      name: "Budi Santoso",
      car: "BMW M4 Competition",
      quote: "Pengalaman membeli mobil bekas yang paling transparan. Inspeksinya sangat detail dan mobil terasa seperti baru keluar dari pabrik.",
      image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&q=80&w=200&h=200"
    },
    {
      id: 2,
      name: "Diana P.",
      car: "Porsche 911 Carrera",
      quote: "Sangat puas dengan layanan home delivery-nya! Dokumen diurus semua, saya tinggal terima kunci di garasi rumah.",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200"
    }
  ];

  return (
    <section className="py-24 bg-secondary/20">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        {/* Badges Section */}
        <div className="mb-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black uppercase tracking-tighter mb-4">Sertifikasi Kualitas NOTNULL</h2>
            <p className="text-primary/60 text-sm tracking-widest uppercase">Ketenangan Pikiran Tanpa Kompromi</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-background border border-primary/10 p-8 rounded-2xl text-center hover:border-primary/30 transition-colors">
              <div className="w-16 h-16 bg-blue-500/10 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Wrench size={32} />
              </div>
              <h3 className="text-lg font-bold mb-3 uppercase tracking-wider">Inspeksi Mekanik 150 Titik</h3>
              <p className="text-primary/60 text-sm">Setiap unit dibongkar dan diperiksa secara menyeluruh oleh master mekanik kami sebelum masuk ke etalase.</p>
            </div>
            
            <div className="bg-background border border-primary/10 p-8 rounded-2xl text-center hover:border-primary/30 transition-colors">
              <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield size={32} />
              </div>
              <h3 className="text-lg font-bold mb-3 uppercase tracking-wider">Bebas Tabrakan Besar</h3>
              <p className="text-primary/60 text-sm">Struktur sasis dijamin utuh. Kami menolak mobil dengan riwayat kecelakaan struktural atau airbags yang pernah meledak.</p>
            </div>
            
            <div className="bg-background border border-primary/10 p-8 rounded-2xl text-center hover:border-primary/30 transition-colors">
              <div className="w-16 h-16 bg-cyan-500/10 text-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <DropletOff size={32} />
              </div>
              <h3 className="text-lg font-bold mb-3 uppercase tracking-wider">Garansi Bebas Banjir</h3>
              <p className="text-primary/60 text-sm">Pengecekan interior hingga kolong mesin terdalam untuk memastikan tidak ada residu atau kerusakan akibat rendaman air.</p>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div>
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-2xl font-black uppercase tracking-tighter">Kisah Pelanggan Kami</h2>
            <div className="hidden md:flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-primary/60">
              <CheckCircle size={16} className="text-green-500" />
              <span>100% Verified Buyers</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map(t => (
              <div key={t.id} className="bg-background border border-primary/10 p-8 rounded-2xl flex flex-col md:flex-row gap-6 items-center md:items-start">
                <img src={t.image} alt={t.name} className="w-24 h-24 rounded-full object-cover border-4 border-secondary" />
                <div>
                  <p className="text-lg italic text-primary/80 mb-4">"{t.quote}"</p>
                  <h4 className="font-bold uppercase tracking-wider">{t.name}</h4>
                  <p className="text-xs tracking-widest text-primary/50 uppercase">{t.car}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
