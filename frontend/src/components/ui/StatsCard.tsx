import React from 'react';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: string;
  color: 'blue' | 'green' | 'purple' | 'orange' | 'red';
  trend?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, color, trend }) => {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500',
    red: 'bg-red-500'
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {trend && (
            <p className="text-sm text-green-600 mt-1">
              {trend} from last month
            </p>
          )}
        </div>
        <div className={`${colorClasses[color]} rounded-full p-3 text-white text-2xl`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;