
import { ReactNode } from 'react';

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  buttonText: string;
  buttonColor: string;
  onButtonClick: () => void;
}

const FeatureCard = ({
  icon,
  title,
  description,
  buttonText,
  buttonColor,
  onButtonClick
}: FeatureCardProps) => {
  return (
    <div className="glass-card p-6 h-full flex flex-col">
      <div className="mb-6">
        {icon}
      </div>
      
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      
      <p className="text-gray-600 mb-6 flex-grow">{description}</p>
      
      <button
        onClick={onButtonClick}
        className={`w-full py-3 rounded-lg text-white font-medium transition-all duration-300 ${buttonColor}`}
      >
        {buttonText}
      </button>
    </div>
  );
};

export default FeatureCard;
