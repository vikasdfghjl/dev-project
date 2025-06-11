import React, { useState } from "react";
import { TrashIcon } from "../../../shared/icons/TrashIcon";

interface ArticleCleanupSectionProps {
  onCleanup: (days: number) => Promise<void>;
}

const ArticleCleanupSectionComponent: React.FC<ArticleCleanupSectionProps> = ({
  onCleanup,
}) => {
  const [selectedDays, setSelectedDays] = useState<number>(28);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");

  const handleCleanup = async () => {
    setIsLoading(true);
    setMessage("");
    setMessageType("");

    try {
      await onCleanup(selectedDays);
      setMessage(
        `Successfully deleted articles older than ${selectedDays} days`
      );
      setMessageType("success");
    } catch (err: any) {
      setMessage(err.message || "Failed to cleanup articles");
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-card dark:bg-slate-800 rounded-lg shadow-sm border border-border dark:border-slate-700 p-6">
      <div className="flex items-center mb-4">
        <TrashIcon className="w-6 h-6 mr-3 text-muted-foreground dark:text-slate-400" />
        <h3 className="text-lg font-semibold text-foreground dark:text-slate-200">
          Article Cleanup
        </h3>
      </div>

      <p className="text-sm text-muted-foreground dark:text-slate-400 mb-4">
        Remove old articles to keep your database clean and improve performance.
        This action cannot be undone.
      </p>

      <div className="space-y-4">
        <div>
          <label
            htmlFor="cleanup-days"
            className="block text-sm font-medium text-muted-foreground dark:text-slate-300 mb-2"
          >
            Delete articles older than:
          </label>
          <select
            id="cleanup-days"
            value={selectedDays}
            onChange={e => setSelectedDays(Number(e.target.value))}
            disabled={isLoading}
            className="w-full px-3 py-2 border border-border dark:border-slate-600 rounded-lg bg-background dark:bg-slate-700 text-foreground dark:text-slate-200 focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:border-primary dark:focus:border-primary-dark outline-none transition-all"
          >
            <option value={7}>7 days</option>
            <option value={14}>14 days</option>
            <option value={28}>28 days (recommended)</option>
          </select>
        </div>

        {message && (
          <div
            className={`p-3 rounded-lg text-sm ${
              messageType === "success"
                ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800"
                : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800"
            }`}
          >
            {message}
          </div>
        )}

        <button
          onClick={handleCleanup}
          disabled={isLoading}
          className="w-full px-4 py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Cleaning up...
            </>
          ) : (
            <>
              <TrashIcon className="w-4 h-4 mr-2" />
              Delete Old Articles
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export const ArticleCleanupSection = React.memo(ArticleCleanupSectionComponent);
