import { useDocumentation } from "../hooks/useDocumentation";
import { DocSection } from "./DocSection";

interface DocumentationPageProps {
  onClose?: () => void;
}

export function DocumentationPage({ onClose }: DocumentationPageProps) {
  const { documentation, loading, error, refetch } = useDocumentation();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading documentation...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 text-6xl mb-4">📚</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Documentation Not Available
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={refetch}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!documentation) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No documentation available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Close button */}
          {onClose && (
            <div className="mb-6">
              <button
                onClick={onClose}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Back to FluxReader
              </button>
            </div>
          )}

          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {documentation.title}
            </h1>
            <p className="text-xl text-gray-600 mb-4">
              {documentation.description}
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                Version {documentation.version}
              </span>
              <span>
                Generated:{" "}
                {new Date(documentation.generated_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto py-4">
            {documentation.sections.map((section, index) => (
              <a
                key={index}
                href={`#section-${index}`}
                className="whitespace-nowrap text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
              >
                {section.title}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Table of Contents */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">
                Table of Contents
              </h3>
              <nav className="space-y-2">
                {documentation.sections.map((section, index) => (
                  <a
                    key={index}
                    href={`#section-${index}`}
                    className="block text-sm text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    {section.title}
                  </a>
                ))}
              </nav>

              {/* Support Links */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-3">
                  Additional Resources
                </h4>
                <div className="space-y-2">
                  <a
                    href={documentation.support.swagger_ui}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-sm text-blue-600 hover:text-blue-800"
                  >
                    Swagger UI →
                  </a>
                  <a
                    href={documentation.support.redoc}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-sm text-blue-600 hover:text-blue-800"
                  >
                    ReDoc →
                  </a>
                </div>
              </div>
            </div>
          </aside>

          {/* Documentation Sections */}
          <div className="lg:col-span-3">
            {documentation.sections.map((section, index) => (
              <div key={index} id={`section-${index}`}>
                <DocSection
                  section={section}
                  baseUrl={section.content.base_url}
                />
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p className="mb-2">{documentation.support.github}</p>
            <p className="text-sm">
              FluxReader Documentation • Last updated:{" "}
              {new Date(documentation.generated_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
