import { Link } from 'react-router-dom'
import Card from '../components/UI/Notfoundcomponent'
// Netlify now answers every address with index.html so the router can read the
// path itself. That also means a mistyped address reaches the app instead of
// the host's 404 page, and without this route it would render as an empty page
// under the navbar.
export default function Notfound() {
  return (
    <section className="shell pt-[60px] pb-[80px]">
      <article className="border border-solid border-[#201E1D]/15 px-[24px] py-[70px] text-center">
        <Card />
        <p className="font-archivo text-[18px] font-extrabold text-[#201E1D]">
          There is nothing at this address
        </p>
        <p className="font-archivo mt-[8px] text-[14px] text-[#5C5854]">
          The link may be out of date, or the address may have a typo in it.
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
