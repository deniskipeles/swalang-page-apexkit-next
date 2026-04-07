import { apex } from "./apexkit";

export interface AIPlugin {
  name: string;
  analyze(projectId: string, context: AIContext): Promise<AIResponse>;
}

export interface AIContext {
  projectId: string;
  fileTree: any[];
  targetFile?: string;
  query?: string;
}

export interface AIResponse {
  suggestions: string[];
  relatedFiles: string[];
  code?: string;
}

export const VectorAI: AIPlugin = {
  name: "ApexVectorAI",
  async analyze(projectId, context) {
    if (!context.query) return { suggestions: [], relatedFiles: [] };

    // 1. Use ApexKit's built-in semantic Vector Search!
    // It searches the 'content' field of the 'files' collection.
    const vectorResults = await apex.collection('files').searchTextVector(context.query, 5);

    // 2. Filter results client-side to ensure they belong to this project
    // (In the future, ApexKit will support filtered vector searches natively)
    const projectFiles = vectorResults.filter(r => r.data.project_id === projectId);

    const relatedFiles = projectFiles.map((r) => r.data.path);

    // 3. Optional: Pass the results to an LLM Action for a natural language answer
    /*
    const aiRes = await apex.ai.run('code-assistant', {
        query: context.query,
        context_files: JSON.stringify(projectFiles.map(f => f.data))
    });
    */

    return {
      suggestions: [
        `Found ${relatedFiles.length} semantically similar files using Apex Vector Engine.`,
      ],
      relatedFiles,
    };
  },
};