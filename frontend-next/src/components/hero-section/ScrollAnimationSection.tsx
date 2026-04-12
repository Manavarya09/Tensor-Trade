'use client';

import { useEffect, useRef, useState } from 'react';
import { useScroll, useTransform, useMotionValueEvent } from 'framer-motion';

const FRAME_COUNT = 240;

function frameSrc(i: number) {
  return `/hero-section/ezgif-frame-${String(i + 1).padStart(3, '0')}.jpg`;
}

function drawFrame(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  img: HTMLImageElement,
) {
  const imgRatio = img.width / img.height;
  const canvasRatio = canvas.width / canvas.height;
  let rw: number, rh: number, ox: number, oy: number;
  if (canvasRatio > imgRatio) {
    rw = canvas.width;
    rh = canvas.width / imgRatio;
    ox = 0;
    oy = (canvas.height - rh) / 2;
  } else {
    rw = canvas.height * imgRatio;
    rh = canvas.height;
    ox = (canvas.width - rw) / 2;
    oy = 0;
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, ox, oy, rw, rh);
}

export default function ScrollAnimationSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>(
    Array(FRAME_COUNT).fill(null),
  );
  const [isLoaded, setIsLoaded] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const frameIndex = useTransform(scrollYProgress, [0, 1], [0, FRAME_COUNT - 1]);

  // Load frame 0 immediately so the canvas is never blank on Vercel
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Size the canvas first
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const firstImg = new Image();
    firstImg.src = frameSrc(0);
    firstImg.onload = () => {
      imagesRef.current[0] = firstImg;
      const ctx = canvas.getContext('2d');
      if (ctx) drawFrame(ctx, canvas, firstImg);

      // Now load the rest in parallel
      const rest = Array.from({ length: FRAME_COUNT - 1 }, (_, i) => {
        const idx = i + 1;
        return new Promise<void>((resolve) => {
          const img = new Image();
          img.src = frameSrc(idx);
          img.onload = () => {
            imagesRef.current[idx] = img;
            resolve();
          };
          img.onerror = () => resolve();
        });
      });

      Promise.all(rest).then(() => setIsLoaded(true));
    };
    firstImg.onerror = () => {
      // If frame 0 fails, still attempt the rest
      const all = Array.from({ length: FRAME_COUNT }, (_, idx) =>
        new Promise<void>((resolve) => {
          const img = new Image();
          img.src = frameSrc(idx);
          img.onload = () => { imagesRef.current[idx] = img; resolve(); };
          img.onerror = () => resolve();
        }),
      );
      Promise.all(all).then(() => setIsLoaded(true));
    };
  }, []);

  // Resize handler — redraw current frame after resize
  useEffect(() => {
    const resize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const idx = Math.round(frameIndex.get());
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const img = imagesRef.current[Math.min(idx, FRAME_COUNT - 1)];
      if (img) {
        const ctx = canvas.getContext('2d');
        if (ctx) drawFrame(ctx, canvas, img);
      }
    };
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, [frameIndex]);

  // Draw on scroll
  useMotionValueEvent(frameIndex, 'change', (latest) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const idx = Math.min(Math.round(latest), FRAME_COUNT - 1);
    // Use whatever frames are loaded; fall back to frame 0 while loading
    const img = imagesRef.current[idx] ?? imagesRef.current[0];
    if (!img) return;
    const ctx = canvas.getContext('2d');
    if (ctx) drawFrame(ctx, canvas, img);
  });

  return (
    <div ref={containerRef} className="h-[800vh] bg-white relative">
      <div className="sticky top-0 h-[100dvh] w-full overflow-hidden">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
