import { useState } from 'react';
import Sidebar from './Sidebar';
import ChatbotDialog from './ChatbotDialog';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  const openChatbot = () => {
    setIsChatbotOpen(true);
  };

  return (
    <div className="flex min-h-screen bg-gray-50" role="main">
      <Sidebar openChatbot={openChatbot} />
      <main className="flex-1 p-6" role="region" aria-label="Dashboard Content">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
      <ChatbotDialog open={isChatbotOpen} onOpenChange={setIsChatbotOpen} />
    </div>
  );
};

export default DashboardLayout;
