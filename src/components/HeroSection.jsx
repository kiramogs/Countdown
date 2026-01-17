import { useRef, useEffect, useState, useLayoutEffect, useCallback } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

const FRAME_COUNT = 53;
const IMAGE_PATH_PREFIX = '/frames/Untitled video - Made with Clipchamp_';
const IMAGE_EXTENSION = '.jpg';
const DIGITS = 3;

export default function HeroSection() {
    const containerRef = useRef(null);
    const canvasRef = useRef(null);
    const imagesRef = useRef([]);
    const currentFrameRef = useRef(0);
    const [isLoaded, setIsLoaded] = useState(false);

    // Check initial scroll position - if not at top, start unlocked
    const [isLocked, setIsLocked] = useState(() => {
        if (typeof window !== 'undefined') {
            return window.scrollY < 10;
        }
        return true;
    });

    const frameProgress = useMotionValue(0);
    const smoothFrame = useSpring(frameProgress, {
        stiffness: 80,
        damping: 20,
        restDelta: 0.5
    });

    // On mount: handle mid-page reload state
    useEffect(() => {
        if (window.scrollY >= 10) {
            // Page was reloaded mid-scroll, unlock and set to last frame
            setIsLocked(false);
            currentFrameRef.current = FRAME_COUNT - 1;
            frameProgress.set(FRAME_COUNT - 1);
        } else {
            // Force scroll to top on reload from near-top
            window.scrollTo(0, 0);
        }
    }, [frameProgress]);

    // 1. Image Preloading
    useEffect(() => {
        const loadedImages = [];
        let loadedCount = 0;

        for (let i = 0; i < FRAME_COUNT; i++) {
            const img = new Image();
            const frameIndex = i.toString().padStart(DIGITS, '0');
            const src = `${IMAGE_PATH_PREFIX}${frameIndex}${IMAGE_EXTENSION}`;
            img.src = src;
            img.onload = () => {
                loadedCount++;
                if (loadedCount === FRAME_COUNT) {
                    imagesRef.current = loadedImages;
                    setIsLoaded(true);
                }
            };
            loadedImages.push(img);
        }
        imagesRef.current = loadedImages;
    }, []);

    // 2. Canvas rendering
    const renderFrame = useCallback((index) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const context = canvas.getContext('2d');
        const images = imagesRef.current;

        if (!images || images.length === 0) return;

        const clampedIndex = Math.max(0, Math.min(FRAME_COUNT - 1, Math.round(index)));
        const img = images[clampedIndex];

        if (img && img.complete && img.naturalHeight !== 0) {
            const hRatio = canvas.width / img.width;
            const vRatio = canvas.height / img.height;
            const ratio = Math.max(hRatio, vRatio);
            const centerShift_x = (canvas.width - img.width * ratio) / 2;
            const centerShift_y = (canvas.height - img.height * ratio) / 2;

            context.clearRect(0, 0, canvas.width, canvas.height);
            context.drawImage(img, 0, 0, img.width, img.height,
                centerShift_x, centerShift_y, img.width * ratio, img.height * ratio);
        }
    }, []);

    // 3. Subscribe to smooth frame changes
    useEffect(() => {
        const unsubscribe = smoothFrame.on("change", (latest) => {
            renderFrame(latest);
        });
        return unsubscribe;
    }, [smoothFrame, renderFrame]);

    // 4. Initialize canvas
    useLayoutEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const context = canvas.getContext('2d');

        const setupCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            const gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height);
            gradient.addColorStop(0, '#ff9a9e');
            gradient.addColorStop(0.5, '#fbc2eb');
            gradient.addColorStop(1, '#fecfef');
            context.fillStyle = gradient;
            context.fillRect(0, 0, canvas.width, canvas.height);
        };

        setupCanvas();
        window.addEventListener('resize', setupCanvas);
        return () => window.removeEventListener('resize', setupCanvas);
    }, []);

    // 5. Render first frame when loaded
    useEffect(() => {
        if (isLoaded) {
            renderFrame(0);
        }
    }, [isLoaded, renderFrame]);

    // 6. SCROLL HIJACKING
    useEffect(() => {
        if (!isLoaded) return;

        const scrollSensitivity = 0.15;

        const handleWheel = (e) => {
            const scrollingDown = e.deltaY > 0;
            const scrollingUp = e.deltaY < 0;
            const currentFrame = currentFrameRef.current;
            const atFirstFrame = currentFrame <= 0;
            const atLastFrame = currentFrame >= FRAME_COUNT - 1;
            const isAtTop = window.scrollY <= 5;

            // LOCKED MODE: Animate frames
            if (isLocked) {
                e.preventDefault();

                const delta = e.deltaY * scrollSensitivity;
                const newFrame = Math.max(0, Math.min(FRAME_COUNT - 1, currentFrame + delta));
                currentFrameRef.current = newFrame;
                frameProgress.set(newFrame);

                // Release when at last frame and scrolling down
                if (atLastFrame && scrollingDown) {
                    setIsLocked(false);
                }
            }
            // UNLOCKED MODE: Check if we should re-lock
            else if (scrollingUp && isAtTop) {
                e.preventDefault();
                setIsLocked(true);
                currentFrameRef.current = FRAME_COUNT - 1;
                frameProgress.set(FRAME_COUNT - 1);
            }
        };

        window.addEventListener('wheel', handleWheel, { passive: false });
        return () => window.removeEventListener('wheel', handleWheel);
    }, [isLoaded, isLocked, frameProgress]);

    // 7. Control body overflow
    useEffect(() => {
        document.body.style.overflow = isLocked ? 'hidden' : 'auto';
        return () => { document.body.style.overflow = 'auto'; };
    }, [isLocked]);

    return (
        <>
            {/* FIXED Hero Background - stays in place while content scrolls over */}
            <div
                ref={containerRef}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100vh',
                    zIndex: 0, // Behind content
                    overflow: 'hidden'
                }}
            >
                <canvas
                    ref={canvasRef}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                    }}
                />

                {/* Title Overlay - fades when animation completes */}
                <motion.div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        pointerEvents: 'none',
                        zIndex: 10
                    }}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{
                        opacity: isLocked ? 1 : 0,
                        y: isLocked ? 0 : -50
                    }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <h1 className="main-title" style={{ fontSize: '5rem', margin: 0 }}>Happy Birthday, My Love</h1>
                    <p className="subtitle-text" style={{ fontSize: '1.5rem', marginTop: '1rem' }}>
                        Scroll to explore your surprise...
                    </p>
                </motion.div>

                {/* Scroll Indicator */}
                {isLocked && (
                    <motion.div
                        style={{
                            position: 'absolute',
                            bottom: '2rem',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            zIndex: 20
                        }}
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    >
                        <div style={{
                            width: '30px',
                            height: '50px',
                            border: '2px solid rgba(255,255,255,0.7)',
                            borderRadius: '15px',
                            display: 'flex',
                            justifyContent: 'center',
                            paddingTop: '8px'
                        }}>
                            <motion.div
                                style={{
                                    width: '4px',
                                    height: '8px',
                                    background: 'white',
                                    borderRadius: '2px'
                                }}
                                animate={{ y: [0, 12, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                            />
                        </div>
                    </motion.div>
                )}

                {/* Bottom Gradient Blend - fades into dark background */}
                <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: '100%',
                    height: '200px',
                    background: 'linear-gradient(to bottom, transparent 0%, #0a0a12 100%)',
                    pointerEvents: 'none',
                    zIndex: 15
                }} />
            </div>

            {/* Spacer to push content below the fixed hero */}
            <div style={{ height: '100vh' }} />
        </>
    );
}
