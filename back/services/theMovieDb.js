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

    const request = await fetch(
      `${baseUrl}/discover/movie?page=${page}${genre ? `&with_genres=${genre}` : ''}`,
      {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    )

    if (!request.ok) {
      throw new Error(`TMDB responded ${request.status} ${request.statusText}`)
    }

    const response = await request.json()
    return res.status(200).json({ message: response })
  } catch (error) {
    console.error('TMDB request failed:', error.message)
    return res.status(500).json({ message: 'Could not fetch movies' })
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
