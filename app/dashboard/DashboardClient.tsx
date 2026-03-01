"use client";

import { ReactNode } from "react";

interface DashboardClientProps {
  children: ReactNode;
}

export default function DashboardClient({ children }: DashboardClientProps) {
  return (
    <div className="flex flex-col gap-10 p-6 max-w-7xl mx-auto w-full">
      {children}
    </div>
  );
}
