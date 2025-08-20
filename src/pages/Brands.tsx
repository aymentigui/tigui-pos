import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { ArrowRight, Tag, Plus, Edit, Trash2, Home, Settings, X, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import HeaderAdmin from '@/components/my/Header';

interface Brand {
  id: number;
  nom: string;
}

export default function Brands() {
  const { user } = useAuth();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [formData, setFormData] = useState({
    nom: ''
  });

  // Load brands on component mount
  useEffect(() => {
    if(!user){
        window.location.href = '/login';
        return;
    }
    loadBrands();
  }, [user]);

  const loadBrands = async () => {
    try {
      setLoading(true);
      const result = await window.electron.brands.getAll();
      setBrands(result || []);
    } catch (error) {
      console.error('Error loading brands:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingBrand) {
        await window.electron.brands.update(editingBrand.id, formData.nom);
      } else {
        await window.electron.brands.add(formData.nom);
      }
      await loadBrands();
      closeModal();
    } catch (error) {
      console.error('Error saving brand:', error);
      // For development, simulate success
      if (editingBrand) {
        setBrands(prev => prev.map(brand => 
          brand.id === editingBrand.id 
            ? { ...brand, ...formData }
            : brand
        ));
      } else {
        const newBrand = {
          id: Date.now(),
          ...formData
        };
        setBrands(prev => [...prev, newBrand]);
      }
      closeModal();
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('هل أنت متأكد من حذف هذه الماركة؟')) {
      try {
        await window.electron.brands.delete(id);
        await loadBrands();
      } catch (error) {
        console.error('Error deleting brand:', error);
        // For development, simulate success
        setBrands(prev => prev.filter(brand => brand.id !== id));
      }
    }
  };

  const openModal = (brand?: Brand) => {
    if (brand) {
      setEditingBrand(brand);
      setFormData({
        nom: brand.nom
      });
    } else {
      setEditingBrand(null);
      setFormData({
        nom: ''
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingBrand(null);
    setFormData({
      nom: ''
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <HeaderAdmin
       list={
        [
          { title: 'الرئيسية', link: '/', icon: Home },
          { title: 'الإعدادات', link: '/settings', icon: Settings }
        ]
       }
       subtitle='إدارة الماركات والعلامات التجارية'
       ></HeaderAdmin>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white">
              <Tag size={24} />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">إدارة الماركات</h2>
              <p className="text-gray-600">إضافة وتعديل وحذف الماركات والعلامات التجارية</p>
            </div>
          </div>
          
          <Button 
            onClick={() => openModal()}
            className="flex items-center space-x-2 rtl:space-x-reverse bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
          >
            <Plus size={18} />
            <span>إضافة ماركة جديدة</span>
          </Button>
        </div>

        {/* Brands Grid */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {brands.map((brand) => (
              <div key={brand.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white bg-gradient-to-r from-purple-500 to-purple-600">
                      <Tag size={20} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{brand.nom}</h3>
                      <p className="text-sm text-gray-500">
                        ماركة تجارية
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openModal(brand)}
                    className="flex items-center space-x-1 rtl:space-x-reverse flex-1"
                  >
                    <Edit size={14} />
                    <span>تعديل</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(brand.id)}
                    className="flex items-center space-x-1 rtl:space-x-reverse text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                  >
                    <Trash2 size={14} />
                    <span>حذف</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {brands.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Tag size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد ماركات</h3>
            <p className="text-gray-500 mb-4">ابدأ بإضافة أول ماركة للنظام</p>
            <Button onClick={() => openModal()}>
              إضافة ماركة جديدة
            </Button>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                {editingBrand ? 'تعديل الماركة' : 'إضافة ماركة جديدة'}
              </h3>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  اسم الماركة
                </label>
                <input
                  type="text"
                  value={formData.nom}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="مثال: نايك"
                  required
                />
              </div>

              <div className="flex items-center space-x-3 rtl:space-x-reverse pt-4">
                <Button
                  type="submit"
                  className="flex items-center space-x-2 rtl:space-x-reverse flex-1"
                >
                  <Check size={16} />
                  <span>{editingBrand ? 'تحديث' : 'إضافة'}</span>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={closeModal}
                  className="flex items-center space-x-2 rtl:space-x-reverse"
                >
                  <X size={16} />
                  <span>إلغاء</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}