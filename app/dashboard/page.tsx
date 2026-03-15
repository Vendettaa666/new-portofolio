import GithubCalendar from "@/components/ui/GithubCalendar";
import SpotifyNowPlaying from "@/components/ui/SpotifyNowPlaying";
import SpotifyHistory from "@/components/ui/SpotifyHistory";
import { Activity, Music, MessageSquare, Github, Keyboard } from "lucide-react";
import WakatimeStats from "@/components/ui/WakatimeStats";
import MonkeytypeStats from "@/components/ui/MonkeytypeStats";
import DiscordStatus from "@/components/ui/DiscordStatus";
import SpotifyStats from "@/components/ui/SpotifyStats";
import DashboardClient from "./DashboardClient";
import UmamiStats from "@/components/ui/UmamiStats";
import LastFMStats from "@/components/ui/LastFMStats";

export default async function DashboardPage() { 
  return (
    <DashboardClient>
       <section>
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-5 h-5 text-neutral-900 dark:text-white" />
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
            Umami Activity
          </h2>
        </div>

       
          <UmamiStats />
        
      </section>
      {/* Spotify Section */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Music className="w-5 h-5 text-neutral-900 dark:text-white" />
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
            Music Dashboard
          </h2>
        </div>

       
          <LastFMStats />
        
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
          <Keyboard className="w-5 h-5 text-neutral-900 dark:text-white" />
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
            MonkeyType
          </h2>
        </div>

        <MonkeytypeStats />
      </section>

      <section>
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare className="w-5 h-5 text-neutral-900 dark:text-white" />

          <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
            Discord
          </h2>
        </div>

        <DiscordStatus />
      </section>

      
    </DashboardClient>
  );
}