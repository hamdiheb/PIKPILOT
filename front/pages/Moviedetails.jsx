import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { API_URL } from '../src/api'
import { watchLink } from '../src/watchLinks'

const money = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

// TMDB groups the sources by how you pay for them. Free and ad-supported come
// first because that is what the site says it is for; rent and buy come last.
const WATCH_GROUPS = [
  ['free', 'Free'],
  ['ads', 'Free with ads'],
  ['flatrate', 'Streaming'],
  ['rent', 'Rent'],
  ['buy', 'Buy'],
]

// Availability is per country — the same film streams in one and is rent-only
// in the next — so the country has to come from the visitor rather than a
// hardcoded 'US'. A language tag without a region ("en") yields nothing, which
// the caller falls back from.
function browserCountry() {
  try {
    return new Intl.Locale(navigator.language).region ?? ''
  } catch {
    return ''
  }
}

function countryName(code) {
  try {
    return new Intl.DisplayNames([navigator.language], { type: 'region' }).of(code)
  } catch {
    return code
  }
}

export default function Moviedetails() {
  const { id } = useParams()
  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Holds the country only once the visitor picks one by hand. Leaving it empty
  // by default means the choice below is derived from what this film actually
  // has, so it never needs resetting when you navigate to another film.
  const [country, setCountry] = useState('')

  useEffect(() => {
    // Clicking through two films quickly can land the responses out of order,
    // so a superseded request is not allowed to write its results.
    let current = true

    async function fetchMovie() {
      setLoading(true)
      setError('')

      try {
        const request = await fetch(`${API_URL}/movies/${id}`)
        const data = await request.json()
        if (!current) return

        // A missing film and a broken server read differently to the visitor,
        // so the status is kept rather than collapsed into one failure.
        if (!request.ok) {
          setError(request.status === 404 ? 'missing' : 'failed')
          return
        }

        setMovie(data.message)
      } catch {
        if (current) setError('failed')
      } finally {
        if (current) setLoading(false)
      }
    }
    fetchMovie()

    return () => {
      current = false
    }
  }, [id])

  // Router keeps the scroll offset across a navigation, so arriving from the
  // bottom of the grid would otherwise drop you halfway down this page.
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [id])

  if (loading) return <Skeleton />
  if (error || !movie) return <Failure kind={error} />

  const year = movie.release_date?.slice(0, 4)
  const runtime = movie.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : null
  const director = movie.credits?.crew?.find((person) => person.job === 'Director')
  const cast = movie.credits?.cast?.slice(0, 12) ?? []
  const trailer = movie.videos?.results?.find(
    (video) => video.site === 'YouTube' && video.type === 'Trailer',
  )

  // A hand-picked country only holds while the next film is also sold there,
  // so the fallback chain runs on every render rather than being stored.
  const byCountry = movie['watch/providers']?.results ?? {}
  const countries = Object.keys(byCountry).sort()
  const activeCountry = [country, browserCountry(), 'US', countries[0]].find((code) =>
    countries.includes(code),
  )
  const watch = byCountry[activeCountry]
  const watchGroups = WATCH_GROUPS.filter(([key]) => watch?.[key]?.length)

  const facts = [
    ['Status', movie.status],
    ['Original title', movie.original_title !== movie.title ? movie.original_title : null],
    ['Released', movie.release_date],
    ['Budget', movie.budget > 0 ? money.format(movie.budget) : null],
    ['Revenue', movie.revenue > 0 ? money.format(movie.revenue) : null],
    ['Director', director?.name],
    ['Studio', movie.production_companies?.[0]?.name],
    ['Votes', movie.vote_count ? movie.vote_count.toLocaleString() : null],
  ].filter(([, value]) => value)

  return (
    <>
      {/* The backdrop is decoration behind the title block, not content, so it
          is dimmed under a flat panel instead of being shown at full strength. */}
      <section className="relative overflow-hidden bg-[#201E1D]">
        {movie.backdrop_path && (
          <img
            src={`https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover opacity-25"
          />
        )}

        <div className="shell relative py-[36px] md:py-[52px]">
          <Link
            to="/"
            className="font-archivo text-[11px] font-extrabold tracking-[0.08em] text-[#F5F2F0] uppercase transition-colors duration-200 hover:text-[#EC3013]"
          >
            &larr; Back to browse
          </Link>

          <article className="mt-[26px] flex flex-col gap-[26px] md:flex-row md:gap-[36px]">
            <figure className="w-[160px] shrink-0 self-start bg-[#3A3735] md:w-[240px]">
              {movie.poster_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="w-full object-cover"
                />
              ) : (
                <span className="font-archivo flex aspect-[2/3] items-center justify-center text-[11px] text-[#8A8580]">
                  No poster
                </span>
              )}
            </figure>

            <div className="min-w-0 flex-1">
              <h1 className="font-archivo text-[30px] leading-[1.05] font-extrabold tracking-[-0.02em] text-[#F5F2F0] md:text-[46px]">
                {movie.title}
              </h1>

              {movie.tagline && (
                <p className="font-archivo mt-[10px] text-[14px] text-[#EC3013] italic md:text-[16px]">
                  {movie.tagline}
                </p>
              )}

              <div className="font-archivo mt-[18px] flex flex-wrap items-center gap-[10px] text-[12px] font-extrabold tracking-[0.08em] text-[#F5F2F0]/70 uppercase">
                <span className="bg-[#EC3013] px-[8px] py-[4px] text-[#F5F2F0]">
                  {movie.vote_average?.toFixed(1)}
                </span>
                {[year, runtime, movie.original_language].filter(Boolean).map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>

              {movie.genres?.length > 0 && (
                <ul className="mt-[16px] flex flex-wrap gap-[8px]">
                  {movie.genres.map((element) => (
                    <li
                      key={element.id}
                      className="font-archivo border border-solid border-[#F5F2F0]/40 px-[10px] py-[5px] text-[11px] font-extrabold tracking-[0.08em] text-[#F5F2F0] uppercase"
                    >
                      {element.name}
                    </li>
                  ))}
                </ul>
              )}

              {trailer && (
                <a
                  href={`https://www.youtube.com/watch?v=${trailer.key}`}
                  target="_blank"
                  rel="noreferrer"
                  className="font-archivo mt-[24px] inline-block bg-[#EC3013] px-[22px] py-[14px] text-[12px] font-extrabold tracking-[0.08em] text-[#F5F2F0] uppercase transition-colors duration-200 hover:bg-[#F5F2F0] hover:text-[#EC3013]"
                >
                  Watch trailer
                </a>
              )}
            </div>
          </article>
        </div>
      </section>

      <section className="shell pt-[44px] pb-[60px] md:pb-[80px]">
        {movie.overview && (
          <article className="max-w-[720px]">
            <h2 className="font-archivo text-[11px] font-extrabold tracking-[0.08em] text-[#EC3013] uppercase">
              Overview
            </h2>
            <p className="font-archivo mt-[12px] text-[15px] leading-[1.6] text-[#201E1D] md:text-[17px]">
              {movie.overview}
            </p>
          </article>
        )}

        {countries.length > 0 && (
          <article className="mt-[46px]">
            <div className="flex flex-wrap items-center justify-between gap-[14px] border-b border-solid border-[#201E1D] pb-[14px]">
              <h2 className="font-archivo text-[11px] font-extrabold tracking-[0.08em] text-[#EC3013] uppercase">
                Where to watch
              </h2>

              <label className="flex items-center gap-[10px]">
                <span className="font-archivo text-[11px] font-extrabold tracking-[0.08em] text-[#8A8580] uppercase">
                  Country
                </span>

                <span className="relative inline-block">
                  <select
                    value={activeCountry}
                    onChange={(event) => setCountry(event.currentTarget.value)}
                    className="font-archivo h-[34px] cursor-pointer appearance-none border border-solid border-[#201E1D] bg-transparent pr-[34px] pl-[12px] text-[11px] font-extrabold tracking-[0.08em] text-[#201E1D] uppercase transition-colors duration-200 hover:border-[#EC3013] hover:text-[#EC3013] focus:border-[#EC3013] focus:outline-none"
                  >
                    {countries.map((code) => (
                      <option key={code} value={code}>
                        {countryName(code)}
                      </option>
                    ))}
                  </select>

                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    className="pointer-events-none absolute top-1/2 right-[12px] -translate-y-1/2 text-[#201E1D]"
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </span>
              </label>
            </div>

            {watchGroups.length > 0 ? (
              <div className="mt-[24px] flex flex-col gap-[22px]">
                {watchGroups.map(([key, label]) => (
                  <div key={key}>
                    <h3 className="font-archivo text-[11px] font-extrabold tracking-[0.08em] text-[#8A8580] uppercase">
                      {label}
                    </h3>

                    <ul className="mt-[12px] flex flex-wrap gap-[10px]">
                      {watch[key].map((provider) => (
                        <li key={provider.provider_id}>
                          <a
                            href={watchLink(provider, movie.title, watch.link)}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-[10px] border border-solid border-[#201E1D]/15 py-[8px] pr-[14px] pl-[8px] transition-colors duration-200 hover:border-[#EC3013]"
                          >
                            <img
                              src={`https://image.tmdb.org/t/p/w92${provider.logo_path}`}
                              alt=""
                              aria-hidden="true"
                              loading="lazy"
                              className="h-[32px] w-[32px] shrink-0 object-cover"
                            />
                            <span className="font-archivo text-[13px] font-extrabold text-[#201E1D]">
                              {provider.provider_name}
                            </span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ) : (
              <p className="font-archivo mt-[20px] text-[14px] text-[#5C5854]">
                No sources listed for {countryName(activeCountry)}. Try another country.
              </p>
            )}

            {/* TMDB's terms require the streaming data to be credited to
                JustWatch anywhere it is displayed. */}
            <p className="font-archivo mt-[20px] text-[12px] text-[#8A8580]">
              Streaming data provided by JustWatch. Links open this film on the provider's own
              site.
            </p>
          </article>
        )}

        {cast.length > 0 && (
          <article className="mt-[46px]">
            <h2 className="font-archivo border-b border-solid border-[#201E1D] pb-[14px] text-[11px] font-extrabold tracking-[0.08em] text-[#EC3013] uppercase">
              Cast
            </h2>
            <ul className="mt-[24px] grid grid-cols-3 gap-x-[18px] gap-y-[26px] sm:grid-cols-4 lg:grid-cols-6">
              {cast.map((person) => (
                <li key={person.id}>
                  <figure className="aspect-[2/3] w-full overflow-hidden bg-[#E3DED9]">
                    {person.profile_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w185${person.profile_path}`}
                        alt={person.name}
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="font-archivo flex h-full items-center justify-center px-[8px] text-center text-[11px] text-[#8A8580]">
                        No photo
                      </span>
                    )}
                  </figure>
                  <p className="font-archivo mt-[10px] text-[13px] leading-[1.2] font-extrabold text-[#201E1D]">
                    {person.name}
                  </p>
                  <p className="font-archivo mt-[3px] text-[12px] leading-[1.3] text-[#8A8580]">
                    {person.character}
                  </p>
                </li>
              ))}
            </ul>
          </article>
        )}

        {facts.length > 0 && (
          <article className="mt-[46px]">
            <h2 className="font-archivo border-b border-solid border-[#201E1D] pb-[14px] text-[11px] font-extrabold tracking-[0.08em] text-[#EC3013] uppercase">
              Details
            </h2>
            <dl className="mt-[8px]">
              {facts.map(([label, value]) => (
                <div
                  key={label}
                  className="flex justify-between gap-[18px] border-b border-solid border-[#201E1D]/12 py-[13px]"
                >
                  <dt className="font-archivo text-[11px] font-extrabold tracking-[0.08em] text-[#8A8580] uppercase">
                    {label}
                  </dt>
                  <dd className="font-archivo text-right text-[14px] text-[#201E1D]">{value}</dd>
                </div>
              ))}
            </dl>
          </article>
        )}
      </section>
    </>
  )
}

// The placeholders hold the same shape the loaded page takes, so the layout
// does not jump once the request lands.
function Skeleton() {
  return (
    <section className="bg-[#201E1D]">
      <div className="shell py-[36px] md:py-[52px]">
        <article className="mt-[26px] flex animate-pulse flex-col gap-[26px] md:flex-row md:gap-[36px]">
          <div className="aspect-[2/3] w-[160px] shrink-0 bg-[#3A3735] md:w-[240px]" />
          <div className="flex-1 pt-[6px]">
            <div className="h-[38px] w-[70%] bg-[#3A3735]" />
            <div className="mt-[16px] h-[16px] w-[40%] bg-[#3A3735]" />
            <div className="mt-[26px] h-[14px] w-full bg-[#3A3735]" />
            <div className="mt-[10px] h-[14px] w-[85%] bg-[#3A3735]" />
          </div>
        </article>
      </div>
    </section>
  )
}

function Failure({ kind }) {
  return (
    <section className="shell pt-[60px] pb-[80px]">
      <article className="border border-solid border-[#201E1D]/15 px-[24px] py-[70px] text-center">
        <p className="font-archivo text-[18px] font-extrabold text-[#201E1D]">
          {kind === 'missing' ? 'No such film' : 'That did not load'}
        </p>
        <p className="font-archivo mt-[8px] text-[14px] text-[#5C5854]">
          {kind === 'missing'
            ? 'The id in this address does not match anything in the catalogue.'
            : 'The request did not go through. Try again in a moment.'}
        </p>
        <Link
          to="/"
          className="font-archivo mt-[26px] inline-block bg-[#201E1D] px-[22px] py-[13px] text-[12px] font-extrabold tracking-[0.08em] text-[#F5F2F0] uppercase transition-colors duration-200 hover:bg-[#EC3013]"
        >
          Back to browse
        </Link>
      </article>
    </section>
  )
}
