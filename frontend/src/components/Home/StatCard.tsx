import React from "react";

const StatCard: React.FC = () => {
  return (
    <div className="text-center">
      <img
        src="/media/stats.svg"
        alt="Stats"
        style={{ backgroundRepeat: "no-repeat" }}
        className="w-full h-full object-cover no-repeat"
      />
    </div>
  );
};

export default StatCard;
