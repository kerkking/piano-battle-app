import { memo } from "react";
import type { ThemeName } from "../types";

const containerStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  zIndex: 0,
  overflow: "hidden",
};

function Beach() {
  return (
    <div style={{ ...containerStyle, background: "linear-gradient(180deg, #87CEEB 0%, #FDB813 55%, #F5DEB3 70%, #DEB887 100%)" }}>
      {/* Sun */}
      <div style={{
        position: "absolute", top: "8%", right: "12%",
        width: 90, height: 90, borderRadius: "50%",
        background: "radial-gradient(circle, #FFF700 30%, #FDB813 70%)",
        boxShadow: "0 0 60px 30px rgba(253,184,19,0.5), 0 0 120px 60px rgba(253,184,19,0.2)",
      }} />
      {/* Clouds */}
      {[15, 40, 70].map((left, i) => (
        <div key={i} style={{
          position: "absolute", top: `${10 + i * 5}%`, left: `${left}%`,
          width: 120 + i * 20, height: 40, borderRadius: 40,
          background: "rgba(255,255,255,0.8)",
          animation: `cloudDrift ${18 + i * 4}s linear infinite`,
        }} />
      ))}
      {/* Waves */}
      <div style={{
        position: "absolute", bottom: "28%", left: 0, width: "200%", height: 50,
        background: "rgba(0,119,190,0.4)", borderRadius: "50% 50% 0 0",
        animation: "waveDrift 6s ease-in-out infinite alternate",
      }} />
      <div style={{
        position: "absolute", bottom: "25%", left: "-10%", width: "220%", height: 40,
        background: "rgba(0,150,220,0.3)", borderRadius: "50% 50% 0 0",
        animation: "waveDrift 8s ease-in-out infinite alternate-reverse",
      }} />
      <style>{`
        @keyframes cloudDrift { from { transform: translateX(-150px); } to { transform: translateX(calc(100vw + 150px)); } }
        @keyframes waveDrift { from { transform: translateX(-5%); } to { transform: translateX(5%); } }
      `}</style>
    </div>
  );
}

function Jungle() {
  return (
    <div style={{ ...containerStyle, background: "linear-gradient(180deg, #0B3D02 0%, #1A5E0A 40%, #2D7A1E 70%, #3E2723 90%, #2C1A0E 100%)" }}>
      {/* Canopy light patches */}
      {[20, 50, 75].map((left, i) => (
        <div key={i} style={{
          position: "absolute", top: `${5 + i * 8}%`, left: `${left}%`,
          width: 200 + i * 40, height: 200 + i * 40, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(80,180,40,0.15) 0%, transparent 70%)",
        }} />
      ))}
      {/* Vines on edges */}
      {[0, 1].map((side) => (
        <svg key={side} style={{
          position: "absolute", top: 0, [side === 0 ? "left" : "right"]: 0,
          width: 60, height: "100%", opacity: 0.6,
          transform: side === 1 ? "scaleX(-1)" : undefined,
        }} viewBox="0 0 60 1000" preserveAspectRatio="none">
          <path d="M30,0 Q10,100 30,200 Q50,300 30,400 Q10,500 30,600 Q50,700 30,800 Q10,900 30,1000"
            stroke="#1A5E0A" strokeWidth="4" fill="none" />
          {[150, 350, 550, 750].map((y, i) => (
            <ellipse key={i} cx={25 + (i % 2) * 10} cy={y} rx="12" ry="6" fill="#228B22" opacity="0.8" />
          ))}
        </svg>
      ))}
      {/* Grass blades at bottom */}
      <div style={{ position: "absolute", bottom: 0, left: 0, width: "100%", height: 60 }}>
        {Array.from({ length: 40 }, (_, i) => (
          <div key={i} style={{
            position: "absolute",
            bottom: 0,
            left: `${i * 2.5 + Math.random()}%`,
            width: 3,
            height: 20 + Math.random() * 40,
            background: `hsl(${100 + Math.random() * 30}, 60%, ${30 + Math.random() * 20}%)`,
            borderRadius: "2px 2px 0 0",
            transform: `rotate(${(Math.random() - 0.5) * 20}deg)`,
            transformOrigin: "bottom center",
          }} />
        ))}
      </div>
    </div>
  );
}

function Space() {
  const stars = Array.from({ length: 70 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 1 + Math.random() * 2,
    delay: Math.random() * 3,
    duration: 1.5 + Math.random() * 2,
  }));

  return (
    <div style={{ ...containerStyle, background: "linear-gradient(180deg, #0a0a2e 0%, #16213e 50%, #1a1a4e 100%)" }}>
      {/* Stars */}
      {stars.map((s) => (
        <div key={s.id} style={{
          position: "absolute",
          left: `${s.x}%`, top: `${s.y}%`,
          width: s.size, height: s.size,
          borderRadius: "50%",
          background: "#fff",
          animation: `twinkle ${s.duration}s ${s.delay}s ease-in-out infinite alternate`,
        }} />
      ))}
      {/* Nebula */}
      <div style={{
        position: "absolute", top: "20%", left: "30%",
        width: 400, height: 300, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(138,43,226,0.1) 0%, rgba(75,0,130,0.05) 50%, transparent 70%)",
        filter: "blur(40px)",
      }} />
      {/* Planets */}
      <div style={{
        position: "absolute", top: "15%", left: "75%",
        width: 50, height: 50, borderRadius: "50%",
        background: "radial-gradient(circle at 35% 35%, #E8927C, #C1440E)",
        boxShadow: "inset -5px -5px 10px rgba(0,0,0,0.3)",
      }} />
      <div style={{
        position: "absolute", top: "60%", left: "15%",
        width: 35, height: 35, borderRadius: "50%",
        background: "radial-gradient(circle at 35% 35%, #87CEEB, #4169E1)",
        boxShadow: "inset -3px -3px 8px rgba(0,0,0,0.3)",
      }} />
      {/* Ring around larger planet */}
      <div style={{
        position: "absolute", top: "12%", left: "72.5%",
        width: 80, height: 16, borderRadius: "50%",
        border: "2px solid rgba(200,180,160,0.4)",
        transform: "rotate(-20deg)",
      }} />
      <style>{`
        @keyframes twinkle { from { opacity: 0.3; } to { opacity: 1; } }
      `}</style>
    </div>
  );
}

function Underwater() {
  const bubbles = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    size: 5 + Math.random() * 15,
    delay: Math.random() * 8,
    duration: 6 + Math.random() * 6,
  }));

  return (
    <div style={{ ...containerStyle, background: "linear-gradient(180deg, #001a33 0%, #004466 30%, #006d6f 60%, #008080 100%)" }}>
      {/* Light rays */}
      {[15, 35, 60, 80].map((left, i) => (
        <div key={i} style={{
          position: "absolute", top: 0, left: `${left}%`,
          width: 80 + i * 15, height: "100%",
          background: `linear-gradient(180deg, rgba(255,255,255,0.08) 0%, transparent 60%)`,
          transform: `rotate(${-5 + i * 3}deg)`,
          transformOrigin: "top center",
          animation: `rayWave ${4 + i}s ease-in-out infinite alternate`,
        }} />
      ))}
      {/* Bubbles */}
      {bubbles.map((b) => (
        <div key={b.id} style={{
          position: "absolute",
          left: `${b.x}%`, bottom: "-5%",
          width: b.size, height: b.size,
          borderRadius: "50%",
          background: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.4), rgba(255,255,255,0.1))",
          border: "1px solid rgba(255,255,255,0.2)",
          animation: `bubbleRise ${b.duration}s ${b.delay}s linear infinite`,
        }} />
      ))}
      {/* Seaweed */}
      <svg style={{ position: "absolute", bottom: 0, left: 0, width: "100%", height: "30%" }} viewBox="0 0 1000 300" preserveAspectRatio="none">
        {[50, 150, 280, 420, 580, 700, 850, 950].map((x, i) => (
          <path key={i}
            d={`M${x},300 Q${x - 15},250 ${x + 10},200 Q${x + 25},150 ${x},100 Q${x - 15},60 ${x + 5},20`}
            stroke={`hsl(${140 + i * 5}, 50%, ${25 + i * 3}%)`}
            strokeWidth="6" fill="none" opacity="0.7"
            style={{ animation: `seaweedSway ${3 + (i % 3)}s ease-in-out infinite alternate` }}
          />
        ))}
      </svg>
      <style>{`
        @keyframes bubbleRise { from { transform: translateY(0) translateX(0); } to { transform: translateY(-110vh) translateX(20px); } }
        @keyframes rayWave { from { opacity: 0.6; } to { opacity: 1; } }
        @keyframes seaweedSway { from { transform: translateX(-5px); } to { transform: translateX(5px); } }
      `}</style>
    </div>
  );
}

interface BackgroundProps {
  theme: ThemeName;
}

export const Background = memo(function Background({ theme }: BackgroundProps) {
  switch (theme) {
    case "beach": return <Beach />;
    case "jungle": return <Jungle />;
    case "space": return <Space />;
    case "underwater": return <Underwater />;
  }
});
