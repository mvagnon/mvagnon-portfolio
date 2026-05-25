import type { Metadata } from "next";

import { ServicesWithAnimatedHoverModal } from "@/components/ui/services-with-animated-hover-modal";
import { getProjects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Projects",
};

export default async function Home() {
  const projects = await getProjects();

  return (
    <main className="min-h-screen bg-zinc-50">
      <ServicesWithAnimatedHoverModal projects={projects} />
    </main>
  );
}
