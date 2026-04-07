import { getApexServer } from "@/lib/apexkit";
import { getProjectServer } from "@/lib/api";
import { notFound } from "next/navigation";
import FileIDEView from "@/components/FileIDEView";

// Prevent caching to ensure we get fresh data/auth state on every request
export const dynamic = 'force-dynamic';

export async function generateMetadata({ 
    params, 
    searchParams 
}: { 
    params: { id: string; path: string[] };
    searchParams?: { version?: string };
}) {
  const server = await getApexServer();
  const projectId = params.id;
  const versionId = searchParams?.version;
  const filePath = params.path.join("/");

  let projectName = projectId;
  try {
    const projectRecord = await server.collection('projects').get(projectId);
    if (projectRecord?.data?.name) {
      projectName = projectRecord.data.name;
    }
  } catch (error) {
    // Silently fall back to ID if not found
  }

  let versionInfo = '';
  if (versionId) {
    try {
      const snapshotRecord = await server.collection('snapshots').get(versionId);
      if (snapshotRecord?.data?.version_label) {
        versionInfo = snapshotRecord.data.version_label;
      } else {
        versionInfo = `${versionId.substring(0, 8)}...`;
      }
    } catch (error) {
       versionInfo = `${versionId.substring(0, 8)}...`;
    }
  }
  
  const title = versionInfo
    ? `${filePath} at ${versionInfo} - ${projectName}`
    : `${filePath} - ${projectName}`;
    
  const description = `Viewing file ${filePath} in project ${projectName}.`;

  return {
    title,
    description,
    openGraph: {
      title: title,
      description: `Navigate the full project and run your code live.`,
      type: "article",
    },
  };
}

export default async function FilePage({ 
    params,
    searchParams
}: { 
    params: { id: string; path: string[] };
    searchParams?: { version?: string };
}) {
  const path = params.path.join("/");
  const version = searchParams?.version;
  
  try {
    // 1. Fetch project and files using the new ApexKit server helper
    const projectData = await getProjectServer(params.id, version);

    if (!projectData) {
      notFound();
    }
    
    // 2. Extract specific file content from the returned files array
    const file = projectData.files?.find((f: any) => f.path === path);
    const content = file ? file.content : null;

    if (content === null) {
      notFound();
    }
    
    return (
      <FileIDEView
        projectId={params.id}
        initialProject={projectData as any}
        activeFilePath={path}
        initialContent={content}
        currentVersion={version}
      />
    );

  } catch (error) {
    console.error(`Error loading page for /project/${params.id}/file/${path} (Version: ${version}):`, error);
    notFound();
  }
}