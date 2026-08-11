import Hero from '../components/Hero'
import Filters from '../components/Filters'
import Movies from '../components/Movies'
import { useState } from 'react'
export default function Home() {
  const [movies, setMovies] = useState([])
  return (
    <>
      <Hero />
      <Filters movies={movies} setMovies={setMovies} />
      <Movies movies={movies} setMovies={setMovies} />

      <section className="flex"></section>
    </>
  )
}
