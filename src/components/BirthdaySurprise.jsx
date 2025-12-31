import { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Envelope from './gifts/Envelope';
import Cake from './gifts/Cake';
import Portal from './gifts/Portal';
import GiftBox from './GiftBox';
import './BirthdaySurprise.css';
import './BirthdaySurpriseTransform.css';

const BirthdaySurprise = () => {
    const [activeGift, setActiveGift] = useState(null);

    const letterMessage = `My Dearest,

On this special day, I want you to know how incredibly grateful I am to have you in my life.

Every moment with you is a treasure, every smile you give me lights up my world.

You are my sunshine, my happiness, and my everything.

Happy Birthday, my love! 🎂

May this year bring you all the joy and love you deserve.`;

    const handleClose = () => setActiveGift(null);

    const gifts = [
        { id: 'envelope', shape: 'envelope', colors: ['#ff9a9e', '#fecfef'], label: 'Love Letter' },
        { id: 'cake', shape: 'cake', colors: ['#a18cd1', '#fbc2eb'], label: 'Birthday Cake' },
        { id: 'portal', shape: 'gift', colors: ['#667eea', '#764ba2'], label: 'Special Website' }
    ];

    const renderGiftContent = (giftId) => {
        switch (giftId) {
            case 'envelope':
                return <Envelope message={letterMessage} onClose={handleClose} />;
            case 'cake':
                return <Cake onClose={handleClose} />;
            case 'portal':
                return <Portal onClose={handleClose} />;
            default:
                return null;
        }
    };

    return (
        <motion.div
            className="birthday-surprise"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
        >
            <div className="content-wrapper">
                <motion.section
                    className="hero-section"
                    animate={{ opacity: activeGift ? 0.3 : 1, scale: activeGift ? 0.95 : 1 }}
                    transition={{ duration: 0.3 }}
                >
                    <h1 className="main-title">Happy Birthday</h1>
                    {!activeGift && <p className="subtitle-text">Tap a gift to reveal your surprise...</p>}
                </motion.section>

                <section className="gifts-section-transform">
                    {/* Gift Boxes */}
                    <AnimatePresence>
                        {!activeGift && gifts.map((gift, index) => (
                            <motion.div
                                key={gift.id}
                                className="gift-wrapper"
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.4, delay: index * 0.1 }}
                                onClick={() => setActiveGift(gift.id)}
                            >
                                <GiftBox
                                    index={index}
                                    shape={gift.shape}
                                    gradientColors={gift.colors}
                                    label={gift.label}
                                />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </section>
            </div>

            {/* Active Gift Content - Rendered via Portal to ensure it breaks out of any transforms */}
            {createPortal(
                <AnimatePresence mode="wait">
                    {activeGift && (
                        <motion.div
                            key={activeGift}
                            className="expanded-gift-container"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.4 }}
                        >
                            {renderGiftContent(activeGift)}
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </motion.div>
    );
};

export default BirthdaySurprise;
