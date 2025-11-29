import { memo, useState } from 'react'

const ResumeDownload = memo(function ResumeDownload({ isMobile }) {
  const [isHovered, setIsHovered] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownload = () => {
    setIsDownloading(true)
    
    // Create a link to download the resume
    const link = document.createElement('a')
    link.href = '/resume/Samardhh_Resume.pdf'
    link.download = 'Samardhh_Reddy_Resume.pdf'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    // Reset downloading state after animation
    setTimeout(() => setIsDownloading(false), 2000)
  }

  const buttonSize = isMobile ? '40px' : '50px'
  const iconSize = isMobile ? '18px' : '22px'

  return (
    <div
      style={{
        position: 'fixed',
        bottom: isMobile ? '180px' : '30px',
        left: isMobile ? '15px' : '30px',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '10px',
      }}
    >
      {/* Download Button */}
      <button
        onClick={handleDownload}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          width: buttonSize,
          height: buttonSize,
          borderRadius: '50%',
          border: '2px solid rgba(100, 200, 255, 0.6)',
          background: isDownloading 
            ? 'linear-gradient(135deg, rgba(100, 200, 255, 0.4), rgba(138, 43, 226, 0.3))'
            : isHovered
              ? 'linear-gradient(135deg, rgba(100, 200, 255, 0.3), rgba(138, 43, 226, 0.2))'
              : 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(10px)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s ease',
          transform: isHovered ? 'scale(1.1)' : 'scale(1)',
          boxShadow: isHovered || isDownloading
            ? '0 0 25px rgba(100, 200, 255, 0.6), 0 0 50px rgba(138, 43, 226, 0.4)'
            : '0 4px 15px rgba(0, 0, 0, 0.3)',
          animation: isDownloading ? 'pulse 0.5s ease-in-out' : 'none',
        }}
        title="Download Resume"
      >
        {isDownloading ? (
          // Checkmark Icon
          <svg
            width={iconSize}
            height={iconSize}
            viewBox="0 0 24 24"
            fill="none"
            stroke="rgba(100, 255, 150, 0.9)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : (
          // Download/Resume Icon
          <svg
            width={iconSize}
            height={iconSize}
            viewBox="0 0 24 24"
            fill="none"
            stroke="rgba(100, 200, 255, 0.9)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Document shape */}
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            {/* Download arrow */}
            <line x1="12" y1="11" x2="12" y2="17" />
            <polyline points="9 14 12 17 15 14" />
          </svg>
        )}
      </button>

      {/* Label */}
      <span
        style={{
          fontSize: isMobile ? '8px' : '10px',
          color: isDownloading ? 'rgba(100, 255, 150, 0.9)' : 'rgba(100, 200, 255, 0.7)',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          fontFamily: '"Orbitron", sans-serif',
          textShadow: isDownloading 
            ? '0 0 10px rgba(100, 255, 150, 0.5)'
            : '0 0 10px rgba(100, 200, 255, 0.5)',
          transition: 'all 0.3s ease',
        }}
      >
        {isDownloading ? '✓ Done!' : 'Resume'}
      </span>

      {/* CSS Animation */}
      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  )
})

export default ResumeDownload
