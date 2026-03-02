"use client";

import { ReactNode } from "react";

interface DashboardClientProps {
  children: ReactNode;
}

export default function DashboardClient({ children }: DashboardClientProps) {
  return (
    <div className="flex flex-col gap-10 p-6 max-w-9xl mx-auto w-full">
              <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 text-sm md:text-base">
           Dasbor pribadi saya yang dibangun dengan rute API Next.js, memvisualisasikan statistik pengembangan dan kontribusi secara real-time.
          </p>
        </div>

        <div className="border-b border-dashed border-neutral-300 dark:border-neutral-700 w-full" />

      {children}
    </div>
  );
}
