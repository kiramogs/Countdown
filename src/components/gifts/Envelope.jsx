import { useState } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import './Envelope.css';

const Envelope = ({ message, onClose }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleClick = () => {
        if (isOpen) return;

        setIsOpen(true);

        // Confetti
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#ff9a9e', '#ffd1ff', '#ffffff', '#fbc2eb']
        });
    };

    return (
        <div className="envelope-scene" onClick={(e) => e.stopPropagation()}>
            <div className={`envelope-wrapper ${isOpen ? 'flap' : ''}`} onClick={handleClick}>
                <div className="envelope">
                    <div className="letter">
                        <div className="letter-text">
                            <strong>My Dearest,</strong>
                            <p>{message}</p>
                        </div>
                    </div>
                </div>
                <div className="heart"></div>
            </div>

            {isOpen && (
                <motion.button
                    className="close-envelope-btn"
                    onClick={(e) => {
                        e.stopPropagation();
                        onClose();
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 2 }}
                >
                    Close
                </motion.button>
            )}
        </div>
    );
};

export default Envelope;
