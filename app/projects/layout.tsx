// app/projects/layout.tsx
import { generateSEO } from "@/lib/seo";

export const metadata = generateSEO({
  title: "Projects | Leo Satria Portfolio",
  description: "Lihat koleksi project web development yang telah dikerjakan Leo Satria menggunakan React, Next.js, Laravel, dan teknologi modern lainnya. Featured projects dan timeline lengkap.",
  url: "/projects",
  keywords: [
    "web projects",
    "portfolio projects",
    "react projects",
    "next.js projects",
    "laravel projects",
    "fullstack projects",
    "frontend projects",
    "leo satria projects",
  ],
});

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
