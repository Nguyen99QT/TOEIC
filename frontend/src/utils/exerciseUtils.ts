export const getDifficultyColor = (difficulty: string): string => {
  switch (difficulty.toLowerCase()) {
    case "easy":
      return "bg-green-100 text-green-800";
    case "medium":
      return "bg-yellow-100 text-yellow-800";
    case "hard":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const getExerciseGradient = (index: number): string => {
  const gradients = [
    "bg-gradient-to-br from-blue-500 to-blue-600",
    "bg-gradient-to-br from-purple-500 to-purple-600",
    "bg-gradient-to-br from-green-500 to-green-600",
    "bg-gradient-to-br from-pink-500 to-pink-600",
    "bg-gradient-to-br from-indigo-500 to-indigo-600",
  ];
  return gradients[index % gradients.length];
};

export const getButtonGradient = (index: number): string => {
  const gradients = [
    "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700",
    "bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700",
    "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700",
    "bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700",
    "bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700",
  ];
  return gradients[index % gradients.length];
};

export const formatTimeLimit = (seconds: number): string => {
  if (seconds < 60) {
    return `${seconds}s`;
  }
  return `${Math.ceil(seconds / 60)} min`;
};

export const calculateTotalTime = (exercises: any[]): number => {
  return Math.ceil(
    exercises.reduce((sum, ex) => sum + ex.time_limit_seconds, 0) / 60
  );
};

export const calculateTotalPoints = (exercises: any[]): number => {
  return exercises.reduce((sum, ex) => sum + ex.points, 0);
};
