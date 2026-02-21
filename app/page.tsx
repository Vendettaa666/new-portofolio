// app/page.tsx (atau file pages utama kamu)
import HeroCard from "@/components/portofolio/HeroCard";
import ToolStack from "@/components/portofolio/ToolsStack";

export default function Home() {
  return (
    <div className="min-h-screen space-y-6 p-4 md:p-6 lg:p-8 transition-colors duration-200 bg-white dark:bg-[#0a0a0a]">
      {/* Semua tampilan grid, status, info profil, dan project sudah masuk ke sini */}
      <HeroCard />
      <ToolStack />
    </div>
  );
}