// app/contact/layout.tsx
import { generateSEO } from "@/lib/seo";

export const metadata = generateSEO({
  title: "Contact Me | Leo Satria",
  description: "Hubungi Leo Satria untuk kolaborasi project, freelance work, atau diskusi tentang web development. Tersedia via email, LinkedIn, dan GitHub.",
  url: "/contact",
  keywords: [
    "contact",
    "hire developer",
    "freelance developer",
    "web developer contact",
    "collaboration",
    "leo satria contact",
  ],
});

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
