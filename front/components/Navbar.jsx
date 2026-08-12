import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="p-[12px]">
      <section className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
        <article>
          <Link to="/" className="font-archivo text-[20px] font-extrabold text-[#201E1D]">
            STREAMFINDER
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
