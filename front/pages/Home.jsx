import Hero from '../components/Hero'
import Filters from '../components/Filters'
import Main from '../components/Main'
export default function Home() {
  return (
    <>
      <Hero />

      <section className="flex">
        <Filters />
        <Main />
      </section>
    </>
  )
}
