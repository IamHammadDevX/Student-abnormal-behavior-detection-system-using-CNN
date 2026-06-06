import { ClassInfo } from "@/types";

export const CLASS_NAMES = [
  "eye_movement",
  "hand_move",
  "mobile_use",
  "mouth_open",
  "side_watching",
] as const;

export type ClassName = (typeof CLASS_NAMES)[number];

export const CLASS_INFO: Record<string, ClassInfo> = {
  eye_movement: {
    label: "Eye Movement",
    description: "Student is looking around the room",
    color: "blue",
    icon: "👁️",
  },
  hand_move: {
    label: "Hand Movement",
    description: "Student is raising or moving their hand",
    color: "green",
    icon: "✋",
  },
  mobile_use: {
    label: "Mobile Use",
    description: "Student is using a mobile phone",
    color: "red",
    icon: "📱",
  },
  mouth_open: {
    label: "Mouth Open",
    description: "Student is talking or yawning",
    color: "yellow",
    icon: "💬",
  },
  side_watching: {
    label: "Side Watching",
    description: "Student is looking sideways",
    color: "purple",
    icon: "👀",
  },
};

export const CONFIDENCE_THRESHOLDS = {
  high: 0.8,
  medium: 0.5,
} as const;
