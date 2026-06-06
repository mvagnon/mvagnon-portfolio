"use client";

import { LinkIcon } from "lucide-react";
import { motion, useMotionValue, useSpring } from "motion/react";
import type { Variants } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";
import type { ProfileLink, ProfileUrl } from "@/lib/profile";
import type { Project } from "@/lib/projects";
import { ArrowTextLink } from "@/components/ui/arrow-text-link";
import { FadeInImage } from "@/components/ui/fade-in-image";
import { IconButton } from "@/components/ui/icon-button";
import { ViewHoverCursor } from "@/components/ui/view-hover-cursor";

type ServicesProject = Pick<Project, "color" | "coverImage" | "id" | "title">;

type ProjectListItem =
  | (ServicesProject & {
      kind: "project";
    })
  | {
      kind: "github";
      id: string;
      title: string;
      color: string;
      href: string;
    };

type ServicesWithAnimatedHoverModalProps = {
  projects: ServicesProject[];
  profileDescription?: string;
  profileLinks?: ProfileLink[];
  profileUrl?: ProfileUrl;
  className?: string;
};

type ModalState = {
  active: boolean;
  index: number;
};

const githubRepositoriesItem = {
  kind: "github",
  id: "github-repositories",
  title: "And much more...",
  color: "#f4f4f5",
  href: "https://github.com/mvagnon?tab=repositories",
} satisfies ProjectListItem;

const scaleAnimation: Variants = {
  closed: {
    scale: 0,
    transition: { duration: 0.4, ease: [0.32, 0, 0.67, 0] as const },
    x: "-50%",
    y: "-50%",
  },
  enter: {
    scale: 1,
    transition: { duration: 0.4, ease: [0.76, 0, 0.24, 1] as const },
    x: "-50%",
    y: "-50%",
  },
  initial: {
    scale: 0,
    x: "-50%",
    y: "-50%",
  },
};

export function ServicesWithAnimatedHoverModal({
  projects,
  profileDescription = "",
  profileLinks = [],
  profileUrl,
  className,
}: ServicesWithAnimatedHoverModalProps) {
  const [modal, setModal] = useState<ModalState>({
    active: false,
    index: 0,
  });
  const projectItems = [
    ...projects.map((project) => ({
      ...project,
      kind: "project" as const,
    })),
    githubRepositoriesItem,
  ];

  return (
    <section
      className={cn(
        "relative isolate min-h-screen overflow-hidden bg-zinc-50 px-5 py-16 text-zinc-950 sm:px-8 lg:px-12 lg:py-20",
        className,
      )}
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-14">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-start">
          <div className="flex flex-col items-start gap-3">
            <h1 className="text-6xl italic tracking-normal text-balance md:text-8xl">
              Projects.
            </h1>

            {profileUrl ? (
              <ArrowTextLink
                href={profileUrl.url}
                className="hover:text-zinc-950"
              >
                {profileUrl.title}
              </ArrowTextLink>
            ) : null}
          </div>

          <div className="flex max-w-md flex-col gap-4 md:items-end md:pt-4">
            {profileDescription ? (
              <p className="text-sm leading-6 font-medium text-zinc-500 md:text-right md:text-base">
                {profileDescription}
              </p>
            ) : null}

            {profileLinks.length > 0 ? (
              <ProfileLinksNav profileLinks={profileLinks} />
            ) : null}
          </div>
        </div>

        {projects.length > 0 ? (
          <div className="relative flex min-h-[58vh] items-center">
            <div className="flex w-full flex-col">
              {projectItems.map((project, index) => (
                <ProjectRow
                  index={index}
                  key={project.id}
                  project={project}
                  setModal={setModal}
                />
              ))}
            </div>

            <HoverModal modal={modal} projects={projectItems} />
          </div>
        ) : (
          <div className="flex min-h-[45vh] items-center justify-center border-y border-zinc-200 text-sm text-zinc-500">
            No project at the moment.
          </div>
        )}
      </div>
    </section>
  );
}

function ProfileLinksNav({ profileLinks }: { profileLinks: ProfileLink[] }) {
  return (
    <nav aria-label="Liens du profil" className="flex items-center gap-3">
      {profileLinks.map((profileLink) => (
        <IconButton
          key={profileLink.id}
          href={profileLink.url}
          aria-label={`Ouvrir ${profileLink.title}`}
          target="_blank"
          rel="noopener noreferrer"
          className="group border-zinc-300 bg-white text-zinc-950 shadow-sm hover:bg-zinc-950 hover:text-white focus-visible:ring-zinc-950/70"
        >
          <ProfileLinkIcon icon={profileLink.icon} />
        </IconButton>
      ))}
    </nav>
  );
}

function ProfileLinkIcon({ icon }: { icon: ProfileLink["icon"] }) {
  if (icon === "github") {
    return (
      <Image
        src="/github.svg"
        alt="GitHub Icon"
        width={22}
        height={22}
        unoptimized
        aria-hidden="true"
        draggable={false}
        className="size-5.5 transition group-hover:invert"
      />
    );
  }

  if (icon === "linkedin") {
    return (
      <Image
        src="/linkedin.svg"
        alt="LinkedIn Icon"
        width={22}
        height={22}
        unoptimized
        aria-hidden="true"
        draggable={false}
        className="size-5.5 transition group-hover:invert"
      />
    );
  }

  if (icon === "malt") {
    return (
      <Image
        src="/malt.svg"
        alt="Malt Icon"
        width={22}
        height={22}
        unoptimized
        aria-hidden="true"
        draggable={false}
        className="size-5.5 transition group-hover:invert"
      />
    );
  }

  return <LinkIcon className="size-4.5" aria-hidden="true" />;
}

function ProjectRow({
  index,
  project,
  setModal,
}: {
  index: number;
  project: ProjectListItem;
  setModal: (modal: ModalState) => void;
}) {
  const previewImage =
    project.kind === "project" ? normalizeImage(project.coverImage) : null;
  const className =
    "group flex w-full items-center justify-between gap-5 border-t border-zinc-300 py-8 transition-opacity duration-200 last:border-b hover:opacity-55 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950/70 md:py-11 lg:px-12";
  const content = (
    <>
      <div className="flex min-w-0 items-center gap-4">
        {previewImage ? (
          <span className="relative size-16 shrink-0 overflow-hidden bg-zinc-200 md:hidden">
            <FadeInImage
              src={previewImage.src}
              alt=""
              fill
              quality={100}
              sizes="64px"
              className="object-cover"
            />
          </span>
        ) : null}

        <h2 className="min-w-0 text-3xl leading-none font-normal break-words transition-transform duration-300 group-hover:translate-x-2.5 sm:text-5xl lg:text-6xl">
          {project.title}
        </h2>
      </div>

      <ArrowTextLink className="transition-transform duration-300 group-hover:translate-x-2.5">
        {project.kind === "github" ? "View GitHub" : "View project"}
      </ArrowTextLink>
    </>
  );

  const hoverHandlers = {
    onMouseEnter: () => setModal({ active: true, index }),
    onMouseLeave: () => setModal({ active: false, index }),
  };

  if (project.kind === "github") {
    return (
      <a
        href={project.href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        {...hoverHandlers}
      >
        {content}
      </a>
    );
  }

  return (
    <Link
      href={`/${project.id}`}
      transitionTypes={["nav-forward"]}
      className={className}
      {...hoverHandlers}
    >
      {content}
    </Link>
  );
}

function HoverModal({
  modal,
  projects,
}: {
  modal: ModalState;
  projects: ProjectListItem[];
}) {
  const { active, index } = modal;
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const previewX = useSpring(pointerX, { damping: 28, stiffness: 140 });
  const previewY = useSpring(pointerY, { damping: 28, stiffness: 140 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      pointerX.set(event.clientX);
      pointerY.set(event.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [pointerX, pointerY]);

  return (
    <>
      <motion.div
        animate={active ? "enter" : "closed"}
        className="pointer-events-none fixed left-0 top-0 z-30 hidden h-[22rem] w-[25rem] items-center justify-center overflow-hidden bg-transparent lg:flex"
        initial="initial"
        style={{ left: previewX, top: previewY }}
        variants={scaleAnimation}
      >
        <div
          className="absolute h-full w-full transition-[top] duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]"
          style={{ top: `${index * -100}%` }}
        >
          {projects.map((project) => {
            const previewImage =
              project.kind === "project"
                ? normalizeImage(project.coverImage)
                : null;

            return (
              <div
                className="flex h-full w-full items-center justify-center p-8"
                key={project.id}
                style={{
                  backgroundColor:
                    project.kind === "github" ? "transparent" : project.color,
                }}
              >
                {project.kind === "github" ? null : previewImage ? (
                  <FadeInImage
                    src={previewImage.src}
                    alt={previewImage.alt}
                    width={320}
                    height={240}
                    quality={100}
                    sizes="320px"
                    className="h-auto max-h-full w-auto select-none object-contain"
                    draggable={false}
                  />
                ) : (
                  <span className="max-w-64 text-center text-2xl font-medium text-white">
                    {project.title}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </motion.div>

      <ViewHoverCursor
        active={active}
        pointerX={pointerX}
        pointerY={pointerY}
      />
    </>
  );
}

export default ServicesWithAnimatedHoverModal;

function normalizeImage(image: Project["coverImage"] | string | undefined) {
  if (!image) {
    return null;
  }

  if (typeof image === "string") {
    return {
      src: image,
      alt: "",
    };
  }

  return {
    src: image.src,
    alt: image.alt ?? "",
  };
}
