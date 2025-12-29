import { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import './Cake.css';

const Cake = ({ onClose }) => {
    const [isBlown, setIsBlown] = useState(false);
    const canvasRef = useRef(null);
    const recognitionRef = useRef(null);
    const [isListening, setIsListening] = useState(false);

    const flameState = useRef({
        size: 1.0,
        shake: 0,
        flameOn: true,
        smokes: [],
        blowIntensity: 0,
        isBlowDetected: false
    });

    // Canvas animation loop
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        canvas.width = 50;
        canvas.height = 100;

        let animationId;

        const drawSmokes = () => {
            const { smokes } = flameState.current;
            smokes.forEach((s) => {
                ctx.save();
                ctx.globalAlpha = s.alpha;
                ctx.beginPath();
                ctx.ellipse(s.x, s.y, Math.abs(s.r), Math.abs(s.r * 1.5), 0, 0, 2 * Math.PI);
                ctx.fillStyle = "#bbb";
                ctx.fill();
                ctx.restore();

                s.y -= 0.7 + Math.random();
                s.x += Math.sin(s.y / 10) * 0.4;
                s.alpha -= 0.008 + Math.random() * 0.004;
            });
            flameState.current.smokes = smokes.filter(s => s.alpha > 0.05);
        };

        const drawCandle = () => {
            const { flameOn, size, isBlowDetected, smokes } = flameState.current;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Candle body - pink with stripes
            ctx.save();
            const gradient = ctx.createLinearGradient(18, 38, 26, 38);
            gradient.addColorStop(0, "#f8bbd0");
            gradient.addColorStop(0.5, "#fff");
            gradient.addColorStop(1, "#f8bbd0");
            ctx.fillStyle = gradient;
            ctx.fillRect(18, 38, 8, 40);

            // Candle top ellipse
            ctx.beginPath();
            ctx.ellipse(22, 38, 4, 2, 0, 0, 2 * Math.PI);
            ctx.fillStyle = "#e57373";
            ctx.fill();

            // Wick
            ctx.strokeStyle = "#333";
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(22, 38);
            ctx.lineTo(22, 28);
            ctx.stroke();
            ctx.restore();

            // Flame
            if (flameOn) {
                let flick = isBlowDetected ? Math.sin(Date.now() / 100) * 3 : Math.sin(Date.now() / 200) * 0.5;

                let flameHeight = Math.max(1, 13 * size + flick);
                let flameWidth = Math.max(0.5, 4.5 * size);

                // Outer glow
                ctx.save();
                ctx.globalAlpha = 0.5 * size;
                ctx.beginPath();
                ctx.ellipse(22, 20, flameWidth + 5, flameHeight + 5, 0, 0, 2 * Math.PI);
                ctx.fillStyle = "#fffde7";
                ctx.shadowColor = "#ffeb3b";
                ctx.shadowBlur = 15;
                ctx.fill();
                ctx.restore();

                // Yellow outer flame
                ctx.save();
                ctx.globalAlpha = 0.9 * size;
                ctx.beginPath();
                ctx.ellipse(22, 20, flameWidth, flameHeight, 0, 0, 2 * Math.PI);
                ctx.fillStyle = "#ffe082";
                ctx.shadowColor = "#ffd600";
                ctx.shadowBlur = 8;
                ctx.fill();
                ctx.restore();

                // Orange core
                ctx.save();
                ctx.globalAlpha = 0.7 * size;
                ctx.beginPath();
                ctx.ellipse(22, 23, flameWidth * 0.6, flameHeight * 0.6, 0, 0, 2 * Math.PI);
                ctx.fillStyle = "#ff9800";
                ctx.shadowColor = "#ff5722";
                ctx.shadowBlur = 4;
                ctx.fill();
                ctx.restore();

                // Blue inner core (hottest point)
                ctx.save();
                ctx.globalAlpha = 0.4 * size;
                ctx.beginPath();
                ctx.ellipse(22, 26, flameWidth * 0.3, flameHeight * 0.3, 0, 0, 2 * Math.PI);
                ctx.fillStyle = "#42a5f5";
                ctx.fill();
                ctx.restore();
            }

            if (smokes.length > 0) {
                drawSmokes();
            }

            animationId = requestAnimationFrame(drawCandle);
        };

        drawCandle();
        return () => cancelAnimationFrame(animationId);
    }, []);

    // Speech Recognition setup
    useEffect(() => {
        if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
            console.warn('Speech Recognition not supported');
            return;
        }

        const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new Recognition();
        recognition.lang = 'en-US';
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.maxAlternatives = 3;

        recognitionRef.current = recognition;

        let blowTimeout;

        recognition.onresult = (event) => {
            if (!flameState.current.flameOn) return;

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const result = event.results[i];

                if (result.isFinal || flameState.current.blowIntensity > 0.4) {
                    flameState.current.isBlowDetected = true;
                    flameState.current.blowIntensity += 0.15;

                    clearTimeout(blowTimeout);
                    blowTimeout = setTimeout(() => {
                        if (flameState.current.size <= 0.4 || flameState.current.blowIntensity > 0.6) {
                            extinguish();
                            try {
                                recognition.stop();
                                setIsListening(false);
                            } catch (e) {
                                console.log('Recognition stop error:', e);
                            }
                        }
                        flameState.current.isBlowDetected = false;
                    }, 700);
                }

                const transcript = result[0]?.transcript?.toLowerCase() || '';
                if (transcript.includes('who') || transcript.includes('fwoosh') || result[0]?.confidence < 0.4) {
                    flameState.current.blowIntensity += 0.2;
                    flameState.current.isBlowDetected = true;
                }
            }
        };

        recognition.onerror = (event) => {
            if (event.error !== 'no-speech') {
                console.warn('Speech recognition error:', event.error);
            }
            setIsListening(false);
            flameState.current.isBlowDetected = false;
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        const updateFlame = setInterval(() => {
            if (flameState.current.isBlowDetected && flameState.current.flameOn) {
                flameState.current.size = Math.max(0.2, flameState.current.size - 0.03 * flameState.current.blowIntensity);
            }
        }, 50);

        return () => {
            clearInterval(updateFlame);
            try {
                recognition.abort();
            } catch (e) { }
        };
    }, []);

    const startListening = () => {
        if (!recognitionRef.current || isListening) return;

        try {
            recognitionRef.current.start();
            setIsListening(true);
            flameState.current.isBlowDetected = false;
            flameState.current.blowIntensity = 0;
        } catch (e) {
            console.error('Failed to start recognition:', e);
        }
    };

    const extinguish = () => {
        if (!flameState.current.flameOn) return;

        flameState.current.flameOn = false;
        setIsBlown(true);

        // Spawn smoke
        for (let i = 0; i < 15; i++) {
            flameState.current.smokes.push({
                x: 22 + (Math.random() - 0.5) * 3,
                y: 18 + Math.random() * 2,
                r: 4 + Math.random() * 3,
                alpha: 0.3 + Math.random() * 0.2
            });
        }

        // Confetti celebration
        const duration = 4000;
        const end = Date.now() + duration;
        const colors = ['#ff9a9e', '#fbc2eb', '#ffd700', '#ffffff'];

        (function frame() {
            confetti({
                particleCount: 4,
                angle: 60,
                spread: 70,
                origin: { x: 0, y: 0.6 },
                colors: colors
            });
            confetti({
                particleCount: 4,
                angle: 120,
                spread: 70,
                origin: { x: 1, y: 0.6 },
                colors: colors
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        })();
    };

    return (
        <div className="cake-scene" onClick={(e) => e.stopPropagation()}>
            <button className="close-cake-btn" onClick={onClose}>×</button>

            {/* Decorative sparkles */}
            <span className="sparkle-1">✨</span>
            <span className="sparkle-2">💫</span>
            <span className="sparkle-3">⭐</span>

            <div className="cake-display">
                <div className="cake-img-wrapper">
                    {/* Real cake image */}
                    <img
                        src="/cake.png"
                        alt="Birthday Cake"
                        className="cake-image"
                    />

                    {/* Candle canvas overlay */}
                    <canvas
                        id="cake-candle-canvas"
                        ref={canvasRef}
                        className={isBlown ? 'candle-off' : ''}
                    />

                    {/* Glow effect */}
                    {!isBlown && <div className="candle-glow" />}
                </div>

                <div className="text-below-cake">
                    {!isBlown ? (
                        <button
                            className="blow-btn"
                            onClick={startListening}
                            disabled={isListening}
                        >
                            {isListening ? (
                                <>
                                    <span className="mic-indicator"></span>
                                    Listening... Blow now!
                                </>
                            ) : (
                                '🎂 Blow out the candle!'
                            )}
                        </button>
                    ) : (
                        <div className="birthday-message">
                            🎉 Happy Birthday! 🎉
                        </div>
                    )}

                    {!isBlown && (
                        <p className="hint-text">
                            First, make a wish. Then say:<br />
                            <strong>"Happy birthday to me!"</strong> and blow!
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Cake;
