import { useState, useRef, useEffect, memo } from 'react'

const BackgroundMusic = memo(function BackgroundMusic({ isMobile }) {
  const audioRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0.3)
  const [showVolumeSlider, setShowVolumeSlider] = useState(false)

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play().catch(err => {
          console.log('Audio play failed:', err)
        })
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    if (audioRef.current) {
      audioRef.current.volume = newVolume
    }
  }

  const buttonSize = isMobile ? '40px' : '50px'
  const iconSize = isMobile ? '18px' : '22px'

  return (
    <>
      {/* Audio Element */}
      <audio
        ref={audioRef}
        loop
        preload="auto"
        src="/audio/space-ambient.mp3"
      />

      {/* Music Control Button */}
      <div
        style={{
          position: 'fixed',
          bottom: isMobile ? '180px' : '30px',
          right: isMobile ? '15px' : '30px',
          zIndex: 100,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '10px',
        }}
        onMouseEnter={() => !isMobile && setShowVolumeSlider(true)}
        onMouseLeave={() => !isMobile && setShowVolumeSlider(false)}
      >
        {/* Volume Slider */}
        {showVolumeSlider && (
          <div
            style={{
              background: 'rgba(0, 0, 0, 0.7)',
              backdropFilter: 'blur(10px)',
              borderRadius: '20px',
              padding: '15px 10px',
              border: '1px solid rgba(255, 200, 100, 0.3)',
            }}
          >
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={handleVolumeChange}
              style={{
                writingMode: 'vertical-lr',
                direction: 'rtl',
                width: '8px',
                height: '80px',
                cursor: 'pointer',
                accentColor: '#FFD700',
              }}
            />
          </div>
        )}

        {/* Play/Pause Button */}
        <button
          onClick={togglePlay}
          style={{
            width: buttonSize,
            height: buttonSize,
            borderRadius: '50%',
            border: '2px solid rgba(255, 200, 100, 0.6)',
            background: isPlaying 
              ? 'linear-gradient(135deg, rgba(255, 170, 0, 0.3), rgba(138, 43, 226, 0.3))'
              : 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(10px)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease',
            boxShadow: isPlaying 
              ? '0 0 20px rgba(255, 170, 0, 0.5), 0 0 40px rgba(138, 43, 226, 0.3)'
              : '0 4px 15px rgba(0, 0, 0, 0.3)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)'
            e.currentTarget.style.boxShadow = '0 0 25px rgba(255, 170, 0, 0.6), 0 0 50px rgba(138, 43, 226, 0.4)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)'
            e.currentTarget.style.boxShadow = isPlaying 
              ? '0 0 20px rgba(255, 170, 0, 0.5), 0 0 40px rgba(138, 43, 226, 0.3)'
              : '0 4px 15px rgba(0, 0, 0, 0.3)'
          }}
          title={isPlaying ? 'Pause Music' : 'Play Space Music'}
        >
          {isPlaying ? (
            // Pause Icon
            <svg
              width={iconSize}
              height={iconSize}
              viewBox="0 0 24 24"
              fill="none"
              stroke="rgba(255, 200, 100, 0.9)"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <rect x="6" y="4" width="4" height="16" fill="rgba(255, 200, 100, 0.9)" />
              <rect x="14" y="4" width="4" height="16" fill="rgba(255, 200, 100, 0.9)" />
            </svg>
          ) : (
            // Play Icon (Musical Note)
            <svg
              width={iconSize}
              height={iconSize}
              viewBox="0 0 24 24"
              fill="rgba(255, 200, 100, 0.9)"
            >
              <path d="M9 18V5l12-2v13" stroke="rgba(255, 200, 100, 0.9)" strokeWidth="2" fill="none"/>
              <circle cx="6" cy="18" r="3" fill="rgba(255, 200, 100, 0.9)"/>
              <circle cx="18" cy="16" r="3" fill="rgba(255, 200, 100, 0.9)"/>
            </svg>
          )}
        </button>

        {/* Label */}
        <span
          style={{
            fontSize: isMobile ? '8px' : '10px',
            color: 'rgba(255, 200, 100, 0.7)',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            fontFamily: '"Orbitron", sans-serif',
            textShadow: '0 0 10px rgba(255, 170, 0, 0.5)',
          }}
        >
          {isPlaying ? '♪ Playing' : 'Music'}
        </span>
      </div>

      {/* Animated music waves when playing */}
      {isPlaying && (
        <div
          style={{
            position: 'fixed',
            bottom: isMobile ? '225px' : '85px',
            right: isMobile ? '22px' : '42px',
            display: 'flex',
            alignItems: 'flex-end',
            gap: '3px',
            height: '20px',
          }}
        >
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                width: '3px',
                background: 'linear-gradient(to top, #FFD700, #FF6B00)',
                borderRadius: '2px',
                animation: `musicWave 0.8s ease-in-out infinite`,
                animationDelay: `${i * 0.15}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* CSS Animation */}
      <style>{`
        @keyframes musicWave {
          0%, 100% {
            height: 5px;
          }
          50% {
            height: 18px;
          }
        }
      `}</style>
    </>
  )
})

export default BackgroundMusic
