import { useEffect, useRef } from 'react';
import { motion, useMotionValue } from 'framer-motion';
import "../index.css";

const CustomCursor = () => {
    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);
    const trailCanvasRef = useRef(null);
    const trailPoints = useRef([]);

    useEffect(() => {
        const canvas = trailCanvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        let animationId;

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        const moveCursor = (e) => {
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);

            // Add trail point
            trailPoints.current.push({
                x: e.clientX,
                y: e.clientY,
                age: 0
            });

            // Keep only last 20 points
            if (trailPoints.current.length > 20) {
                trailPoints.current.shift();
            }
        };

        const drawTrails = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            trailPoints.current.forEach((point, i) => {
                point.age += 0.02;
                const alpha = Math.max(0, 1 - point.age);
                const size = Math.max(0, 8 * (1 - point.age));

                if (alpha > 0 && size > 0) {
                    ctx.beginPath();
                    ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
                    ctx.fillStyle = `hsla(${330 + i * 3}, 100%, 70%, ${alpha * 0.6})`;
                    ctx.fill();
                }
            });

            // Remove dead points
            trailPoints.current = trailPoints.current.filter(p => p.age < 1);

            animationId = requestAnimationFrame(drawTrails);
        };

        window.addEventListener('mousemove', moveCursor);
        window.addEventListener('resize', handleResize);
        animationId = requestAnimationFrame(drawTrails);

        return () => {
            window.removeEventListener('mousemove', moveCursor);
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationId);
        };
    }, [cursorX, cursorY]);

    return (
        <>
            <canvas
                ref={trailCanvasRef}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    pointerEvents: 'none',
                    zIndex: 9998
                }}
            />
            <motion.div
                className="custom-cursor"
                style={{
                    x: cursorX,
                    y: cursorY,
                    translateX: "-50%",
                    translateY: "-50%"
                }}
            >
                🩷
            </motion.div>
        </>
    );
};

export default CustomCursor;
