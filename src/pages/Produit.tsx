import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { Plus, Edit, Trash2, Home, Settings, X, Check, Search, ChevronLeft, ChevronRight, Package, Grid, List, Hash, Palette, Tag, Image as ImageIcon, DollarSign, BarChart, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';
import HeaderAdmin from '@/components/my/Header';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';


interface Produit {
    id: number;
    nom: string;
    code_barre: string;
    type: 'simple' | 'variable';
    prix_achat: number;
    prix_achat_ttc: number;
    prix_vente: number;
    quantite_stock: number;
    image: string;
    actif: number;
    categories: any[];
    brands: any[];
    taxes: any[];
    variations: Variation[];
}

interface Variation {
    id?: number;
    nom: string;
    prix_achat: number;
    prix_achat_ttc: number;
    prix_vente: number;
    code_barre: string;
    quantite_stock: number;
    image: string;
    actif: number;
    taxes: any[];
    attributs: any[];
    couleurs: any[];
}

interface Categorie {
    id: number;
    nom: string;
}

interface Brand {
    id: number;
    nom: string;
}

interface Taxe {
    id: number;
    nom: string;
    taux: number;
}

interface Couleur {
    id: number;
    nom: string;
    valeur: string;
}

interface Attribut {
    id: number;
    nom: string;
    valeurs: AttributValeur[];
}

interface AttributValeur {
    id: number;
    valeur: string;
}

export default function Produits() {
    const { user } = useAuth();
    const [produits, setProduits] = useState<Produit[]>([]);
    const [categories, setCategories] = useState<Categorie[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]);
    const [taxes, setTaxes] = useState<Taxe[]>([]);
    const [couleurs, setCouleurs] = useState<Couleur[]>([]);
    const [attributs, setAttributs] = useState<Attribut[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingProduit, setEditingProduit] = useState<Produit | null>(null);
    const [formData, setFormData] = useState({
        nom: '',
        code_barre: '',
        type: 'simple' as 'simple' | 'variable',
        prix_achat: 0,
        prix_achat_ttc: 0,
        prix_vente: 0,
        quantite_stock: 0,
        image: '',
        actif: 1,
        categories: [] as number[],
        brands: [] as number[],
        taxes: [] as number[],
    });
    const [selectedCouleurs, setSelectedCouleurs] = useState<number[]>([]);
    const [selectedAttributs, setSelectedAttributs] = useState<{ [key: number]: number[] }>({});
    const [variations, setVariations] = useState<Variation[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const produitsPerPage = 10;
    const [activeTab, setActiveTab] = useState('general');
    const animatedComponents = makeAnimated();

    // Options pour les sélecteurs
    const categoryOptions = categories.map(cat => ({
        value: cat.id,
        label: cat.nom
    }));

    const brandOptions = brands.map(brand => ({
        value: brand.id,
        label: brand.nom
    }));

    const taxOptions = taxes.map(tax => ({
        value: tax.id,
        label: `${tax.nom} (${tax.taux}%)`
    }));

    const colorOptions = couleurs.map(c => ({
        value: c.id,
        label: c.nom,
        color: c.valeur
    }));

    // Load data on component mount
    useEffect(() => {
        if (!user) {
            window.location.href = '/login';
            return;
        }
        loadData();
    }, [user]);

    const loadData = async () => {
        try {
            setLoading(true);
            const [
                produitsData,
                categoriesData,
                brandsData,
                taxesData,
                couleursData,
                attributsData
            ] = await Promise.all([
                window.electron.products.getAll(),
                window.electron.categories.getAll(),
                window.electron.brands.getAll(),
                window.electron.taxes.getAll(),
                window.electron.couleurs.getAll(),
                window.electron.attributs.getAll()
            ]);

            setProduits(produitsData || []);
            setCategories(categoriesData || []);
            setBrands(brandsData || []);
            setTaxes(taxesData || []);
            setCouleurs(couleursData || []);

            // Charger les valeurs pour chaque attribut
            const attributsAvecValeurs = await Promise.all(
                (attributsData || []).map(async (attr: any) => {
                    const valeurs = await window.electron.attributs.getAttributValuesByAttributId(attr.id);
                    return { ...attr, valeurs: valeurs || [] };
                })
            );

            setAttributs(attributsAvecValeurs);
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const produitData = {
                ...formData,
                variations: formData.type === 'variable' ? variations : []
            };

            if (editingProduit) {
                await window.electron.products.update(editingProduit.id, produitData);
            } else {
                await window.electron.products.add(produitData);
            }
            await loadData();
            closeModal();
        } catch (error) {
            console.error('Error saving product:', error);
            closeModal();
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
            try {
                await window.electron.products.delete(id);
                await loadData();
            } catch (error) {
                console.error('Error deleting product:', error);
            }
        }
    };

    const openModal = async (produit?: Produit) => {
        if (produit) {
            setEditingProduit(produit);
            const taxes= await window.electron.products.getAllTaxesByProductId(produit.id);
            const brands = await window.electron.products.getAllBrandsByProductId(produit.id);
            const categories = await window.electron.products.getAllCategoriesByProductId(produit.id);
            setFormData({
                nom: produit.nom,
                code_barre: produit.code_barre,
                type: produit.type,
                prix_achat: produit.prix_achat,
                prix_achat_ttc: produit.prix_achat_ttc,
                prix_vente: produit.prix_vente,
                quantite_stock: produit.quantite_stock,
                image: produit.image,
                actif: produit.actif,
                categories: categories.map((c:any)=>c.categorie_id) || [],
                brands: brands.map((b:any)=>b.brand_id) || [],
                taxes: taxes.map((t:any)=>t.tax_id) || [],
            });
            const variations = await window.electron.products.getAllVariationsByProductId(produit.id);
            setVariations(variations || []);
        } else {
            setEditingProduit(null);
            setFormData({
                nom: '',
                code_barre: '',
                type: 'simple',
                prix_achat: 0,
                prix_achat_ttc: 0,
                prix_vente: 0,
                quantite_stock: 0,
                image: '',
                actif: 1,
                categories: [],
                brands: [],
                taxes: [],
            });
            setVariations([]);
            setSelectedCouleurs([]);
            setSelectedAttributs({});
        }
        setActiveTab('general');
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingProduit(null);
        setFormData({
            nom: '',
            code_barre: '',
            type: 'simple',
            prix_achat: 0,
            prix_achat_ttc: 0,
            prix_vente: 0,
            quantite_stock: 0,
            image: '',
            actif: 1,
            categories: [],
            brands: [],
            taxes: [],
        });
        setVariations([]);
        setSelectedCouleurs([]);
        setSelectedAttributs({});
    };

    const handleAttributChange = (attributId: number, valeurIds: number[]) => {
        setSelectedAttributs(prev => ({
            ...prev,
            [attributId]: valeurIds
        }));
    };

    const generateVariations = () => {
        // Générer les combinaisons d'attributs et couleurs
        const newVariations: Variation[] = [];

        // Récupérer toutes les valeurs d'attributs sélectionnées
        const attributValues: { [key: number]: any[] } = {};

        Object.keys(selectedAttributs).forEach(attributId => {
            const id = parseInt(attributId);
            attributValues[id] = selectedAttributs[id].map(vId => {
                const attr = attributs.find(a => a.id === id);
                return attr?.valeurs.find(v => v.id === vId);
            }).filter(Boolean);
        });

        // Fonction récursive pour générer toutes les combinaisons
        const generateCombinations = (current: any[], index: number, keys: number[]) => {
            if (index === keys.length) {
                // Ajouter les combinaisons avec les couleurs
                if (selectedCouleurs.length > 0) {
                    selectedCouleurs.forEach(couleurId => {
                        const couleur = couleurs.find(c => c.id === couleurId);
                        const variationName = [
                            ...current.map((v, i) => {
                                const attr = attributs.find(a => a.id === keys[i]);
                                return `${attr?.nom}: ${v.valeur}`;
                            }),
                            couleur ? `Couleur: ${couleur.nom}` : ''
                        ].filter(Boolean).join(', ');

                        newVariations.push({
                            nom: variationName,
                            prix_achat: formData.prix_achat,
                            prix_achat_ttc: formData.prix_achat_ttc,
                            prix_vente: formData.prix_vente,
                            code_barre: formData.code_barre,
                            quantite_stock: 0,
                            image: '',
                            actif: 1,
                            taxes: [],
                            attributs: current.map((v, i) => ({ id: keys[i], valeurId: v.id })),
                            couleurs: couleurId ? [couleurId] : []
                        });
                    });
                } else {
                    const variationName = current.map((v, i) => {
                        const attr = attributs.find(a => a.id === keys[i]);
                        return `${attr?.nom}: ${v.valeur}`;
                    }).join(', ');

                    newVariations.push({
                        nom: variationName,
                        prix_achat: formData.prix_achat,
                        prix_achat_ttc: formData.prix_achat_ttc,
                        prix_vente: formData.prix_vente,
                        code_barre: formData.code_barre,
                        quantite_stock: 0,
                        image: '',
                        actif: 1,
                        taxes: [],
                        attributs: current.map((v, i) => ({ id: keys[i], valeurId: v.id })),
                        couleurs: []
                    });
                }
                return;
            }

            const currentKey = keys[index];
            attributValues[currentKey].forEach(value => {
                generateCombinations([...current, value], index + 1, keys);
            });
        };

        const keys = Object.keys(selectedAttributs).map(id => parseInt(id));
        if (keys.length > 0) {
            generateCombinations([], 0, keys);
        } else if (selectedCouleurs.length > 0) {
            // Seulement des couleurs
            selectedCouleurs.forEach(couleurId => {
                const couleur = couleurs.find(c => c.id === couleurId);
                newVariations.push({
                    nom: `Couleur: ${couleur?.nom}`,
                    prix_achat: formData.prix_achat,
                    prix_achat_ttc: formData.prix_achat_ttc,
                    prix_vente: formData.prix_vente,
                    code_barre: formData.code_barre,
                    quantite_stock: 0,
                    image: '',
                    actif: 1,
                    taxes: [],
                    attributs: [],
                    couleurs: [couleurId]
                });
            });
        }

        setVariations([...variations, ...newVariations]);
    };

    const addManualVariation = () => {
        setVariations([...variations, {
            nom: 'Variation manuelle',
            prix_achat: formData.prix_achat,
            prix_achat_ttc: formData.prix_achat_ttc,
            prix_vente: formData.prix_vente,
            code_barre: formData.code_barre,
            quantite_stock: 0,
            image: '',
            actif: 1,
            taxes: [],
            attributs: [],
            couleurs: []
        }]);
    };

    const updateVariation = (index: number, field: string, value: any) => {
        const updated = [...variations];
        updated[index] = { ...updated[index], [field]: value };
        setVariations(updated);
    };

    const removeVariation = (index: number) => {
        setVariations(variations.filter((_, i) => i !== index));
    };

    // Filter produits based on search term
    const filteredProduits = produits.filter(produit => {
        const searchLower = searchTerm.toLowerCase();
        return (
            produit.nom.toLowerCase().includes(searchLower) ||
            produit.code_barre.toLowerCase().includes(searchLower)
        );
    });

    // Pagination logic
    const indexOfLastProduit = currentPage * produitsPerPage;
    const indexOfFirstProduit = indexOfLastProduit - produitsPerPage;
    const currentProduits = filteredProduits.slice(indexOfFirstProduit, indexOfLastProduit);
    const totalPages = Math.ceil(filteredProduits.length / produitsPerPage);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    // Custom styles for React Select
    const customSelectStyles = {
        control: (provided: any) => ({
            ...provided,
            minHeight: '42px',
            border: '1px solid #D1D5DB',
            borderRadius: '0.5rem',
            '&:hover': {
                borderColor: '#D1D5DB'
            },
            boxShadow: 'none'
        }),
        multiValue: (provided: any) => ({
            ...provided,
            backgroundColor: '#EFF6FF',
            borderRadius: '0.375rem'
        }),
        multiValueLabel: (provided: any) => ({
            ...provided,
            color: '#1E40AF',
            fontWeight: '500'
        }),
        multiValueRemove: (provided: any) => ({
            ...provided,
            color: '#1E40AF',
            ':hover': {
                backgroundColor: '#DBEAFE',
                color: '#1E3A8A'
            }
        })
    };

    // Fonction pour formater les valeurs sélectionnées
    const getSelectedValues = (ids: number[], options: any[]) => {
        return options.filter(option => ids.includes(option.value));
    };

    // Fonction pour mettre à jour les IDs sélectionnés
    const handleMultiSelectChange = (selectedOptions: any[], field: keyof typeof formData) => {
        const selectedIds = selectedOptions ? selectedOptions.map((option: any) => option.value) : [];
        setFormData({ ...formData, [field]: selectedIds });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
            {/* Header */}
            <HeaderAdmin
                list={
                    [
                        { title: 'الرئيسية', link: '/', icon: Home },
                    ]
                }
                subtitle='إدارة المنتجات'
            ></HeaderAdmin>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Page Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white">
                            <Package size={24} />
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900">إدارة المنتجات</h2>
                            <p className="text-gray-600">إضافة وتعديل وحذف المنتجات</p>
                        </div>
                    </div>

                    <Button
                        onClick={() => openModal()}
                        className="flex items-center space-x-2 rtl:space-x-reverse bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                    >
                        <Plus size={18} />
                        <span>إضافة منتج جديد</span>
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
                                setCurrentPage(1);
                            }}
                            className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="ابحث عن منتج..."
                        />
                    </div>
                </div>

                {/* Products Table */}
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
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الصورة</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الاسم</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">النوع</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">سعر الشراء</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">سعر البيع</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الكمية</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الإجراءات</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {currentProduits.map((produit) => (
                                        <tr key={produit.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {produit.image ? (
                                                    <img src={produit.image} alt={produit.nom} className="w-10 h-10 rounded object-cover" />
                                                ) : (
                                                    <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
                                                        <Package size={16} className="text-gray-500" />
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{produit.nom}</div>
                                                <div className="text-sm text-gray-500">{produit.code_barre}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-500 capitalize">
                                                    {produit.type === 'simple' ? 'بسيط' : 'متغير'}
                                                    {produit.type === 'variable' && (
                                                        <span className="text-xs text-blue-600 mr-1"> ({produit.variations?.length} اختلاف)</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-500">{produit.prix_achat} د.ج</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-500">{produit.prix_vente} د.ج</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-500">{produit.quantite_stock}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => openModal(produit)}
                                                        className="flex items-center space-x-1 rtl:space-x-reverse"
                                                    >
                                                        <Edit size={14} />
                                                        <span>تعديل</span>
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleDelete(produit.id)}
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
                        {filteredProduits.length > produitsPerPage && (
                            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                                <div className="text-sm text-gray-500">
                                    عرض المنتجات من {indexOfFirstProduit + 1} إلى {Math.min(indexOfLastProduit, filteredProduits.length)} من أصل {filteredProduits.length}
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

                {produits.length === 0 && !loading && (
                    <div className="text-center py-12">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Package size={32} className="text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">لا يوجد منتجات</h3>
                        <p className="text-gray-500 mb-4">ابدأ بإضافة أول منتج للنظام</p>
                        <Button onClick={() => openModal()}>
                            إضافة منتج جديد
                        </Button>
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
                    <div className="bg-white rounded-2xl p-0 w-full max-w-4xl my-8 overflow-hidden">
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <h3 className="text-xl font-bold text-gray-900">
                                {editingProduit ? 'تعديل المنتج' : 'إضافة منتج جديد'}
                            </h3>
                            <button
                                onClick={closeModal}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Navigation tabs */}
                        <div className="border-b border-gray-200">
                            <nav className="flex space-x-8 rtl:space-x-reverse px-6">
                                <button
                                    onClick={() => setActiveTab('general')}
                                    className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'general' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                                >
                                    <div className="flex items-center">
                                        <Package size={16} className="ml-1" />
                                        المعلومات العامة
                                    </div>
                                </button>
                                <button
                                    onClick={() => setActiveTab('pricing')}
                                    className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'pricing' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                                >
                                    <div className="flex items-center">
                                        <DollarSign size={16} className="ml-1" />
                                        التسعير والمخزون
                                    </div>
                                </button>
                                <button
                                    onClick={() => setActiveTab('categorization')}
                                    className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'categorization' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                                >
                                    <div className="flex items-center">
                                        <Tag size={16} className="ml-1" />
                                        التصنيف
                                    </div>
                                </button>
                                {formData.type === 'variable' && (
                                    <button
                                        onClick={() => setActiveTab('variations')}
                                        className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'variations' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                                    >
                                        <div className="flex items-center">
                                            <Grid size={16} className="ml-1" />
                                            الاختلافات
                                        </div>
                                    </button>
                                )}
                            </nav>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 max-h-[70vh] overflow-y-auto">
                            {/* General Information Tab */}
                            {activeTab === 'general' && (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                اسم المنتج *
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.nom}
                                                onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                required
                                                placeholder="أدخل اسم المنتج"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                نوع المنتج *
                                            </label>
                                            <div className="grid grid-cols-2 gap-3">
                                                <button
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, type: 'simple' })}
                                                    className={`p-4 border rounded-lg text-center ${formData.type === 'simple' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                                                >
                                                    <Package size={20} className="mx-auto mb-2" />
                                                    <span>منتج بسيط</span>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, type: 'variable' })}
                                                    className={`p-4 border rounded-lg text-center ${formData.type === 'variable' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                                                >
                                                    <Grid size={20} className="mx-auto mb-2" />
                                                    <span>منتج متغير</span>
                                                </button>
                                            </div>
                                        </div>

                                        {formData.type !== 'variable' && (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    رمز الباركود
                                                </label>
                                                <div className="relative">
                                                    <Hash size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                                    <input
                                                        type="text"
                                                        value={formData.code_barre}
                                                        onChange={(e) => setFormData({ ...formData, code_barre: e.target.value })}
                                                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        placeholder="أدخل رمز الباركود"
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                صورة المنتج (رابط)
                                            </label>
                                            <div className="relative">
                                                <ImageIcon size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                                <input
                                                    type="text"
                                                    value={formData.image}
                                                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    placeholder="أدخل رابط الصورة"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                حالة المنتج
                                            </label>
                                            <div className="flex items-center">
                                                <label className="inline-flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.actif === 1}
                                                        onChange={(e) => setFormData({ ...formData, actif: e.target.checked ? 1 : 0 })}
                                                        className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                                    />
                                                    <span className="mr-2">نشط</span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Pricing and Stock Tab */}
                            {activeTab === 'pricing' && (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                سعر الشراء *
                                            </label>
                                            <div className="relative">
                                                <DollarSign size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    value={formData.prix_achat}
                                                    onChange={(e) => setFormData({ ...formData, prix_achat: parseFloat(e.target.value) })}
                                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                سعر البيع *
                                            </label>
                                            <div className="relative">
                                                <DollarSign size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    value={formData.prix_vente}
                                                    onChange={(e) => setFormData({ ...formData, prix_vente: parseFloat(e.target.value) })}
                                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                الكمية في المخزون
                                            </label>
                                            <div className="relative">
                                                <Layers size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={formData.quantite_stock}
                                                    onChange={(e) => setFormData({ ...formData, quantite_stock: parseInt(e.target.value) })}
                                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Categorization Tab */}
                            {activeTab === 'categorization' && (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                الفئات
                                            </label>
                                            <Select
                                                isMulti
                                                options={categoryOptions}
                                                value={getSelectedValues(formData.categories, categoryOptions)}
                                                onChange={(selected: any) => handleMultiSelectChange(selected, 'categories')}
                                                className="basic-multi-select"
                                                classNamePrefix="select"
                                                styles={customSelectStyles}
                                                placeholder="اختر الفئات..."
                                                noOptionsMessage={() => "لا توجد فئات متاحة"}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                الماركات
                                            </label> 
                                            <Select
                                                isMulti
                                                options={brandOptions}
                                                value={getSelectedValues(formData.brands, brandOptions)}
                                                onChange={(selected: any) => handleMultiSelectChange(selected, 'brands')}
                                                className="basic-multi-select"
                                                classNamePrefix="select"
                                                styles={customSelectStyles}
                                                placeholder="اختر الماركات..."
                                                noOptionsMessage={() => "لا توجد ماركات متاحة"}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                الضرائب
                                            </label>
                                            <Select
                                                isMulti
                                                options={taxOptions}
                                                value={getSelectedValues(formData.taxes, taxOptions)}
                                                onChange={(selected: any) => handleMultiSelectChange(selected, 'taxes')}
                                                className="basic-multi-select"
                                                classNamePrefix="select"
                                                styles={customSelectStyles}
                                                placeholder="اختر الضرائب..."
                                                noOptionsMessage={() => "لا توجد ضرائب متاحة"}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Variations Tab */}
                            {activeTab === 'variations' && formData.type === 'variable' && (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                        <div>
                                            <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                                                <Palette size={16} className="ml-1" />
                                                الألوان
                                            </label>
                                            <Select
                                                isMulti
                                                options={colorOptions}
                                                value={getSelectedValues(selectedCouleurs, colorOptions)}
                                                onChange={(selected: any) => setSelectedCouleurs(selected ? selected.map((opt: any) => opt.value) : [])}
                                                className="basic-multi-select"
                                                classNamePrefix="select"
                                                styles={customSelectStyles}
                                                placeholder="اختر الألوان..."
                                                noOptionsMessage={() => "لا توجد ألوان متاحة"}
                                            />
                                        </div>

                                        <div>
                                            <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                                                <Tag size={16} className="ml-1" />
                                                السمات
                                            </label>
                                            {attributs.map(attribut => (
                                                <div key={attribut.id} className="mb-3">
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">{attribut.nom}</label>
                                                    <Select
                                                        isMulti
                                                        options={attribut.valeurs.map(v => ({ value: v.id, label: v.valeur }))}
                                                        value={getSelectedValues(selectedAttributs[attribut.id] || [], attribut.valeurs.map(v => ({ value: v.id, label: v.valeur })))}
                                                        onChange={(selected: any) => handleAttributChange(
                                                            attribut.id,
                                                            selected ? selected.map((opt: any) => opt.value) : []
                                                        )}
                                                        className="basic-multi-select"
                                                        classNamePrefix="select"
                                                        styles={customSelectStyles}
                                                        placeholder={`اختر ${attribut.nom}...`}
                                                        noOptionsMessage={() => "لا توجد قيم متاحة"}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex space-x-3 rtl:space-x-reverse mb-6">
                                        <Button
                                            type="button"
                                            onClick={generateVariations}
                                            className="flex items-center space-x-2 rtl:space-x-reverse"
                                        >
                                            <Plus size={16} />
                                            <span>توليد الاختلافات</span>
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={addManualVariation}
                                            className="flex items-center space-x-2 rtl:space-x-reverse"
                                        >
                                            <Plus size={16} />
                                            <span>إضافة اختلاف يدوي</span>
                                        </Button>
                                    </div>

                                    {variations.length > 0 && (
                                        <div className="border rounded-lg p-4">
                                            <h5 className="text-md font-medium text-gray-900 mb-4">الاختلافات المولدة ({variations.length})</h5>
                                            <div className="space-y-4 max-h-64 overflow-y-auto">
                                                {variations.map((variation, index) => (
                                                    <div key={index} className="border rounded p-3 bg-gray-50">
                                                        <div className="flex justify-between items-start mb-2">
                                                            <input
                                                                type="text"
                                                                value={variation.nom}
                                                                onChange={(e) => updateVariation(index, 'nom', e.target.value)}
                                                                className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                                                                placeholder="اسم الاختلاف"
                                                            />
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => removeVariation(index)}
                                                                className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 mr-2"
                                                            >
                                                                <Trash2 size={14} />
                                                            </Button>
                                                        </div>
                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                                                            <div>
                                                                <label className="block text-xs text-gray-500">الباركود</label>
                                                                <input
                                                                    type="number"
                                                                    value={variation.code_barre}
                                                                    onChange={(e) => updateVariation(index, 'code_barre', e.target.value)}
                                                                    className="w-full px-2 py-1 border border-gray-300 rounded"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="block text-xs text-gray-500">سعر الشراء</label>
                                                                <input
                                                                    type="number"
                                                                    step="0.01"
                                                                    value={variation.prix_achat}
                                                                    onChange={(e) => updateVariation(index, 'prix_achat', parseFloat(e.target.value))}
                                                                    className="w-full px-2 py-1 border border-gray-300 rounded"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="block text-xs text-gray-500">سعر البيع</label>
                                                                <input
                                                                    type="number"
                                                                    step="0.01"
                                                                    value={variation.prix_vente}
                                                                    onChange={(e) => updateVariation(index, 'prix_vente', parseFloat(e.target.value))}
                                                                    className="w-full px-2 py-1 border border-gray-300 rounded"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="block text-xs text-gray-500">الكمية</label>
                                                                <input
                                                                    type="number"
                                                                    value={variation.quantite_stock}
                                                                    onChange={(e) => updateVariation(index, 'quantite_stock', parseInt(e.target.value))}
                                                                    className="w-full px-2 py-1 border border-gray-300 rounded"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="flex justify-between pt-6 border-t border-gray-200 mt-6">
                                <div className="flex space-x-3 rtl:space-x-reverse">
                                    {activeTab !== 'general' && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => {
                                                if (activeTab === 'pricing') setActiveTab('general');
                                                if (activeTab === 'categorization') setActiveTab('pricing');
                                                if (activeTab === 'variations') setActiveTab('categorization');
                                            }}
                                        >
                                            السابق
                                        </Button>
                                    )}
                                    {activeTab !== 'variations' && (
                                        <Button
                                            type="button"
                                            onClick={() => {
                                                if (activeTab === 'general') setActiveTab('pricing');
                                                if (activeTab === 'pricing') setActiveTab('categorization');
                                                if (activeTab === 'categorization' && formData.type === 'variable') setActiveTab('variations');
                                            }}
                                        >
                                            التالي
                                        </Button>
                                    )}
                                </div>
                                <div className="flex space-x-3 rtl:space-x-reverse">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={closeModal}
                                        className="text-gray-600 hover:text-gray-700 hover:bg-gray-50 border-gray-200"
                                    >
                                        إلغاء
                                    </Button>
                                    <Button type="submit" className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white">
                                        {editingProduit ? 'تحديث المنتج' : 'إضافة المنتج'}
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}