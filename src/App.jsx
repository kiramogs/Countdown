import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Background from './Background';
import BirthdaySurprise from './components/BirthdaySurprise';
import CustomCursor from './components/CustomCursor';
import './App.css';

function App() {
  const targetDateStr = "January 19, 2026 00:00:00"; // Birthday date
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const [isFinished, setIsFinished] = useState(false);

  function calculateTimeLeft() {
    const difference = new Date(targetDateStr).getTime() - new Date().getTime();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    } else {
      timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
    return timeLeft;
  }

  useEffect(() => {
    const checkTimer = () => {
      const difference = new Date(targetDateStr).getTime() - new Date().getTime();
      if (difference <= 0) {
        setIsFinished(true);
      } else {
        setIsFinished(false);
      }
    }

    checkTimer();

    const timer = setInterval(() => {
      const remaining = calculateTimeLeft();
      setTimeLeft(remaining);
      checkTimer();
      if (isFinished) clearInterval(timer);
    }, 1000);

    return () => clearInterval(timer);
  }, [isFinished]);

  const formatNumber = (num) => (num < 10 ? `0${num}` : num);

  return (
    <>
      <CustomCursor />
      {/* Background hearts overlay - global */}
      <Background />

      <AnimatePresence mode="wait">
        {!isFinished ? (
          <motion.div
            key="countdown-wrapper"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            {/* Simple countdown without the broken HeroSequence */}
            <div className="glass-card-container">
              <motion.div
                key="countdown"
                className="glass-card"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                <h2 className="subtitle">Counting down to</h2>
                <h1 className="title">The Special Day</h1>

                <div className="timer-container">
                  {Object.keys(timeLeft).map((interval, i) => (
                    <motion.div
                      key={interval}
                      className="timer-box"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + (i * 0.1) }}
                    >
                      <span className="timer-number">
                        {formatNumber(timeLeft[interval])}
                      </span>
                      <span className="timer-label">{interval}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="birthday"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            style={{ width: '100%', position: 'relative', zIndex: 10 }}
          >
            <BirthdaySurprise />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default App;
