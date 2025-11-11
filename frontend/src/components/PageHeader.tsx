import React from 'react';

interface PageHeaderProps {
  title: string;
  description: string;
  action?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, description, action }) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-dark-900 mb-2">
          {title}
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-dark-500">
          {description}
        </p>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
};

export default PageHeader;
