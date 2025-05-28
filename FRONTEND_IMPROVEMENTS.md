# Frontend Structure Improvements

## 📁 **Recommended Directory Structure**

```
frontend/
├── src/                          # Move all source code here
│   ├── components/               # Organized by feature/domain
│   │   ├── ui/                   # Reusable UI components
│   │   │   ├── Button/
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Button.module.css
│   │   │   │   └── index.ts
│   │   │   ├── Modal/
│   │   │   ├── Input/
│   │   │   ├── LoadingSpinner/
│   │   │   └── index.ts          # Barrel exports
│   │   ├── layout/               # Layout components
│   │   │   ├── Header/
│   │   │   ├── Sidebar/
│   │   │   └── index.ts
│   │   ├── features/             # Feature-specific components
│   │   │   ├── articles/
│   │   │   │   ├── ArticleList/
│   │   │   │   ├── ArticleView/
│   │   │   │   ├── ArticleCard/
│   │   │   │   └── index.ts
│   │   │   ├── feeds/
│   │   │   │   ├── FeedList/
│   │   │   │   ├── FeedItem/
│   │   │   │   ├── AddFeedModal/
│   │   │   │   └── index.ts
│   │   │   ├── folders/
│   │   │   ├── settings/
│   │   │   └── index.ts
│   │   └── icons/               # Keep as is but improve
│   ├── hooks/                   # Custom hooks
│   │   ├── useLocalStorage.ts
│   │   ├── useDebounce.ts
│   │   ├── useArticleFiltering.ts
│   │   └── index.ts
│   ├── utils/                   # Utility functions
│   │   ├── dateUtils.ts
│   │   ├── formatters.ts
│   │   ├── constants.ts
│   │   └── index.ts
│   ├── services/                # API services
│   │   ├── api/
│   │   │   ├── rssService.ts
│   │   │   ├── settingsService.ts
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── types/                   # Type definitions
│   │   ├── api.ts
│   │   ├── components.ts
│   │   ├── app.ts
│   │   └── index.ts
│   ├── context/                 # Context providers
│   │   ├── AppContext.tsx
│   │   ├── AppReducer.ts
│   │   └── index.ts
│   ├── styles/                  # Global styles and themes
│   │   ├── globals.css
│   │   ├── themes.css
│   │   └── variables.css
│   ├── App.tsx
│   └── index.tsx
├── public/                      # Static assets
├── package.json
└── README.md
```

## 🔧 **Code Quality Improvements**

### 1. **Eliminate Code Duplication**

#### A. Create Reusable Utility Functions

**Current Issue**: Date formatting is duplicated across multiple components

**Solution**: Extract to utility functions

```typescript
// src/utils/dateUtils.ts
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }) + ' ' + date.toLocaleTimeString(undefined, { 
    hour: '2-digit', 
    minute: '2-digit'
  });
};

export const formatRelativeDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) return 'Just now';
  if (diffInHours < 24) return `${diffInHours}h ago`;
  if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
  return formatDate(dateString);
};
```

#### B. Create Reusable Button Component

**Current Issue**: Button styles and patterns repeated everywhere

```typescript
// src/components/ui/Button/Button.tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-primary hover:bg-primary-dark text-primary-foreground focus:ring-primary',
    secondary: 'bg-secondary hover:bg-secondary/80 text-secondary-foreground focus:ring-secondary',
    ghost: 'hover:bg-muted text-foreground focus:ring-primary',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500'
  };
  
  const sizes = {
    sm: 'text-sm px-3 py-1.5',
    md: 'text-sm px-4 py-2',
    lg: 'text-base px-6 py-3'
  };
  
  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
        </svg>
      ) : leftIcon}
      {children}
      {rightIcon}
    </button>
  );
};
```

### 2. **Custom Hooks for Logic Separation**

#### A. Article Filtering Hook

```typescript
// src/hooks/useArticleFiltering.ts
export const useArticleFiltering = (articles: Article[]) => {
  const [sortOption, setSortOption] = useState<ArticleSortOption>('date-desc');
  const [filterOption, setFilterOption] = useState<ArticleFilterOption>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAndSortedArticles = useMemo(() => {
    let filtered = articles;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(article => 
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.contentSnippet?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply read/unread filter
    if (filterOption === 'read') {
      filtered = filtered.filter(article => article.isRead);
    } else if (filterOption === 'unread') {
      filtered = filtered.filter(article => !article.isRead);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortOption) {
        case 'date-desc':
          return new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime();
        case 'date-asc':
          return new Date(a.pubDate).getTime() - new Date(b.pubDate).getTime();
        case 'title-asc':
          return a.title.localeCompare(b.title);
        case 'title-desc':
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });

    return filtered;
  }, [articles, sortOption, filterOption, searchQuery]);

  return {
    filteredAndSortedArticles,
    sortOption,
    setSortOption,
    filterOption,
    setFilterOption,
    searchQuery,
    setSearchQuery
  };
};
```

#### B. Local Storage Hook

```typescript
// src/hooks/useLocalStorage.ts
export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue] as const;
};
```

### 3. **Better Type Organization**

#### Split types into logical modules

```typescript
// src/types/api.ts
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// src/types/entities.ts
export interface Article {
  id: string;
  title: string;
  link: string;
  pubDate: string;
  contentSnippet?: string;
  content?: string;
  feedId: string;
  feedTitle?: string;
  isRead?: boolean;
  author?: string;
  imageUrl?: string;
}

// src/types/components.ts
export interface BaseComponentProps {
  className?: string;
  'data-testid'?: string;
}

export interface SelectableItem {
  id: string;
  isSelected: boolean;
  onSelect: () => void;
}
```

### 4. **Component Composition Patterns**

#### A. Compound Components for Complex UI

```typescript
// src/components/ui/Dropdown/Dropdown.tsx
interface DropdownContextType {
  isOpen: boolean;
  toggle: () => void;
  close: () => void;
}

const DropdownContext = createContext<DropdownContextType | null>(null);

const useDropdown = () => {
  const context = useContext(DropdownContext);
  if (!context) {
    throw new Error('Dropdown components must be used within Dropdown');
  }
  return context;
};

export const Dropdown = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const toggle = useCallback(() => setIsOpen(prev => !prev), []);
  const close = useCallback(() => setIsOpen(false), []);
  
  return (
    <DropdownContext.Provider value={{ isOpen, toggle, close }}>
      <div className="relative">{children}</div>
    </DropdownContext.Provider>
  );
};

Dropdown.Trigger = ({ children }: { children: React.ReactNode }) => {
  const { toggle } = useDropdown();
  return (
    <button onClick={toggle} className="dropdown-trigger">
      {children}
    </button>
  );
};

Dropdown.Content = ({ children }: { children: React.ReactNode }) => {
  const { isOpen, close } = useDropdown();
  
  if (!isOpen) return null;
  
  return (
    <div className="absolute top-full left-0 z-50 mt-1 bg-white shadow-lg rounded-md">
      {children}
    </div>
  );
};
```

### 5. **Error Boundaries and Loading States**

```typescript
// src/components/ui/ErrorBoundary/ErrorBoundary.tsx
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<
  React.PropsWithChildren<{ fallback?: React.ComponentType<{ error: Error }> }>,
  ErrorBoundaryState
> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;
      return <FallbackComponent error={this.state.error!} />;
    }

    return this.props.children;
  }
}
```

### 6. **Service Layer Improvements**

```typescript
// src/services/api/baseService.ts
class BaseApiService {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  protected async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  protected get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  protected post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  protected put<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  protected delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// src/services/api/rssService.ts
export class RssService extends BaseApiService {
  constructor() {
    super(process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api/v1');
  }

  async getFeeds(): Promise<Feed[]> {
    const data = await this.get<Feed[]>('/feeds/');
    return data.map(this.transformFeed);
  }

  private transformFeed = (feed: any): Feed => ({
    ...feed,
    id: String(feed.id),
    folderId: feed.folder_id ? String(feed.folder_id) : null,
  });
}
```

## 🎯 **Implementation Priority**

1. **High Priority** (Do First):
   - Create utility functions for date formatting
   - Extract reusable Button component
   - Organize types into separate modules
   - Create custom hooks for article filtering

2. **Medium Priority**:
   - Restructure directory organization
   - Implement compound components
   - Add error boundaries
   - Improve service layer

3. **Low Priority** (Nice to Have):
   - Add testing utilities
   - Implement theme system
   - Add animation components
   - Create storybook documentation

## 🔍 **Benefits of These Changes**

- **Maintainability**: Easier to find and modify code
- **Reusability**: Components can be used across the app
- **Type Safety**: Better TypeScript support and intellisense
- **Performance**: Reduced bundle size through tree shaking
- **Developer Experience**: Better dev tools and debugging
- **Scalability**: Easier to add new features

Would you like me to implement any of these improvements step by step?
