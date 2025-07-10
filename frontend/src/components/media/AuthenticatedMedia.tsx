/**
 * ================================================================
 * AUTHENTICATED MEDIA COMPONENTS
 * ================================================================
 * Components để hiển thị media với authentication headers
 */

import React, { useEffect, useRef, useState } from 'react';

interface AuthenticatedImageProps {
    src: string;
    alt: string;
    className?: string;
    onLoad?: () => void;
    onError?: (error: string) => void;
    fallback?: React.ReactNode;
}

export const AuthenticatedImage: React.FC<AuthenticatedImageProps> = ({
    src,
    alt,
    className = '',
    onLoad,
    onError,
    fallback
}) => {
    const [imageSrc, setImageSrc] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const loadingRef = useRef<string>(''); // Track which src is currently loading

    useEffect(() => {
        // Prevent reloading if already loading this src
        if (loadingRef.current === src) {
            return;
        }
        loadingRef.current = src;

        const loadImage = async () => {
            try {
                setLoading(true);
                setError(null);

                // For /files/** endpoints, try without auth first since they should be public
                const isFileEndpoint = src.includes('/files/');

                if (isFileEndpoint) {
                    // Reduced logging - only log in development
                    if (process.env.NODE_ENV === 'development') {
                        console.log('🔓 Loading public media:', src.split('/').pop()); // Just filename
                    }
                    try {
                        const response = await fetch(src, { mode: 'cors' });
                        if (response.ok) {
                            const blob = await response.blob();
                            const imageUrl = URL.createObjectURL(blob);
                            setImageSrc(imageUrl);
                            onLoad?.();
                            return;
                        }
                    } catch (publicErr) {
                        // Silent fallback to auth - no need to log this normal flow
                    }
                }

                // Get auth token for authenticated access (only for non-file endpoints)
                const token = localStorage.getItem('toeic_access_token') ||
                    localStorage.getItem('authToken');

                if (!token && !isFileEndpoint) {
                    console.warn('🔑 No auth token found for image request');
                    // For file endpoints that failed above, this might be a server issue
                    if (isFileEndpoint) {
                        throw new Error('Public file endpoint returned 401');
                    }
                    // Try loading without token for non-file endpoints
                    setImageSrc(src);
                    onLoad?.();
                    return;
                }

                // Only add auth headers for non-file endpoints
                const headers: Record<string, string> = {};
                if (token && !isFileEndpoint) {
                    headers['Authorization'] = `Bearer ${token}`;
                }

                const response = await fetch(src, {
                    headers,
                    mode: 'cors'
                });

                if (response.ok) {
                    const blob = await response.blob();
                    const imageUrl = URL.createObjectURL(blob);
                    setImageSrc(imageUrl);
                    if (process.env.NODE_ENV === 'development') {
                        console.log('✅ Image loaded:', src.split('/').pop());
                    }
                    onLoad?.();
                } else {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
            } catch (err: any) {
                console.error('❌ Failed to load image:', src.split('/').pop(), err.message);
                setError(err.message);
                onError?.(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (src) {
            loadImage();
        }

        // Cleanup will be handled by component unmount
    }, [src, onLoad, onError]); // Include all dependencies

    // Separate cleanup effect for blob URLs
    useEffect(() => {
        return () => {
            if (imageSrc && imageSrc.startsWith('blob:')) {
                URL.revokeObjectURL(imageSrc);
            }
        };
    }, [imageSrc]);

    if (loading) {
        return (
            <div className={`bg-gray-200 animate-pulse ${className}`}>
                <div className="flex items-center justify-center h-full">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </div>
            </div>
        );
    }

    if (error && !imageSrc) {
        return fallback || (
            <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}>
                <div className="text-center">
                    <svg className="w-12 h-12 text-red-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-red-800 text-sm font-medium">Failed to load image</p>
                    <p className="text-red-600 text-xs mt-1">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <img
            src={imageSrc}
            alt={alt}
            className={className}
            onError={(e) => {
                console.error('❌ Image element error:', e);
                setError('Image load error');
            }}
        />
    );
};

interface AuthenticatedAudioProps {
    src: string;
    className?: string;
    onLoad?: () => void;
    onError?: (error: string) => void;
    fallback?: React.ReactNode;
    preload?: 'none' | 'metadata' | 'auto';
}

export const AuthenticatedAudio: React.FC<AuthenticatedAudioProps> = ({
    src,
    className = '',
    onLoad,
    onError,
    fallback,
    preload = 'metadata'
}) => {
    const [audioSrc, setAudioSrc] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const audioRef = useRef<HTMLAudioElement>(null);
    const loadingRef = useRef<string>(''); // Track which src is currently loading

    useEffect(() => {
        // Prevent reloading if already loading this src
        if (loadingRef.current === src) {
            return;
        }
        loadingRef.current = src;

        const loadAudio = async () => {
            try {
                setLoading(true);
                setError(null);

                // For /files/** endpoints, try without auth first since they should be public
                const isFileEndpoint = src.includes('/files/');

                if (isFileEndpoint) {
                    // Reduced logging - only log in development
                    if (process.env.NODE_ENV === 'development') {
                        console.log('� Loading public audio:', src.split('/').pop()); // Just filename
                    }
                    try {
                        const response = await fetch(src, { mode: 'cors' });
                        if (response.ok) {
                            const blob = await response.blob();
                            const audioUrl = URL.createObjectURL(blob);
                            setAudioSrc(audioUrl);
                            onLoad?.();
                            return;
                        }
                    } catch (publicErr) {
                        // Silent fallback to auth - no need to log this normal flow
                    }
                }

                // Get auth token for authenticated access (only for non-file endpoints)
                const token = localStorage.getItem('toeic_access_token') ||
                    localStorage.getItem('authToken');

                if (!token && !isFileEndpoint) {
                    console.warn('🔑 No auth token found for audio request');
                    // For file endpoints that failed above, this might be a server issue
                    if (isFileEndpoint) {
                        throw new Error('Public file endpoint returned 401');
                    }
                    // Try loading without token for non-file endpoints
                    setAudioSrc(src);
                    return;
                }

                // Only add auth headers for non-file endpoints
                const headers: Record<string, string> = {};
                if (token && !isFileEndpoint) {
                    headers['Authorization'] = `Bearer ${token}`;
                }

                const response = await fetch(src, {
                    headers,
                    mode: 'cors'
                });

                if (response.ok) {
                    const blob = await response.blob();
                    const audioUrl = URL.createObjectURL(blob);
                    setAudioSrc(audioUrl);
                    console.log('✅ Audio loaded:', src.split('/').pop());
                    onLoad?.();
                } else {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
            } catch (err: any) {
                console.error('❌ Failed to load audio:', src.split('/').pop(), err.message);
                setError(err.message);
                onError?.(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (src) {
            loadAudio();
        }

        // Cleanup will be handled by component unmount
    }, [src, onLoad, onError]); // Include all dependencies

    // Separate cleanup effect for blob URLs
    useEffect(() => {
        return () => {
            if (audioSrc && audioSrc.startsWith('blob:')) {
                URL.revokeObjectURL(audioSrc);
            }
        };
    }, [audioSrc]);

    if (loading) {
        return (
            <div className={`bg-gray-200 animate-pulse rounded-lg p-4 ${className}`}>
                <div className="flex items-center justify-center">
                    <svg className="w-6 h-6 text-gray-400 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span className="ml-2 text-gray-600 text-sm">Loading audio...</span>
                </div>
            </div>
        );
    }

    if (error && !audioSrc) {
        return fallback || (
            <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}>
                <div className="text-center">
                    <svg className="w-8 h-8 text-red-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 14.142M9 9a3 3 0 000 6 3 3 0 000-6zm0 0V5a2 2 0 012-2h2m-2 4v6m0-6h4" />
                    </svg>
                    <p className="text-red-800 text-sm font-medium">Failed to load audio</p>
                    <p className="text-red-600 text-xs mt-1">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <audio
            ref={audioRef}
            src={audioSrc}
            controls
            className={className}
            preload={preload}
            onError={(e) => {
                console.error('❌ Audio element error:', e);
                setError('Audio load error');
            }}
            onCanPlay={() => {
                console.log('✅ Audio can play:', src);
            }}
        >
            Your browser does not support the audio element.
        </audio>
    );
};
