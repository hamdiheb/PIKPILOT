import { useEffect, useState } from 'react'

const GENRES = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Sci-Fi',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western',
}

const languageName = new Intl.DisplayNames(['en'], { type: 'language' })

export default function Content() {
  const [data, setData] = useState([])
  useEffect(() => {
    fetch('https://api.themoviedb.org/3/discover/movie', {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhZmZhNWNhMTAxNzRmYjcwYWFhNjEwMTYxNDY2NzllOSIsIm5iZiI6MTc4NjAxOTQ5MS45NjEsInN1YiI6IjZhNzQ3ZWEzMzcyMzFmZWEwZThiMDk2MSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.9x8zZ3qwCPzbBiGF54DPzzfrdoZv7v-svSvCTwEQXOs',
      },
    })
      .then((response) => response.json())
      .then((res) => setData(res.results))
  }, [])

  const article = data.map((element) => {
    const genres = (element.genre_ids ?? []).map((id) => GENRES[id]).filter(Boolean).slice(0, 2)

    return (
      <section key={element.id} className="w-full max-w-[290px]">
        <figure className="relative aspect-[2/3] w-full border border-dashed border-[#B8B2AC] bg-[#E9E5E2]">
          <figcaption className="absolute left-[10px] top-[10px] z-10 bg-[#FBD9D4] px-[8px] py-[4px] text-[10px] font-bold uppercase tracking-[0.12em] text-[#EC3013]">
            Movie
          </figcaption>

          {element.poster_path ? (
            <img
              src={`https://image.tmdb.org/t/p/w500${element.poster_path}`}
              alt={element.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <section className="flex h-full w-full flex-col items-center justify-center gap-[10px] px-[16px] text-center">
              <svg
                aria-hidden="true"
                width="34"
                height="34"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="text-[#8A8580]"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="M21 15l-5-5L5 21" />
              </svg>
              <p className="text-[13px] text-[#8A8580]">{element.title}</p>
            </section>
          )}
        </figure>

        <section className="pt-[12px]">
          <h2 className="text-[16px] font-extrabold text-[#201E1D]">{element.title}</h2>

          <p className="pt-[4px] text-[12px] text-[#8A8580]">
            {element.release_date?.slice(0, 4)} <span className="px-[4px]">·</span>{' '}
            {languageName.of(element.original_language)}
            <span className="px-[4px]">·</span>
            <span className="text-[#EC3013]">★</span> {element.vote_average?.toFixed(1)}
          </p>

          <ul className="flex flex-wrap gap-[8px] pt-[12px]">
            {genres.map((genre) => (
              <li
                key={genre}
                className="border border-solid border-[#D8D2CD] bg-[#F5F2F0] px-[10px] py-[4px] text-[12px] text-[#201E1D]"
              >
                {genre}
              </li>
            ))}
          </ul>
        </section>
      </section>
    )
  })

  return (
    <article className="font-archivo grid w-full grid-cols-1 gap-[24px] sm:grid-cols-2 md:grid-cols-3">
      {article}
    </article>
  )
}
