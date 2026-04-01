import {
  useState,
  useCallback,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import type { CharacterSpawn, ThemeName, AnimationType } from "../types";
import { ANIMATION_TYPES } from "../types";
import { Character } from "./Character";
import { Background } from "./Background";
import { ParticleCanvas, type ParticleCanvasHandle } from "./ParticleCanvas";

const MAX_CHARACTERS = 30;

export interface StageHandle {
  spawnCharacter: (note: number, velocity: number) => void;
}

interface StageProps {
  theme: ThemeName;
  pickRandomImage: () => string | null;
}

export const Stage = forwardRef<StageHandle, StageProps>(function Stage(
  { theme, pickRandomImage },
  ref
) {
  const [characters, setCharacters] = useState<CharacterSpawn[]>([]);
  const particlesRef = useRef<ParticleCanvasHandle>(null);

  const spawnCharacter = useCallback(
    (_note: number, velocity: number) => {
      const imageUrl = pickRandomImage();
      if (!imageUrl) return;

      const x = 5 + Math.random() * 85;
      const y = 5 + Math.random() * 75;
      const animation =
        ANIMATION_TYPES[Math.floor(Math.random() * ANIMATION_TYPES.length)]!;
      const scale = 0.7 + (velocity / 127) * 0.6;

      const spawn: CharacterSpawn = {
        id: crypto.randomUUID(),
        imageUrl,
        x,
        y,
        scale,
        animation: animation as AnimationType,
        createdAt: Date.now(),
      };

      setCharacters((prev) => {
        const next = [...prev, spawn];
        if (next.length > MAX_CHARACTERS) {
          return next.slice(next.length - MAX_CHARACTERS);
        }
        return next;
      });

      particlesRef.current?.spawn(x, y, theme);
    },
    [pickRandomImage, theme]
  );

  useImperativeHandle(ref, () => ({ spawnCharacter }), [spawnCharacter]);

  const removeCharacter = useCallback((id: string) => {
    setCharacters((prev) => prev.filter((c) => c.id !== id));
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
      }}
    >
      <Background theme={theme} />
      {characters.map((spawn) => (
        <Character key={spawn.id} spawn={spawn} onComplete={removeCharacter} />
      ))}
      <ParticleCanvas ref={particlesRef} />
    </div>
  );
});
