import { getProjectServer } from "@/lib/api";
import { notFound } from "next/navigation";
import ProjectIDE from "@/components/ProjectIDE";

// Prevent caching to ensure we get fresh data/auth state on every request
export const dynamic = 'force-dynamic';

export default async function ProjectPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const version = searchParams?.version as string | undefined;

  const project = await getProjectServer(params.id, version).catch((err) => {
    console.error(`Failed to fetch project`, err);
    return null;
  });

  if (!project) notFound();

  return (
    <ProjectIDE
      projectId={params.id}
      strategy={project.strategy as any}
      initialTree={project.tree as any}
      initialFiles={project.files as any}
      currentVersion={version}
    />
  );
}