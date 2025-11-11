import React from 'react';

interface StatCardProps {
  value: number;
  label: string;
  icon: React.ReactNode;
  bgColor: string;
  hoverBorderColor: string;
  iconBgColor: string;
  iconHoverBgColor: string;
}

const StatCard: React.FC<StatCardProps> = ({
  value,
  label,
  icon,
  bgColor,
  hoverBorderColor,
  iconBgColor,
  iconHoverBgColor,
}) => {
  return (
    <div className={`${bgColor} rounded-2xl p-5 md:p-6 border border-gray-100 hover:${hoverBorderColor} transition-all cursor-default group`}>
      <div className="flex items-start justify-between mb-6 md:mb-8">
        <div className={`w-10 h-10 md:w-11 md:h-11 ${iconBgColor} rounded-xl flex items-center justify-center group-hover:${iconHoverBgColor} transition-colors`}>
          {icon}
        </div>
      </div>
      <div className="space-y-1">
        <p className="text-3xl md:text-4xl font-semibold text-gray-900 tracking-tight">{value}</p>
        <p className="text-xs md:text-sm font-medium text-gray-500">{label}</p>
      </div>
    </div>
  );
};

export default StatCard;
