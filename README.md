# 🚀 Samardhh Portfolio - Interactive 3D Solar System

An interactive 3D portfolio website with a space/solar system theme, featuring animated planets, floating elements, and a built-in Space Shooter mini-game.

![React](https://img.shields.io/badge/React-19.2.0-61DAFB?logo=react)
![Three.js](https://img.shields.io/badge/Three.js-0.160.0-000000?logo=three.js)
![Vite](https://img.shields.io/badge/Vite-7.2.4-646CFF?logo=vite)

---

## ✨ Features

### 🌌 Solar System Portfolio
- **Interactive 3D Planets** - Click on orbiting planets to learn about different sections:
  - 🌍 **About** - Personal introduction and highlights
  - 🔴 **Experience** - Professional work history
  - 🪐 **Skills** - Technical skills and tools
  - 🎓 **Education** - Academic background
- **Glowing Particle Orbit Rings** - Beautiful animated orbit lines made of glowing particle dots
- **Animated 3D Sun** - Central sun with HTML overlay and glow effects
- **Floating Asteroids** - Decorative 3D asteroid models orbiting in the scene
- **Corner Galaxies** - 3D galaxy models in top corners
- **Alien Spaceships** - Animated UFOs with blinking eyes on both sides
- **Bubble Effects** - Interactive bubbles that rise and pop with animation
- **Glowing 3D Stars** - Pulsing stars around the title
- **Animated Hint Text** - Pulsing text with dashed border guiding users

### 🎮 Space Shooter Game
- **3-Hit Asteroid Health System** - Asteroids require 3 hits to destroy, shrinking and glowing red as they take damage
- **Protective Shield Layer** - Visual shield barrier at Y=3 that asteroids must pass
- **Progressive Difficulty** - Spawn rate and asteroid speed increase over time
- **Auto-Shooting** - Continuous firing with mouse/touch movement controls
- **Realistic Asteroid Colors** - 8 different color palettes for variety
- **Explosion Effects** - Visual feedback when asteroids are destroyed
- **Score System** - Points for hits (5) and destroys (30)
- **Immediate Asteroid Spawn** - 3 asteroids spawn immediately when game starts/restarts

### 📱 Responsive Design
- **Mobile Optimized** - Adjusted planet sizes, orbit radii, and UI elements
- **Small Mobile Support** - Extra adjustments for very small screens
- **Touch Controls** - Full touch support for mobile gameplay
- **Adaptive Layouts** - Different positioning for small mobile, mobile, and desktop

### 🎨 Visual Effects
- **Comet Cursor** - Custom animated cursor that follows mouse movement with particle trail
- **Particle Background** - Floating particles in the background
- **3D Rocket Model** - Animated rocket with exhaust flames
- **Glow Effects** - Extensive use of CSS shadows and Three.js lights
- **Smooth Animations** - React Three Fiber animation loops
- **3D Modal Icons** - Custom 3D icons for each planet section (Person, Briefcase, Gear, Graduation Cap)

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
│   └── models/               # 3D GLB models
│       ├── avatar.glb        # 3D avatar model
│       ├── astr.glb          # Asteroid model
│       └── galaxy.glb        # Galaxy model
├── src/
│   ├── components/
│   │   ├── SolarSystem.jsx   # Main portfolio component (~2500 lines)
│   │   ├── SpaceGame.jsx     # Asteroid shooter game (~720 lines)
│   │   ├── ParticlesBackground.jsx
│   │   ├── RocketModel.jsx
│   │   └── CometCursor.jsx
│   ├── assets/
│   ├── App.jsx               # Root component with game state
│   ├── App.css
│   ├── index.css
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
| **Data Constants** | PLANETS array with content definitions |
| **Model Loaders** | Singleton pattern for GLB assets (Avatar, Asteroid, Galaxy) |
| **3D Icons** | PersonIcon, BriefcaseIcon, GearIcon, GraduationCapIcon |
| **Avatar** | AvatarModel, ContactAvatar with rotation towards hovered buttons |
| **Modals** | SpaceModal with ModalStars, GalacticSpiral, ModalScene |
| **Planet** | Orbiting planets with labels and glow effects |
| **OrbitRing** | Particle-based glowing orbit lines (55-70 dots per ring) |
| **Title3D** | 3D extruded "SAMARDHH" text |
| **Decorative** | AlienSpaceship, CornerGalaxy, FloatingAsteroid, GlowingStar, Bubble |

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
const PLANETS = [
  {
    id: 'about',
    title: 'About',
    color: '#5a9fd4',
    orbitRadius: 3,
    orbitSpeed: 0.5,
    size: 0.7,
    content: 'Short description',
    fullContent: {
      heading: 'About Me',
      description: 'Full description...',
      highlights: ['Skill 1', 'Skill 2']
    }
  },
  // ... more planets
]
```

### Adjust Game Difficulty
In `SpaceGame.jsx`:
```javascript
// Speed settings
const baseSpeed = 0.012 + Math.min(gameTime * 0.0003, 0.015)
const speedVariation = 0.008 + Math.min(gameTime * 0.0002, 0.007)

// Spawn interval (decreases over time)
const spawnInterval = Math.max(1500 - gameTime * 30, 600)

// Asteroid health
health: 3  // Hits required to destroy
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

### Orbit Ring Particles
```javascript
// Generate glowing dot positions along orbit
const dotCount = Math.floor(55 + radius * 2.5)
for (let i = 0; i < dotCount; i++) {
  const angle = (i / dotCount) * Math.PI * 2
  positions.push(
    Math.cos(angle) * radius,
    0,
    Math.sin(angle) * radius
  )
}
```

### Asteroid Health System
```javascript
// Visual feedback based on health
const scale = 0.7 + (health / 3) * 0.3  // Shrinks as damaged
emissive={health < 3 ? '#ff4444' : asteroidColor.emissive}  // Red glow when hurt
```

### Avatar Direction Following
```javascript
// Turn avatar towards hovered button
if (direction === 'left') {
  targetRotation.current = -0.8  // Face contact button
} else if (direction === 'right') {
  targetRotation.current = 0.8   // Face game button
}
```

---

## 📄 License

MIT License - feel free to use this for your own portfolio!

---

## 👤 Author

**Samardhh Reddy** - Product Designer & UI/UX Designer

- 📧 Email: padalasamardhhreddy@gmail.com
- 💼 LinkedIn: [linkedin.com/in/samardhh](https://www.linkedin.com/in/samardhh/)
- 📍 Location: Hyderabad, India

---

*Built with ❤️ using React Three Fiber*
