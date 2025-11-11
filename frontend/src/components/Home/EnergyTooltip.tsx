import React from "react";

interface EnergyTooltipProps {
  position: string;
  title: string;
  description: string;
}

const EnergyTooltip: React.FC<EnergyTooltipProps> = ({
  position,
  title,
  description,
}) => {
  return (
    <div className={`absolute ${position} group`}>
      <div className="relative">
        <div className="w-6 h-6 animate-ping absolute inline-flex rounded-full bg-yellow-400 opacity-75"></div>
        <img
          src="/media/mark.svg"
          alt=""
          className="relative w-6 h-6 cursor-pointer"
        />
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block w-56 p-3 bg-gray-900 text-white text-sm rounded-lg shadow-xl z-50">
          <p className="font-medium mb-1">{title}</p>
          <p className="text-gray-300 text-xs">{description}</p>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>
      </div>
    </div>
  );
};

export default EnergyTooltip;
