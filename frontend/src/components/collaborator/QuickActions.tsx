import React from 'react';
import { Link } from 'react-router-dom';

const QuickActions: React.FC = () => {
    const actions = [
        {
            title: 'Create Flashcard Set',
            description: 'Add a new flashcard collection',
            icon: '📚',
            href: '/collaborator/content?type=flashcards&action=create',
            color: 'bg-blue-600 hover:bg-blue-700'
        },
        {
            title: 'Create Lesson',
            description: 'Build a new TOEIC lesson',
            icon: '📖',
            href: '/collaborator/content?type=lessons&action=create',
            color: 'bg-green-600 hover:bg-green-700'
        },
        {
            title: 'Manage Users',
            description: 'View and manage learners',
            icon: '👥',
            href: '/collaborator/users',
            color: 'bg-purple-600 hover:bg-purple-700'
        },
        {
            title: 'View Reports',
            description: 'Check analytics and progress',
            icon: '📊',
            href: '/collaborator/analytics',
            color: 'bg-orange-600 hover:bg-orange-700'
        }
    ];

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
                {actions.map((action, index) => (
                    <Link
                        key={index}
                        to={action.href}
                        className={`${action.color} text-white p-4 rounded-lg block transition-colors group`}
                    >
                        <div className="flex items-center space-x-3">
                            <span className="text-2xl">{action.icon}</span>
                            <div>
                                <h4 className="font-semibold">{action.title}</h4>
                                <p className="text-sm opacity-90">{action.description}</p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default QuickActions;
