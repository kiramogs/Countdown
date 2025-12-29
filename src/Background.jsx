import { useRef, useEffect } from 'react';

const Background = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animationFrameId;
    let width, height;
    let particles = [];

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      const count = Math.min(width * 0.05, 50); // Limit count for performance
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 20 + 10, // Large hearts
          speedY: Math.random() * 1 + 0.5,
          opacity: Math.random() * 0.5 + 0.1,
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 2
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
      ctx.fillText("❤", 0, 0);
      ctx.restore();
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach(p => {
        p.y -= p.speedY;
        p.rotation += p.rotationSpeed;
        if (p.y < -50) {
          p.y = height + 50;
          p.x = Math.random() * width;
        }
        drawHeart(p.x, p.y, p.size, p.opacity, p.rotation);
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resize);
    resize();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
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
        zIndex: -1,
        pointerEvents: 'none',
        background: 'linear-gradient(-45deg, #ff9a9e, #fad0c4, #fbc2eb, #a18cd1)',
        backgroundSize: '400% 400%',
        animation: 'gradientBG 15s ease infinite'
      }}
    />
  );
};

export default Background;
