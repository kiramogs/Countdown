import { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Envelope from './gifts/Envelope';
import Cake from './gifts/Cake';
// Portal removed
import HeroSection from './HeroSection';
import GiftsSection from './GiftsSection';
import './BirthdaySurprise.css';
// import './BirthdaySurpriseTransform.css'; // Used inside GiftsSection

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
        { id: 'cake', shape: 'cake', colors: ['#a18cd1', '#fbc2eb'], label: 'Birthday Cake' }
    ];

    const renderGiftContent = (giftId) => {
        switch (giftId) {
            case 'envelope':
                return <Envelope message={letterMessage} onClose={handleClose} />;
            case 'cake':
                return <Cake onClose={handleClose} />;
            // Portal case removed
            default:
                return null;
        }
    };

    return (
        <div style={{ width: '100%', overflowX: 'hidden', background: 'transparent' }}>

            {/* 1. Hero Section with Scroll Sequence */}
            {/* This takes up 300vh space, with intro text pinned */}
            <HeroSection />

            {/* 2. Gifts Section */}
            {/* Appears after the user scrolls past the hero sequence */}
            <GiftsSection
                gifts={gifts}
                activeGift={activeGift}
                setActiveGift={setActiveGift}
            />

            {/* 3. Modal Content */}
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
                            style={{ position: 'fixed', inset: 0, zIndex: 10000, background: 'rgba(0,0,0,0.9)' }}
                        >
                            {renderGiftContent(activeGift)}
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </div>
    );
};

export default BirthdaySurprise;
