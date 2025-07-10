import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { api } from '../services/api';

interface Exercise {
    id: number;
    title: string;
    type: string;
    // Add other exercise properties as needed
}

const ExercisesPage: React.FC = () => {
    const { lessonId } = useParams<{ lessonId: string }>();
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchExercises = async () => {
            try {
                // Properly format the URL path
                const path = `lessons/${lessonId}/exercises`;
                console.log(`Fetching exercises from: ${path}`);

                const response = await api.get(`/lessons/${lessonId}/exercises`);

                // Handle both direct data and nested data.data format
                let exercisesData;
                if (response.data?.data) {
                    exercisesData = response.data.data;
                } else {
                    exercisesData = response.data;
                }

                setExercises(exercisesData);
                console.log(`✅ Loaded ${exercisesData.length} exercises for lesson ${lessonId}`);
            } catch (error: any) {
                console.error(`❌ Error loading exercises:`, error);
                setError(error.message || 'Failed to load exercises');
            } finally {
                setLoading(false);
            }
        };

        if (lessonId) {
            fetchExercises();
        }
    }, [lessonId]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
                <h2 className="text-lg font-semibold">Error Loading Exercises</h2>
                <p>{error}</p>
                <button
                    className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    onClick={() => window.location.reload()}
                >
                    Try Again
                </button>
            </div>
        );
    }

    if (exercises.length === 0) {
        return (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                <h2 className="text-lg font-semibold text-yellow-700">No Exercises Available</h2>
                <p className="text-yellow-600">There are no exercises available for this lesson yet.</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-6 px-4">
            <h1 className="text-2xl font-bold mb-6">Exercises for Lesson {lessonId}</h1>

            <div className="space-y-4">
                {exercises.map((exercise) => (
                    <div
                        key={exercise.id}
                        className="p-4 bg-white border border-gray-200 rounded-md shadow-sm hover:shadow-md transition-shadow"
                    >
                        <h3 className="text-lg font-semibold">{exercise.title}</h3>
                        <p className="text-gray-600 text-sm mt-1">Type: {exercise.type}</p>
                        <button
                            className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            onClick={() => {
                                // Navigate to exercise page
                                window.location.href = `/lessons/${lessonId}/exercises/${exercise.id}`;
                            }}
                        >
                            Start Exercise
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ExercisesPage;
