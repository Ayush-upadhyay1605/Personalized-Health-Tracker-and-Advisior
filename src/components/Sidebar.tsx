
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Heart, Activity, Pill, User, Settings, Calendar, Menu, X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(true);
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/home');
    console.log('Sidebar logo: Navigating to /home');
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) {
      setMobileMenuOpen(false);
    }
  };

  const menuItems = [
    { icon: Activity, label: 'Dashboard', path: '/dashboard' },
    { icon: Heart, label: 'Health Metrics', path: '/metrics' },
    { icon: Pill, label: 'Medications', path: '/medications' },
    { icon: Calendar, label: 'Appointments', path: '/appointments' },
    { icon: User, label: 'Profile', path: '/profile' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  // Mobile sidebar
  if (isMobile) {
    return (
      <>
        <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 w-full sticky top-0 z-40">
          <Link to="/home" onClick={handleLogoClick} className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-health-primary" />
            <span className="text-health-primary text-xl font-bold">Health Buddy</span>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 focus:outline-none"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-health-primary" />
            ) : (
              <Menu className="h-6 w-6 text-health-primary" />
            )}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="fixed inset-0 top-16 bg-white z-30 animate-fade-in">
            <nav className="p-4">
              <ul className="space-y-2">
                {menuItems.map((item) => (
                  <li key={item.path}>
                    <button
                      onClick={() => handleNavigation(item.path)}
                      className={`flex w-full items-center gap-3 px-3 py-4 rounded-md transition-colors ${
                        isActive(item.path)
                          ? 'text-health-primary font-medium bg-gray-50'
                          : 'text-gray-700 hover:text-health-primary hover:bg-gray-50'
                      }`}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        )}
      </>
    );
  }

  // Desktop sidebar
  return (
    <div className="h-screen bg-white border-r border-gray-200 flex flex-col overflow-hidden transition-all duration-300"
         style={{ width: expanded ? '16rem' : '4.5rem' }}>
      <div className="p-6 flex items-center gap-2">
        <Link to="/home" onClick={handleLogoClick} className="flex items-center gap-2 overflow-hidden">
          <Heart className="h-6 w-6 text-health-primary shrink-0" />
          {expanded && <span className="text-health-primary text-xl font-bold whitespace-nowrap">Health Buddy</span>}
        </Link>
        
        <button 
          onClick={() => setExpanded(!expanded)} 
          className="ml-auto text-gray-500 hover:text-gray-700"
        >
          {expanded ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </button>
      </div>
      
      <nav className="flex-1 px-4 overflow-y-auto">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                  isActive(item.path)
                    ? 'text-health-primary font-medium'
                    : 'text-gray-700 hover:text-health-primary hover:bg-gray-50'
                }`}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {expanded && <span className="whitespace-nowrap">{item.label}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
