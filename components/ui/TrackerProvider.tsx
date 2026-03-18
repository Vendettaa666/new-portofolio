"use client";

// components/ui/TrackerProvider.tsx
import { useVisitorTracker } from "@/hooks/useVisitorTracker";

export default function TrackerProvider() {
  useVisitorTracker();
  return null;
}