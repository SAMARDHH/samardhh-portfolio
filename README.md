# 🚀 Samardhh Portfolio - Interactive 3D Solar System

An immersive 3D portfolio website with a space/solar system theme, featuring animated planets orbiting around a 3D avatar, stunning cosmic backgrounds, and a built-in Space Shooter mini-game.

![React](https://img.shields.io/badge/React-19.2.0-61DAFB?logo=react)
![Three.js](https://img.shields.io/badge/Three.js-0.160.0-000000?logo=three.js)
![Vite](https://img.shields.io/badge/Vite-7.2.4-646CFF?logo=vite)

---

## ✨ Features

### 🌌 Solar System Portfolio
- **Interactive 3D Planets** - Four planets orbiting in sync on a shared orbit:
  - 🌍 **About** - Personal introduction, skills, and philosophy
  - 🔴 **Experience** - Professional work history with design & dev contributions
  - 🪐 **Skills** - Technical skills organized by category with core strengths
  - 🎓 **Education** - Academic background with CGPA
- **3D Avatar Center** - Animated 3D avatar at the center that rotates and floats
- **Synchronized Planet Orbit** - All planets share one orbit with equal 90° spacing
- **Floating Asteroids** - Decorative 3D asteroid models orbiting in the scene
- **Bubble Effects** - Interactive bubbles that rise and pop when avatar is clicked
- **Glowing 3D Stars** - Pulsing stars around the title

### 🌠 Enhanced Cosmic Background
- **Nebula Clouds** - Four colorful animated nebulae (purple, blue, pink, teal)
- **Multi-Layer Star Field** - 200+ stars across 3 layers with varied sizes and colors
- **Shooting Stars** - Periodic meteors streaking across the screen
- **Cosmic Dust Particles** - Tiny floating particles that drift slowly
- **Center Glow** - Pulsing purple/gold glow behind the avatar
- **Glowing Sun** - Mass of light effect in the top-right corner

### 🎵 Interactive Controls
- **Background Music** - Space ambient music with play/pause and volume controls
- **Resume Download** - One-click PDF resume download button
- **Contact Modal** - Beautiful modal with photo, roles, and contact links

### 🎮 Space Shooter Game
- **3-Hit Asteroid Health System** - Asteroids shrink and glow red as damaged
- **Progressive Difficulty** - Speed increases over time
- **Auto-Shooting** - Continuous firing with mouse/touch movement
- **Score System** - Points for hits (5) and destroys (30)

### 📱 Responsive Design
- **Mobile Optimized** - Adjusted sizes, positions, and layouts
- **Small Mobile Support** - Extra adjustments for screens < 380px
- **Touch Controls** - Full touch support for mobile gameplay
- **Adaptive UI** - Different positioning for all screen sizes

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 19** | UI framework with latest features |
| **Three.js r160** | 3D graphics rendering engine |
| **@react-three/fiber** | React renderer for Three.js |
| **@react-three/drei** | Useful helpers for R3F |
| **Vite 7** | Fast build tool and dev server |
| **Orbitron Font** | Space-themed typography |

---

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/samardhh/samardhh-portfolio.git

# Navigate to project directory
cd samardhh-portfolio

# Install dependencies
npm install

# Start development server
npm run dev
```

---

## 🚀 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint for code quality |

---

## 📁 Project Structure

```
samardhh-portfolio/
├── public/
│   ├── models/               # 3D GLB models
│   │   ├── avatar.glb        # 3D avatar model
│   │   └── astr.glb          # Asteroid model
│   ├── audio/
│   │   └── space-ambient.mp3 # Background music
│   ├── resume/
│   │   └── Samardhh_Resume.pdf
│   └── sam.jpeg              # Profile photo
├── src/
│   ├── components/
│   │   ├── SolarSystem.jsx   # Main portfolio component (~2900 lines)
│   │   ├── SpaceGame.jsx     # Asteroid shooter game (~720 lines)
│   │   ├── BackgroundMusic.jsx # Music player controls
│   │   ├── ResumeDownload.jsx  # Resume download button
│   │   ├── ParticlesBackground.jsx
│   │   ├── RocketModel.jsx
│   │   └── CometCursor.jsx
│   ├── assets/
│   ├── App.jsx               # Root component with game state
│   ├── App.css
│   ├── index.css             # Global styles & animations
│   └── main.jsx
├── index.html
├── package.json
├── vite.config.js
└── eslint.config.js
```

---

## 🎯 Component Architecture

### SolarSystem.jsx
The main portfolio component containing:

| Section | Components |
|---------|------------|
| **Constants** | PLANETS array, shared orbit/speed/size settings |
| **Background** | Nebula clouds, star field (3 layers), shooting stars, cosmic dust |
| **Model Loaders** | Singleton pattern for GLB assets (Avatar, Asteroid) |
| **3D Icons** | PersonIcon, BriefcaseIcon, GearIcon, GraduationCapIcon |
| **Avatar** | CenterAvatar with rotation and floating animation |
| **Modals** | SpaceModal with ModalStars, GalacticSpiral, ModalScene |
| **Planet** | Synchronized orbiting planets with labels and icons |
| **Decorative** | FloatingAsteroid, GlowingStar, Bubble, Sun glow |
| **UI Controls** | BackgroundMusic, ResumeDownload, Contact button |

### SpaceGame.jsx
The mini-game component containing:

| Component | Purpose |
|-----------|---------|
| **Spaceship** | Player-controlled ship with smooth movement |
| **Bullet** | Auto-shooting projectiles |
| **Asteroid** | Enemies with 3-hit health system |
| **Explosion** | Destruction effects |
| **GameScene** | Three.js scene with shield layer |

---

## ⚡ Performance Optimizations

- **React.memo** - All components memoized to prevent unnecessary re-renders
- **useCallback/useMemo** - Optimized handlers and computed values
- **Singleton Asset Loading** - GLB models loaded once and cloned for reuse
- **Refs for Animations** - Position/rotation stored in refs to avoid state updates
- **Conditional Rendering** - Components rendered only when needed
- **DPR Limiting** - Canvas device pixel ratio capped at 1.5
- **Passive Event Listeners** - Smooth scrolling and touch handling

---

## 🎮 Controls

| Action | Desktop | Mobile |
|--------|---------|--------|
| Navigate | Click planets | Tap planets |
| Close modal | Click outside / ESC | Tap outside |
| Game Movement | Mouse movement / Arrow keys | Touch drag |
| Shoot | Auto-fire | Auto-fire |

---

## 🎨 Customization

### Modify Planet Content
Edit the `PLANETS` array in `SolarSystem.jsx`:
```javascript
const SHARED_ORBIT_RADIUS = 5  // All planets share this orbit
const SHARED_ORBIT_SPEED = 0.5  // Rotation speed
const SHARED_PLANET_SIZE = 0.7  // Uniform planet size

const PLANETS = [
  {
    id: 'about',
    title: 'About',
    color: '#5a9fd4',
    orbitRadius: SHARED_ORBIT_RADIUS,
    orbitSpeed: SHARED_ORBIT_SPEED,
    size: SHARED_PLANET_SIZE,
    fullContent: {
      heading: 'About Me',
      description: 'Full description...',
      highlights: ['Skill 1', 'Skill 2'],
      whatIDo: { design: [...], development: [...] },
      philosophy: [...]
    }
  },
  // ... more planets (Experience, Skills, Education)
]
```

### Adjust Avatar Size
```javascript
const avatarScale = useMemo(() => {
  if (isSmallMobile) return 2.0
  if (isMobile) return 2.4
  return 3.2
}, [isMobile, isSmallMobile])
```

---

## 📱 Responsive Breakpoints

```javascript
// Mobile detection
const isMobile = window.innerWidth < 768
const isSmallMobile = window.innerWidth < 400

// Orbit adjustments
const adjustedOrbit = isMobile ? planet.orbitRadius * 0.55 : planet.orbitRadius

// Size adjustments
const adjustedSize = isMobile ? planet.size * 0.9 : planet.size
```

---

## 🔧 Key Implementation Details

### Synchronized Planet Orbits
```javascript
// Shared time reference for synchronized orbit
const sharedOrbitTime = { current: 0 }

// Equal spacing: 0°, 90°, 180°, 270°
const angleOffset = (planetIndex * Math.PI * 2) / 4

// All planets update from same time reference
const currentAngle = sharedOrbitTime.current + angleOffset
groupRef.current.position.x = Math.cos(currentAngle) * adjustedOrbit
groupRef.current.position.z = Math.sin(currentAngle) * adjustedOrbit
```

### Enhanced Background Layers
```javascript
// Nebula clouds with floating animation
<div style={{
  background: 'radial-gradient(ellipse, rgba(138,43,226,0.15), transparent)',
  filter: 'blur(60px)',
  animation: 'nebulaFloat1 25s ease-in-out infinite'
}} />

// Multi-layer stars with varied colors and twinkle
['#ffffff', '#b8d4ff', '#ffd4ff', '#ffffd4', '#d4ffff']

// Shooting stars with streak effect
animation: 'shootingStar 8-20s linear infinite'
```

### Avatar Animation
```javascript
// Rotation and floating
groupRef.current.rotation.y += hovered ? 0.02 : 0.008
const floatOffset = Math.sin(elapsedTime * 0.5) * 0.1
```

---

## 📄 License

MIT License - feel free to use this for your own portfolio!

---

## 👤 Author

**Samardhh Reddy** - Product Designer • UX Designer • Frontend Developer • Full Stack Developer

- 📧 Email: padalasamardhhreddy@gmail.com
- 📱 Phone: +91 9652074072
- 💼 LinkedIn: [linkedin.com/in/samardhh](https://www.linkedin.com/in/samardhh/)
- 📍 Location: Hyderabad, India

---

*Built with ❤️ using React Three Fiber*
