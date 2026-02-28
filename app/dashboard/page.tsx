import GithubCalendar from "@/components/ui/GithubCalendar";
import SpotifyNowPlaying from "@/components/ui/SpotifyNowPlaying";
import SpotifyHistory from "@/components/ui/SpotifyHistory";
import { Activity, Github, Music, Cable } from "lucide-react";
import WakatimeStats from "@/components/ui/WakatimeStats";
import DiscordStatus from "@/components/ui/DiscordStatus";

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

      <section>
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-5 h-5 text-neutral-900 dark:text-white" />
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
            Wakatime
          </h2>
        </div>

        <WakatimeStats />
      </section>

<section>
        <div className="flex items-center gap-2 mb-4">
          {/* <Cable className="w-5 h-5 text-neutral-900 dark:text-white" /> */}
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
            Discord
          </h2>
        </div>

        <DiscordStatus />
      </section>
    </div>
  );
}