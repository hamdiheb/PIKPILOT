import Hero from '../components/Hero'
import Filters from '../components/Filters'
import Movies from '../components/Movies'
import { useState } from 'react'
export default function Home() {
  const [movies, setMovies] = useState([])
  const [genre, setGenre] = useState('')
  const [searchMovie, setSearchMovie] = useState('')

  // Movies owns the request, but the count and the loading state are shown in
  // the filter bar above it, so both live here.
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  return (
    <>
      <Hero />
      <Filters
        genre={genre}
        setGenre={setGenre}
        setSearchMovie={setSearchMovie}
        total={total}
        loading={loading}
      />
      <Movies
        movies={movies}
        setMovies={setMovies}
        genre={genre}
        searchMovie={searchMovie}
        setTotal={setTotal}
        loading={loading}
        setLoading={setLoading}
      />
    </>
  )
}
