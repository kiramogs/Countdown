# 🎂 Birthday Countdown & Surprise Website

A beautiful, interactive birthday countdown website with premium glassmorphism design and surprise gifts.

## ✨ Features

### 🕐 Countdown Phase
- **Glassmorphism Design**: Premium frosted glass aesthetic with soft pink gradients
- **Animated Background**: Floating hearts particles with smooth canvas rendering
- **Custom Cursor**: Pink heart cursor with shimmery trails
- **Responsive Timer**: Shows days, hours, minutes, and seconds until the birthday
- **Smooth Animations**: Powered by Framer Motion for fluid transitions

### 🎁 Surprise Phase (When Countdown Ends)
Three interactive surprise gifts:

1. **💌 Love Letter**
   - Realistic envelope with wax heart seal
   - CSS-based folding animation
   - Letter slides out and scales up
   - Personalized message display

2. **🎂 Birthday Cake**
   - Interactive cake with blowable candle
   - **Speech Recognition**: Blow into your microphone to extinguish the candle!
   - Canvas-based flame animation
   - Confetti celebration

3. **🌀 Portal Website**
   - Sci-fi holographic portal effect
   - 3D rotating cube
   - Typewriter terminal animation
   - Links to custom website

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
\`\`\`bash
git clone https://github.com/YOUR_USERNAME/birthday-countdown.git
cd birthday-countdown
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Start the development server:
\`\`\`bash
npm run dev
\`\`\`

4. Open your browser and navigate to the URL shown in the terminal (usually `http://localhost:5173`)

## ⚙️ Customization

### Change the Target Date
Edit `src/App.jsx`:
\`\`\`javascript
const targetDateStr = "January 19, 2026 00:00:00"; // Change this
\`\`\`

### Customize the Letter Message
Edit `src/components/BirthdaySurprise.jsx`:
\`\`\`javascript
const letterMessage = \`Your custom message here\`;
\`\`\`

### Change Website URL
Edit `src/components/gifts/Portal.jsx`:
\`\`\`javascript
window.location.href = "https://your-website.com";
\`\`\`

## 🎨 Technologies Used

- **React** - UI framework
- **Vite** - Build tool
- **Framer Motion** - Animation library
- **Canvas Confetti** - Confetti effects
- **HTML5 Canvas** - Particle animations & flame rendering
- **CSS3** - Glassmorphism, animations, and 3D transforms
- **Speech Recognition API** - Voice-controlled candle blowing

## 🎤 Microphone Feature

The birthday cake uses the **Web Speech Recognition API** to detect blowing sounds:
- Click "Blow out the candle!"
- Allow microphone access
- Say "Happy Birthday!" and blow
- The flame will flicker and extinguish

## 📱 Browser Compatibility

- ✅ Chrome/Edge (Recommended - full Speech Recognition support)
- ✅ Firefox (most features work)
- ✅ Safari (limited Speech Recognition)
- ✅ Mobile browsers (touch-enabled)

## 🌟 Credits

Inspired by:
- [Birthday Cake Blow Candle](https://github.com/VIDAKHOSHPEY22/Birthday-Cake-Blow-Candle) - Candle animation
- [CSS Envelope Animation](https://github.com/hossaini-f/css-envelope-letter-animation) - Letter folding effect

## 📄 License

MIT License - feel free to use this for your own birthday surprises!

## ❤️ Made with Love

Created for making birthdays extra special with code and creativity.
