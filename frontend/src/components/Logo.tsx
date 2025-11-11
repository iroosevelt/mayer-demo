import React from "react";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const Logo: React.FC<LogoProps> = ({
  className = "",
  size = "md",
}) => {
  const heightClasses = {
    sm: "h-5",
    md: "h-7",
    lg: "h-9",
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <img
        src="/mayer-logo.svg"
        alt="Mayer"
        className={`${heightClasses[size]} w-auto`}
      />
    </div>
  );
};

export default Logo;
