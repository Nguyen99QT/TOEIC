import React, { useState, useEffect, useCallback } from 'react';
import CollaboratorLayout from '../../components/layouts/CollaboratorLayout';
import ContentModal from '../../components/collaborator/ContentModal';
import { Lesson } from '../../types/lesson';
import flashcardService from '../../services/flashcardService';
import lessonService from '../../services/lessons';
import ContentTable from '../../components/collaborator/ContentTable';
import SearchAndFilter from '../../components/collaborator/SearchAndFilter';
import toast from 'react-hot-toast';


type ContentType = 'flashcards' | 'lessons' | 'exercises';

//
const CollaboratorContent: React.FC = () => {
    const [activeTab, setActiveTab] = useState<ContentType>('flashcards');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('all');
    // Define or import the FlashcardSet type
    type FlashcardSet = {
        id: number;
        name: string;
        description?: string;
        // Add other fields as needed
    };

    const [flashcardSets, setFlashcardSets] = useState<FlashcardSet[]>([]);
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [loading, setLoading] = useState(false);

    const loadContent = useCallback(async () => {
        setLoading(true);
        try {
            if (activeTab === 'flashcards') {
                console.log('🔄 Loading flashcard sets...');
                const sets = await flashcardService.getAllSets();
                setFlashcardSets(sets);
                console.log('✅ Loaded flashcard sets:', sets.length);
            } else if (activeTab === 'lessons') {
                console.log('🔄 Loading lessons...');
                const loadedLessons = await lessonService.getAllLessons();
                setLessons(loadedLessons);
                console.log('✅ Loaded lessons:', loadedLessons.length);
            }
        } catch (error) {
            console.error('❌ Error loading content:', error);
            toast.error('Failed to load content');
        } finally {
            setLoading(false);
        }
    }, [activeTab]);

    useEffect(() => {
        loadContent();
    }, [loadContent]);

    const handleCreate = () => {
        setEditingItem(null);
        setIsModalOpen(true);
    };

    const handleEdit = (item: any) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            try {
                console.log(`🔄 Deleting ${activeTab} item:`, id);

                if (activeTab === 'flashcards') {
                    await flashcardService.deleteSet(id);
                    toast.success('Flashcard set deleted successfully');
                } else if (activeTab === 'lessons') {
                    await lessonService.deleteLesson(id);
                    toast.success('Lesson deleted successfully');
                }

                await loadContent(); // Refresh list
            } catch (error) {
                console.error('❌ Error deleting item:', error);
                toast.error('Failed to delete item');
            }
        }
    };

    const handleSave = async (data: any) => {
        try {
            console.log(`🔄 Saving ${activeTab} item:`, data);

            if (editingItem) {
                // Update existing item
                if (activeTab === 'flashcards') {
                    await flashcardService.updateSet(editingItem.id, data);
                    toast.success('Flashcard set updated successfully');
                } else if (activeTab === 'lessons') {
                    await lessonService.updateLesson(editingItem.id, data);
                    toast.success('Lesson updated successfully');
                }
            } else {
                // Create new item
                if (activeTab === 'flashcards') {
                    await flashcardService.createSet(data);
                    toast.success('Flashcard set created successfully');
                } else if (activeTab === 'lessons') {
                    await lessonService.createLesson(data);
                    toast.success('Lesson created successfully');
                }
            }

            setIsModalOpen(false);
            await loadContent(); // Refresh list
        } catch (error) {
            console.error('❌ Error saving item:', error);
            toast.error('Failed to save item');
        }
    };

    const tabs = [
        { id: 'flashcards', name: 'Flashcard Sets', icon: '📚', count: flashcardSets.length },
        { id: 'lessons', name: 'Lessons', icon: '📖', count: lessons.length },
        { id: 'exercises', name: 'Exercises', icon: '✏️', count: 0 },
    ];

    return (
        <CollaboratorLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Content Management</h1>
                        <p className="text-gray-600 mt-1">Create and manage your educational content</p>
                    </div>
                    <button
                        onClick={handleCreate}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                    >
                        <span>➕</span>
                        <span>Create New</span>
                    </button>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as ContentType)}
                                className={`${activeTab === tab.id
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
                            >
                                <span>{tab.icon}</span>
                                <span>{tab.name}</span>
                                <span className="bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                                    {tab.count}
                                </span>
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Search and Filter */}
                <SearchAndFilter
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    filterStatus={filterStatus}
                    onFilterChange={setFilterStatus}
                    contentType={activeTab}
                />

                {/* Content Table */}
                <div className="bg-white shadow rounded-lg">
                    <ContentTable
                        contentType={activeTab}
                        data={activeTab === 'flashcards' ? flashcardSets : lessons}
                        loading={loading}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        searchTerm={searchTerm}
                        filterStatus={filterStatus}
                    />
                </div>

                {/* Modal */}
                {isModalOpen && (
                    <ContentModal
                        contentType={activeTab}
                        item={editingItem}
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        onSave={handleSave}
                    />
                )}
            </div>
        </CollaboratorLayout>
    );
};

export default CollaboratorContent;