import { useSelector } from 'react-redux';

/**
 * Custom hook to access authentication state
 * @returns {Object} Authentication information
 */
export const useAuth = () => {
  const { user, token, loading, error } = useSelector((state) => state.auth);
  
  const isAuthenticated = Boolean(user && token);
  console.log("useAuth", { user, token, isAuthenticated });
  
  return {
    user,
    token,
    loading,
    error,
    isAuthenticated
  };
};

// Also keep the default export for backward compatibility
export default useAuth;
