import {
  AcademicCapIcon,
  ArrowRightIcon,
  BookOpenIcon,
  ChartBarIcon,
  ClockIcon,
  LightBulbIcon,
  PlayIcon,
  SparklesIcon,
  StarIcon,
  TrophyIcon
} from '@heroicons/react/24/outline';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import { useAuth } from '../contexts/AuthContext'; // Use AuthContext instead of direct service
import { flashcardService } from '../services/flashcards'; // Thêm dòng này nếu chưa có
import { lessonService } from '../services/lessons'; // Named import, not default
import { FlashcardSet, Lesson } from '../types';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useAuth();

  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [flashcards, setFlashcards] = useState<FlashcardSet[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      icon: <BookOpenIcon className="w-8 h-8" />,
      title: "Interactive Lessons",
      description: "Comprehensive TOEIC preparation with real exam scenarios"
    },
    {
      icon: <AcademicCapIcon className="w-8 h-8" />,
      title: "Smart Flashcards",
      description: "Spaced repetition system for vocabulary mastery"
    },
    {
      icon: <ChartBarIcon className="w-8 h-8" />,
      title: "Progress Tracking",
      description: "Detailed analytics to monitor your improvement"
    },
    {
      icon: <TrophyIcon className="w-8 h-8" />,
      title: "Achievement System",
      description: "Gamified learning with rewards and milestones"
    }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Only log in development mode
        if (process.env.NODE_ENV === 'development') {
          console.log('🔄 Loading homepage data...');
        }

        // Fetch lessons based on authentication status
        let lessonsData: Lesson[] = [];
        let flashcardsData: FlashcardSet[] = [];

        try {
          if (isAuthenticated) {
            console.log('🔐 User authenticated, fetching all lessons...');
            lessonsData = await lessonService.getAllLessons();
          } else {
            console.log('👤 Guest user, fetching free lessons...');
            lessonsData = await lessonService.getFreeLessons();
          }
        } catch (error: any) {
          console.error('❌ Error fetching lessons:', error);
          try {
            lessonsData = await lessonService.getFreeLessons();
          } catch (fallbackError) {
            console.error('❌ Fallback also failed:', fallbackError);
            lessonsData = [];
          }
        }

        // Lấy flashcard sets từ backend thay vì mock
        try {
          flashcardsData = await flashcardService.getAllFlashcardSets();
          console.log('✅ Flashcard sets loaded:', flashcardsData);
        } catch (error) {
          console.error('❌ Error fetching flashcard sets:', error);
          flashcardsData = [];
        }

        setLessons(Array.isArray(lessonsData) ? lessonsData : []);
        setFlashcards(Array.isArray(flashcardsData) ? flashcardsData : []);

        console.log('✅ Homepage data loaded:', {
          lessonsCount: lessonsData.length,
          flashcardsCount: flashcardsData.length,
          lessonsData,
          flashcardsData,
        });

      } catch (error) {
        console.error('❌ Failed to fetch homepage data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, currentUser]); // Proper dependencies

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [features.length]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        damping: 20,
        stiffness: 300
      }
    },
    hover: {
      scale: 1.05,
      y: -5,
      transition: {
        type: "spring" as const,
        damping: 20,
        stiffness: 400
      }
    }
  };

  const heroVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.6, -0.05, 0.01, 0.99] as [number, number, number, number]
      }
    }
  };

  // Event handlers
  const handleStartLesson = (lessonId: number) => {
    if (!isAuthenticated) {
      navigate('/auth/login', {
        state: {
          message: 'Please log in to access lessons',
          from: `/lessons/${lessonId}`
        }
      });
      return;
    }
    navigate(`/lessons/${lessonId}`);
  };

  const handleStudyFlashcards = (setId: number) => {
    // Chỉ chuyển hướng sang trang study, không kiểm tra đăng nhập, không redirect login
    navigate(`/flashcards/study/${setId}`);
  };

  // Handler for mobile menu click is now handled in Navbar internally

  // Helper function to format lesson level
  const formatLessonLevel = (level: string): string => {
    switch (level) {
      case 'A1': return 'Beginner';
      case 'A2': return 'Elementary';
      case 'B1': return 'Intermediate';
      case 'B2': return 'Upper Intermediate';
      case 'C1': return 'Advanced';
      case 'C2': return 'Proficient';
      default: return level;
    }
  };

  const getLevelColorClass = (level: string): string => {
    switch (level) {
      case 'A1':
      case 'A2':
        return 'bg-green-100 text-green-800';
      case 'B1':
      case 'B2':
        return 'bg-yellow-100 text-yellow-800';
      case 'C1':
      case 'C2':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Only log in development mode when needed
  if (process.env.NODE_ENV === 'development' && loading) {
    console.log("🏠 HomePage loading...");
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          className="flex flex-col items-center space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 animate-pulse">Loading your learning journey...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <motion.div
        className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Hero Section */}
        <motion.section
          className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white"
          variants={heroVariants}
        >
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/50 to-purple-600/50"></div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <motion.div
              className="text-center"
              variants={itemVariants}
            >
              <motion.h1
                className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-purple-100"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Master TOEIC
                <motion.span
                  className="block text-yellow-300"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  with TOICEnglish
                </motion.span>
              </motion.h1>

              <motion.p
                className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                Experience the future of English learning with AI-powered lessons,
                interactive flashcards, and personalized progress tracking.
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <motion.button
                  className="bg-white text-blue-600 px-8 py-4 text-lg font-semibold rounded-lg hover:bg-blue-50 transition-colors flex items-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/lessons')}
                >
                  <PlayIcon className="w-5 h-5 mr-2" />
                  Start Learning
                  <ArrowRightIcon className="w-5 h-5 ml-2" />
                </motion.button>

                <motion.button
                  className="border-2 border-white text-white px-8 py-4 text-lg font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-colors flex items-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/flashcards')}
                >
                  <SparklesIcon className="w-5 h-5 mr-2" />
                  Explore Flashcards
                </motion.button>
              </motion.div>
            </motion.div>
          </div>

          {/* Floating Elements */}
          <motion.div
            className="absolute top-20 left-10 w-20 h-20 bg-yellow-300 rounded-full opacity-20"
            animate={{
              y: [0, -20, 0],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute bottom-20 right-10 w-16 h-16 bg-pink-300 rounded-full opacity-20"
            animate={{
              y: [0, 20, 0],
              rotate: [360, 180, 0]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.section>

        {/* Features Showcase */}
        <motion.section
          className="py-20 bg-white"
          variants={itemVariants}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-16"
              variants={itemVariants}
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Why Choose TOICEnglish?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Advanced learning technology meets proven teaching methods
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className={`bg-white rounded-lg p-8 text-center cursor-pointer border shadow-sm hover:shadow-lg transition-all ${activeFeature === index ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                    }`}
                  variants={cardVariants}
                  whileHover="hover"
                  onClick={() => setActiveFeature(index)}
                >
                  <motion.div
                    className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-6 ${activeFeature === index
                      ? 'bg-blue-600 text-white'
                      : 'bg-blue-100 text-blue-600'
                      }`}
                    animate={activeFeature === index ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 0.3 }}
                  >
                    {feature.icon}
                  </motion.div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Lessons Section */}
        <motion.section
          className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100"
          variants={itemVariants}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="flex justify-between items-center mb-12"
              variants={itemVariants}
            >
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  Featured Lessons
                </h2>
                <p className="text-xl text-gray-600">
                  {isAuthenticated
                    ? "Your personalized learning path awaits"
                    : "Try our free lessons to get started"
                  }
                </p>
              </div>
              <motion.button
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/lessons')}
              >
                View All Lessons
                <ArrowRightIcon className="w-4 h-4 ml-2" />
              </motion.button>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence>
                {lessons.slice(0, 3).map((lesson, index) => (
                  <motion.div
                    key={lesson.id}
                    className="bg-white rounded-lg shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow"
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    transition={{ delay: index * 0.1 }}
                    whileHover="hover"
                    onClick={() => handleStartLesson(lesson.id)}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getLevelColorClass(lesson.level)}`}>
                        {formatLessonLevel(lesson.level)}
                      </span>
                      <ClockIcon className="w-5 h-5 text-gray-500" />
                    </div>

                    <h3 className="text-xl font-semibold text-gray-900 mb-3 hover:text-blue-600 transition-colors">
                      {lesson.title}
                    </h3>

                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {lesson.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-500">
                        <LightBulbIcon className="w-4 h-4 mr-1" />
                        Interactive
                      </div>
                      <motion.div
                        className="flex items-center text-blue-600 font-medium hover:text-blue-700"
                        whileHover={{ x: 5 }}
                      >
                        Start Now
                        <ArrowRightIcon className="w-4 h-4 ml-1" />
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Show message if no lessons */}
            {lessons.length === 0 && (
              <motion.div
                className="text-center py-12"
                variants={itemVariants}
              >
                <BookOpenIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No lessons available</h3>
                <p className="text-gray-600">
                  Lessons are being prepared. Please check back later or contact admin if this is unexpected.
                </p>
              </motion.div>
            )}
          </div>
        </motion.section>

        {/* Flashcards Section */}
        <motion.section
          className="py-20 bg-white"
          variants={itemVariants}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="flex justify-between items-center mb-12"
              variants={itemVariants}
            >
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  Smart Flashcards
                </h2>
                <p className="text-xl text-gray-600">
                  Master vocabulary with our intelligent spaced repetition system
                </p>
              </div>
              <motion.button
                className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/flashcards')}
              >
                View All Sets
                <ArrowRightIcon className="w-4 h-4 ml-2" />
              </motion.button>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence>
                {(Array.isArray(flashcards) ? flashcards : []).slice(0, 3).map((set, index) => (
                  <motion.div
                    key={set.id}
                    className="bg-white rounded-lg shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow"
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    transition={{ delay: index * 0.1 }}
                    whileHover="hover"
                    onClick={() => handleStudyFlashcards(set.id)}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <StarIcon className="w-5 h-5 text-yellow-500 mr-2" />
                        <span className="text-sm font-medium text-gray-700">
                          {set.flashcards?.length || 0} cards
                        </span>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${set.difficultyLevel === 'BEGINNER' ? 'bg-green-100 text-green-800' :
                        set.difficultyLevel === 'INTERMEDIATE' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                        {set.difficultyLevel}
                      </span>
                    </div>

                    <h3 className="text-xl font-semibold text-gray-900 mb-3 hover:text-purple-600 transition-colors">
                      {set.title || set.name} {/* Use title if available, fallback to name */}
                    </h3>

                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {set.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-500">
                        <ClockIcon className="w-4 h-4 mr-1" />
                        {set.estimatedTimeMinutes} min
                      </div>
                      <motion.div
                        className="flex items-center text-purple-600 font-medium hover:text-purple-700"
                        whileHover={{ x: 5 }}
                        onClick={e => { e.stopPropagation(); handleStudyFlashcards(set.id); }}
                      >
                        Study Now
                        <ArrowRightIcon className="w-4 h-4 ml-1" />
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </motion.section>

        {/* Call to Action */}
        <motion.section
          className="py-20 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700 text-white relative overflow-hidden"
          variants={itemVariants}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/50 to-blue-600/50"></div>

          <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <motion.h2
              className="text-4xl md:text-5xl font-bold mb-6"
              variants={itemVariants}
            >
              Ready to Transform Your English?
            </motion.h2>

            <motion.p
              className="text-xl mb-8 text-blue-100"
              variants={itemVariants}
            >
              Join thousands of successful learners who've achieved their TOEIC goals with LeEnglish
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              variants={itemVariants}
            >
              {!isAuthenticated ? (
                <>
                  <motion.button
                    className="bg-white text-blue-600 px-8 py-4 text-lg font-semibold rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/auth/register')}
                  >
                    Start Free Trial
                    <SparklesIcon className="w-5 h-5 ml-2" />
                  </motion.button>
                  <motion.button
                    className="border-2 border-white text-white px-8 py-4 text-lg font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/auth/login')}
                  >
                    Sign In
                  </motion.button>
                </>
              ) : (
                <motion.button
                  className="bg-white text-blue-600 px-8 py-4 text-lg font-semibold rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/dashboard')}
                >
                  Continue Learning
                  <ArrowRightIcon className="w-5 h-5 ml-2" />
                </motion.button>
              )}
            </motion.div>
          </div>

          {/* Decorative Elements */}
          <motion.div
            className="absolute top-10 left-10 w-24 h-24 bg-yellow-300 rounded-full opacity-20"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute bottom-10 right-10 w-20 h-20 bg-pink-300 rounded-full opacity-20"
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [360, 180, 0]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.section>
      </motion.div>
    </>
  );
};

export default HomePage;