import React, { useState } from 'react';

interface FeedbackModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: { rating: number; comment: string }) => void;
    submitting: boolean;
}

const satisfactionIcons = [
    {
        label: 'Very Dissatisfied',
        color: 'text-red-400',
        svg: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="#fecaca" /><path d="M9 15c.5-.67 1.5-1 3-1s2.5.33 3 1" stroke="#991b1b" strokeWidth="2" strokeLinecap="round" /><circle cx="9" cy="10" r="1" fill="#991b1b" /><circle cx="15" cy="10" r="1" fill="#991b1b" /></svg>
        )
    },
    {
        label: 'Dissatisfied',
        color: 'text-orange-400',
        svg: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="#fde68a" /><path d="M9 15c.5-.33 1.5-.5 3-.5s2.5.17 3 .5" stroke="#b45309" strokeWidth="2" strokeLinecap="round" /><circle cx="9" cy="10" r="1" fill="#b45309" /><circle cx="15" cy="10" r="1" fill="#b45309" /></svg>
        )
    },
    {
        label: 'Neutral',
        color: 'text-yellow-400',
        svg: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="#fef08a" /><path d="M9 15h6" stroke="#a16207" strokeWidth="2" strokeLinecap="round" /><circle cx="9" cy="10" r="1" fill="#a16207" /><circle cx="15" cy="10" r="1" fill="#a16207" /></svg>
        )
    },
    {
        label: 'Satisfied',
        color: 'text-lime-400',
        svg: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="#d9f99d" /><path d="M9 15c.5.67 1.5 1 3 1s2.5-.33 3-1" stroke="#4d7c0f" strokeWidth="2" strokeLinecap="round" /><circle cx="9" cy="10" r="1" fill="#4d7c0f" /><circle cx="15" cy="10" r="1" fill="#4d7c0f" /></svg>
        )
    },
    {
        label: 'Very Satisfied',
        color: 'text-green-500',
        svg: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="#bbf7d0" /><path d="M9 15c1 1 5 1 6 0" stroke="#166534" strokeWidth="2" strokeLinecap="round" /><circle cx="9" cy="10" r="1" fill="#166534" /><circle cx="15" cy="10" r="1" fill="#166534" /></svg>
        )
    }
];

const FeedbackModal: React.FC<FeedbackModalProps> = ({ open, onClose, onSubmit, submitting }) => {
    const [rating, setRating] = useState<number>(0);
    const [hoverRating, setHoverRating] = useState<number>(0);
    const [comment, setComment] = useState<string>('');

    const handleStarClick = (idx: number) => setRating(idx + 1);
    const handleStarHover = (idx: number) => setHoverRating(idx + 1);
    const handleStarLeave = () => setHoverRating(0);

    const handleIconClick = (idx: number) => setRating(idx + 1);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (rating === 0) return;
        onSubmit({ rating, comment });
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-auto animate-fade-in-up relative">
                <button
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-2xl font-bold focus:outline-none"
                    onClick={onClose}
                >
                    ×
                </button>
                <h2 className="text-2xl font-bold mb-4 text-center">We value your feedback!</h2>
                <form onSubmit={handleSubmit}>
                    {/* Stars */}
                    <div className="flex justify-center mb-2">
                        {[...Array(5)].map((_, idx) => (
                            <button
                                type="button"
                                key={idx}
                                className={`mx-1 transition-transform duration-150 ${rating > idx || hoverRating > idx ? 'text-yellow-400 scale-110' : 'text-gray-300'} focus:outline-none`}
                                onClick={() => handleStarClick(idx)}
                                onMouseEnter={() => handleStarHover(idx)}
                                onMouseLeave={handleStarLeave}
                                aria-label={`Rate ${idx + 1} star${idx > 0 ? 's' : ''}`}
                            >
                                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.455a1 1 0 00-1.175 0l-3.38 2.455c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" /></svg>
                            </button>
                        ))}
                    </div>
                    {/* Satisfaction icons */}
                    <div className="flex justify-center gap-2 mb-4">
                        {satisfactionIcons.map((icon, idx) => (
                            <button
                                type="button"
                                key={icon.label}
                                className={`rounded-full p-1 transition-all duration-150 border-2 ${rating === idx + 1 ? 'border-blue-500 scale-110' : 'border-transparent'} focus:outline-none`}
                                onClick={() => handleIconClick(idx)}
                                aria-label={icon.label}
                                tabIndex={0}
                            >
                                <span className={icon.color + (rating === idx + 1 ? ' opacity-100' : ' opacity-60')}>{icon.svg}</span>
                            </button>
                        ))}
                    </div>
                    {/* Textarea */}
                    <textarea
                        className="w-full rounded-lg border border-gray-300 p-3 mb-4 focus:ring-2 focus:ring-blue-400 focus:outline-none resize-none transition shadow-sm min-h-[80px]"
                        placeholder="How was this exercise? Any suggestions or issues?"
                        value={comment}
                        onChange={e => setComment(e.target.value)}
                        maxLength={500}
                    />
                    <div className="flex gap-2">
                        <button
                            type="submit"
                            className={`flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg shadow transition ${rating === 0 || submitting ? 'opacity-60 cursor-not-allowed' : ''}`}
                            disabled={rating === 0 || submitting}
                        >
                            {submitting ? 'Sending...' : 'Send Feedback'}
                        </button>
                        <button
                            type="button"
                            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 rounded-lg shadow transition"
                            onClick={onClose}
                            disabled={submitting}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FeedbackModal;
