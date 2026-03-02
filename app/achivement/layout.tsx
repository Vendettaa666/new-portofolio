// app/achivement/layout.tsx
import { generateSEO } from "@/lib/seo";

export const metadata = generateSEO({
  title: "Achievements & Certificates | Leo Satria",
  description: "Koleksi sertifikat, penghargaan, dan pencapaian Leo Satria dalam bidang web development dan teknologi.",
  url: "/achivement",
  keywords: [
    "certificates",
    "achievements",
    "awards",
    "professional certificates",
    "web development certificates",
    "leo satria certificates",
  ],
});

export default function AchievementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
