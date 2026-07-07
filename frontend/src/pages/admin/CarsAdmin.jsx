import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, FileText, Image, UploadCloud, CheckCircle2 } from 'lucide-react';
import api from '../../api';
import Modal from '../../components/Modal';
import CarSpecsEditor from '../../components/CarSpecsEditor';

const formatFilename = (name) => {
  if (!name) return '';
  return name.replace(/^\d+-/, '');
};

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

  const handleSpecificUpload = async (e, docKey) => {
    const file = e.target.files[0];
    if (!file) return;
    const uploadData = new FormData();
    uploadData.append('files', file);
    try {
      setIsUploading(true);
      const res = await api.post('/documents/upload', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const newFile = res.data.files[0];
      const currentScanned = (formData.scanned_files && !Array.isArray(formData.scanned_files)) ? formData.scanned_files : {};
      setFormData({...formData, [docKey]: true, scanned_files: { ...currentScanned, [docKey]: newFile }});
    } catch (error) {
      console.error('Upload failed', error);
      alert('Failed to upload document file.');
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
        licensePlate: formData.licensePlate,
        vin: formData.vin,
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
                Identity & Docs
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
                  <h3 className="text-sm font-bold uppercase tracking-widest text-primary/80 mb-4 border-b border-primary/10 pb-2">Physical Identity</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-primary/60 mb-2">License Plate (Nomor Polisi)</label>
                      <input type="text" placeholder="e.g. B 1234 XYZ" value={formData.licensePlate || ''} onChange={(e) => setFormData({...formData, licensePlate: e.target.value.toUpperCase()})} className="w-full bg-background text-primary px-4 py-3 rounded-xl border border-primary/20 focus:outline-none focus:border-primary text-sm font-medium transition-colors" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-primary/60 mb-2">Chassis No. (Nomor Rangka / VIN)</label>
                      <input type="text" placeholder="e.g. MHXXXX..." value={formData.vin || ''} onChange={(e) => setFormData({...formData, vin: e.target.value.toUpperCase()})} className="w-full bg-background text-primary px-4 py-3 rounded-xl border border-primary/20 focus:outline-none focus:border-primary text-sm font-medium transition-colors" />
                    </div>
                  </div>

                  <h3 className="text-sm font-bold uppercase tracking-widest text-primary/80 mb-4 border-b border-primary/10 pb-2 mt-8">Physical Documents</h3>
                  
                  <div className="grid grid-cols-1 gap-6">
                    {[
                      { key: 'has_bpkb', label: 'Vehicle Title (BPKB)' },
                      { key: 'has_stnk', label: 'Registration Certificate (STNK)' },
                      { key: 'has_faktur', label: 'Purchase Invoice' },
                      { key: 'has_kwitansi_blanko', label: 'Blank Receipt' }
                    ].map(doc => {
                      const currentScanned = (formData.scanned_files && !Array.isArray(formData.scanned_files)) ? formData.scanned_files : {};
                      const uploadedFile = currentScanned[doc.key];
                      const isPdf = uploadedFile?.toLowerCase().endsWith('.pdf');

                      return (
                        <div key={doc.key} className="flex flex-col bg-secondary/5 rounded-xl border border-primary/10 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                          {/* Top row: Toggle */}
                          <div className="flex items-center justify-between px-5 py-4 bg-background/50">
                            <span className="text-sm font-bold tracking-wide">{doc.label}</span>
                            {uploadedFile ? (
                              <span className="flex items-center space-x-1.5 text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                                <CheckCircle2 size={14} />
                                <span>Verified</span>
                              </span>
                            ) : (
                              <span className="flex items-center space-x-1.5 text-red-500 bg-red-500/10 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                                <span>Missing</span>
                              </span>
                            )}
                          </div>
                          
                          {/* Bottom row: File Upload / Display */}
                          <div className="px-5 py-4 border-t border-primary/5 flex items-center">
                            {uploadedFile ? (
                              <div className="flex w-full items-center justify-between">
                                <div className="flex items-center space-x-3 overflow-hidden">
                                  <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500">
                                    <CheckCircle2 size={20} />
                                  </div>
                                  <div className="flex flex-col overflow-hidden">
                                    <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Scanned & Uploaded</span>
                                    <span className="text-sm font-medium truncate text-primary/70" title={formatFilename(uploadedFile)}>{formatFilename(uploadedFile)}</span>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <a href={`${api.defaults.baseURL.replace('/api', '')}/api/documents/view/${uploadedFile}?token=${localStorage.getItem('token')}`} target="_blank" rel="noreferrer" className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors" title="View Document">
                                    <FileText size={18} />
                                  </a>
                                  <button type="button" onClick={() => {
                                    const newScanned = {...currentScanned};
                                    delete newScanned[doc.key];
                                    const updates = { [doc.key]: false, scanned_files: newScanned };
                                    if (doc.key === 'has_stnk') updates.stnk_expiry_date = '';
                                    setFormData({...formData, ...updates});
                                  }} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors" title="Remove Document">
                                    <Trash2 size={18} />
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="flex w-full items-center justify-between text-primary/50">
                                <span className="text-xs font-medium tracking-wide italic">Not Scanned</span>
                                <label className={`flex items-center space-x-2 px-4 py-2 rounded-lg bg-primary/5 hover:bg-primary/10 text-primary cursor-pointer transition-colors text-xs font-bold tracking-widest uppercase ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                                  <UploadCloud size={16} />
                                  <span>Upload</span>
                                  <input type="file" accept=".pdf,image/*" className="hidden" onChange={(e) => handleSpecificUpload(e, doc.key)} disabled={isUploading} />
                                </label>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className={`mt-6 transition-all duration-300 ${formData.has_stnk ? 'opacity-100' : 'opacity-40 grayscale pointer-events-none'}`}>
                    <label className="block text-xs font-bold uppercase tracking-widest text-primary/60 mb-2">STNK Expiry Date</label>
                    <input type="date" value={formData.stnk_expiry_date || ''} onChange={(e) => setFormData({...formData, stnk_expiry_date: e.target.value})} disabled={!formData.has_stnk} className="w-full bg-background text-primary px-4 py-3 rounded-xl border border-primary/20 focus:outline-none focus:border-primary text-sm font-medium transition-colors" />
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
