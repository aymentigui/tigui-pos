import React, { use, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { ArrowRight, Calculator, Palette, Sliders, Tag, Grid3X3, Cog, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DashboardCard } from '@/components/my/DashboardCard';
import HeaderAdmin from '@/components/my/Header';

const settingsItems = [
  {
    title: 'الضرائب',
    path: '/settings/taxes',
    icon: Calculator,
    description: 'إدارة أنواع الضرائب والمعدلات',
    color: 'bg-gradient-to-r from-blue-500 to-blue-600'
  },
  {
    title: 'الألوان',
    path: '/settings/colors',
    icon: Palette,
    description: 'إدارة ألوان المنتجات',
    color: 'bg-gradient-to-r from-pink-500 to-pink-600'
  },
  {
    title: 'الخصائص',
    path: '/settings/attributes',
    icon: Sliders,
    description: 'إدارة خصائص ومواصفات المنتجات',
    color: 'bg-gradient-to-r from-purple-500 to-purple-600'
  },
  {
    title: 'الماركات',
    path: '/settings/brands',
    icon: Tag,
    description: 'إدارة العلامات التجارية',
    color: 'bg-gradient-to-r from-orange-500 to-orange-600'
  },
  {
    title: 'الفئات',
    path: '/settings/categories',
    icon: Grid3X3,
    description: 'إدارة فئات وتصنيفات المنتجات',
    color: 'bg-gradient-to-r from-green-500 to-green-600'
  },
  {
    title: 'إعدادات خاصة',
    path: '/settings/custom',
    icon: Cog,
    description: 'إعدادات مخصصة للنظام',
    color: 'bg-gradient-to-r from-indigo-500 to-indigo-600'
  }
];

export default function Settings() {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      window.location.href = '/login'; // Redirect to login if user is not authenticated
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">

      {/* Header Section */}  
      <HeaderAdmin 
        list={[
          { title: 'الرئيسية', link: '/', icon: Home },
        ]}
        subtitle="إدارة إعدادات النظام"
        showLogout={true}
      />      

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 rtl:space-x-reverse mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white">
              <Cog size={24} />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">إعدادات النظام</h2>
              <p className="text-gray-600">إدارة وتخصيص إعدادات المتجر والنظام</p>
            </div>
          </div>
        </div>

        {/* Settings Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {settingsItems.map((item, index) => (
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

        {/* Quick Actions Section */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">إجراءات سريعة</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              variant="outline" 
              className="flex items-center justify-center space-x-2 rtl:space-x-reverse h-12"
            >
              <Calculator size={18} />
              <span>إضافة ضريبة جديدة</span>
            </Button>
            <Button 
              variant="outline" 
              className="flex items-center justify-center space-x-2 rtl:space-x-reverse h-12"
            >
              <Grid3X3 size={18} />
              <span>إنشاء فئة جديدة</span>
            </Button>
            <Button 
              variant="outline" 
              className="flex items-center justify-center space-x-2 rtl:space-x-reverse h-12"
            >
              <Tag size={18} />
              <span>إضافة ماركة جديدة</span>
            </Button>
          </div>
        </div>

        {/* System Info */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
            <h4 className="text-lg font-bold text-blue-900 mb-2">معلومات النظام</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-blue-700">إصدار النظام:</span>
                <span className="font-medium text-blue-900">v2.1.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700">آخر تحديث:</span>
                <span className="font-medium text-blue-900">15 يناير 2025</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700">حالة النظام:</span>
                <span className="font-medium text-green-600">نشط</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
            <h4 className="text-lg font-bold text-green-900 mb-2">إحصائيات الإعدادات</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-green-700">إجمالي الفئات:</span>
                <span className="font-medium text-green-900">24</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-700">الماركات المسجلة:</span>
                <span className="font-medium text-green-900">18</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-700">أنواع الضرائب:</span>
                <span className="font-medium text-green-900">3</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}