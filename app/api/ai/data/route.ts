import { NextRequest, NextResponse } from "next/server";
import { getProjectServer } from "@/lib/api";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get("projectId");
  
  if (!projectId) {
    return NextResponse.json({ error: "Missing projectId" }, { status: 400 });
  }

  try {
    const projectData = await getProjectServer(projectId);
    
    return NextResponse.json({ 
      type: "split", 
      files: projectData.files 
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}