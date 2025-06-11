import type { Workflow } from "../types/documentation";

interface WorkflowSectionProps {
  workflows: Workflow[];
}

export function WorkflowSection({ workflows }: WorkflowSectionProps) {
  return (
    <div className="space-y-6">
      {workflows.map((workflow, index) => (
        <div
          key={index}
          className="border border-gray-200 rounded-lg p-6 bg-white"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {workflow.name}
          </h3>
          <ol className="space-y-3">
            {workflow.steps.map((step, stepIndex) => (
              <li key={stepIndex} className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-sm font-medium">
                  {stepIndex + 1}
                </span>
                <div className="flex-1">
                  <code className="text-sm bg-gray-100 px-2 py-1 rounded font-mono break-all">
                    {step}
                  </code>
                </div>
              </li>
            ))}
          </ol>
        </div>
      ))}
    </div>
  );
}
