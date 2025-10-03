'use client';
import { useState, useEffect } from 'react';
import { MultiSelect } from 'primereact/multiselect';
import { Dropdown } from 'primereact/dropdown';
import { api } from '../../lib/api';

export default function Settings() {
  const [members, setMembers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [timeOptions] = useState([
    { label: '1 hour', value: '1h' },
    { label: '2 hours', value: '2h' },
    { label: '3 hours', value: '3h' },
    { label: '4 hours', value: '4h' },
    { label: '5 hours', value: '5h' },
    { label: '1 day', value: '1d' },
    { label: '1 week', value: '1w' }
  ]);
  const [selectedTime, setSelectedTime] = useState(timeOptions[0].value);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Fetch members data on component mount
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);
        const response = await api.get('/get-agent');
        
        if (response.data && Array.isArray(response.data)) {
          const formattedMembers = response.data.map(item => ({
            id: item._id || '',
            name: `${item.first_name} ${item.last_name || ''}`.trim(),
            email: item.email || '',
            affiliate_code: item.affiliate_code || '',
            displayName: `${item.first_name} ${item.last_name || ''}`.trim() + 
                        (item.affiliate_code ? ` (${item.affiliate_code})` : '')
          }));
          setMembers(formattedMembers);
        }
      } catch (err) {
        console.error('Failed to fetch members:', err);
        setError('Failed to load members');
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  // Fetch settings when members are loaded
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await api.get('/admin/get-promote-agent');
        
        if (response.response === "success" && response.data) {
          const settingsData = response.data;
          
          if (settingsData.agent && Array.isArray(settingsData.agent)) {
            const selectedMemberObjects = members.filter(member => 
              settingsData.agent.includes(member.id)
            );
            setSelectedMembers(selectedMemberObjects);
          }
          
          if (settingsData.timeOption) {
            let timeOption = timeOptions.find(option => 
              option.value === settingsData.timeOption.trim()
            );
            setSelectedTime(timeOption ? timeOption.value : timeOptions[0].value);
          } else {
            setSelectedTime(timeOptions[0].value);
          }
        } else {
          setSelectedMembers([]);
          setSelectedTime(timeOptions[0].value);
        }
      } catch (err) {
        console.error('Failed to fetch settings:', err);
        setSelectedMembers([]);
        setSelectedTime(timeOptions[0].value);
      }
    };

    if (members.length > 0 && timeOptions.length > 0) {
      fetchSettings();
    }
  }, [members, timeOptions]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const selectedMemberIds = selectedMembers.map(member => member.id);
      
      const timeOptionValue = selectedTime || timeOptions[0].value;
      
      const payload = {
        agent: selectedMemberIds,
        timeOption: timeOptionValue
      };

      const response = await api.post('/admin/promote-agent', payload);

      if (response.response === "success") {
        setSuccess(true);
      } else {
        setError(response.message || response.error || 'Failed to save settings');
      }
    } catch (err) {
      console.error('Submission error:', err);
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">Manage your team members and notification preferences</p>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">Settings saved successfully!</p>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
          </div>
        )}

        {/* Main Form Card */}
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
          <div className="px-6 py-8 sm:px-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Form Header */}
              <div className="border-b border-gray-200 pb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Team Configuration</h2>
                <p className="text-gray-600">Select team members and set promotions preferences</p>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* MultiSelect for members */}
                <div className="lg:col-span-2">
                  <label className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                    Select Team Members
                  </label>
                  {loading ? (
                    <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 flex items-center justify-center">
                      <div className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="text-gray-600">Loading members...</span>
                      </div>
                    </div>
                  ) : (
                    <MultiSelect 
                      value={selectedMembers} 
                      onChange={(e) => setSelectedMembers(e.value)} 
                      options={members} 
                      optionLabel="displayName" 
                      filter 
                      placeholder="Choose team members..." 
                      maxSelectedLabels={3} 
                      className="w-full" 
                      display="chip"
                      showClear
                    />
                  )}
                  <p className="mt-2 text-sm text-gray-500">
                    {selectedMembers.length} member{selectedMembers.length !== 1 ? 's' : ''} selected
                  </p>
                </div>

                {/* Dropdown for time options */}
                <div className="lg:col-span-1">
                  <label className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Shuffle Member ID Duration
                  </label>
                  <Dropdown 
                    value={selectedTime} 
                    onChange={(e) => setSelectedTime(e.value)} 
                    options={timeOptions} 
                    optionLabel="label" 
                    optionValue="value"
                    placeholder="Select duration..." 
                    className="w-full" 
                    showClear
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    How long to keep notifications active
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={loading}
                  className={`flex-1 sm:flex-none sm:px-8 py-3 px-6 rounded-lg text-white font-semibold transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 ${
                    loading 
                      ? 'bg-blue-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl'
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving Settings...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Save Settings
                    </div>
                  )}
                </button>
                
                <button
                  type="button"
                  onClick={() => {
                    setSelectedMembers([]);
                    setSelectedTime(timeOptions[0].value);
                    setError(null);
                    setSuccess(false);
                  }}
                  className="flex-1 sm:flex-none sm:px-8 py-3 px-6 rounded-lg border border-gray-300 text-gray-700 font-semibold transition-all duration-200 hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-4 focus:ring-gray-300"
                >
                  <div className="flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Reset
                  </div>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}