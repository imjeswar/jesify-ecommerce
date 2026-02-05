import React from 'react';

interface InfoLayoutProps {
  title: string;
  children: React.ReactNode;
}

export const InfoLayout: React.FC<InfoLayoutProps> = ({ title, children }) => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-heading font-bold text-gray-900 mb-8 pb-4 border-b border-gray-200">
        {title}
      </h1>
      <div className="prose prose-lg text-gray-600 max-w-none">
        {children}
      </div>
    </div>
  );
};
