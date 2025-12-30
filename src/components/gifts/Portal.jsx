import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Portal.css';

const Portal = ({ onClose }) => {
    const [stage, setStage] = useState('closed'); // closed, opening, typing, warping

    // Redirect Logic
    useEffect(() => {
        if (stage === 'warping') {
            const timer = setTimeout(() => {
                // REPLACE WITH ACTUAL URL IN PRODUCTION
                window.location.href = "https://example.com";
            }, 2500); // Wait for warp animation
            return () => clearTimeout(timer);
        }
    }, [stage]);

    const startSequence = () => {
        setStage('opening');
        setTimeout(() => setStage('typing'), 1500);
        setTimeout(() => setStage('warping'), 7000); // Increased delay to read terminal text
    };

    return (
        <div className="portal-overlay" onClick={(e) => e.stopPropagation()}>
            <AnimatePresence>
                {stage === 'closed' && (
                    <div className="portal-initial">
                        <motion.div
                            className="portal-box"
                            onClick={startSequence}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            whileHover={{ scale: 1.05 }}
                        >
                            <div className="cube">
                                <div className="face front">?</div>
                                <div className="face back"></div>
                                <div className="face right"></div>
                                <div className="face left"></div>
                                <div className="face top"></div>
                                <div className="face bottom"></div>
                            </div>
                        </motion.div>
                        <p className="portal-hint">Tap to Initiate Protocol</p>
                    </div>
                )}

                {stage !== 'closed' && (
                    <motion.div
                        className="hologram-container"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        {/* Holographic Projector Base */}
                        <div className="projector-base"></div>

                        {/* Light Cone */}
                        <motion.div
                            className="hologram-beam"
                            initial={{ height: 0 }}
                            animate={{ height: '300px' }}
                            transition={{ duration: 1 }}
                        />

                        {/* The Terminal Interface */}
                        {stage === 'typing' && (
                            <div className="terminal-interface">
                                <Typewriter text="> ACCESSING SECURE SERVER..." delay={0} />
                                <Typewriter text="> VERIFYING BIOMETRICS: MATCHED (❤️)" delay={1500} />
                                <Typewriter text="> LOADING 'PROJECT ARMAN'..." delay={3000} />
                            </div>
                        )}

                        {/* Warp Tunnel */}
                        {stage === 'warping' && (
                            <motion.div
                                className="warp-tunnel"
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 20, opacity: 1 }}
                                transition={{ duration: 2, ease: "easeIn" }}
                            >
                                <div className="star-field"></div>
                            </motion.div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {stage !== 'warping' && (
                <button className="close-portal" onClick={onClose}>Abort</button>
            )}
        </div>
    );
};

// Simple Typewriter Component
const Typewriter = ({ text, delay }) => {
    const [displayed, setDisplayed] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => {
            let i = 0;
            const interval = setInterval(() => {
                setDisplayed(text.substring(0, i + 1));
                i++;
                if (i === text.length) clearInterval(interval);
            }, 50);
            return () => clearInterval(interval);
        }, delay);
        return () => clearTimeout(timer);
    }, [text, delay]);

    return <div className="console-line">{displayed}</div>;
};

export default Portal;
