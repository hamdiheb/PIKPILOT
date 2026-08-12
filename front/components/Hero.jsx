import { useState } from 'react'
import FoldText from './UI/FoldText'
import { API_URL } from '../src/api'

export default function Hero() {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState('')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')

  async function renderInput() {
    if (!query.trim() || pending) return

    setPending(true)
    setError('')

    try {
      const res = await fetch(`${API_URL}/suggestion`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      })

      const data = await res.json()
      setSuggestions(data.message)
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

        {(pending || suggestions || error) && (
          <article className="mt-[20px] max-w-[820px] border border-solid border-[#F5F2F0] bg-[#F5F2F0] p-[18px] md:p-[22px]">
            <span className="font-archivo text-[11px] font-extrabold tracking-[0.08em] text-[#EC3013] uppercase">
              {error ? 'Something went wrong' : 'AI suggestion'}
            </span>
            <p className="font-archivo mt-[10px] text-[14px] leading-[1.55] whitespace-pre-line text-[#201E1D] md:text-[15px]">
              {error || (pending ? 'Thinking it over...' : suggestions)}
            </p>
          </article>
        )}
      </div>
    </section>
  )
}
