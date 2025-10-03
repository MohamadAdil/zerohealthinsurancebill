// src/pages/admin/dashboard.js
// Protected Admin Dashboard page.
import Head from 'next/head'; // For managing document head
import Link from 'next/link';
import withAuth from '../../components/auth/withAuth'; // Import the authentication HOC
import AdminLayout from '../../components/common/AdminLayout';
import { useAuth } from '../../context/AuthContext'; // Import useAuth to get user data
import MembersList from '@/components/dashboard/MembersList';

/**
 * Admin Dashboard page component.
 * This page is accessible only after successful admin login.
 * It uses the AdminLayout for its distinct admin-specific header, sidebar, and footer.
 */
function AdminDashboard() {
  const { user } = useAuth(); // Get user data from AuthContext

  return (
    <>
      <Head>
        <title>Admin Dashboard | Zero Health Insurance Bill</title>
        <meta name="description" content="Admin control panel for Zero Health Insurance Bill." />
      </Head>

      {/* The content of this page will be rendered inside the <main> tag of AdminLayout */}
      <section className='py-10 md:py-20'>
        <div className='container mx-auto px-4'>
          <div className="bg-white p-2 sm:p-4 md:p-8  rounded-xl">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-8 text-center">
              Welcome to the Admin Dashboard, {user?.name || 'Admin'}!
            </h1>
            <p className="text-lg text-gray-700 mb-10 text-center">
              This is your central hub for managing the application.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Dashboard Card 1: User Management */}
              <div className="bg-blue-50 p-3 md:p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                <h2 className="text-xl md:text-2xl font-semibold text-secondary mb-4">Team Management</h2>
                <p className="text-gray-700 mb-4">
                  View, add, edit, and delete user your team members.
                </p>
                <button className="bg-[#051a6f] text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-blue-700 transition">
                  Manage Users
                </button>
              </div>

              {/* Dashboard Card 2: Content Management */}
              <div className="bg-green-50 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                <h2 className="text-xl md:text-2xl font-semibold text-secondary mb-4">Content Management</h2>
                <p className="text-gray-700 mb-4">
                  Create, edit, and publish blog posts, FAQs, and other site content.
                </p>
                <Link
                    className="bg-[#051a6f] text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-blue-700 transition"
                    href="https://backend.zerohealthinsurancebill.com/wp-admin/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Manage Content
                  </Link>
              </div>

              {/* Dashboard Card 3: Analytics & Reports */}
              <div className="bg-yellow-50 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                <h2 className="text-xl md:text-2xl font-semibold text-secondary mb-4">Analytics & Reports</h2>
                <p className="text-gray-700 mb-4">
                  Access key performance indicators and generate reports on user activity.
                </p>
                <button className="bg-[#051a6f] text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-blue-700 transition">
                  View Analytics
                </button>
              </div>
            </div>

            {/* You can add more sections and components specific to the admin dashboard here */}
          </div>
        </div>
      </section>
      <MembersList/>
    </>
  );
}

export async function getStaticProps(context) {
  // You can add server-side authentication checks here if needed
  // For example, verify the user's session or role
  
  return {
    props: {}, // Will be passed to the page component as props
  }
}

// Export the page wrapped with the withAuth HOC to protect it.
// The AdminLayout is applied in _app.js based on the route.
export default withAuth(AdminDashboard);