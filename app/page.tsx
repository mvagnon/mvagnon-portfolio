import type { Metadata } from "next";

import { ServicesWithAnimatedHoverModal } from "@/components/ui/services-with-animated-hover-modal";
import { getProfileLinks } from "@/lib/profile-links";
import { getProjects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Projects",
};

export default async function Home() {
  const [projects, socialLinks] = await Promise.all([
    getProjects(),
    getProfileLinks(),
  ]);

  return (
    <main className="min-h-screen bg-zinc-50">
      <ServicesWithAnimatedHoverModal
        projects={projects}
        socialLinks={socialLinks}
      />
    </main>
  );
}
