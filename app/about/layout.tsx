// app/about/layout.tsx
import { generateSEO } from "@/lib/seo";

export const metadata = generateSEO({
  title: "About Leo Satria | Full-Stack Developer",
  description: "Kenali lebih dekat tentang Leo Satria, siswa SMKN 1 Lumajang jurusan Rekayasa Perangkat Lunak. Lihat perjalanan karir, skill, dan pengalaman sebagai Full-Stack Developer.",
  url: "/about",
  keywords: [
    "about leo satria",
    "leo satria",
    "full stack developer",
    "web developer indonesia",
    "smkn 1 lumajang",
    "rekayasa perangkat lunak",
    "career timeline",
    "professional experience",
    "skills",
  ],
});

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
