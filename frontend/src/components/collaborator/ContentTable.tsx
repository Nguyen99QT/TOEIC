import React from 'react';

interface ContentTableProps {
    contentType: string;
    data: any[];
    loading: boolean;
    onEdit: (item: any) => void;
    onDelete: (id: number) => void;
    searchTerm: string;
    filterStatus: string;
}

const ContentTable: React.FC<ContentTableProps> = ({
    contentType,
    data,
    loading,
    onEdit,
    onDelete,
    searchTerm,
    filterStatus
}) => {
    // Filter data based on search term and status
    const filteredData = data.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesFilter = filterStatus === 'all' ||
            (item.status && item.status === filterStatus);
        return matchesSearch && matchesFilter;
    });

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

    if (loading) {
        return (
            <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-500 mt-2">Loading...</p>
            </div>
        );
    }

    if (filteredData.length === 0) {
        return (
            <div className="p-8 text-center">
                <div className="text-gray-400 text-4xl mb-2">📭</div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">No content found</h3>
                <p className="text-gray-500">
                    {searchTerm || filterStatus !== 'all'
                        ? 'Try adjusting your search or filter criteria.'
                        : `Create your first ${contentType} to get started.`
                    }
                </p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Title
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {contentType === 'flashcards' ? 'Cards' : 'Duration'}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Modified
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {filteredData.map((item, index) => (
                        <tr key={item.id || index} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div>
                                    <div className="text-sm font-medium text-gray-900">{item.title}</div>
                                    {item.description && (
                                        <div className="text-sm text-gray-500 truncate max-w-xs">
                                            {item.description}
                                        </div>
                                    )}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(item.status || 'active')}`}>
                                    {item.status || 'active'}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {contentType === 'flashcards'
                                    ? `${item.totalCards || 0} cards`
                                    : `${item.duration || 0} min`
                                }
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {item.updatedAt ? new Date(item.updatedAt).toLocaleDateString() : 'Unknown'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => onEdit(item)}
                                        className="text-blue-600 hover:text-blue-900 transition-colors"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => onDelete(item.id)}
                                        className="text-red-600 hover:text-red-900 transition-colors"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ContentTable;
