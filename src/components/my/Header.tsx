import React from 'react'
import { useAuth } from '@/context/AuthContext'
import { Link } from 'react-router-dom';
import { ArrowRight, Home, LogOut, Bell, Search } from 'lucide-react';
import { Button } from '../ui/button';


export default function HeaderAdmin({
    list = [
        {
            title: 'الرئيسية',
            link: '/',
            icon: Home
        }
    ],
    subtitle,
    showLogout = true
}: {
    list?: Array<{
        title: string,
        link: string,
        icon?: any
    }>,
    subtitle?: string,
    showLogout?: boolean
}) {

    const { user, logout } = useAuth()

    if (!user) {
        return null; // If user is not authenticated, do not render the header
    }

    return (
        <div className="bg-white shadow-sm border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center space-x-4 rtl:space-x-reverse">
                        <div className="flex items-center space-x-3 rtl:space-x-reverse">

                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                                {user?.username?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h1 className="text-lg font-bold text-gray-900">
                                    مرحباً، {user?.username}
                                </h1>
                                <p className="text-sm text-gray-500">الدور: {user?.role}</p>
                            </div>
                            <div className='w-1 h-10 bg-gray-100'>
                            </div>
                            <div className="flex items-center rtl:space-x-reverse">
                                {list.map((item, index) => (
                                    <Link
                                        key={index}
                                        to={item.link}
                                        className="flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-200"
                                    >
                                        {item.icon && <item.icon size={16} className="mr-1" />}
                                        <span>{item.title}</span>
                                        {(list.length>1 || subtitle) && <ArrowRight size={16} className="ml-1" />}
                                    </Link>
                                ))}
                                {subtitle && <h1 className="text-gray-900">{subtitle}</h1>}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4 rtl:space-x-reverse">
                        <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200">
                            <Search size={20} />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200 relative">
                            <Bell size={20} />
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
                        </button>
                        {showLogout && <Button
                            variant="outline"
                            size="sm"
                            onClick={logout}
                            className="flex items-center space-x-2 rtl:space-x-reverse text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                        >
                            <LogOut size={16} />
                            <span>تسجيل الخروج</span>
                        </Button>}
                    </div>
                </div>
            </div>
        </div>
    )
}


