import { useEffect, useRef, memo } from 'react'

const PI2 = Math.PI * 2

export default memo(function ParticlesBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d', { alpha: false })
    let width = canvas.width = window.innerWidth
    let height = canvas.height = window.innerHeight

    // Create particles with pre-calculated values
    const particleCount = 50
    const particles = new Array(particleCount)

    for (let i = 0; i < particleCount; i++) {
      const opacity = Math.random() * 0.5 + 0.3
      particles[i] = {
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 0.8 + 0.2,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        opacityHex: Math.floor(opacity * 255).toString(16).padStart(2, '0'),
      }
    }

    // Debounced resize handler
    let resizeTimeout
    const handleResize = () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(() => {
        width = canvas.width = window.innerWidth
        height = canvas.height = window.innerHeight
      }, 100)
    }

    window.addEventListener('resize', handleResize, { passive: true })

    // Animation loop with optimizations
    let animationId
    const animate = () => {
      animationId = requestAnimationFrame(animate)

      // Clear canvas completely - no trailing effect
      ctx.fillStyle = '#000000'
      ctx.fillRect(0, 0, width, height)

      // Update and draw particles
      for (let i = 0; i < particleCount; i++) {
        const p = particles[i]
        p.x += p.speedX
        p.y += p.speedY

        // Wrap around edges
        if (p.x > width) p.x = 0
        else if (p.x < 0) p.x = width
        if (p.y > height) p.y = 0
        else if (p.y < 0) p.y = height

        // Gentle random wobble
        p.speedX += (Math.random() - 0.5) * 0.02
        p.speedY += (Math.random() - 0.5) * 0.02

        // Limit speed
        if (p.speedX > 0.5) p.speedX = 0.5
        else if (p.speedX < -0.5) p.speedX = -0.5
        if (p.speedY > 0.5) p.speedY = 0.5
        else if (p.speedY < -0.5) p.speedY = -0.5

        const glowSize = p.size * 3

        // Draw particle with glow
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowSize)
        gradient.addColorStop(0, '#FFFFFF' + p.opacityHex)
        gradient.addColorStop(1, '#FFFFFF00')

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(p.x, p.y, glowSize, 0, PI2)
        ctx.fill()

        // Core particle
        ctx.fillStyle = '#FFFFFFFF'
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, PI2)
        ctx.fill()
      }
    }

    animate()

    return () => {
      cancelAnimationFrame(animationId)
      clearTimeout(resizeTimeout)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
        display: 'block',
        pointerEvents: 'none',
      }}
    />
  )
})
