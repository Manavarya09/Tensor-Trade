'use client';

import { useEffect, useRef, useState } from 'react';
import { useScroll, useTransform, useMotionValueEvent } from 'framer-motion';

export default function ScrollAnimationSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Scroll progress for the entire 800vh section (slower scroll)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Use all 240 frames for maximum smoothness
  const frameCount = 240;

  useEffect(() => {
    const loadImages = async () => {
      const loadedImages: HTMLImageElement[] = [];

      for (let i = 0; i < frameCount; i++) {
        const img = new Image();
        // 1-based index: 0 -> 001, 239 -> 240
        const fileIndex = i + 1;
        const fileName = `ezgif-frame-${String(fileIndex).padStart(3, '0')}.jpg`;
        img.src = `/hero-section/${fileName}`;
        await new Promise((resolve) => {
          img.onload = resolve;
          img.onerror = resolve;
        });
        loadedImages.push(img);
      }
      setImages(loadedImages);
      setIsLoaded(true);
    };

    loadImages();
  }, []);

  // Current frame index based on scroll
  const frameIndex = useTransform(scrollYProgress, [0, 1], [0, frameCount - 1]);

  // Render canvas
  useMotionValueEvent(frameIndex, "change", (latest) => {
    const canvas = canvasRef.current;
    if (!canvas || !isLoaded || images.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const index = Math.round(latest);
    const img = images[index];

    // Safety check
    if (!img) return;

    // Responsive scaling: cover
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    // Draw image to cover the canvas
    const imgRatio = img.width / img.height;
    const canvasRatio = canvasWidth / canvasHeight;

    let renderWidth, renderHeight, offsetX, offsetY;

    if (canvasRatio > imgRatio) {
      renderWidth = canvasWidth;
      renderHeight = canvasWidth / imgRatio;
      offsetX = 0;
      offsetY = (canvasHeight - renderHeight) / 2;
    } else {
      renderWidth = canvasHeight * imgRatio;
      renderHeight = canvasHeight;
      offsetX = (canvasWidth - renderWidth) / 2;
      offsetY = 0;
    }

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.drawImage(img, offsetX, offsetY, renderWidth, renderHeight);
  });

  // Handle Canvas Resize
  useEffect(() => {
    const resizeCanvas = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

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
