// src/pages/_app.js
import '../styles/globals.css'; // Import global styles
import { AuthProvider } from '../context/AuthContext'; // Import AuthProvider
import { UIProvider } from '../context/UIContext';     // Import UIProvider
import 'primereact/resources/themes/lara-light-cyan/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import Toast from '@/components/ui/Toast';
import Layout from '../components/common/Layout';     // Import the main Layout component
import AdminLayout from '../components/common/AdminLayout'; // Import the AdminLayout component

/**
 * Custom App component to initialize pages.
 * This component wraps all your pages and is the perfect place to:
 * - Import global CSS
 * - Keep state when navigating between pages
 * - Inject additional data into pages
 * - Add global providers (like Context API providers)
 */
function MyApp({ Component, pageProps, router }) {
  // Check if the current route is an admin route
  const isAdminRoute = router.pathname.startsWith('/admin');
  // Check if the current route is specifically the admin login page
  const isAdminLogin = router.pathname === '/admin/login';

  // Use AdminLayout for admin routes, otherwise use the regular Layout
  const LayoutComponent = isAdminRoute ? AdminLayout : Layout;

  return (
    <>
      {/* UIProvider wraps AuthProvider to allow UI context to show loading/messages for auth operations */}
      <UIProvider>
      <Toast />
        {/* AuthProvider wraps the Layout and Component to provide authentication state globally */}
        <AuthProvider>
          {/* Conditional rendering of layout */}
          {isAdminLogin ? (
            <Component {...pageProps} />
          ) : (
            <LayoutComponent>
              <Component {...pageProps} />
            </LayoutComponent>
          )}
        </AuthProvider>
      </UIProvider>
    </>
  );
}

export default MyApp;