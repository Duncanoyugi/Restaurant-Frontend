import React, { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { 
  useGetReviewsQuery, 
  useCreateReviewMutation, 
  useUpdateReviewMutation,
  useDeleteReviewMutation 
} from '../../features/customer/customerApi';
import { format } from 'date-fns';
import type { Review } from '../../types/reviews';

const ReviewsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'my-reviews' | 'pending'>('my-reviews');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [editingReview, setEditingReview] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data: reviewsData, isLoading, refetch } = useGetReviewsQuery({
    page,
    limit,
    type: activeTab === 'my-reviews' ? undefined : 'RESTAURANT',
  });

  const [createReview] = useCreateReviewMutation();
  const [updateReview] = useUpdateReviewMutation();
  const [deleteReview] = useDeleteReviewMutation();

  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: '',
    restaurantId: '',
    menuItemId: '',
    images: [] as string[],
  });

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingReview) {
        await updateReview({ id: editingReview, data: reviewForm }).unwrap();
        setEditingReview(null);
      } else {
        await createReview(reviewForm).unwrap();
      }
      setShowReviewForm(false);
      setReviewForm({
        rating: 5,
        comment: '',
        restaurantId: '',
        menuItemId: '',
        images: [],
      });
      refetch();
    } catch (error) {
      console.error('Failed to submit review:', error);
    }
  };

  const handleEditReview = (review: Review) => {
    setReviewForm({
      rating: review.rating,
      comment: review.comment,
      restaurantId: review.restaurantId || '',
      menuItemId: review.menuItemId || '',
      images: review.images || [],
    });
    setEditingReview(review.id);
    setShowReviewForm(true);
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await deleteReview(reviewId).unwrap();
        refetch();
      } catch (error) {
        console.error('Failed to delete review:', error);
      }
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`text-xl ${star <= rating ? 'text-yellow-500' : 'text-gray-300'}`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          ))}
        </div>
      </DashboardLayout>
    );
  }

  const reviews = reviewsData?.reviews || [];
  const total = reviewsData?.total || 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Reviews</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Share your dining experiences and feedback
            </p>
          </div>
          <button
            onClick={() => setShowReviewForm(true)}
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <span className="mr-2">⭐</span>
            Write a Review
          </button>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-1 shadow-soft border border-gray-100 dark:border-gray-700">
          <div className="flex">
            <button
              onClick={() => setActiveTab('my-reviews')}
              className={`flex-1 py-3 px-4 text-center font-medium rounded-lg transition-colors ${activeTab === 'my-reviews' ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300' : 'text-gray-700 dark:text-gray-300'}`}
            >
              My Reviews
            </button>
            <button
              onClick={() => setActiveTab('pending')}
              className={`flex-1 py-3 px-4 text-center font-medium rounded-lg transition-colors ${activeTab === 'pending' ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300' : 'text-gray-700 dark:text-gray-300'}`}
            >
              Pending Reviews
            </button>
          </div>
        </div>

        {/* Review Form Modal */}
        {showReviewForm && (
          <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-lg">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {editingReview ? 'Edit Review' : 'Write a Review'}
                </h3>
                <button
                  onClick={() => {
                    setShowReviewForm(false);
                    setEditingReview(null);
                  }}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmitReview} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Rating
                  </label>
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        type="button"
                        onClick={() => setReviewForm({ ...reviewForm, rating })}
                        className={`text-3xl ${rating <= reviewForm.rating ? 'text-yellow-500' : 'text-gray-300'} hover:text-yellow-400`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Your Review
                  </label>
                  <textarea
                    value={reviewForm.comment}
                    onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    rows={4}
                    required
                    placeholder="Share your experience..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Restaurant (Optional)
                    </label>
                    <input
                      type="text"
                      value={reviewForm.restaurantId}
                      onChange={(e) => setReviewForm({ ...reviewForm, restaurantId: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Select restaurant..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Menu Item (Optional)
                    </label>
                    <input
                      type="text"
                      value={reviewForm.menuItemId}
                      onChange={(e) => setReviewForm({ ...reviewForm, menuItemId: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Select menu item..."
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    type="button"
                    onClick={() => {
                      setShowReviewForm(false);
                      setEditingReview(null);
                    }}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    {editingReview ? 'Update Review' : 'Submit Review'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Reviews List */}
        <div className="space-y-4">
          {reviews.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-soft border border-gray-100 dark:border-gray-700">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No reviews found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {activeTab === 'my-reviews' 
                  ? "You haven't written any reviews yet."
                  : "No reviews pending submission."}
              </p>
              {activeTab === 'my-reviews' && (
                <button
                  onClick={() => setShowReviewForm(true)}
                  className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <span className="mr-2">⭐</span>
                  Write Your First Review
                </button>
              )}
            </div>
          ) : (
            reviews.map((review: Review) => (
              <div
                key={review.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-soft border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                          <span className="text-primary-700 dark:text-primary-300 font-semibold">
                            {review.user?.name?.charAt(0).toUpperCase() || 'U'}
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {review.user?.name || 'Anonymous'}
                            </h3>
                            {review.verified && (
                              <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 text-xs rounded-full">
                                Verified
                              </span>
                            )}
                          </div>
                          <div className="flex items-center space-x-2 mt-1">
                            {renderStars(review.rating)}
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {format(new Date(review.createdAt), 'MMM dd, yyyy')}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 md:mt-0">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditReview(review)}
                          className="px-3 py-1 text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteReview(review.id)}
                          className="px-3 py-1 text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-gray-700 dark:text-gray-300">
                      {review.comment}
                    </p>
                  </div>

                  {(review.restaurant || review.menuItem) && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Reviewed {review.menuItem ? 'menu item' : 'restaurant'}
                      </p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {review.menuItem?.name || review.restaurant?.name}
                      </p>
                    </div>
                  )}

                  {review.images && review.images.length > 0 && (
                    <div className="mb-4">
                      <div className="flex space-x-2 overflow-x-auto">
                        {review.images.map((image: string, index: number) => (
                          <img
                            key={index}
                            src={image}
                            alt="Review"
                            className="w-24 h-24 object-cover rounded-lg"
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {review.adminResponse && (
                    <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          Restaurant Response
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {review.responseDate && format(new Date(review.responseDate), 'MMM dd, yyyy')}
                        </span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300">
                        {review.adminResponse}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {Math.ceil(total / limit) > 1 && (
          <div className="flex justify-center items-center space-x-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-gray-700 dark:text-gray-300">
              Page {page} of {Math.ceil(total / limit)}
            </span>
            <button
              onClick={() => setPage(p => Math.min(Math.ceil(total / limit), p + 1))}
              disabled={page === Math.ceil(total / limit)}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ReviewsPage;