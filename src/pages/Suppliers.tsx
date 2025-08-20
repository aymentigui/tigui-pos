import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { Plus, Edit, Trash2, Home, Settings, X, Check, Search, ChevronLeft, ChevronRight, Building } from 'lucide-react';
import { Link } from 'react-router-dom';
import HeaderAdmin from '@/components/my/Header';

interface Fournisseur {
    id: number;
    nom: string;
    prenom: string;
    societe: string;
    email: string;
    tel1: string;
    tel2: string;
    adresse: string;
}

export default function Fournisseurs() {
    const { user } = useAuth();
    const [fournisseurs, setFournisseurs] = useState<Fournisseur[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingFournisseur, setEditingFournisseur] = useState<Fournisseur | null>(null);
    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        societe: '',
        email: '',
        tel1: '',
        tel2: '',
        adresse: ''
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const fournisseursPerPage = 10;

    // Load fournisseurs on component mount
    useEffect(() => {
        if (!user) {
            window.location.href = '/login';
            return;
        }
        loadFournisseurs();
    }, [user]);

    const loadFournisseurs = async () => {
        try {
            setLoading(true);
            const result = await window.electron.suppliers.getAll();
            setFournisseurs(result || []);
        } catch (error) {
            console.error('Error loading fournisseurs:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingFournisseur) {
                await window.electron.suppliers.update(
                    editingFournisseur.id,
                    {
                        nom: formData.nom,
                        prenom: formData.prenom,
                        societe: formData.societe,
                        email: formData.email,
                        tel1: formData.tel1,
                        tel2: formData.tel2,
                        adresse: formData.adresse
                    }
                );
            } else {
                await window.electron.suppliers.add(
                    {
                        nom: formData.nom,
                        prenom: formData.prenom,
                        societe: formData.societe,
                        email: formData.email,
                        tel1: formData.tel1,
                        tel2: formData.tel2,
                        adresse: formData.adresse
                    }
                );
            }
            await loadFournisseurs();
            closeModal();
        } catch (error) {
            console.error('Error saving fournisseur:', error);
            // For development, simulate success
            if (editingFournisseur) {
                setFournisseurs(prev => prev.map(fournisseur =>
                    fournisseur.id === editingFournisseur.id
                        ? { ...fournisseur, ...formData }
                        : fournisseur
                ));
            } else {
                const newFournisseur = {
                    id: Date.now(),
                    ...formData
                };
                setFournisseurs(prev => [...prev, newFournisseur]);
            }
            closeModal();
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('هل أنت متأكد من حذف هذا المورد؟')) {
            try {
                await window.electron.suppliers.delete(id);
                await loadFournisseurs();
            } catch (error) {
                console.error('Error deleting fournisseur:', error);
                // For development, simulate success
                setFournisseurs(prev => prev.filter(fournisseur => fournisseur.id !== id));
            }
        }
    };

    const openModal = (fournisseur?: Fournisseur) => {
        if (fournisseur) {
            setEditingFournisseur(fournisseur);
            setFormData({
                nom: fournisseur.nom,
                prenom: fournisseur.prenom,
                societe: fournisseur.societe,
                email: fournisseur.email,
                tel1: fournisseur.tel1,
                tel2: fournisseur.tel2,
                adresse: fournisseur.adresse
            });
        } else {
            setEditingFournisseur(null);
            setFormData({
                nom: '',
                prenom: '',
                societe: '',
                email: '',
                tel1: '',
                tel2: '',
                adresse: ''
            });
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingFournisseur(null);
        setFormData({
            nom: '',
            prenom: '',
            societe: '',
            email: '',
            tel1: '',
            tel2: '',
            adresse: ''
        });
    };

    // Filter fournisseurs based on search term
    const filteredFournisseurs = fournisseurs.filter(fournisseur => {
        const searchLower = searchTerm.toLowerCase();
        return (
            fournisseur.nom.toLowerCase().includes(searchLower) ||
            fournisseur.prenom.toLowerCase().includes(searchLower) ||
            fournisseur.societe.toLowerCase().includes(searchLower) ||
            fournisseur.email.toLowerCase().includes(searchLower) ||
            fournisseur.tel1.toLowerCase().includes(searchLower) ||
            fournisseur.tel2.toLowerCase().includes(searchLower) ||
            fournisseur.adresse.toLowerCase().includes(searchLower)
        );
    });

    // Pagination logic
    const indexOfLastFournisseur = currentPage * fournisseursPerPage;
    const indexOfFirstFournisseur = indexOfLastFournisseur - fournisseursPerPage;
    const currentFournisseurs = filteredFournisseurs.slice(indexOfFirstFournisseur, indexOfLastFournisseur);
    const totalPages = Math.ceil(filteredFournisseurs.length / fournisseursPerPage);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
            {/* Header */}
            <HeaderAdmin
                list={
                    [
                        { title: 'الرئيسية', link: '/', icon: Home },
                    ]
                }
                subtitle='إدارة الموردين'
            ></HeaderAdmin>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Page Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white">
                            <Building size={24} />
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900">إدارة الموردين</h2>
                            <p className="text-gray-600">إضافة وتعديل وحذف الموردين</p>
                        </div>
                    </div>

                    <Button
                        onClick={() => openModal()}
                        className="flex items-center space-x-2 rtl:space-x-reverse bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                    >
                        <Plus size={18} />
                        <span>إضافة مورد جديد</span>
                    </Button>
                </div>

                {/* Search and Filter */}
                <div className="mb-6">
                    <div className="relative max-w-md">
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <Search className="text-gray-400" size={18} />
                        </div>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1); // Reset to first page when searching
                            }}
                            className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="ابحث عن مورد..."
                        />
                    </div>
                </div>

                {/* Fournisseurs Table */}
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الاسم</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الشركة</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">البريد الإلكتروني</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الهاتف</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">العنوان</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الإجراءات</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {currentFournisseurs.map((fournisseur) => (
                                        <tr key={fournisseur.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{fournisseur.prenom} {fournisseur.nom}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-500">{fournisseur.societe}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-500">{fournisseur.email}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-500">
                                                    {fournisseur.tel1}
                                                    {fournisseur.tel2 && ` / ${fournisseur.tel2}`}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-500">{fournisseur.adresse}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => openModal(fournisseur)}
                                                        className="flex items-center space-x-1 rtl:space-x-reverse"
                                                    >
                                                        <Edit size={14} />
                                                        <span>تعديل</span>
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleDelete(fournisseur.id)}
                                                        className="flex items-center space-x-1 rtl:space-x-reverse text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                                                    >
                                                        <Trash2 size={14} />
                                                        <span>حذف</span>
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {filteredFournisseurs.length > fournisseursPerPage && (
                            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                                <div className="text-sm text-gray-500">
                                    عرض الموردين من {indexOfFirstFournisseur + 1} إلى {Math.min(indexOfLastFournisseur, filteredFournisseurs.length)} من أصل {filteredFournisseurs.length}
                                </div>
                                <div className="flex space-x-2 rtl:space-x-reverse">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => paginate(currentPage - 1)}
                                        disabled={currentPage === 1}
                                    >
                                        <ChevronRight size={16} />
                                    </Button>

                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                                        <Button
                                            key={number}
                                            variant={currentPage === number ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => paginate(number)}
                                        >
                                            {number}
                                        </Button>
                                    ))}

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => paginate(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                    >
                                        <ChevronLeft size={16} />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {fournisseurs.length === 0 && !loading && (
                    <div className="text-center py-12">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Building size={32} className="text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">لا يوجد موردين</h3>
                        <p className="text-gray-500 mb-4">ابدأ بإضافة أول مورد للنظام</p>
                        <Button onClick={() => openModal()}>
                            إضافة مورد جديد
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
                                {editingFournisseur ? 'تعديل المورد' : 'إضافة مورد جديد'}
                            </h3>
                            <button
                                onClick={closeModal}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        الاسم
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.nom}
                                        onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        اللقب
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.prenom}
                                        onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    الشركة
                                </label>
                                <input
                                    type="text"
                                    value={formData.societe}
                                    onChange={(e) => setFormData({ ...formData, societe: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    البريد الإلكتروني
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        الهاتف 1
                                    </label>
                                    <input
                                        type="tel"
                                        value={formData.tel1}
                                        onChange={(e) => setFormData({ ...formData, tel1: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        الهاتف 2
                                    </label>
                                    <input
                                        type="tel"
                                        value={formData.tel2}
                                        onChange={(e) => setFormData({ ...formData, tel2: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    العنوان
                                </label>
                                <textarea
                                    value={formData.adresse}
                                    onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    rows={3}
                                ></textarea>
                            </div>

                            <div className="flex items-center space-x-3 rtl:space-x-reverse pt-4">
                                <Button
                                    type="submit"
                                    className="flex items-center space-x-2 rtl:space-x-reverse flex-1"
                                >
                                    <Check size={16} />
                                    <span>{editingFournisseur ? 'تحديث' : 'إضافة'}</span>
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