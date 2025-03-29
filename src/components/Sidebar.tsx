import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Heart, Activity, Pill, User, Settings, Calendar, Bot } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface SidebarProps {
  openChatbot?: () => void;
}

const Sidebar = ({ openChatbot }: SidebarProps) => {
  const location = useLocation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        setUser(data.session?.user || null);
      } catch (error) {
        console.error('Error fetching user session:', error);
      }
    };

    getUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const isActive = (path: string) => location.pathname === path;

  const menuItems = [
    { icon: Activity, label: 'Dashboard', path: '/dashboard' },
    { icon: Heart, label: 'Health Metrics', path: '/metrics' },
    { icon: Pill, label: 'Medications', path: '/medications' },
    { icon: Calendar, label: 'Appointments', path: '/appointments' },
    { icon: User, label: 'Profile', path: '/profile' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <div className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col sm:w-56">
      <div className="p-6">
        <Link to="/" className="flex items-center gap-2">
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
                    ? 'text-health-primary font-medium bg-health-primary/10'
                    : 'text-gray-700 hover:text-health-primary hover:bg-gray-50'
                }`}
                aria-label={`Navigate to ${item.label}`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            </li>
          ))}

          {openChatbot && (
            <li>
              <button
                onClick={openChatbot}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-gray-700 hover:text-health-primary hover:bg-gray-50"
                aria-label="Open Health Assistant"
              >
                <Bot className="h-5 w-5" />
                <span>Health Assistant</span>
              </button>
            </li>
          )}
        </ul>
      </nav>

      {user && (
        <div className="p-4 border-t border-gray-200">
          <Link
            to="/profile"
            className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-50"
          >
            <div className="w-8 h-8 rounded-full bg-health-primary/10 flex items-center justify-center">
              <User className="h-4 w-4 text-health-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {user.user_metadata?.full_name || user.email}
              </p>
              <p className="text-xs text-gray-500 truncate">View profile</p>
            </div>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
