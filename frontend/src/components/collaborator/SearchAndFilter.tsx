import React from 'react';

interface SearchAndFilterProps {
    searchTerm: string;
    onSearchChange: (term: string) => void;
    filterStatus: string;
    onFilterChange: (status: string) => void;
    contentType: string;
}

const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
    searchTerm,
    onSearchChange,
    filterStatus,
    onFilterChange,
    contentType
}) => {
    return (
        <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex flex-col sm:flex-row gap-4">
                {/* Search */}
                <div className="flex-1">
                    <label htmlFor="search" className="sr-only">
                        Search
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            id="search"
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                            placeholder={`Search ${contentType}...`}
                            value={searchTerm}
                            onChange={(e) => onSearchChange(e.target.value)}
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-400">🔍</span>
                        </div>
                    </div>
                </div>

                {/* Filter */}
                <div className="sm:w-48">
                    <label htmlFor="filter" className="sr-only">
                        Filter by status
                    </label>
                    <select
                        id="filter"
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        value={filterStatus}
                        onChange={(e) => onFilterChange(e.target.value)}
                    >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="draft">Draft</option>
                        <option value="archived">Archived</option>
                    </select>
                </div>

                {/* Sort */}
                <div className="sm:w-48">
                    <label htmlFor="sort" className="sr-only">
                        Sort by
                    </label>
                    <select 
                        id="sort"
                        aria-label="Sort by"
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
                        <option>Sort by Date</option>
                        <option>Sort by Title</option>
                        <option>Sort by Usage</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

export default SearchAndFilter;
