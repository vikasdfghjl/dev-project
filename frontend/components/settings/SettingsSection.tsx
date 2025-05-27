
import React from 'react';

interface SettingsSectionProps {
  title: string;
  actionButton?: React.ReactNode;
  children: React.ReactNode;
  emptyStateMessage?: string;
  itemCount?: number;
}

const SettingsSectionComponent: React.FC<SettingsSectionProps> = ({ 
  title, 
  actionButton, 
  children, 
  emptyStateMessage = "No items to display.",
  itemCount = 0
}) => {
  return (
    <section className="bg-card dark:bg-slate-800 p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-border dark:border-slate-700">
        <h2 className="text-xl font-semibold text-foreground dark:text-slate-200">{title}</h2>
        {actionButton}
      </div>
      {itemCount > 0 ? (
        <ul className="space-y-3">
          {children}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground dark:text-slate-400 py-4 text-center">{emptyStateMessage}</p>
      )}
    </section>
  );
};
export const SettingsSection = React.memo(SettingsSectionComponent);
