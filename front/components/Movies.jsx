import { useState, useEffect } from 'react'
import Moviecomponent from './Moviecomponent'

export default function Movies() {
  const [movies, setMovies] = useState([])

  useEffect(() => {
    async function fetchMovies() {
      const req = await fetch('http://localhost:3000/movies')
      const data = await req.json()
      setMovies(data.message.results)
    }
    fetchMovies()
  }, [])

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
    </section>
  )
}
