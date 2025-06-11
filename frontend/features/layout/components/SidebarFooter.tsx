import React from "react";
import {
  PlusIcon,
  GearIcon,
  BookOpenIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  Button,
} from "../../shared";

interface SidebarFooterProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onAddFeedClick: () => void;
  onOpenSettingsClick: () => void;
  onOpenDocsClick: () => void; // New documentation handler
}

const SidebarFooterComponent: React.FC<SidebarFooterProps> = ({
  isCollapsed,
  onToggleCollapse,
  onAddFeedClick,
  onOpenSettingsClick,
  onOpenDocsClick,
}) => {
  return (
    <div
      className={`p-3 border-t border-border dark:border-slate-700 mt-auto flex items-center space-x-2 ${
        isCollapsed ? "flex-col space-y-2 space-x-0" : ""
      }`}
    >
      <Button
        onClick={onToggleCollapse}
        variant="ghost"
        size="md"
        className={`${isCollapsed ? "w-full" : ""}`}
        title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        aria-label={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        leftIcon={
          isCollapsed ? (
            <ChevronDoubleRightIcon className="h-5 w-5" />
          ) : (
            <ChevronDoubleLeftIcon className="h-5 w-5" />
          )
        }
      />
      <Button
        onClick={onAddFeedClick}
        variant="primary"
        size="md"
        className={`${isCollapsed ? "w-full" : "flex-1"}`}
        aria-label="Add new feed"
        title={isCollapsed ? "Add new feed" : undefined}
        leftIcon={<PlusIcon className="h-5 w-5" />}
      >
        {!isCollapsed && "Add Feed"}
      </Button>{" "}
      <Button
        onClick={onOpenDocsClick}
        variant="ghost"
        size="md"
        className={`${isCollapsed ? "w-full" : ""}`}
        title="Documentation"
        aria-label="Open FluxReader documentation"
        leftIcon={<BookOpenIcon className="h-5 w-5" />}
      />
      <Button
        onClick={onOpenSettingsClick}
        variant="ghost"
        size="md"
        className={`${isCollapsed ? "w-full" : ""}`}
        title="Settings"
        aria-label="Open settings for feeds and folders"
        leftIcon={<GearIcon className="h-5 w-5" />}
      />
    </div>
  );
};
export const SidebarFooter = React.memo(SidebarFooterComponent);
