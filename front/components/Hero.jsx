export default function Hero() {
  return (
    <section className="bg-[#EC3013] px-[6%] py-[60px] md:px-[16%] md:py-[80px]">
      <h1 className="font-archivo max-w-[640px] text-[44px] font-extrabold leading-[0.95] tracking-[-0.02em] text-[#F5F2F0] md:text-[80px]">
        What do you want to watch?
      </h1>
      <p className="font-archivo mt-[22px] max-w-[580px] text-[15px] leading-[1.45] text-[#F5F2F0] md:text-[17px]">
        Describe a mood, an actor, a decade, a plot. "Gritty korean thrillers." "Tom Hardy, 2010s,
        action."
      </p>
      <article className="mt-[28px] flex max-w-[1080px] gap-[8px]">
        <input
          type="text"
          placeholder="Search by mood, actor, plot, genre..."
          name="search_ai"
          className="font-archivo h-[52px] min-w-0 flex-1 bg-[#F1F1F1] px-[16px] text-[15px] text-[#201E1D] placeholder:text-[#8A8580] focus:outline-none"
        />
        <button className="font-archivo h-[52px] shrink-0 bg-white px-[26px] text-[14px] font-extrabold text-[#EC3013]">
          Ask AI
        </button>
      </article>
    </section>
  )
}
