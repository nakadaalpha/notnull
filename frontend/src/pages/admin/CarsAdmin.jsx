import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import api from '../../api';
import Modal from '../../components/Modal';
import CarSpecsEditor from '../../components/CarSpecsEditor';

const defaultSpecsTemplate = {
  hero_specs: {
    "Trim Level": "",
    "Mileage": "",
    "Condition": ""
  },
  performance: {
    "Torque": "",
    "Drivetrain": "",
    "Horsepower": "",
    "Engine Type": "",
    "Acceleration": "",
    "Transmission": ""
  },
  dimensions: {
    "Length": "",
    "Width": "",
    "Height": "",
    "Wheelbase": "",
    "Curb Weight": "",
    "Cargo Capacity": ""
  },
  interior: {
    "Seating": [""],
    "Infotainment": [""]
  },
  safety_and_features: {
    "Active Safety": [""],
    "Passive Safety": [""]
  }
};

export default function CarsAdmin() {
  const [cars, setCars] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search and Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStock, setFilterStock] = useState('ALL');
  const [filterBrand, setFilterBrand] = useState('ALL');
  const [sortBy, setSortBy] = useState('DEFAULT');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
  const [selectedCarId, setSelectedCarId] = useState(null);
  const [formData, setFormData] = useState({
    brandId: '',
    model: '',
    yearMade: '',
    price: '',
    stock: '',
    imageUrl: '',
    specifications: defaultSpecsTemplate,
    has_bpkb: false,
    has_stnk: false,
    stnk_expiry_date: '',
    has_faktur: false,
    has_kwitansi_blanko: false,
    has_form_a: false,
    scanned_files: []
  });
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [carsRes, brandsRes] = await Promise.all([
        api.get('/cars'),
        api.get('/brands') // Assuming this endpoint exists
      ]);
      setCars(carsRes.data);
      setBrands(brandsRes.data);
    } catch (error) {
      console.error('Failed to fetch data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openModal = (mode, car = null) => {
    setModalMode(mode);
    if (car) {
      setSelectedCarId(car.id);
      setFormData({
        brandId: car.brandId,
        model: car.model,
        yearMade: car.yearMade,
        price: car.price,
        stock: car.stock,
        imageUrl: car.imageUrl || '',
        specifications: car.specifications || {
          hero_specs: {},
          performance: {},
          dimensions: {},
          interior: {},
          safety_and_features: {}
        },
        has_bpkb: car.document?.has_bpkb || false,
        has_stnk: car.document?.has_stnk || false,
        stnk_expiry_date: car.document?.stnk_expiry_date ? car.document.stnk_expiry_date.split('T')[0] : '',
        has_faktur: car.document?.has_faktur || false,
        has_kwitansi_blanko: car.document?.has_kwitansi_blanko || false,
        has_form_a: car.document?.has_form_a || false,
        scanned_files: car.document?.scanned_files || []
      });
    } else {
      setSelectedCarId(null);
      setFormData({ 
        brandId: brands[0]?.id || '', 
        model: '', 
        yearMade: '', 
        price: '', 
        stock: '1', 
        imageUrl: '',
        specifications: defaultSpecsTemplate,
        has_bpkb: false,
        has_stnk: false,
        stnk_expiry_date: '',
        has_faktur: false,
        has_kwitansi_blanko: false,
        has_form_a: false,
        scanned_files: []
      });
    }
    setActiveTab('basic');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsUploading(false);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append('image', file);

    try {
      setIsUploading(true);
      const res = await api.post('/uploads', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setFormData({ ...formData, imageUrl: res.data.url });
    } catch (error) {
      console.error('Upload failed', error);
      alert('Failed to upload image.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (modalMode === 'edit' && !window.confirm('Are you sure you want to save these changes?')) return;
    try {
      let carId = selectedCarId;
      if (modalMode === 'create') {
        const res = await api.post('/cars', formData);
        carId = res.data.id;
      } else {
        await api.put(`/cars/${selectedCarId}`, formData);
      }

      // Save document metadata
      await api.post(`/documents/${carId}`, {
        has_bpkb: formData.has_bpkb,
        has_stnk: formData.has_stnk,
        stnk_expiry_date: formData.stnk_expiry_date,
        has_faktur: formData.has_faktur,
        has_kwitansi_blanko: formData.has_kwitansi_blanko,
        has_form_a: formData.has_form_a,
        scanned_files: formData.scanned_files
      });

      closeModal();
      fetchData();
    } catch (error) {
      console.error('Save failed', error);
      alert('Failed to save car. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this car?')) return;
    try {
      await api.delete(`/cars/${id}`);
      if (isModalOpen && selectedCarId === id) closeModal();
      fetchData();
    } catch (error) {
      console.error('Delete failed', error);
      alert(error.response?.data?.error || 'Failed to delete car.');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Warehouse (Cars)</h1>
        <button onClick={() => openModal('create')} className="bg-foreground text-background px-4 py-2 rounded-lg font-medium flex items-center space-x-2 hover:opacity-90 transition-opacity">
          <Plus size={18} />
          <span>Add New Car</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input 
          type="text" 
          placeholder="Search by model or brand..." 
          className="flex-1 bg-background border border-primary/20 px-4 py-2 rounded-lg focus:outline-none focus:border-primary text-primary"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select 
          className="bg-background border border-primary/20 px-4 py-2 rounded-lg focus:outline-none focus:border-primary text-primary"
          value={filterBrand}
          onChange={(e) => setFilterBrand(e.target.value)}
        >
          <option value="ALL">All Brands</option>
          {brands.map(brand => (
            <option key={brand.id} value={brand.id}>{brand.name}</option>
          ))}
        </select>
        <select 
          className="bg-background border border-primary/20 px-4 py-2 rounded-lg focus:outline-none focus:border-primary text-primary"
          value={filterStock}
          onChange={(e) => setFilterStock(e.target.value)}
        >
          <option value="ALL">All Stock</option>
          <option value="AVAILABLE">Available</option>
          <option value="OUT_OF_STOCK">Out of Stock</option>
        </select>
        <select 
          className="bg-background border border-primary/20 px-4 py-2 rounded-lg focus:outline-none focus:border-primary text-primary"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="DEFAULT">Sort By: Default (ID)</option>
          <option value="NAME_ASC">Name: A to Z</option>
          <option value="NAME_DESC">Name: Z to A</option>
          <option value="PRICE_ASC">Price: Low to High</option>
          <option value="PRICE_DESC">Price: High to Low</option>
          <option value="YEAR_DESC">Year: Newest First</option>
          <option value="YEAR_ASC">Year: Oldest First</option>
        </select>
      </div>

      {(() => {
        const filteredCars = cars.filter(car => {
          const matchesSearch = car.model.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                car.brand?.name?.toLowerCase().includes(searchTerm.toLowerCase());
          const isAvailable = car.stock > 0;
          const matchesStatus = filterStock === 'ALL' || 
                                (filterStock === 'AVAILABLE' && isAvailable) ||
                                (filterStock === 'OUT_OF_STOCK' && !isAvailable);
          const matchesBrand = filterBrand === 'ALL' || car.brandId === parseInt(filterBrand);
          return matchesSearch && matchesStatus && matchesBrand;
        }).sort((a, b) => {
          if (sortBy === 'NAME_ASC') return a.model.localeCompare(b.model);
          if (sortBy === 'NAME_DESC') return b.model.localeCompare(a.model);
          if (sortBy === 'PRICE_ASC') return a.price - b.price;
          if (sortBy === 'PRICE_DESC') return b.price - a.price;
          if (sortBy === 'YEAR_ASC') return a.yearMade - b.yearMade;
          if (sortBy === 'YEAR_DESC') return b.yearMade - a.yearMade;
          return a.id - b.id;
        });

        return (
          <div className="bg-background border border-primary/10 rounded-2xl overflow-x-auto" data-lenis-prevent>
            <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead>
            <tr className="bg-secondary/50 border-b border-primary/10">
              <th className="p-4 font-medium text-primary/60">ID</th>
              <th className="p-4 font-medium text-primary/60">Brand</th>
              <th className="p-4 font-medium text-primary/60">Model</th>
              <th className="p-4 font-medium text-primary/60">Year</th>
              <th className="p-4 font-medium text-primary/60">Price ($)</th>
              <th className="p-4 font-medium text-primary/60">Stock</th>
              <th className="p-4 font-medium text-primary/60">Status</th>
              <th className="p-4 font-medium text-primary/60 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="8" className="p-4 text-center">Loading...</td></tr>
            ) : filteredCars.length === 0 ? (
              <tr><td colSpan="8" className="p-4 text-center">No cars found matching filters.</td></tr>
            ) : (
              filteredCars.map((car) => (
                <tr key={car.id} onClick={() => openModal('edit', car)} className="cursor-pointer border-b border-primary/5 hover:bg-secondary/50 transition-colors">
                  <td className="p-4">#{car.id}</td>
                  <td className="p-4 font-medium">{car.brand?.name || 'Unknown'}</td>
                  <td className="p-4">{car.model}</td>
                  <td className="p-4">{car.yearMade}</td>
                  <td className="p-4">${car.price}</td>
                  <td className="p-4">{car.stock}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      car.stock > 0 ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                    }`}>
                      {car.stock > 0 ? 'AVAILABLE' : 'SOLD OUT'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button onClick={(e) => { e.stopPropagation(); openModal('edit', car); }} className="p-2 hover:bg-primary/10 rounded-full transition-colors mr-2">
                      <Edit size={18} />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); handleDelete(car.id); }} className="p-2 hover:bg-red-500/10 text-red-500 rounded-full transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      );
    })()}

      <Modal isOpen={isModalOpen} onClose={closeModal} title={modalMode === 'create' ? 'Add New Car' : 'Edit Car'} maxWidth="max-w-5xl">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Side: Image Preview */}
          <div className="w-full lg:w-5/12 flex items-center justify-center p-6 min-h-[300px] lg:min-h-full relative">
            {isUploading && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-xl">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-2"></div>
                  <p className="text-sm font-bold tracking-widest uppercase">Uploading...</p>
                </div>
              </div>
            )}
            {formData.imageUrl ? (
              <img loading="lazy" 
                src={formData.imageUrl.startsWith('http') ? formData.imageUrl : `/images/cars/${formData.imageUrl}`} 
                alt="Car Preview" 
                className="max-w-full max-h-full object-contain rounded-xl transition-transform hover:scale-105 duration-500"
                onError={(e) => { e.target.src = 'https://via.placeholder.com/400?text=Invalid+Image'; }}
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-primary/30">
                <div className="w-20 h-20 border-2 border-dashed border-primary/30 rounded-full flex items-center justify-center mb-4">
                  <Plus size={32} className="opacity-50" />
                </div>
                <p className="font-medium tracking-widest uppercase text-xs">No Image Provided</p>
              </div>
            )}
          </div>

          {/* Right Side: Form Inputs */}
          <div className="w-full lg:w-7/12 flex flex-col">
            <div className="flex border-b border-primary/10 mb-6">
              <button 
                type="button"
                onClick={() => setActiveTab('basic')}
                className={`px-6 py-3 text-xs font-bold uppercase tracking-widest transition-colors border-b-2 ${activeTab === 'basic' ? 'border-primary text-primary' : 'border-transparent text-primary/40 hover:text-primary/70'}`}
              >
                Basic Info
              </button>
              <button 
                type="button"
                onClick={() => setActiveTab('specs')}
                className={`px-6 py-3 text-xs font-bold uppercase tracking-widest transition-colors border-b-2 ${activeTab === 'specs' ? 'border-primary text-primary' : 'border-transparent text-primary/40 hover:text-primary/70'}`}
              >
                Specifications
              </button>
              <button 
                type="button"
                onClick={() => setActiveTab('documents')}
                className={`px-6 py-3 text-xs font-bold uppercase tracking-widest transition-colors border-b-2 ${activeTab === 'documents' ? 'border-primary text-primary' : 'border-transparent text-primary/40 hover:text-primary/70'}`}
              >
                Documents
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 flex-1 flex flex-col">
              {activeTab === 'basic' ? (
                <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-primary/60 mb-2">Brand</label>
                  <select
                    required
                    className="w-full bg-background text-primary px-3 py-2 rounded border border-primary/20 focus:outline-none focus:border-primary transition-colors text-sm font-medium"
                    value={formData.brandId}
                    onChange={(e) => setFormData({ ...formData, brandId: e.target.value })}
                  >
                    <option value="">Select a brand</option>
                    {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-primary/60 mb-2">Model</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-background text-primary px-3 py-2 rounded border border-primary/20 focus:outline-none focus:border-primary transition-colors text-sm font-medium"
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-primary/60 mb-2">Car Image</label>
                <div className="flex space-x-4">
                  <div className="relative flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      disabled={isUploading}
                    />
                    <div className="w-full bg-background text-primary px-3 py-2 rounded border border-primary/20 focus:outline-none focus:border-primary transition-colors font-medium flex items-center justify-center space-x-2 text-sm cursor-pointer hover:bg-primary/5">
                      <Plus size={18} />
                      <span>Choose File</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      className="w-full bg-background text-primary px-3 py-2 rounded border border-primary/20 focus:outline-none focus:border-primary transition-colors font-medium text-sm"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      placeholder="Or enter URL directly..."
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-primary/60 mb-2">Year Made</label>
                  <input
                    type="number"
                    required
                    className="w-full bg-background text-primary px-3 py-2 rounded border border-primary/20 focus:outline-none focus:border-primary transition-colors text-sm font-medium"
                    value={formData.yearMade}
                    onChange={(e) => setFormData({ ...formData, yearMade: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-primary/60 mb-2">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    className="w-full bg-background text-primary px-3 py-2 rounded border border-primary/20 focus:outline-none focus:border-primary transition-colors text-sm font-medium"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-primary/60 mb-2">Stock</label>
                  <input
                    type="number"
                    required
                    min="0"
                    className="w-full bg-background text-primary px-3 py-2 rounded border border-primary/20 focus:outline-none focus:border-primary transition-colors text-sm font-medium"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  />
                </div>
              </div>
              </div>
              ) : activeTab === 'specs' ? (
                <div className="flex-1 min-h-[300px]">
                  <CarSpecsEditor 
                    key={selectedCarId || 'new'}
                    specs={formData.specifications} 
                    onChange={(newSpecs) => setFormData({ ...formData, specifications: newSpecs })} 
                  />
                </div>
              ) : (
                <div className="flex-1 space-y-6 min-h-[300px]">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-primary/80 mb-4 border-b border-primary/10 pb-2">Physical Documents</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input type="checkbox" checked={formData.has_bpkb} onChange={(e) => setFormData({...formData, has_bpkb: e.target.checked})} className="w-4 h-4 rounded border-primary/30 text-primary focus:ring-primary" />
                      <span className="text-sm font-medium">BPKB Physical Copy</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input type="checkbox" checked={formData.has_stnk} onChange={(e) => setFormData({...formData, has_stnk: e.target.checked})} className="w-4 h-4 rounded border-primary/30 text-primary focus:ring-primary" />
                      <span className="text-sm font-medium">STNK Physical Copy</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input type="checkbox" checked={formData.has_faktur} onChange={(e) => setFormData({...formData, has_faktur: e.target.checked})} className="w-4 h-4 rounded border-primary/30 text-primary focus:ring-primary" />
                      <span className="text-sm font-medium">Faktur Pembelian</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input type="checkbox" checked={formData.has_kwitansi_blanko} onChange={(e) => setFormData({...formData, has_kwitansi_blanko: e.target.checked})} className="w-4 h-4 rounded border-primary/30 text-primary focus:ring-primary" />
                      <span className="text-sm font-medium">Kwitansi Blanko</span>
                    </label>
                  </div>

                  <div className="mt-4">
                    <label className="block text-xs font-bold uppercase tracking-widest text-primary/60 mb-2">STNK Expiry Date</label>
                    <input type="date" value={formData.stnk_expiry_date} onChange={(e) => setFormData({...formData, stnk_expiry_date: e.target.value})} className="w-full bg-background text-primary px-3 py-2 rounded border border-primary/20 focus:outline-none focus:border-primary text-sm" />
                  </div>

                  <div className="mt-6 border-t border-primary/10 pt-4">
                    <label className="block text-xs font-bold uppercase tracking-widest text-primary/60 mb-2">Scanned Documents (PDF/Images)</label>
                    <div className="flex items-center space-x-4">
                      <input type="file" multiple accept=".pdf,image/*" onChange={async (e) => {
                        const files = Array.from(e.target.files);
                        if(files.length === 0) return;
                        const uploadData = new FormData();
                        files.forEach(f => uploadData.append('files', f));
                        try {
                          setIsUploading(true);
                          const res = await api.post('/documents/upload', uploadData, { headers: { 'Content-Type': 'multipart/form-data' }});
                          setFormData({...formData, scanned_files: [...formData.scanned_files, ...res.data.files]});
                        } catch (error) {
                          alert('Failed to upload document files.');
                        } finally {
                          setIsUploading(false);
                        }
                      }} className="block w-full text-sm text-primary/70 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer" disabled={isUploading}/>
                    </div>
                    {formData.scanned_files && formData.scanned_files.length > 0 && (
                      <ul className="mt-4 space-y-2">
                        {formData.scanned_files.map((file, idx) => (
                          <li key={idx} className="text-xs bg-secondary/5 px-3 py-2 rounded flex justify-between items-center">
                            <span className="truncate max-w-[200px]">{file}</span>
                            <div className="flex space-x-2">
                              <a href={`${api.defaults.baseURL.replace('/api', '')}/api/documents/view/${file}`} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">View</a>
                              <button type="button" onClick={() => setFormData({...formData, scanned_files: formData.scanned_files.filter(f => f !== file)})} className="text-red-500 hover:underline">Remove</button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              )}

              <div className="flex space-x-4 mt-8 pt-6 border-t border-primary/10">
                {modalMode === 'edit' && (
                  <button 
                    type="button" 
                    onClick={() => handleDelete(selectedCarId)} 
                    className="w-1/3 bg-red-500/10 text-red-500 py-4 rounded-lg font-bold tracking-widest uppercase text-xs hover:bg-red-500/20 transition-colors"
                  >
                    Delete
                  </button>
                )}
                <button type="submit" className={`bg-foreground text-background py-4 rounded-lg font-bold tracking-widest uppercase text-xs hover:opacity-90 transition-opacity ${modalMode === 'edit' ? 'w-2/3' : 'w-full'}`}>
                  {modalMode === 'create' ? 'Add Car' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Modal>
    </div>
  );
}
