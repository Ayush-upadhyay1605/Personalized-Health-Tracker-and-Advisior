
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Heart, Activity, Pill, User, Settings, Calendar } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const [expanded] = useState(true);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const menuItems = [
    { icon: Activity, label: 'Dashboard', path: '/dashboard' },
    { icon: Heart, label: 'Health Metrics', path: '/metrics' },
    { icon: Pill, label: 'Medications', path: '/medications' },
    { icon: Calendar, label: 'Appointments', path: '/appointments' },
    { icon: User, label: 'Profile', path: '/profile' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <div className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6">
        <Link to="/home" className="flex items-center gap-2">
          <Heart className="h-6 w-6 text-health-primary" />
          <span className="text-health-primary text-xl font-bold">Health Buddy</span>
        </Link>
      </div>
      
      <nav className="flex-1 px-4">
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
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
