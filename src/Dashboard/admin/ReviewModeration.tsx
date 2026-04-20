import React, { useMemo, useState } from 'react';
import {
  useDeleteReviewMutation,
  useGetAllReviewsQuery,
  useVerifyReviewMutation,
} from '../../features/reviews/reviewsApi';

const ReviewModeration: React.FC = () => {
  const [search, setSearch] = useState('');
  const [ratingFilter, setRatingFilter] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading, error, refetch } = useGetAllReviewsQuery({
    page,
    limit: 20,
    search: search || undefined,
    minRating: ratingFilter ? Number(ratingFilter) : undefined,
  });

  const [verifyReview, { isLoading: verifying }] = useVerifyReviewMutation();
  const [deleteReview, { isLoading: deleting }] = useDeleteReviewMutation();

  const reviews = data?.data || [];
  const totalPages = data?.totalPages || 1;

  const summary = useMemo(() => {
    return reviews.reduce(
      (acc, review) => {
        acc.total += 1;
        if (review.verified) acc.verified += 1;
        if (!review.verified) acc.pending += 1;
        return acc;
      },
      { total: 0, verified: 0, pending: 0 },
    );
  }, [reviews]);

  const handleVerify = async (reviewId: string) => {
    try {
      await verifyReview(reviewId).unwrap();
      refetch();
    } catch (verifyError) {
      console.error('Failed to verify review', verifyError);
    }
  };

  const handleDelete = async (reviewId: string) => {
    if (!window.confirm('Delete this review permanently?')) return;

    try {
      await deleteReview(reviewId).unwrap();
      refetch();
    } catch (deleteError) {
      console.error('Failed to delete review', deleteError);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Review Moderation</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Moderate customer feedback, approve authentic reviews, and remove harmful content.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-5">
          <p className="text-sm text-gray-500 dark:text-gray-400">Visible Reviews</p>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-2">{summary.total}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-5">
          <p className="text-sm text-gray-500 dark:text-gray-400">Verified</p>
          <p className="text-2xl font-semibold text-emerald-600 mt-2">{summary.verified}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-5">
          <p className="text-sm text-gray-500 dark:text-gray-400">Pending Verification</p>
          <p className="text-2xl font-semibold text-amber-600 mt-2">{summary.pending}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            value={search}
            onChange={(event) => {
              setPage(1);
              setSearch(event.target.value);
            }}
            placeholder="Search by comment, reviewer, or restaurant..."
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-gray-900 dark:text-white"
          />
          <select
            value={ratingFilter}
            onChange={(event) => {
              setPage(1);
              setRatingFilter(event.target.value);
            }}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-gray-900 dark:text-white"
          >
            <option value="">All ratings</option>
            <option value="5">5 stars</option>
            <option value="4">4 stars and above</option>
            <option value="3">3 stars and above</option>
            <option value="2">2 stars and above</option>
            <option value="1">1 star and above</option>
          </select>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">Loading reviews...</div>
        ) : error ? (
          <div className="p-8 text-center text-red-600 dark:text-red-400">
            Failed to load reviews for moderation.
          </div>
        ) : reviews.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            No reviews match the current moderation filters.
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {reviews.map((review) => (
              <div key={review.id} className="p-5">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {review.user?.name || 'Unknown customer'}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {review.restaurant?.name || review.menuItem?.name || 'General feedback'}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-full ${review.verified ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                        {review.verified ? 'Verified' : 'Pending'}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Rating: {review.rating}/5
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">{review.comment || 'No comment provided.'}</p>
                    {review.adminResponse && (
                      <div className="rounded-lg bg-gray-50 dark:bg-gray-700 p-3 text-sm text-gray-700 dark:text-gray-300">
                        <span className="font-medium">Owner response:</span> {review.adminResponse}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {!review.verified && (
                      <button
                        type="button"
                        onClick={() => handleVerify(review.id)}
                        disabled={verifying}
                        className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
                      >
                        Verify
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleDelete(review.id)}
                      disabled={deleting}
                      className="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-60"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setPage((current) => Math.max(1, current - 1))}
          disabled={page === 1}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Page {page} of {totalPages}
        </span>
        <button
          type="button"
          onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
          disabled={page >= totalPages}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ReviewModeration;
