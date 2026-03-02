// app/chat/layout.tsx
import { generateSEO } from "@/lib/seo";

export const metadata = generateSEO({
  title: "Chat Room | Leo Satria",
  description: "Chat langsung dengan Leo Satria. Tanyakan tentang project, kolaborasi, atau diskusi seputar web development.",
  url: "/chat",
  noindex: true, // Chat room tidak perlu diindex
});

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
