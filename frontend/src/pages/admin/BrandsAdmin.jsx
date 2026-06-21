import { useEffect, useState } from 'react';
import { Tag, Plus, Edit, Trash2 } from 'lucide-react';
import api from '../../api';
import Modal from '../../components/Modal';

export default function BrandsAdmin() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search state
  const [searchTerm, setSearchTerm] = useState('');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedBrandId, setSelectedBrandId] = useState(null);
  const [formData, setFormData] = useState({ name: '', imageUrl: '' });
  const [isUploading, setIsUploading] = useState(false);

  const fetchBrands = async () => {
    try {
      setLoading(true);
      const response = await api.get('/brands');
      setBrands(response.data);
    } catch (error) {
      console.error('Failed to fetch brands', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const openModal = (mode, brand = null) => {
    setModalMode(mode);
    if (brand) {
      setSelectedBrandId(brand.id);
      setFormData({ name: brand.name, imageUrl: brand.imageUrl || '' });
    } else {
      setSelectedBrandId(null);
      setFormData({ name: '', imageUrl: '' });
    }
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
    try {
      if (modalMode === 'create') {
        await api.post('/brands', formData);
      } else {
        await api.put(`/brands/${selectedBrandId}`, formData);
      }
      closeModal();
      fetchBrands();
    } catch (error) {
      console.error('Save failed', error);
      alert('Failed to save brand. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this brand?')) return;
    try {
      await api.delete(`/brands/${id}`);
      if (isModalOpen && selectedBrandId === id) closeModal();
      fetchBrands();
    } catch (error) {
      console.error('Delete failed', error);
      alert(error.response?.data?.error || 'Failed to delete brand.');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Brands Management</h1>
        <button onClick={() => openModal('create')} className="bg-foreground text-background px-4 py-2 rounded-lg font-medium flex items-center space-x-2 hover:opacity-90 transition-opacity">
          <Plus size={18} />
          <span>Add Brand</span>
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input 
          type="text" 
          placeholder="Search brands by name..." 
          className="w-full md:w-1/3 bg-background border border-primary/20 px-4 py-2 rounded-lg focus:outline-none focus:border-primary text-primary"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-background border border-primary/10 rounded-2xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-secondary/50 border-b border-primary/10">
              <th className="p-4 font-medium text-primary/60">ID</th>
              <th className="p-4 font-medium text-primary/60">Logo</th>
              <th className="p-4 font-medium text-primary/60">Name</th>
              <th className="p-4 font-medium text-primary/60">Cars Count</th>
              <th className="p-4 font-medium text-primary/60 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" className="p-4 text-center">Loading...</td></tr>
            ) : brands.filter(b => b.name.toLowerCase().includes(searchTerm.toLowerCase())).length === 0 ? (
              <tr><td colSpan="5" className="p-4 text-center">No brands found.</td></tr>
            ) : (
              brands.filter(b => b.name.toLowerCase().includes(searchTerm.toLowerCase())).map((brand) => (
                <tr key={brand.id} onClick={() => openModal('edit', brand)} className="cursor-pointer border-b border-primary/5 hover:bg-secondary/50 transition-colors">
                  <td className="p-4">#{brand.id}</td>
                  <td className="p-4">
                    {brand.imageUrl ? (
                      <img src={brand.imageUrl} alt={brand.name} className="w-10 h-10 object-contain bg-white rounded p-1" />
                    ) : (
                      <div className="w-10 h-10 bg-primary/10 rounded flex items-center justify-center text-primary/50">
                        <Tag size={16} />
                      </div>
                    )}
                  </td>
                  <td className="p-4 font-medium">{brand.name}</td>
                  <td className="p-4">
                    <span className="bg-primary/5 px-3 py-1 rounded-full text-sm font-medium">
                      {brand.cars?.length || 0}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button onClick={(e) => { e.stopPropagation(); openModal('edit', brand); }} className="p-2 hover:bg-primary/10 rounded-full transition-colors mr-2">
                      <Edit size={18} />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); handleDelete(brand.id); }} className="p-2 hover:bg-red-500/10 text-red-500 rounded-full transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} title={modalMode === 'create' ? 'Add New Brand' : 'Edit Brand'} maxWidth="max-w-4xl">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Side: Image Preview */}
          <div className="w-full md:w-1/2 flex items-center justify-center p-8 min-h-[300px] relative">
            {isUploading && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-xl">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-2"></div>
                  <p className="text-sm font-bold tracking-widest uppercase">Uploading...</p>
                </div>
              </div>
            )}
            {formData.imageUrl ? (
              <img 
                src={formData.imageUrl} 
                alt="Brand Preview" 
                className="max-w-full max-h-full object-contain rounded-xl drop-shadow-xl"
                onError={(e) => { e.target.src = 'https://via.placeholder.com/300?text=Invalid+Image'; }}
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-primary/30">
                <Tag size={48} className="mb-4 opacity-50" />
                <p className="font-medium tracking-widest uppercase text-xs">No Image Provided</p>
              </div>
            )}
          </div>

          {/* Right Side: Form Inputs */}
          <div className="w-full md:w-1/2 flex flex-col">
            <form onSubmit={handleSubmit} className="space-y-5 flex-1 flex flex-col justify-center">
              <div>
                <label className="block text-sm font-medium mb-1">Brand Name</label>
                <input
                  type="text"
                  required
                  className="w-full bg-secondary text-primary px-4 py-3 rounded-lg border border-primary/20 focus:outline-none focus:border-primary transition-colors"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Brand Logo</label>
                <div className="flex flex-col space-y-3">
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      disabled={isUploading}
                    />
                    <div className="w-full bg-secondary text-primary px-4 py-3 rounded-lg border border-primary/20 focus:outline-none focus:border-primary transition-colors font-medium flex items-center justify-center space-x-2">
                      <Tag size={18} />
                      <span>Choose Image File</span>
                    </div>
                  </div>
                  <input
                    type="url"
                    className="w-full bg-secondary text-primary px-4 py-3 rounded-lg border border-primary/20 focus:outline-none focus:border-primary transition-colors text-sm"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="Or enter URL directly..."
                  />
                </div>
              </div>
              
              <div className="flex space-x-4 mt-8 pt-4 border-t border-primary/10">
                {modalMode === 'edit' && (
                  <button 
                    type="button" 
                    onClick={() => handleDelete(selectedBrandId)} 
                    className="w-1/3 bg-red-500/10 text-red-500 py-3 rounded-lg font-bold hover:bg-red-500/20 transition-colors"
                  >
                    Delete
                  </button>
                )}
                <button type="submit" className={`bg-foreground text-background py-3 rounded-lg font-bold hover:opacity-90 transition-opacity ${modalMode === 'edit' ? 'w-2/3' : 'w-full'}`}>
                  {modalMode === 'create' ? 'Add Brand' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Modal>
    </div>
  );
}
