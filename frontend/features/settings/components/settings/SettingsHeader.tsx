import React from "react";
import { ChevronLeftIcon } from "../../../shared/icons/ChevronLeftIcon";
import { GearIcon } from "../../../shared/icons/GearIcon";

interface SettingsHeaderProps {
  onCloseSettings: () => void;
}

const SettingsHeaderComponent: React.FC<SettingsHeaderProps> = ({
  onCloseSettings,
}) => {
  return (
    <div className="mb-8 max-w-4xl mx-auto">
      <button
        onClick={onCloseSettings}
        className="mb-4 flex items-center text-sm text-primary dark:text-primary-dark hover:underline focus:outline-none focus:ring-1 focus:ring-primary rounded px-1 py-0.5"
      >
        <ChevronLeftIcon className="w-4 h-4 mr-1" />
        Back to Feeds
      </button>
      <div className="flex items-center space-x-3">
        <GearIcon className="w-8 h-8 text-foreground dark:text-slate-200" />
        <h1 className="text-3xl font-bold text-foreground dark:text-slate-100">
          Settings
        </h1>
      </div>
      <p className="mt-1 text-muted-foreground dark:text-slate-400">
        Manage your feed sources and folders.
      </p>
    </div>
  );
};
export const SettingsHeader = React.memo(SettingsHeaderComponent);
