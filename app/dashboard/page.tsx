import GithubCalendar from "@/components/ui/GithubCalendar";
import SpotifyNowPlaying from "@/components/ui/SpotifyNowPlaying";
import SpotifyHistory from "@/components/ui/SpotifyHistory";
import { Activity, Github, Music } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-10 p-6 max-w-7xl mx-auto w-full">
      {/* Spotify Section */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Music className="w-5 h-5 text-[#1DB954]" />
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
            Spotify Activity
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SpotifyNowPlaying />
          <SpotifyHistory />
        </div>
      </section>

      {/* GitHub Section */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Github className="w-5 h-5 text-neutral-900 dark:text-white" />
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
            GitHub Contributions
          </h2>
        </div>

        <GithubCalendar />
      </section>

    </div>
  );
}