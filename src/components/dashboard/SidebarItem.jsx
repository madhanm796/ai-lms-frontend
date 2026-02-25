import { Link, useLocation } from 'react-router-dom';

const SidebarItem = ({ icon: Icon, label, path, onClick, isLogout }) => {
  const location = useLocation();
  const isActive = location.pathname === path;

  // Base classes
  const baseClasses = "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium";
  
  // Specific styles for Active, Inactive, and Logout
  const activeClasses = "bg-purple-500 text-white";
  const inactiveClasses = "text-gray-500 hover:bg-purple-50 hover:text-purple-600";
  const logoutClasses = "bg-red-100 text-red-500 hover:bg-red-200 mt-auto";

  if (isLogout) {
    return (
      <button onClick={onClick} className={`${baseClasses} ${logoutClasses} w-full justify-center`}>
        <Icon className="w-5 h-5" />
        <span>{label}</span>
      </button>
    );
  }

  return (
    <Link to={path} className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}>
      <Icon className={`w-5 h-5 ${isActive ? 'text-white': 'text-purple-600'}`} />
      <span className={`${isActive ? 'text-white' : 'text-purple-500'}`}>{label}</span>
    </Link>
  );
};

export default SidebarItem;