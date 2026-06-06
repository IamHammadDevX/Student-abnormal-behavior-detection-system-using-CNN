"use client";

import { GraduationCap } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-lg">
      <div className="container flex h-16 items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <GraduationCap className="h-6 w-6 text-primary" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-bold tracking-tight">
              Classroom Monitor
            </h1>
            <p className="text-xs text-muted-foreground hidden sm:block">
              AI-Powered Behavior Detection
            </p>
          </div>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}
