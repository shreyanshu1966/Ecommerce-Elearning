import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { authService } from '../services/authService';

const PrivateRoute = () => {
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  
  useEffect(() => {
    // Check authentication on mount and when user changes
    const checkAuthentication = () => {
      const isAuth = !!user || authService.isAuthenticated();
      console.log("PrivateRoute - Authentication check:", isAuth);
      setIsAuthenticated(isAuth);
      setCheckingAuth(false);
    };
    
    checkAuthentication();
  }, [user]);
  
  if (checkingAuth) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    console.log("PrivateRoute - Not authenticated, redirecting to login");
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  
  return <Outlet />;
};

export default PrivateRoute;