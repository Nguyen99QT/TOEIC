/**
 * ================================================================
 * EXERCISES PAGE COMPONENT
 * ================================================================
 */

import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Clock,
  Lock,
  Play,
  Target
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Badge } from '../../components/ui/badge';
import Breadcrumb from '../../components/ui/Breadcrumb';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Skeleton } from '../../components/ui/skeleton';
import { useBreadcrumb } from '../../hooks/useBreadcrumb';
import api from '../../services/api'; // Import your API client
import { getCompletedExercises } from '../../services/exerciseProgress';

interface Exercise {
  id: number;
  title: string;
  description: string;
  duration: number;
  questionsCount: number;
  isCompleted: boolean;
  isLocked: boolean;
  points: number;
}

const ExercisesPage: React.FC = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [completedExercises, setCompletedExercises] = useState<Set<number>>(new Set());

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        setLoading(true);

        // Load completed exercises from API (with localStorage fallback)
        const completed = await getCompletedExercises();
        setCompletedExercises(completed);
        console.log('🎯 Loaded completed exercises:', completed);

        // Use consistent URL format - note that api client might already prepend /api
        const apiUrl = `lessons/${lessonId}/exercises`;
        console.log(`Fetching exercises from: ${apiUrl}`);

        // Use your API client which should handle auth headers automatically
        const response = await api.get(apiUrl);

        console.log('Exercises data received:', response.data);
        setExercises(response.data);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching exercises:', err);

        // Better error handling to show more useful messages
        if (err.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          const statusCode = err.response.status;
          if (statusCode === 404) {
            setError(`No exercises found for this lesson (404).`);
          } else if (statusCode === 401 || statusCode === 403) {
            setError(`You don't have permission to access these exercises.`);
          } else {
            setError(`Server error (${statusCode}). Please try again later.`);
          }
          console.error('Response data:', err.response.data);
        } else if (err.request) {
          // The request was made but no response was received
          setError('Could not connect to the server. Please check your internet connection.');
        } else {
          // Something happened in setting up the request
          setError(`Failed to load exercises: ${err.message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    if (lessonId) {
      fetchExercises();
    }
  }, [lessonId]);

  // Listen for storage changes to update completed exercises when user returns from exercise
  useEffect(() => {
    const handleExerciseCompleted = async () => {
      const updated = await getCompletedExercises();
      setCompletedExercises(updated);
      console.log('🔄 Updated completed exercises:', updated);
    };

    // Listen for custom events when exercises are completed
    window.addEventListener('exerciseCompleted', handleExerciseCompleted);

    return () => {
      window.removeEventListener('exerciseCompleted', handleExerciseCompleted);
    };
  }, []);

  return (
    <div className="exercises-page">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <Button
            variant="outline"
            size="sm"
            className="mr-2"
            onClick={() => navigate(`/lessons/${lessonId}`)}
          >
            <ArrowLeft className="mr-1 h-4 w-4" /> Back to Lesson
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">
            Lesson Exercises
          </h1>
        </div>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="p-6">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-4" />
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-5 w-20" />
                  </div>
                  <Skeleton className="h-9 w-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : error ? (
        <Alert className="bg-red-50 border-red-200 text-red-800 mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : exercises.length === 0 ? (
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-gray-500 my-8">
              No exercises found for this lesson. Check back later!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {exercises.map((exercise) => {
            const isCompleted = completedExercises.has(exercise.id) || exercise.isCompleted;

            return (
              <Card key={exercise.id} className={`overflow-hidden ${exercise.isLocked ? 'opacity-75' : ''}`}>
                <CardContent className="p-0">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-medium text-gray-900">{exercise.title}</h3>
                      {isCompleted && (
                        <Badge className="ml-2 bg-green-100 text-green-800 border-green-200">
                          <CheckCircle2 className="mr-1 h-3 w-3 text-green-600" /> Completed
                        </Badge>
                      )}
                    </div>

                    <p className="text-gray-600 text-sm mb-4">{exercise.description}</p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge className="flex items-center bg-gray-100 text-gray-800">
                        <Clock className="mr-1 h-3 w-3" /> {exercise.duration} min
                      </Badge>
                      <Badge className="flex items-center bg-gray-100 text-gray-800">
                        <BookOpen className="mr-1 h-3 w-3" /> {exercise.questionsCount} questions
                      </Badge>
                      <Badge className="flex items-center bg-gray-100 text-gray-800">
                        <Target className="mr-1 h-3 w-3" /> {exercise.points} points
                      </Badge>
                    </div>

                    <Button
                      className="w-full"
                      variant={exercise.isLocked ? "outline" : "primary"}
                      disabled={exercise.isLocked}
                      onClick={() => navigate(`/lessons/${lessonId}/exercises/${exercise.id}/questions`)}
                    >
                      {exercise.isLocked ? (
                        <>
                          <Lock className="mr-2 h-4 w-4" /> Locked
                        </>
                      ) : (
                        <>
                          <Play className="mr-2 h-4 w-4" />
                          {isCompleted ? 'Retry Exercise' : 'Start Exercise'}
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ExercisesPage;
