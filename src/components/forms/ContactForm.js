'use client';

import { FaUser, FaPhone, FaEnvelope, FaClock, FaCommentDots } from 'react-icons/fa';
import { useState } from 'react';
import { api } from '@/lib/api';
import { useUI } from '@/context/UIContext';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    email: '',
    subject: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const { showToast } = useUI();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { full_name, email, message } = formData;

      if (!full_name || !email || !message) {
        throw new Error('Name, email, and message are required.');
      }

      if (!/^\S+@\S+\.\S+$/.test(email)) {
        throw new Error('Please enter a valid email address.');
      }

      const response = await api.post('/create-contact', formData);

      if (response.response === 'success') {
        showToast('Thank you! Your message has been submitted successfully.', 'success');
        setFormData({
          full_name: '',
          phone: '',
          email: '',
          subject: '',
          message: '',
        });
      } else {
        throw new Error(response?.message || 'Failed to submit the form.');
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-[#f9f9f9] rounded-2xl p-10 md:flex md:gap-10 items-center">
          {/* Left Text Content */}
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h2 className="text-2xl md:text-3xl font-semibold text-[#051A6F] mb-4">
              Have a Question? We&apos;re here <br className="hidden md:block" /> To Help
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              Whether you&apos;re exploring instant coverage, embedded insurance options, or fully digital protection plans,
              our team at ZERO is here to guide you — making insurance simple, seamless, and transparent.
            </p>
          </div>

          {/* Right Form */}
          <div className="md:w-1/2 space-y-4">
            <form onSubmit={handleSubmit}>
              {/* Full Name */}
              <div className="flex items-center bg-white rounded-lg px-4 py-3 shadow-sm mb-3">
                <FaUser className="text-gray-400 mr-3" />
                <input
                  type="text"
                  name="full_name"
                  placeholder="Full name"
                  value={formData.full_name}
                  onChange={handleChange}
                  className="w-full outline-none text-sm"
                  required
                />
              </div>

              {/* Phone + Email */}
              <div className="flex gap-4">
                <div className="flex items-center bg-white rounded-lg px-4 py-3 shadow-sm w-1/2 mb-3">
                  <FaPhone className="text-gray-400 mr-3" />
                  <input
                    type="text"
                    name="phone"
                    placeholder="Phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full outline-none text-sm"
                  />
                </div>
                <div className="flex items-center bg-white rounded-lg px-4 py-3 shadow-sm w-1/2 mb-3">
                  <FaEnvelope className="text-gray-400 mr-3" />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full outline-none text-sm"
                    required
                  />
                </div>
              </div>

              {/* Subject */}
              <div className="flex items-center bg-white rounded-lg px-4 py-3 shadow-sm mb-3">
                <FaClock className="text-gray-400 mr-3" />
                <input
                  type="text"
                  name="subject"
                  placeholder="Subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full outline-none text-sm"
                />
              </div>

              {/* Message */}
              <div className="flex items-start bg-white rounded-lg px-4 py-3 shadow-sm mb-3">
                <FaCommentDots className="text-gray-400 mr-3 mt-1" />
                <textarea
                  name="message"
                  placeholder="Message"
                  rows="3"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full outline-none text-sm resize-none"
                  required
                ></textarea>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className={`bg-[#051A6F] text-white text-sm px-6 py-3 rounded-md hover:bg-[#03114d] transition ${
                  loading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {loading ? 'Submitting...' : 'Submit'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}