import React from 'react';

interface Activity {
    id: number;
    type: string;
    description: string;
    timestamp: Date;
}

interface RecentActivityProps {
    activities: Activity[];
}

const RecentActivity: React.FC<RecentActivityProps> = ({ activities }) => {
    const getActivityIcon = (type: string) => {
        switch (type) {
            case 'flashcard_created':
                return '📚';
            case 'lesson_updated':
                return '📖';
            case 'user_enrolled':
                return '👤';
            case 'exercise_completed':
                return '✅';
            default:
                return '📝';
        }
    };

    const formatTime = (timestamp: Date) => {
        const now = new Date();
        const diff = now.getTime() - timestamp.getTime();
        const minutes = Math.floor(diff / 60000);

        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
        return `${Math.floor(minutes / 1440)}d ago`;
    };

    return (
        <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            {activities.length === 0 ? (
                <div className="text-center py-8">
                    <div className="text-gray-400 text-4xl mb-2">📭</div>
                    <p className="text-gray-500">No recent activity</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {activities.map((activity) => (
                        <div key={activity.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg">
                            <div className="flex-shrink-0">
                                <span className="text-2xl">{getActivityIcon(activity.type)}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm text-gray-900">{activity.description}</p>
                                <p className="text-xs text-gray-500 mt-1">{formatTime(activity.timestamp)}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default RecentActivity;
