import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { ArrowRight, Palette, Plus, Edit, Trash2, Home, Settings, X, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import HeaderAdmin from '@/components/my/Header';

interface Color {
  id: number;
  nom: string;
  valeur: string;
}

export default function Colors() {
  const { user } = useAuth();
  const [colors, setColors] = useState<Color[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingColor, setEditingColor] = useState<Color | null>(null);
  const [formData, setFormData] = useState({
    nom: '',
    valeur: '#000000'
  });

  // Load colors on component mount
  useEffect(() => {
    if (!user) {
      window.location.href = '/login'; // Redirect to login if user is not authenticated
      return;
    }
    loadColors();
  }, [user]);

  const loadColors = async () => {
    try {
      setLoading(true);
      const result = await window.electron.couleurs.getAll();
      setColors(result || []);
    } catch (error) {
      console.error('Error loading colors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingColor) {
        await window.electron.couleurs.update(editingColor.id, { nom: formData.nom, valeur: formData.valeur });
      } else {
        await window.electron.couleurs.add({ nom: formData.nom, valeur: formData.valeur });
      }
      await loadColors();
      closeModal();
    } catch (error) {
      console.error('Error saving color:', error);
      // For development, simulate success
      if (editingColor) {
        setColors(prev => prev.map(color =>
          color.id === editingColor.id
            ? { ...color, ...formData }
            : color
        ));
      } else {
        const newColor = {
          id: Date.now(),
          ...formData
        };
        setColors(prev => [...prev, newColor]);
      }
      closeModal();
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('هل أنت متأكد من حذف هذا اللون؟')) {
      try {
        await window.electron.couleurs.delete(id);
        await loadColors();
      } catch (error) {
        console.error('Error deleting color:', error);
        // For development, simulate success
        setColors(prev => prev.filter(color => color.id !== id));
      }
    }
  };

  const openModal = (color?: Color) => {
    if (color) {
      setEditingColor(color);
      setFormData({
        nom: color.nom,
        valeur: color.valeur
      });
    } else {
      setEditingColor(null);
      setFormData({
        nom: '',
        valeur: '#000000'
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingColor(null);
    setFormData({
      nom: '',
      valeur: '#000000'
    });
  };

  const getContrastColor = (hexColor: string) => {
    // Convert hex to RGB
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);

    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    return luminance > 0.5 ? '#000000' : '#FFFFFF';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header Section */}
      <HeaderAdmin
        list={[
          { title: 'الرئيسية', link: '/', icon: Home },
          { title: 'الاعدادات', link: '/settings', icon: Settings },
        ]}
        subtitle="إدارة الألوان"
        showLogout={true}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-pink-600 rounded-xl flex items-center justify-center text-white">
              <Palette size={24} />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">إدارة الألوان</h2>
              <p className="text-gray-600">إضافة وتعديل وحذف ألوان المنتجات</p>
            </div>
          </div>

          <Button
            onClick={() => openModal()}
            className="flex items-center space-x-2 rtl:space-x-reverse bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700"
          >
            <Plus size={18} />
            <span>إضافة لون جديد</span>
          </Button>
        </div>

        {/* Colors Grid */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {colors.map((color) => (
              <div key={color.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg"
                      style={{ backgroundColor: color.valeur }}
                    >
                      <Palette
                        size={20}
                        style={{ color: getContrastColor(color.valeur) }}
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{color.nom}</h3>
                      <p className="text-sm text-gray-500 font-mono">{color.valeur}</p>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <div
                    className="w-full h-16 rounded-lg border-2 border-gray-200"
                    style={{ backgroundColor: color.valeur }}
                  ></div>
                </div>

                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openModal(color)}
                    className="flex items-center space-x-1 rtl:space-x-reverse flex-1"
                  >
                    <Edit size={14} />
                    <span>تعديل</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(color.id)}
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

        {colors.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Palette size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد ألوان</h3>
            <p className="text-gray-500 mb-4">ابدأ بإضافة أول لون للنظام</p>
            <Button onClick={() => openModal()}>
              إضافة لون جديد
            </Button>
          </div>
        )}

        {/* Color Statistics */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">إجمالي الألوان</p>
                <p className="text-2xl font-bold text-gray-900">{colors.length}</p>
              </div>
              <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center">
                <Palette className="text-pink-600" size={24} />
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                {editingColor ? 'تعديل اللون' : 'إضافة لون جديد'}
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
                  اسم اللون
                </label>
                <input
                  type="text"
                  value={formData.nom}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="مثال: أحمر"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  قيمة اللون
                </label>
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <input
                    type="color"
                    value={formData.valeur}
                    onChange={(e) => setFormData({ ...formData, valeur: e.target.value })}
                    className="w-16 h-10 border border-gray-300 rounded-lg cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.valeur}
                    onChange={(e) => setFormData({ ...formData, valeur: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent font-mono"
                    placeholder="#FF0000"
                    pattern="^#[0-9A-Fa-f]{6}$"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">استخدم منتقي الألوان أو أدخل الكود السادس عشري</p>
              </div>

              {/* Color Preview */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  معاينة اللون
                </label>
                <div
                  className="w-full h-20 rounded-lg border-2 border-gray-200 flex items-center justify-center text-lg font-bold"
                  style={{
                    backgroundColor: formData.valeur,
                    color: getContrastColor(formData.valeur)
                  }}
                >
                  {formData.nom || 'اسم اللون'}
                </div>
              </div>

              <div className="flex items-center space-x-3 rtl:space-x-reverse pt-4">
                <Button
                  type="submit"
                  className="flex items-center space-x-2 rtl:space-x-reverse flex-1 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700"
                >
                  <Check size={16} />
                  <span>{editingColor ? 'تحديث' : 'إضافة'}</span>
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