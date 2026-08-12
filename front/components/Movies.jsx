import { useState, useEffect } from 'react'
import Moviecomponent from './Moviecomponent'
import Pagebutton from './Pagebutton'
export default function Movies(props) {
  const { movies, setMovies, genre, searchMovie } = props
  const WINDOW = 10

  const [currentPage, setCurrentPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)

  // The window is derived from currentPage, so it centers on the page you are
  // on and slides in both directions instead of only forward.
  const start = Math.max(1, Math.min(currentPage - Math.floor(WINDOW / 2), lastPage - WINDOW + 1))
  const pageButton = []

  // Every keystroke would otherwise be a round trip, so the search term only
  // reaches the request once typing pauses.
  const [debouncedSearch, setDebouncedSearch] = useState(searchMovie)
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchMovie), 400)
    return () => clearTimeout(timer)
  }, [searchMovie])

  // A new genre or search term means a different result set, so the page we are
  // on no longer exists in it. Resetting during render rather than in an effect
  // keeps the fetch below from firing once for the old page and again for page 1.
  const filters = `${genre}|${debouncedSearch}`
  const [prevFilters, setPrevFilters] = useState(filters)
  if (filters !== prevFilters) {
    setPrevFilters(filters)
    setCurrentPage(1)
  }

  for (let i = start; i < start + WINDOW && i <= lastPage; i++) {
    pageButton.push(
      <Pagebutton key={i} value={i} isActive={i === currentPage} setCurrentPage={setCurrentPage} />,
    )
  }
  useEffect(() => {
    // Responses can land out of order once the term changes mid-flight, so a
    // superseded request is not allowed to write its results.
    let current = true

    async function fetchMovies() {
      const req = await fetch(
        `http://localhost:3000/movies?page=${currentPage}` +
          `${genre ? `&genre=${genre}` : ''}` +
          `${debouncedSearch ? `&search=${encodeURIComponent(debouncedSearch)}` : ''}`,
      )
      const data = await req.json()
      if (!current) return
      setMovies(data.message.results)
      setLastPage(data.message.total_pages)
    }
    fetchMovies()

    return () => {
      current = false
    }
  }, [currentPage, genre, debouncedSearch])

  return (
    <section className="bg-[#F5F2F0] px-[6%] py-[60px] md:px-[16%] md:py-[80px]">
      <article className="flex items-end justify-between gap-4 border-b border-solid border-[#201E1D] pb-[14px]">
        <span className="font-archivo shrink-0 text-[11px] font-extrabold tracking-[0.08em] text-[#EC3013] uppercase">
          {movies.length} titles
        </span>
      </article>

      <article className="mt-[32px] grid grid-cols-2 gap-x-[18px] gap-y-[38px] sm:grid-cols-3 lg:grid-cols-4">
        {movies.map((movie) => (
          <Moviecomponent
            key={movie.id}
            title={movie.title}
            original_language={movie.original_language}
            overview={movie.overview}
            poster_path={movie.poster_path}
            release_date={movie.release_date}
            vote_average={movie.vote_average}
            id={movie.id}
          />
        ))}
      </article>
      <article className="mt-[40px] flex flex-wrap items-center justify-center gap-[8px] border-t border-solid border-[#201E1D] pt-[28px]">
        <Pagebutton
          value={1}
          label="First"
          disabled={currentPage === 1}
          setCurrentPage={setCurrentPage}
        />
        <Pagebutton
          value={currentPage - 1}
          label="Prev"
          disabled={currentPage === 1}
          setCurrentPage={setCurrentPage}
        />
        {pageButton}
        <Pagebutton
          value={currentPage + 1}
          label="Next"
          disabled={currentPage === lastPage}
          setCurrentPage={setCurrentPage}
        />
        <Pagebutton
          value={lastPage}
          label="Last"
          disabled={currentPage === lastPage}
          setCurrentPage={setCurrentPage}
        />
      </article>
    </section>
  )
}
