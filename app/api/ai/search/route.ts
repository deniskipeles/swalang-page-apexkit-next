import { NextRequest, NextResponse } from "next/server";
import { VectorAI, AIContext } from "@/lib/ai";

export async function POST(req: NextRequest) {
  try {
    const { projectId, query } = await req.json();
    
    if (!projectId || !query) {
      return NextResponse.json({ error: "Missing params" }, { status: 400 });
    }

    // ApexKit Vector search handles the heavy lifting now, 
    // we no longer need to pass the giant fileTree array.
    const context: AIContext = {
      projectId: projectId,
      fileTree: [], 
      query: query,
    };

    const response = await VectorAI.analyze(projectId, context);
    return NextResponse.json(response);
    
  } catch (err: any) {
    console.error("AI Search failed:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}