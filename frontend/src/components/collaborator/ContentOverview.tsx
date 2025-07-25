import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface ContentItem {
    id: number;
    title: string;
    type: 'flashcard' | 'lesson';
    status: 'active' | 'draft' | 'archived';
    lastModified: Date;
    usage: number;
}

const ContentOverview: React.FC = () => {
    const [recentContent, setRecentContent] = useState<ContentItem[]>([]);

    useEffect(() => {
        // Mock data - replace with API call
        setRecentContent([
            {
                id: 1,
                title: 'Business English Essentials',
                type: 'flashcard',
                status: 'active',
                lastModified: new Date(),
                usage: 245
            },
            {
                id: 2,
                title: 'TOEIC Reading Part 5',
                type: 'lesson',
                status: 'active',
                lastModified: new Date(),
                usage: 180
            },
            {
                id: 3,
                title: 'Advanced Vocabulary',
                type: 'flashcard',
                status: 'draft',
                lastModified: new Date(),
                usage: 0
            }
        ]);
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-800';
            case 'draft':
                return 'bg-yellow-100 text-yellow-800';
            case 'archived':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getTypeIcon = (type: string) => {
        return type === 'flashcard' ? '📚' : '📖';
    };

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Recent Content</h3>
                <Link
                    to="/collaborator/content"
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                    View All →
                </Link>
            </div>

            {recentContent.length === 0 ? (
                <div className="text-center py-8">
                    <div className="text-gray-400 text-4xl mb-2">📝</div>
                    <p className="text-gray-500 mb-4">No content created yet</p>
                    <Link
                        to="/collaborator/content"
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Create Your First Content
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {recentContent.map((item) => (
                        <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                            <div className="flex items-start justify-between">
                                <div className="flex items-start space-x-3">
                                    <span className="text-2xl">{getTypeIcon(item.type)}</span>
                                    <div>
                                        <h4 className="font-medium text-gray-900">{item.title}</h4>
                                        <div className="flex items-center space-x-2 mt-1">
                                            <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(item.status)}`}>
                                                {item.status}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                {item.usage} users
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-gray-500">
                                        Modified: {item.lastModified.toLocaleDateString()}
                                    </p>
                                    <div className="flex space-x-1 mt-2">
                                        <button className="text-blue-600 hover:text-blue-700 text-xs">
                                            Edit
                                        </button>
                                        <span className="text-gray-300">|</span>
                                        <button className="text-gray-600 hover:text-gray-700 text-xs">
                                            Stats
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ContentOverview;
