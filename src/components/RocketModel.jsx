import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useRef, useState, useEffect, memo, useMemo } from 'react'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

// Cache loaded model globally to avoid reloading
let cachedModel = null
let modelLoading = false
const modelCallbacks = []

function loadModel(callback) {
  if (cachedModel) {
    callback(cachedModel.clone())
    return
  }
  
  modelCallbacks.push(callback)
  
  if (!modelLoading) {
    modelLoading = true
    const loader = new GLTFLoader()
    loader.load(
      '/models/astr.glb',
      (gltf) => {
        cachedModel = gltf.scene
        modelCallbacks.forEach(cb => cb(cachedModel.clone()))
        modelCallbacks.length = 0
      },
      undefined,
      (err) => console.error('Error loading model:', err)
    )
  }
}

const Asteroid = memo(function Asteroid({ offsetX, offsetY, speedX, speedY, initialTime }) {
  const ref = useRef()
  const [model, setModel] = useState(null)
  const time = useRef(initialTime)
  const { viewport } = useThree()
  
  // Responsive movement range based on viewport
  const range = useMemo(() => ({
    x: Math.min(viewport.width * 0.4, 6),
    y: Math.min(viewport.height * 0.35, 3)
  }), [viewport.width, viewport.height])

  // Responsive scale based on viewport
  const scale = useMemo(() => {
    const baseScale = 0.06
    if (viewport.width < 5) return baseScale * 0.6  // Mobile
    if (viewport.width < 8) return baseScale * 0.8  // Tablet
    return baseScale  // Desktop
  }, [viewport.width])

  useEffect(() => {
    loadModel(setModel)
  }, [])

  useFrame(() => {
    if (ref.current) {
      time.current += 0.01
      const t = time.current
      // Responsive floating motion
      ref.current.position.x = Math.sin(t * speedX + offsetX) * range.x + Math.cos(t * speedY * 0.7) * (range.x * 0.3)
      ref.current.position.y = Math.sin(t * speedY + offsetY) * range.y + Math.cos(t * speedX * 0.5) * (range.y * 0.5)
      ref.current.position.z = Math.sin(t * 0.3) * 2
      // Tumbling rotation
      ref.current.rotation.y += 0.012
      ref.current.rotation.x += 0.008
      ref.current.rotation.z += 0.005
    }
  })

  if (!model) return null

  return <primitive ref={ref} object={model} scale={scale} position={[0, 0, 0]} />
})

// Memoize container style
const containerStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  zIndex: 5,
  pointerEvents: 'none',
  background: 'transparent',
}

export default memo(function RocketModel() {
  return (
    <div style={containerStyle}>
      <Canvas
        camera={{ position: [0, 0, 10], fov: 45 }}
        dpr={[1, 1.5]}
        performance={{ min: 0.5 }}
        gl={{ antialias: false, powerPreference: 'high-performance' }}
        style={{ pointerEvents: 'none' }}
        eventSource={null}
      >
        <ambientLight intensity={2} />
        <directionalLight position={[5, 5, 5]} intensity={2} />
        <Asteroid offsetX={0} offsetY={0} speedX={0.4} speedY={0.5} initialTime={0} />
        <Asteroid offsetX={3} offsetY={2} speedX={0.6} speedY={0.3} initialTime={50} />
      </Canvas>
    </div>
  )
})