import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { ArrowRight, Calculator, Plus, Edit, Trash2, Home, Settings, X, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import HeaderAdmin from '@/components/my/Header';

interface Tax {
  id: number;
  nom: string;
  valeur: number;
  type: 'percentage' | 'addition';
}

export default function Taxes() {
  const { user } = useAuth();
  const [taxes, setTaxes] = useState<Tax[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTax, setEditingTax] = useState<Tax | null>(null);
  const [formData, setFormData] = useState({
    nom: '',
    valeur: 0,
    type: 'percentage' as 'percentage' | 'addition'
  });

  // Load taxes on component mount
  useEffect(() => {
    if (!user) {
      window.location.href = '/login'; // Redirect to login if user is not authenticated
      return;
    }
    loadTaxes();
  }, [user]);

  const loadTaxes = async () => {
    try {
      setLoading(true);
      const result = await window.electron.taxes.getAll();
      setTaxes(result || []);
    } catch (error) {
      console.error('Error loading taxes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingTax) {
        await window.electron.taxes.update(editingTax.id, {nom:formData.nom, valeur:formData.valeur, type:formData.type});
      } else {
        await window.electron.taxes.add({nom:formData.nom, valeur:formData.valeur, type:formData.type});
      }
      await loadTaxes();
      closeModal();
    } catch (error) {
      console.error('Error saving tax:', error);
      // For development, simulate success
      if (editingTax) {
        setTaxes(prev => prev.map(tax => 
          tax.id === editingTax.id 
            ? { ...tax, ...formData }
            : tax
        ));
      } else {
        const newTax = {
          id: Date.now(),
          ...formData
        };
        setTaxes(prev => [...prev, newTax]);
      }
      closeModal();
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('هل أنت متأكد من حذف هذه الضريبة؟')) {
      try {
        const res=await window.electron.taxes.delete(id);
        await loadTaxes();
      } catch (error) {
        console.error('Error deleting tax:', error);
        // For development, simulate success
        setTaxes(prev => prev.filter(tax => tax.id !== id));
      }
    }
  };

  const openModal = (tax?: Tax) => {
    if (tax) {
      setEditingTax(tax);
      setFormData({
        nom: tax.nom,
        valeur: tax.valeur,
        type: tax.type
      });
    } else {
      setEditingTax(null);
      setFormData({
        nom: '',
        valeur: 0,
        type: 'percentage'
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingTax(null);
    setFormData({
      nom: '',
      valeur: 0,
      type: 'percentage'
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
       subtitle='إدارة أنواع الضرائب والمعدلات'
       ></HeaderAdmin>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white">
              <Calculator size={24} />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">إدارة الضرائب</h2>
              <p className="text-gray-600">إضافة وتعديل وحذف أنواع الضرائب المختلفة</p>
            </div>
          </div>
          
          <Button 
            onClick={() => openModal()}
            className="flex items-center space-x-2 rtl:space-x-reverse bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
          >
            <Plus size={18} />
            <span>إضافة ضريبة جديدة</span>
          </Button>
        </div>

        {/* Taxes Grid */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {taxes.map((tax) => (
              <div key={tax.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${
                      tax.type === 'percentage' 
                        ? 'bg-gradient-to-r from-green-500 to-green-600' 
                        : 'bg-gradient-to-r from-orange-500 to-orange-600'
                    }`}>
                      <Calculator size={20} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{tax.nom}</h3>
                      <p className="text-sm text-gray-500">
                        {tax.type === 'percentage' ? 'نسبة مئوية' : 'قيمة ثابتة'}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="text-2xl font-bold text-gray-900">
                    {tax.valeur}{tax.type === 'percentage' ? '%' : ' ₪'}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openModal(tax)}
                    className="flex items-center space-x-1 rtl:space-x-reverse flex-1"
                  >
                    <Edit size={14} />
                    <span>تعديل</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(tax.id)}
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

        {taxes.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calculator size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد ضرائب</h3>
            <p className="text-gray-500 mb-4">ابدأ بإضافة أول ضريبة للنظام</p>
            <Button onClick={() => openModal()}>
              إضافة ضريبة جديدة
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
                {editingTax ? 'تعديل الضريبة' : 'إضافة ضريبة جديدة'}
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
                  اسم الضريبة
                </label>
                <input
                  type="text"
                  value={formData.nom}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="مثال: ضريبة القيمة المضافة"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  القيمة
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.valeur}
                  onChange={(e) => setFormData({ ...formData, valeur: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="16"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  نوع الضريبة
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as 'percentage' | 'addition' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="percentage">نسبة مئوية (%)</option>
                  <option value="addition">قيمة ثابتة (₪)</option>
                </select>
              </div>

              <div className="flex items-center space-x-3 rtl:space-x-reverse pt-4">
                <Button
                  type="submit"
                  className="flex items-center space-x-2 rtl:space-x-reverse flex-1"
                >
                  <Check size={16} />
                  <span>{editingTax ? 'تحديث' : 'إضافة'}</span>
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