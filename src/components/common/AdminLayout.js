// src/components/common/AdminLayout.js
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';
import { useUI } from '../../context/UIContext';
import UserMenu from './UserMenu';
import { FaBars } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import Image from 'next/image';

function AdminLayout({ children }) {
  const { user, logout } = useAuth();
  const { showToast } = useUI();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // <-- Added state

  const handleLogout = async () => {
    try {
      await logout();
      showToast('Logged out successfully!', 'success');
      router.push('/admin/login');
    } catch (error) {
      showToast('Logout failed. Please try again.', 'error');
    }
  };

  const getPageTitle = () => {
    if (router.pathname === '/admin') return 'Dashboard';
    const path = router.pathname.replace('/admin/', '');
    return path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' ');
  };

  return (
    <div className="flex min-h-screen h-screen bg-gray-100">
      {/* Admin Sidebar */}
      <aside
        className={`w-full md:w-64 bg-gray-800 text-white shadow-lg flex flex-col absolute md:relative h-full z-10
        transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
      >
        <RxCross2
          onClick={() => setIsSidebarOpen(false)}
          className="block md:hidden absolute top-5 right-5 cursor-pointer"
          size={24}
        />
        <div className="p-4 border-b border-gray-700">
          <Link href="/" className="block max-w-[120px] md:max-w-[186px]">
            <Image
             src="/images/logo-white.svg" 
              alt="Zero Insurance Logo"
              width={186}
              height={50}
              className="object-contain h-auto w-full"
              priority
            />
          </Link>
        </div>
        <nav className="flex-grow p-4">
          <ul className="space-y-2">
            <li>
              <Link
                href="/admin/dashboard"
                className={`block py-2 px-4 rounded-lg transition-colors duration-200 ${router.pathname === '/admin/dashboard'
                    ? 'bg-gray-700'
                    : 'hover:bg-gray-700'
                  }`}
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                href="/admin/submissions"
                className={`block py-2 px-4 rounded-lg transition-colors duration-200 ${router.pathname === '/admin/profile'
                    ? 'bg-gray-700'
                    : 'hover:bg-gray-700'
                  }`}
              >
                Submissions
              </Link>
            </li>
            <li>
              <Link
                href="/admin/create-team"
                className={`block py-2 px-4 rounded-lg transition-colors duration-200 ${router.pathname === '/admin/team'
                    ? 'bg-gray-700'
                    : 'hover:bg-gray-700'
                  }`}
              >
                Add Team
              </Link>
            </li>
            <li>
              <Link
                href="/admin/team-structure"
                className={`block py-2 px-4 rounded-lg transition-colors duration-200 ${router.pathname === '/admin/team'
                    ? 'bg-gray-700'
                    : 'hover:bg-gray-700'
                  }`}
              >
                Team Structure
              </Link>
            </li>
            <li>
              <Link
                href="/admin/settings"
                className={`block py-2 px-4 rounded-lg transition-colors duration-200 ${router.pathname === '/admin/settings'
                    ? 'bg-gray-700'
                    : 'hover:bg-gray-700'
                  }`}
              >
                Settings
              </Link>
            </li>
          </ul>
        </nav>
        <div className="p-4 border-t border-gray-700">
          {user && (
            <div className="mb-4">
              <p className="text-sm text-gray-300">Logged in as:</p>
              <p className="font-medium">{user.name || user.email}</p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Admin Header */}
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <FaBars
              onClick={() => setIsSidebarOpen(true)}
              className="inline-block md:hidden cursor-pointer"
              size={20}
            />
            <h1 className="text-sm md:text-xl font-semibold text-gray-800">
              {getPageTitle()}
            </h1>
          </div>

          <UserMenu />
        </header>

        {/* Page Content */}
        <main className="flex-grow p-0 md:p-6 bg-gray-50 overflow-y-auto">
          {children}
        </main>

        {/* Admin Footer */}
        <footer className="bg-white p-4 border-t text-center text-sm text-gray-600">
          &copy; {new Date().getFullYear()} Admin Panel. All rights reserved.
        </footer>
      </div>
    </div>
  );
}

export default AdminLayout;
