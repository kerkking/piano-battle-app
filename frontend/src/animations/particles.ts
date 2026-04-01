import type { ThemeName } from "../types";

interface ParticleConfig {
  colors: string[];
  speedRange: [number, number];
  sizeRange: [number, number];
  gravity: number;
  drift: number;
  shape: "circle" | "leaf" | "star";
}

const THEME_PARTICLES: Record<ThemeName, ParticleConfig> = {
  beach: {
    colors: ["#FFD700", "#FFA500", "#FFFACD", "#FFE4B5"],
    speedRange: [1, 3],
    sizeRange: [2, 5],
    gravity: 0.02,
    drift: 0.5,
    shape: "circle",
  },
  jungle: {
    colors: ["#228B22", "#32CD32", "#9ACD32", "#6B8E23"],
    speedRange: [0.5, 2],
    sizeRange: [4, 8],
    gravity: 0.05,
    drift: 1,
    shape: "leaf",
  },
  space: {
    colors: ["#FFFFFF", "#87CEEB", "#DDA0DD", "#B0C4DE"],
    speedRange: [2, 5],
    sizeRange: [1, 3],
    gravity: 0,
    drift: 0.2,
    shape: "star",
  },
  underwater: {
    colors: ["#87CEEB", "#ADD8E6", "#B0E0E6", "#AFEEEE"],
    speedRange: [0.5, 2],
    sizeRange: [3, 7],
    gravity: -0.03,
    drift: 0.8,
    shape: "circle",
  },
};

class Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  shape: "circle" | "leaf" | "star";
  rotation: number;
  rotationSpeed: number;

  constructor(x: number, y: number, config: ParticleConfig) {
    this.x = x;
    this.y = y;
    const angle = Math.random() * Math.PI * 2;
    const speed =
      config.speedRange[0] +
      Math.random() * (config.speedRange[1] - config.speedRange[0]);
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.maxLife = 120 + Math.random() * 60; // 2-3 seconds at 60fps
    this.life = this.maxLife;
    this.size =
      config.sizeRange[0] +
      Math.random() * (config.sizeRange[1] - config.sizeRange[0]);
    this.color = config.colors[Math.floor(Math.random() * config.colors.length)]!;
    this.shape = config.shape;
    this.rotation = Math.random() * Math.PI * 2;
    this.rotationSpeed = (Math.random() - 0.5) * 0.1;
  }

  update(gravity: number, drift: number) {
    this.vy += gravity;
    this.vx += (Math.random() - 0.5) * drift * 0.1;
    this.x += this.vx;
    this.y += this.vy;
    this.life--;
    this.rotation += this.rotationSpeed;
  }

  draw(ctx: CanvasRenderingContext2D) {
    const alpha = this.life / this.maxLife;
    ctx.globalAlpha = alpha;
    ctx.fillStyle = this.color;

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);

    if (this.shape === "circle") {
      ctx.beginPath();
      ctx.arc(0, 0, this.size, 0, Math.PI * 2);
      ctx.fill();
    } else if (this.shape === "leaf") {
      ctx.beginPath();
      ctx.ellipse(0, 0, this.size, this.size * 0.4, 0, 0, Math.PI * 2);
      ctx.fill();
    } else if (this.shape === "star") {
      this.drawStar(ctx, this.size);
    }

    ctx.restore();
    ctx.globalAlpha = 1;
  }

  private drawStar(ctx: CanvasRenderingContext2D, size: number) {
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const outerAngle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
      const innerAngle = outerAngle + (2 * Math.PI) / 10;
      ctx.lineTo(Math.cos(outerAngle) * size, Math.sin(outerAngle) * size);
      ctx.lineTo(
        Math.cos(innerAngle) * size * 0.4,
        Math.sin(innerAngle) * size * 0.4
      );
    }
    ctx.closePath();
    ctx.fill();
  }

  isDead() {
    return this.life <= 0;
  }
}

class ParticleEmitter {
  particles: Particle[] = [];
  config: ParticleConfig;

  constructor(x: number, y: number, theme: ThemeName, count: number = 20) {
    this.config = THEME_PARTICLES[theme];
    for (let i = 0; i < count; i++) {
      this.particles.push(new Particle(x, y, this.config));
    }
  }

  update() {
    this.particles.forEach((p) => p.update(this.config.gravity, this.config.drift));
    this.particles = this.particles.filter((p) => !p.isDead());
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.particles.forEach((p) => p.draw(ctx));
  }

  isDead() {
    return this.particles.length === 0;
  }
}

export class ParticleSystem {
  private emitters: ParticleEmitter[] = [];
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private animationId: number | null = null;
  private running = false;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
  }

  spawn(x: number, y: number, theme: ThemeName) {
    const pixelX = (x / 100) * this.canvas.width;
    const pixelY = (y / 100) * this.canvas.height;
    this.emitters.push(new ParticleEmitter(pixelX, pixelY, theme, 25));
    if (!this.running) {
      this.start();
    }
  }

  private start() {
    this.running = true;
    const loop = () => {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.emitters.forEach((e) => {
        e.update();
        e.draw(this.ctx);
      });
      this.emitters = this.emitters.filter((e) => !e.isDead());
      if (this.emitters.length === 0) {
        this.running = false;
        return;
      }
      this.animationId = requestAnimationFrame(loop);
    };
    this.animationId = requestAnimationFrame(loop);
  }

  resize(width: number, height: number) {
    this.canvas.width = width;
    this.canvas.height = height;
  }

  destroy() {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
    }
    this.emitters = [];
    this.running = false;
  }
}
