import { useRef, useEffect } from 'react';

const Background = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true }); // Changed to true for transparency

    let animationFrameId;
    let width, height;
    let particles = [];
    let lastTime = 0;
    const FPS = 30; // Limit FPS for smoother performance
    const frameInterval = 1000 / FPS;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      const count = Math.min(Math.floor(width * 0.02), 25); // Reduced count
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 15 + 12,
          speedY: Math.random() * 0.5 + 0.3,
          opacity: Math.random() * 0.3 + 0.1,
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 0.5
        });
      }
    };

    const drawHeart = (x, y, size, opacity, rotation) => {
      ctx.save();
      ctx.globalAlpha = opacity;
      ctx.translate(x, y);
      ctx.rotate(rotation * Math.PI / 180);
      ctx.font = `${size}px serif`;
      ctx.fillStyle = "#ffc0cb";
      ctx.fillText("❤", -size / 4, size / 4);
      ctx.restore();
    };

    const animate = (currentTime) => {
      animationFrameId = requestAnimationFrame(animate);

      const deltaTime = currentTime - lastTime;
      if (deltaTime < frameInterval) return;
      lastTime = currentTime - (deltaTime % frameInterval);

      // Clear canvas for transparent background
      ctx.clearRect(0, 0, width, height);

      // Gradient removed to allow HeroSequence images to show through
      // If we want a fallback background color, it should be on the body or check z-indexing


      particles.forEach(p => {
        p.y -= p.speedY;
        p.rotation += p.rotationSpeed;
        if (p.y < -50) {
          p.y = height + 50;
          p.x = Math.random() * width;
        }
        drawHeart(p.x, p.y, p.size, p.opacity, p.rotation);
      });
    };

    // Debounced resize
    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(resize, 100);
    };

    window.addEventListener('resize', handleResize);
    resize();
    animationFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      clearTimeout(resizeTimeout);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 50,
        pointerEvents: 'none'
      }}
    />
  );
};

export default Background;
