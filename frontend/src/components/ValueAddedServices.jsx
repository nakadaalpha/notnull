import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import FinancingCalculator from './FinancingCalculator';
import { ArrowRight, RefreshCcw } from 'lucide-react';

export default function ValueAddedServices() {
  const [downPayment, setDownPayment] = useState(20);
  const [interestRate, setInterestRate] = useState(5);
  const [months, setMonths] = useState(48);
  const examplePrice = 100000; // Example $100k car

  const monthlyPayment = useMemo(() => {
    const principal = examplePrice - (examplePrice * (downPayment / 100));
    const monthlyRate = (interestRate / 100) / 12;
    if (monthlyRate === 0) return principal / months;
    return (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
  }, [downPayment, interestRate, months]);

  return (
    <section className="py-24 max-w-[1400px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      
      {/* Trade-In Banner */}
      <div className="bg-primary text-background rounded-3xl p-10 md:p-14 relative overflow-hidden group">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-20 mix-blend-multiply group-hover:scale-105 transition-transform duration-700"></div>
        <div className="relative z-10 flex flex-col items-start">
          <div className="w-12 h-12 bg-background/20 rounded-full flex items-center justify-center mb-6">
            <RefreshCcw size={24} className="text-background" />
          </div>
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-4">Upgrade <br/>Your Drive</h2>
          <p className="text-background/80 text-sm md:text-base max-w-sm mb-8">
            Dapatkan penawaran tukar tambah terbaik untuk mobil lama Anda dan gunakan sebagai DP untuk kendaraan impian berikutnya.
          </p>
          <Link to="/warehouse" className="bg-background text-primary font-bold uppercase tracking-widest text-xs px-8 py-4 rounded-xl hover:opacity-90 transition-opacity flex items-center">
            Taksir Harga Mobil Saya <ArrowRight size={16} className="ml-2" />
          </Link>
        </div>
      </div>

      {/* Financing Simulator */}
      <div>
        <div className="mb-8">
          <h2 className="text-3xl font-black uppercase tracking-tighter mb-2">Simulasi Pembiayaan</h2>
          <p className="text-primary/60 text-sm">Sesuaikan DP dan tenor untuk menemukan cicilan bulanan yang paling nyaman bagi Anda. (Simulasi berdasarkan unit seharga $100,000)</p>
        </div>
        <FinancingCalculator 
          downPayment={downPayment} setDownPayment={setDownPayment}
          interestRate={interestRate} setInterestRate={setInterestRate}
          months={months} setMonths={setMonths}
          monthlyPayment={monthlyPayment}
        />
      </div>

    </section>
  );
}
