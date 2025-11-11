import React from "react";

interface TestimonialCardProps {
  name: string;
  rating: number;
  text: string;
  avatarColor: string;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  name,
  rating,
  text,
  avatarColor,
}) => {
  return (
    <div className="flex-shrink-0 w-80 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-start gap-4 mb-4">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: avatarColor }}
        >
          <span className="text-lg font-semibold text-white">
            {name.charAt(0)}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 mb-1">{name}</h4>
          <div className="flex text-yellow-400 text-sm">
            {"★".repeat(rating)}
          </div>
        </div>
      </div>
      <p className="text-gray-600 text-sm leading-relaxed mb-3">{text}</p>
      <button className="text-sm text-gray-500 hover:text-gray-700 font-medium">
        Read More &gt;
      </button>
    </div>
  );
};

export default TestimonialCard;
