import { useState, useEffect } from 'react'
import Moviecomponent from './Moviecomponent'
import Pagebutton from './Pagebutton'
import { API_URL } from '../src/api'
export default function Movies(props) {
  const { movies, setMovies, genre, searchMovie, setTotal, loading, setLoading } = props
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
      setLoading(true)
      const req = await fetch(
        `${API_URL}/movies?page=${currentPage}` +
          `${genre ? `&genre=${genre}` : ''}` +
          `${debouncedSearch ? `&search=${encodeURIComponent(debouncedSearch)}` : ''}`,
      )
      const data = await req.json()
      if (!current) return
      setMovies(data.message.results)
      setLastPage(data.message.total_pages)
      setTotal(data.message.total_results ?? data.message.results.length)
      setLoading(false)
    }
    fetchMovies()

    return () => {
      current = false
    }
  }, [currentPage, genre, debouncedSearch])

  const gridClass =
    'mt-[32px] grid grid-cols-2 gap-x-[18px] gap-y-[38px] sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'

  return (
    <section className="shell pt-[4px] pb-[60px] md:pb-[80px]">
      {loading ? (
        // Placeholders hold the grid open while a page loads, so the footer does
        // not jump up and back down on every request.
        <article className={gridClass} aria-hidden="true">
          {Array.from({ length: 10 }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="aspect-[2/3] w-full bg-[#E3DED9]" />
              <div className="mt-[12px] h-[15px] w-[80%] bg-[#E3DED9]" />
              <div className="mt-[8px] h-[12px] w-[40%] bg-[#E3DED9]" />
            </div>
          ))}
        </article>
      ) : movies.length === 0 ? (
        <article className="mt-[32px] border border-solid border-[#201E1D]/15 px-[24px] py-[70px] text-center">
          <p className="font-archivo text-[18px] font-extrabold text-[#201E1D]">Nothing matched</p>
          <p className="font-archivo mt-[8px] text-[14px] text-[#5C5854]">
            Try a different genre, or a shorter search term.
          </p>
        </article>
      ) : (
        <article className={gridClass}>
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
      )}

      {lastPage > 1 && (
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

          {/* Fourteen buttons wrap into a block on a phone, so the numbered
              window is desktop only and small screens get a position readout. */}
          <span className="font-archivo px-[10px] text-[12px] font-extrabold tracking-[0.08em] text-[#201E1D] uppercase sm:hidden">
            {currentPage} / {lastPage}
          </span>
          <div className="hidden flex-wrap items-center justify-center gap-[8px] sm:flex">
            {pageButton}
          </div>

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
      )}
    </section>
  )
}
