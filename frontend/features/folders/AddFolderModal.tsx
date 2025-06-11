import React, { useState } from "react";
import { FolderIcon, PlusIcon, Modal, Button } from "../shared";

interface AddFolderModalProps {
  onClose: () => void;
  onAddFolder: (name: string) => Promise<void>;
}

const AddFolderModalComponent: React.FC<AddFolderModalProps> = ({
  onClose,
  onAddFolder,
}) => {
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name.trim()) {
      setError("Please enter a folder name.");
      return;
    }
    setIsLoading(true);
    try {
      await onAddFolder(name);
      // onClose will be called by parent on success
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add folder.");
      setIsLoading(false);
    }
  };

  const modalTitle = (
    <div className="flex items-center">
      <FolderIcon className="w-7 h-7 mr-3 text-primary dark:text-primary-dark" />
      Create New Folder
    </div>
  );

  const footer = (
    <>
      <Button
        type="button"
        onClick={onClose}
        disabled={isLoading}
        variant="ghost"
        size="md"
      >
        Cancel
      </Button>
      <Button
        type="submit"
        form="add-folder-form"
        disabled={isLoading}
        variant="primary"
        size="md"
        isLoading={isLoading}
        leftIcon={!isLoading ? <PlusIcon className="w-4 h-4" /> : undefined}
      >
        {isLoading ? "Creating..." : "Create Folder"}
      </Button>
    </>
  );

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={modalTitle as any}
      footerContent={footer}
    >
      <form onSubmit={handleSubmit} id="add-folder-form">
        <div className="mb-1">
          <label
            htmlFor="folderName"
            className="block text-sm font-medium text-muted-foreground dark:text-slate-300 mb-1"
          >
            Folder Name
          </label>
          <input
            type="text"
            id="folderName"
            name="folderName"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g., Tech Blogs, News Sites"
            className="w-full px-3 py-2.5 border border-border dark:border-slate-600 rounded-lg bg-background dark:bg-slate-700 text-foreground dark:text-slate-200 focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:border-primary dark:focus:border-primary-dark outline-none transition-shadow"
            required
            disabled={isLoading}
            autoFocus
          />
        </div>
        {error && (
          <p className="text-sm text-red-600 dark:text-red-400 mt-3 text-center p-2 bg-red-50 dark:bg-red-900/30 rounded-md">
            {error}
          </p>
        )}
      </form>
    </Modal>
  );
};
export const AddFolderModal = React.memo(AddFolderModalComponent);
