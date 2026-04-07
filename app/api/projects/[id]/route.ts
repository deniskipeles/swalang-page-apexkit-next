import { NextRequest, NextResponse } from "next/server";
import { getApexServer } from "@/lib/apexkit";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const projectId = params.id;
  const apex = await getApexServer();
  
  try {
    const user = await apex.auth.getMe();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Expect 'files' to be {path, content}[]
    const { files } = await req.json();
    
    if (!files || !Array.isArray(files)) {
      return NextResponse.json({ error: "Files array is required" }, { status: 400 });
    }
    
    // Call the Edge Function
    const res = await apex.scripts.run('save-project', {
      project_id: projectId,
      // tree is implicitly generated from files in the script now, or we can pass it
      // but the script I provided derives tree logic. 
      // Passing it explicit matches the creation logic.
      files: files, 
      version_label: `autosave-${new Date().toISOString()}`
    });

    return NextResponse.json({ success: true, version_id: res.version_id }, { status: 200 });

  } catch (err: any) {
    console.error(`Failed to save project ${projectId}:`, err);
    return NextResponse.json({ error: `Save failed: ${err.message}` }, { status: 500 });
  }
}