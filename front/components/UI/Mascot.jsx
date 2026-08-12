import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

import './Mascot.css'

/* eye centres in viewBox units — must match the <circle> positions below */
const EYES = [
  { cx: 17.5, cy: 23 },
  { cx: 30.5, cy: 23 },
]
const MAX_OFFSET = 2.3

export default function Mascot({ size = 40, className = '' }) {
  const svgRef = useRef(null)
  const pupilRefs = useRef([])

  useEffect(() => {
    if (typeof window === 'undefined') return undefined

    const svg = svgRef.current
    const pupils = pupilRefs.current.filter(Boolean)
    if (!svg || pupils.length !== EYES.length) return undefined

    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return undefined

    const movers = pupils.map((pupil) => ({
      x: gsap.quickTo(pupil, 'x', { duration: 0.35, ease: 'power3.out' }),
      y: gsap.quickTo(pupil, 'y', { duration: 0.35, ease: 'power3.out' }),
    }))

    let rect = svg.getBoundingClientRect()
    const measure = () => {
      rect = svg.getBoundingClientRect()
    }

    const look = (event) => {
      if (!rect.width || !rect.height) return

      /* viewBox is 48x48, so one user unit is rect.width / 48 screen px */
      const unit = rect.width / 48

      EYES.forEach((eye, index) => {
        const eyeX = rect.left + eye.cx * unit
        const eyeY = rect.top + eye.cy * unit
        const dx = event.clientX - eyeX
        const dy = event.clientY - eyeY
        const distance = Math.hypot(dx, dy)
        if (!distance) return

        /* ease the pull in so far-away pointers still peg the eye at the rim */
        const reach = Math.min(1, distance / (140 * unit))
        const pull = (MAX_OFFSET * reach) / distance

        movers[index].x(dx * pull)
        movers[index].y(dy * pull * 0.85)
      })
    }

    measure()
    window.addEventListener('pointermove', look, { passive: true })
    window.addEventListener('resize', measure, { passive: true })
    window.addEventListener('scroll', measure, { passive: true })

    return () => {
      window.removeEventListener('pointermove', look)
      window.removeEventListener('resize', measure)
      window.removeEventListener('scroll', measure)
      gsap.killTweensOf(pupils)
    }
  }, [])

  return (
    <svg
      ref={svgRef}
      className={`mascot ${className}`.trim()}
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      role="img"
      aria-label="PikPilot mascot"
    >
      <g className="mascot-body">
        {/* antenna */}
        <path d="M24 10V5" stroke="#201E1D" strokeWidth="2.5" strokeLinecap="square" />
        <circle className="mascot-signal" cx="24" cy="3.5" r="2.5" fill="#EC3013" />

        {/* screen head */}
        <rect
          x="6.25"
          y="10.25"
          width="35.5"
          height="27.5"
          fill="#EC3013"
          stroke="#201E1D"
          strokeWidth="2.5"
        />

        {/* eyes */}
        <g className="mascot-eye" style={{ transformOrigin: '17.5px 23px' }}>
          <circle cx="17.5" cy="23" r="6" fill="#F5F2F0" stroke="#201E1D" strokeWidth="2" />
          <circle
            ref={(node) => {
              pupilRefs.current[0] = node
            }}
            className="mascot-pupil"
            cx="17.5"
            cy="23"
            r="2.6"
            fill="#201E1D"
          />
        </g>
        <g className="mascot-eye" style={{ transformOrigin: '30.5px 23px' }}>
          <circle cx="30.5" cy="23" r="6" fill="#F5F2F0" stroke="#201E1D" strokeWidth="2" />
          <circle
            ref={(node) => {
              pupilRefs.current[1] = node
            }}
            className="mascot-pupil"
            cx="30.5"
            cy="23"
            r="2.6"
            fill="#201E1D"
          />
        </g>

        {/* mouth */}
        <path d="M18 32.5H30" stroke="#201E1D" strokeWidth="2.5" strokeLinecap="square" />

        {/* feet */}
        <path d="M13 38V42M35 38V42" stroke="#201E1D" strokeWidth="2.5" strokeLinecap="square" />
      </g>
    </svg>
  )
}
