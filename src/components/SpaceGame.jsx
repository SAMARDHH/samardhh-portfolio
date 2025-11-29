import { memo, useRef, useEffect, useState, useCallback } from 'react'
import { Canvas, useFrame} from '@react-three/fiber'


// Spaceship component
const Spaceship = memo(function Spaceship({ position}) {
  const meshRef = useRef()
  
  useFrame(() => {
    if (meshRef.current) {
      // Smooth movement to target position
      meshRef.current.position.x += (position - meshRef.current.position.x) * 0.15
    }
  })

  return (
    <group ref={meshRef} position={[0, -3.5, 0]}>
      {/* Spaceship body */}
      <mesh rotation={[0, 0, 0]}>
        <coneGeometry args={[0.3, 0.8, 8]} />
        <meshStandardMaterial color="#4488ff" metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Cockpit */}
      <mesh position={[0, 0.1, 0]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color="#88ccff" metalness={0.5} roughness={0.3} transparent opacity={0.8} />
      </mesh>
      
      {/* Left wing */}
      <mesh position={[-0.35, -0.2, 0]} rotation={[0, 0, -0.5]}>
        <boxGeometry args={[0.4, 0.08, 0.2]} />
        <meshStandardMaterial color="#3366cc" metalness={0.7} roughness={0.3} />
      </mesh>
      
      {/* Right wing */}
      <mesh position={[0.35, -0.2, 0]} rotation={[0, 0, 0.5]}>
        <boxGeometry args={[0.4, 0.08, 0.2]} />
        <meshStandardMaterial color="#3366cc" metalness={0.7} roughness={0.3} />
      </mesh>
      
      {/* Engine glow */}
      <mesh position={[0, -0.45, 0]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshBasicMaterial color="#ff6600" />
      </mesh>
      <pointLight position={[0, -0.5, 0]} intensity={2} color="#ff6600" distance={3} />
    </group>
  )
})

// Bullet component
const Bullet = memo(function Bullet({ id, startPosition, onRemove, onUpdatePosition }) {
  const meshRef = useRef()
  const positionRef = useRef({ x: startPosition.x, y: startPosition.y })

  useFrame(() => {
    if (meshRef.current) {
      positionRef.current.y += 0.3
      meshRef.current.position.y = positionRef.current.y
      
      // Update position for collision detection
      onUpdatePosition(id, positionRef.current.x, positionRef.current.y)
      
      // Remove if off screen
      if (positionRef.current.y > 6) {
        onRemove(id)
      }
    }
  })

  return (
    <mesh ref={meshRef} position={[startPosition.x, startPosition.y, 0]}>
      <sphereGeometry args={[0.08, 8, 8]} />
      <meshBasicMaterial color="#00ffff" />
      <pointLight intensity={1} color="#00ffff" distance={2} />
    </mesh>
  )
})

// Realistic asteroid color palettes
const ASTEROID_COLORS = [
  { color: '#8B7355', emissive: '#5C4A3D' }, // Brown rocky
  { color: '#A0826D', emissive: '#6B5344' }, // Tan/beige
  { color: '#6B6B6B', emissive: '#4A4A4A' }, // Gray metallic
  { color: '#8B8682', emissive: '#5C5854' }, // Silver-gray
  { color: '#CD853F', emissive: '#8B5A2B' }, // Copper/rust
  { color: '#B8860B', emissive: '#8B6914' }, // Golden brown
  { color: '#A0522D', emissive: '#6B3A1E' }, // Sienna
  { color: '#808080', emissive: '#555555' }, // Charcoal
]

// Pre-generate star positions at module level (only runs once)
const STAR_POSITIONS = Array.from({ length: 100 }, (_, i) => {
  // Use deterministic pseudo-random based on index
  const seed1 = Math.sin(i * 12.9898) * 43758.5453
  const seed2 = Math.sin(i * 78.233) * 43758.5453
  return [
    (seed1 - Math.floor(seed1) - 0.5) * 20,
    (seed2 - Math.floor(seed2) - 0.5) * 20,
    -5
  ]
})

// Asteroid component
const Asteroid = memo(function Asteroid({ id, startX, speed, colorIndex, health, onHit, onGameOver, bulletsRef, shipPosRef }) {
  const groupRef = useRef()
  const positionRef = useRef({ x: startX, y: 5 })
  const rotationRef = useRef({ x: 0, y: 0, z: 0 })
  const hitCooldownRef = useRef(false)
  
  // Get random color based on id
  const asteroidColor = ASTEROID_COLORS[colorIndex % ASTEROID_COLORS.length]
  
  // Calculate size based on health (shrinks as it takes damage)
  const scale = 0.7 + (health / 3) * 0.3

  useFrame(() => {
    if (groupRef.current) {
      // Move down
      positionRef.current.y -= speed
      groupRef.current.position.y = positionRef.current.y
      groupRef.current.position.x = positionRef.current.x
      
      // Rotate
      rotationRef.current.x += 0.02
      rotationRef.current.y += 0.03
      groupRef.current.rotation.x = rotationRef.current.x
      groupRef.current.rotation.y = rotationRef.current.y
      
      // Check collision with bullets - only if bullets array has items and not in cooldown
      // PROTECTIVE LAYER: Only check collision if asteroid is below Y=3 (past the shield)
      if (!hitCooldownRef.current && positionRef.current.y < 3) {
        const bullets = bulletsRef.current
        if (bullets && bullets.length > 0) {
          for (let i = 0; i < bullets.length; i++) {
            const bullet = bullets[i]
            // Only check if bullet is in valid Y range (between asteroid and ship)
            if (bullet && bullet.y > -3 && bullet.y < 6) {
              const dx = Math.abs(positionRef.current.x - bullet.x)
              const dy = Math.abs(positionRef.current.y - bullet.y)
              if (dx < 0.5 && dy < 0.5) {
                hitCooldownRef.current = true
                setTimeout(() => { hitCooldownRef.current = false }, 100)
                onHit(id, bullet.id, positionRef.current.x, positionRef.current.y)
                return
              }
            }
          }
        }
      }
      
      // Check collision with spaceship (at y = -3.5)
      const shipX = shipPosRef.current
      const shipY = -3.5
      const dxShip = Math.abs(positionRef.current.x - shipX)
      const dyShip = Math.abs(positionRef.current.y - shipY)
      if (dxShip < 0.5 && dyShip < 0.5) {
        onGameOver(positionRef.current.x, positionRef.current.y)
        return
      }
      
      // Game over if asteroid passes the spaceship
      if (positionRef.current.y < -4.5) {
        onGameOver(positionRef.current.x, positionRef.current.y)
        return
      }
    }
  })

  return (
    <group ref={groupRef} position={[startX, 5, 0]} scale={scale}>
      {/* Realistic asteroid with random color */}
      <mesh>
        <dodecahedronGeometry args={[0.4, 1]} />
        <meshStandardMaterial 
          color={asteroidColor.color} 
          emissive={health < 3 ? '#ff4444' : asteroidColor.emissive} 
          emissiveIntensity={health < 3 ? 0.8 : 0.6}
          roughness={0.7}
          metalness={0.3}
        />
      </mesh>
      {/* Light to illuminate asteroid */}
      <pointLight intensity={2} color="#ffffff" distance={3} />
    </group>
  )
})

// Explosion effect
const Explosion = memo(function Explosion({ position, onComplete }) {
  const meshRef = useRef()
  const scaleRef = useRef(0.1)
  const opacityRef = useRef(1)

  useFrame(() => {
    if (meshRef.current) {
      scaleRef.current += 0.15
      opacityRef.current -= 0.05
      meshRef.current.scale.setScalar(scaleRef.current)
      meshRef.current.material.opacity = Math.max(0, opacityRef.current)
      
      if (opacityRef.current <= 0) {
        onComplete()
      }
    }
  })

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.5, 16, 16]} />
      <meshBasicMaterial color="#ff6600" transparent opacity={1} />
      <pointLight intensity={5} color="#ff6600" distance={5} />
    </mesh>
  )
})

// Game Scene
const GameScene = memo(function GameScene({ 
  shipPosition, 
  bullets, 
  asteroids, 
  explosions,
  onBulletRemove,
  onBulletUpdatePosition,
  onAsteroidHit,
  onExplosionComplete,
  onGameOver,
  bulletsRef,
  shipPosRef,
  gameOver
}) {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      
      {/* Stars background */}
      {STAR_POSITIONS.map((position, i) => (
        <mesh 
          key={`star-${i}`} 
          position={position}
        >
          <sphereGeometry args={[0.02, 4, 4]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      ))}
      
      {/* Protective Shield Layer at Y=3 */}
      <mesh position={[0, 3, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[12, 0.15]} />
        <meshBasicMaterial 
          color="#00ffff" 
          transparent 
          opacity={0.4}
        />
      </mesh>
      {/* Shield glow effects */}
      <mesh position={[0, 3, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[12, 0.4]} />
        <meshBasicMaterial 
          color="#00ffff" 
          transparent 
          opacity={0.15}
        />
      </mesh>
      {/* Shield edge markers */}
      <mesh position={[-5.5, 3, 0]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshBasicMaterial color="#00ffff" />
      </mesh>
      <mesh position={[5.5, 3, 0]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshBasicMaterial color="#00ffff" />
      </mesh>
      
      {!gameOver && <Spaceship position={shipPosition} />}
      
      {bullets.map(bullet => (
        <Bullet
          key={bullet.id}
          id={bullet.id}
          startPosition={{ x: bullet.x, y: bullet.y }}
          onRemove={onBulletRemove}
          onUpdatePosition={onBulletUpdatePosition}
        />
      ))}
      
      {asteroids.map(asteroid => (
        <Asteroid
          key={asteroid.id}
          id={asteroid.id}
          startX={asteroid.x}
          speed={asteroid.speed}
          colorIndex={asteroid.colorIndex}
          health={asteroid.health}
          onHit={onAsteroidHit}
          onGameOver={onGameOver}
          bulletsRef={bulletsRef}
          shipPosRef={shipPosRef}
        />
      ))}
      
      {explosions.map(exp => (
        <Explosion
          key={exp.id}
          position={[exp.x, exp.y, 0]}
          onComplete={() => onExplosionComplete(exp.id)}
        />
      ))}
    </>
  )
})

// Main Game Component
const SpaceGame = memo(function SpaceGame({ onBack }) {
  const [shipPosition, setShipPosition] = useState(0)
  const [bullets, setBullets] = useState([])
  const [asteroids, setAsteroids] = useState([])
  const [explosions, setExplosions] = useState([])
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [gameTime, setGameTime] = useState(0) // Track game time in seconds
  
  const bulletIdRef = useRef(0)
  const asteroidIdRef = useRef(0)
  const explosionIdRef = useRef(0)
  const bulletsRef = useRef([])
  const shipPosRef = useRef(0)

  // Define shoot function first so it can be used in effects
  const shoot = useCallback(() => {
    const newBullet = {
      id: bulletIdRef.current++,
      x: shipPosRef.current,
      y: -3,
    }
    setBullets(prev => [...prev, newBullet])
  }, [])

  // Check mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Keyboard controls
  useEffect(() => {
    if (!gameStarted || gameOver) return

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') {
        shipPosRef.current = Math.max(-4, shipPosRef.current - 0.5)
        setShipPosition(shipPosRef.current)
      } else if (e.key === 'ArrowRight' || e.key === 'd') {
        shipPosRef.current = Math.min(4, shipPosRef.current + 0.5)
        setShipPosition(shipPosRef.current)
      } else if (e.key === ' ') {
        e.preventDefault()
        shoot()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [gameStarted, gameOver, shoot])

  // Touch/mouse controls for mobile
  useEffect(() => {
    if (!gameStarted || gameOver) return

    const handleMove = (clientX) => {
      const centerX = window.innerWidth / 2
      const offset = (clientX - centerX) / (window.innerWidth / 8)
      shipPosRef.current = Math.max(-4, Math.min(4, offset))
      setShipPosition(shipPosRef.current)
    }

    const handleMouseMove = (e) => handleMove(e.clientX)
    const handleTouchMove = (e) => {
      if (e.touches.length > 0) {
        handleMove(e.touches[0].clientX)
      }
    }

    // Mouse controls for desktop
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    // Touch controls for mobile
    window.addEventListener('touchmove', handleTouchMove, { passive: true })

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('touchmove', handleTouchMove)
    }
  }, [gameStarted, gameOver])

  // Spawn asteroids
  // Game timer - increases difficulty over time
  useEffect(() => {
    if (!gameStarted || gameOver) return

    const timer = setInterval(() => {
      setGameTime(prev => prev + 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [gameStarted, gameOver])

  // Spawn asteroids - spawn rate and speed increase with time
  useEffect(() => {
    if (!gameStarted || gameOver) return

    // Calculate difficulty based on game time
    // Speed increases from 0.012 to max 0.035 over time
    const baseSpeed = 0.012 + Math.min(gameTime * 0.0003, 0.015)
    const speedVariation = 0.008 + Math.min(gameTime * 0.0002, 0.007)
    
    // Spawn interval decreases from 1500ms to min 600ms over time
    const spawnInterval = Math.max(1500 - gameTime * 30, 600)

    const interval = setInterval(() => {
      const newAsteroid = {
        id: asteroidIdRef.current++,
        x: (Math.random() - 0.5) * 8,
        speed: baseSpeed + Math.random() * speedVariation,
        colorIndex: Math.floor(Math.random() * 8),
        health: 3,
      }
      setAsteroids(prev => [...prev, newAsteroid])
    }, spawnInterval)

    return () => clearInterval(interval)
  }, [gameStarted, gameOver, gameTime])

  // Auto-shoot for all (mouse and touch)
  useEffect(() => {
    if (!gameStarted || gameOver) return

    const interval = setInterval(() => {
      shoot()
    }, 250)

    return () => clearInterval(interval)
  }, [gameStarted, gameOver, shoot])

  const handleBulletRemove = useCallback((id) => {
    setBullets(prev => prev.filter(b => b.id !== id))
    // Also remove from bulletsRef
    bulletsRef.current = bulletsRef.current.filter(b => b.id !== id)
  }, [])

  const handleBulletUpdatePosition = useCallback((id, x, y) => {
    // Update bullet position in ref for collision detection
    const bullet = bulletsRef.current.find(b => b.id === id)
    if (bullet) {
      bullet.x = x
      bullet.y = y
    } else {
      bulletsRef.current.push({ id, x, y })
    }
  }, [])

  const handleAsteroidHit = useCallback((asteroidId, bulletId, hitX, hitY) => {
    setAsteroids(prev => {
      return prev.map(asteroid => {
        if (asteroid.id === asteroidId) {
          const newHealth = asteroid.health - 1
          if (newHealth <= 0) {
            // Asteroid destroyed
            setExplosions(exp => [...exp, {
              id: explosionIdRef.current++,
              x: hitX || asteroid.x,
              y: hitY || 0,
            }])
            setScore(s => s + 30) // More points for destroying
            return null // Mark for removal
          } else {
            // Asteroid damaged but not destroyed
            setScore(s => s + 5) // Small points for hit
            return { ...asteroid, health: newHealth }
          }
        }
        return asteroid
      }).filter(a => a !== null) // Remove destroyed asteroids
    })
    setBullets(prev => prev.filter(b => b.id !== bulletId))
    bulletsRef.current = bulletsRef.current.filter(b => b.id !== bulletId)
  }, [])

  const handleExplosionComplete = useCallback((id) => {
    setExplosions(prev => prev.filter(e => e.id !== id))
  }, [])

  const handleGameOver = useCallback((x, y) => {
    // Create explosion at ship position
    setExplosions(exp => [...exp, {
      id: explosionIdRef.current++,
      x: x,
      y: y,
    }])
    setGameOver(true)
    setAsteroids([])
    setBullets([])
    bulletsRef.current = []
  }, [])

  const startGame = () => {
    // Spawn 3 asteroids immediately at different positions
    const initialAsteroids = []
    for (let i = 0; i < 3; i++) {
      initialAsteroids.push({
        id: asteroidIdRef.current++,
        x: (Math.random() - 0.5) * 8,
        speed: 0.012 + Math.random() * 0.008,
        colorIndex: Math.floor(Math.random() * 8),
        health: 3,
      })
    }
    
    setGameStarted(true)
    setGameOver(false)
    setScore(0)
    setGameTime(0)
    setBullets([])
    setAsteroids(initialAsteroids)
    setExplosions([])
    bulletsRef.current = []
    shipPosRef.current = 0
    setShipPosition(0)
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: '#000',
      zIndex: 100,
    }}>
      {/* Score */}
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        color: '#fff',
        fontSize: isMobile ? '20px' : '28px',
        fontFamily: '"Orbitron", sans-serif',
        fontWeight: 'bold',
        textShadow: '0 0 10px rgba(0, 255, 255, 0.8)',
        zIndex: 110,
      }}>
        SCORE: {score}
      </div>

      {/* Controls hint */}
      {gameStarted && !gameOver && (
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          color: 'rgba(255, 255, 255, 0.5)',
          fontSize: isMobile ? '12px' : '14px',
          fontFamily: 'sans-serif',
          zIndex: 110,
        }}>
          Move mouse or drag to control • Auto-shooting
        </div>
      )}

      {/* Start/Game Over screen */}
      {(!gameStarted || gameOver) && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          zIndex: 110,
        }}>
          <h1 style={{
            color: '#fff',
            fontSize: isMobile ? '32px' : '48px',
            fontFamily: '"Orbitron", sans-serif',
            textShadow: gameOver 
              ? '0 0 20px rgba(255, 0, 0, 0.8)' 
              : '0 0 20px rgba(255, 102, 0, 0.8)',
            marginBottom: '20px',
          }}>
            {gameOver ? 'GAME OVER' : 'SPACE SHOOTER'}
          </h1>
          {gameOver && (
            <div style={{
              color: '#fff',
              fontSize: isMobile ? '24px' : '36px',
              fontFamily: '"Orbitron", sans-serif',
              textShadow: '0 0 15px rgba(0, 255, 255, 0.8)',
              marginBottom: '30px',
            }}>
              FINAL SCORE: {score}
            </div>
          )}
          <button
            onClick={startGame}
            style={{
              padding: '15px 40px',
              fontSize: '20px',
              fontFamily: '"Orbitron", sans-serif',
              background: gameOver 
                ? 'linear-gradient(135deg, #00ccff, #0066ff)' 
                : 'linear-gradient(135deg, #ff6600, #ff9900)',
              border: 'none',
              borderRadius: '30px',
              color: '#fff',
              cursor: 'pointer',
              boxShadow: gameOver 
                ? '0 0 30px rgba(0, 204, 255, 0.6)' 
                : '0 0 30px rgba(255, 102, 0, 0.6)',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'scale(1.1)'
              e.target.style.boxShadow = gameOver 
                ? '0 0 50px rgba(0, 204, 255, 0.8)' 
                : '0 0 50px rgba(255, 102, 0, 0.8)'
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'scale(1)'
              e.target.style.boxShadow = gameOver 
                ? '0 0 30px rgba(0, 204, 255, 0.6)' 
                : '0 0 30px rgba(255, 102, 0, 0.6)'
            }}
          >
            {gameOver ? 'PLAY AGAIN' : 'START GAME'}
          </button>
        </div>
      )}

      {/* Back button */}
      <button
        onClick={onBack}
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          padding: '10px 20px',
          fontSize: '14px',
          fontFamily: '"Orbitron", sans-serif',
          background: 'rgba(255, 255, 255, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          borderRadius: '20px',
          color: '#fff',
          cursor: 'pointer',
          zIndex: 110,
        }}
      >
        ← BACK
      </button>

      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true }}
      >
        <GameScene
          shipPosition={shipPosition}
          bullets={bullets}
          asteroids={asteroids}
          explosions={explosions}
          onBulletRemove={handleBulletRemove}
          onBulletUpdatePosition={handleBulletUpdatePosition}
          onAsteroidHit={handleAsteroidHit}
          onExplosionComplete={handleExplosionComplete}
          onGameOver={handleGameOver}
          shipPosRef={shipPosRef}
          gameOver={gameOver}
          bulletsRef={bulletsRef}
        />
      </Canvas>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&display=swap');
      `}</style>
    </div>
  )
})

export default SpaceGame
