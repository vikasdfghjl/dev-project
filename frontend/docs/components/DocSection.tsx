import { EndpointCard } from "./EndpointCard";
import { WorkflowSection } from "./WorkflowSection";
import type { DocSection as DocSectionType } from "../types/documentation";

interface DocSectionProps {
  section: DocSectionType;
  baseUrl?: string;
}

export function DocSection({ section, baseUrl }: DocSectionProps) {
  const { title, content } = section;

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-3">
        {title}
      </h2>

      {/* Overview */}
      {content.overview && (
        <div className="mb-6">
          <p className="text-gray-700 text-lg leading-relaxed">
            {content.overview}
          </p>
        </div>
      )}

      {/* Description */}
      {content.description && (
        <div className="mb-6">
          <p className="text-gray-700">{content.description}</p>
        </div>
      )}

      {/* Quick Start */}
      {content.quick_start && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Quick Start
          </h3>
          <ol className="space-y-2">
            {content.quick_start.map((step, index) => (
              <li key={index} className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-sm font-medium">
                  {index + 1}
                </span>
                <span className="text-gray-700">
                  {step.replace(/^\d+\.\s*/, "")}
                </span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Base URL */}
      {content.base_url && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Base URL:</h4>
          <code className="text-blue-800 font-mono">{content.base_url}</code>
        </div>
      )}

      {/* Endpoints */}
      {content.endpoints && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Endpoints
          </h3>
          {content.endpoints.map((endpoint, index) => (
            <EndpointCard
              key={index}
              endpoint={endpoint}
              baseUrl={baseUrl || content.base_url}
            />
          ))}
        </div>
      )}

      {/* Features */}
      {content.features && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Features</h3>
          <ul className="space-y-2">
            {content.features.map((feature, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span className="text-gray-700">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Workflows */}
      {content.workflows && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Workflows
          </h3>
          <WorkflowSection workflows={content.workflows} />
        </div>
      )}

      {/* Tips */}
      {content.tips && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Tips</h3>
          <ul className="space-y-2">
            {content.tips.map((tip, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-yellow-500 mt-1">💡</span>
                <span className="text-gray-700">{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Error Handling */}
      {content.error_handling && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Error Handling
          </h3>
          <ul className="space-y-2">
            {content.error_handling.map((item, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-red-500 mt-1">⚠️</span>
                <span className="text-gray-700">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* API Reference Info */}
      {content.interactive_docs && (
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <p className="text-gray-700 mb-2">{content.interactive_docs}</p>
          {content.base_url && (
            <div className="text-sm text-gray-600">
              <p>
                <strong>Base URL:</strong> <code>{content.base_url}</code>
              </p>
              {content.content_type && (
                <p>
                  <strong>Content Type:</strong>{" "}
                  <code>{content.content_type}</code>
                </p>
              )}
              {content.authentication && (
                <p>
                  <strong>Authentication:</strong> {content.authentication}
                </p>
              )}
              {content.rate_limiting && (
                <p>
                  <strong>Rate Limiting:</strong> {content.rate_limiting}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
