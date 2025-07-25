import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { feedbackService } from '../../services/feedback';
import { toast } from 'react-hot-toast';
import { StarIcon } from '@heroicons/react/20/solid';

interface FeedbackData {
  exerciseId: number;
  rating: number;
  difficulty: string;
  comment: string;
  isHelpful: boolean;
}

const FeedbackPage: React.FC = () => {
  const { exerciseId } = useParams<{ exerciseId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [exercise, setExercise] = useState<any>(null);
  const [feedback, setFeedback] = useState<FeedbackData>({
    exerciseId: parseInt(exerciseId || '0'),
    rating: 0,
    difficulty: '',
    comment: '',
    isHelpful: false
  });

  useEffect(() => {
    if (exerciseId) {
      fetchExercise();
    }
  }, [exerciseId]);

  const fetchExercise = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/exercises/${exerciseId}`);
      if (response.ok) {
        const data = await response.json();
        setExercise(data);
      } else {
        throw new Error('Failed to load exercise');
      }
    } catch (error: any) {
      toast.error('Failed to load exercise details');
      console.error('Error fetching exercise:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRatingChange = (rating: number) => {
    setFeedback(prev => ({ ...prev, rating }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFeedback(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (feedback.rating === 0) {
      toast.error('Please provide a rating');
      return;
    }

    if (!feedback.difficulty) {
      toast.error('Please select difficulty level');
      return;
    }

    setSubmitting(true);
    try {
      const result = await feedbackService.submitExerciseFeedback(feedback);
      if (result.success) {
        toast.success('Thank you for your feedback!');
        navigate('/exercises');
      } else {
        toast.error(result.message);
      }
    } catch (error: any) {
      toast.error('Failed to submit feedback');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading exercise details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-indigo-600 hover:text-indigo-700 mb-4"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Exercise
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Exercise Feedback</h1>
          <p className="text-gray-600">Help us improve by sharing your experience with this exercise</p>
        </div>

        {/* Exercise Info */}
        {exercise && (
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Exercise Details</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Title</span>
                <span className="font-medium text-gray-900">{exercise.title}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Type</span>
                <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
                  {exercise.type}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Difficulty</span>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  {exercise.difficulty}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Feedback Form */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Rating */}
            <div>
              <label className="block text-lg font-medium text-gray-900 mb-4">
                How would you rate this exercise?
              </label>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRatingChange(star)}
                    className={`p-2 rounded-lg transition-colors ${
                      feedback.rating >= star
                        ? 'text-yellow-400 hover:text-yellow-500'
                        : 'text-gray-300 hover:text-gray-400'
                    }`}
                  >
                    <StarIcon className="w-8 h-8" />
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-2">
                {feedback.rating === 0 && 'Click to rate'}
                {feedback.rating === 1 && 'Poor'}
                {feedback.rating === 2 && 'Fair'}
                {feedback.rating === 3 && 'Good'}
                {feedback.rating === 4 && 'Very Good'}
                {feedback.rating === 5 && 'Excellent'}
              </p>
            </div>

            {/* Difficulty */}
            <div>
              <label className="block text-lg font-medium text-gray-900 mb-4">
                How difficult was this exercise for you?
              </label>
              <select
                name="difficulty"
                value={feedback.difficulty}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              >
                <option value="">Select difficulty level</option>
                <option value="TOO_EASY">Too Easy</option>
                <option value="EASY">Easy</option>
                <option value="JUST_RIGHT">Just Right</option>
                <option value="DIFFICULT">Difficult</option>
                <option value="TOO_DIFFICULT">Too Difficult</option>
              </select>
            </div>

            {/* Helpful */}
            <div>
              <label className="block text-lg font-medium text-gray-900 mb-4">
                Was this exercise helpful for your learning?
              </label>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="isHelpful"
                    value="true"
                    checked={feedback.isHelpful === true}
                    onChange={() => setFeedback(prev => ({ ...prev, isHelpful: true }))}
                    className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                  />
                  <span className="ml-3 text-gray-700">Yes, it was helpful</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="isHelpful"
                    value="false"
                    checked={feedback.isHelpful === false}
                    onChange={() => setFeedback(prev => ({ ...prev, isHelpful: false }))}
                    className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                  />
                  <span className="ml-3 text-gray-700">No, it wasn't helpful</span>
                </label>
              </div>
            </div>

            {/* Comment */}
            <div>
              <label className="block text-lg font-medium text-gray-900 mb-4">
                Additional Comments (Optional)
              </label>
              <textarea
                name="comment"
                value={feedback.comment}
                onChange={handleInputChange}
                rows={4}
                placeholder="Share your thoughts, suggestions, or any issues you encountered..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit Feedback'}
              </button>
            </div>
          </form>
        </div>

        {/* Feedback Tips */}
        <div className="mt-8 bg-blue-50 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">💡 Tips for Great Feedback</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>• Be specific about what you liked or didn't like</li>
            <li>• Mention if the difficulty level was appropriate for you</li>
            <li>• Share any technical issues you encountered</li>
            <li>• Suggest improvements that would help your learning</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FeedbackPage; 