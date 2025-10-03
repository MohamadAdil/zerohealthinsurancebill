'use client';

import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { useUI } from '../../context/UIContext';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { useState } from 'react';
import { scrollToSection } from '@/utils/helpers';

import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
  FaMapMarkerAlt,
  FaPhone,
  FaBars,
  FaTimes,
} from 'react-icons/fa';

function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const { showToast } = useUI();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      showToast('Logged out successfully!', 'success');
      router.push('/');
    } catch (error) {
      showToast('Logout failed. Please try again.', 'error');
    }
  };

  const toggleMobileMenu = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <header className="w-full">
      {/* Top Header */}
      {/* <div className="bg-gray-900 text-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-between items-center gap-5">
         
            <ul className="flex items-center gap-5 text-sm font-medium">
              <li>
                <a href="#" className="flex items-center gap-2 hover:text-green-500 transition">
                  <FaMapMarkerAlt className="text-base" />
                  <span className="hidden sm:block">California, TX 70240E</span>
                </a>
              </li>
              <li>
                <a href="tel:+18738287289" className="flex items-center gap-2 hover:text-green-500 transition">
                  <FaPhone className="text-base" />
                  <span className="hidden sm:block">+1 873828 7289</span>
                </a>
              </li>
            </ul>

           
            <ul className="flex items-center gap-5">
              <li>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-green-500 transition">
                  <FaFacebookF />
                </a>
              </li>
              <li>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-green-500 transition">
                  <FaInstagram />
                </a>
              </li>
              <li>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-green-500 transition">
                  <FaLinkedinIn />
                </a>
              </li>
              <li>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-green-500 transition">
                  <FaTwitter />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div> */}

      {/* Main Navbar */}
      <nav className="bg-white shadow-md relative z-50">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          {/* Logo */}
          <Link href="/" className="block max-w-[120px] md:max-w-[186px]">
            <Image
              src="/images/logo.svg"
              alt="Zero Insurance Logo"
              width={186}
              height={50}
              className="object-contain h-auto w-full"
              priority
            />
          </Link>

          {/* Navigation Links */}
          <ul
            className={`lg:flex items-center gap-9 text-gray-600 font-semibold text-base transition-all duration-300 absolute lg:static top-full left-0 w-full lg:w-auto bg-white px-4 lg:px-0 ${mobileOpen ? 'block' : 'hidden'}`}
          >
            <li>
              <Link href="/" className="block py-2 lg:py-0 hover:text-[#051a6f] transition">
                Home
              </Link>
            </li>
            <li>
              <Link href="/about" className="block py-2 lg:py-0 hover:text-[#051a6f] transition">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/blog" className="block py-2 lg:py-0 hover:text-[#051a6f] transition">
                Blogs
              </Link>
            </li>
            <li>
              <Link href="/faq" className="block py-2 lg:py-0 hover:text-[#051a6f] transition">
                FAQ
              </Link>
            </li>
            <li>
              <Link href="/contact" className="block py-2 lg:py-0 hover:text-[#051a6f] transition">
                Contact Us
              </Link>
            </li>
            {isAuthenticated && user?.role === 'admin' && (
              <li>
                <Link href="/admin/dashboard" className="block py-2 lg:py-0 text-red-500 hover:underline">
                  Admin
                </Link>
              </li>
            )}
          </ul>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            {/* Toggle Button for Mobile */}
            <button
              className="lg:hidden text-2xl text-gray-700"
              onClick={toggleMobileMenu}
              aria-label="Toggle navigation"
            >
              {mobileOpen ? <FaTimes /> : <FaBars />}
            </button>

            {/* Quote Button + Auth */}
            <div className="flex items-center gap-4">
              <button onClick={() => scrollToSection('how-works')}
                className="hidden lg:block bg-[#051a6f] text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-blue-700 transition"
              >
                Request A Quote Now
              </button>

              {/* {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="text-sm text-gray-700 hover:underline"
                >
                  Logout ({user?.name || 'Admin'})
                </button>
              ) : (
                <Link href="/admin/login" className="text-sm text-gray-700 hover:underline">
                  Login
                </Link>
              )} */}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
