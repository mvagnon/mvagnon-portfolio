import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { ProjectGallery } from "@/components/project/project-gallery";
import { IconButton } from "@/components/ui/icon-button";
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

  const projectLinks = [
    {
      href: project.url,
      icon: "/url.svg",
      label: "Voir le projet en production",
    },
    {
      href: project.github,
      icon: "/github.svg",
      label: "Voir le code source sur GitHub",
    },
  ].filter(
    (link): link is { href: string; icon: string; label: string } =>
      typeof link.href === "string",
  );

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
        <IconButton
          href="/"
          transitionTypes={["nav-back"]}
          aria-label="Retour a l'accueil"
          className="pointer-events-auto bg-black/25"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
        </IconButton>
      </header>

      <div className="pointer-events-none fixed inset-0 z-10 flex items-center justify-center px-3 text-center text-white mix-blend-exclusion">
        <div className="flex max-w-5xl flex-col items-center gap-5">
          <h1 className="text-balance break-words text-4xl italic tracking-normal md:text-7xl">
            {project.title}
            {project.client ? (
              <>
                {" "}
                <span aria-hidden="true">&bull;</span>
                {" "}
                <span>{project.client}</span>
              </>
            ) : null}
          </h1>

          {projectLinks.length > 0 ? (
            <nav
              aria-label="Liens du projet"
              className="flex items-center justify-center gap-3"
            >
              {projectLinks.map((link) => (
                <IconButton
                  key={link.href}
                  href={link.href}
                  aria-label={link.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pointer-events-auto group border-0 bg-black/25"
                >
                  <Image
                    src={link.icon}
                    alt=""
                    width={22}
                    height={22}
                    unoptimized
                    aria-hidden="true"
                    draggable={false}
                    className="size-5.5 invert transition group-hover:invert-0"
                  />
                </IconButton>
              ))}
            </nav>
          ) : null}
        </div>
      </div>
    </main>
  );
}
