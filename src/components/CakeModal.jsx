import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './CakeModal.css';

const CakeModal = ({ isOpen, onClose }) => {
    const [showCandles, setShowCandles] = useState(false);
    const [candlesBlown, setCandlesBlown] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setShowCandles(false);
            setCandlesBlown(false);
            setShowConfetti(false);

            // Show candles after cake appears
            const timer = setTimeout(() => setShowCandles(true), 800);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    const blowCandles = () => {
        setCandlesBlown(true);
        setShowConfetti(true);
    };

    // Generate confetti pieces
    const confettiPieces = Array.from({ length: 50 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100 + '%',
        delay: Math.random() * 0.5,
        duration: Math.random() * 2 + 2,
        color: ['#ff9a9e', '#fbc2eb', '#a18cd1', '#ffd700', '#ff69b4'][Math.floor(Math.random() * 5)]
    }));

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="modal-overlay cake-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    {/* Confetti */}
                    {showConfetti && (
                        <div className="confetti-container">
                            {confettiPieces.map((piece) => (
                                <motion.div
                                    key={piece.id}
                                    className="confetti-piece"
                                    style={{
                                        left: piece.left,
                                        backgroundColor: piece.color
                                    }}
                                    initial={{ top: '-10%', rotate: 0 }}
                                    animate={{
                                        top: '110%',
                                        rotate: 720,
                                        x: [0, 30, -30, 0]
                                    }}
                                    transition={{
                                        duration: piece.duration,
                                        delay: piece.delay,
                                        ease: "easeOut"
                                    }}
                                />
                            ))}
                        </div>
                    )}

                    <motion.div
                        className="cake-container"
                        initial={{ scale: 0, rotate: -10 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0 }}
                        transition={{ type: "spring", stiffness: 100 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <motion.h2
                            className="cake-title"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            🎂 Your Birthday Cake! 🎂
                        </motion.h2>

                        {/* The Cake */}
                        <div className="cake">
                            {/* Candles */}
                            <div className="candles">
                                {[1, 2, 3, 4, 5].map((num) => (
                                    <div key={num} className="candle">
                                        <div className="candle-body"></div>
                                        <AnimatePresence>
                                            {showCandles && !candlesBlown && (
                                                <motion.div
                                                    className="flame"
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: [1, 1.2, 1] }}
                                                    exit={{ scale: 0, opacity: 0 }}
                                                    transition={{
                                                        scale: { repeat: Infinity, duration: 0.5 }
                                                    }}
                                                />
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ))}
                            </div>

                            {/* Cake layers */}
                            <div className="cake-top"></div>
                            <div className="cake-middle"></div>
                            <div className="cake-bottom"></div>
                            <div className="cake-plate"></div>
                        </div>

                        {!candlesBlown ? (
                            <motion.button
                                className="blow-button"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={blowCandles}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: showCandles ? 1 : 0 }}
                            >
                                ✨ Blow the Candles! ✨
                            </motion.button>
                        ) : (
                            <motion.div
                                className="wish-message"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                            >
                                <p>🌟 Make a Wish! 🌟</p>
                                <p className="wish-sub">May all your dreams come true!</p>
                            </motion.div>
                        )}

                        <button className="close-button cake-close" onClick={onClose}>
                            Close 💕
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default CakeModal;
