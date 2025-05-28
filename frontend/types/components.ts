// Component prop types and UI-specific types

import React from 'react';

// Button component types (already defined in ui/Button.tsx but exported here for consistency)
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'muted';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

// Modal types
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: React.ReactNode;
  children: React.ReactNode;
  footerContent?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

// Common component props
export interface BaseItemProps {
  className?: string;
  children?: React.ReactNode;
}

export interface ListItemProps extends BaseItemProps {
  isSelected?: boolean;
  isHovered?: boolean;
  onClick?: () => void;
}
