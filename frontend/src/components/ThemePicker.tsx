import type { ThemeName, ThemeConfig } from "../types";
import { beachTheme } from "../themes/beach";
import { jungleTheme } from "../themes/jungle";
import { spaceTheme } from "../themes/space";
import { underwaterTheme } from "../themes/underwater";

const themes: ThemeConfig[] = [beachTheme, jungleTheme, spaceTheme, underwaterTheme];

interface ThemePickerProps {
  current: ThemeName;
  onChange: (theme: ThemeName) => void;
}

export function ThemePicker({ current, onChange }: ThemePickerProps) {
  return (
    <div style={{
      position: "fixed",
      bottom: 20,
      left: "50%",
      transform: "translateX(-50%)",
      display: "flex",
      gap: 10,
      zIndex: 20,
      background: "rgba(0,0,0,0.4)",
      backdropFilter: "blur(10px)",
      padding: "8px 16px",
      borderRadius: 30,
    }}>
      {themes.map((t) => (
        <button
          key={t.name}
          onClick={() => onChange(t.name)}
          title={t.label}
          style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            border: current === t.name ? "3px solid #fff" : "2px solid rgba(255,255,255,0.3)",
            background: current === t.name ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.1)",
            cursor: "pointer",
            fontSize: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s ease",
            transform: current === t.name ? "scale(1.15)" : "scale(1)",
          }}
        >
          {t.emoji}
        </button>
      ))}
    </div>
  );
}
