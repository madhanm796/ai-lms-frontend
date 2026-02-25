import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Middleware = () => {
  const { isAuthenticated } = useAuth();
  
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default Middleware;