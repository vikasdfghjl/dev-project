import { BaseApiService } from "../../services/api/BaseApiService";
import type { DocumentationData } from "../types/documentation";

class DocsService extends BaseApiService {
  constructor() {
    super(import.meta.env.VITE_API_URL || "/api/v1");
  }

  /**
   * Fetch the complete FluxReader documentation
   */
  async getDocumentation(): Promise<DocumentationData> {
    try {
      const data = await this.get<DocumentationData>("/docs/");
      return data;
    } catch (error) {
      console.error("Failed to fetch documentation:", error);
      throw new Error("Unable to load documentation. Please try again later.");
    }
  }

  /**
   * Check if documentation endpoint is available
   */
  async checkDocsAvailability(): Promise<boolean> {
    try {
      await this.get("/docs/");
      return true;
    } catch (error) {
      return false;
    }
  }
}

export const docsService = new DocsService();
