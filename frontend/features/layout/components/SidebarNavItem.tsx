
import React from 'react';

interface SidebarNavItemProps {
  label: string;
  // Fix: Specify that the icon is a ReactElement that accepts SVG props, ensuring 'className' is a valid prop for cloneElement.
  icon: React.ReactElement<React.SVGProps<SVGSVGElement>>;
  isSelected: boolean;
  onClick: () => void;
  isCollapsed: boolean;
  title?: string; // For tooltip when collapsed
}

const SidebarNavItemComponent: React.FC<SidebarNavItemProps> = ({
  label,
  icon,
  isSelected,
  onClick,
  isCollapsed,
  title
}) => {
  const IconComponent = React.cloneElement(icon, {
    className: `h-5 w-5 flex-shrink-0 ${isCollapsed ? '' : 'mr-2.5'} ${isSelected ? 'text-primary dark:text-primary-dark' : 'text-muted-foreground dark:text-slate-400'}`,
  });

  return (
    <li className={`group ${isCollapsed ? '' : 'px-2'}`}>
      <div
        onClick={onClick}
        className={`
          flex items-center w-full px-3 py-2.5 my-0.5 rounded-md cursor-pointer transition-all duration-150 ease-in-out
          text-sm font-medium 
          focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 dark:focus:ring-offset-slate-800
          ${isCollapsed ? 'justify-center' : ''}
          ${isSelected
            ? 'bg-primary/15 text-primary dark:bg-primary-dark/25 dark:text-primary-dark'
            : 'text-foreground hover:bg-muted dark:text-slate-200 dark:hover:bg-slate-700/60'}
        `}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && onClick()}
        aria-selected={isSelected}
        title={isCollapsed ? title || label : undefined}
      >
        {IconComponent}
        {!isCollapsed && <span className="truncate">{label}</span>}
      </div>
    </li>
  );
};
export const SidebarNavItem = React.memo(SidebarNavItemComponent);
