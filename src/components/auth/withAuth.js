// src/components/auth/withAuth.js
// Higher-Order Component (HOC) for protecting routes that require authentication.
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext'; // Import useAuth hook

/**
 * withAuth HOC wraps a component and ensures the user is authenticated
 * before rendering it. If not authenticated, it redirects to the login page.
 * @param {React.ComponentType} WrappedComponent - The component to protect.
 * @returns {React.ComponentType} The protected component.
 */
const withAuth = (WrappedComponent) => {
  const AuthComponent = (props) => {
    // Get authentication status and loading state from AuthContext
    const { isAuthenticated, loading } = useAuth();
    const router = useRouter(); // Initialize Next.js router

    // useEffect to handle redirection based on authentication status
    useEffect(() => {
      // Only redirect if authentication check is complete and user is NOT authenticated
      if (!loading && !isAuthenticated) {
        router.push('/admin/login'); // Redirect to the new admin login page
      }
    }, [isAuthenticated, loading, router]); // Dependencies for the effect

    // While authentication status is being checked or if not authenticated,
    // display a loading message or null to prevent content flicker.
    if (loading || !isAuthenticated) {
      return (
        <div className="flex justify-center items-center h-screen text-xl text-gray-600">
          {loading ? 'Checking authentication...' : 'Redirecting to login...'}
        </div>
      );
    }

    // If authenticated, render the wrapped component with its props
    return <WrappedComponent {...props} />;
  };

  // Set a display name for the HOC for better debugging in React DevTools
  AuthComponent.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return AuthComponent;
};

export default withAuth;
