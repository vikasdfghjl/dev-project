import { CodeBlock } from "./CodeBlock";
import type { Endpoint, HttpMethod } from "../types/documentation";

interface EndpointCardProps {
  endpoint: Endpoint;
  baseUrl?: string;
}

export function EndpointCard({ endpoint, baseUrl = "" }: EndpointCardProps) {
  const getMethodColor = (method: string): string => {
    const colors: Record<HttpMethod, string> = {
      GET: "bg-green-100 text-green-800 border-green-200",
      POST: "bg-blue-100 text-blue-800 border-blue-200",
      PUT: "bg-yellow-100 text-yellow-800 border-yellow-200",
      PATCH: "bg-purple-100 text-purple-800 border-purple-200",
      DELETE: "bg-red-100 text-red-800 border-red-200",
    };
    return (
      colors[method as HttpMethod] ||
      "bg-gray-100 text-gray-800 border-gray-200"
    );
  };

  return (
    <div className="border border-gray-200 rounded-lg p-6 mb-4 bg-white">
      <div className="flex items-center gap-3 mb-3">
        <span
          className={`px-3 py-1 text-xs font-medium rounded-full border ${getMethodColor(endpoint.method)}`}
        >
          {endpoint.method}
        </span>
        <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
          {baseUrl}
          {endpoint.path}
        </code>
      </div>

      <p className="text-gray-700 mb-4">{endpoint.description}</p>

      {endpoint.parameters?.query_params && (
        <div className="mb-4">
          <h4 className="font-medium text-gray-900 mb-2">Query Parameters:</h4>
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
            {endpoint.parameters.query_params.map((param, index) => (
              <li key={index}>{param}</li>
            ))}
          </ul>
        </div>
      )}

      {endpoint.example_request && (
        <div className="mb-4">
          <h4 className="font-medium text-gray-900 mb-2">Example Request:</h4>
          <CodeBlock
            code={JSON.stringify(endpoint.example_request, null, 2)}
            language="json"
          />
        </div>
      )}

      {endpoint.example_response && (
        <div>
          <h4 className="font-medium text-gray-900 mb-2">Example Response:</h4>
          <CodeBlock
            code={JSON.stringify(endpoint.example_response, null, 2)}
            language="json"
          />
        </div>
      )}
    </div>
  );
}
