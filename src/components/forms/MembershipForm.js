'use client';
import { useState, useEffect } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { api } from '../../lib/api';
import Image from 'next/image';

export default function MembershipForm({ initialData = null, onSuccess, isEditMode = false }) {
    console.log("initialData::", initialData);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    affiliate_code: '',
    affiliate_link: '',
    affiliate_link2: '',
    parent: '',
    picture: null,
    rating: '',
  });

  const [parentOptions, setParentOptions] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loadingParents, setLoadingParents] = useState(true);
  console.log("parentOptions::", parentOptions);
  // useEffect to fetch parent options on component mount
  useEffect(() => {
    const fetchParentOptions = async () => {
      try {
        setLoadingParents(true);
        const response = await api.get('/get-agent');
        let options = [];

        if (Array.isArray(response.data)) {
          options = response.data.map(item => ({
            id: item._id || '',
            name: `${item.first_name} (${item.affiliate_code || ''})`,
          }));
        }
        setParentOptions(options);
      } catch (err) {
        console.error('Failed to fetch parent options:', err);
        setParentOptions([]);
      } finally {
        setLoadingParents(false);
      }
    };

    fetchParentOptions();
  }, []); // Empty dependency array to run only once on mount

  // useEffect to set form data from initialData in edit mode,
  // waiting for parentOptions to be loaded
  useEffect(() => {
    if (isEditMode && initialData) {
      setFormData(prev => ({
        ...prev,
        first_name: initialData.first_name || '',
        last_name: initialData.last_name || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        affiliate_code: initialData.affiliate_code || '',
        affiliate_link: initialData.affiliate_link || '',
        affiliate_link2: initialData.affiliate_link2 || '',
        // Set the parent value only if parentOptions has been fetched
        parent: initialData.parent ? initialData.parent : '',
        rating: initialData.rating || '',
      }));
      
      if (initialData.profileImage) {
        setImagePreview(initialData.profileImage);
      }
    }
  }, [isEditMode, initialData, parentOptions]); // This effect depends on initialData and parentOptions

  const handleChange = e => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleImageUpload = e => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        picture: file,
      }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      if (!formData.first_name || !formData.email || !formData.affiliate_code) {
        throw new Error('First Name, Email, and Membership Code are required.');
      }

      if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
        throw new Error('Please enter a valid email address.');
      }

      const formPayload = new FormData();
      formPayload.append('first_name', formData.first_name);
      formPayload.append('last_name', formData.last_name);
      formPayload.append('email', formData.email);
      formPayload.append('affiliate_code', formData.affiliate_code);
      formPayload.append('parent', formData.parent);

      if (formData.phone) formPayload.append('phone', formData.phone);
      if (formData.affiliate_link) formPayload.append('affiliate_link', formData.affiliate_link);
      if (formData.affiliate_link2) formPayload.append('affiliate_link2', formData.affiliate_link2);
      if (formData.picture) formPayload.append('picture', formData.picture);
      if (formData.rating) formPayload.append('rating', formData.rating);

      let response;
      if (isEditMode && initialData?._id) {
        response = await api.post(`/update-agent/${initialData._id}`, formPayload, {}, false);
      } else {
        response = await api.post('/create-agent', formPayload, {}, false);
      }

      if (response.response === "success") {
        setSuccess(true);
        if (!isEditMode) {
          setFormData({
            first_name: '',
            last_name: '',
            email: '',
            phone: '',
            affiliate_code: '',
            affiliate_link: '',
            affiliate_link2: '',
            parent: '',
            picture: null,
            rating: '',
          });
          setImagePreview(null);
        }
        if (onSuccess) onSuccess();
      } else {
        setError(response.message || response.error || 'Failed to submit the form.');
      }
    } catch (err) {
      console.error('Submission error:', err);
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isEditMode ? 'Update Member Profile' : 'Join Our Community'}
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {isEditMode 
              ? 'Update your member information and preferences' 
              : 'Fill out the form below to become a member of our exclusive community'
            }
          </p>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">
                {isEditMode ? 'Member updated successfully!' : 'Thank you! Your membership request has been submitted successfully.'}
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
          </div>
        )}

        {/* Main Form Card */}
        <div className="bg-white shadow-2xl rounded-3xl overflow-hidden">
          <form onSubmit={handleSubmit} encType="multipart/form-data" className="p-8">
            {/* Profile Image Section */}
            <div className="text-center mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center justify-center">
                <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Profile Picture
              </h2>
              
              <div className="flex flex-col items-center">
                <div className="relative">
                  <div className="h-32 w-32 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 overflow-hidden flex items-center justify-center border-4 border-white shadow-lg">
                    {imagePreview ? (
                      <Image
                        src={imagePreview}
                        alt="Profile Preview"
                        width={128}
                        height={128}
                        className="h-full w-full object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="text-center">
                        <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span className="text-gray-500 text-sm">No image</span>
                      </div>
                    )}
                  </div>
                  
                  <label className="absolute -bottom-2 -right-2 cursor-pointer">
                    <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 transition-colors">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="sr-only" />
                  </label>
                </div>
                
                <p className="mt-4 text-sm text-gray-500">Click the + button to upload a profile picture</p>
              </div>
            </div>

            {/* Personal Information Section */}
            <div className="mb-8">
              <div className="border-b border-gray-200 pb-4 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Personal Information
                </h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { id: 'first_name', label: 'First Name', required: true, icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
                  { id: 'last_name', label: 'Last Name', required: false, icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
                ].map(({ id, label, required, icon }) => (
                  <div key={id} className="relative">
                    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
                      {label} {required && <span className="text-red-500">*</span>}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
                        </svg>
                      </div>
                      <input
                        type="text"
                        id={id}
                        value={formData[id]}
                        required={required}
                        onChange={handleChange}
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder={`Enter your ${label.toLowerCase()}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Information Section */}
            <div className="mb-8">
              <div className="border-b border-gray-200 pb-4 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Contact Information
                </h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { id: 'email', label: 'Email Address', type: 'email', required: true, icon: 'M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
                  { id: 'phone', label: 'Phone Number', type: 'tel', required: false, icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z' },
                ].map(({ id, label, type, required, icon }) => (
                  <div key={id} className="relative">
                    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
                      {label} {required && <span className="text-red-500">*</span>}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
                        </svg>
                      </div>
                      <input
                        type={type}
                        id={id}
                        value={formData[id]}
                        required={required}
                        onChange={handleChange}
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder={`Enter your ${label.toLowerCase()}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Membership Information Section */}
            <div className="mb-8">
              <div className="border-b border-gray-200 pb-4 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Membership Information
                </h3>
              </div>
              
              <div className="space-y-6">
                <div className="relative">
                  <label htmlFor="affiliate_code" className="block text-sm font-medium text-gray-700 mb-2">
                    Membership Code <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 12a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2m0 0a3 3 0 11-5.656 0" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      id="affiliate_code"
                      value={formData.affiliate_code}
                      required
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Enter your unique membership code"
                    />
                  </div>
                </div>

                <div className="relative">
                  <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-2">
                    Member rating (0 to 10)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                    </div>
                    <input
                      type="number"
                      id="rating"
                      value={formData.rating}
                      onChange={handleChange}
                      min="0"
                      max="10"
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Enter rating from 0 to 10"
                    />
                  </div>
                </div>

                <div className="relative">
                  <label htmlFor="parent" className="block text-sm font-medium text-gray-700 mb-2">
                    Select Parent Member
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    {loadingParents ? (
                      <div className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500">
                        <div className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Loading parent options...
                        </div>
                      </div>
                    ) : (
                      <Dropdown
                        value={formData.parent}
                        onChange={(e) => {
                          console.log('Parent dropdown onChange:', e);
                          setFormData(prev => ({
                            ...prev,
                            parent: e.value
                          }));
                        }}
                        options={[
                          { label: '-- Select Parent Member --', value: '' },
                          ...parentOptions.map(option => ({
                            label: option.name,
                            value: option.id
                          }))
                        ]}
                        optionLabel="label"
                        placeholder="Search and select parent member..."
                        filter
                        showClear
                        className="w-full"
                        style={{ paddingLeft: '2.5rem' }}
                        panelClassName="border border-gray-300 rounded-lg shadow-lg"
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Affiliate Links Section */}
            <div className="mb-8">
              <div className="border-b border-gray-200 pb-4 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  Affiliate Links
                </h3>
              </div>
              
              <div className="space-y-6">
                {[
                  { id: 'affiliate_link', label: 'Get a Quote Link', type: 'url', icon: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1' },
                  { id: 'affiliate_link2', label: 'Additional Affiliate Link', type: 'url', icon: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1' },
                ].map(({ id, label, type, icon }) => (
                  <div key={id} className="relative">
                    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
                      {label}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
                        </svg>
                      </div>
                      <input
                        type={type}
                        id={id}
                        value={formData[id]}
                        onChange={handleChange}
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder={`Enter your ${label.toLowerCase()}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={loading}
                className={`flex-1 sm:flex-none sm:px-8 py-4 px-6 rounded-lg text-white font-semibold transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 ${
                  loading 
                    ? 'bg-blue-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl'
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {isEditMode ? 'Updating Member...' : 'Creating Membership...'}
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {isEditMode ? 'Update Member' : 'Create Membership'}
                  </div>
                )}
              </button>
              
              {!isEditMode && (
                <button
                  type="button"
                  onClick={() => {
                    setFormData({
                      first_name: '',
                      last_name: '',
                      email: '',
                      phone: '',
                      affiliate_code: '',
                      affiliate_link: '',
                      affiliate_link2: '',
                      parent: '',
                      picture: null,
                      rating: '',
                    });
                    setImagePreview(null);
                    setError(null);
                    setSuccess(false);
                  }}
                  className="flex-1 sm:flex-none sm:px-8 py-4 px-6 rounded-lg border border-gray-300 text-gray-700 font-semibold transition-all duration-200 hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-4 focus:ring-gray-300"
                >
                  <div className="flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Reset Form
                  </div>
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}