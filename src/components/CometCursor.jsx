import { useEffect, useRef } from 'react'

const CometCursor = () => {
  const cursorRef = useRef(null)
  const trailsRef = useRef([])
  const positionRef = useRef({ x: 0, y: 0 })
  const trailCount = 8

  // Create click blast effect
  const createBlast = (x, y) => {
    const particleCount = 12
    const colors = ['#ffffff', '#fff8e7', '#ffd700', '#ffaa00', '#ff6600', '#00ffff']
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div')
      particle.className = 'blast-particle'
      
      // Random angle and distance
      const angle = (i / particleCount) * Math.PI * 2
      const velocity = 80 + Math.random() * 60
      const size = 4 + Math.random() * 6
      const color = colors[Math.floor(Math.random() * colors.length)]
      
      particle.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        width: ${size}px;
        height: ${size}px;
        background: radial-gradient(circle, ${color} 0%, transparent 70%);
        border-radius: 50%;
        pointer-events: none;
        z-index: 999999;
        box-shadow: 0 0 ${size}px ${color}, 0 0 ${size * 2}px ${color};
        transform: translate(-50%, -50%);
      `
      
      document.body.appendChild(particle)
      
      // Animate particle
      const destX = x + Math.cos(angle) * velocity
      const destY = y + Math.sin(angle) * velocity
      
      particle.animate([
        { 
          left: `${x}px`, 
          top: `${y}px`, 
          opacity: 1,
          transform: 'translate(-50%, -50%) scale(1)'
        },
        { 
          left: `${destX}px`, 
          top: `${destY}px`, 
          opacity: 0,
          transform: 'translate(-50%, -50%) scale(0.2)'
        }
      ], {
        duration: 400 + Math.random() * 200,
        easing: 'cubic-bezier(0, 0.5, 0.5, 1)'
      }).onfinish = () => {
        if (particle.parentNode) {
          document.body.removeChild(particle)
        }
      }
    }
    
    // Create central flash
    const flash = document.createElement('div')
    flash.style.cssText = `
      position: fixed;
      left: ${x}px;
      top: ${y}px;
      width: 30px;
      height: 30px;
      background: radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(255,255,255,0.8) 20%, rgba(255,200,100,0.4) 50%, transparent 70%);
      border-radius: 50%;
      pointer-events: none;
      z-index: 999999;
      transform: translate(-50%, -50%);
      box-shadow: 0 0 20px #fff, 0 0 40px rgba(255,200,100,0.8);
    `
    document.body.appendChild(flash)
    
    flash.animate([
      { transform: 'translate(-50%, -50%) scale(0.5)', opacity: 1 },
      { transform: 'translate(-50%, -50%) scale(2)', opacity: 0 }
    ], {
      duration: 300,
      easing: 'ease-out'
    }).onfinish = () => {
      if (flash.parentNode) {
        document.body.removeChild(flash)
      }
    }
    
    // Create star burst
    const starCount = 6
    for (let i = 0; i < starCount; i++) {
      const star = document.createElement('div')
      const angle = (i / starCount) * Math.PI * 2
      const distance = 40 + Math.random() * 30
      
      star.innerHTML = '✦'
      star.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        font-size: 12px;
        color: #fff;
        text-shadow: 0 0 5px #fff, 0 0 10px #ffd700;
        pointer-events: none;
        z-index: 999999;
        transform: translate(-50%, -50%);
      `
      document.body.appendChild(star)
      
      const destX = x + Math.cos(angle) * distance
      const destY = y + Math.sin(angle) * distance
      
      star.animate([
        { left: `${x}px`, top: `${y}px`, opacity: 1, transform: 'translate(-50%, -50%) scale(1) rotate(0deg)' },
        { left: `${destX}px`, top: `${destY}px`, opacity: 0, transform: 'translate(-50%, -50%) scale(0) rotate(180deg)' }
      ], {
        duration: 500,
        easing: 'ease-out'
      }).onfinish = () => {
        if (star.parentNode) {
          document.body.removeChild(star)
        }
      }
    }
  }

  useEffect(() => {
    // Check if touch device
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    
    // Click blast effect for all devices
    const handleClick = (e) => {
      createBlast(e.clientX, e.clientY)
    }
    
    const handleTouchStart = (e) => {
      if (e.touches.length > 0) {
        createBlast(e.touches[0].clientX, e.touches[0].clientY)
      }
    }
    
    window.addEventListener('click', handleClick)
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    
    if (isTouchDevice) {
      return () => {
        window.removeEventListener('click', handleClick)
        window.removeEventListener('touchstart', handleTouchStart)
      }
    }

    // Create cursor element
    const cursor = document.createElement('div')
    cursor.className = 'comet-cursor'
    document.body.appendChild(cursor)
    cursorRef.current = cursor

    // Create trail elements
    for (let i = 0; i < trailCount; i++) {
      const trail = document.createElement('div')
      trail.className = 'comet-trail'
      trail.style.opacity = (1 - i / trailCount) * 0.7
      trail.style.width = `${8 - i * 0.5}px`
      trail.style.height = `${8 - i * 0.5}px`
      document.body.appendChild(trail)
      trailsRef.current.push({
        element: trail,
        x: 0,
        y: 0
      })
    }

    // Trail positions history
    const positions = []

    const handleMouseMove = (e) => {
      positionRef.current = { x: e.clientX, y: e.clientY }
      
      // Update main cursor immediately
      if (cursorRef.current) {
        cursorRef.current.style.left = `${e.clientX}px`
        cursorRef.current.style.top = `${e.clientY}px`
      }

      // Store position for trail
      positions.unshift({ x: e.clientX, y: e.clientY })
      if (positions.length > trailCount * 3) {
        positions.pop()
      }
    }

    // Animate trails with delay
    let animationId
    const animateTrails = () => {
      trailsRef.current.forEach((trail, index) => {
        const delay = (index + 1) * 3
        const pos = positions[delay] || positions[positions.length - 1] || { x: 0, y: 0 }
        
        // Smooth interpolation
        trail.x += (pos.x - trail.x) * 0.3
        trail.y += (pos.y - trail.y) * 0.3
        
        trail.element.style.left = `${trail.x}px`
        trail.element.style.top = `${trail.y}px`
      })
      
      animationId = requestAnimationFrame(animateTrails)
    }
    
    animateTrails()
    window.addEventListener('mousemove', handleMouseMove, { passive: true })

    // Handle cursor leaving/entering window
    const handleMouseLeave = () => {
      if (cursorRef.current) cursorRef.current.style.opacity = '0'
      trailsRef.current.forEach(t => t.element.style.opacity = '0')
    }

    const handleMouseEnter = () => {
      if (cursorRef.current) cursorRef.current.style.opacity = '1'
      trailsRef.current.forEach((t, i) => {
        t.element.style.opacity = (1 - i / trailCount) * 0.7
      })
    }

    document.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('mouseenter', handleMouseEnter)

    return () => {
      window.removeEventListener('click', handleClick)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('mouseenter', handleMouseEnter)
      cancelAnimationFrame(animationId)
      
      if (cursorRef.current) {
        document.body.removeChild(cursorRef.current)
      }
      trailsRef.current.forEach(t => {
        if (t.element.parentNode) {
          document.body.removeChild(t.element)
        }
      })
      trailsRef.current = []
    }
  }, [])

  return null // This component doesn't render anything visible
}

export default CometCursor
