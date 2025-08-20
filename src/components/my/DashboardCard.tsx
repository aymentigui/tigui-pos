import React from 'react';
import { Link } from 'react-router-dom';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface DashboardCardProps {
  title: string;
  path: string;
  icon: any;
  description?: string;
  color: string;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  path,
  icon: Icon,
  description,
  color
}) => {
  return (
    <Link 
      to={path}
      className="group relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-gray-200 hover:-translate-y-1"
    >
      <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 ${color} text-white group-hover:scale-110 transition-transform duration-300`}>
        <Icon size={24} />
      </div>
      
      <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-gray-900">
        {title}
      </h3>
      
      {description && (
        <p className="text-sm text-gray-500 group-hover:text-gray-600">
          {description}
        </p>
      )}
      
      <div className="absolute top-4 left-4 w-2 h-2 rounded-full bg-green-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </Link>
  );
};