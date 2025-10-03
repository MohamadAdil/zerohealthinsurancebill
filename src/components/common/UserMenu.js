'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useUI } from '../../context/UIContext';
import { useAuth } from '../../context/AuthContext';

export default function UserMenu() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user, logout } = useAuth();
  const { showToast } = useUI();
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  const handleLogout = async () => {
    try {
      await logout();
      showToast('Logged out successfully!', 'success');
      router.push('/');
    } catch (error) {
      showToast('Logout failed. Please try again.', 'error');
    }
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex items-center gap-2 text-sm text-black px-2 py-1 focus:outline-none"
        aria-haspopup="true"
        aria-expanded={open}
      >
        <Image
          src="/images/geff-profile-img.jpg"
          alt="User"
          width={32}
          height={32}
          className="object-cover w-[32px] h-[32px] rounded-full"
        />
        <span>Geff (Admin)</span>
        <svg
          className="w-4 h-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      <div
        className={`absolute right-0 mt-1 w-40 bg-white text-black z-50 overflow-hidden transition-all duration-200 ease-out
          ${open ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-2 invisible'}
        `}
      >
        {/* <Link
          href="/"
          className="block px-4 py-2 text-sm hover:bg-gray-100 transition"
        >
          Profile
        </Link> */}
        <Link
          href="/admin/settings"
          className="block px-4 py-2 text-sm hover:bg-gray-100 transition"
        >
          Settings
        </Link>
        <form method="POST" action="/logout">
          <button
          onClick={handleLogout}
            type="button"
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition"
          >
            Logout
          </button>
        </form>
      </div>
    </div>
  );
}
