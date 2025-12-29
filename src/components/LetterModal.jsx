import { motion, AnimatePresence } from 'framer-motion';
import './LetterModal.css';

const LetterModal = ({ isOpen, onClose, message }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="modal-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    <motion.div
                        className="letter-container"
                        initial={{ scale: 0.5, opacity: 0, rotateX: -15 }}
                        animate={{ scale: 1, opacity: 1, rotateX: 0 }}
                        exit={{ scale: 0.5, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 100, damping: 15 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Envelope flap */}
                        <motion.div
                            className="envelope-flap"
                            initial={{ rotateX: 0 }}
                            animate={{ rotateX: 180 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                        />

                        {/* Letter content */}
                        <motion.div
                            className="letter-content"
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.8, duration: 0.5 }}
                        >
                            <div className="letter-header">
                                <span className="letter-heart">💕</span>
                                <h2>A Letter For You</h2>
                                <span className="letter-heart">💕</span>
                            </div>

                            <div className="letter-body">
                                {message.split('\n').map((line, index) => (
                                    <p key={index}>{line}</p>
                                ))}
                            </div>

                            <div className="letter-signature">
                                With all my love ❤️
                            </div>

                            <button className="close-button" onClick={onClose}>
                                Close with Love 💝
                            </button>
                        </motion.div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default LetterModal;
