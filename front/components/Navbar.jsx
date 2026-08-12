import { Link } from 'react-router-dom'
import Mascot from './UI/Mascot'

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-solid border-[#201E1D]/10 bg-[#F5F2F0]">
      <section className="shell flex flex-col items-center justify-center gap-3 py-[12px] sm:flex-row sm:gap-4">
        <article>
          <Link
            to="/"
            className="mascot-link font-archivo flex items-center gap-[10px] text-[20px] font-extrabold text-[#201E1D]"
          >
            <Mascot size={38} />
            PIKPILOT
          </Link>
        </article>

        <article>
          <Link
            to=""
            className="font-archivo text-[11px] text-[#EC3013] border border-solid border-[#EC3013] p-[5px]"
          >
            FREE & AD-SUPPORTED SOURCES
          </Link>
        </article>
      </section>
    </nav>
  )
}
