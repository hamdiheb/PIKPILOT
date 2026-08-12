import { useEffect, useState } from 'react'
import { API_URL } from '../src/api'

export default function Filters(props) {
  const { genre, setGenre, setSearchMovie, total, loading } = props
  const [list, setList] = useState([])
  useEffect(() => {
    async function fetchList() {
      const request = await fetch(`${API_URL}/list`)
      const data = await request.json()
      setList(data.message.genres)
    }
    fetchList()
  }, [])

  return (
    <section className="shell pt-[44px] md:pt-[56px]">
      {/* The controls and the count they produce share one bar, so the filters
          read as the header of the results rather than a separate block. */}
      <article className="flex flex-wrap items-end justify-between gap-x-[18px] gap-y-[14px] border-b border-solid border-[#201E1D] pb-[16px]">
        <div className="flex flex-1 flex-wrap items-end gap-x-[18px] gap-y-[12px]">
          <label className="flex flex-col gap-[8px]">
            <span className="font-archivo text-[11px] font-extrabold tracking-[0.08em] text-[#EC3013] uppercase">
              Genre
            </span>

            <span className="relative inline-block">
              <select
                value={genre}
                onChange={(event) => setGenre(event.currentTarget.value)}
                className="font-archivo h-[42px] w-full cursor-pointer appearance-none border border-solid border-[#201E1D] bg-transparent pr-[38px] pl-[14px] text-[12px] font-extrabold tracking-[0.08em] text-[#201E1D] uppercase transition-colors duration-200 hover:border-[#EC3013] hover:text-[#EC3013] focus:border-[#EC3013] focus:outline-none"
              >
                <option value="">All genres</option>
                {list.map((element) => {
                  return (
                    <option value={element.id} key={element.id}>
                      {element.name}
                    </option>
                  )
                })}
              </select>

              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                className="pointer-events-none absolute top-1/2 right-[14px] -translate-y-1/2 text-[#201E1D]"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </span>
          </label>

          <label className="flex min-w-[180px] flex-1 flex-col gap-[8px] sm:max-w-[260px] sm:flex-none">
            <span className="font-archivo text-[11px] font-extrabold tracking-[0.08em] text-[#EC3013] uppercase">
              Search
            </span>

            <span className="relative block">
              <input
                type="text"
                placeholder="Search by name"
                name="search_name"
                onChange={(event) => setSearchMovie(event.currentTarget.value)}
                className="font-archivo h-[42px] w-full border border-solid border-[#201E1D] bg-transparent pr-[14px] pl-[38px] text-[12px] font-extrabold tracking-[0.08em] text-[#201E1D] uppercase transition-colors duration-200 placeholder:text-[#201E1D]/40 hover:border-[#EC3013] focus:border-[#EC3013] focus:text-[#EC3013] focus:outline-none"
              />

              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                className="pointer-events-none absolute top-1/2 left-[14px] -translate-y-1/2 text-[#201E1D]"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20l-4-4" />
              </svg>
            </span>
          </label>
        </div>

        <span className="font-archivo shrink-0 text-[11px] font-extrabold tracking-[0.08em] text-[#EC3013] uppercase">
          {loading ? 'Loading' : `${total.toLocaleString()} titles`}
        </span>
      </article>
    </section>
  )
}
