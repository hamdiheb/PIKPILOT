import Hero from '../components/Hero'
import Filters from '../components/Filters'
import Movies from '../components/Movies'
import { useState } from 'react'
export default function Home() {
  const [movies, setMovies] = useState([])
  const [genre, setGenre] = useState('')
  return (
    <>
      <Hero />
      <Filters genre={genre} setGenre={setGenre} />
      <Movies movies={movies} setMovies={setMovies} genre={genre} />

      <section className="flex"></section>
    </>
  )
}
