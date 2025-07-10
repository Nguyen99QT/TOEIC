// /**
//  * ================================================================
//  * TOKEN REFRESH INDICATOR COMPONENT
//  * ================================================================
//  * 
//  * Shows a notification when token is about to expire and handles refresh
//  */

// import React, { useEffect, useState } from 'react';
// import { useAuth } from '../../contexts/AuthContext';
// import { getToken, refreshAuthToken } from '../../services/auth';

// interface TokenRefreshIndicatorProps {
//     className?: string;
// }

// const TokenRefreshIndicator: React.FC<TokenRefreshIndicatorProps> = ({ className = '' }) => {
//     const [isExpiringSoon, setIsExpiringSoon] = useState(false);
//     const [isRefreshing, setIsRefreshing] = useState(false);
//     const [timeLeft, setTimeLeft] = useState<number>(0);
//     const { isAuthenticated, signOut } = useAuth();

//     useEffect(() => {
//         if (!isAuthenticated) return;

//         const checkTokenExpiry = () => {
//             const token = getToken();
//             if (!token) return;

//             try {
//                 const tokenPayload = JSON.parse(atob(token.split('.')[1]));
//                 const currentTime = Date.now() / 1000;
//                 const expiryTime = tokenPayload.exp;

//                 if (expiryTime) {
//                     const secondsLeft = expiryTime - currentTime;
//                     const fiveMinutes = 5 * 60; // 5 minutes in seconds

//                     setTimeLeft(Math.max(0, secondsLeft));
//                     setIsExpiringSoon(secondsLeft <= fiveMinutes && secondsLeft > 0);

//                     // Auto-refresh when token has 2 minutes left
//                     if (secondsLeft <= 120 && secondsLeft > 0 && !isRefreshing) {
//                         handleRefreshToken();
//                     }
//                 }
//             } catch (error) {
//                 console.error('Error parsing token:', error);
//             }
//         };

//         // Check immediately
//         checkTokenExpiry();

//         // Check every 30 seconds
//         const interval = setInterval(checkTokenExpiry, 30000);

//         return () => clearInterval(interval);
//     }, [isAuthenticated, isRefreshing]);

//     const handleRefreshToken = async () => {
//         setIsRefreshing(true);
//         try {
//             const newToken = await refreshAuthToken();
//             if (newToken) {
//                 console.log('✅ Token refreshed successfully');
//                 setIsExpiringSoon(false);
//             } else {
//                 console.error('❌ Token refresh failed');
//                 // Don't automatically sign out, let user decide
//             }
//         } catch (error) {
//             console.error('❌ Token refresh error:', error);
//         } finally {
//             setIsRefreshing(false);
//         }
//     };

//     const handleSignOut = () => {
//         signOut();
//         window.location.href = '/auth/login';
//     };

//     const formatTimeLeft = (seconds: number): string => {
//         const minutes = Math.floor(seconds / 60);
//         const remainingSeconds = Math.floor(seconds % 60);
//         return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
//     };

//     // Don't show anything if not authenticated or not expiring soon
//     if (!isAuthenticated || (!isExpiringSoon && timeLeft > 300)) {
//         return null;
//     }

//     return (
//         <div className={`fixed top-4 right-4 z-50 ${className}`}>
//             <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 shadow-lg max-w-sm">
//                 <div className="flex items-start">
//                     <div className="flex-shrink-0">
//                         <div className="text-yellow-600">
//                             {isRefreshing ? (
//                                 <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
//                                     <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"></circle>
//                                     <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75"></path>
//                                 </svg>
//                             ) : (
//                                 <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
//                                     <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//                                 </svg>
//                             )}
//                         </div>
//                     </div>
//                     <div className="ml-3 flex-1">
//                         <h3 className="text-sm font-medium text-yellow-800">
//                             {isRefreshing ? 'Refreshing Session...' : 'Session Expiring Soon'}
//                         </h3>
//                         {!isRefreshing && (
//                             <div className="mt-1 text-sm text-yellow-700">
//                                 {timeLeft > 0 ? (
//                                     <p>Your session will expire in {formatTimeLeft(timeLeft)}</p>
//                                 ) : (
//                                     <p>Your session has expired</p>
//                                 )}
//                             </div>
//                         )}
//                         {!isRefreshing && (
//                             <div className="mt-3 flex space-x-2">
//                                 <button
//                                     onClick={handleRefreshToken}
//                                     disabled={isRefreshing}
//                                     className="text-xs bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-2 py-1 rounded border border-yellow-300 transition-colors"
//                                 >
//                                     Refresh Session
//                                 </button>
//                                 <button
//                                     onClick={handleSignOut}
//                                     className="text-xs bg-red-100 hover:bg-red-200 text-red-800 px-2 py-1 rounded border border-red-300 transition-colors"
//                                 >
//                                     Sign Out
//                                 </button>
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default TokenRefreshIndicator;
