import { NextRequest, NextResponse } from "next/server";
import { getApexServer } from "@/lib/apexkit";
import { initialFileSystem } from "@/lib/constants";

export async function POST(req: NextRequest) {
  const apex = await getApexServer();

  try {
    const user = await apex.auth.getMe();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, description } = await req.json();
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json({ error: "Project name is required" }, { status: 400 });
    }

    // 1. Flatten files first
    const flatFiles = flattenTree(initialFileSystem);
    // 2. Generate tree as array of paths
    const treePaths = flatFiles.map(f => f.path);

    // 3. Create the project record
    const project = await apex.collection('projects').create({
      name: name.trim(),
      description: description || "",
      owner_id: user.id,
      tree: treePaths // Save as string[]
    });

    // 4. Trigger the Edge Function to save individual files and generate the first snapshot
    await apex.scripts.run('save-project', {
      project_id: project.id, // ID is passed as string from SDK, script should parseInt
      tree: treePaths,
      files: flatFiles,
      version_label: "v1.0 - Initial Commit"
    });

    return NextResponse.json({ projectId: project.id }, { status: 201 });

  } catch (err: any) {
    console.error("Project creation failed:", err);
    return NextResponse.json({ error: `Creation failed: ${err.message}` }, { status: 500 });
  }
}

// Helper to flatten the initial filesystem
function flattenTree(nodes: any[], prefix = ""): {path: string, content: string}[] {
  return nodes.flatMap((n) => {
    const path = prefix ? `${prefix}/${n.name}` : n.name;
    if (n.type === "folder") return flattenTree(n.children || [], path);
    return [{ path, content: n.content || "" }];
  });
}