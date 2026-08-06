import { useState } from 'react'
import { Link } from 'react-router-dom'

const links = [
  { label: 'Browse', to: '' },
  { label: 'Movies', to: '' },
  { label: 'TV Shows', to: '' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="p-[12px]">
      <section className="flex items-center justify-between gap-4">
        <article>
          <Link to="/" className="font-archivo text-[20px] font-extrabold text-[#201E1D]">
            STREAMFINDER
          </Link>
        </article>

        <article className="hidden gap-4 md:flex">
          {links.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className="font-archivo text-[14px] text-[#201E1D] hover:text-[#EC3013]"
            >
              {link.label}
            </Link>
          ))}
        </article>

        <article className="hidden md:block">
          <Link
            to=""
            className="font-archivo text-[11px] text-[#EC3013] border border-solid border-[#EC3013] p-[5px]"
          >
            FREE & AD-SUPPORTED SOURCES
          </Link>
        </article>

        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
          className="text-[#201E1D] hover:text-[#EC3013] md:hidden"
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path d="M3 6h18M3 12h18M3 18h18" />
            )}
          </svg>
        </button>
      </section>

      {open && (
        <section className="flex flex-col items-start gap-4 pt-[16px] pb-[8px] md:hidden">
          {links.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              onClick={() => setOpen(false)}
              className="font-archivo text-[14px] text-[#201E1D] hover:text-[#EC3013]"
            >
              {link.label}
            </Link>
          ))}
          <Link
            to=""
            onClick={() => setOpen(false)}
            className="font-archivo text-[11px] text-[#EC3013] border border-solid border-[#EC3013] p-[5px]"
          >
            FREE & AD-SUPPORTED SOURCES
          </Link>
        </section>
      )}
    </nav>
  )
}
