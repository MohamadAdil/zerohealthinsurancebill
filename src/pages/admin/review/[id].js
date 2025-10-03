'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { api } from '@/lib/api';
import { FiStar, FiArrowLeft, FiCheckCircle, FiUser, FiEdit3 } from 'react-icons/fi';
import { useUI } from '@/context/UIContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Image from 'next/image';
import MembershipForm from '@/components/forms/MembershipForm';

export default function ReviewPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params?.id;
  const { showToast } = useUI();
  
  const [activeTab, setActiveTab] = useState('membership'); // 'membership' or 'review'
  const [memberData, setMemberData] = useState(null);
  const [review, setReview] = useState({
    userId,
    star: 0,
    description: ''
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) {
      setError('User ID is required11');
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch member data
        const memberResponse = await api.get(`/get-agent-detail/${userId}`);
        
        if (memberResponse?.response === "success" && memberResponse?.data) {
          setMemberData(memberResponse.data);
        }

        // Fetch review data
        const reviewResponse = await api.get(`/admin/get-review/${userId}`);
        
        if (reviewResponse?.data) {
          const reviewData = reviewResponse?.data;
          setReview({
            ...reviewData,
            star: Number(reviewData.star) || 0
          });
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message || 'Failed to fetch data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const handleStarChange = (star) => {
    setReview(prev => ({ ...prev, star }));
  };

  const handleDescriptionChange = (e) => {
    setReview(prev => ({ ...prev, description: e.target.value }));
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response = await api.post(
        `/admin/create-update-review/${userId}`,
        {
          star: review.star,
          description: review.description
        }
      );

      if (response.response === "success") {
        showToast(`Review ${review.id ? 'updated' : 'submitted'} successfully!`, 'success');
      } else {
        setError(response.error || 'Failed to submit review');
        showToast(response.error || 'Failed to submit review', 'error');
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred');
      showToast(err.message || 'An unexpected error occurred', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleMemberUpdateSuccess = () => {
    showToast('Member details updated successfully!', 'success');
    // Refresh member data
    fetchMemberData();
  };

  const fetchMemberData = async () => {
    try {
      const memberResponse = await api.get(`/get-agent-detail/${userId}`);
      if (memberResponse?.response === "success" && memberResponse?.data) {
        setMemberData(memberResponse.data);
      }
    } catch (err) {
      console.error('Error fetching member data:', err);
    }
  };

  if (loading) {
    return (
      <div className="py-12 bg-gray-50 min-h-screen">
        <div className="max-w-6xl mx-auto px-4">
          <div className="animate-pulse bg-white p-6 rounded-lg shadow">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="space-y-4">
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded w-1/3"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="py-12 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        <button
          onClick={() => router.push('/admin/dashboard')}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
        >
          <FiArrowLeft className="mr-2" /> Back to Dashboard
        </button>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
            <div className="flex items-center mb-4">
              {memberData?.profileImage ? (
                <Image
                  src={memberData.profileImage}
                  alt="Profile"
                  width={80}
                  height={80}
                  className="w-20 h-20 rounded-full object-cover mr-4 border-4 border-white/20"
                  unoptimized
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mr-4 border-4 border-white/20">
                  <FiUser className="w-8 h-8 text-white" />
                </div>
              )}
              <div>
                <h1 className="text-2xl font-bold">
                  {memberData?.first_name} {memberData?.last_name}
                </h1>
                <p className="text-blue-100">{memberData?.email}</p>
                <p className="text-blue-100 text-sm">Member ID: {memberData?.affiliate_code}</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('membership')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'membership'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <FiUser className="inline w-4 h-4 mr-2" />
                Membership Details
              </button>
              <button
                onClick={() => setActiveTab('review')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'review'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <FiStar className="inline w-4 h-4 mr-2" />
                Member Review
              </button>
            </nav>
          </div>

          {error && (
            <div className="m-6 text-red-700 bg-red-100 rounded-md p-4">
              Error: {error}
            </div>
          )}

          {/* Membership Form Tab */}
          {activeTab === 'membership' && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Edit Member Details</h2>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  Editing: {memberData?.first_name} {memberData?.last_name}
                </span>
              </div>

              <MembershipForm 
                initialData={memberData}
                onSuccess={handleMemberUpdateSuccess}
                isEditMode={true}
              />
            </div>
          )}

          {/* Review Tab */}
          {activeTab === 'review' && (
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                {review.id ? 'Edit Your Review' : 'Write a Review'} for {memberData?.first_name} {memberData?.last_name}
              </h2>

              <form onSubmit={handleReviewSubmit}>
                <div className="mb-6">
                  <label className="block text-gray-700 font-medium mb-2">
                    Rating
                  </label>
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => handleStarChange(star)}
                        className={`p-2 rounded-full transition-transform hover:scale-110 ${
                          review.star >= star ? 'text-yellow-500' : 'text-gray-300'
                        }`}
                      >
                        <FiStar size={32} fill={review.star >= star ? 'currentColor' : 'none'} />
                      </button>
                    ))}
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    Select between 1 to 5 stars
                  </p>
                </div>

                <div className="mb-6">
                  <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
                    Review Comments
                  </label>
                  <textarea
                    id="description"
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Write your detailed review here..."
                    value={review.description}
                    onChange={handleDescriptionChange}
                    required
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setActiveTab('membership')}
                    className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center"
                  >
                    <FiEdit3 className="mr-2" />
                    Edit Member Details
                  </button>
                  <button
                    type="submit"
                    disabled={submitting || review.star === 0}
                    className={`px-6 py-2 rounded-md text-white flex items-center ${
                      submitting || review.star === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    {submitting ? (
                      'Processing...'
                    ) : (
                      <>
                        <FiCheckCircle className="mr-2" />
                        {review.id ? 'Update Review' : 'Submit Review'}
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Existing Review Display */}
              {review.id && (
                <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Current Review</h3>
                  <div className="flex items-center mb-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FiStar
                          key={star}
                          size={20}
                          className={star <= review.star ? 'text-yellow-500 fill-current' : 'text-gray-300'}
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-600">{review.star} out of 5 stars</span>
                  </div>
                  <p className="text-gray-700">{review.description}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}