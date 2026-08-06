import { Link } from 'react-router-dom'
export default function Navbar() {
  return (
    <section className="flex justify-between p-[12px]">
      <article>
        <Link to="/" className="font-archivo text-[20px] font-extrabold text-[#201E1D]">
          STREAMFINDER
        </Link>
      </article>
      <article className="flex gap-4">
        <Link to="" className="font-archivo text-[14px]  text-[#201E1D] hover:text-[#EC3013]">
          Browse
        </Link>
        <Link to="" className="font-archivo text-[14px]  text-[#201E1D] hover:text-[#EC3013]">
          Movies
        </Link>
        <Link to="" className="font-archivo text-[14px]  text-[#201E1D] hover:text-[#EC3013]">
          TV Shows
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
  )
}
