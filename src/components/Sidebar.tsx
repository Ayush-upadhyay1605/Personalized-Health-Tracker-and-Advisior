
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Heart, Activity, Pill, User, Settings, Calendar, MessageCircle, Video } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useEffect } from 'react';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [expanded] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    // Check user role when component mounts
    const checkUserRole = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        const role = data.session.user.user_metadata.role || 'patient';
        setUserRole(role);
      }
    };
    
    checkUserRole();
  }, []);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/home');
    console.log('Sidebar logo: Navigating to /home');
  };

  // Create different menu items based on user role
  const patientMenuItems = [
    { icon: Activity, label: 'Dashboard', path: '/dashboard' },
    { icon: Heart, label: 'Health Metrics', path: '/metrics' },
    { icon: Pill, label: 'Medications', path: '/medications' },
    { icon: Calendar, label: 'Appointments', path: '/appointments' },
    { icon: User, label: 'Profile', path: '/profile' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  const doctorMenuItems = [
    { icon: Activity, label: 'Doctor Dashboard', path: '/doctor-dashboard' },
    { icon: Calendar, label: 'Appointments', path: '/doctor-dashboard' },
    { icon: MessageCircle, label: 'Patient Messages', path: '/doctor-dashboard' },
    { icon: Video, label: 'Video Consultations', path: '/doctor-dashboard' },
    { icon: User, label: 'Profile', path: '/profile' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  const menuItems = userRole === 'doctor' ? doctorMenuItems : patientMenuItems;

  return (
    <div className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6">
        <Link to="/home" onClick={handleLogoClick} className="flex items-center gap-2">
          <Heart className="h-6 w-6 text-health-primary" />
          <span className="text-health-primary text-xl font-bold">Health Buddy</span>
        </Link>
      </div>
      
      <nav className="flex-1 px-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path + item.label}>
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
