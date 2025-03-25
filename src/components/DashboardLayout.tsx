
import { ReactNode } from 'react';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <main>{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
