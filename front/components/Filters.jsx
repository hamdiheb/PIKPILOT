export default function Filters() {
  function filtertype(event) {
    console.log(event.target.value)
  }
  return (
    <aside className="bg-[#F5F2F0] px-[6%] py-[24px] md:px-[16%]">
      <article className="relative max-w-[240px]">
        <label
          htmlFor="filter-type"
          className="font-archivo block text-[11px] font-bold uppercase tracking-[0.12em] text-[#8A8580]"
        >
          Type
        </label>

        <select
          id="filter-type"
          name="type"
          onChange={(event) => filtertype(event)}
          className="font-archivo mt-[8px] h-[46px] w-full cursor-pointer appearance-none border border-solid border-[#D8D2CD] bg-white pl-[14px] pr-[38px] text-[14px] text-[#201E1D] accent-[#EC3013] focus:border-[#EC3013] focus:outline-none"
        >
          <option value="All">All</option>
          <option value="Movie">Movie</option>
          <option value="Tv Show">TV Show</option>
        </select>

        <svg
          aria-hidden="true"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="pointer-events-none absolute bottom-[15px] right-[14px] text-[#EC3013]"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </article>
    </aside>
  )
}
