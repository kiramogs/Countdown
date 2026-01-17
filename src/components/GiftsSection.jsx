import { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GiftBox from './GiftBox';
import './BirthdaySurpriseTransform.css';

export default function GiftsSection({ gifts, activeGift, setActiveGift }) {
    const containerRef = useRef(null);

    return (
        <section
            ref={containerRef}
            style={{
                minHeight: '100vh',
                background: 'transparent',
                position: 'relative',
                zIndex: 20,
                paddingTop: '4rem',
                paddingBottom: '4rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}
        >
            {/* Section Title */}
            <motion.h2
                className="section-title"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                style={{
                    textAlign: 'center',
                    fontSize: 'clamp(2.5rem, 6vw, 4rem)',
                    color: '#fff',
                    marginBottom: '3rem',
                    textShadow: '0 4px 20px rgba(255, 154, 158, 0.5)'
                }}
            >
                Your Gifts Await ✨
            </motion.h2>

            {/* Gifts Container - Horizontal Row */}
            <div style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '2rem',
                width: '100%',
                flexWrap: 'wrap',
                padding: '0 2rem'
            }}>
                <AnimatePresence>
                    {!activeGift && gifts.map((gift, index) => (
                        <motion.div
                            key={gift.id}
                            className="gift-wrapper"
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.5, delay: index * 0.15 }}
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
            </div>
        </section>
    );
}
