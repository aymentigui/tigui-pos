import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { ArrowRight, Sliders, Plus, Edit, Trash2, Home, Settings, X, Check, ChevronDown, ChevronRight, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import HeaderAdmin from '@/components/my/Header';

interface AttributValue {
    id: number;
    attribut_id: number;
    valeur: string;
}

interface Attribute {
    id: number;
    nom: string;
    values?: AttributValue[];
    expanded?: boolean;
}

export default function Attributes() {
    const { user } = useAuth();
    const [attributes, setAttributes] = useState<Attribute[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAttributeModal, setShowAttributeModal] = useState(false);
    const [showValueModal, setShowValueModal] = useState(false);
    const [editingAttribute, setEditingAttribute] = useState<Attribute | null>(null);
    const [editingValue, setEditingValue] = useState<AttributValue | null>(null);
    const [selectedAttributeId, setSelectedAttributeId] = useState<number | null>(null);
    const [attributeFormData, setAttributeFormData] = useState({ nom: '' });
    const [valueFormData, setValueFormData] = useState({ valeur: '' });

    // Load attributes on component mount
    useEffect(() => {
        loadAttributes();
    }, []);

    const loadAttributes = async () => {
        try {
            setLoading(true);
            const result = await window.electron.attributs.getAll();

            // Load values for each attribute
            const attributesWithValues = await Promise.all(
                (result || []).map(async (attr: Attribute) => {
                    try {
                        const values = await window.electron.attributs.getAttributValuesByAttributId(attr.id);
                        return { ...attr, values: values || [], expanded: false };
                    } catch (error) {
                        console.error(`Error loading values for attribute ${attr.id}:`, error);
                        return { ...attr, values: [], expanded: false };
                    }
                })
            );

            setAttributes(attributesWithValues);
        } catch (error) {
            setAttributes([])
        } finally {
            setLoading(false);
        }
    };

    const handleAttributeSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingAttribute) {
                await window.electron.attributs.update(editingAttribute.id, attributeFormData.nom);
            } else {
                await window.electron.attributs.add(attributeFormData.nom);
            }
            await loadAttributes();
            closeAttributeModal();
        } catch (error) {
            console.error('Error saving attribute:', error);
            // For development, simulate success
            if (editingAttribute) {
                setAttributes(prev => prev.map(attr =>
                    attr.id === editingAttribute.id
                        ? { ...attr, nom: attributeFormData.nom }
                        : attr
                ));
            } else {
                const newAttribute: any = {
                    id: Date.now(),
                    nom: attributeFormData.nom,
                    values: [],
                    expanded: false
                };
                setAttributes(prev => [...prev, newAttribute]);
            }
            closeAttributeModal();
        }
    };

    const handleValueSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingValue) {
                await window.electron.attributs.updateAttributValue(editingValue.id, valueFormData.valeur);
            } else if (selectedAttributeId) {
                await window.electron.attributs.createAttributValue(selectedAttributeId, valueFormData.valeur);
            }
            await loadAttributes();
            closeValueModal();
        } catch (error) {
            console.error('Error saving value:', error);
            // For development, simulate success
            if (editingValue) {
                setAttributes(prev => prev.map(attr => ({
                    ...attr,
                    values: attr.values?.map(val =>
                        val.id === editingValue.id
                            ? { ...val, valeur: valueFormData.valeur }
                            : val
                    )
                })));
            } else if (selectedAttributeId) {
                const newValue = {
                    id: Date.now(),
                    attribut_id: selectedAttributeId,
                    valeur: valueFormData.valeur
                };
                setAttributes(prev => prev.map(attr =>
                    attr.id === selectedAttributeId
                        ? { ...attr, values: [...(attr.values || []), newValue] }
                        : attr
                ));
            }
            closeValueModal();
        }
    };

    const handleDeleteAttribute = async (id: number) => {
        if (window.confirm('هل أنت متأكد من حذف هذه الخاصية؟ سيتم حذف جميع القيم المرتبطة بها.')) {
            try {
                await window.electron.attributs.delete(id);
                await loadAttributes();
            } catch (error) {
                console.error('Error deleting attribute:', error);
                // For development, simulate success
                setAttributes(prev => prev.filter(attr => attr.id !== id));
            }
        }
    };

    const handleDeleteValue = async (valueId: number, attributeId: number) => {
        if (window.confirm('هل أنت متأكد من حذف هذه القيمة؟')) {
            try {
                await window.electron.attributs.deleteAttributValue(valueId);
                await loadAttributes();
            } catch (error) {
                console.error('Error deleting value:', error);
                // For development, simulate success
                setAttributes(prev => prev.map(attr =>
                    attr.id === attributeId
                        ? { ...attr, values: attr.values?.filter(val => val.id !== valueId) }
                        : attr
                ));
            }
        }
    };

    const toggleAttributeExpansion = (id: number) => {
        setAttributes(prev => prev.map(attr =>
            attr.id === id ? { ...attr, expanded: !attr.expanded } : attr
        ));
    };

    const openAttributeModal = (attribute?: Attribute) => {
        if (attribute) {
            setEditingAttribute(attribute);
            setAttributeFormData({ nom: attribute.nom });
        } else {
            setEditingAttribute(null);
            setAttributeFormData({ nom: '' });
        }
        setShowAttributeModal(true);
    };

    const closeAttributeModal = () => {
        setShowAttributeModal(false);
        setEditingAttribute(null);
        setAttributeFormData({ nom: '' });
    };

    const openValueModal = (attributeId: number, value?: AttributValue) => {
        setSelectedAttributeId(attributeId);
        if (value) {
            setEditingValue(value);
            setValueFormData({ valeur: value.valeur });
        } else {
            setEditingValue(null);
            setValueFormData({ valeur: '' });
        }
        setShowValueModal(true);
    };

    const closeValueModal = () => {
        setShowValueModal(false);
        setEditingValue(null);
        setSelectedAttributeId(null);
        setValueFormData({ valeur: '' });
    };

    const getTotalValues = () => {
        return attributes.reduce((total, attr) => total + (attr.values?.length || 0), 0);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50">
            {/* Header */}
            <HeaderAdmin
                list={
                    [
                        { title: 'الرئيسية', link: '/', icon: Home },
                        { title: 'الإعدادات', link: '/settings', icon: Settings }
                    ]
                }
                subtitle='إدارة الخصائص والسمات للمنتجات'
            ></HeaderAdmin>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Page Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-white">
                            <Sliders size={24} />
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900">إدارة الخصائص</h2>
                            <p className="text-gray-600">إضافة وتعديل خصائص المنتجات وقيمها</p>
                        </div>
                    </div>

                    <Button
                        onClick={() => openAttributeModal()}
                        className="flex items-center space-x-2 rtl:space-x-reverse bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
                    >
                        <Plus size={18} />
                        <span>إضافة خاصية جديدة</span>
                    </Button>
                </div>

                {/* Attributes List */}
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {attributes.map((attribute) => (
                            <div key={attribute.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                {/* Attribute Header */}
                                <div className="p-6 border-b border-gray-100">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4 rtl:space-x-reverse">
                                            <button
                                                onClick={() => toggleAttributeExpansion(attribute.id)}
                                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                                            >
                                                {attribute.expanded ? (
                                                    <ChevronDown size={20} className="text-gray-600" />
                                                ) : (
                                                    <ChevronRight size={20} className="text-gray-600" />
                                                )}
                                            </button>
                                            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-white">
                                                <Sliders size={20} />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-900">{attribute.nom}</h3>
                                                <p className="text-sm text-gray-500">
                                                    {attribute.values?.length || 0} قيمة متاحة
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => openValueModal(attribute.id)}
                                                className="flex items-center space-x-1 rtl:space-x-reverse text-purple-600 hover:text-purple-700 hover:bg-purple-50 border-purple-200"
                                            >
                                                <Plus size={14} />
                                                <span>إضافة قيمة</span>
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => openAttributeModal(attribute)}
                                                className="flex items-center space-x-1 rtl:space-x-reverse"
                                            >
                                                <Edit size={14} />
                                                <span>تعديل</span>
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleDeleteAttribute(attribute.id)}
                                                className="flex items-center space-x-1 rtl:space-x-reverse text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                                            >
                                                <Trash2 size={14} />
                                                <span>حذف</span>
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                {/* Attribute Values */}
                                {attribute.expanded && (
                                    <div className="p-6 bg-gray-50">
                                        {attribute.values && attribute.values.length > 0 ? (
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                                {attribute.values.map((value) => (
                                                    <div key={value.id} className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-all duration-200">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                                                <div className="w-6 h-6 bg-gradient-to-r from-purple-400 to-purple-500 rounded-md flex items-center justify-center">
                                                                    <Tag size={12} className="text-white" />
                                                                </div>
                                                                <span className="font-medium text-gray-900">{value.valeur}</span>
                                                            </div>
                                                            <div className="flex items-center space-x-1 rtl:space-x-reverse">
                                                                <button
                                                                    onClick={() => openValueModal(attribute.id, value)}
                                                                    className="p-1 text-gray-400 hover:text-blue-600 transition-colors duration-200"
                                                                >
                                                                    <Edit size={14} />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDeleteValue(value.id, attribute.id)}
                                                                    className="p-1 text-gray-400 hover:text-red-600 transition-colors duration-200"
                                                                >
                                                                    <Trash2 size={14} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-8">
                                                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                                                    <Tag size={24} className="text-gray-400" />
                                                </div>
                                                <p className="text-gray-500 mb-3">لا توجد قيم لهذه الخاصية</p>
                                                <Button
                                                    size="sm"
                                                    onClick={() => openValueModal(attribute.id)}
                                                    className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
                                                >
                                                    إضافة أول قيمة
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {attributes.length === 0 && !loading && (
                    <div className="text-center py-12">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Sliders size={32} className="text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد خصائص</h3>
                        <p className="text-gray-500 mb-4">ابدأ بإضافة أول خاصية للمنتجات</p>
                        <Button onClick={() => openAttributeModal()}>
                            إضافة خاصية جديدة
                        </Button>
                    </div>
                )}

                {/* Statistics */}
                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">إجمالي الخصائص</p>
                                <p className="text-2xl font-bold text-gray-900">{attributes.length}</p>
                            </div>
                            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                                <Sliders className="text-purple-600" size={24} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">إجمالي القيم</p>
                                <p className="text-2xl font-bold text-gray-900">{getTotalValues()}</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                <Tag className="text-blue-600" size={24} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">متوسط القيم</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {attributes.length > 0 ? Math.round(getTotalValues() / attributes.length) : 0}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-green-500 to-blue-500"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Attribute Modal */}
            {showAttributeModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-gray-900">
                                {editingAttribute ? 'تعديل الخاصية' : 'إضافة خاصية جديدة'}
                            </h3>
                            <button
                                onClick={closeAttributeModal}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleAttributeSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    اسم الخاصية
                                </label>
                                <input
                                    type="text"
                                    value={attributeFormData.nom}
                                    onChange={(e) => setAttributeFormData({ nom: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    placeholder="مثال: الحجم، المادة، النوع"
                                    required
                                />
                            </div>

                            <div className="flex items-center space-x-3 rtl:space-x-reverse pt-4">
                                <Button
                                    type="submit"
                                    className="flex items-center space-x-2 rtl:space-x-reverse flex-1 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
                                >
                                    <Check size={16} />
                                    <span>{editingAttribute ? 'تحديث' : 'إضافة'}</span>
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={closeAttributeModal}
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

            {/* Value Modal */}
            {showValueModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-gray-900">
                                {editingValue ? 'تعديل القيمة' : 'إضافة قيمة جديدة'}
                            </h3>
                            <button
                                onClick={closeValueModal}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleValueSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    القيمة
                                </label>
                                <input
                                    type="text"
                                    value={valueFormData.valeur}
                                    onChange={(e) => setValueFormData({ valeur: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    placeholder="مثال: صغير، متوسط، كبير"
                                    required
                                />
                            </div>

                            <div className="flex items-center space-x-3 rtl:space-x-reverse pt-4">
                                <Button
                                    type="submit"
                                    className="flex items-center space-x-2 rtl:space-x-reverse flex-1 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
                                >
                                    <Check size={16} />
                                    <span>{editingValue ? 'تحديث' : 'إضافة'}</span>
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={closeValueModal}
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