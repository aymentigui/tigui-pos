import React, { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Settings, Package, Users, Truck, Warehouse, UserCheck, Asterisk as CashRegister, ShoppingCart, Receipt, BarChart3, LogOut, Bell, Search } from 'lucide-react';
import { DashboardCard } from '@/components/my/DashboardCard';
import HeaderAdmin from '@/components/my/Header';

const dashboardItems = [
  {
    title: 'الإعدادات',
    path: '/settings',
    icon: Settings,
    description: 'إدارة إعدادات النظام',
    color: 'bg-gradient-to-r from-blue-500 to-blue-600'
  },
  {
    title: 'المنتجات',
    path: '/products',
    icon: Package,
    description: 'إدارة قائمة المنتجات',
    color: 'bg-gradient-to-r from-green-500 to-green-600'
  },
  {
    title: 'الزبائن',
    path: '/customers',
    icon: Users,
    description: 'إدارة قاعدة بيانات العملاء',
    color: 'bg-gradient-to-r from-purple-500 to-purple-600'
  },
  {
    title: 'الموردين',
    path: '/suppliers',
    icon: Truck,
    description: 'إدارة الموردين والشركاء',
    color: 'bg-gradient-to-r from-orange-500 to-orange-600'
  },
  {
    title: 'المخزن',
    path: '/inventory',
    icon: Warehouse,
    description: 'مراقبة المخزون والكميات',
    color: 'bg-gradient-to-r from-teal-500 to-teal-600'
  },
  {
    title: 'المستخدمين',
    path: '/users',
    icon: UserCheck,
    description: 'إدارة المستخدمين والصلاحيات',
    color: 'bg-gradient-to-r from-indigo-500 to-indigo-600'
  },
  {
    title: 'صندوق النقدية',
    path: '/cash-register',
    icon: CashRegister,
    description: 'إدارة المعاملات النقدية',
    color: 'bg-gradient-to-r from-emerald-500 to-emerald-600'
  },
  {
    title: 'طلب شراء',
    path: '/purchase-orders',
    icon: ShoppingCart,
    description: 'إنشاء ومتابعة طلبات الشراء',
    color: 'bg-gradient-to-r from-rose-500 to-rose-600'
  },
  {
    title: 'إيصال استلام',
    path: '/receipts',
    icon: Receipt,
    description: 'إدارة إيصالات الاستلام',
    color: 'bg-gradient-to-r from-yellow-500 to-yellow-600'
  },
  {
    title: 'التقارير',
    path: '/reports',
    icon: BarChart3,
    description: 'عرض التقارير والإحصائيات',
    color: 'bg-gradient-to-r from-red-500 to-red-600'
  }
];

export default function Home() {
  const { user, logout } = useAuth();

  useEffect(() => {
    if (!user) {
      window.location.href = '/login'; // Redirect to login if not authenticated
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <HeaderAdmin />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            لوحة التحكم الرئيسية
          </h2>
          <p className="text-gray-600">
            أهلاً وسهلاً بك في نظام إدارة المتجر. اختر القسم الذي تريد الوصول إليه.
          </p>
        </div>

        {/* Dashboard Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {dashboardItems.map((item, index) => (
            <DashboardCard
              key={index}
              title={item.title}
              path={item.path}
              icon={item.icon}
              description={item.description}
              color={item.color}
            />
          ))}
        </div>

        {/* Quick Stats */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">إجمالي المبيعات اليوم</p>
                <p className="text-2xl font-bold text-gray-900">₪2,450</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <BarChart3 className="text-green-600" size={24} />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">المنتجات المتاحة</p>
                <p className="text-2xl font-bold text-gray-900">1,234</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Package className="text-blue-600" size={24} />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">العملاء النشطين</p>
                <p className="text-2xl font-bold text-gray-900">89</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Users className="text-purple-600" size={24} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}