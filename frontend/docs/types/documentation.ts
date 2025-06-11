// Documentation data types
export interface DocumentationData {
  title: string;
  version: string;
  description: string;
  sections: DocSection[];
  generated_at: string;
  support: {
    github: string;
    swagger_ui: string;
    redoc: string;
  };
}

export interface DocSection {
  title: string;
  content: {
    overview?: string;
    description?: string;
    quick_start?: string[];
    base_url?: string;
    endpoints?: Endpoint[];
    features?: string[];
    workflows?: Workflow[];
    tips?: string[];
    error_handling?: string[];
    interactive_docs?: string;
    content_type?: string;
    authentication?: string;
    rate_limiting?: string;
    query_params?: string[];
  };
}

export interface Endpoint {
  method: string;
  path: string;
  description: string;
  example_request?: Record<string, any>;
  example_response?: Record<string, any>;
  parameters?: {
    query_params?: string[];
  };
}

export interface Workflow {
  name: string;
  steps: string[];
}

export interface WorkflowStep {
  step: string;
  description?: string;
}

// HTTP Method types for styling
export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
