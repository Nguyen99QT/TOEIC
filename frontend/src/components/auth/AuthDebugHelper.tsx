import React from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Debug component for authentication issues
 * Shows all localStorage items and router state
 */
const AuthDebugHelper: React.FC = () => {
    const location = useLocation();
    const [showDetails, setShowDetails] = React.useState(false);
    const [storageItems, setStorageItems] = React.useState<Record<string, string>>({});

    React.useEffect(() => {
        // Get all localStorage items
        const items: Record<string, string> = {};
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key) {
                const value = localStorage.getItem(key) || '';
                items[key] = value.length > 30 ? `${value.substring(0, 30)}...` : value;
            }
        }
        setStorageItems(items);
    }, [showDetails]);

    if (!showDetails) {
        return (
            <div className="text-center mt-4">
                <button
                    onClick={() => setShowDetails(true)}
                    className="text-xs text-gray-500 hover:text-blue-500"
                >
                    Show Debug Info
                </button>
            </div>
        );
    }

    return (
        <div className="mt-8 p-4 border border-gray-200 rounded-md bg-gray-50 text-xs">
            <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-gray-700">Auth Debug Information</h3>
                <button
                    onClick={() => setShowDetails(false)}
                    className="text-gray-500 hover:text-red-500"
                >
                    Hide
                </button>
            </div>

            <div className="space-y-2">
                <div>
                    <h4 className="font-semibold">Router Location:</h4>
                    <div className="pl-2">
                        <div>pathname: {location.pathname}</div>
                        <div>state: {JSON.stringify(location.state)}</div>
                    </div>
                </div>

                <div>
                    <h4 className="font-semibold">Authentication State:</h4>
                    <div className="pl-2">
                        <div>toeic_access_token: {localStorage.getItem('toeic_access_token') ? '✅ Exists' : '❌ Missing'}</div>
                        <div>toeic_current_user: {localStorage.getItem('toeic_current_user') ? '✅ Exists' : '❌ Missing'}</div>
                    </div>
                </div>

                <div>
                    <h4 className="font-semibold">All localStorage Items:</h4>
                    <div className="pl-2">
                        {Object.keys(storageItems).length === 0 ? (
                            <div className="text-gray-500">No items in localStorage</div>
                        ) : (
                            Object.entries(storageItems).map(([key, value]) => (
                                <div key={key}>
                                    {key}: {value}
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="pt-2 border-t border-gray-200">
                    <button
                        onClick={() => {
                            localStorage.clear();
                            setStorageItems({});
                            window.location.reload();
                        }}
                        className="px-2 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200"
                    >
                        Clear All & Reload
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AuthDebugHelper;
