// Dark bar to close the page: the body is cream and the hero is red, so ending
// on #201E1D gives the layout a floor instead of trailing off into whitespace.
// It also carries the attribution TMDB's terms ask for, which has to appear
// wherever their data is shown and had nowhere to live until now.
export default function Footer() {
  return (
    <footer className="bg-[#201E1D]">
      <section className="shell flex flex-col gap-[18px] py-[32px] md:flex-row md:items-center md:justify-between md:py-[26px]">
        <p className="font-archivo text-[13px] font-extrabold tracking-[0.08em] text-[#F5F2F0] uppercase">
          Developed by <span className="text-[#EC3013]">Iheb Hamdi</span>
        </p>

        <p className="font-archivo max-w-[420px] text-[12px] leading-[1.5] text-[#8A8580]">
          &copy; {new Date().getFullYear()} PikPilot. This product uses the TMDB API but is not
          endorsed or certified by TMDB.
        </p>
      </section>
    </footer>
  )
}
