import { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import './GiftBox.css';

const GiftBox = ({ shape, color, gradientColors, onClick, delay = 0, index }) => {
    const [isHovered, setIsHovered] = useState(false);
    const ref = useRef(null);

    // Mouse tracking for 3D tilt effect
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // Smooth spring physics
    const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15 });
    const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15 });

    // Transform mouse position to rotation
    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

    const handleMouseMove = (e) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
        setIsHovered(false);
    };

    // Shape renderer
    const renderShape = () => {
        switch (shape) {
            case 'envelope':
                return (
                    <svg viewBox="0 0 100 80" className="gift-shape">
                        <defs>
                            <linearGradient id={`grad-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor={gradientColors[0]} />
                                <stop offset="100%" stopColor={gradientColors[1]} />
                            </linearGradient>
                        </defs>
                        <motion.rect
                            x="5" y="15" width="90" height="60" rx="5"
                            fill={`url(#grad-${index})`}
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                        />
                        <motion.path
                            d="M5 20 L50 50 L95 20"
                            fill="none"
                            stroke="rgba(255,255,255,0.6)"
                            strokeWidth="3"
                            strokeLinecap="round"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: isHovered ? 1 : 0.7 }}
                            transition={{ duration: 0.5 }}
                        />
                        <motion.circle
                            cx="50" cy="45" r="8"
                            fill="rgba(255,255,255,0.8)"
                            animate={{ scale: isHovered ? [1, 1.2, 1] : 1 }}
                            transition={{ duration: 0.6, repeat: isHovered ? Infinity : 0 }}
                        />
                    </svg>
                );
            case 'cake':
                return (
                    <svg viewBox="0 0 100 100" className="gift-shape">
                        <defs>
                            <linearGradient id={`grad-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor={gradientColors[0]} />
                                <stop offset="100%" stopColor={gradientColors[1]} />
                            </linearGradient>
                        </defs>
                        {/* Plate */}
                        <ellipse cx="50" cy="90" rx="45" ry="8" fill="rgba(255,255,255,0.3)" />
                        {/* Bottom layer */}
                        <motion.rect
                            x="15" y="60" width="70" height="28" rx="5"
                            fill={`url(#grad-${index})`}
                        />
                        {/* Top layer */}
                        <motion.rect
                            x="25" y="40" width="50" height="22" rx="4"
                            fill={gradientColors[0]}
                            animate={{ y: isHovered ? 38 : 40 }}
                        />
                        {/* Candle */}
                        <motion.rect
                            x="47" y="20" width="6" height="22" rx="2"
                            fill="#FFE4B5"
                        />
                        {/* Flame */}
                        <motion.ellipse
                            cx="50" cy="15" rx="5" ry="8"
                            fill="#FFA500"
                            animate={{
                                scaleY: isHovered ? [1, 1.3, 1] : 1,
                                opacity: [0.8, 1, 0.8]
                            }}
                            transition={{ duration: 0.4, repeat: Infinity }}
                        />
                        <motion.ellipse
                            cx="50" cy="13" rx="3" ry="5"
                            fill="#FFFF00"
                            animate={{ scaleY: isHovered ? [1, 1.2, 1] : 1 }}
                            transition={{ duration: 0.3, repeat: Infinity }}
                        />
                    </svg>
                );
            case 'gift':
                return (
                    <svg viewBox="0 0 100 100" className="gift-shape">
                        <defs>
                            <linearGradient id={`grad-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor={gradientColors[0]} />
                                <stop offset="100%" stopColor={gradientColors[1]} />
                            </linearGradient>
                        </defs>
                        {/* Box */}
                        <motion.rect
                            x="15" y="35" width="70" height="55" rx="5"
                            fill={`url(#grad-${index})`}
                        />
                        {/* Lid */}
                        <motion.rect
                            x="10" y="25" width="80" height="15" rx="4"
                            fill={gradientColors[1]}
                            animate={{ y: isHovered ? 22 : 25 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        />
                        {/* Ribbon vertical */}
                        <motion.rect
                            x="45" y="25" width="10" height="65" rx="2"
                            fill="rgba(255,255,255,0.7)"
                        />
                        {/* Ribbon horizontal */}
                        <motion.rect
                            x="15" y="55" width="70" height="10" rx="2"
                            fill="rgba(255,255,255,0.7)"
                        />
                        {/* Bow loops */}
                        <motion.ellipse
                            cx="38" cy="20" rx="12" ry="8"
                            fill="rgba(255,255,255,0.8)"
                            animate={{ rotate: isHovered ? -10 : 0 }}
                        />
                        <motion.ellipse
                            cx="62" cy="20" rx="12" ry="8"
                            fill="rgba(255,255,255,0.8)"
                            animate={{ rotate: isHovered ? 10 : 0 }}
                        />
                        <motion.circle
                            cx="50" cy="20" r="6"
                            fill="#fff"
                        />
                    </svg>
                );
            default:
                return null;
        }
    };

    return (
        <motion.div
            ref={ref}
            className="gift-box"
            style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
                background: `linear-gradient(135deg, ${gradientColors[0]}40, ${gradientColors[1]}40)`,
            }}
            initial={{ opacity: 0, y: 100, rotateZ: -5 }}
            animate={{ opacity: 1, y: 0, rotateZ: 0 }}
            transition={{
                duration: 1.2,
                delay: delay,
                type: "spring",
                stiffness: 60,
                damping: 12
            }}
            whileTap={{ scale: 0.95 }}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
            onClick={onClick}
        >
            {/* Glow effect */}
            <motion.div
                className="gift-glow"
                style={{ background: `radial-gradient(circle, ${gradientColors[0]}60, transparent 70%)` }}
                animate={{
                    opacity: isHovered ? 0.8 : 0.3,
                    scale: isHovered ? 1.2 : 1
                }}
                transition={{ duration: 0.4 }}
            />

            {/* Shape container */}
            <motion.div
                className="shape-container"
                animate={{
                    y: isHovered ? -10 : 0,
                    scale: isHovered ? 1.1 : 1
                }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
                {renderShape()}
            </motion.div>

            {/* Mystery text */}
            <motion.div
                className="mystery-text"
                animate={{ opacity: isHovered ? 1 : 0.7 }}
            >
                <span className="question-marks">???</span>
                <span className="tap-hint">Tap to reveal</span>
            </motion.div>

            {/* Floating particles */}
            {isHovered && (
                <div className="particles">
                    {[...Array(6)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="particle"
                            style={{ background: gradientColors[i % 2] }}
                            initial={{
                                x: 0,
                                y: 0,
                                opacity: 0,
                                scale: 0
                            }}
                            animate={{
                                x: (Math.random() - 0.5) * 100,
                                y: -50 - Math.random() * 50,
                                opacity: [0, 1, 0],
                                scale: [0, 1, 0]
                            }}
                            transition={{
                                duration: 1 + Math.random(),
                                delay: i * 0.1,
                                repeat: Infinity,
                                repeatDelay: 0.5
                            }}
                        />
                    ))}
                </div>
            )}

            {/* Shimmer sweep */}
            <motion.div
                className="shimmer-sweep"
                animate={{ x: isHovered ? ['-100%', '200%'] : '-100%' }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
            />
        </motion.div>
    );
};

export default GiftBox;
