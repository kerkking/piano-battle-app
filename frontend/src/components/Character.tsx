import { useEffect, useState, memo } from "react";
import type { CharacterSpawn } from "../types";

interface CharacterProps {
  spawn: CharacterSpawn;
  onComplete: (id: string) => void;
}

export const Character = memo(function Character({
  spawn,
  onComplete,
}: CharacterProps) {
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFadingOut(true), 3000);
    const removeTimer = setTimeout(() => onComplete(spawn.id), 3500);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, [spawn.id, onComplete]);

  return (
    <img
      src={spawn.imageUrl}
      alt=""
      className={fadingOut ? "animate-fade-out" : `animate-${spawn.animation}`}
      style={{
        position: "absolute",
        left: `${spawn.x}%`,
        top: `${spawn.y}%`,
        transform: `scale(${spawn.scale})`,
        width: "150px",
        height: "auto",
        pointerEvents: "none",
        willChange: "transform, opacity",
        zIndex: 5,
        filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.3))",
      }}
    />
  );
});
