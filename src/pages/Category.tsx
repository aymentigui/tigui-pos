import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { Layers, Plus, Edit, Trash2, Home, Settings, X, Check, ChevronRight, ChevronDown, Folder, FolderOpen } from 'lucide-react';
import HeaderAdmin from '@/components/my/Header';

interface Category {
    id: number;
    nom: string;
    parent_id: number | null;
    parentName?: string;
    children?: Category[];
    level?: number;
}

interface CategoryTreeProps {
    categories: Category[];
    onEdit: (category: Category) => void;
    onDelete: (id: number) => void;
    level?: number;
}

const CategoryTree: React.FC<CategoryTreeProps> = ({ categories, onEdit, onDelete, level = 0 }) => {
    const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set());

    const toggleExpanded = (categoryId: number) => {
        const newExpanded = new Set(expandedCategories);
        if (newExpanded.has(categoryId)) {
            newExpanded.delete(categoryId);
        } else {
            newExpanded.add(categoryId);
        }
        setExpandedCategories(newExpanded);
    };

    return (
        <div className={`space-y-2 ${level > 0 ? 'ml-6 border-l-2 border-gray-100 pl-4' : ''}`}>
            {categories.map((category) => {
                const hasChildren = category.children && category.children.length > 0;
                const isExpanded = expandedCategories.has(category.id);

                return (
                    <div key={category.id} className="group">
                        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3 rtl:space-x-reverse flex-1">
                                    {/* Expand/Collapse button for categories with children */}
                                    {hasChildren ? (
                                        <button
                                            onClick={() => toggleExpanded(category.id)}
                                            className="p-1 hover:bg-gray-100 rounded transition-colors duration-200"
                                        >
                                            {isExpanded ? (
                                                <ChevronDown size={16} className="text-gray-600" />
                                            ) : (
                                                <ChevronRight size={16} className="text-gray-600" />
                                            )}
                                        </button>
                                    ) : (
                                        <div className="w-6 h-6 flex items-center justify-center">
                                            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                                        </div>
                                    )}

                                    {/* Category Icon */}
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white ${
                                        level === 0 
                                            ? 'bg-gradient-to-r from-purple-500 to-purple-600' 
                                            : level === 1
                                            ? 'bg-gradient-to-r from-blue-500 to-blue-600'
                                            : 'bg-gradient-to-r from-green-500 to-green-600'
                                    }`}>
                                        {hasChildren && isExpanded ? (
                                            <FolderOpen size={18} />
                                        ) : hasChildren ? (
                                            <Folder size={18} />
                                        ) : (
                                            <Layers size={18} />
                                        )}
                                    </div>

                                    {/* Category Info */}
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                            <h3 className="text-lg font-semibold text-gray-900">{category.nom}</h3>
                                            <div className="flex items-center space-x-1 rtl:space-x-reverse">
                                                <span className={`px-2 py-1 text-xs rounded-full ${
                                                    level === 0 
                                                        ? 'bg-purple-100 text-purple-700' 
                                                        : level === 1
                                                        ? 'bg-blue-100 text-blue-700'
                                                        : 'bg-green-100 text-green-700'
                                                }`}>
                                                    مستوى {level + 1}
                                                </span>
                                                {hasChildren && (
                                                    <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">
                                                        {category.children!.length} عنصر فرعي
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-500 mt-1">
                                            {level === 0 ? 'فئة رئيسية' : `فئة فرعية - مستوى ${level + 1}`}
                                        </p>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center space-x-2 rtl:space-x-reverse opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => onEdit(category)}
                                        className="flex items-center space-x-1 rtl:space-x-reverse"
                                    >
                                        <Edit size={14} />
                                        <span>تعديل</span>
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => onDelete(category.id)}
                                        className="flex items-center space-x-1 rtl:space-x-reverse text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                                    >
                                        <Trash2 size={14} />
                                        <span>حذف</span>
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Render children */}
                        {hasChildren && isExpanded && (
                            <div className="mt-2">
                                <CategoryTree
                                    categories={category.children!}
                                    onEdit={onEdit}
                                    onDelete={onDelete}
                                    level={level + 1}
                                />
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default function Categories() {
    const { user } = useAuth();
    const [categories, setCategories] = useState<Category[]>([]);
    const [hierarchicalCategories, setHierarchicalCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [formData, setFormData] = useState({
        nom: '',
        parent_id: null as number | null
    });

    // Build hierarchical structure from flat array
    const buildHierarchy = (categories: Category[]): Category[] => {
        const categoryMap = new Map<number, Category>();
        const rootCategories: Category[] = [];

        // Create a map of all categories
        categories.forEach(cat => {
            categoryMap.set(cat.id, { ...cat, children: [] });
        });

        // Build the hierarchy
        categories.forEach(cat => {
            const category = categoryMap.get(cat.id)!;
            
            if (cat.parent_id === null) {
                // Root category
                rootCategories.push(category);
            } else {
                // Child category
                const parent = categoryMap.get(cat.parent_id);
                if (parent) {
                    parent.children!.push(category);
                }
            }
        });

        return rootCategories;
    };

    // Get all categories for parent selection (flattened with proper indentation)
    const getFlatCategoriesForSelect = (categories: Category[], level = 0): Array<{id: number, nom: string, level: number}> => {
        let result: Array<{id: number, nom: string, level: number}> = [];
        
        categories.forEach(cat => {
            result.push({
                id: cat.id,
                nom: cat.nom,
                level
            });
            
            if (cat.children && cat.children.length > 0) {
                result = result.concat(getFlatCategoriesForSelect(cat.children, level + 1));
            }
        });
        
        return result;
    };

    // Load categories on component mount
    useEffect(() => {
        if (!user) {
            window.location.href = '/login';
            return;
        }
        loadCategories();
    }, [user]);

    // Update hierarchical structure when categories change
    useEffect(() => {
        const hierarchy = buildHierarchy(categories);
        setHierarchicalCategories(hierarchy);
    }, [categories]);

    const loadCategories = async () => {
        try {
            setLoading(true);
            const result = await window.electron.categories.getAll();
            // Add parent names to categories for display
            const categoriesWithParentNames = result.map((cat: Category) => ({
                ...cat,
                parentName: result.find((c: Category) => c.id === cat.parent_id)?.nom || null
            }));

            setCategories(categoriesWithParentNames);
        } catch (error) {
            console.error('Error loading categories:', error);
            // For development, use mock data
            const mockCategories = [
                { id: 1, nom: 'إلكترونيات', parent_id: null },
                { id: 2, nom: 'هواتف', parent_id: 1 },
                { id: 3, nom: 'أندرويد', parent_id: 2 },
                { id: 4, nom: 'آيفون', parent_id: 2 },
                { id: 5, nom: 'حاسوب', parent_id: 1 },
                { id: 6, nom: 'لابتوب', parent_id: 5 },
                { id: 7, nom: 'ملابس', parent_id: null },
                { id: 8, nom: 'رجالي', parent_id: 7 },
                { id: 9, nom: 'قمصان', parent_id: 8 }
            ];
            setCategories(mockCategories);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingCategory) {
                await window.electron.categories.update(
                    editingCategory.id,
                    {
                        nom: formData.nom,
                        parentId: formData.parent_id
                    }
                );
            } else {
                await window.electron.categories.add(
                    {
                        nom: formData.nom,
                        parentId: formData.parent_id
                    }
                );
            }
            await loadCategories();
            closeModal();
        } catch (error) {
            console.error('Error saving category:', error);
            // For development, simulate success
            if (editingCategory) {
                setCategories(prev => prev.map(cat =>
                    cat.id === editingCategory.id
                        ? { ...cat, ...formData }
                        : cat
                ));
            } else {
                const newCategory = {
                    id: Date.now(),
                    ...formData
                };
                setCategories(prev => [...prev, newCategory]);
            }
            closeModal();
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('هل أنت متأكد من حذف هذه الفئة؟ سيتم حذف جميع الفئات الفرعية أيضاً.')) {
            try {
                await window.electron.categories.delete(id);
                await loadCategories();
            } catch (error) {
                console.error('Error deleting category:', error);
                // For development, simulate success
                setCategories(prev => prev.filter(cat => cat.id !== id));
            }
        }
    };

    const openModal = (category?: Category) => {
        if (category) {
            setEditingCategory(category);
            setFormData({
                nom: category.nom,
                parent_id: category.parent_id
            });
        } else {
            setEditingCategory(null);
            setFormData({
                nom: '',
                parent_id: null
            });
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingCategory(null);
        setFormData({
            nom: '',
            parent_id: null
        });
    };

    // Get flattened categories for select dropdown
    const flatCategoriesForSelect = getFlatCategoriesForSelect(hierarchicalCategories);

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
                subtitle='إدارة الفئات وتصنيفات المنتجات'
            />

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Page Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-white">
                            <Layers size={24} />
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900">إدارة الفئات</h2>
                            <p className="text-gray-600">إضافة وتعديل وحذف فئات المنتجات بشكل هرمي</p>
                        </div>
                    </div>

                    <Button
                        onClick={() => openModal()}
                        className="flex items-center space-x-2 rtl:space-x-reverse bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
                    >
                        <Plus size={18} />
                        <span>إضافة فئة جديدة</span>
                    </Button>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">إجمالي الفئات</p>
                                <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
                            </div>
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                <Layers size={24} className="text-purple-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">الفئات الرئيسية</p>
                                <p className="text-2xl font-bold text-gray-900">{hierarchicalCategories.length}</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Folder size={24} className="text-blue-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">الفئات الفرعية</p>
                                <p className="text-2xl font-bold text-gray-900">{categories.length - hierarchicalCategories.length}</p>
                            </div>
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                <FolderOpen size={24} className="text-green-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Categories Tree */}
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
                    </div>
                ) : hierarchicalCategories.length > 0 ? (
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-900 mb-6">شجرة الفئات</h3>
                        <CategoryTree
                            categories={hierarchicalCategories}
                            onEdit={openModal}
                            onDelete={handleDelete}
                        />
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Layers size={32} className="text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد فئات</h3>
                        <p className="text-gray-500 mb-4">ابدأ بإضافة أول فئة للنظام</p>
                        <Button onClick={() => openModal()}>
                            إضافة فئة جديدة
                        </Button>
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-gray-900">
                                {editingCategory ? 'تعديل الفئة' : 'إضافة فئة جديدة'}
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
                                    اسم الفئة
                                </label>
                                <input
                                    type="text"
                                    value={formData.nom}
                                    onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    placeholder="مثال: أجهزة إلكترونية"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    الفئة الرئيسية (اختياري)
                                </label>
                                <select
                                    value={formData.parent_id || ''}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        parent_id: e.target.value ? parseInt(e.target.value) : null
                                    })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                >
                                    <option value="">-- بدون فئة رئيسية --</option>
                                    {flatCategoriesForSelect
                                        .filter(cat => !editingCategory || cat.id !== editingCategory.id)
                                        .map(category => (
                                            <option key={category.id} value={category.id}>
                                                {'—'.repeat(category.level * 2)} {category.nom}
                                            </option>
                                        ))}
                                </select>
                                <p className="text-xs text-gray-500 mt-1">
                                    اختر الفئة الرئيسية التي تريد إضافة هذه الفئة تحتها
                                </p>
                            </div>

                            <div className="flex items-center space-x-3 rtl:space-x-reverse pt-4">
                                <Button
                                    type="submit"
                                    className="flex items-center space-x-2 rtl:space-x-reverse flex-1 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
                                >
                                    <Check size={16} />
                                    <span>{editingCategory ? 'تحديث' : 'إضافة'}</span>
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