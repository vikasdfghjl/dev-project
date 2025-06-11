import React, { useState } from "react";
import { GearIcon } from "../../../shared/icons/GearIcon";
import type { AppSettings, SettingsUpdate } from "../../../../types";

interface AutoCleanupSettingsSectionProps {
  settings: AppSettings;
  onUpdateSettings: (settings: SettingsUpdate) => Promise<void>;
}

const AutoCleanupSettingsSectionComponent: React.FC<
  AutoCleanupSettingsSectionProps
> = ({ settings, onUpdateSettings }) => {
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");

  const handleToggleAutoCleanup = async (enabled: boolean) => {
    setIsUpdating(true);
    setMessage("");
    setMessageType("");

    try {
      await onUpdateSettings({ auto_cleanup_enabled: enabled });
      setMessage(enabled ? "Auto cleanup enabled" : "Auto cleanup disabled");
      setMessageType("success");
    } catch (err: any) {
      setMessage(err.message || "Failed to update auto cleanup setting");
      setMessageType("error");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCleanupDaysChange = async (days: number) => {
    if (days === settings.auto_cleanup_days) return;

    setIsUpdating(true);
    setMessage("");
    setMessageType("");

    try {
      await onUpdateSettings({ auto_cleanup_days: days });
      setMessage(`Auto cleanup period updated to ${days} days`);
      setMessageType("success");
    } catch (err: any) {
      setMessage(err.message || "Failed to update cleanup period");
      setMessageType("error");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRefreshIntervalChange = async (minutes: number) => {
    if (minutes === settings.refresh_interval_minutes) return;

    setIsUpdating(true);
    setMessage("");
    setMessageType("");

    try {
      await onUpdateSettings({ refresh_interval_minutes: minutes });
      setMessage(`Refresh interval updated to ${minutes} minutes`);
      setMessageType("success");
    } catch (err: any) {
      setMessage(err.message || "Failed to update refresh interval");
      setMessageType("error");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="bg-card dark:bg-slate-800 rounded-lg shadow-sm border border-border dark:border-slate-700 p-6">
      <div className="flex items-center mb-6">
        <GearIcon className="w-6 h-6 mr-3 text-muted-foreground dark:text-slate-400" />
        <h3 className="text-lg font-semibold text-foreground dark:text-slate-200">
          Application Settings
        </h3>
      </div>

      {message && (
        <div
          className={`p-3 rounded-lg text-sm mb-4 ${
            messageType === "success"
              ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800"
              : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800"
          }`}
        >
          {message}
        </div>
      )}

      <div className="space-y-6">
        {/* Auto Cleanup Toggle */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label
              htmlFor="auto-cleanup-toggle"
              className="block text-sm font-medium text-foreground dark:text-slate-200"
            >
              Automatic Article Cleanup
            </label>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                id="auto-cleanup-toggle"
                type="checkbox"
                checked={settings.auto_cleanup_enabled}
                onChange={e => handleToggleAutoCleanup(e.target.checked)}
                disabled={isUpdating}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
          <p className="text-xs text-muted-foreground dark:text-slate-400">
            Automatically delete old articles based on the period you set below
          </p>
        </div>

        {/* Cleanup Period */}
        <div className={settings.auto_cleanup_enabled ? "" : "opacity-50"}>
          <label
            htmlFor="cleanup-period"
            className="block text-sm font-medium text-muted-foreground dark:text-slate-300 mb-2"
          >
            Auto cleanup period:
          </label>
          <select
            id="cleanup-period"
            value={settings.auto_cleanup_days}
            onChange={e => handleCleanupDaysChange(Number(e.target.value))}
            disabled={isUpdating || !settings.auto_cleanup_enabled}
            className="w-full max-w-xs px-3 py-2 border border-border dark:border-slate-600 rounded-lg bg-background dark:bg-slate-700 text-foreground dark:text-slate-200 focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:border-primary dark:focus:border-primary-dark outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value={7}>7 days</option>
            <option value={14}>14 days</option>
            <option value={28}>28 days (recommended)</option>
          </select>
          <p className="text-xs text-muted-foreground dark:text-slate-400 mt-1">
            Articles older than this period will be automatically deleted daily
          </p>
        </div>

        {/* Refresh Interval */}
        <div>
          <label
            htmlFor="refresh-interval"
            className="block text-sm font-medium text-muted-foreground dark:text-slate-300 mb-2"
          >
            Feed refresh interval:
          </label>
          <select
            id="refresh-interval"
            value={settings.refresh_interval_minutes}
            onChange={e => handleRefreshIntervalChange(Number(e.target.value))}
            disabled={isUpdating}
            className="w-full max-w-xs px-3 py-2 border border-border dark:border-slate-600 rounded-lg bg-background dark:bg-slate-700 text-foreground dark:text-slate-200 focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:border-primary dark:focus:border-primary-dark outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value={5}>Every 5 minutes</option>
            <option value={10}>Every 10 minutes</option>
            <option value={15}>Every 15 minutes</option>
            <option value={30}>Every 30 minutes</option>
            <option value={60}>Every 60 minutes</option>
          </select>
          <p className="text-xs text-muted-foreground dark:text-slate-400 mt-1">
            How often the app checks for new articles in the background
          </p>
        </div>
      </div>
    </div>
  );
};

export const AutoCleanupSettingsSection = React.memo(
  AutoCleanupSettingsSectionComponent
);
