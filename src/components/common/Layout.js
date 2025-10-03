// src/components/common/Layout.js
import Navbar from './Navbar'; // Import the Navbar component
import Footer from './Footer'; // Import the Footer component
import { useUI } from '../../context/UIContext'; // Import useUI hook for global UI state

/**
 * Layout component that wraps all pages to provide a consistent header, footer,
 * and potentially global UI elements like loading spinners or message toasts.
 */
function Layout({ children }) {
  const { isLoading, message } = useUI(); // Get global UI state

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar component at the top of every page */}
      <Navbar />

      {/* Main content area */}
      <main className="">
        {/* Global Loading Indicator */}
        {isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
            <span className="sr-only">Loading...</span>
          </div>
        )}

        {/* Global Message/Toast Notification */}
        {message && (
          <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg text-white z-50
            ${message.type === 'error' ? 'bg-red-500' :
              message.type === 'success' ? 'bg-green-500' : 'bg-blue-500'}
          `}>
            {message.text}
          </div>
        )}

        {/* Render the content of the current page */}
        {children}
      </main>

      {/* Footer component at the bottom of every page */}
      <Footer />
    </div>
  );
}

export default Layout;
