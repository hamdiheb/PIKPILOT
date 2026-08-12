import Hero from '../components/Hero'
import Filters from '../components/Filters'
import Movies from '../components/Movies'
import { use, useState } from 'react'
export default function Home() {
  const [movies, setMovies] = useState([])
  const [genre, setGenre] = useState('')
  const [searchMovie, setSearchMovie] = useState('')
  console.log(searchMovie)
  return (
    <>
      <Hero />
      <Filters genre={genre} setGenre={setGenre} setSearchMovie={setSearchMovie} />
      <Movies movies={movies} setMovies={setMovies} genre={genre} searchMovie={searchMovie} />

      <section className="flex"></section>
    </>
  )
}
