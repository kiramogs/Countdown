import { useRef, useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import "../index.css"; // Ensure corrected path import

const CustomCursor = () => {
    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);
    const [trails, setTrails] = useState([]);

    // Smooth heart movement
    const springConfig = { damping: 25, stiffness: 300 };
    const smoothX = useSpring(cursorX, springConfig);
    const smoothY = useSpring(cursorY, springConfig);

    useEffect(() => {
        const moveCursor = (e) => {
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);

            // Add trail point
            const newTrail = {
                x: e.clientX,
                y: e.clientY,
                id: Date.now()
            };

            setTrails(prev => [...prev.slice(-15), newTrail]);
        };

        window.addEventListener('mousemove', moveCursor);
        return () => window.removeEventListener('mousemove', moveCursor);
    }, [cursorX, cursorY]);

    // Remove old trails
    useEffect(() => {
        const interval = setInterval(() => {
            setTrails(prev => prev.filter(t => Date.now() - t.id < 500));
        }, 100);
        return () => clearInterval(interval);
    }, []);

    return (
        <>
            {trails.map((trail, index) => (
                <motion.div
                    key={trail.id}
                    className="cursor-trail"
                    initial={{ opacity: 0.8, scale: 1 }}
                    animate={{ opacity: 0, scale: 0 }}
                    transition={{ duration: 0.5 }}
                    style={{
                        left: trail.x,
                        top: trail.y,
                        background: `hsla(${330 + index * 2}, 100%, 70%, 0.8)` // Shimmery pink hues
                    }}
                />
            ))}
            <motion.div
                className="custom-cursor"
                style={{
                    x: cursorX, // Use raw values for instant tracking if spring feels laggy, or keep smooth
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
