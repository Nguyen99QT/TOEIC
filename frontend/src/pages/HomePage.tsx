import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import flashcardService from '../services/flashcardService';
import { lessonService } from '../services/lessons';
import { FlashcardSet, Lesson } from '../types';
import EnhancedButton from '../components/ui/EnhancedButton';
import GuestInteraction from '../components/auth/GuestInteraction';
import StatsDynamic from '../components/ui/StatsDynamic';

const HomePage: React.FC = () => {
  const { isAuthenticated, currentUser, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [flashcardSets, setFlashcardSets] = useState<FlashcardSet[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const fetchAttempted = useRef(false);

  useEffect(() => {
    if (authLoading) {
      console.log('🔄 HomePage: Waiting for auth to complete...');
      return;
    }

    if (fetchAttempted.current) return;
    fetchAttempted.current = true;

    const fetchData = async () => {
      try {
        console.log('🔄 HomePage: Fetching flashcard sets and lessons...');

        // Fetch flashcard sets
        let sets: FlashcardSet[] = [];
        if (isAuthenticated) {
          try {
            sets = await flashcardService.getFeaturedSets(4);
          } catch (authError: any) {
            console.warn('⚠️ Authenticated fetch failed:', authError?.response?.status || authError?.message, 'trying public sets...');
            try {
              sets = await flashcardService.getPublicSets();
              sets = sets.slice(0, 4); // Limit to 4
            } catch (publicError: any) {
              console.warn('⚠️ Public sets also failed:', publicError?.response?.status || publicError?.message);
              sets = [];
            }
          }
        } else {
          try {
            sets = await flashcardService.getFeaturedSets(4);
          } catch (error: any) {
            console.warn('⚠️ Featured flashcards failed:', error?.response?.status || error?.message);
            sets = [];
          }
        }

        // Fetch lessons
        let lessonData: Lesson[] = [];
        try {
          // Fetch all public lessons instead of just 4
          lessonData = await lessonService.getAllPublicLessons();
        } catch (lessonError: any) {
          console.warn('⚠️ Public lessons failed:', lessonError?.response?.status || lessonError?.message);
          lessonData = [];
        }

        console.log('✅ HomePage: Flashcard sets loaded:', sets.length);
        console.log('✅ HomePage: Lessons loaded:', lessonData.length);
        setFlashcardSets(sets);
        setLessons(lessonData);
        // Lưu vào window để các trang khác có thể truy cập
        if (typeof window !== 'undefined') {
          (window as any).allLessons = lessonData;
        }
      } catch (error) {
        console.error('❌ HomePage: Error fetching data:', error);
        setFlashcardSets([]);
        setLessons([]);
      }
    };

    fetchData();
  }, [authLoading, isAuthenticated]);

  return (
    <motion.div
      className="min-h-screen bg-gray-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Hero Section */}
      <motion.div
        className="bg-gradient-to-r from-blue-600 to-purple-700 text-white relative overflow-hidden"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 border border-white rounded-full"></div>
          <div className="absolute top-32 right-20 w-16 h-16 border border-white rounded-full"></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 border border-white rounded-full"></div>
          <div className="absolute bottom-32 right-1/3 w-8 h-8 border border-white rounded-full"></div>
        </div>

        <div className="container mx-auto px-4 py-20 text-center relative z-10">
          <motion.h1
            className="text-5xl md:text-6xl font-bold mb-6"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Master TOEIC with{' '}
            <span className="bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
              LeEnglish
            </span>
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Comprehensive TOEIC preparation platform designed to help you achieve your target score with
            interactive lessons, practice tests, and personalized learning paths.
          </motion.p>

          <motion.div
            className="max-w-md mx-auto"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            {isAuthenticated ? (
              <div className="space-y-4">
                <motion.p
                  className="text-lg"
                  whileHover={{ scale: 1.05 }}
                >
                  Welcome back, <span className="font-bold text-yellow-300">{currentUser?.username}</span>!
                  Ready to improve your TOEIC score?
                </motion.p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <EnhancedButton
                      variant="secondary"
                      size="lg"
                      onClick={() => navigate('/dashboard')}
                      className="w-full sm:w-auto"
                    >
                      📊 Go to Dashboard
                    </EnhancedButton>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <EnhancedButton
                      variant="ghost"
                      size="lg"
                      onClick={() => navigate('/lessons')}
                      className="w-full sm:w-auto border-2 border-white/30"
                    >
                      📚 Continue Learning
                    </EnhancedButton>
                  </motion.div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <EnhancedButton
                    variant="secondary"
                    size="lg"
                    onClick={() => navigate('/register')}
                    className="w-full sm:w-auto font-semibold"
                  >
                    🚀 Get Started Free
                  </EnhancedButton>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <EnhancedButton
                    variant="ghost"
                    size="lg"
                    onClick={() => navigate('/pricing')}
                    className="w-full sm:w-auto border-2 border-white/30"
                  >
                    💡 Learn More
                  </EnhancedButton>
                </motion.div>
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        {/* Dynamic Stats Section */}
        <div className="mb-12">
          <StatsDynamic />
        </div>
        <div className="text-center mb-12">
          <motion.h2
            className="text-3xl font-bold text-gray-900 mb-4"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Why Choose LeEnglish?
          </motion.h2>
          <motion.p
            className="text-xl text-gray-600"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            Comprehensive TOEIC preparation with proven results
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <motion.div
            className="text-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
          >
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-blue-600 text-2xl">📚</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Interactive Lessons</h3>
            <p className="text-gray-600">
              Engaging content designed to improve your listening and reading skills
            </p>
          </motion.div>

          <motion.div
            className="text-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
          >
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-green-600 text-2xl">🎯</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Practice Tests</h3>
            <p className="text-gray-600">
              Realistic practice tests that simulate the actual TOEIC experience
            </p>
          </motion.div>

          <motion.div
            className="text-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
          >
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-purple-600 text-2xl">📊</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Progress Tracking</h3>
            <p className="text-gray-600">
              Monitor your improvement with detailed analytics and insights
            </p>
          </motion.div>
        </div>

        {/* Flashcard Sets Section */}
        <motion.div
          className="mb-16"
          initial={{ y: 40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Featured Flashcard Sets
            </h2>
            <p className="text-xl text-gray-600">
              Start learning with our curated flashcard collections
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {flashcardSets.length > 0 ? (
              flashcardSets.slice(0, 6).map((set, index) => (
                <motion.div
                  key={set.id}
                  className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                  initial={{ y: 30, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5, scale: 1.02 }}
                >
                  <h3 className="text-xl font-semibold mb-2">{set.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{set.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      {set.flashcards?.length || 0} cards
                    </span>
                    <GuestInteraction actionName="study flashcards">
                      <EnhancedButton
                        variant={isAuthenticated ? "primary" : "ghost"}
                        size="sm"
                        onClick={() => {
                          if (isAuthenticated) {
                            navigate(`/flashcards/${set.id}`);
                          } else {
                            navigate('/login');
                          }
                        }}
                      >
                        {isAuthenticated ? "Study Now" : "Login to Study"}
                      </EnhancedButton>
                    </GuestInteraction>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full">
                <motion.div
                  className="text-center py-12"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-gray-400 text-2xl">📚</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    Flashcards Coming Soon
                  </h3>
                  <p className="text-gray-500 mb-6 max-w-md mx-auto">
                    {isAuthenticated
                      ? "We're preparing amazing flashcard sets for your TOEIC preparation. Check back soon!"
                      : "Sign up to access our comprehensive flashcard collections and accelerate your TOEIC learning journey."
                    }
                  </p>
                  {!isAuthenticated && (
                    <EnhancedButton
                      variant="primary"
                      size="md"
                      onClick={() => navigate('/register')}
                    >
                      Get Started Free
                    </EnhancedButton>
                  )}
                </motion.div>
              </div>
            )}
          </div>

          {flashcardSets.length > 6 && (
            <motion.div
              className="text-center mt-8"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <GuestInteraction actionName="view all flashcard sets">
                <EnhancedButton
                  variant="secondary"
                  size="lg"
                  onClick={() => {
                    if (isAuthenticated) {
                      navigate('/flashcards');
                    } else {
                      navigate('/login');
                    }
                  }}
                >
                  {isAuthenticated ? "View All Flashcard Sets" : "Login to View All"}
                </EnhancedButton>
              </GuestInteraction>
            </motion.div>
          )}
        </motion.div>

        {/* Lessons Section */}
        <motion.div
          className="mb-16"
          initial={{ y: 40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Featured Lessons
            </h2>
            <p className="text-xl text-gray-600">
              Explore interactive lessons designed to boost your TOEIC skills
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lessons.length > 0 ? (
              lessons.slice(0, 6).map((lesson, index) => (
                <motion.div
                  key={lesson.id}
                  className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                  initial={{ y: 30, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5, scale: 1.02 }}
                >
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-blue-600 text-lg">📖</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">{lesson.title}</h3>
                      {lesson.difficulty && (
                        <span className={`inline-block text-xs px-2 py-1 rounded-full ${lesson.difficulty.toUpperCase() === 'BEGINNER' || lesson.difficulty.toUpperCase() === 'EASY' ? 'bg-green-100 text-green-800' :
                          lesson.difficulty.toUpperCase() === 'INTERMEDIATE' || lesson.difficulty.toUpperCase() === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                          {lesson.difficulty}
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4 line-clamp-2">{lesson.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      {lesson.duration ? `${lesson.duration} min` :
                        lesson.estimatedTimeMinutes ? `${lesson.estimatedTimeMinutes} min` :
                          'Quick lesson'}
                    </span>
                    <GuestInteraction actionName="start lesson">
                      <EnhancedButton
                        variant={isAuthenticated ? "primary" : "ghost"}
                        size="sm"
                        onClick={() => {
                          if (isAuthenticated) {
                            navigate(`/lessons/${lesson.id}`);
                          } else {
                            navigate('/login');
                          }
                        }}
                      >
                        {isAuthenticated ? "Start Lesson" : "Login to Learn"}
                      </EnhancedButton>
                    </GuestInteraction>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full">
                <motion.div
                  className="text-center py-12"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-gray-400 text-2xl">📖</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    Lessons Coming Soon
                  </h3>
                  <p className="text-gray-500 mb-6 max-w-md mx-auto">
                    {isAuthenticated
                      ? "We're creating comprehensive lesson plans for your TOEIC preparation. Check back soon!"
                      : "Sign up to access our interactive lessons and accelerate your TOEIC learning journey."
                    }
                  </p>
                  {!isAuthenticated && (
                    <EnhancedButton
                      variant="primary"
                      size="md"
                      onClick={() => navigate('/register')}
                    >
                      Get Started Free
                    </EnhancedButton>
                  )}
                </motion.div>
              </div>
            )}
          </div>

          {lessons.length > 6 && (
            <motion.div
              className="text-center mt-8"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <GuestInteraction actionName="view all lessons">
                <EnhancedButton
                  variant="secondary"
                  size="lg"
                  onClick={() => {
                    if (isAuthenticated) {
                      navigate('/lessons');
                    } else {
                      navigate('/login');
                    }
                  }}
                >
                  {isAuthenticated ? "View All Lessons" : "Login to View All"}
                </EnhancedButton>
              </GuestInteraction>
            </motion.div>
          )}
        </motion.div>

        {/* Call to Action Section */}
        {!isAuthenticated && (
          <motion.div
            className="bg-gradient-to-r from-blue-600 to-purple-700 text-white rounded-lg p-8 text-center"
            initial={{ y: 40, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.h2
              className="text-3xl font-bold mb-4"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Ready to Start Learning?
            </motion.h2>
            <motion.p
              className="text-xl mb-6"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              Join thousands of students who have improved their TOEIC scores with LeEnglish
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <EnhancedButton
                  variant="secondary"
                  size="lg"
                  onClick={() => navigate('/register')}
                  className="w-full sm:w-auto"
                >
                  🚀 Create Free Account
                </EnhancedButton>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <EnhancedButton
                  variant="ghost"
                  size="lg"
                  onClick={() => navigate('/login')}
                  className="w-full sm:w-auto border-2 border-white/30"
                >
                  🔑 Login
                </EnhancedButton>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default HomePage;