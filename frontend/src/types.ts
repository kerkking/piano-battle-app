export interface CharacterSpawn {
  id: string;
  imageUrl: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  scale: number; // 0.7 - 1.3
  animation: AnimationType;
  createdAt: number;
}

export type AnimationType =
  | "bounce-in"
  | "spin-in"
  | "slide-from-top"
  | "zoom-pop"
  | "flip-in"
  | "spiral-in";

export const ANIMATION_TYPES: AnimationType[] = [
  "bounce-in",
  "spin-in",
  "slide-from-top",
  "zoom-pop",
  "flip-in",
  "spiral-in",
];

export type ThemeName = "beach" | "jungle" | "space" | "underwater";

export interface ThemeConfig {
  name: ThemeName;
  label: string;
  emoji: string;
  particleColors: string[];
  particleStyle: "sparkles" | "leaves" | "stars" | "bubbles";
}
