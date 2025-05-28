// API request/response types and settings

export interface AppSettings {
  id: number;
  auto_cleanup_enabled: boolean;
  auto_cleanup_days: number;
  refresh_interval_minutes: number;
}

export interface SettingsUpdate {
  auto_cleanup_enabled?: boolean;
  auto_cleanup_days?: number;
  refresh_interval_minutes?: number;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface ApiError {
  success: false;
  message: string;
  code?: string;
}

// Feed parsing response
export interface FeedParseResponse {
  title: string;
  description?: string;
  link?: string;
}
