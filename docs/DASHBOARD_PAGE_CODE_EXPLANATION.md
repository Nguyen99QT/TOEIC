# Dashboard Page Code Explanation

## Tổng quan

`DashboardPage` là một React component phức tạp hiển thị thông tin tổng quan về tiến trình học tập của người dùng. Component này sử dụng nhiều công nghệ hiện đại như Framer Motion, Heroicons, và TypeScript.

## 1. Imports và Dependencies

```tsx
import {
  AcademicCapIcon,
  ArrowTrendingUpIcon,
  BookOpenIcon,
  ChartBarIcon,
  ClockIcon,
  FireIcon,
  SparklesIcon,
  TrophyIcon,
} from "@heroicons/react/24/outline";
```

**Ý nghĩa**: Import các icon từ Heroicons library để hiển thị biểu tượng đẹp mắt cho từng thống kê.

```tsx
import { motion } from "framer-motion";
```

**Ý nghĩa**: Import Framer Motion để tạo animations và transitions mượt mà.

```tsx
import { useAuth } from "../contexts/AuthContext";
```

**Ý nghĩa**: Hook để lấy thông tin authentication của user hiện tại.

```tsx
import dashboardService, {
  DashboardStats,
  RecentActivity,
} from "../services/dashboard";
import lessonService, { LessonProgress } from "../services/lessons";
```

**Ý nghĩa**: Import các service để fetch dữ liệu từ backend API.

## 2. State Management

```tsx
const [stats, setStats] = useState<DashboardStats | null>(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
const [lessonProgress, setLessonProgress] = useState<LessonProgress[]>([]);
```

**Ý nghĩa**:

- `stats`: Lưu trữ thống kê dashboard (lessons completed, practice tests, etc.)
- `loading`: Trạng thái đang tải dữ liệu
- `error`: Lưu trữ lỗi nếu có
- `lessonProgress`: Danh sách tiến trình các bài học

## 3. Data Fetching Effect

```tsx
useEffect(() => {
  if (!isAuthenticated) return; // Chỉ fetch khi đã đăng nhập

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("🔄 DashboardPage: Starting to fetch dashboard data...");
      const dashboardStats = await dashboardService.getDashboardStats();
      console.log("✅ DashboardPage: Dashboard data fetched successfully");
      setStats(dashboardStats);
    } catch (err: any) {
      console.error("❌ DashboardPage: Dashboard data fetch error:", {
        message: err.message,
        status: err?.response?.status,
        statusText: err?.response?.statusText,
        endpoint: err?.config?.url,
      });
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  fetchDashboardData();
}, [isAuthenticated]);
```

**Ý nghĩa**:

- Chỉ fetch dữ liệu khi user đã đăng nhập
- Sử dụng async/await để xử lý API calls
- Có error handling và logging chi tiết để debug
- Dependency array `[isAuthenticated]` đảm bảo effect chạy lại khi authentication state thay đổi

## 4. Utility Functions

```tsx
const formatTimeAgo = (timestamp: string) => {
  const now = new Date();
  const activityTime = new Date(timestamp);
  const diffInMinutes = Math.floor(
    (now.getTime() - activityTime.getTime()) / (1000 * 60)
  );

  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  } else if (diffInMinutes < 1440) {
    // 24 hours
    return `${Math.floor(diffInMinutes / 60)}h ago`;
  } else {
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  }
};
```

**Ý nghĩa**: Format thời gian thành dạng "5m ago", "2h ago", "3d ago" để user dễ đọc.

```tsx
const getActivityIcon = (type: RecentActivity["type"]) => {
  switch (type) {
    case "lesson":
      return <BookOpenIcon className="w-5 h-5 text-blue-500" />;
    case "test":
      return <AcademicCapIcon className="w-5 h-5 text-green-500" />;
    case "flashcard":
      return <SparklesIcon className="w-5 h-5 text-purple-500" />;
    case "achievement":
      return <TrophyIcon className="w-5 h-5 text-yellow-500" />;
    default:
      return <ClockIcon className="w-5 h-5 text-gray-500" />;
  }
};
```

**Ý nghĩa**: Trả về icon phù hợp cho mỗi loại activity với màu sắc riêng biệt.

## 5. Animation Configurations

```tsx
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};
```

**Ý nghĩa**:

- `containerVariants`: Animation cho toàn bộ container với staggered children
- `cardVariants`: Animation cho từng card riêng lẻ (fade in + slide up)

## 6. Loading State

```tsx
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
        <p className="text-gray-600 animate-pulse">Loading your dashboard...</p>
      </motion.div>
    </div>
  );
}
```

**Ý nghĩa**: Hiển thị loading spinner với animation khi đang fetch dữ liệu.

## 7. Error State

```tsx
if (error) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div
        className="text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-red-500 text-xl mb-4">
          Failed to load dashboard
        </div>
        <p className="text-gray-600">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Retry
        </button>
      </motion.div>
    </div>
  );
}
```

**Ý nghĩa**: Hiển thị error message và nút retry khi có lỗi xảy ra.

## 8. Stats Cards Section

```tsx
<motion.div
  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
  variants={cardVariants}
>
  {/* Lessons Completed */}
  <motion.div
    className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-500"
    whileHover={{ scale: 1.02 }}
    transition={{ type: "spring", stiffness: 300 }}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">Lessons Completed</p>
        <p className="text-3xl font-bold text-gray-900">
          {stats.lessonsCompleted}
        </p>
        <p className="text-sm text-green-600">
          +{stats.weeklyProgress.lessonsThisWeek} this week
        </p>
      </div>
      <BookOpenIcon className="w-12 h-12 text-blue-500" />
    </div>
  </motion.div>
  {/* More cards... */}
</motion.div>
```

**Ý nghĩa**:

- Responsive grid layout (1 cột mobile, 2 cột tablet, 4 cột desktop)
- Mỗi card có hover effect (scale up 2%)
- Border-left màu sắc khác nhau cho mỗi metric
- Hiển thị số liệu chính + tiến trình tuần này

## 9. Recent Activity Section

```tsx
{
  stats.recentActivity.length > 0 ? (
    <div className="space-y-4">
      {stats.recentActivity.map((activity: RecentActivity) => (
        <motion.div
          key={activity.id}
          className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
          whileHover={{ x: 5 }}
        >
          <div className="flex-shrink-0">{getActivityIcon(activity.type)}</div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {activity.title}
            </p>
            <p className="text-sm text-gray-500 truncate">
              {activity.description}
            </p>
          </div>
          <div className="flex-shrink-0 text-right">
            {activity.score && (
              <p className="text-sm font-medium text-green-600">
                {activity.score}%
              </p>
            )}
            <p className="text-xs text-gray-400">
              {formatTimeAgo(activity.timestamp)}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  ) : (
    <div className="text-center py-8">
      <ClockIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <p className="text-gray-500">No recent activity yet</p>
      <p className="text-sm text-gray-400">
        Start learning to see your progress here!
      </p>
    </div>
  );
}
```

**Ý nghĩa**:

- Conditional rendering: hiển thị activities nếu có, ngược lại hiển thị empty state
- Mỗi activity có icon riêng, hover effect slide right
- Truncate text để tránh overflow
- Hiển thị score và timestamp được format

## 10. Lesson Progress Table

```tsx
{
  lessonProgress.length > 0 ? (
    <table className="min-w-full divide-y divide-gray-200">
      <thead>
        <tr>
          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
            Lesson
          </th>
          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
            Progress
          </th>
          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
            Score
          </th>
          <th className="px-4 py-2"></th>
        </tr>
      </thead>
      <tbody>
        {lessonProgress.map((lp) => (
          <tr key={lp.lessonId}>
            <td className="px-4 py-2">{lp.lessonTitle}</td>
            <td className="px-4 py-2">
              <div className="w-32 bg-gray-100 rounded-full h-3">
                <div
                  className="bg-blue-500 h-3 rounded-full"
                  style={{ width: `${lp.progress}%` }}
                ></div>
              </div>
              <span className="ml-2 text-sm text-gray-600">{lp.progress}%</span>
            </td>
            <td className="px-4 py-2">{lp.score ?? "-"}</td>
            <td className="px-4 py-2">
              <a
                href={`/lessons/${lp.lessonId}`}
                className="text-blue-600 hover:underline"
              >
                {lp.progress < 100 ? "Continue" : "Review"}
              </a>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  ) : (
    <div className="text-gray-500">No lessons started yet.</div>
  );
}
```

**Ý nghĩa**:

- Table responsive hiển thị danh sách lessons
- Progress bar visual với CSS styling
- Conditional text: "Continue" nếu chưa hoàn thành, "Review" nếu đã xong
- Nullish coalescing operator (`??`) để handle null score

## 11. Quick Actions Section

```tsx
<motion.button
  className="w-full text-left p-3 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors"
  whileHover={{ x: 5 }}
>
  <div className="flex items-center space-x-3">
    <BookOpenIcon className="w-5 h-5 text-blue-600" />
    <span className="text-blue-600 font-medium">Continue Learning</span>
  </div>
</motion.button>
```

**Ý nghĩa**:

- Buttons với hover effects (color change + slide right)
- Consistent styling với icon và text
- Full-width buttons cho mobile-friendly

## Tổng kết

Component này thể hiện nhiều best practices:

1. **Type Safety**: Sử dụng TypeScript với proper typing
2. **Error Handling**: Comprehensive error handling và logging
3. **Loading States**: Proper loading và error states
4. **Responsive Design**: Mobile-first approach với responsive grid
5. **Animations**: Smooth animations với Framer Motion
6. **Code Organization**: Tách biệt logic thành utility functions
7. **User Experience**: Intuitive interface với proper feedback
8. **Performance**: Conditional rendering và proper dependency management

Đây là một component phức tạp nhưng được tổ chức tốt, dễ maintain và mở rộng.
