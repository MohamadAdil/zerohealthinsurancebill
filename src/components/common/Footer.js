'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

export default function Footer() {
  return (
    <footer className="bg-[#001C58] text-white">
      {/* Upper Footer */}
      <div className="py-16 px-4">
        <div className="max-w-screen-xl mx-auto">
          {/* Logo */}
          <div className="pb-6 border-b border-gray-400 mb-8">
            <Link href="/">
              <Image 
                src="/images/logo-white.svg" 
                alt="Logo" 
                width={217}
                height={0}
                className="max-w-[217px] object-contain" 
              />
            </Link>
          </div>

          {/* Content */}
          <div className="grid md:grid-cols-3 gap-8">
            {/* Column 1 */}
            <div>
              <p className="text-sm mb-6">
              Discover a proprietary approach designed to help you bring your monthly health insurance bill to zero. Not a government program! Request 100% free, no-obligation quotes now and we’ll show you how you can get to zero with full transparency and no hidden catches.
              </p>
              {/* <ul className="flex gap-5">
                <li>
                  <a href="https://www.facebook.com" target="_blank" aria-label="Facebook" className="bg-[#132B8E] hover:text-green-400 w-12 h-12 flex items-center justify-center rounded-full">
                    <FaFacebookF />
                  </a>
                </li>
                <li>
                  <a href="https://www.instagram.com" target="_blank" aria-label="Instagram" className="bg-[#132B8E] hover:text-green-400 w-12 h-12 flex items-center justify-center rounded-full">
                    <FaInstagram />
                  </a>
                </li>
                <li>
                  <a href="https://www.linkedin.com" target="_blank" aria-label="LinkedIn" className="bg-[#132B8E] hover:text-green-400 w-12 h-12 flex items-center justify-center rounded-full">
                    <FaLinkedinIn />
                  </a>
                </li>
                <li>
                  <a href="https://twitter.com" target="_blank" aria-label="Twitter" className="bg-[#132B8E] hover:text-green-400 w-12 h-12 flex items-center justify-center rounded-full">
                    <FaXTwitter />
                  </a>
                </li>
              </ul> */}
            </div>

            {/* Column 2 */}
            <div>
              <h5 className="text-xl font-semibold mb-6 capitalize">Quick Links</h5>
              <ul className="space-y-4">
                <li><Link href="/" className="hover:text-green-400">Home</Link></li>
                <li><Link href="/about" className="hover:text-green-400">About Us</Link></li>
                <li><Link href="/blog" className="hover:text-green-400">Blog</Link></li>
                <li><Link href="/faq" className="hover:text-green-400">FAQ</Link></li>
                <li><Link href="/contact" className="hover:text-green-400">Contact Us</Link></li>
              </ul>
            </div>

            {/* Column 3 */}
            <div>
              <h5 className="text-xl font-semibold mb-6 capitalize">Contact Us</h5>
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-[#132B8E] w-12 h-12 flex items-center justify-center rounded-full">
                  <FaPhoneAlt />
                </div>
                <div>
                  <h6 className="text-sm mb-1">Call Us:</h6>
                  <a href="tel:+18738287289" className="font-medium hover:text-green-400">+1 202.679.8268</a>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-[#132B8E] w-12 h-12 flex items-center justify-center rounded-full">
                  <FaEnvelope />
                </div>
                <div>
                  <h6 className="text-sm mb-1">Email Us:</h6>
                  <a href="mailto:infosteveinsurance@gmail.com" className="font-medium hover:text-green-400">info@zerohealthinsurancebill.com</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="bg-[#000E35] py-6 text-center text-sm">
        <p>&copy; {new Date().getFullYear()}. All rights reserved.</p>
      </div>
    </footer>
  );
}