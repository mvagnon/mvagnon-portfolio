import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { ProjectGallery } from "@/components/project/project-gallery";
import { getProject, getProjectIds } from "@/lib/projects";

type ProjectPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateStaticParams() {
  const projectIds = await getProjectIds();

  return projectIds.map((id) => ({ id }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { id } = await params;
  const project = await getProject(id);

  if (!project) {
    return {
      title: "Projet introuvable",
    };
  }

  return {
    title: project.title,
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params;
  const project = await getProject(id);

  if (!project) {
    notFound();
  }

  return (
    <main
      className="relative min-h-screen h-full w-full overflow-hidden bg-zinc-950 text-white"
      style={{ backgroundColor: project.color }}
    >
      {project.images.length > 0 ? (
        <ProjectGallery
          images={project.images}
          speed={1.2}
          zSpacing={3}
          visibleCount={12}
          falloff={{ near: 0.8, far: 14 }}
          className="h-screen w-full overflow-hidden"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-950 px-6 text-center text-sm text-zinc-400">
          Aucune image configuree pour ce projet.
        </div>
      )}

      <header className="pointer-events-none fixed inset-x-0 top-0 z-10 flex justify-start px-5 py-6 sm:px-8 sm:py-8 lg:px-12">
        <Link
          href="/"
          aria-label="Retour a l'accueil"
          className="pointer-events-auto flex size-10 items-center justify-center rounded-full border border-white/15 bg-black/25 text-white backdrop-blur transition hover:bg-white hover:text-zinc-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
        </Link>
      </header>

      <div className="pointer-events-none fixed inset-0 z-10 flex items-center justify-center px-3 text-center text-white mix-blend-exclusion">
        <h1 className="max-w-5xl text-balance break-words text-4xl italic tracking-normal md:text-7xl">
          {project.title}
        </h1>
      </div>
    </main>
  );
}
