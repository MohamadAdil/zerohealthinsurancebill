'use client';

import { useState } from 'react';
import { api } from '@/lib/api';

export default function StepTwoForm() {
  const [formData, setFormData] = useState({
    email: '',
    monthly_insurance_emi: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const isValidObjectId = (id) => {
    return /^[0-9a-fA-F]{24}$/.test(id);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const { email } = formData;

      // Validate required fields
      if (!email) {
        throw new Error('email is required.');
      }

      // Validate email format
      if (!/^\S+@\S+\.\S+$/.test(email)) {
        throw new Error('Please enter a valid email address.');
      }

      const response = await api.post('/create-quote2', formData);

      if (response.response === 'success') {
        setSuccess(true);
        setFormData({
          email: '',
        });
      } else {
        setError(response?.message || 'Failed to submit the form. Please try again.');
      }
    } catch (err) {
      setError(err?.message || 'An error occurred while submitting the form.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="">
      {success ? (
        <div className="p-4 mb-4 text-green-700 bg-green-100 rounded-md text-sm">
          Thank you! Your request has been submitted successfully.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-4 text-red-700 bg-red-100 rounded-md text-sm">
              {error}
            </div>
          )}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email*
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Enter your monthly insurance quote
            </label>
            <input
              type="text"
              id="monthly_insurance_emi"
              name="monthly_insurance_emi"
              value={formData.monthly_insurance_emi}
              placeholder='$'
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`block text-white text-sm md:text-base font-semibold px-8 py-4 rounded-lg hover:bg-[#031353] transition-all duration-300 ${
              loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-[#051a6f] hover:bg-blue-700'
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary`}
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      )}
    </div>
  );
}