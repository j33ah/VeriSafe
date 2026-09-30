import React, { useEffect, useRef } from 'react';
import { ShieldCheck, Lock, Activity, Users } from 'lucide-react';

export const HeroGlobe3D: React.FC = () => {
  const globeCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = globeCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let rotation = 0;
    let pulseRadius = 0;

    const size = 360;
    canvas.width = size;
    canvas.height = size;
    const centerX = size / 2;
    const centerY = size / 2;
    const globeRadius = 120;

    // Generate 3D latitude/longitude points on a sphere
    const points: { lat: number; lon: number }[] = [];
    for (let lat = -80; lat <= 80; lat += 20) {
      for (let lon = 0; lon < 360; lon += 24) {
        points.push({ lat, lon });
      }
    }

    // Binary floating particles
    const binaryBits = Array.from({ length: 18 }, () => ({
      x: (Math.random() - 0.5) * 300,
      y: (Math.random() - 0.5) * 300,
      char: Math.random() > 0.5 ? '1' : '0',
      speed: Math.random() * 0.8 + 0.3,
      alpha: Math.random() * 0.7 + 0.3,
    }));

    const renderGlobe = () => {
      ctx.clearRect(0, 0, size, size);
      rotation += 0.008;

      // Outer glowing security shield aura
      const auraGrad = ctx.createRadialGradient(centerX, centerY, globeRadius - 20, centerX, centerY, globeRadius + 50);
      auraGrad.addColorStop(0, 'rgba(34, 211, 238, 0.18)');
      auraGrad.addColorStop(0.6, 'rgba(59, 130, 246, 0.08)');
      auraGrad.addColorStop(1, 'rgba(4, 8, 22, 0)');
      ctx.fillStyle = auraGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, globeRadius + 50, 0, Math.PI * 2);
      ctx.fill();

      // Draw Globe Sphere Base Gradient
      const globeGrad = ctx.createRadialGradient(centerX - 30, centerY - 30, 10, centerX, centerY, globeRadius);
      globeGrad.addColorStop(0, 'rgba(15, 25, 48, 0.95)');
      globeGrad.addColorStop(0.7, 'rgba(8, 16, 32, 0.98)');
      globeGrad.addColorStop(1, 'rgba(4, 8, 22, 1)');
      ctx.fillStyle = globeGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, globeRadius, 0, Math.PI * 2);
      ctx.fill();

      // Globe Border
      ctx.strokeStyle = 'rgba(34, 211, 238, 0.35)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(centerX, centerY, globeRadius, 0, Math.PI * 2);
      ctx.stroke();

      // Project 3D sphere grid points
      const projected: { x: number; y: number; z: number }[] = [];
      points.forEach((p) => {
        const radLat = (p.lat * Math.PI) / 180;
        const radLon = ((p.lon + rotation * 50) * Math.PI) / 180;

        const x = globeRadius * Math.cos(radLat) * Math.sin(radLon);
        const y = globeRadius * Math.sin(radLat);
        const z = globeRadius * Math.cos(radLat) * Math.cos(radLon);

        if (z > -20) {
          projected.push({ x: centerX + x, y: centerY + y, z });
        }
      });

      // Draw projected grid lines & node dots
      projected.forEach((pt) => {
        const alpha = Math.max(0.1, (pt.z + 20) / (globeRadius + 20));
        ctx.fillStyle = `rgba(34, 211, 238, ${alpha * 0.8})`;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 1.8, 0, Math.PI * 2);
        ctx.fill();
      });

      // Orbiting Radar Scan Ring
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(rotation * 1.5);
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.6)';
      ctx.lineWidth = 2;
      ctx.setLineDash([8, 12]);
      ctx.beginPath();
      ctx.ellipse(0, 0, globeRadius + 20, (globeRadius + 20) * 0.35, Math.PI / 6, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // Expanding Security Radar Pulse
      pulseRadius = (pulseRadius + 1.2) % (globeRadius + 45);
      const pulseAlpha = Math.max(0, 1 - pulseRadius / (globeRadius + 45));
      ctx.strokeStyle = `rgba(34, 211, 238, ${pulseAlpha * 0.5})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(centerX, centerY, pulseRadius, 0, Math.PI * 2);
      ctx.stroke();

      // Floating Binary Particles
      ctx.font = '10px monospace';
      binaryBits.forEach((b) => {
        b.y -= b.speed;
        if (b.y < -160) b.y = 160;
        ctx.fillStyle = `rgba(34, 211, 238, ${b.alpha * 0.7})`;
        ctx.fillText(b.char, centerX + b.x, centerY + b.y);
      });

      animId = requestAnimationFrame(renderGlobe);
    };

    renderGlobe();

    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div className="relative flex items-center justify-center py-6">
      {/* Central 3D Globe Canvas */}
      <div className="relative z-10 flex items-center justify-center">
        <canvas
          ref={globeCanvasRef}
          className="rounded-full shadow-2xl shadow-cyan-500/20 border border-cyan-500/20"
        />

        {/* Orbiting Shield Badge overlay */}
        <div className="absolute top-2 right-2 sm:right-6 p-2.5 rounded-2xl glass-panel border-cyan-400/40 text-cyan-300 shadow-lg animate-bounce flex items-center gap-2 text-xs font-semibold backdrop-blur-md">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <span>Real-time Shield Active</span>
        </div>

        <div className="absolute bottom-2 left-2 sm:left-6 p-2.5 rounded-2xl glass-panel border-blue-400/40 text-blue-300 shadow-lg flex items-center gap-2 text-xs font-semibold backdrop-blur-md">
          <Activity className="w-4 h-4 text-emerald-400" />
          <span>Gemini AI 3.6 Flash</span>
        </div>
      </div>
    </div>
  );
};
