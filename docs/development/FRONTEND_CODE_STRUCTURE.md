# Frontend Code Structure Explanation

## Tổng Quan Kiến Trúc Frontend

Dự án TOEIC Learning Platform sử dụng **Next.js** với **TypeScript** và **Tailwind CSS**, được tổ chức theo cấu trúc component-based với các pattern hiện đại.

## Cấu Trúc Thư Mục Chi Tiết

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router (Layout & Root Pages)
│   │   ├── globals.css        # Global CSS với Tailwind imports
│   │   ├── layout.tsx         # Root layout component
│   │   ├── page.tsx           # Home page (/)
│   │   └── login/
│   │       └── page.tsx       # Login page (/login)
│   │
│   ├── components/            # Reusable UI Components
│   │   ├── Dashboard.tsx      # Main dashboard component
│   │   ├── Dashboard.module.css # Component-specific styles
│   │   ├── QuestionCard.tsx   # Question display component
│   │   ├── TestSession.tsx    # Test taking interface
│   │   └── ErrorBoundary.tsx  # Error handling wrapper
│   │
│   ├── pages/                 # Page Components (Custom routing)
│   │   ├── DashboardPage.tsx  # Dashboard page content
│   │   └── flashcards/
│   │       ├── FlashcardsPage.tsx     # Flashcard sets listing
│   │       └── FlashcardStudyPage.tsx # Study interface
│   │
│   ├── contexts/              # React Context Providers
│   │   └── AuthContext.tsx    # Authentication state management
│   │
│   ├── services/              # API Integration Layer
│   │   ├── api.ts            # Base API configuration & auth
│   │   └── lessons.ts        # Lessons-specific API calls
│   │
│   ├── types/                 # TypeScript Type Definitions
│   │   └── index.ts          # Shared interfaces & types
│   │
│   └── lib/                   # Utility Functions
│       └── api.ts            # API utilities & helpers
│
├── public/                    # Static Assets
├── next.config.js            # Next.js configuration
├── tailwind.config.js        # Tailwind CSS configuration
├── tsconfig.json            # TypeScript configuration
└── package.json             # Dependencies & scripts
```

## Giải Thích Chi Tiết Từng Phần

### 1. App Directory (`src/app/`)

**Next.js App Router Pattern:**

```tsx
// layout.tsx - Root layout cho toàn bộ ứng dụng
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="container mx-auto px-4 py-8">{children}</main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
```

### 2. Components Directory (`src/components/`)

**Reusable UI Components với TypeScript:**

```tsx
// ErrorBoundary.tsx - Error handling component
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<
  React.PropsWithChildren<{}>,
  ErrorBoundaryState
> {
  // Error boundary implementation
}
```

**QuestionCard.tsx - Atomic component pattern:**

```tsx
interface QuestionCardProps {
  question: Question;
  onAnswer: (answer: string) => void;
  isAnswered?: boolean;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  onAnswer,
  isAnswered = false,
}) => {
  // Component logic
};
```

### 3. Pages Directory (`src/pages/`)

**Custom Page Components (không phải Next.js pages):**

Các component này được import và sử dụng trong App Router:

```tsx
// DashboardPage.tsx - Dashboard content
const DashboardPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Dashboard stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatsCard title="Lessons Completed" value="12" />
        {/* More cards */}
      </div>
    </div>
  );
};
```

### 4. Contexts Directory (`src/contexts/`)

**React Context cho State Management:**

```tsx
// AuthContext.tsx - Authentication state
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Authentication logic với localStorage persistence
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      validateToken(token).then(setUser);
    }
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, login, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
```

### 5. Services Directory (`src/services/`)

**API Integration Layer với Axios:**

```tsx
// api.ts - Base API configuration
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Request interceptor để thêm auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor để handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("authToken");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
```

**Service Layer Pattern:**

```tsx
// lessons.ts - Lessons API service
export const lessonService = {
  async getAllLessons(): Promise<Lesson[]> {
    try {
      const response = await api.get("/lessons");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch lessons:", error);
      throw new Error("Unable to load lessons");
    }
  },

  async getLessonById(id: number): Promise<Lesson> {
    const response = await api.get(`/lessons/${id}`);
    return response.data;
  },
};
```

### 6. Types Directory (`src/types/`)

**Unified TypeScript Interfaces:**

```tsx
// index.ts - Centralized type definitions
export interface User {
  id: number;
  email: string;
  full_name: string;
  created_at: string;
  updated_at: string;
}

export interface FlashcardSet {
  id: number;
  title: string;
  description?: string;
  total_cards: number;
  created_at: string;
  updated_at: string;
}

export interface Flashcard {
  id: number;
  set_id: number;
  front_text: string;
  back_text: string;
  difficulty_level?: "easy" | "medium" | "hard";
  created_at: string;
  updated_at: string;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: "success" | "error";
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    current_page: number;
    total_pages: number;
    total_items: number;
    items_per_page: number;
  };
}
```

## Patterns và Best Practices

### 1. Component Design Patterns

**Compound Components Pattern:**

```tsx
const FlashcardStudy = {
  Container: ({ children }: { children: React.ReactNode }) => (
    <div className="flashcard-container">{children}</div>
  ),
  Card: ({ flashcard }: { flashcard: Flashcard }) => (
    <div className="flashcard">{/* Card content */}</div>
  ),
  Controls: ({
    onNext,
    onPrev,
  }: {
    onNext: () => void;
    onPrev: () => void;
  }) => <div className="controls">{/* Navigation buttons */}</div>,
};

// Usage:
<FlashcardStudy.Container>
  <FlashcardStudy.Card flashcard={currentCard} />
  <FlashcardStudy.Controls onNext={nextCard} onPrev={prevCard} />
</FlashcardStudy.Container>;
```

### 2. Error Handling Strategy

**Progressive Enhancement với Error Boundaries:**

```tsx
const FlashcardsPage: React.FC = () => {
  const [flashcardSets, setFlashcardSets] = useState<FlashcardSet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFlashcardSets = async () => {
      try {
        setLoading(true);
        const sets = await flashcardService.getAllSets();
        setFlashcardSets(sets || []); // Fallback cho undefined
      } catch (err) {
        setError("Failed to load flashcard sets");
        console.error("Flashcard loading error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadFlashcardSets();
  }, []);

  // Loading state
  if (loading) {
    return <LoadingSpinner />;
  }

  // Error state với fallback UI
  if (error) {
    return (
      <ErrorMessage message={error} retry={() => window.location.reload()} />
    );
  }

  // Empty state
  if (flashcardSets.length === 0) {
    return <EmptyState message="No flashcard sets available" />;
  }

  return (
    <div className="flashcards-grid">
      {flashcardSets.map((set) => (
        <FlashcardSetCard key={set.id} set={set} />
      ))}
    </div>
  );
};
```

### 3. Type Safety với Generic Types

```tsx
// Custom hook với generic types
function useApi<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get<ApiResponse<T>>(url);
      setData(response.data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [url]);

  return { data, loading, error, refetch: fetchData };
}

// Usage:
const { data: lessons, loading, error } = useApi<Lesson[]>("/lessons");
```

### 4. Responsive Design với Tailwind CSS

```tsx
const DashboardGrid: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Cards adapt to screen size */}
      <div className="card hover:shadow-lg transition-shadow duration-200">
        <div className="card-body p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-medium">Statistics</h3>
        </div>
      </div>
    </div>
  );
};
```

## Data Flow Architecture

### 1. Authentication Flow

```
User Login → AuthContext → localStorage → API interceptor → Backend verification
                ↓
          Global auth state → Protected routes → Component access
```

### 2. API Data Flow

```
Component → Service layer → Axios interceptor → Backend API
     ↑                                              ↓
Loading/Error states ← Response transformation ← JSON response
```

### 3. State Management Flow

```
Component state (useState) → User interactions → API calls → State updates → UI re-render
       ↑                                                          ↓
Context state (useContext) ← Global state changes ← Service responses
```

## Performance Optimizations

### 1. Code Splitting với Dynamic Imports

```tsx
// Lazy loading cho heavy components
const FlashcardStudyPage = dynamic(() => import("./FlashcardStudyPage"), {
  loading: () => <LoadingSpinner />,
  ssr: false,
});
```

### 2. Memoization

```tsx
const FlashcardSetCard = React.memo<{ set: FlashcardSet }>(({ set }) => {
  const handleClick = useCallback(() => {
    navigate(`/flashcards/${set.id}`);
  }, [set.id, navigate]);

  return (
    <div onClick={handleClick} className="card cursor-pointer">
      {/* Card content */}
    </div>
  );
});
```

### 3. Image Optimization

```tsx
import Image from "next/image";

const ProfileImage: React.FC<{ user: User }> = ({ user }) => {
  return (
    <Image
      src={user.avatar || "/default-avatar.png"}
      alt={user.full_name}
      width={40}
      height={40}
      className="rounded-full"
      priority={false} // Lazy load non-critical images
    />
  );
};
```

## Accessibility & UX Considerations

### 1. Keyboard Navigation

```tsx
const FlashcardCard: React.FC = () => {
  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      flipCard();
    }
  };

  return (
    <div
      className="flashcard"
      tabIndex={0}
      role="button"
      aria-label="Flip flashcard"
      onKeyDown={handleKeyPress}
      onClick={flipCard}
    >
      {/* Card content */}
    </div>
  );
};
```

### 2. Loading States và Skeleton UI

```tsx
const FlashcardListSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="card animate-pulse">
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-3/4"></div>
        </div>
      ))}
    </div>
  );
};
```

## Environment Configuration

```typescript
// Environment variables handling
const config = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api",
  isDevelopment: process.env.NODE_ENV === "development",
  isProduction: process.env.NODE_ENV === "production",
  enableDebugMode: process.env.NEXT_PUBLIC_DEBUG === "true",
};

// Usage trong components
if (config.enableDebugMode) {
  console.log("API Response:", response);
}
```

## Testing Strategy

```typescript
// Component testing với React Testing Library
import { render, screen, fireEvent } from "@testing-library/react";
import { FlashcardSetCard } from "./FlashcardSetCard";

describe("FlashcardSetCard", () => {
  const mockSet: FlashcardSet = {
    id: 1,
    title: "Test Set",
    description: "Test Description",
    total_cards: 10,
    created_at: "2023-01-01",
    updated_at: "2023-01-01",
  };

  it("renders flashcard set information correctly", () => {
    render(<FlashcardSetCard set={mockSet} />);

    expect(screen.getByText("Test Set")).toBeInTheDocument();
    expect(screen.getByText("10 cards")).toBeInTheDocument();
  });

  it("navigates to study page when clicked", () => {
    const mockNavigate = jest.fn();
    render(<FlashcardSetCard set={mockSet} />);

    fireEvent.click(screen.getByRole("button"));
    expect(mockNavigate).toHaveBeenCalledWith("/flashcards/1");
  });
});
```

Cấu trúc này đảm bảo code maintainable, scalable, và follows React/Next.js best practices với TypeScript type safety hoàn chỉnh.
