// TMDB's watch/providers payload names each service but gives no URL for it —
// the only link in the response is one TMDB watch page per country, which is
// what a visitor lands on if nothing here matches. The real per-title deep
// links belong to JustWatch and are not exposed through TMDB's API, so the
// closest we can get is the film searched on the provider's own site.
//
// Every path below was checked against the live sites; the ids come from
// TMDB's /watch/providers/movie list, where one service often holds several
// (Netflix alone has three, for its kids and ad tiers).

const netflix = (query) => `https://www.netflix.com/search?q=${query}`
const amazon = (query) => `https://www.amazon.com/s?k=${query}&i=instant-video`
const apple = (query) => `https://tv.apple.com/search?term=${query}`
const youtube = (query) => `https://www.youtube.com/results?search_query=${query}`
const disney = (query) => `https://www.disneyplus.com/browse/search?q=${query}`
const paramount = (query) => `https://www.paramountplus.com/search/?q=${query}`
const peacock = (query) => `https://www.peacocktv.com/search?q=${query}`

const BY_PROVIDER_ID = {
  2: apple, // Apple TV Store
  3: (query) => `https://play.google.com/store/search?q=${query}&c=movies`,
  8: netflix,
  9: amazon, // Amazon Prime Video
  10: amazon, // Amazon Video, the rent and buy storefront
  11: (query) => `https://mubi.com/en/search/films?query=${query}`,
  15: (query) => `https://www.hulu.com/search?q=${query}`,
  43: (query) => `https://www.starz.com/us/en/search?q=${query}`,
  73: (query) => `https://tubitv.com/search/${query}`,
  119: amazon,
  122: disney,
  175: netflix,
  188: youtube,
  192: youtube,
  235: youtube,
  283: (query) => `https://www.crunchyroll.com/search?q=${query}`,
  300: (query) => `https://pluto.tv/en/search?query=${query}`,
  337: disney,
  350: apple,
  386: peacock,
  387: peacock,
  531: paramount,
  538: (query) => `https://watch.plex.tv/search?q=${query}`,
  1715: (query) => `https://shahid.mbc.net/en/search?q=${query}`,
  1796: netflix,
  1899: (query) => `https://play.max.com/search?q=${query}`,
  2303: paramount,
  2304: paramount,
  2616: paramount,
}

// Hundreds of the 800 providers are add-on channels billed through a storefront
// — "Shudder Amazon Channel", "Starz Apple TV Channel" — and they all resolve on
// that storefront. Matching the suffix covers them without listing every id.
function byName(name) {
  const clean = name.trim()
  if (clean.endsWith('Amazon Channel')) return amazon
  if (clean.endsWith('Apple TV Channel')) return apple
  return null
}

export function watchLink(provider, title, fallback) {
  const build = BY_PROVIDER_ID[provider.provider_id] ?? byName(provider.provider_name)
  return build ? build(encodeURIComponent(title)) : fallback
}
