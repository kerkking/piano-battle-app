import {
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
  useCallback,
} from "react";
import { ParticleSystem } from "../animations/particles";
import type { ThemeName } from "../types";

export interface ParticleCanvasHandle {
  spawn: (x: number, y: number, theme: ThemeName) => void;
}

export const ParticleCanvas = forwardRef<ParticleCanvasHandle>(
  function ParticleCanvas(_props, ref) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const systemRef = useRef<ParticleSystem | null>(null);

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const system = new ParticleSystem(canvas);
      systemRef.current = system;

      const handleResize = () => {
        system.resize(window.innerWidth, window.innerHeight);
      };
      handleResize();
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
        system.destroy();
      };
    }, []);

    const spawn = useCallback((x: number, y: number, theme: ThemeName) => {
      systemRef.current?.spawn(x, y, theme);
    }, []);

    useImperativeHandle(ref, () => ({ spawn }), [spawn]);

    return (
      <canvas
        ref={canvasRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 10,
        }}
      />
    );
  }
);
