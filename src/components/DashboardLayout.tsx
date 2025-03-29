
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
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar openChatbot={openChatbot} />
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
      <ChatbotDialog open={isChatbotOpen} onOpenChange={setIsChatbotOpen} />
    </div>
  );
};

export default DashboardLayout;
