import { motion } from 'framer-motion';
import './GiftCard.css';

const GiftCard = ({ icon, title, description, onClick, delay = 0 }) => {
    return (
        <motion.div
            className="gift-card"
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
                duration: 0.8,
                delay: delay,
                type: "spring",
                stiffness: 100
            }}
            whileHover={{
                scale: 1.05,
                boxShadow: "0 20px 40px rgba(255, 154, 158, 0.4)"
            }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
        >
            <motion.div
                className="gift-icon"
                animate={{
                    y: [0, -10, 0],
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            >
                {icon}
            </motion.div>
            <h3 className="gift-title">{title}</h3>
            <p className="gift-description">{description}</p>
            <div className="gift-shimmer"></div>
        </motion.div>
    );
};

export default GiftCard;
