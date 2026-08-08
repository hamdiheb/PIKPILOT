export default function Moviecomponent(props) {
  const { title, original_language, overview, poster_path, release_date, vote_average, id } = props

  return (
    <article id={id} className="group flex cursor-pointer flex-col">
      <figure className="relative aspect-[2/3] w-full overflow-hidden bg-[#E3DED9]">
        {poster_path ? (
          <img
            src={`https://image.tmdb.org/t/p/w500${poster_path}`}
            alt={title}
            loading="lazy"
            className="h-full w-full object-cover transition-opacity duration-200 group-hover:opacity-85"
          />
        ) : (
          <span className="font-archivo absolute inset-0 flex items-center justify-center px-[10px] text-center text-[11px] text-[#8A8580]">
            No poster
          </span>
        )}

        <span className="font-archivo absolute top-0 left-0 bg-[#EC3013] px-[8px] py-[4px] text-[12px] font-extrabold text-[#F5F2F0]">
          {vote_average?.toFixed(1)}
        </span>

        <span className="font-archivo absolute right-0 bottom-0 bg-[#201E1D] px-[7px] py-[3px] text-[10px] font-extrabold tracking-[0.08em] text-[#F5F2F0] uppercase">
          {original_language}
        </span>
      </figure>

      <h3 className="font-archivo mt-[12px] text-[15px] font-extrabold leading-[1.15] tracking-[-0.01em] text-[#201E1D] transition-colors duration-200 group-hover:text-[#EC3013] md:text-[17px]">
        {title}
      </h3>

      <span className="font-archivo mt-[4px] text-[12px] text-[#8A8580]">
        {release_date?.slice(0, 4)}
      </span>

      <p className="font-archivo mt-[8px] line-clamp-3 text-[13px] leading-[1.45] text-[#5C5854]">
        {overview}
      </p>
    </article>
  )
}
