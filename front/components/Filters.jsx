import { use, useEffect, useState } from 'react'

export default function Filters(props) {
  const { genre, setGenre, setSearchMovie } = props
  const [list, setList] = useState([])
  useEffect(() => {
    async function fetchList() {
      const request = await fetch('http://localhost:3000/list')
      const data = await request.json()
      setList(data.message.genres)
    }
    fetchList()
  }, [])

  return (
    <section className="bg-[#F5F2F0] px-[6%] pt-[60px] md:px-[16%] md:pt-[80px]">
      <article className="flex flex-wrap items-end gap-x-[18px] gap-y-[12px]">
        <label className="flex flex-col gap-[8px]">
          <span className="font-archivo text-[11px] font-extrabold tracking-[0.08em] text-[#EC3013] uppercase">
            Genre
          </span>

          <span className="relative inline-block">
            <select
              onChange={(event) => setGenre(event.currentTarget.value)}
              className="font-archivo h-[42px] cursor-pointer appearance-none border border-solid border-[#201E1D] bg-transparent pr-[38px] pl-[14px] text-[12px] font-extrabold tracking-[0.08em] text-[#201E1D] uppercase transition-colors duration-200 hover:border-[#EC3013] hover:text-[#EC3013] focus:border-[#EC3013] focus:outline-none"
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

        <label className="flex flex-col gap-[8px]">
          <span className="font-archivo text-[11px] font-extrabold tracking-[0.08em] text-[#EC3013] uppercase">
            Search
          </span>

          <span className="relative inline-block">
            <input
              type="text"
              placeholder="Search by name"
              name="search_name"
              onChange={(event) => setSearchMovie(event.currentTarget.value)}
              className="font-archivo h-[42px] w-[240px] border border-solid border-[#201E1D] bg-transparent pr-[14px] pl-[38px] text-[12px] font-extrabold tracking-[0.08em] text-[#201E1D] uppercase transition-colors duration-200 placeholder:text-[#201E1D]/40 hover:border-[#EC3013] focus:border-[#EC3013] focus:text-[#EC3013] focus:outline-none"
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
      </article>
    </section>
  )
}
