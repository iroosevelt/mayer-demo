import React from "react";

interface PartnerLogoProps {
  src: string;
  alt: string;
}

const PartnerLogo: React.FC<PartnerLogoProps> = ({ src, alt }) => {
  return (
    <img
      src={src}
      alt={alt}
      className="h-20 w-auto opacity-50 grayscale hover:opacity-100 hover:grayscale-0 transition-all"
    />
  );
};

export default PartnerLogo;
