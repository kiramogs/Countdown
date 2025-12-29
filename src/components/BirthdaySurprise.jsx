import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Envelope from './gifts/Envelope';
import Cake from './gifts/Cake';
import Portal from './gifts/Portal';
import GiftBox from './GiftBox';
import './BirthdaySurprise.css';
import './BirthdaySurpriseTransform.css'; // Add new styles

const BirthdaySurprise = () => {
    const [activeGift, setActiveGift] = useState(null); // 'envelope', 'cake', 'portal' or null

    // ========================================
    // CUSTOMIZE THIS MESSAGE FOR HER! 💕
    // ========================================
    const letterMessage = `My Dearest,

On this special day, I want you to know how incredibly grateful I am to have you in my life.

Every moment with you is a treasure, every smile you give me lights up my world.

You are my sunshine, my happiness, and my everything.

Happy Birthday, my love! 🎂

May this year bring you all the joy and love you deserve.`;

    const handleClose = () => setActiveGift(null);

    return (
        <motion.div
            className="birthday-surprise"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
        >
            <div className="content-wrapper">
                <motion.section
                    className="hero-section"
                    animate={{
                        height: activeGift ? '20vh' : '40vh',
                        opacity: activeGift ? 0.5 : 1
                    }}
                >
                    <h1 className="main-title">Happy Birthday</h1>
                    <AnimatePresence>
                        {!activeGift && (
                            <motion.p
                                className="subtitle-text"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                            >
                                Tap a gift to reveal your surprise...
                            </motion.p>
                        )}
                    </AnimatePresence>
                </motion.section>

                <section className="gifts-section-transform">
                    <AnimatePresence mode="popLayout">
                        {/* 1. ENVELOPE */}
                        {(!activeGift || activeGift === 'envelope') && (
                            <motion.div
                                layoutId="gift-envelope"
                                className={`gift-wrapper ${activeGift === 'envelope' ? 'expanded' : ''}`}
                                onClick={() => !activeGift && setActiveGift('envelope')}
                            >
                                {!activeGift ? (
                                    <GiftBox
                                        index={0}
                                        shape="envelope"
                                        gradientColors={['#ff9a9e', '#fecfef']}
                                        label="Love Letter"
                                    />
                                ) : (
                                    <motion.div
                                        className="full-gift-container"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.3 }}
                                    >
                                        <Envelope
                                            message={letterMessage}
                                            onClose={handleClose}
                                        />
                                    </motion.div>
                                )}
                            </motion.div>
                        )}

                        {/* 2. CAKE */}
                        {(!activeGift || activeGift === 'cake') && (
                            <motion.div
                                layoutId="gift-cake"
                                className={`gift-wrapper ${activeGift === 'cake' ? 'expanded' : ''}`}
                                onClick={() => !activeGift && setActiveGift('cake')}
                            >
                                {!activeGift ? (
                                    <GiftBox
                                        index={1}
                                        shape="cake"
                                        gradientColors={['#a18cd1', '#fbc2eb']}
                                        label="Birthday Cake"
                                    />
                                ) : (
                                    <motion.div
                                        className="full-gift-container"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.3 }}
                                    >
                                        <Cake onClose={handleClose} />
                                    </motion.div>
                                )}
                            </motion.div>
                        )}

                        {/* 3. PORTAL */}
                        {(!activeGift || activeGift === 'portal') && (
                            <motion.div
                                layoutId="gift-portal"
                                className={`gift-wrapper ${activeGift === 'portal' ? 'expanded' : ''}`}
                                onClick={() => !activeGift && setActiveGift('portal')}
                            >
                                {!activeGift ? (
                                    <GiftBox
                                        index={2}
                                        shape="gift"
                                        gradientColors={['#667eea', '#764ba2']}
                                        label="Special Website"
                                    />
                                ) : (
                                    <motion.div
                                        className="full-gift-container"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.3 }}
                                    >
                                        <Portal onClose={handleClose} />
                                    </motion.div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </section>
            </div>
        </motion.div>
    );
};

export default BirthdaySurprise;
