/**
 * SolarSystem Portfolio Component
 * A 3D interactive portfolio with a solar system theme
 * 
 * Structure:
 * 1. Imports & Constants
 * 2. Utility Functions
 * 3. 3D Icon Components (PersonIcon, BriefcaseIcon, GearIcon)
 * 4. Avatar Components (AvatarModel, ContactAvatar)
 * 5. Modal Components (ModalStars, GalacticSpiral, ModalScene, SpaceModal)
 * 6. Planet Components (Planet, OrbitRing)
 * 7. Title Components (Title3D)
 * 8. Main Components (Sun, Scene, SolarSystem)
 */

import { memo, useRef, useEffect, useState, useMemo, useCallback, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import * as THREE from 'three'
import BackgroundMusic from './BackgroundMusic'
import ResumeDownload from './ResumeDownload'

// ============================================
// CONSTANTS & DATA
// ============================================

// Planet data with realistic planet colors and detailed content
const SHARED_ORBIT_RADIUS = 5  // All planets share this orbit
const SHARED_ORBIT_SPEED = 0.5  // All planets move at same speed (increased)
const SHARED_PLANET_SIZE = 0.7  // All planets same size

const PLANETS = [
  { 
    id: 'about', 
    title: 'About', 
    color: '#5a9fd4',  // Earth-like blue
    orbitRadius: SHARED_ORBIT_RADIUS,
    orbitSpeed: SHARED_ORBIT_SPEED,
    selfRotation: 0.01,
    size: 0.7,
    startAngle: 0,  // 0 degrees
    content: 'Full Stack Developer & UI/UX Designer with 5+ years experience',
    fullContent: {
      heading: 'About Me',
      description: `I'm Samardhh, a Full Stack Developer and UI/UX Designer with 5+ years of experience building high-performance, user-centric digital products across enterprise, SaaS, and startup environments.

I uniquely blend product design, frontend engineering, and backend development—allowing me to design intuitive experiences and build them end-to-end with scalable, production-ready code.

My work focuses on delivering clean UI, smooth interactions, strong architecture, and measurable impact on business and user experience.`,
      highlights: ['Product Thinking', 'UI/UX Design', 'Full Stack Development', 'Reusable Component Systems', 'Scalable Architecture Design', 'Real-Time Application Development', 'Strong Debugging & Problem Solving'],
      whatIDo: {
        design: ['User Research & Requirement Analysis', 'Wireframes, Low-Fi & High-Fi UI', 'Design Systems & Component Libraries', 'Interaction & Motion Design', 'Prototyping (Figma, FigJam)', 'Usability Testing', 'Information Architecture'],
        development: ['React.js, Next.js, TypeScript', 'Node.js, Express, REST APIs', 'Microfrontends & Scalable Architecture', 'PostgreSQL, MongoDB', 'Performance Optimization', 'Unit Testing, CI/CD', 'Swagger, Postman, Git']
      },
      philosophy: [
        'Design with purpose → every screen should reduce user effort',
        'Code with clarity → scalable, reusable, maintainable architecture',
        'Consistency is power → strong UI patterns make products intuitive',
        'Performance matters → optimize for speed and smooth UX',
        'End-to-end ownership → design it, build it, improve it'
      ]
    }
  },
  { 
    id: 'experience', 
    title: 'Experience', 
    color: '#c1440e',  // Mars-like rust red
    orbitRadius: SHARED_ORBIT_RADIUS,
    orbitSpeed: SHARED_ORBIT_SPEED,
    selfRotation: 0.015,
    size: 0.75,
    startAngle: Math.PI / 2,  // 90 degrees
    content: '5+ years of Full Stack Development & UI/UX Design',
    fullContent: {
      heading: 'Experience',
      description: `With over 5 years of professional experience, I've worked across product design, UI/UX, and full stack development — from enterprise platforms to consumer applications.`,
      experiences: [
        { 
          role: 'Engineer III – Full Stack Developer + UI/UX', 
          company: 'Verizon – Event Manager Platform', 
          period: '2023 - Present', 
          desc: 'Improved UI performance by 35%, reduced duplicate components by 40%, enhanced real-time reliability for alert monitoring.',
          designWork: ['Designed dashboard layouts, user flows, and microfrontend navigation', 'Created reusable design components for consistent UI', 'Simplified large data-heavy screens into cleaner, digestible interactions'],
          devWork: ['Built the React.js frontend architecture', 'Developed Node.js microservices with PostgreSQL', 'Implemented WebSockets for real-time event updates', 'Standardized API documentation using Swagger']
        },
        { 
          role: 'UI/UX + Frontend Developer', 
          company: 'Lemnisk – CDP Marketing Dashboard', 
          period: '2022 - 2023', 
          desc: 'Designed analytics dashboards and visualizations. Improved workflow clarity for marketing teams.',
          designWork: ['Designed analytics dashboards and visualizations', 'Improved workflow clarity for marketing teams', 'Established UI consistency across modules'],
          devWork: ['Developed scalable React pages and shared components', 'Integrated APIs to deliver real-time marketing insights']
        },
        { 
          role: 'Sole UI/UX Designer + Frontend Developer', 
          company: 'WeDigit – End-to-End Product Ownership', 
          period: '2021 - 2022', 
          desc: 'Designed entire product flows from scratch (wireframes → final UI). Delivered pixel-perfect, responsive React UIs.',
          designWork: ['Designed entire product flows from scratch', 'Built reusable component systems', 'Ensured strong UX across devices'],
          devWork: ['Delivered pixel-perfect, responsive React UIs', 'Built reusable component systems']
        },
        { 
          role: 'Full Stack Developer + UX Improvements', 
          company: 'Savvas Learning – EdTech Platform', 
          period: '2020 - 2021', 
          desc: 'Enhanced UX for assessments and navigation. Resolved user pain points through research-driven debugging.',
          designWork: ['Enhanced UX for assessments and navigation', 'Resolved user pain points through research-driven debugging'],
          devWork: ['Contributed to both backend (Node.js) and frontend (React) modules']
        }
      ]
    }
  },
  { 
    id: 'skills', 
    title: 'Skills', 
    color: '#d4a574',  // Saturn-like beige/tan
    orbitRadius: SHARED_ORBIT_RADIUS,
    orbitSpeed: SHARED_ORBIT_SPEED,
    selfRotation: 0.012,
    size: 0.7,
    startAngle: Math.PI,  // 180 degrees
    content: 'Full Stack Development, UI/UX Design, React, Node.js',
    fullContent: {
      heading: 'Tech & Design Stack',
      description: `I combine strong design skills with full stack technical expertise, enabling me to bridge the gap between design and development seamlessly.`,
      skillCategories: [
        { category: 'Design Tools', skills: ['Figma', 'FigJam', 'Adobe XD', 'Miro', 'User Flows', 'Personas', 'Prototypes', 'Journey Maps'] },
        { category: 'Frontend', skills: ['React.js', 'Next.js', 'JavaScript (ES6+)', 'TypeScript', 'Redux', 'Context API', 'React Query', 'Tailwind CSS', 'Material UI', 'Ant Design'] },
        { category: 'Backend', skills: ['Node.js', 'Express.js', 'REST APIs', 'Swagger', 'PostgreSQL', 'MongoDB'] },
        { category: 'Other Tools', skills: ['Docker', 'Postman', 'GitHub', 'Bitbucket', 'Jira', 'Confluence', 'CI/CD (Jenkins, GitHub Actions)'] }
      ],
      coreStrengths: ['Product Thinking', 'UI/UX Design', 'Full Stack Development', 'Reusable Component Systems', 'Scalable Architecture Design', 'Real-Time Application Development', 'Collaboration with PM, SRE, UX, and Backend Teams', 'Strong Debugging & Problem Solving']
    }
  },
  { 
    id: 'education', 
    title: 'Education', 
    color: '#7b68ee',  // Purple/violet - knowledge color
    orbitRadius: SHARED_ORBIT_RADIUS,
    orbitSpeed: SHARED_ORBIT_SPEED,
    selfRotation: 0.008,
    size: 0.65,
    startAngle: Math.PI * 1.5,  // 270 degrees
    content: 'B.Tech – Computer Science, GITAM University',
    fullContent: {
      heading: 'Education',
      description: `My academic foundation in technology has been instrumental in shaping my approach to design and development.`,
      education: [
        {
          degree: 'B.Tech – Computer Science',
          institution: 'GITAM University',
          year: '2015 - 2019',
          cgpa: '8.5',
          desc: 'Graduated with a strong foundation in Computer Science and Engineering. Developed analytical thinking and problem-solving skills that I apply to design challenges today.'
        }
      ]
    }
  },
]

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Seeded random for consistent procedural generation
function seededRandom(seed) {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

// ============================================
// AVATAR LOADING (Singleton Pattern)
// ============================================

let cachedAvatar = null
let avatarLoading = false
const avatarCallbacks = []

function loadAvatar(callback) {
  if (cachedAvatar) {
    callback(cachedAvatar.clone())
    return
  }
  avatarCallbacks.push(callback)
  if (!avatarLoading) {
    avatarLoading = true
    const loader = new GLTFLoader()
    loader.load(
      '/models/avatar.glb',
      (gltf) => {
        cachedAvatar = gltf.scene
        avatarCallbacks.forEach(cb => cb(cachedAvatar.clone()))
        avatarCallbacks.length = 0
      },
      undefined,
      (err) => console.error('Error loading avatar:', err)
    )
  }
}

// ============================================
// ASTEROID LOADING (Singleton Pattern)
// ============================================

let cachedAsteroid = null
let asteroidLoading = false
const asteroidCallbacks = []

function loadAsteroid(callback) {
  if (cachedAsteroid) {
    callback(cachedAsteroid.clone())
    return
  }
  asteroidCallbacks.push(callback)
  if (!asteroidLoading) {
    asteroidLoading = true
    const loader = new GLTFLoader()
    loader.load(
      '/models/astr.glb',
      (gltf) => {
        cachedAsteroid = gltf.scene
        asteroidCallbacks.forEach(cb => cb(cachedAsteroid.clone()))
        asteroidCallbacks.length = 0
      },
      undefined,
      (err) => console.error('Error loading asteroid:', err)
    )
  }
}

// ============================================
// SUN COMPONENT
// ============================================

// ============================================
// CENTER AVATAR COMPONENT (replaces Sun)
// ============================================
const CenterAvatar = memo(function CenterAvatar({ onAvatarClick, isMobile, isSmallMobile }) {
  const groupRef = useRef()
  const modelRef = useRef()
  const [model, setModel] = useState(null)
  const [hovered, setHovered] = useState(false)
  const [clicked, setClicked] = useState(false)
  
  // Responsive avatar scale (increased)
  const avatarScale = useMemo(() => {
    if (isSmallMobile) return 2.0
    if (isMobile) return 2.4
    return 3.2
  }, [isMobile, isSmallMobile])

  useEffect(() => {
    loadAvatar((m) => {
      m.scale.set(avatarScale, avatarScale, avatarScale)
      m.position.set(0, 0, 0)
      modelRef.current = m
      setModel(m)
    })
  }, [avatarScale])

  useFrame((state) => {
    if (groupRef.current) {
      // Gentle rotation and floating (increased speed)
      groupRef.current.rotation.y += hovered ? 0.02 : 0.008
      const floatOffset = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
      
      // Smooth scale transition on hover
      const currentScale = groupRef.current.scale.x
      const target = hovered ? 1.15 : 1.0
      const newScale = currentScale + (target - currentScale) * 0.08
      groupRef.current.scale.set(newScale, newScale, newScale)
      
      // Position avatar ABOVE the orbit plane (Y=0), centered at X=0, Z=0
      groupRef.current.position.set(0, 0.5 + floatOffset, 0)
    }
  })

  const handleClick = (e) => {
    e.stopPropagation()
    setClicked(true)
    setTimeout(() => setClicked(false), 300)
    if (onAvatarClick) onAvatarClick()
  }

  if (!model) return null

  return (
    <group 
      ref={groupRef}
      onClick={handleClick}
      onPointerOver={(e) => {
        e.stopPropagation()
        setHovered(true)
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={(e) => {
        e.stopPropagation()
        setHovered(false)
        document.body.style.cursor = 'auto'
      }}
    >
      <primitive object={model} />
      {/* Lighting for avatar - intensifies on hover */}
      <pointLight position={[0, 2, 3]} intensity={hovered ? 3.5 : 2.0} color="#ffffff" distance={12} />
      <pointLight position={[3, 1, 0]} intensity={hovered ? 2.0 : 1.0} color="#8a2be2" distance={10} />
      <pointLight position={[-3, 1, 0]} intensity={hovered ? 2.0 : 1.0} color="#ff6600" distance={10} />
      <pointLight position={[0, -1, 2]} intensity={hovered ? 1.5 : 0.8} color="#4fc3f7" distance={8} />
      {/* Glow effect on hover - larger for bigger avatar */}
      {hovered && (
        <>
          <mesh>
            <sphereGeometry args={[1.8, 32, 32]} />
            <meshBasicMaterial color="#8a2be2" transparent opacity={0.1} />
          </mesh>
          <mesh>
            <sphereGeometry args={[2.2, 32, 32]} />
            <meshBasicMaterial color="#ff6600" transparent opacity={0.06} />
          </mesh>
          <mesh>
            <sphereGeometry args={[2.6, 32, 32]} />
            <meshBasicMaterial color="#4fc3f7" transparent opacity={0.03} />
          </mesh>
        </>
      )}
      {/* Click pulse effect - larger */}
      {clicked && (
        <mesh>
          <sphereGeometry args={[2.5, 32, 32]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.2} />
        </mesh>
      )}
    </group>
  )
})

// ============================================
// AVATAR COMPONENTS
// ============================================
const AvatarModel = memo(function AvatarModel({ color }) {
  const groupRef = useRef()
  const [model, setModel] = useState(null)

  useEffect(() => {
    loadAvatar((m) => {
      m.scale.set(1.5, 1.5, 1.5)
      m.position.set(0, -1.5, 0)
      setModel(m)
    })
  }, [])

  useFrame((state) => {
    if (groupRef.current) {
      // Gentle floating animation
      groupRef.current.rotation.y += 0.005
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
    }
  })

  if (!model) return null

  return (
    <group ref={groupRef}>
      <primitive object={model} />
      {/* Add colored rim light based on planet */}
      <pointLight position={[2, 2, 2]} intensity={3} color={color} distance={10} />
      <pointLight position={[-2, 2, -2]} intensity={2} color={color} distance={8} />
    </group>
  )
})

// Contact Avatar - turns towards hovered button (left for contact, right for game)
// direction: 'left' | 'right' | 'center'
const ContactAvatar = memo(function ContactAvatar({ isMobile, direction = 'center', glowColor = '#8a2be2' }) {
  const groupRef = useRef()
  const modelRef = useRef()
  const [model, setModel] = useState(null)
  const targetRotation = useRef(0)

  useEffect(() => {
    loadAvatar((m) => {
      const scale = isMobile ? 0.9 : 1.1
      m.scale.set(scale, scale, scale)
      m.position.set(0, -0.2, 0)
      m.rotation.set(0, 0, 0) // Start facing forward
      modelRef.current = m
      setModel(m)
    })
  }, [isMobile])

  // Update target rotation based on direction
  useEffect(() => {
    if (direction === 'left') {
      targetRotation.current = -0.8 // Turn to face left (Contact button)
    } else if (direction === 'right') {
      targetRotation.current = 0.8 // Turn to face right (Play Game button)
    } else {
      targetRotation.current = 0 // Face forward
    }
  }, [direction])

  useFrame((state) => {
    if (groupRef.current && modelRef.current) {
      // Smooth rotation towards target - walking animation feel
      const currentY = modelRef.current.rotation.y
      const diff = targetRotation.current - currentY
      modelRef.current.rotation.y += diff * 0.08 // Smooth interpolation

      // Bobbing animation - more energetic when turning
      const isMoving = Math.abs(diff) > 0.05
      const bobSpeed = isMoving ? 6 : 2
      const bobAmount = isMoving ? 0.08 : 0.03
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * bobSpeed) * bobAmount

      // Side-to-side sway when moving
      if (isMoving) {
        groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 8) * 0.03
      } else {
        groupRef.current.rotation.z *= 0.9 // Ease back to center
      }
    }
  })

  if (!model) return null

  return (
    <group ref={groupRef}>
      <primitive object={model} />
      {/* Dynamic glow based on direction */}
      {direction !== 'center' && (
        <pointLight 
          position={[direction === 'left' ? -1 : 1, 0, 1]} 
          intensity={2} 
          color={glowColor} 
          distance={5} 
        />
      )}
    </group>
  )
})

// ============================================
// MODAL BACKGROUND COMPONENTS
// ============================================

const ModalStars = memo(function ModalStars({ count = 200, color }) {
  const ref = useRef()
  
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (seededRandom(i * 3) - 0.5) * 20
      pos[i * 3 + 1] = (seededRandom(i * 3 + 1) - 0.5) * 20
      pos[i * 3 + 2] = (seededRandom(i * 3 + 2) - 0.5) * 20
    }
    return pos
  }, [count])

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.02
      ref.current.rotation.x = state.clock.elapsedTime * 0.01
    }
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial 
        size={0.05} 
        color={color} 
        transparent 
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  )
})

// Galactic spiral animation
const GalacticSpiral = memo(function GalacticSpiral({ color }) {
  const ref = useRef()
  
  const spiralGeometry = useMemo(() => {
    const points = []
    const arms = 3
    const pointsPerArm = 100
    
    for (let arm = 0; arm < arms; arm++) {
      const armOffset = (arm / arms) * Math.PI * 2
      for (let i = 0; i < pointsPerArm; i++) {
        const t = i / pointsPerArm
        const angle = armOffset + t * Math.PI * 4
        const radius = t * 8
        const x = Math.cos(angle) * radius
        const z = Math.sin(angle) * radius
        const y = (seededRandom(arm * 100 + i) - 0.5) * 0.5
        points.push(x, y, z)
      }
    }
    
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3))
    return geometry
  }, [])

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.1
    }
  })

  return (
    <points ref={ref} geometry={spiralGeometry}>
      <pointsMaterial 
        size={0.08} 
        color={color} 
        transparent 
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  )
})

// Modal 3D Scene
const ModalScene = memo(function ModalScene({ color }) {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <ModalStars color={color} />
      <GalacticSpiral color={color} />
      <AvatarModel color={color} />
    </>
  )
})

// ============================================
// SPACE MODAL COMPONENT
// ============================================

const SpaceModal = memo(function SpaceModal({ planet, onClose, isMobile }) {
  const [isVisible, setIsVisible] = useState(false)
  
  useEffect(() => {
    setTimeout(() => setIsVisible(true), 50)
    
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [onClose])

  const handleClose = useCallback(() => {
    setIsVisible(false)
    setTimeout(onClose, 300)
  }, [onClose])

  // Get the appropriate 3D icon for the planet
  const renderIcon = useCallback(() => {
    const iconSize = isMobile ? 1.2 : 1.5
    if (planet.id === 'about') {
      return <PersonIcon color={planet.color} size={iconSize} />
    } else if (planet.id === 'experience') {
      return <BriefcaseIcon color={planet.color} size={iconSize} />
    } else if (planet.id === 'skills') {
      return <GearIcon color={planet.color} size={iconSize} />
    } else if (planet.id === 'education') {
      return <GraduationCapIcon color={planet.color} size={iconSize} />
    }
    return null
  }, [planet.id, planet.color, isMobile])

  const renderContent = useCallback(() => {
    const { fullContent } = planet
    
    if (planet.id === 'about') {
      return (
        <>
          <p style={{ 
            fontSize: isMobile ? '14px' : '16px', 
            lineHeight: 1.8, 
            opacity: 0.9,
            whiteSpace: 'pre-line',
            marginBottom: '24px'
          }}>
            {fullContent.description}
          </p>
          
          {/* Core Strengths */}
          <div style={{ marginBottom: '28px' }}>
            <h4 style={{ color: planet.color, marginBottom: '12px', fontSize: isMobile ? '15px' : '17px' }}>🧩 Core Strengths</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
              {fullContent.highlights.map((highlight, i) => (
                <span key={i} style={{
                  padding: '8px 16px',
                  background: `${planet.color}33`,
                  border: `1px solid ${planet.color}66`,
                  borderRadius: '20px',
                  fontSize: isMobile ? '12px' : '14px',
                  color: planet.color,
                }}>
                  {highlight}
                </span>
              ))}
            </div>
          </div>
          
          {/* What I Do */}
          {fullContent.whatIDo && (
            <div style={{ marginBottom: '28px' }}>
              <h4 style={{ color: planet.color, marginBottom: '16px', fontSize: isMobile ? '15px' : '17px' }}>💼 What I Do</h4>
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px' }}>
                <div style={{
                  padding: '16px',
                  background: `${planet.color}22`,
                  border: `1px solid ${planet.color}44`,
                  borderRadius: '12px',
                  textAlign: 'left',
                }}>
                  <h5 style={{ margin: '0 0 12px 0', color: planet.color, fontSize: isMobile ? '13px' : '15px' }}>🎨 UI/UX Design</h5>
                  <ul style={{ margin: 0, paddingLeft: '18px', fontSize: isMobile ? '11px' : '13px', opacity: 0.85, lineHeight: 1.8 }}>
                    {fullContent.whatIDo.design.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div style={{
                  padding: '16px',
                  background: `${planet.color}22`,
                  border: `1px solid ${planet.color}44`,
                  borderRadius: '12px',
                  textAlign: 'left',
                }}>
                  <h5 style={{ margin: '0 0 12px 0', color: planet.color, fontSize: isMobile ? '13px' : '15px' }}>💻 Full Stack Development</h5>
                  <ul style={{ margin: 0, paddingLeft: '18px', fontSize: isMobile ? '11px' : '13px', opacity: 0.85, lineHeight: 1.8 }}>
                    {fullContent.whatIDo.development.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
          
          {/* Philosophy */}
          {fullContent.philosophy && (
            <div>
              <h4 style={{ color: planet.color, marginBottom: '12px', fontSize: isMobile ? '15px' : '17px' }}>🧠 Philosophy – Design × Code</h4>
              <div style={{
                padding: '16px',
                background: `${planet.color}15`,
                border: `1px solid ${planet.color}33`,
                borderRadius: '12px',
                textAlign: 'left',
              }}>
                <ul style={{ margin: 0, paddingLeft: '18px', fontSize: isMobile ? '12px' : '14px', opacity: 0.85, lineHeight: 2 }}>
                  {fullContent.philosophy.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </>
      )
    }
    
    if (planet.id === 'experience') {
      return (
        <>
          <p style={{ fontSize: isMobile ? '14px' : '16px', lineHeight: 1.6, opacity: 0.9, marginBottom: '24px' }}>
            {fullContent.description}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {fullContent.experiences.map((exp, i) => (
              <div key={i} style={{
                padding: '20px',
                background: `${planet.color}22`,
                border: `1px solid ${planet.color}44`,
                borderRadius: '12px',
                textAlign: 'left',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
                  <h4 style={{ margin: 0, color: planet.color, fontSize: isMobile ? '14px' : '16px' }}>{exp.role}</h4>
                  <span style={{ fontSize: isMobile ? '11px' : '12px', opacity: 0.6, background: `${planet.color}33`, padding: '4px 10px', borderRadius: '12px' }}>{exp.period}</span>
                </div>
                <div style={{ fontSize: isMobile ? '13px' : '15px', opacity: 0.9, marginBottom: '10px', fontWeight: 500 }}>{exp.company}</div>
                <div style={{ fontSize: isMobile ? '12px' : '13px', opacity: 0.75, marginBottom: '12px' }}>{exp.desc}</div>
                
                {/* Design Work */}
                {exp.designWork && (
                  <div style={{ marginBottom: '10px' }}>
                    <h5 style={{ margin: '0 0 6px 0', color: planet.color, fontSize: isMobile ? '11px' : '12px', opacity: 0.9 }}>🎨 Design Contributions:</h5>
                    <ul style={{ margin: 0, paddingLeft: '16px', fontSize: isMobile ? '10px' : '11px', opacity: 0.7, lineHeight: 1.7 }}>
                      {exp.designWork.map((item, j) => (
                        <li key={j}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {/* Dev Work */}
                {exp.devWork && (
                  <div>
                    <h5 style={{ margin: '0 0 6px 0', color: planet.color, fontSize: isMobile ? '11px' : '12px', opacity: 0.9 }}>💻 Development Work:</h5>
                    <ul style={{ margin: 0, paddingLeft: '16px', fontSize: isMobile ? '10px' : '11px', opacity: 0.7, lineHeight: 1.7 }}>
                      {exp.devWork.map((item, j) => (
                        <li key={j}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )
    }
    
    if (planet.id === 'skills') {
      return (
        <>
          <p style={{ fontSize: isMobile ? '14px' : '16px', lineHeight: 1.6, opacity: 0.9, marginBottom: '24px' }}>
            {fullContent.description}
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
            {fullContent.skillCategories.map((cat, i) => (
              <div key={i} style={{
                padding: '16px',
                background: `${planet.color}22`,
                border: `1px solid ${planet.color}44`,
                borderRadius: '12px',
              }}>
                <h4 style={{ margin: '0 0 12px 0', color: planet.color, fontSize: isMobile ? '14px' : '16px' }}>{cat.category}</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {cat.skills.map((skill, j) => (
                    <span key={j} style={{
                      padding: '4px 10px',
                      background: 'rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      fontSize: isMobile ? '11px' : '12px',
                    }}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          {/* Core Strengths */}
          {fullContent.coreStrengths && (
            <div>
              <h4 style={{ color: planet.color, marginBottom: '12px', fontSize: isMobile ? '15px' : '17px' }}>🧩 Core Strengths</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
                {fullContent.coreStrengths.map((strength, i) => (
                  <span key={i} style={{
                    padding: '8px 14px',
                    background: `${planet.color}33`,
                    border: `1px solid ${planet.color}66`,
                    borderRadius: '20px',
                    fontSize: isMobile ? '11px' : '13px',
                    color: planet.color,
                  }}>
                    {strength}
                  </span>
                ))}
              </div>
            </div>
          )}
        </>
      )
    }
    
    if (planet.id === 'education') {
      return (
        <>
          <p style={{ fontSize: isMobile ? '14px' : '16px', lineHeight: 1.6, opacity: 0.9, marginBottom: '24px' }}>
            {fullContent.description}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {fullContent.education.map((edu, i) => (
              <div key={i} style={{
                padding: '24px',
                background: `${planet.color}22`,
                border: `1px solid ${planet.color}44`,
                borderRadius: '12px',
                textAlign: 'left',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                  <h4 style={{ margin: 0, color: planet.color, fontSize: isMobile ? '16px' : '20px' }}>🎓 {edu.degree}</h4>
                  <span style={{ fontSize: isMobile ? '11px' : '12px', opacity: 0.6, background: `${planet.color}33`, padding: '4px 12px', borderRadius: '12px' }}>{edu.year}</span>
                </div>
                <div style={{ fontSize: isMobile ? '15px' : '18px', opacity: 0.95, marginBottom: '12px', color: planet.color, fontWeight: 500 }}>{edu.institution}</div>
                
                {/* CGPA */}
                {edu.cgpa && (
                  <div style={{ 
                    display: 'inline-block',
                    marginBottom: '16px',
                    padding: '10px 20px',
                    background: `linear-gradient(135deg, ${planet.color}44, ${planet.color}22)`,
                    border: `2px solid ${planet.color}`,
                    borderRadius: '12px',
                  }}>
                    <span style={{ fontSize: isMobile ? '12px' : '14px', opacity: 0.8 }}>CGPA: </span>
                    <span style={{ fontSize: isMobile ? '20px' : '24px', fontWeight: 'bold', color: planet.color }}>{edu.cgpa}</span>
                  </div>
                )}
                
                <div style={{ fontSize: isMobile ? '13px' : '15px', opacity: 0.75, lineHeight: 1.7 }}>{edu.desc}</div>
              </div>
            ))}
          </div>
        </>
      )
    }
    return null
  }, [planet, isMobile])

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: 200,
      opacity: isVisible ? 1 : 0,
      transition: 'opacity 0.3s ease',
      pointerEvents: isVisible ? 'auto' : 'none',
    }}>
      {/* Background overlay */}
      <div 
        onClick={handleClose}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(10px)',
        }} 
      />
      
      {/* 3D Canvas for galactic background */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        opacity: 0.6,
      }}>
        <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
          <Suspense fallback={null}>
            <ModalScene color={planet.color} />
          </Suspense>
        </Canvas>
      </div>
      
      {/* Content container */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: `translate(-50%, -50%) scale(${isVisible ? 1 : 0.9})`,
        transition: 'transform 0.3s ease',
        width: isMobile ? '95%' : '90%',
        maxWidth: '800px',
        maxHeight: '85vh',
        overflowY: 'auto',
        background: `linear-gradient(135deg, ${planet.color}15 0%, rgba(0,0,0,0.8) 50%, ${planet.color}10 100%)`,
        backdropFilter: 'blur(30px)',
        border: `2px solid ${planet.color}44`,
        borderRadius: '24px',
        padding: isMobile ? '24px' : '40px',
        color: '#fff',
        textAlign: 'center',
        boxShadow: `0 0 60px ${planet.color}33, inset 0 0 60px ${planet.color}11`,
      }}>
        {/* Close button */}
        <button
          onClick={handleClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.1)',
            border: `1px solid ${planet.color}66`,
            color: '#fff',
            fontSize: '20px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease',
          }}
          onMouseOver={(e) => {
            e.target.style.background = `${planet.color}44`
            e.target.style.transform = 'scale(1.1)'
          }}
          onMouseOut={(e) => {
            e.target.style.background = 'rgba(255,255,255,0.1)'
            e.target.style.transform = 'scale(1)'
          }}
        >
          ✕
        </button>
        
        {/* 3D Planet Icon */}
        <div style={{
          width: isMobile ? '100px' : '140px',
          height: isMobile ? '100px' : '140px',
          margin: '0 auto 16px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${planet.color}33 0%, transparent 70%)`,
          boxShadow: `0 0 40px ${planet.color}44, 0 0 80px ${planet.color}22`,
        }}>
          <Canvas camera={{ position: [0, 0, 3], fov: 50 }} style={{ background: 'transparent' }}>
            <ambientLight intensity={0.8} />
            <directionalLight position={[3, 3, 3]} intensity={1.2} />
            <pointLight position={[0, 0, 2]} intensity={2} color={planet.color} />
            <Suspense fallback={null}>
              {renderIcon()}
            </Suspense>
          </Canvas>
        </div>
        
        {/* Heading */}
        <h2 style={{
          margin: '0 0 24px 0',
          fontSize: isMobile ? '28px' : '36px',
          fontFamily: '"Orbitron", sans-serif',
          color: planet.color,
          textShadow: `0 0 20px ${planet.color}88`,
        }}>
          {planet.fullContent.heading}
        </h2>
        
        {/* Dynamic content */}
        {renderContent()}
      </div>
      
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
      `}</style>
    </div>
  )
})

// ============================================
// PLANET COMPONENT
// ============================================

// Shared time reference for synchronized orbit
const sharedOrbitTime = { current: 0 }

const Planet = memo(function Planet({ planet, isMobile, onClick, planetIndex }) {
  const meshRef = useRef()
  const groupRef = useRef()
  
  // Calculate angle based on planet index (4 planets = 90 degrees apart each)
  const angleOffset = (planetIndex * Math.PI * 2) / 4  // Equal spacing: 0, π/2, π, 3π/2
  
  const adjustedOrbit = isMobile ? planet.orbitRadius * 0.55 : planet.orbitRadius
  const adjustedSize = isMobile ? SHARED_PLANET_SIZE * 0.85 : SHARED_PLANET_SIZE
  
  // Fixed height for all planets
  const fixedY = 0.5
  
  // Height for icon above planet
  const iconHeight = adjustedSize + (isMobile ? 0.25 : 0.35)
  // Icon size
  const iconSize = isMobile ? 0.35 : 0.5
  // Text position above icon
  const textHeight = iconHeight + iconSize + (isMobile ? 0.3 : 0.4)

  const material = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: planet.color,
      metalness: 0.2,
      roughness: 0.6,
    })
  }, [planet.color])

  // Create single word texture that orbits around the planet
  const wordTexture = useMemo(() => {
    const text = planet.title.toUpperCase()
    const canvas = document.createElement('canvas')
    const fontSize = isMobile ? 28 : 32
    
    // Measure text width
    const ctx = canvas.getContext('2d')
    ctx.font = `bold ${fontSize}px Orbitron, sans-serif`
    const textWidth = ctx.measureText(text).width
    
    // Set canvas size based on text
    canvas.width = Math.ceil(textWidth) + 40
    canvas.height = fontSize + 20
    
    // Re-get context after resize
    const context = canvas.getContext('2d')
    context.clearRect(0, 0, canvas.width, canvas.height)
    
    // Setup text style
    context.font = `bold ${fontSize}px Orbitron, sans-serif`
    context.textAlign = 'center'
    context.textBaseline = 'middle'
    
    // Outer glow
    context.shadowColor = planet.color
    context.shadowBlur = 12
    context.fillStyle = planet.color
    context.fillText(text, canvas.width / 2, canvas.height / 2)
    
    // Inner glow
    context.shadowBlur = 6
    context.fillStyle = '#ffffff'
    context.fillText(text, canvas.width / 2, canvas.height / 2)
    
    // Crisp text
    context.shadowBlur = 0
    context.fillText(text, canvas.width / 2, canvas.height / 2)
    
    const texture = new THREE.CanvasTexture(canvas)
    texture.needsUpdate = true
    
    return { texture, aspectRatio: canvas.width / canvas.height }
  }, [planet.title, planet.color, isMobile])

  useFrame(() => {
    if (groupRef.current && meshRef.current) {
      // Update shared time (only first planet updates it, others just read)
      if (planetIndex === 0) {
        sharedOrbitTime.current += 0.01 * planet.orbitSpeed
      }
      
      // Calculate position using shared time + this planet's angle offset
      const currentAngle = sharedOrbitTime.current + angleOffset
      
      // Orbit around center
      groupRef.current.position.x = Math.cos(currentAngle) * adjustedOrbit
      groupRef.current.position.z = Math.sin(currentAngle) * adjustedOrbit
      // Keep all planets at same fixed height
      groupRef.current.position.y = fixedY
      
      // Self rotation
      meshRef.current.rotation.y += planet.selfRotation
      meshRef.current.rotation.x += planet.selfRotation * 0.3
    }
  })

  const handleClick = useCallback((e) => {
    e.stopPropagation()
    onClick()
  }, [onClick])

  const handlePointerOver = useCallback(() => {
    document.body.style.cursor = 'pointer'
  }, [])

  const handlePointerOut = useCallback(() => {
    document.body.style.cursor = 'default'
  }, [])

  // Calculate word sprite size
  const wordHeight = isMobile ? 0.35 : 0.4
  const wordWidth = wordHeight * wordTexture.aspectRatio

  return (
    <group ref={groupRef}>
      {/* Main planet - clickable */}
      <mesh 
        ref={meshRef} 
        material={material}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <icosahedronGeometry args={[adjustedSize, 2]} />
      </mesh>
      
      {/* 3D Icon on top of planet */}
      <group position={[0, iconHeight, 0]}>
        {planet.id === 'about' && <PersonIcon color={planet.color} size={iconSize} />}
        {planet.id === 'experience' && <BriefcaseIcon color={planet.color} size={iconSize} />}
        {planet.id === 'skills' && <GearIcon color={planet.color} size={iconSize} />}
        {planet.id === 'education' && <GraduationCapIcon color={planet.color} size={iconSize} />}
      </group>
      
      {/* Invisible larger hit area for easier clicking */}
      <mesh 
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <sphereGeometry args={[adjustedSize * 1.5, 8, 8]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
      
      {/* Text label above icon */}
      <sprite
        position={[0, textHeight, 0]}
        scale={[wordWidth, wordHeight, 1]}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <spriteMaterial map={wordTexture.texture} transparent />
      </sprite>
    </group>
  )
})

// ============================================
// 3D ICON COMPONENTS
// ============================================

const PersonIcon = memo(function PersonIcon({ color, size }) {
  const groupRef = useRef()
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.02
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.05
    }
  })
  
  return (
    <group ref={groupRef} scale={[size, size, size]}>
      {/* Astronaut Helmet - outer shell */}
      <mesh position={[0, 0.1, 0]}>
        <sphereGeometry args={[0.5, 24, 24]} />
        <meshStandardMaterial color="#ffffff" emissive={color} emissiveIntensity={0.2} metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Helmet visor - dark reflective */}
      <mesh position={[0, 0.1, 0.25]}>
        <sphereGeometry args={[0.38, 24, 24, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#1a1a2e" emissive={color} emissiveIntensity={0.4} metalness={0.9} roughness={0.1} transparent opacity={0.9} />
      </mesh>
      {/* Helmet ring/collar */}
      <mesh position={[0, -0.3, 0]}>
        <torusGeometry args={[0.35, 0.08, 8, 24]} />
        <meshStandardMaterial color="#cccccc" emissive={color} emissiveIntensity={0.2} metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Small antenna on helmet */}
      <mesh position={[0.3, 0.45, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.2, 8]} />
        <meshStandardMaterial color="#ff6600" emissive="#ff6600" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[0.3, 0.58, 0]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial color="#ff3300" emissive="#ff3300" emissiveIntensity={0.8} />
      </mesh>
      {/* Glow */}
      <pointLight position={[0, 0, 0.5]} intensity={1.5} color={color} distance={2} />
    </group>
  )
})

// Briefcase Icon for Experience planet
const BriefcaseIcon = memo(function BriefcaseIcon({ color, size }) {
  const groupRef = useRef()
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.02
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.05
    }
  })
  
  return (
    <group ref={groupRef} scale={[size, size, size]}>
      {/* Main case body */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1, 0.7, 0.4]} />
        <meshStandardMaterial color="#ffffff" emissive={color} emissiveIntensity={0.3} metalness={0.6} roughness={0.2} />
      </mesh>
      {/* Handle */}
      <mesh position={[0, 0.5, 0]}>
        <torusGeometry args={[0.2, 0.05, 8, 16, Math.PI]} />
        <meshStandardMaterial color="#ffffff" emissive={color} emissiveIntensity={0.4} metalness={0.7} roughness={0.2} />
      </mesh>
      {/* Lock/clasp */}
      <mesh position={[0, 0.1, 0.21]}>
        <boxGeometry args={[0.15, 0.1, 0.05]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} metalness={0.8} roughness={0.1} />
      </mesh>
      {/* Glow */}
      <pointLight position={[0, 0, 0.5]} intensity={1} color={color} distance={2} />
    </group>
  )
})

// Gear Icon for Skills planet
const GearIcon = memo(function GearIcon({ color, size }) {
  const groupRef = useRef()
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.z += 0.02
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.05
    }
  })
  
  // Create gear shape
  const gearShape = useMemo(() => {
    const shape = new THREE.Shape()
    const teeth = 8
    const outerRadius = 0.5
    const innerRadius = 0.35
    const toothHeight = 0.15
    
    for (let i = 0; i < teeth; i++) {
      const angle1 = (i / teeth) * Math.PI * 2
      const angle2 = ((i + 0.3) / teeth) * Math.PI * 2
      const angle3 = ((i + 0.5) / teeth) * Math.PI * 2
      const angle4 = ((i + 0.8) / teeth) * Math.PI * 2
      
      if (i === 0) {
        shape.moveTo(Math.cos(angle1) * outerRadius, Math.sin(angle1) * outerRadius)
      }
      shape.lineTo(Math.cos(angle2) * (outerRadius + toothHeight), Math.sin(angle2) * (outerRadius + toothHeight))
      shape.lineTo(Math.cos(angle3) * (outerRadius + toothHeight), Math.sin(angle3) * (outerRadius + toothHeight))
      shape.lineTo(Math.cos(angle4) * outerRadius, Math.sin(angle4) * outerRadius)
    }
    shape.closePath()
    
    // Inner hole
    const holePath = new THREE.Path()
    holePath.absarc(0, 0, innerRadius * 0.5, 0, Math.PI * 2, true)
    shape.holes.push(holePath)
    
    return shape
  }, [])
  
  return (
    <group ref={groupRef} scale={[size, size, size]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <extrudeGeometry args={[gearShape, { depth: 0.15, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02 }]} />
        <meshStandardMaterial color="#ffffff" emissive={color} emissiveIntensity={0.3} metalness={0.7} roughness={0.2} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 0.2, 16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} metalness={0.8} roughness={0.1} />
      </mesh>
      <pointLight position={[0, 0, 0.3]} intensity={1} color={color} distance={2} />
    </group>
  )
})

// Graduation Cap Icon for Education planet
const GraduationCapIcon = memo(function GraduationCapIcon({ color, size }) {
  const groupRef = useRef()
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.02
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.05
    }
  })
  
  return (
    <group ref={groupRef} scale={[size, size, size]}>
      {/* Cap base (mortarboard) */}
      <mesh position={[0, 0.1, 0]} rotation={[0, Math.PI / 4, 0]}>
        <boxGeometry args={[0.9, 0.08, 0.9]} />
        <meshStandardMaterial color="#ffffff" emissive={color} emissiveIntensity={0.3} metalness={0.5} roughness={0.3} />
      </mesh>
      {/* Cap top button */}
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.1, 16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} metalness={0.8} roughness={0.1} />
      </mesh>
      {/* Skull cap (dome) */}
      <mesh position={[0, -0.1, 0]}>
        <sphereGeometry args={[0.35, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#ffffff" emissive={color} emissiveIntensity={0.2} metalness={0.4} roughness={0.4} />
      </mesh>
      {/* Tassel string */}
      <mesh position={[0.3, 0.1, 0.3]} rotation={[0, 0, -0.3]}>
        <cylinderGeometry args={[0.02, 0.02, 0.4, 8]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.4} />
      </mesh>
      {/* Tassel end */}
      <mesh position={[0.4, -0.1, 0.4]}>
        <cylinderGeometry args={[0.05, 0.02, 0.15, 8]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
      </mesh>
      {/* Glow */}
      <pointLight position={[0, 0, 0.5]} intensity={1} color={color} distance={2} />
    </group>
  )
})

// ============================================
// ALIEN IN SPACESHIP COMPONENT
// ============================================

const AlienSpaceship = memo(function AlienSpaceship({ isMobile, side = 'right' }) {
  const groupRef = useRef()
  const eyeLeftRef = useRef()
  const eyeRightRef = useRef()
  
  // Different colors for left and right
  const isLeft = side === 'left'
  const shipColor = isLeft ? '#cc6688' : '#6688cc'       // Pink vs Blue
  const shipEmissive = isLeft ? '#aa3355' : '#3355aa'
  const shipBottomColor = isLeft ? '#bb5577' : '#5577bb'
  const rimLightColor = isLeft ? '#66ffff' : '#ff66ff'   // Cyan vs Magenta
  const alienColor = isLeft ? '#dd66aa' : '#44dd66'      // Pink vs Green
  const alienEmissive = isLeft ? '#aa4488' : '#22aa44'
  const antennaColor = isLeft ? '#ff66cc' : '#33bb55'
  const antennaTipColor = isLeft ? '#00ffff' : '#ffff00' // Cyan vs Yellow
  
  // Position based on side - responsive for all screen sizes
  const xPos = isLeft 
    ? (isMobile ? -1.8 : -4.5) 
    : (isMobile ? 1.8 : 4.5)
  const yPos = isMobile ? 2.0 : 2.8
  const xOffset = isLeft ? -1 : 1
  
  useFrame((state) => {
    if (groupRef.current) {
      // Floating animation
      const timeOffset = isLeft ? 0.5 : 0
      groupRef.current.position.y = yPos + Math.sin(state.clock.elapsedTime * 0.6 + timeOffset) * 0.2
      groupRef.current.position.x = xPos + Math.sin(state.clock.elapsedTime * 0.4 + timeOffset) * 0.15 * xOffset
      // Slight tilt while flying
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5 + timeOffset) * 0.1 * xOffset
    }
    // Blinking eyes
    if (eyeLeftRef.current && eyeRightRef.current) {
      const blinkOffset = isLeft ? 1 : 0
      const blink = Math.sin(state.clock.elapsedTime * 3 + blinkOffset) > 0.95 ? 0.1 : 1
      eyeLeftRef.current.scale.y = blink
      eyeRightRef.current.scale.y = blink
    }
  })
  
  const scale = isMobile ? 0.28 : 0.45
  
  return (
    <group ref={groupRef} position={[xPos, yPos, 0]} scale={scale}>
      
      {/* === SPACESHIP === */}
      {/* UFO Saucer body */}
      <mesh position={[0, -0.3, 0]} rotation={[0.2, 0, 0]}>
        <cylinderGeometry args={[1.8, 1.2, 0.4, 24]} />
        <meshStandardMaterial color={shipColor} metalness={0.9} roughness={0.1} emissive={shipEmissive} emissiveIntensity={0.3} />
      </mesh>
      
      {/* UFO bottom dome */}
      <mesh position={[0, -0.5, 0]} rotation={[Math.PI, 0, 0]}>
        <sphereGeometry args={[0.8, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={shipBottomColor} metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Glass dome cockpit */}
      <mesh position={[0, 0.2, 0]}>
        <sphereGeometry args={[0.9, 24, 24, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#aaddff" metalness={0.3} roughness={0.1} transparent opacity={0.5} />
      </mesh>
      
      {/* UFO rim lights */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <mesh key={i} position={[Math.cos(i * Math.PI / 3) * 1.5, -0.3, Math.sin(i * Math.PI / 3) * 1.5]}>
          <sphereGeometry args={[0.12, 8, 8]} />
          <meshBasicMaterial color={rimLightColor} />
        </mesh>
      ))}
      <pointLight position={[0, -0.8, 0]} intensity={3} color={rimLightColor} distance={2} />
      
      {/* === ALIEN INSIDE === */}
      <group position={[0, 0.4, 0.1]}>
        {/* Alien Head */}
        <mesh position={[0, 0.3, 0]}>
          <sphereGeometry args={[0.5, 16, 16]} />
          <meshStandardMaterial color={alienColor} metalness={0.3} roughness={0.6} emissive={alienEmissive} emissiveIntensity={0.3} />
        </mesh>
        
        {/* Big left eye */}
        <group position={[-0.18, 0.4, 0.42]}>
          <mesh>
            <sphereGeometry args={[0.18, 16, 16]} />
            <meshStandardMaterial color="#111111" metalness={0.9} roughness={0.1} />
          </mesh>
          <mesh ref={eyeLeftRef} position={[0, 0, 0.1]}>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        </group>
        
        {/* Big right eye */}
        <group position={[0.18, 0.4, 0.42]}>
          <mesh>
            <sphereGeometry args={[0.18, 16, 16]} />
            <meshStandardMaterial color="#111111" metalness={0.9} roughness={0.1} />
          </mesh>
          <mesh ref={eyeRightRef} position={[0, 0, 0.1]}>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        </group>
        
        {/* Left antenna */}
        <group position={[-0.2, 0.75, 0]}>
          <mesh>
            <cylinderGeometry args={[0.03, 0.03, 0.3, 8]} />
            <meshStandardMaterial color={antennaColor} />
          </mesh>
          <mesh position={[0, 0.2, 0]}>
            <sphereGeometry args={[0.07, 16, 16]} />
            <meshBasicMaterial color={antennaTipColor} />
          </mesh>
        </group>
        
        {/* Right antenna */}
        <group position={[0.2, 0.75, 0]}>
          <mesh>
            <cylinderGeometry args={[0.03, 0.03, 0.3, 8]} />
            <meshStandardMaterial color={antennaColor} />
          </mesh>
          <mesh position={[0, 0.2, 0]}>
            <sphereGeometry args={[0.07, 16, 16]} />
            <meshBasicMaterial color={antennaTipColor} />
          </mesh>
        </group>
        
        {/* Small wave hand */}
        <mesh position={[0.45 * xOffset, 0, 0.2]} rotation={[0, 0, -0.5 * xOffset]}>
          <sphereGeometry args={[0.12, 8, 8]} />
          <meshStandardMaterial color={alienColor} emissive={alienEmissive} emissiveIntensity={0.2} />
        </mesh>
      </group>
      
      {/* Antenna glow */}
      <pointLight position={[0, 1.1, 0]} intensity={1.5} color={antennaTipColor} distance={1.5} />
    </group>
  )
})

// ============================================
// GLOWING 3D STAR COMPONENT
// ============================================

const GlowingStar = memo(function GlowingStar({ position, size = 0.15, color = '#ffdd44', pulseSpeed = 1 }) {
  const groupRef = useRef()
  
  useFrame((state) => {
    if (groupRef.current) {
      // Gentle rotation
      groupRef.current.rotation.y += 0.01
      groupRef.current.rotation.z += 0.005
      
      // Pulsing scale effect
      const pulse = Math.sin(state.clock.elapsedTime * pulseSpeed) * 0.15 + 1
      groupRef.current.scale.setScalar(pulse)
    }
  })
  
  // Create 5-pointed star shape
  const starShape = useMemo(() => {
    const shape = new THREE.Shape()
    const outerRadius = size
    const innerRadius = size * 0.4
    const points = 5
    
    for (let i = 0; i < points * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius
      const angle = (i * Math.PI) / points - Math.PI / 2
      const x = Math.cos(angle) * radius
      const y = Math.sin(angle) * radius
      if (i === 0) {
        shape.moveTo(x, y)
      } else {
        shape.lineTo(x, y)
      }
    }
    shape.closePath()
    return shape
  }, [size])
  
  const extrudeSettings = useMemo(() => ({
    depth: size * 0.3,
    bevelEnabled: true,
    bevelThickness: size * 0.05,
    bevelSize: size * 0.05,
    bevelSegments: 2,
  }), [size])
  
  return (
    <group ref={groupRef} position={position}>
      {/* Core star shape */}
      <mesh>
        <extrudeGeometry args={[starShape, extrudeSettings]} />
        <meshStandardMaterial 
          color={color} 
          emissive={color} 
          emissiveIntensity={1.2}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
      
      {/* Point light for glow effect */}
      <pointLight color={color} intensity={1.5} distance={2} />
    </group>
  )
})

// Stars around title - Desktop positions (title is at Y ~0.45)
const TITLE_STARS_DESKTOP = [
  // Left side of title
  { position: [-2.0, 0.5, 0.2], size: 0.08, color: '#ffdd44', pulseSpeed: 1.2 },
  { position: [-1.9, 0.15, 0.3], size: 0.06, color: '#ffaa33', pulseSpeed: 0.9 },
  // Right side of title
  { position: [2.0, 0.5, 0.2], size: 0.08, color: '#ffdd44', pulseSpeed: 1.3 },
  { position: [1.9, 0.15, 0.3], size: 0.06, color: '#ffaa33', pulseSpeed: 1.0 },
  // Upper corners - lowered to stay in view
  { position: [-1.7, 0.72, 0.15], size: 0.05, color: '#ffee66', pulseSpeed: 1.5 },
  { position: [1.7, 0.72, 0.15], size: 0.05, color: '#ffee66', pulseSpeed: 1.4 },
]

// Stars around title - Mobile positions (title is at Y ~0.35)
const TITLE_STARS_MOBILE = [
  // Left side of title - moved further out
  { position: [-1.5, 0.5, 0.2], size: 0.05, color: '#ffdd44', pulseSpeed: 1.2 },
  { position: [-1.45, 0.0, 0.3], size: 0.04, color: '#ffaa33', pulseSpeed: 0.9 },
  // Right side of title - moved further out
  { position: [1.5, 0.5, 0.2], size: 0.05, color: '#ffdd44', pulseSpeed: 1.3 },
  { position: [1.45, 0.0, 0.3], size: 0.04, color: '#ffaa33', pulseSpeed: 1.0 },
  // Upper corners - moved further out
  { position: [-1.3, 0.7, 0.15], size: 0.035, color: '#ffee66', pulseSpeed: 1.5 },
  { position: [1.3, 0.7, 0.15], size: 0.035, color: '#ffee66', pulseSpeed: 1.4 },
]

// ============================================
// TITLE 3D COMPONENT
// ============================================

const TITLE_TAGS = ['Frontend Developer', 'Full Stack Developer', 'UX Designer', 'Product Designer']

const Title3D = memo(function Title3D({ isMobile }) {
  const groupRef = useRef()
  const titleRef = useRef()
  const [hoveredLetter, setHoveredLetter] = useState(null)
  const [hoveredTag, setHoveredTag] = useState(null)
  
  const title = 'SAMARDHH'
  
  // Create letter textures for title
  const letterTextures = useMemo(() => {
    return title.split('').map((char) => {
      const canvas = document.createElement('canvas')
      canvas.width = 128
      canvas.height = 128
      const ctx = canvas.getContext('2d')
      
      ctx.clearRect(0, 0, 128, 128)
      
      // Glow layers
      ctx.font = `bold ${isMobile ? 85 : 90}px Orbitron, sans-serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      
      // Outer glow
      ctx.shadowColor = '#ff6600'
      ctx.shadowBlur = 20
      ctx.fillStyle = '#ff8800'
      ctx.fillText(char, 64, 64)
      
      // Inner glow
      ctx.shadowBlur = 10
      ctx.fillStyle = '#ffaa00'
      ctx.fillText(char, 64, 64)
      
      // Main text
      ctx.shadowBlur = 0
      ctx.fillStyle = '#ffcc00'
      ctx.fillText(char, 64, 64)
      
      const texture = new THREE.CanvasTexture(canvas)
      texture.needsUpdate = true
      return texture
    })
  }, [isMobile])
  
  // Create tag textures
  const tagTextures = useMemo(() => {
    return TITLE_TAGS.map((tag) => {
      const canvas = document.createElement('canvas')
      canvas.width = 512
      canvas.height = 80
      const ctx = canvas.getContext('2d')
      
      ctx.clearRect(0, 0, 512, 80)
      
      // Glassmorphism text effect
      ctx.font = `bold ${isMobile ? 34 : 34}px Orbitron, sans-serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      
      // Outer glow layer - brighter
      ctx.shadowColor = 'rgba(255, 255, 255, 1)'
      ctx.shadowBlur = 30
      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)'
      ctx.fillText(tag.toUpperCase(), 256, 42)
      
      // Glass reflection gradient on text - brighter
      const textGradient = ctx.createLinearGradient(50, 15, 50, 65)
      textGradient.addColorStop(0, 'rgba(255, 255, 255, 1)')
      textGradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.9)')
      textGradient.addColorStop(0.5, 'rgba(220, 240, 255, 0.75)')
      textGradient.addColorStop(0.7, 'rgba(255, 255, 255, 0.85)')
      textGradient.addColorStop(1, 'rgba(255, 255, 255, 1)')
      
      // Main text with glass gradient
      ctx.shadowColor = 'rgba(255, 255, 255, 0.9)'
      ctx.shadowBlur = 20
      ctx.fillStyle = textGradient
      ctx.fillText(tag.toUpperCase(), 256, 42)
      
      // Bright inner highlight
      ctx.shadowBlur = 0
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)'
      ctx.fillText(tag.toUpperCase(), 256, 41)
      
      const texture = new THREE.CanvasTexture(canvas)
      texture.needsUpdate = true
      return { tag, texture }
    })
  }, [isMobile])
  
  useFrame((state) => {
    if (groupRef.current) {
      // Subtle floating animation
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.03
    }
    // Individual letter wave animation
    if (titleRef.current) {
      titleRef.current.children.forEach((child, idx) => {
        if (child.type === 'Sprite') {
          const wave = Math.sin(state.clock.elapsedTime * 2 + idx * 0.3) * 0.02
          child.position.y = (hoveredLetter === idx ? 0.08 : 0) + wave
        }
      })
    }
  })
  
  const letterSpacing = isMobile ? 0.34 : 0.38
  const titleWidth = (title.length - 1) * letterSpacing
  const startX = -titleWidth / 2
  
  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Title letters */}
      <group ref={titleRef} position={[0, isMobile ? 0.35 : 0.45, 0]}>
        {letterTextures.map((texture, i) => {
          const isHovered = hoveredLetter === i
          return (
            <sprite
              key={i}
              position={[startX + i * letterSpacing, 0, isHovered ? 0.3 : 0]}
              scale={[
                (isMobile ? 0.52 : 0.55) * (isHovered ? 1.2 : 1), 
                (isMobile ? 0.52 : 0.55) * (isHovered ? 1.2 : 1), 
                1
              ]}
              onPointerOver={() => {
                setHoveredLetter(i)
              }}
              onPointerOut={() => {
                setHoveredLetter(null)
              }}
              onPointerDown={() => {
                // Pop effect on click
                setHoveredLetter(i)
              }}
            >
              <spriteMaterial 
                map={texture} 
                transparent 
                opacity={1}
                color={isHovered ? '#ffffff' : '#ffcc00'}
              />
            </sprite>
          )
        })}
        {/* Glow effect for hovered letter */}
        {hoveredLetter !== null && (
          <pointLight 
            position={[startX + hoveredLetter * letterSpacing, 0, 0.5]} 
            intensity={3} 
            color="#ffaa00" 
            distance={1.5} 
          />
        )}
      </group>
      
      {/* Tags */}
      <group position={[0, isMobile ? -0.18 : -0.15, 0]}>
        {tagTextures.map((item, i) => {
          const isHovered = hoveredTag === i
          const tagSpacing = isMobile ? 0.72 : 1.05
          const xPos = (i - 1.5) * tagSpacing
          return (
            <sprite
              key={item.tag}
              position={[xPos, isHovered ? 0.04 : 0, isHovered ? 0.15 : 0]}
              scale={[
                (isMobile ? 0.58 : 0.82) * (isHovered ? 1.1 : 1), 
                (isMobile ? 0.11 : 0.15) * (isHovered ? 1.1 : 1), 
                1
              ]}
              onPointerOver={() => {
                setHoveredTag(i)
              }}
              onPointerOut={() => {
                setHoveredTag(null)
              }}
              onPointerDown={() => {
                // Pop effect on click
                setHoveredTag(i)
              }}
            >
              <spriteMaterial 
                map={item.texture} 
                transparent 
                opacity={1}
                color={isHovered ? '#ffffff' : '#ffcc88'}
              />
            </sprite>
          )
        })}
        {hoveredTag !== null && (
          <pointLight 
            position={[(hoveredTag - 1) * (isMobile ? 0.75 : 1.1), 0, 0.5]} 
            intensity={2} 
            color="#ff8800" 
            distance={1.5} 
          />
        )}
      </group>
      
      {/* Glowing Stars around the title */}
      {(isMobile ? TITLE_STARS_MOBILE : TITLE_STARS_DESKTOP).map((star, index) => (
        <GlowingStar
          key={`title-star-${index}`}
          position={star.position}
          size={star.size}
          color={star.color}
          pulseSpeed={star.pulseSpeed}
        />
      ))}
    </group>
  )
})

// ============================================
// FLOATING ASTEROID COMPONENT
// ============================================

const FloatingAsteroid = memo(function FloatingAsteroid({ index, isMobile }) {
  const groupRef = useRef()
  const [model, setModel] = useState(null)
  
  // Generate consistent random values based on index
  // Smaller orbit radius for mobile to keep asteroids visible
  const baseOrbitRadius = useMemo(() => isMobile ? 4.5 : 7.5, [isMobile])
  const orbitRadius = useMemo(() => baseOrbitRadius + seededRandom(index * 17) * (isMobile ? 1 : 2), [index, baseOrbitRadius, isMobile])
  const orbitSpeed = useMemo(() => 0.1 + seededRandom(index * 23) * 0.15, [index])
  const initialAngle = useMemo(() => seededRandom(index * 31) * Math.PI * 2, [index])
  const yOffset = useMemo(() => (seededRandom(index * 41) - 0.5) * (isMobile ? 0.8 : 1.5), [index, isMobile])
  const scale = useMemo(() => (isMobile ? 0.025 : 0.05) + seededRandom(index * 53) * (isMobile ? 0.02 : 0.03), [index, isMobile])
  const rotSpeed = useMemo(() => (seededRandom(index * 61) - 0.5) * 0.1, [index])
  
  const angleRef = useRef(initialAngle)
  const rotationRef = useRef({ x: 0, y: 0, z: 0 })
  
  useEffect(() => {
    loadAsteroid(setModel)
  }, [])
  
  useFrame((state, delta) => {
    if (groupRef.current && model) {
      // Orbit around the solar system
      angleRef.current += delta * orbitSpeed
      // No additional adjustment needed - orbitRadius already handles mobile
      groupRef.current.position.x = Math.cos(angleRef.current) * orbitRadius
      groupRef.current.position.z = Math.sin(angleRef.current) * orbitRadius
      groupRef.current.position.y = yOffset + Math.sin(angleRef.current * 2) * 0.3
      
      // Tumbling rotation
      rotationRef.current.x += delta * rotSpeed * 3
      rotationRef.current.y += delta * rotSpeed * 2
      rotationRef.current.z += delta * rotSpeed
      groupRef.current.rotation.set(
        rotationRef.current.x,
        rotationRef.current.y,
        rotationRef.current.z
      )
    }
  })
  
  if (!model) return null
  
  return (
    <primitive
      ref={groupRef}
      object={model}
      scale={scale}
    />
  )
})

// ============================================
// ORBIT RING & SCENE COMPONENTS
// ============================================

// Glowing dot orbit ring - small dots with light glow effect
const OrbitRing = memo(function OrbitRing({ radius, isMobile }) {
  const adjustedRadius = isMobile ? radius * 0.55 : radius
  const groupRef = useRef()
  
  // Number of dots based on orbit size - many dots for minimal spacing
  const dotCount = isMobile ? Math.floor(adjustedRadius * 55) : Math.floor(adjustedRadius * 70)
  
  // Generate dot positions along the orbit
  const dots = useMemo(() => {
    const pts = []
    for (let i = 0; i < dotCount; i++) {
      const angle = (i / dotCount) * Math.PI * 2
      pts.push({
        x: Math.cos(angle) * adjustedRadius,
        z: Math.sin(angle) * adjustedRadius,
      })
    }
    return pts
  }, [adjustedRadius, dotCount])
  
  // Subtle rotation animation
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.015
    }
  })

  return (
    <group ref={groupRef}>
      {dots.map((dot, i) => (
        <group key={i} position={[dot.x, 0, dot.z]}>
          {/* Inner glow */}
          <sprite scale={[0.035, 0.035, 1]}>
            <spriteMaterial 
              color="#ffffff" 
              transparent 
              opacity={0.35}
            />
          </sprite>
          {/* Core dot */}
          <sprite scale={[0.012, 0.012, 1]}>
            <spriteMaterial 
              color="#ffffff" 
              transparent 
              opacity={0.9}
            />
          </sprite>
        </group>
      ))}
    </group>
  )
})

// Asteroid belt configuration
const ASTEROID_COUNT = 3

const Scene = memo(function Scene({ isMobile, isSmallMobile, onPlanetClick, onAvatarClick }) {
  // Generate stable asteroid indices
  const asteroidIndices = useMemo(() => 
    Array.from({ length: ASTEROID_COUNT }, (_, i) => i), 
  [])
  
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <CenterAvatar onAvatarClick={onAvatarClick} isMobile={isMobile} isSmallMobile={isSmallMobile} />
      
      {PLANETS.map((planet, index) => (
        <Planet 
          key={planet.id} 
          planet={planet} 
          planetIndex={index}
          isMobile={isMobile}
          onClick={() => onPlanetClick(planet)}
        />
      ))}
      
      {/* Floating Asteroids around the orbit */}
      {asteroidIndices.map(index => (
        <FloatingAsteroid 
          key={`asteroid-${index}`} 
          index={index} 
          isMobile={isMobile} 
        />
      ))}
    </>
  )
})

// ============================================
// BUBBLE ANIMATION COMPONENT
// ============================================

const Bubble = memo(function Bubble({ id, x, size, delay, onPop }) {
  // Create realistic soap bubble effect with multiple gradient layers
  const [style, setStyle] = useState({
    position: 'fixed',
    left: x,
    top: -150,
    width: size,
    height: size,
    borderRadius: '50%',
    // Realistic soap bubble with iridescent effect
    background: `
      radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.1) 15%, transparent 40%),
      radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.3) 0%, transparent 20%),
      radial-gradient(circle at 50% 50%, transparent 50%, rgba(255, 200, 100, 0.15) 70%, rgba(255, 150, 50, 0.1) 85%, transparent 100%),
      radial-gradient(ellipse at 50% 0%, rgba(255, 220, 150, 0.4) 0%, transparent 60%),
      linear-gradient(135deg, rgba(255, 200, 100, 0.2) 0%, rgba(255, 150, 50, 0.1) 50%, rgba(255, 100, 0, 0.15) 100%)
    `,
    boxShadow: `
      0 0 30px rgba(255, 200, 100, 0.3),
      0 0 60px rgba(255, 170, 0, 0.15),
      inset 0 -20px 40px rgba(255, 200, 100, 0.1),
      inset 0 20px 40px rgba(255, 255, 255, 0.15),
      inset 0 0 ${size * 0.3}px rgba(255, 255, 255, 0.05)
    `,
    border: '1px solid rgba(255, 255, 255, 0.3)',
    zIndex: 1000,
    pointerEvents: 'none',
    opacity: 0,
    transform: 'scale(0.3)',
    transition: 'none',
  })
  const [popping, setPopping] = useState(false)

  // Fall duration varies per bubble for natural effect
  const fallDuration = useMemo(() => 7 + seededRandom(id * 3) * 5, [id]) // 7-12 seconds fall time

  useEffect(() => {
    const startTimeout = setTimeout(() => {
      setStyle(prev => ({
        ...prev,
        opacity: 0.85,
        transform: 'scale(1)',
        transition: 'opacity 0.5s ease, transform 0.5s ease-out',
      }))
    }, delay)

    const fallTimeout = setTimeout(() => {
      setStyle(prev => ({
        ...prev,
        top: window.innerHeight - 100, // Stop before bottom of screen
        transition: `top ${fallDuration}s cubic-bezier(0.25, 0.1, 0.25, 1), opacity 0.5s ease, transform 0.5s ease-out`,
      }))
    }, delay + 300)

    // Pop happens when bubble reaches the bottom area (fallDuration - 0.5 seconds early)
    const popTimeout = setTimeout(() => {
      setPopping(true)
      setTimeout(() => onPop(id), 600)
    }, delay + (fallDuration - 0.5) * 1000)

    return () => {
      clearTimeout(startTimeout)
      clearTimeout(fallTimeout)
      clearTimeout(popTimeout)
    }
  }, [id, delay, onPop, fallDuration])

  const popParticles = useMemo(() => {
    return [...Array(16)].map((_, i) => ({
      rotation: i * 22.5,
      distance: 40 + seededRandom(i * 7) * 50,
      size: 12 + seededRandom(i * 3) * 12,
    }))
  }, [])

  if (popping) {
    return (
      <div style={{
        position: 'fixed',
        left: parseInt(style.left) - 40,
        bottom: 40,
        width: parseInt(style.width) + 80,
        height: parseInt(style.height) + 80,
        zIndex: 1001,
        pointerEvents: 'none',
      }}>
        {popParticles.map((particle, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: particle.size,
              height: particle.size,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255, 255, 255, 1), rgba(255, 220, 100, 0.8))',
              boxShadow: '0 0 20px rgba(255, 220, 150, 0.9), 0 0 40px rgba(255, 170, 50, 0.6)',
              transform: `translate(-50%, -50%) rotate(${particle.rotation}deg) translateX(${particle.distance}px)`,
              animation: 'bubblePop 0.6s ease-out forwards',
            }}
          />
        ))}
      </div>
    )
  }

  return <div style={style} />
})

// ============================================
// MAIN SOLAR SYSTEM COMPONENT
// ============================================

const SolarSystem = memo(function SolarSystem({ onStartGame }) {
  const [isMobile, setIsMobile] = useState(false)
  const [isSmallMobile, setIsSmallMobile] = useState(false)
  const [activePlanet, setActivePlanet] = useState(null)
  const [showContact, setShowContact] = useState(false)
  const [bubbles, setBubbles] = useState([])
  
  useEffect(() => {
    const checkScreen = () => {
      const width = window.innerWidth
      setIsMobile(width < 768)
      setIsSmallMobile(width < 380)
    }
    checkScreen()
    window.addEventListener('resize', checkScreen, { passive: true })
    return () => window.removeEventListener('resize', checkScreen)
  }, [])

  const handlePlanetClick = useCallback((planet) => {
    setActivePlanet(planet)
  }, [])

  const handleCloseModal = useCallback(() => {
    setActivePlanet(null)
  }, [])

  const handleBubblePop = useCallback((id) => {
    setBubbles(prev => prev.filter(b => b.id !== id))
  }, [])

  const handleAvatarClick = useCallback(() => {
    const newBubbles = []
    const bubbleCount = isMobile ? 8 : 15
    for (let i = 0; i < bubbleCount; i++) {
      newBubbles.push({
        id: Date.now() + i,
        x: Math.random() * (window.innerWidth - 80) + 40,
        size: isMobile ? 40 + Math.random() * 40 : 60 + Math.random() * 60,
        delay: i * 250,
      })
    }
    setBubbles(prev => [...prev, ...newBubbles])
  }, [isMobile])

  const containerStyle = useMemo(() => ({
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 10,
  }), [])

  const cameraPosition = useMemo(() => {
    if (isSmallMobile) return [0, 5, 14]
    if (isMobile) return [0, 4.5, 13]
    return [0, 4, 16]
  }, [isMobile, isSmallMobile])

  return (
    <div style={containerStyle}>
      {/* ============================================ */}
      {/* ENHANCED COSMIC BACKGROUND */}
      {/* ============================================ */}
      
      {/* Nebula Clouds Layer */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        zIndex: 1,
        pointerEvents: 'none',
      }}>
        {/* Purple Nebula - Top Left */}
        <div style={{
          position: 'absolute',
          top: '-20%',
          left: '-10%',
          width: '60%',
          height: '50%',
          background: 'radial-gradient(ellipse at center, rgba(138, 43, 226, 0.15) 0%, rgba(75, 0, 130, 0.08) 40%, transparent 70%)',
          filter: 'blur(60px)',
          animation: 'nebulaFloat1 25s ease-in-out infinite',
        }} />
        {/* Blue Nebula - Bottom Right */}
        <div style={{
          position: 'absolute',
          bottom: '-15%',
          right: '-15%',
          width: '55%',
          height: '45%',
          background: 'radial-gradient(ellipse at center, rgba(30, 144, 255, 0.12) 0%, rgba(0, 100, 200, 0.06) 50%, transparent 70%)',
          filter: 'blur(50px)',
          animation: 'nebulaFloat2 30s ease-in-out infinite',
        }} />
        {/* Pink Nebula - Center Right */}
        <div style={{
          position: 'absolute',
          top: '30%',
          right: '5%',
          width: '40%',
          height: '35%',
          background: 'radial-gradient(ellipse at center, rgba(255, 105, 180, 0.1) 0%, rgba(219, 112, 147, 0.05) 50%, transparent 70%)',
          filter: 'blur(45px)',
          animation: 'nebulaFloat3 20s ease-in-out infinite',
        }} />
        {/* Teal Nebula - Bottom Left */}
        <div style={{
          position: 'absolute',
          bottom: '10%',
          left: '5%',
          width: '35%',
          height: '30%',
          background: 'radial-gradient(ellipse at center, rgba(0, 206, 209, 0.1) 0%, rgba(32, 178, 170, 0.05) 50%, transparent 70%)',
          filter: 'blur(40px)',
          animation: 'nebulaFloat1 22s ease-in-out infinite reverse',
        }} />
      </div>
      
      {/* Enhanced Star Field - Multiple Layers */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 2,
        pointerEvents: 'none',
      }}>
        {/* Distant small stars */}
        {[...Array(isMobile ? 80 : 150)].map((_, i) => (
          <div
            key={`star-small-${i}`}
            style={{
              position: 'absolute',
              left: `${seededRandom(i * 7) * 100}%`,
              top: `${seededRandom(i * 11) * 100}%`,
              width: `${1 + seededRandom(i * 3) * 1.5}px`,
              height: `${1 + seededRandom(i * 3) * 1.5}px`,
              background: ['#ffffff', '#e8e8ff', '#ffe8e8', '#fff8e0'][Math.floor(seededRandom(i * 5) * 4)],
              borderRadius: '50%',
              opacity: 0.3 + seededRandom(i * 13) * 0.5,
              animation: `twinkle ${2 + seededRandom(i * 17) * 4}s ease-in-out infinite`,
              animationDelay: `${seededRandom(i * 19) * 5}s`,
            }}
          />
        ))}
        {/* Medium bright stars */}
        {[...Array(isMobile ? 30 : 60)].map((_, i) => (
          <div
            key={`star-med-${i}`}
            style={{
              position: 'absolute',
              left: `${seededRandom(i * 23) * 100}%`,
              top: `${seededRandom(i * 29) * 100}%`,
              width: `${2 + seededRandom(i * 31) * 2}px`,
              height: `${2 + seededRandom(i * 31) * 2}px`,
              background: ['#ffffff', '#b8d4ff', '#ffd4ff', '#ffffd4', '#d4ffff'][Math.floor(seededRandom(i * 37) * 5)],
              borderRadius: '50%',
              boxShadow: `0 0 ${3 + seededRandom(i * 41) * 5}px currentColor`,
              opacity: 0.5 + seededRandom(i * 43) * 0.4,
              animation: `twinkle ${3 + seededRandom(i * 47) * 3}s ease-in-out infinite`,
              animationDelay: `${seededRandom(i * 53) * 4}s`,
            }}
          />
        ))}
        {/* Large bright stars with glow */}
        {[...Array(isMobile ? 8 : 15)].map((_, i) => (
          <div
            key={`star-large-${i}`}
            style={{
              position: 'absolute',
              left: `${seededRandom(i * 59) * 100}%`,
              top: `${seededRandom(i * 61) * 100}%`,
              width: `${3 + seededRandom(i * 67) * 2}px`,
              height: `${3 + seededRandom(i * 67) * 2}px`,
              background: '#ffffff',
              borderRadius: '50%',
              boxShadow: `
                0 0 ${5 + seededRandom(i * 71) * 8}px #ffffff,
                0 0 ${10 + seededRandom(i * 73) * 15}px rgba(200, 200, 255, 0.6),
                0 0 ${20 + seededRandom(i * 79) * 20}px rgba(138, 43, 226, 0.3)
              `,
              animation: `twinkleBright ${4 + seededRandom(i * 83) * 4}s ease-in-out infinite`,
              animationDelay: `${seededRandom(i * 89) * 3}s`,
            }}
          />
        ))}
      </div>
      
      {/* Shooting Stars */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 3,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}>
        {[...Array(isMobile ? 3 : 5)].map((_, i) => (
          <div
            key={`shooting-${i}`}
            style={{
              position: 'absolute',
              top: `${10 + seededRandom(i * 97) * 40}%`,
              left: '-5%',
              width: isMobile ? '80px' : '120px',
              height: '2px',
              background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 20%, rgba(255,255,255,0.8) 80%, #ffffff 100%)',
              borderRadius: '2px',
              transform: 'rotate(-15deg)',
              animation: `shootingStar ${8 + seededRandom(i * 101) * 12}s linear infinite`,
              animationDelay: `${seededRandom(i * 103) * 15}s`,
              opacity: 0,
              boxShadow: '0 0 6px #fff, 0 0 12px rgba(200, 200, 255, 0.5)',
            }}
          />
        ))}
      </div>
      
      {/* Cosmic Dust Particles */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 2,
        pointerEvents: 'none',
      }}>
        {[...Array(isMobile ? 20 : 40)].map((_, i) => (
          <div
            key={`dust-${i}`}
            style={{
              position: 'absolute',
              left: `${seededRandom(i * 107) * 100}%`,
              top: `${seededRandom(i * 109) * 100}%`,
              width: '1px',
              height: '1px',
              background: 'rgba(255, 255, 255, 0.4)',
              borderRadius: '50%',
              animation: `dustFloat ${15 + seededRandom(i * 113) * 20}s linear infinite`,
              animationDelay: `${seededRandom(i * 127) * 10}s`,
            }}
          />
        ))}
      </div>
      
      {/* Center Glow Behind Avatar */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: isMobile ? '300px' : '500px',
        height: isMobile ? '300px' : '500px',
        background: `
          radial-gradient(circle at center, rgba(138, 43, 226, 0.15) 0%, rgba(138, 43, 226, 0.08) 30%, transparent 60%),
          radial-gradient(circle at center, rgba(255, 215, 0, 0.08) 0%, transparent 40%)
        `,
        filter: 'blur(30px)',
        zIndex: 3,
        pointerEvents: 'none',
        animation: 'centerGlow 6s ease-in-out infinite',
      }} />

      {/* Bubbles */}
      {bubbles.map(bubble => (
        <Bubble
          key={bubble.id}
          id={bubble.id}
          x={bubble.x}
          size={bubble.size}
          delay={bubble.delay}
          onPop={handleBubblePop}
        />
      ))}
      
      {/* Glowing Sun - Top Right Corner - Mass of Light */}
      <div style={{
        position: 'absolute',
        top: isSmallMobile ? '-140px' : (isMobile ? '-180px' : '-220px'),
        right: isSmallMobile ? '-140px' : (isMobile ? '-180px' : '-220px'),
        width: isSmallMobile ? '200px' : (isMobile ? '280px' : '380px'),
        height: isSmallMobile ? '200px' : (isMobile ? '280px' : '380px'),
        background: `
          radial-gradient(ellipse 40% 50% at 50% 50%, rgba(255,255,255,1) 0%, rgba(255,255,255,0.9) 10%, transparent 50%),
          radial-gradient(ellipse 60% 40% at 45% 55%, rgba(255,255,200,0.95) 0%, transparent 45%),
          radial-gradient(ellipse 50% 60% at 55% 45%, rgba(255,250,180,0.9) 0%, transparent 40%),
          radial-gradient(circle at 50% 50%, rgba(255,215,0,0.8) 0%, rgba(255,180,0,0.6) 20%, rgba(255,140,0,0.4) 40%, rgba(255,100,0,0.2) 60%, transparent 75%)
        `,
        filter: 'blur(3px)',
        zIndex: 5,
        pointerEvents: 'none',
        animation: 'sunPulse 4s ease-in-out infinite',
      }}>
        {/* Inner bright core */}
        <div style={{
          position: 'absolute',
          top: '30%',
          left: '30%',
          width: '40%',
          height: '40%',
          background: 'radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(255,255,240,0.9) 30%, rgba(255,240,200,0.7) 60%, transparent 100%)',
          filter: 'blur(8px)',
          animation: 'sunCorePulse 2s ease-in-out infinite',
        }} />
        {/* Secondary glow layer */}
        <div style={{
          position: 'absolute',
          top: '20%',
          left: '25%',
          width: '55%',
          height: '50%',
          background: 'radial-gradient(ellipse at center, rgba(255,250,220,0.8) 0%, rgba(255,220,150,0.4) 40%, transparent 70%)',
          filter: 'blur(12px)',
          transform: 'rotate(-15deg)',
        }} />
      </div>
      {/* Outer glow aura */}
      <div style={{
        position: 'absolute',
        top: isSmallMobile ? '-180px' : (isMobile ? '-240px' : '-300px'),
        right: isSmallMobile ? '-180px' : (isMobile ? '-240px' : '-300px'),
        width: isSmallMobile ? '280px' : (isMobile ? '400px' : '520px'),
        height: isSmallMobile ? '280px' : (isMobile ? '400px' : '520px'),
        background: 'radial-gradient(circle, rgba(255,200,100,0.3) 0%, rgba(255,150,50,0.15) 30%, rgba(255,100,0,0.08) 50%, transparent 70%)',
        filter: 'blur(20px)',
        zIndex: 4,
        pointerEvents: 'none',
        animation: 'sunAuraPulse 5s ease-in-out infinite',
      }} />
      
      <Canvas
        camera={{ position: cameraPosition, fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        performance={{ min: 0.5 }}
        style={{ cursor: 'grab' }}
        eventPrefix="client"
      >
        <Scene 
          isMobile={isMobile} 
          isSmallMobile={isSmallMobile}
          onPlanetClick={handlePlanetClick}
          onAvatarClick={handleAvatarClick}
        />
      </Canvas>
      
      {/* Space Modal */}
      {activePlanet && (
        <SpaceModal 
          planet={activePlanet} 
          onClose={handleCloseModal} 
          isMobile={isMobile}
        />
      )}
      
      {/* 3D Title and Tags */}
      <div style={{
        position: 'absolute',
        top: isSmallMobile ? '5px' : (isMobile ? '8px' : '15px'),
        left: '50%',
        transform: 'translateX(-50%)',
        width: isMobile ? '100%' : '800px',
        maxWidth: '100vw',
        height: isSmallMobile ? '150px' : (isMobile ? '180px' : '220px'),
        zIndex: 20,
        pointerEvents: 'auto',
      }}>
        <Canvas
          camera={{ position: [0, 0, 2], fov: 50 }}
          style={{ background: 'transparent' }}
        >
          <ambientLight intensity={1} />
          <directionalLight position={[5, 5, 5]} intensity={1.5} />
          <pointLight position={[0, 0, 1.5]} intensity={3} color="#ffaa00" />
          <Suspense fallback={null}>
            <Title3D isMobile={isMobile} />
          </Suspense>
        </Canvas>
      </div>

      {/* Animated Hint Text Above Bottom Navigation */}
      <div style={{
        position: 'absolute',
        bottom: isSmallMobile ? '95px' : (isMobile ? '120px' : '100px'),
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 25,
        textAlign: 'center',
        width: '90%',
        maxWidth: '500px',
      }}>
        <p style={{
          fontFamily: '"Orbitron", sans-serif',
          fontSize: isSmallMobile ? '10px' : (isMobile ? '12px' : '14px'),
          color: 'rgba(255, 255, 255, 0.9)',
          textTransform: 'uppercase',
          letterSpacing: isSmallMobile ? '1px' : '2px',
          textShadow: '0 0 10px rgba(255, 200, 100, 0.8), 0 0 20px rgba(255, 170, 0, 0.5)',
          animation: 'hintTextPulse 3s ease-in-out infinite',
          background: 'linear-gradient(90deg, transparent, rgba(255, 170, 0, 0.1), transparent)',
          padding: isSmallMobile ? '8px 12px' : '10px 20px',
          borderRadius: '20px',
          border: '1px dashed rgba(255, 200, 100, 0.4)',
        }}>
          ✨ It's my portfolio • Click the planets to know about me ✨
        </p>
      </div>

      {/* Bottom Navigation Bar - Contact | Avatar | Play Game */}
      <div style={{
        position: 'absolute',
        bottom: isSmallMobile ? '10px' : (isMobile ? '15px' : '25px'),
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        gap: isSmallMobile ? '8px' : (isMobile ? '15px' : '30px'),
        zIndex: 25,
        width: isMobile ? '98%' : 'auto',
        maxWidth: '100vw',
        padding: '0 5px',
        boxSizing: 'border-box',
      }}>
        {/* Contact Me Button - LEFT */}
        <button
          onClick={() => setShowContact(true)}
          style={{
            padding: isSmallMobile ? '8px 12px' : (isMobile ? '10px 16px' : '12px 24px'),
            fontSize: isSmallMobile ? '8px' : (isMobile ? '9px' : '11px'),
            fontWeight: 700,
            fontFamily: '"Orbitron", sans-serif',
            background: 'linear-gradient(135deg, rgba(138, 43, 226, 0.8), rgba(75, 0, 130, 0.8))',
            border: '2px solid rgba(186, 85, 211, 0.6)',
            borderRadius: '25px',
            color: '#fff',
            cursor: 'pointer',
            textTransform: 'uppercase',
            letterSpacing: isSmallMobile ? '1px' : '2px',
            boxShadow: '0 0 20px rgba(138, 43, 226, 0.5), 0 0 40px rgba(75, 0, 130, 0.3)',
            animation: 'contactGlow 2s ease-in-out infinite',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}
          onMouseOver={(e) => {
            e.target.style.transform = 'scale(1.05)'
            e.target.style.boxShadow = '0 0 30px rgba(138, 43, 226, 0.7), 0 0 60px rgba(75, 0, 130, 0.5)'
          }}
          onMouseOut={(e) => {
            e.target.style.transform = 'scale(1)'
            e.target.style.boxShadow = '0 0 20px rgba(138, 43, 226, 0.5), 0 0 40px rgba(75, 0, 130, 0.3)'
          }}
        >
          ✨ Contact
        </button>

        {/* Play Game Button - RIGHT */}
        <button
          onClick={onStartGame}
          style={{
            padding: isSmallMobile ? '8px 12px' : (isMobile ? '10px 16px' : '12px 24px'),
            fontSize: isSmallMobile ? '8px' : (isMobile ? '9px' : '11px'),
            fontWeight: 700,
            fontFamily: '"Orbitron", sans-serif',
            background: 'linear-gradient(135deg, rgba(255, 102, 0, 0.8), rgba(255, 170, 0, 0.8))',
            border: '2px solid rgba(255, 170, 0, 0.6)',
            borderRadius: '25px',
            color: '#fff',
            cursor: 'pointer',
            textTransform: 'uppercase',
            letterSpacing: isSmallMobile ? '1px' : '2px',
            boxShadow: '0 0 20px rgba(255, 102, 0, 0.5), 0 0 40px rgba(255, 170, 0, 0.3)',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}
          onMouseOver={(e) => {
            e.target.style.transform = 'scale(1.05)'
            e.target.style.boxShadow = '0 0 30px rgba(255, 102, 0, 0.7), 0 0 60px rgba(255, 170, 0, 0.5)'
          }}
          onMouseOut={(e) => {
            e.target.style.transform = 'scale(1)'
            e.target.style.boxShadow = '0 0 20px rgba(255, 102, 0, 0.5), 0 0 40px rgba(255, 170, 0, 0.3)'
          }}
        >
          🚀 Play Game
        </button>
      </div>

      {/* Contact Modal */}
      {showContact && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 200,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {/* Backdrop */}
          <div 
            onClick={() => setShowContact(false)}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'rgba(0, 0, 0, 0.9)',
              backdropFilter: 'blur(10px)',
            }}
          />
          
          {/* Galactic background animation */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            pointerEvents: 'none',
          }}>
            {/* Animated stars */}
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  width: `${2 + seededRandom(i) * 3}px`,
                  height: `${2 + seededRandom(i) * 3}px`,
                  background: '#fff',
                  borderRadius: '50%',
                  left: `${seededRandom(i * 2) * 100}%`,
                  top: `${seededRandom(i * 3) * 100}%`,
                  opacity: 0.3 + seededRandom(i * 4) * 0.7,
                  animation: `twinkle ${2 + seededRandom(i * 5) * 3}s ease-in-out infinite`,
                  animationDelay: `${seededRandom(i * 6) * 2}s`,
                  boxShadow: `0 0 ${5 + seededRandom(i * 7) * 10}px rgba(138, 43, 226, 0.8)`,
                }}
              />
            ))}
            {/* Galactic spiral overlay */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '150%',
              height: '150%',
              background: 'radial-gradient(ellipse at center, rgba(138, 43, 226, 0.1) 0%, rgba(75, 0, 130, 0.05) 30%, transparent 70%)',
              animation: 'galaxySpin 30s linear infinite',
            }} />
          </div>
          
          {/* Modal Content */}
          <div style={{
            position: 'relative',
            width: isMobile ? '95%' : '500px',
            maxWidth: '500px',
            background: 'linear-gradient(135deg, rgba(138, 43, 226, 0.15) 0%, rgba(20, 10, 40, 0.95) 50%, rgba(75, 0, 130, 0.15) 100%)',
            backdropFilter: 'blur(30px)',
            border: '2px solid rgba(186, 85, 211, 0.4)',
            borderRadius: '24px',
            padding: isMobile ? '30px 20px' : '40px',
            color: '#fff',
            textAlign: 'center',
            boxShadow: '0 0 60px rgba(138, 43, 226, 0.4), inset 0 0 60px rgba(75, 0, 130, 0.1)',
            animation: 'modalAppear 0.4s ease-out',
          }}>
            {/* Close button */}
            <button
              onClick={() => setShowContact(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(186, 85, 211, 0.5)',
                color: '#fff',
                fontSize: '18px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
              }}
              onMouseOver={(e) => {
                e.target.style.background = 'rgba(138, 43, 226, 0.5)'
                e.target.style.transform = 'scale(1.1)'
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'rgba(255,255,255,0.1)'
                e.target.style.transform = 'scale(1)'
              }}
            >
              ✕
            </button>
            
            {/* Photo */}
            <div style={{
              width: isMobile ? '100px' : '120px',
              height: isMobile ? '100px' : '120px',
              borderRadius: '50%',
              margin: '0 auto 20px',
              background: 'linear-gradient(135deg, #8a2be2, #4b0082)',
              padding: '4px',
              boxShadow: '0 0 30px rgba(138, 43, 226, 0.6), 0 0 60px rgba(75, 0, 130, 0.3)',
              animation: 'photoGlow 3s ease-in-out infinite',
            }}>
              <img 
                src="/sam.jpeg" 
                alt="Samardhh"
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  background: '#1a0a2e',
                }}
                onError={(e) => {
                  e.target.style.display = 'none'
                }}
              />
            </div>
            
            {/* Name */}
            <h2 style={{
              margin: '0 0 8px 0',
              fontSize: isMobile ? '24px' : '28px',
              fontFamily: '"Orbitron", sans-serif',
              background: 'linear-gradient(135deg, #ba55d3, #8a2be2)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textShadow: 'none',
            }}>
              Samardhh Reddy
            </h2>
            
            <p style={{
              margin: '0 0 24px 0',
              fontSize: isMobile ? '11px' : '13px',
              opacity: 0.7,
              letterSpacing: '1px',
              lineHeight: 1.6,
            }}>
              Product Designer • UX Designer • Frontend Developer • Full Stack Developer
            </p>
            
            {/* Contact Links */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* Phone */}
              <a 
                href="tel:+919652074072"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  padding: '14px 20px',
                  background: 'rgba(138, 43, 226, 0.2)',
                  border: '1px solid rgba(186, 85, 211, 0.4)',
                  borderRadius: '12px',
                  color: '#fff',
                  textDecoration: 'none',
                  fontSize: isMobile ? '14px' : '15px',
                  transition: 'all 0.3s ease',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'rgba(138, 43, 226, 0.4)'
                  e.currentTarget.style.transform = 'translateX(5px)'
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'rgba(138, 43, 226, 0.2)'
                  e.currentTarget.style.transform = 'translateX(0)'
                }}
              >
                <span style={{ fontSize: '20px' }}>📱</span>
                +91 96520 74072
              </a>
              
              {/* Email */}
              <a 
                href="mailto:padalasamardhhreddy@gmail.com"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  padding: '14px 20px',
                  background: 'rgba(138, 43, 226, 0.2)',
                  border: '1px solid rgba(186, 85, 211, 0.4)',
                  borderRadius: '12px',
                  color: '#fff',
                  textDecoration: 'none',
                  fontSize: isMobile ? '12px' : '15px',
                  transition: 'all 0.3s ease',
                  wordBreak: 'break-all',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'rgba(138, 43, 226, 0.4)'
                  e.currentTarget.style.transform = 'translateX(5px)'
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'rgba(138, 43, 226, 0.2)'
                  e.currentTarget.style.transform = 'translateX(0)'
                }}
              >
                <span style={{ fontSize: '20px', flexShrink: 0 }}>✉️</span>
                padalasamardhhreddy@gmail.com
              </a>
              
              {/* LinkedIn */}
              <a 
                href="https://www.linkedin.com/in/samardhh/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  padding: '14px 20px',
                  background: 'rgba(138, 43, 226, 0.2)',
                  border: '1px solid rgba(186, 85, 211, 0.4)',
                  borderRadius: '12px',
                  color: '#fff',
                  textDecoration: 'none',
                  fontSize: isMobile ? '14px' : '15px',
                  transition: 'all 0.3s ease',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'rgba(138, 43, 226, 0.4)'
                  e.currentTarget.style.transform = 'translateX(5px)'
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'rgba(138, 43, 226, 0.2)'
                  e.currentTarget.style.transform = 'translateX(0)'
                }}
              >
                <span style={{ fontSize: '20px' }}>💼</span>
                LinkedIn Profile
              </a>
            </div>
            
            {/* Location */}
            <p style={{
              marginTop: '20px',
              fontSize: isMobile ? '12px' : '13px',
              opacity: 0.6,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}>
              📍 Hyderabad, India
            </p>
          </div>
        </div>
      )}

      {/* CSS Animations for glow */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&display=swap');
        
        @keyframes glowPulse {
          0%, 100% {
            text-shadow: 0 0 10px rgba(255, 102, 0, 0.8), 0 0 20px rgba(255, 170, 0, 0.6), 0 0 40px rgba(255, 204, 0, 0.4), 0 0 60px rgba(255, 102, 0, 0.3);
          }
          50% {
            text-shadow: 0 0 20px rgba(255, 102, 0, 1), 0 0 40px rgba(255, 170, 0, 0.8), 0 0 60px rgba(255, 204, 0, 0.6), 0 0 80px rgba(255, 102, 0, 0.5);
          }
        }
        
        @keyframes lightGlow {
          0%, 100% {
            box-shadow: 0 0 15px 10px rgba(255, 255, 255, 0.8), 0 0 40px 25px rgba(255, 170, 0, 0.6), 0 0 80px 50px rgba(255, 102, 0, 0.4), 0 0 120px 70px rgba(255, 68, 0, 0.2);
          }
          50% {
            box-shadow: 0 0 20px 15px rgba(255, 255, 255, 0.9), 0 0 60px 40px rgba(255, 170, 0, 0.7), 0 0 120px 70px rgba(255, 102, 0, 0.5), 0 0 180px 100px rgba(255, 68, 0, 0.3);
          }
        }
        
        @keyframes contactGlow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(138, 43, 226, 0.5), 0 0 40px rgba(75, 0, 130, 0.3), inset 0 0 20px rgba(186, 85, 211, 0.2);
          }
          50% {
            box-shadow: 0 0 30px rgba(138, 43, 226, 0.7), 0 0 60px rgba(75, 0, 130, 0.5), inset 0 0 30px rgba(186, 85, 211, 0.3);
          }
        }
        
        @keyframes hintTextPulse {
          0%, 100% {
            opacity: 0.7;
            text-shadow: 0 0 10px rgba(255, 200, 100, 0.6), 0 0 20px rgba(255, 170, 0, 0.3);
            border-color: rgba(255, 200, 100, 0.3);
          }
          50% {
            opacity: 1;
            text-shadow: 0 0 15px rgba(255, 200, 100, 1), 0 0 30px rgba(255, 170, 0, 0.7);
            border-color: rgba(255, 200, 100, 0.6);
          }
        }
        
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        
        @keyframes galaxySpin {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        
        @keyframes modalAppear {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        
        @keyframes photoGlow {
          0%, 100% { box-shadow: 0 0 30px rgba(138, 43, 226, 0.6), 0 0 60px rgba(75, 0, 130, 0.3); }
          50% { box-shadow: 0 0 50px rgba(138, 43, 226, 0.8), 0 0 100px rgba(75, 0, 130, 0.5); }
        }
        
        @keyframes bubblePop {
          0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
          50% { transform: translate(-50%, -50%) scale(1.5) translateY(-20px); opacity: 0.8; }
          100% { transform: translate(-50%, -50%) scale(0) translateY(-60px); opacity: 0; }
        }
      `}</style>

      {/* Background Music Control */}
      <BackgroundMusic isMobile={isMobile} />

      {/* Resume Download Button */}
      <ResumeDownload isMobile={isMobile} />

    </div>
  )
})

export default SolarSystem
