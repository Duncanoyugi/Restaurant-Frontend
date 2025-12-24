import React, { useState, useEffect } from 'react';
import { useRestaurant } from '../../contexts/RestaurantContext';
import { Star, MessageCircle, ThumbsUp, Search, User } from 'lucide-react';

interface Review {
  id: number;
  customerName: string;
  customerEmail: string;
  rating: number;
  comment: string;
  createdAt: string;
  helpfulCount: number;
  response?: string;
}

const RestaurantReviews: React.FC = () => {
  const { selectedRestaurant } = useRestaurant();
  
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState<'all' | 1 | 2 | 3 | 4 | 5>('all');
  const [expandedReviewId, setExpandedReviewId] = useState<number | null>(null);
  const [responseText, setResponseText] = useState('');
  const [respondingTo, setRespondingTo] = useState<number | null>(null);

  // Fetch reviews for the current restaurant
  useEffect(() => {
    const fetchReviews = async () => {
      if (!selectedRestaurant) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Fetch reviews from backend
        const response = await fetch(`/api/reviews/restaurant/${selectedRestaurant.id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch reviews');
        }
        
        const data = await response.json();
        setReviews(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch reviews');
        console.error('Error fetching reviews:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchReviews();
  }, [selectedRestaurant]);

  const handleResponseSubmit = async (reviewId: number) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/reviews/${reviewId}/response`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ response: responseText })
      });
      
      if (!response.ok) {
        throw new Error('Failed to add response');
      }
      
      // Refresh reviews list
      if (selectedRestaurant) {
        const updatedResponse = await fetch(`/api/reviews/restaurant/${selectedRestaurant.id}`);
        const updatedData = await updatedResponse.json();
        setReviews(updatedData);
      }
      
      // Reset response form
      setRespondingTo(null);
      setResponseText('');
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add response');
      console.error('Error adding response:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkHelpful = async (reviewId: number) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/reviews/${reviewId}/helpful`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to mark as helpful');
      }
      
      // Refresh reviews list
      if (selectedRestaurant) {
        const updatedResponse = await fetch(`/api/reviews/restaurant/${selectedRestaurant.id}`);
        const updatedData = await updatedResponse.json();
        setReviews(updatedData);
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mark as helpful');
      console.error('Error marking as helpful:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = 
      review.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRating = ratingFilter === 'all' || review.rating === ratingFilter;
    
    return matchesSearch && matchesRating;
  });

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return 'text-green-500';
    if (rating >= 3) return 'text-yellow-500';
    return 'text-red-500';
  };

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / reviews.length;
  };

  if (!selectedRestaurant) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative">
          <strong className="font-bold">Info!</strong>
          <span className="block sm:inline"> Please select a restaurant first.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
          <MessageCircle className="w-6 h-6" />
          Customer Reviews
        </h1>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h2 className="text-xl font-semibold mb-2">Overall Rating</h2>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold">{calculateAverageRating().toFixed(1)}</span>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-6 h-6 ${calculateAverageRating() >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                  />
                ))}
              </div>
              <span className="text-gray-500 dark:text-gray-400">({reviews.length} reviews)</span>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search reviews..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value as typeof ratingFilter)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-8">
          <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">No reviews yet. Customers will be able to leave reviews after visiting.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredReviews.map((review) => (
            <div key={review.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-100 dark:bg-primary-800 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-primary-600 dark:text-primary-300" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-white">{review.customerName}</h3>
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${review.rating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                      <span className={`text-sm font-medium ${getRatingColor(review.rating)}`}>
                        {review.rating} stars
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(review.createdAt).toLocaleDateString()}
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                {expandedReviewId === review.id ? review.comment : `${review.comment.substring(0, 200)}${review.comment.length > 200 ? '...' : ''}`}
              </p>
              {review.comment.length > 200 && (
                <button
                  onClick={() => setExpandedReviewId(expandedReviewId === review.id ? null : review.id)}
                  className="text-primary-600 dark:text-primary-400 text-sm font-medium hover:underline mb-4"
                >
                  {expandedReviewId === review.id ? 'Show less' : 'Show more'}
                </button>
              )}
              <div className="flex items-center gap-4 mb-4">
                <button
                  onClick={() => handleMarkHelpful(review.id)}
                  className="flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 text-sm"
                >
                  <ThumbsUp className="w-4 h-4" />
                  Helpful ({review.helpfulCount})
                </button>
              </div>
              {review.response && (
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mt-4">
                  <h4 className="font-medium text-gray-800 dark:text-white mb-2">Restaurant Response</h4>
                  <p className="text-gray-600 dark:text-gray-300">{review.response}</p>
                </div>
              )}
              {!review.response && respondingTo !== review.id && (
                <button
                  onClick={() => {
                    setRespondingTo(review.id);
                    setResponseText('');
                  }}
                  className="text-primary-600 dark:text-primary-400 text-sm font-medium hover:underline mt-4"
                >
                  Respond to this review
                </button>
              )}
              {respondingTo === review.id && (
                <div className="mt-4">
                  <textarea
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    placeholder="Write your response..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white mb-2"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleResponseSubmit(review.id)}
                      disabled={loading || !responseText.trim()}
                      className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-primary-700 hover:to-secondary-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Submitting...' : 'Submit Response'}
                    </button>
                    <button
                      onClick={() => setRespondingTo(null)}
                      className="bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-500 transition-all duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RestaurantReviews;