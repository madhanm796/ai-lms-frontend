import { Home, Map, User, LogOut } from 'lucide-react';
import SidebarItem from './SidebarItem';
import BirdLogo from '../BirdLogo'; // Assuming you have this
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Sidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate('/login');
  };

  return (
    <aside className="w-64 h-screen bg-white border-r border-gray-100 p-6 flex flex-col sticky top-0">
      {/* Logo */}
      <div className="flex items-center mb-10 px-2">
        <BirdLogo className="w-6 h-6" />
        <span className="text-xl font-semibold text-gray-800">AI-LMS</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-3">
        <SidebarItem icon={Home} label="Home" path="/dashboard" />
        <SidebarItem icon={Map} label="My Learning" path="/my-learning" />
        <SidebarItem icon={User} label="Profile" path="/profile" />
      </nav>

      {/* Logout */}
      <div className="mt-auto">
        <SidebarItem icon={LogOut} label="Logout" isLogout onClick={handleLogout} />
      </div>
    </aside>
  );
};

export default Sidebar;