import { useState } from 'react'
import FoldText from './UI/FoldText'
import { API_URL } from '../src/api'
export default function Hero() {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState('')

  async function renderInput() {
    if (!query.trim()) return

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
    console.log(data.message)
  }
  return (
    <section className="bg-[#EC3013] px-[6%] py-[60px] md:px-[16%] md:py-[80px]">
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
      <article className="mt-[28px] flex max-w-[1080px] gap-[8px]">
        <input
          type="text"
          placeholder="Search by mood, actor, plot, genre..."
          name="search_ai"
          value={query}
          className="font-archivo h-[52px] min-w-0 flex-1 bg-[#F5F2F0] px-[16px] text-[15px] text-[#201E1D] placeholder:text-[#8A8580] focus:outline-none"
          onChange={(event) => {
            setQuery(event.target.value)
          }}
        />
        <button
          className="font-archivo h-[52px] shrink-0 cursor-pointer bg-[#201E1D] px-[26px] text-[12px] font-extrabold tracking-[0.08em] text-[#F5F2F0] uppercase transition-colors duration-200 hover:bg-[#F5F2F0] hover:text-[#EC3013]"
          onClick={renderInput}
        >
          Ask AI
        </button>
      </article>
    </section>
  )
}
