import type { Metadata } from "next";

import { ServicesWithAnimatedHoverModal } from "@/components/ui/services-with-animated-hover-modal";
import { getProfile } from "@/lib/profile";
import { getProjects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Projects",
};

export default async function Home() {
  const [projects, profile] = await Promise.all([
    getProjects(),
    getProfile(),
  ]);

  return (
    <main className="min-h-screen bg-zinc-50">
      <ServicesWithAnimatedHoverModal
        profileDescription={profile.description}
        profileLinks={profile.links}
        projects={projects}
      />
    </main>
  );
}
