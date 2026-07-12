import { MapPin, Clock, Phone } from 'lucide-react';

export default function ContactLocation() {
  return (
    <section className="py-24 max-w-[1400px] mx-auto px-6 md:px-12 border-t border-primary/10">
      <div className="flex flex-col md:flex-row gap-12 items-center">
        {/* Contact Info */}
        <div className="w-full md:w-1/3">
          <h2 className="text-3xl font-black uppercase tracking-tighter mb-8">Kunjungi <br/>Showroom Kami</h2>
          
          <div className="space-y-6">
            <div className="flex items-start">
              <MapPin className="text-primary mt-1 mr-4" size={24} />
              <div>
                <h4 className="font-bold uppercase tracking-wider mb-1">NOTNULL HQ Jakarta</h4>
                <p className="text-primary/70 text-sm">Jl. Jend. Sudirman Kav. 52-53,<br/>Senayan, Kebayoran Baru,<br/>Jakarta Selatan 12190</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Clock className="text-primary mt-1 mr-4" size={24} />
              <div>
                <h4 className="font-bold uppercase tracking-wider mb-1">Jam Operasional</h4>
                <p className="text-primary/70 text-sm">Senin - Jumat: 09:00 - 20:00<br/>Sabtu - Minggu: 10:00 - 18:00</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Phone className="text-primary mt-1 mr-4" size={24} />
              <div>
                <h4 className="font-bold uppercase tracking-wider mb-1">Hubungi Sales</h4>
                <p className="text-primary/70 text-sm">+62 811 9999 8888<br/>sales@notnull.com</p>
              </div>
            </div>
          </div>
          
          <p className="text-xs text-primary/40 mt-8">
            *Untuk layanan komplain fisik dan pengambilan unit mandiri, silakan kunjungi meja resepsionis di lantai 1.
          </p>
        </div>
        
        {/* Google Maps Embed */}
        <div className="w-full md:w-2/3 h-[400px] bg-secondary/20 rounded-3xl overflow-hidden border border-primary/10 relative">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.2672018290076!2d106.80493397603779!3d-6.228460293759902!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f143a5ee9047%3A0x67fa50d0df9fbd!2sSudirman%20Central%20Business%20District%20(SCBD)!5e0!3m2!1sen!2sid!4v1700000000000!5m2!1sen!2sid" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen="" 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="NOTNULL Showroom Map"
            className="absolute inset-0 grayscale contrast-125 opacity-80 mix-blend-multiply dark:mix-blend-screen dark:invert"
          ></iframe>
        </div>
      </div>
    </section>
  );
}
