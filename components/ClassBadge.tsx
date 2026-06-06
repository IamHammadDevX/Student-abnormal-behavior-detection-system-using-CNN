"use client";

import { CLASS_INFO } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import type { VariantProps } from "class-variance-authority";

interface ClassBadgeProps {
  className: string;
  size?: "sm" | "lg";
}

export default function ClassBadge({ className, size = "sm" }: ClassBadgeProps) {
  const info = CLASS_INFO[className];
  if (!info) return null;

  const variant = info.color as VariantProps<typeof Badge>["variant"];

  return (
    <Badge
      variant={variant}
      className={`
        inline-flex items-center gap-1.5 font-medium
        ${size === "lg" ? "px-4 py-2 text-sm" : "px-3 py-1 text-xs"}
      `}
    >
      <span>{info.icon}</span>
      <span>{info.label}</span>
    </Badge>
  );
}
