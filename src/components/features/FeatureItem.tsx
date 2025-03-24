
import { ReactNode } from 'react';

interface FeatureItemProps {
  icon: ReactNode;
  title: string;
  description: string;
  bgColor: string;
}

const FeatureItem = ({ icon, title, description, bgColor }: FeatureItemProps) => {
  return (
    <div className="flex flex-col items-center text-center px-4 py-6 transition-transform duration-300 hover:translate-y-[-5px]">
      <div className={`feature-icon-bg ${bgColor} mb-4`}>
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
};

export default FeatureItem;
