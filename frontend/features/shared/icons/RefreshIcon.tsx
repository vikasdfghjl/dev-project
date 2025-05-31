import React from 'react';

export const RefreshIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4.5 19.5A9 9 0 1112 21a9 9 0 01-7.5-1.5M4.5 19.5V15m0 4.5h4.5"
    />
  </svg>
);
