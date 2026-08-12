import { useEffect, useRef, useState } from 'react'
import FoldText from './UI/FoldText'
import Moviecomponent from './Moviecomponent'
import { API_URL } from '../src/api'

export default function Hero() {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [note, setNote] = useState('')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')

  // The suggestions sit on one scrolling row. The arrows are driven from the
  // rail's own scroll position rather than an index, so a swipe, a trackpad and
  // a button press all stay in agreement about where the row is.
  const railRef = useRef(null)
  const [rail, setRail] = useState({ atStart: true, atEnd: true })

  function measureRail() {
    const element = railRef.current
    if (!element) return

    const furthest = element.scrollWidth - element.clientWidth
    setRail({
      atStart: element.scrollLeft <= 1,
      // A whole row that already fits leaves nothing to scroll, which reads as
      // being at both ends at once and disables both arrows.
      atEnd: element.scrollLeft >= furthest - 1,
    })
  }

  // Runs when a new set of suggestions replaces the last, since the row can go
  // from overflowing to fitting without ever being scrolled.
  useEffect(measureRail, [suggestions])

  function scrollRail(direction) {
    const element = railRef.current
    if (!element) return

    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    element.scrollBy({
      left: direction * element.clientWidth * 0.9,
      behavior: reduceMotion ? 'auto' : 'smooth',
    })
  }

  async function renderInput() {
    if (!query.trim() || pending) return

    setPending(true)
    setError('')
    setNote('')
    setSuggestions([])

    try {
      const res = await fetch(`${API_URL}/suggestion`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      })

      const data = await res.json()

      // Every refusal from this API is JSON with a message field — a 429 from
      // the rate limiter, a 400 for an empty query. Without this check they
      // would all be rendered as though the model had said them.
      if (!res.ok) {
        setError(
          typeof data.message === 'string' ? data.message : 'That request did not go through.',
        )
        return
      }

      setSuggestions(data.message?.movies ?? [])
      setNote(data.message?.text ?? '')
      // Only on success: a failed request that clears the box makes the visitor
      // retype the phrase they wanted to retry.
      setQuery('')
    } catch {
      setError('That request did not go through. Try again.')
    } finally {
      setPending(false)
    }
  }

  return (
    <section className="bg-[#EC3013]">
      <div className="shell py-[60px] md:py-[80px]">
        <FoldText
          splitBy="word"
          fontSize="clamp(38px, 9vw, 80px)"
          color="#F5F2F0"
          className="max-w-[680px]"
        />
        <p className="font-archivo mt-[22px] max-w-[580px] text-[15px] leading-[1.45] text-[#F5F2F0] md:text-[17px]">
          Describe a mood, an actor, a decade, a plot. "Gritty korean thrillers." "Tom Hardy, 2010s,
          action."
        </p>
        <article className="mt-[28px] flex gap-[8px]">
          <input
            type="text"
            placeholder="Search by mood, actor, plot, genre..."
            name="search_ai"
            value={query}
            className="font-archivo h-[52px] min-w-0 flex-1 bg-[#F5F2F0] px-[16px] text-[15px] text-[#201E1D] placeholder:text-[#8A8580] focus:outline-none"
            onChange={(event) => {
              setQuery(event.target.value)
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter') renderInput()
            }}
          />
          <button
            disabled={pending}
            className="font-archivo h-[52px] shrink-0 cursor-pointer bg-[#201E1D] px-[26px] text-[12px] font-extrabold tracking-[0.08em] text-[#F5F2F0] uppercase transition-colors duration-200 hover:bg-[#F5F2F0] hover:text-[#EC3013] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F5F2F0] disabled:cursor-wait disabled:opacity-70"
            onClick={renderInput}
          >
            {pending ? 'Asking...' : 'Ask AI'}
          </button>
        </article>

        {(pending || suggestions.length > 0 || note || error) && (
          <article className="mt-[20px] border border-solid border-[#F5F2F0] bg-[#F5F2F0] p-[18px] md:p-[22px]">
            <div className="flex items-center justify-between gap-[14px]">
              <span className="font-archivo text-[11px] font-extrabold tracking-[0.08em] text-[#EC3013] uppercase">
                {error ? 'Something went wrong' : 'AI suggestion'}
              </span>

              {suggestions.length > 0 && !pending && !error && (
                <div className="flex gap-[8px]">
                  <Railbutton
                    label="Previous suggestions"
                    disabled={rail.atStart}
                    onClick={() => scrollRail(-1)}
                  >
                    &larr;
                  </Railbutton>
                  <Railbutton
                    label="More suggestions"
                    disabled={rail.atEnd}
                    onClick={() => scrollRail(1)}
                  >
                    &rarr;
                  </Railbutton>
                </div>
              )}
            </div>

            {/* The model returns titles; the cards are TMDB's own records, so a
                suggestion behaves exactly like a card from the grid below and
                opens the same detail page.

                One row that scrolls sideways rather than a grid: the row keeps
                the suggestions visually separate from the catalogue grid under
                it, and a native overflow scroller gives swipe, trackpad and
                keyboard behaviour without any of it being reimplemented. */}
            {suggestions.length > 0 && !pending && !error ? (
              <div
                ref={railRef}
                onScroll={measureRail}
                className="mt-[18px] flex snap-x snap-mandatory gap-[18px] overflow-x-auto pb-[4px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                {suggestions.map((movie) => (
                  <div key={movie.id} className="w-[150px] shrink-0 snap-start sm:w-[180px]">
                    <Moviecomponent
                      title={movie.title}
                      original_language={movie.original_language}
                      overview={movie.overview}
                      poster_path={movie.poster_path}
                      release_date={movie.release_date}
                      vote_average={movie.vote_average}
                      id={movie.id}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p className="font-archivo mt-[10px] max-w-[680px] text-[14px] leading-[1.55] whitespace-pre-line text-[#201E1D] md:text-[15px]">
                {error ||
                  (pending
                    ? 'Thinking it over...'
                    : note || 'Nothing came back for that. Try describing it differently.')}
              </p>
            )}
          </article>
        )}
      </div>
    </section>
  )
}

// Square, bordered and uppercase like the pagination under the grid, so the two
// sets of controls on the page read as the same control.
function Railbutton({ label, disabled, onClick, children }) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={`font-archivo flex h-[30px] w-[30px] items-center justify-center border border-solid text-[14px] font-extrabold transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#EC3013] ${
        disabled
          ? 'cursor-not-allowed border-[#D6D0CA] text-[#B8B2AC]'
          : 'cursor-pointer border-[#201E1D] text-[#201E1D] hover:border-[#EC3013] hover:bg-[#EC3013] hover:text-[#F5F2F0]'
      }`}
    >
      {children}
    </button>
  )
}
