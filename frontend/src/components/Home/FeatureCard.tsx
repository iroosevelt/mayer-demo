import React from "react";

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <div className="rounded-2xl p-6 text-left" style={{ backgroundColor: '#fafafa' }}>
      <div className="w-14 h-14 mb-4 bg-blue-50 rounded-xl flex items-center justify-center">
        <img src={icon} alt={title} className="w-8 h-8" />
      </div>
      <h3 className="font-semibold text-gray-900 mb-2 text-base">{title}</h3>
      <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
};

export default FeatureCard;
