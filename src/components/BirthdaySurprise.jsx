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

    const letterMessage = `Dear Future Mrs. Madhwani,

I still can't believe that this is happening, like yesssssssssssssssssssss, I am finally with the LOVE OF MY LIFE, and celebrating HER 21st BIRTHDAY with me being her lover. Although this seems like a fantasy, I am so happy this is happening in real life.

From the moment I fell in love with you, started to fall for you harder and harder with each word that came out of your mouth, each smile you gave, and your EYES, ohhhh lorrrrddddddd!!!

I will always love you honey, and nothing can change this 💗💗💗.

HAPPY BIRTHDAY ONCE AGAIN MY LOVE 😘😘😘😘`;

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
