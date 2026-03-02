// app/dashboard/layout.tsx
import { generateSEO } from "@/lib/seo";

export const metadata = generateSEO({
  title: "Dashboard | Leo Satria Activity",
  description: "Real-time activity dashboard Leo Satria menampilkan Spotify listening history, GitHub contributions, Wakatime coding stats, dan Discord status.",
  url: "/dashboard",
  noindex: true, // Dashboard biasanya tidak perlu diindex
});

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
