/**
 * ================================================================
 * MEDIA DEBUG COMPONENT
 * ================================================================
 * Component để debug và test media URLs
 */

import React, { useEffect, useState } from 'react';
import MediaService from '../../services/mediaService';

interface MediaDebugProps {
    lesson: any;
}

const MediaDebug: React.FC<MediaDebugProps> = ({ lesson }) => {
    const [imageStatus, setImageStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [audioStatus, setAudioStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);

    useEffect(() => {
        const checkMedia = async () => {
            // Process URLs
            const processedImageUrl = MediaService.processImageUrl(lesson.imageUrl);
            const processedAudioUrl = MediaService.processAudioUrl(lesson.audioUrl);

            setImageUrl(processedImageUrl);
            setAudioUrl(processedAudioUrl);

            // Test image
            if (processedImageUrl) {
                try {
                    const imageOk = await MediaService.testMediaUrl(processedImageUrl, 'image');
                    setImageStatus(imageOk ? 'success' : 'error');
                } catch {
                    setImageStatus('error');
                }
            } else {
                setImageStatus('error');
            }

            // Test audio
            if (processedAudioUrl) {
                try {
                    const audioOk = await MediaService.testMediaUrl(processedAudioUrl, 'audio');
                    setAudioStatus(audioOk ? 'success' : 'error');
                } catch {
                    setAudioStatus('error');
                }
            } else {
                setAudioStatus('error');
            }
        };

        checkMedia();
    }, [lesson]);

    if (process.env.NODE_ENV !== 'development') {
        return null; // Only show in development
    }

    return (
        <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 mt-4 text-xs">
            <h4 className="font-bold mb-2">🔍 Media Debug Info</h4>

            <div className="space-y-2">
                <div>
                    <strong>Lesson ID:</strong> {lesson.id}
                </div>
                <div>
                    <strong>Title:</strong> {lesson.title}
                </div>

                {/* Image Debug */}
                <div className="border-t pt-2">
                    <div className="flex items-center space-x-2">
                        <span className="font-medium">🖼️ Image:</span>
                        <span className={`px-2 py-1 rounded text-xs ${imageStatus === 'success' ? 'bg-green-100 text-green-800' :
                                imageStatus === 'error' ? 'bg-red-100 text-red-800' :
                                    'bg-yellow-100 text-yellow-800'
                            }`}>
                            {imageStatus}
                        </span>
                    </div>
                    <div className="ml-4 mt-1 space-y-1">
                        <div><strong>Raw:</strong> {lesson.imageUrl || 'null'}</div>
                        <div><strong>Processed:</strong> {imageUrl || 'null'}</div>
                    </div>
                </div>

                {/* Audio Debug */}
                <div className="border-t pt-2">
                    <div className="flex items-center space-x-2">
                        <span className="font-medium">🔊 Audio:</span>
                        <span className={`px-2 py-1 rounded text-xs ${audioStatus === 'success' ? 'bg-green-100 text-green-800' :
                                audioStatus === 'error' ? 'bg-red-100 text-red-800' :
                                    'bg-yellow-100 text-yellow-800'
                            }`}>
                            {audioStatus}
                        </span>
                    </div>
                    <div className="ml-4 mt-1 space-y-1">
                        <div><strong>Raw:</strong> {lesson.audioUrl || 'null'}</div>
                        <div><strong>Processed:</strong> {audioUrl || 'null'}</div>
                    </div>
                </div>
            </div>

            {/* Test buttons */}
            <div className="flex space-x-2 mt-3">
                {imageUrl && (
                    <button
                        onClick={() => window.open(imageUrl, '_blank')}
                        className="px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
                    >
                        Test Image
                    </button>
                )}
                {audioUrl && (
                    <button
                        onClick={() => window.open(audioUrl, '_blank')}
                        className="px-2 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600"
                    >
                        Test Audio
                    </button>
                )}
            </div>
        </div>
    );
};

export default MediaDebug;
