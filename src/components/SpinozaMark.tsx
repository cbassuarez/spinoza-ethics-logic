import { motion } from 'framer-motion';
import { useEffect, useMemo, useRef } from 'react';

const generateDitherPattern = (size: number, radius: number) => {
  const data: number[][] = [];
  for (let y = 0; y < size; y += 1) {
    const row: number[] = [];
    for (let x = 0; x < size; x += 1) {
      const dx = x - size / 2;
      const dy = y - size / 2;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const threshold = 0.6 + 0.2 * Math.cos((dist / radius) * Math.PI);
      const noise = (Math.sin(x * 12.9898 + y * 78.233) * 43758.5453) % 1;
      row.push(dist < radius && noise < threshold ? 1 : 0);
    }
    data.push(row);
  }
  return data;
};

const SpinozaMark = () => {
  const size = 72;
  const radius = 28;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const pattern = useMemo(() => generateDitherPattern(size, radius), [size, radius]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const pixel = 2;
    canvas.width = size;
    canvas.height = size;
    ctx.clearRect(0, 0, size, size);
    ctx.fillStyle = '#0f172a';
    pattern.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell) {
          ctx.fillRect(x, y, pixel, pixel);
        }
      });
    });
  }, [pattern, size]);

  return (
    <motion.div
      className="relative h-full w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
      animate={{ rotate: [0, 1.5, 0, -1.5, 0], scale: [1, 1.02, 1, 1.03, 1] }}
      transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-100" />
      <canvas ref={canvasRef} className="relative z-10 h-full w-full mix-blend-multiply" />
    </motion.div>
  );
};

export default SpinozaMark;
