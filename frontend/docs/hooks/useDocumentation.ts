import { useState, useEffect } from "react";
import { docsService } from "../services/docsService";
import type { DocumentationData } from "../types/documentation";

interface UseDocumentationReturn {
  documentation: DocumentationData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useDocumentation(): UseDocumentationReturn {
  const [documentation, setDocumentation] = useState<DocumentationData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDocumentation = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await docsService.getDocumentation();
      setDocumentation(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load documentation";
      setError(errorMessage);
      console.error("Documentation fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocumentation();
  }, []);

  return {
    documentation,
    loading,
    error,
    refetch: fetchDocumentation,
  };
}
