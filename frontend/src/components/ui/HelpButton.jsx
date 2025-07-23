import { useUserSpecificChat } from '../../hooks/useUserSpecificChat';

const HelpButton = ({ className = '' }) => {
  const { openChatWithGreeting, currentUser } = useUserSpecificChat();

  const handleHelpClick = () => {
    // Use user-specific chat opening
    openChatWithGreeting();
  };

  return (
    <button
      onClick={handleHelpClick}
      className={`
        fixed bottom-6 right-6 z-50
        bg-gradient-to-r from-blue-500 to-purple-600 
        hover:from-blue-600 hover:to-purple-700
        text-white rounded-full p-4 shadow-lg
        transition-all duration-300 ease-in-out
        hover:scale-110 hover:shadow-xl
        focus:outline-none focus:ring-4 focus:ring-blue-300
        ${className}
      `}
      title={currentUser ? `Trợ giúp cho ${currentUser.username}` : "Trợ giúp TOEIC"}
      aria-label="Open personalized help chat"
    >
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>

      {/* Pulse animation dot */}
      <span className="absolute -top-1 -right-1 flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
      </span>
    </button>
  );
};

export default HelpButton;
