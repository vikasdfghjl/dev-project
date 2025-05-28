/**
 * Date utility functions for formatting and manipulating dates
 */

/**
 * Formats a date string into a readable format
 * @param dateString - ISO date string or any valid date string
 * @returns Formatted date string (e.g., "January 15, 2024 at 14:30")
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }) + ' at ' + date.toLocaleTimeString(undefined, { 
    hour: '2-digit', 
    minute: '2-digit'
  });
};

/**
 * Formats a date string into a compact format
 * @param dateString - ISO date string or any valid date string
 * @returns Compact formatted date string (e.g., "Jan 15, 2024 14:30")
 */
export const formatDateCompact = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date');
    }
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch (error) {
    return formatRelativeDate(dateString);
  }
};

/**
 * Formats a date string into a relative time format
 * @param dateString - ISO date string or any valid date string
 * @returns Relative time string (e.g., "2h ago", "3d ago", or full date if older)
 */
export const formatRelativeDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date');
    }
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return 'just now';
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return `${diffInDays}d ago`;
    }

    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) {
      return `${diffInWeeks}w ago`;
    }

    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
      return `${diffInMonths}mo ago`;
    }

    const diffInYears = Math.floor(diffInDays / 365);
    return `${diffInYears}y ago`;
  } catch (error) {
    return 'unknown date';
  }
};

/**
 * Checks if a date is today
 * @param dateString - ISO date string or any valid date string
 * @returns true if the date is today, false otherwise
 */
export const isToday = (dateString: string): boolean => {
  const date = new Date(dateString);
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

/**
 * Checks if a date is yesterday
 * @param dateString - ISO date string or any valid date string
 * @returns true if the date is yesterday, false otherwise
 */
export const isYesterday = (dateString: string): boolean => {
  const date = new Date(dateString);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return date.toDateString() === yesterday.toDateString();
};

/**
 * Groups articles by date for display purposes
 * @param articles - Array of articles with pubDate
 * @returns Object with date keys and article arrays
 */
export const groupByDate = <T extends { pubDate: string }>(items: T[]): Record<string, T[]> => {
  return items.reduce((groups, item) => {
    const date = new Date(item.pubDate);
    const dateKey = date.toDateString();
    
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(item);
    
    return groups;
  }, {} as Record<string, T[]>);
};

/**
 * Formats a date key for display in grouped lists
 * @param dateKey - Date string from Date.toDateString()
 * @returns Formatted date string for display
 */
export const formatDateGroupHeader = (dateKey: string): string => {
  const date = new Date(dateKey);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  }
  
  if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  }
  
  return date.toLocaleDateString(undefined, { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};
