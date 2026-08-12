// Read at call time, not module load time: ES imports are evaluated before the
// statements that load .env, so module-level reads would capture undefined.
const config = () => ({ baseUrl: process.env.TMDB_URL_BASE, token: process.env.TMDB_TOKEN })

export async function moviesDatabase(req, res) {
  try {
    const { baseUrl, token } = config()
    const page = Math.min(Math.max(parseInt(req.query.page) || 1, 1), 500)
    // with_genres takes comma-separated TMDB ids, so anything that is not digits
    // and commas is dropped instead of being interpolated into the URL.
    const genre = /^[\d,]+$/.test(req.query.genre ?? '') ? req.query.genre : ''
    const search = (req.query.search ?? '').trim()

    // TMDB splits the two jobs across two endpoints: /search/movie matches a
    // title but ignores with_genres, /discover/movie filters by genre but takes
    // no title query. A search term therefore decides which one we hit.
    const url = search
      ? `${baseUrl}/search/movie?query=${encodeURIComponent(search)}&page=${page}`
      : `${baseUrl}/discover/movie?page=${page}${genre ? `&with_genres=${genre}` : ''}`

    const request = await fetch(url, {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })

    if (!request.ok) {
      throw new Error(`TMDB responded ${request.status} ${request.statusText}`)
    }

    const response = await request.json()

    // /search/movie ignored with_genres above, so a genre picked alongside a
    // search term has to be applied here, over the page TMDB sent back.
    if (search && genre) {
      const ids = genre.split(',').map(Number)
      response.results = response.results.filter((movie) =>
        ids.every((id) => movie.genre_ids.includes(id)),
      )
    }

    return res.status(200).json({ message: response })
  } catch (error) {
    console.error('TMDB request failed:', error.message)
    return res.status(500).json({ message: 'Could not fetch movies' })
  }
}

// The AI route gets bare titles back from the model and needs the real record
// behind each one — the id above all, since that is what the card links to.
// Not a request handler: it is called server-side, one call per suggestion.
export async function findMovieByTitle(title, year) {
  const { baseUrl, token } = config()

  const params = new URLSearchParams({ query: title })
  if (year) params.set('primary_release_year', String(year))

  const request = await fetch(`${baseUrl}/search/movie?${params}`, {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  if (!request.ok) return null

  const response = await request.json()
  const first = response.results?.[0]

  // Models are confident about titles and vague about years, so a year that
  // matches nothing is dropped rather than allowed to lose the film.
  if (!first && year) return findMovieByTitle(title, null)

  return first ?? null
}

export async function movieDetails(req, res) {
  try {
    const { baseUrl, token } = config()

    // The id lands in the TMDB path itself, so anything that is not digits is
    // refused here rather than being interpolated into the URL.
    const { id } = req.params
    if (!/^\d+$/.test(id)) {
      return res.status(400).json({ message: 'Invalid movie id' })
    }

    // The detail view needs the cast, the trailer and the streaming sources
    // alongside the film itself. append_to_response folds all four into one
    // upstream call instead of the four round trips separate /credits, /videos
    // and /watch/providers fetches would cost. The slash in "watch/providers"
    // is part of the key TMDB expects, and is also the key it answers with.
    const url = `${baseUrl}/movie/${id}?append_to_response=credits,videos,watch/providers`

    const request = await fetch(url, {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })

    // A hand-edited URL is a normal thing for a browser to send, not a server
    // fault, so a missing film keeps its own status instead of being flattened
    // into the 500 below.
    if (request.status === 404) {
      return res.status(404).json({ message: 'Movie not found' })
    }

    if (!request.ok) {
      throw new Error(`TMDB responded ${request.status} ${request.statusText}`)
    }

    const response = await request.json()
    return res.status(200).json({ message: response })
  } catch (error) {
    console.error('TMDB request failed:', error.message)
    return res.status(500).json({ message: 'Could not fetch movie' })
  }
}

export async function genreList(req, res) {
  try {
    const { baseUrl, token } = config()
    const request = await fetch(`${baseUrl}/genre/movie/list`, {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    if (!request.ok) {
      throw new Error(`TMDB responded ${request.status} ${request.statusText}`)
    }
    const response = await request.json()
    return res.status(200).json({ message: response })
  } catch (error) {
    console.error('TMDB request failed:', error.message)
    return res.status(500).json({ message: 'Could not fetch list' })
  }
}
