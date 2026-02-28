// components/GithubCalendar.tsx
// ⚠️ JANGAN tambahkan "use client" di sini — ini adalah Server Component
// Fungsi getGitHubContributions() menggunakan token server-side dan harus dijalankan di server

import { getGitHubContributions, ContributionDay } from "@/lib/github";

// Fungsi untuk menentukan warna berdasarkan jumlah kontribusi
function getContributionColor(count: number) {
  if (count === 0) return "bg-neutral-200 dark:bg-neutral-700";
  if (count >= 1 && count <= 3) return "bg-primary/50 dark:bg-primary/40";
  if (count >= 4 && count <= 6) return "bg-primary/70 dark:bg-primary/60";
  if (count >= 7 && count <= 9) return "bg-primary/90 dark:bg-primary/80";
  return "bg-primary dark:bg-primary";
}

export default async function GithubCalendar() {
  const stats = await getGitHubContributions();

  if (!stats) {
    return (
      <div className="p-6 bg-white dark:bg-neutral-800/50 border-2 border-neutral-200 dark:border-neutral-700 rounded-2xl shadow-lg">
        <p className="text-neutral-500 dark:text-neutral-400 text-center">
          Gagal memuat kontribusi GitHub.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6 bg-white dark:bg-neutral-800/50 border-2 border-neutral-200 dark:border-neutral-700 rounded-2xl shadow-lg">
      
      {/* Bagian Header / Statistik Tambahan */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard title="Total Kontribusi" value={stats.total} />
        <StatCard title="Minggu Ini" value={stats.thisWeek} />
        <StatCard title="Hari Terbaik" value={stats.bestDay} />
        <StatCard title="Rata-rata/Hari" value={stats.average} />
      </div>

      <div className="h-px bg-neutral-200 dark:bg-neutral-700" />

      {/* Bagian Grafik Kalender */}
      <div className="w-full pt-2 pb-2">
        <div className="flex w-full justify-between gap-[1px] sm:gap-[2px] md:gap-[3px] lg:gap-1">
          {stats.weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col flex-1 gap-[1px] sm:gap-[2px] md:gap-[3px] lg:gap-1">
              {week.contributionDays.map((day: ContributionDay, dayIndex) => (
                <div
                  key={dayIndex}
                  title={`${day.contributionCount} kontribusi pada ${day.date}`}
                  className={`w-full aspect-square rounded-sm transition-all duration-300 cursor-pointer hover:scale-[1.3] hover:z-10 hover:ring-2 hover:ring-primary hover:shadow-xl ${getContributionColor(
                    day.contributionCount
                  )}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      
      {/* Legend */}
      <div className="flex items-center gap-2 text-xs justify-end text-neutral-600 dark:text-neutral-400 font-medium mt-2">
        <span>Lebih Sedikit</span>
        <div className="flex gap-1.5">
          <div className="w-4 h-4 rounded-sm bg-neutral-200 dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600" />
          <div className="w-4 h-4 rounded-sm bg-primary/50 dark:bg-primary/40 border border-neutral-300 dark:border-neutral-600" />
          <div className="w-4 h-4 rounded-sm bg-primary/70 dark:bg-primary/60 border border-neutral-300 dark:border-neutral-600" />
          <div className="w-4 h-4 rounded-sm bg-primary/90 dark:bg-primary/80 border border-neutral-300 dark:border-neutral-600" />
          <div className="w-4 h-4 rounded-sm bg-primary dark:bg-primary border border-neutral-300 dark:border-neutral-600 shadow-lg" />
        </div>
        <span>Lebih Banyak</span>
      </div>

    </div>
  );
}

// Komponen kecil untuk Card Statistik
function StatCard({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-gradient-to-br from-white to-neutral-50 dark:from-neutral-800/50 dark:to-neutral-800/30 border-2 border-neutral-200 dark:border-neutral-700 shadow-md hover:shadow-lg transition-shadow">
      <span className="text-xs font-medium text-neutral-600 dark:text-neutral-400">{title}</span>
      <span className="text-2xl font-bold text-primary mt-1">{value}</span>
    </div>
  );
}