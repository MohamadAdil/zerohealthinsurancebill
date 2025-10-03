// src/pages/admin/login.js
// The Admin Login page for users to authenticate.
import Head from 'next/head'; // For managing document head
import { useState, useEffect } from 'react'; // React hooks
import { useRouter } from 'next/router'; // Next.js router for navigation
import Input from '../../components/ui/Input'; // Reusable Input component
import Button from '../../components/ui/Button'; // Reusable Button component
import { useAuth } from '../../context/AuthContext'; // Import useAuth hook
import { useUI } from '../../context/UIContext';     // Import useUI hook for messages

/**
 * Login page component for admin users.
 * Allows admin users to log into the application.
 */
function LoginPage() {
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState(null); // State for local error messages
  const { login, isAuthenticated, loading: authLoading } = useAuth(); // Get login function and auth state from context
  const { showLoading, hideLoading, showToast } = useUI(); // Get UI functions from context
  const router = useRouter(); // Initialize router

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push('/admin/dashboard'); // Redirect to dashboard if already logged in
    }
  }, [isAuthenticated, authLoading, router]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prevCreds) => ({
      ...prevCreds,
      [name]: value,
    }));
    setError(null); // Clear error message on input change
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setError(null); // Clear previous errors
    showLoading(); // Show global loading indicator

    try {
      const success = await login(credentials); // Call login function from AuthContext
      if (success) {
        showToast('Login successful! Redirecting...', 'success'); // Show success message
        router.push('/admin/dashboard'); // Redirect to protected dashboard
      } else {
        // This else block might not be hit if `login` throws an error for failure
        setError('Login failed. Please check your credentials.');
        showToast('Login failed. Please check your credentials.', 'error');
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred during login.');
      showToast(err.message || 'Login failed. Please try again.', 'error');
    } finally {
      hideLoading(); // Hide global loading indicator
    }
  };

  // If still checking auth status, render nothing or a simple loader
  if (authLoading || isAuthenticated) {
    return (
      <div className="flex justify-center items-center h-screen text-xl text-gray-600">
        {authLoading ? 'Checking authentication...' : 'Redirecting...'}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-160px)] py-12 px-4 sm:px-6 lg:px-8">
      <Head>
        <title>Admin Login | Zero Health Insurance Bill</title>
        <meta name="description" content="Login to your admin dashboard." />
      </Head>

      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-2xl font-extrabold text-gray-900 capitalize">
            Sign in to your Admin account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <Input
            label="Email address"
            type="email"
            name="email"
            placeholder="admin@example.com"
            value={credentials.email}
            onChange={handleChange}
            required
          />
          <Input
            label="Password"
            type="password"
            name="password"
            placeholder="********"
            value={credentials.password}
            onChange={handleChange}
            required
          />

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <div>
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={authLoading} // Disable button while auth is loading
            >
              Sign in
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
