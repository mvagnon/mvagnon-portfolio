import type { Metadata } from "next";

import { ServicesWithAnimatedHoverModal } from "@/components/ui/services-with-animated-hover-modal";
import { getProfile, getProfileUrl } from "@/lib/profile";
import { getProjects } from "@/lib/projects";

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile();

  return {
    title: profile.title,
  };
}

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
        profileUrl={getProfileUrl(profile)}
        projects={projects}
      />
    </main>
  );
}
